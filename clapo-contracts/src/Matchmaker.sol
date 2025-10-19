// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./AssetRegistry.sol";
import "./NFTVault.sol";
import "./IPythOracle.sol";
import "./GameMath.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title Matchmaker
 * @notice Core contract managing match lifecycle for Clapo Game
 * @dev Handles match creation, commit-reveal, and settlement
 */
contract Matchmaker is ReentrancyGuard {
    using GameMath for *;

    enum MatchState {
        Created,      // Match created, waiting for player 2
        Committed,    // Both players committed
        Started,      // Match started, prices locked
        Ended,        // Match ended, ready for settlement
        Settled       // Match settled, winner determined
    }

    struct PlayerCommit {
        address player;
        address nftContract;
        uint256 nftTokenId;
        bytes32 commitHash;
        bool hasCommitted;
        bool hasRevealed;
    }

    struct PlayerPicks {
        bytes32[] assets;           // 7 asset symbols
        GameMath.Role[] roles;      // Corresponding roles
        int64[] startPrices;        // Starting prices
        int64[] endPrices;          // Ending prices
        int256 totalScore;          // Final score
    }

    struct Match {
        uint256 matchId;
        MatchState state;
        PlayerCommit player1;
        PlayerCommit player2;
        PlayerPicks player1Picks;
        PlayerPicks player2Picks;
        uint256 startTime;
        uint256 endTime;
        address winner;             // Address(0) for tie
        uint256 createdAt;
    }

    AssetRegistry public assetRegistry;
    NFTVault public nftVault;
    IPythOracle public pythOracle;

    uint256 public matchCounter;
    uint256 public constant MATCH_DURATION = 120; // 120 seconds
    uint256 public constant MAX_PRICE_STALENESS = 5; // 5 seconds

    mapping(uint256 => Match) public matches;
    mapping(address => uint256) public playerActiveMatch;

    event MatchCreated(uint256 indexed matchId, address indexed player1);
    event MatchJoined(uint256 indexed matchId, address indexed player2);
    event MatchStarted(uint256 indexed matchId, uint256 startTime);
    event PicksRevealed(uint256 indexed matchId, address indexed player);
    event MatchSettled(uint256 indexed matchId, address indexed winner, int256 score1, int256 score2);
    event MatchCancelled(uint256 indexed matchId);

    constructor(address _assetRegistry, address _nftVault, address _pythOracle) {
        require(_assetRegistry != address(0), "Invalid registry");
        require(_nftVault != address(0), "Invalid vault");
        require(_pythOracle != address(0), "Invalid oracle");

        assetRegistry = AssetRegistry(_assetRegistry);
        nftVault = NFTVault(_nftVault);
        pythOracle = IPythOracle(_pythOracle);
    }

    /**
     * @notice Create a new match
     * @param nftContract NFT contract address
     * @param nftTokenId NFT token ID to stake
     * @param commitHash Commitment hash (keccak256(picks, roles, salt))
     */
    function createMatch(
        address nftContract,
        uint256 nftTokenId,
        bytes32 commitHash
    ) external nonReentrant returns (uint256 matchId) {
        require(playerActiveMatch[msg.sender] == 0, "Already in a match");
        require(commitHash != bytes32(0), "Invalid commit");

        matchId = ++matchCounter;

        // Stake NFT
        nftVault.stakeNFT(nftContract, nftTokenId, msg.sender, matchId);

        // Create match
        Match storage m = matches[matchId];
        m.matchId = matchId;
        m.state = MatchState.Created;
        m.player1 = PlayerCommit({
            player: msg.sender,
            nftContract: nftContract,
            nftTokenId: nftTokenId,
            commitHash: commitHash,
            hasCommitted: true,
            hasRevealed: false
        });
        m.createdAt = block.timestamp;

        playerActiveMatch[msg.sender] = matchId;

        emit MatchCreated(matchId, msg.sender);
    }

    /**
     * @notice Join an existing match
     * @param matchId Match ID to join
     * @param nftContract NFT contract address
     * @param nftTokenId NFT token ID to stake
     * @param commitHash Commitment hash
     */
    function joinMatch(
        uint256 matchId,
        address nftContract,
        uint256 nftTokenId,
        bytes32 commitHash
    ) external nonReentrant {
        require(playerActiveMatch[msg.sender] == 0, "Already in a match");
        require(commitHash != bytes32(0), "Invalid commit");

        Match storage m = matches[matchId];
        require(m.state == MatchState.Created, "Match not available");
        require(m.player1.player != msg.sender, "Cannot play yourself");

        // Stake NFT
        nftVault.stakeNFT(nftContract, nftTokenId, msg.sender, matchId);

        // Add player 2
        m.player2 = PlayerCommit({
            player: msg.sender,
            nftContract: nftContract,
            nftTokenId: nftTokenId,
            commitHash: commitHash,
            hasCommitted: true,
            hasRevealed: false
        });
        m.state = MatchState.Committed;

        playerActiveMatch[msg.sender] = matchId;

        emit MatchJoined(matchId, msg.sender);
    }

    /**
     * @notice Start the match (lock in starting prices)
     * @param matchId Match ID
     */
    function startMatch(uint256 matchId) external nonReentrant {
        Match storage m = matches[matchId];
        require(m.state == MatchState.Committed, "Match not ready");
        require(
            msg.sender == m.player1.player || msg.sender == m.player2.player,
            "Not a player"
        );

        m.state = MatchState.Started;
        m.startTime = block.timestamp;
        m.endTime = block.timestamp + MATCH_DURATION;

        emit MatchStarted(matchId, m.startTime);
    }

    /**
     * @notice Reveal picks and settle the match
     * @param matchId Match ID
     * @param assets Array of 7 asset symbols
     * @param roles Array of 7 roles
     * @param salt Random salt used in commitment
     */
    function revealAndSettle(
        uint256 matchId,
        bytes32[] calldata assets,
        GameMath.Role[] calldata roles,
        bytes32 salt
    ) external nonReentrant {
        Match storage m = matches[matchId];
        require(m.state == MatchState.Started, "Match not started");
        require(block.timestamp >= m.endTime, "Match not ended");
        require(
            msg.sender == m.player1.player || msg.sender == m.player2.player,
            "Not a player"
        );

        // Verify commitment
        bytes32 computedHash = keccak256(abi.encodePacked(assets, roles, salt));
        bool isPlayer1 = msg.sender == m.player1.player;

        if (isPlayer1) {
            require(computedHash == m.player1.commitHash, "Invalid reveal");
            require(!m.player1.hasRevealed, "Already revealed");
        } else {
            require(computedHash == m.player2.commitHash, "Invalid reveal");
            require(!m.player2.hasRevealed, "Already revealed");
        }

        // Validate picks
        (bool isValid, uint256 totalCost) = assetRegistry.validatePortfolio(assets);
        require(isValid, "Invalid portfolio");
        require(GameMath.validateRoles(roles), "Invalid roles");

        // Get prices
        int64[] memory startPrices = new int64[](7);
        int64[] memory endPrices = new int64[](7);

        for (uint256 i = 0; i < 7; i++) {
            AssetRegistry.Asset memory asset = assetRegistry.getAsset(assets[i]);

            // Get start price
            IPythOracle.Price memory startPrice = pythOracle.getPriceNoOlderThan(
                asset.pythFeedId,
                MAX_PRICE_STALENESS + MATCH_DURATION + 60
            );
            startPrices[i] = startPrice.price;

            // Get end price
            IPythOracle.Price memory endPrice = pythOracle.getPriceNoOlderThan(
                asset.pythFeedId,
                MAX_PRICE_STALENESS
            );
            endPrices[i] = endPrice.price;
        }

        // Calculate scores
        int256[] memory priceChanges = new int256[](7);
        for (uint256 i = 0; i < 7; i++) {
            priceChanges[i] = GameMath.calculatePriceChange(startPrices[i], endPrices[i]);
        }

        int256 totalScore = GameMath.calculateTotalScore(priceChanges, roles);

        // Store player picks
        if (isPlayer1) {
            m.player1Picks = PlayerPicks({
                assets: assets,
                roles: roles,
                startPrices: startPrices,
                endPrices: endPrices,
                totalScore: totalScore
            });
            m.player1.hasRevealed = true;
        } else {
            m.player2Picks = PlayerPicks({
                assets: assets,
                roles: roles,
                startPrices: startPrices,
                endPrices: endPrices,
                totalScore: totalScore
            });
            m.player2.hasRevealed = true;
        }

        emit PicksRevealed(matchId, msg.sender);

        // If both revealed, settle match
        if (m.player1.hasRevealed && m.player2.hasRevealed) {
            _settleMatch(matchId);
        }
    }

    /**
     * @notice Internal function to settle the match
     * @param matchId Match ID
     */
    function _settleMatch(uint256 matchId) internal {
        Match storage m = matches[matchId];

        uint8 result = GameMath.determineWinner(
            m.player1Picks.totalScore,
            m.player2Picks.totalScore
        );

        m.state = MatchState.Settled;

        if (result == 1) {
            // Player 1 wins
            m.winner = m.player1.player;
            nftVault.releaseNFT(m.player1.player, m.player1.nftContract, m.player1.nftTokenId);
            nftVault.transferToWinner(
                m.player2.player,
                m.player1.player,
                m.player2.nftContract,
                m.player2.nftTokenId
            );
        } else if (result == 2) {
            // Player 2 wins
            m.winner = m.player2.player;
            nftVault.releaseNFT(m.player2.player, m.player2.nftContract, m.player2.nftTokenId);
            nftVault.transferToWinner(
                m.player1.player,
                m.player2.player,
                m.player1.nftContract,
                m.player1.nftTokenId
            );
        } else {
            // Tie - return both NFTs
            m.winner = address(0);
            nftVault.releaseNFT(m.player1.player, m.player1.nftContract, m.player1.nftTokenId);
            nftVault.releaseNFT(m.player2.player, m.player2.nftContract, m.player2.nftTokenId);
        }

        // Clear active matches
        playerActiveMatch[m.player1.player] = 0;
        playerActiveMatch[m.player2.player] = 0;

        emit MatchSettled(matchId, m.winner, m.player1Picks.totalScore, m.player2Picks.totalScore);
    }

    /**
     * @notice Cancel a match that hasn't started yet
     * @param matchId Match ID
     */
    function cancelMatch(uint256 matchId) external nonReentrant {
        Match storage m = matches[matchId];
        require(msg.sender == m.player1.player, "Only creator can cancel");
        require(m.state == MatchState.Created, "Match already started");

        // Return NFT to player 1
        nftVault.releaseNFT(m.player1.player, m.player1.nftContract, m.player1.nftTokenId);

        m.state = MatchState.Settled;
        playerActiveMatch[m.player1.player] = 0;

        emit MatchCancelled(matchId);
    }

    /**
     * @notice Get match details
     * @param matchId Match ID
     * @return Match struct
     */
    function getMatch(uint256 matchId) external view returns (Match memory) {
        return matches[matchId];
    }

    /**
     * @notice Get player's active match ID
     * @param player Player address
     * @return matchId Active match ID (0 if none)
     */
    function getPlayerActiveMatch(address player) external view returns (uint256) {
        return playerActiveMatch[player];
    }
}
