// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title NFTVault
 * @notice Handles NFT escrow for the Clapo Game
 * @dev Securely holds NFTs during matches and transfers them to winners
 */
contract NFTVault is ERC721Holder, Ownable, ReentrancyGuard {
    struct StakedNFT {
        address nftContract;
        uint256 tokenId;
        address owner;
        uint256 matchId;
        bool isStaked;
    }

    // Track staked NFTs: owner => nftContract => tokenId => StakedNFT
    mapping(address => mapping(address => mapping(uint256 => StakedNFT))) public stakedNFTs;

    // Track which NFT contracts are whitelisted
    mapping(address => bool) public whitelistedCollections;

    // Authorized game contracts that can manage stakes
    mapping(address => bool) public authorizedContracts;

    event NFTStaked(
        address indexed owner,
        address indexed nftContract,
        uint256 indexed tokenId,
        uint256 matchId
    );

    event NFTReleased(
        address indexed to,
        address indexed nftContract,
        uint256 indexed tokenId,
        uint256 matchId
    );

    event NFTTransferred(
        address indexed from,
        address indexed to,
        address indexed nftContract,
        uint256 tokenId,
        uint256 matchId
    );

    event CollectionWhitelisted(address indexed nftContract, bool whitelisted);
    event ContractAuthorized(address indexed contractAddress, bool authorized);

    modifier onlyAuthorized() {
        require(
            authorizedContracts[msg.sender] || msg.sender == owner(),
            "Not authorized"
        );
        _;
    }

    constructor() Ownable(msg.sender) {}

    /**
     * @notice Whitelist or delist an NFT collection
     * @param nftContract Address of the NFT contract
     * @param whitelisted Whether to whitelist or delist
     */
    function setWhitelistedCollection(address nftContract, bool whitelisted)
        external
        onlyOwner
    {
        require(nftContract != address(0), "Invalid NFT contract");
        whitelistedCollections[nftContract] = whitelisted;
        emit CollectionWhitelisted(nftContract, whitelisted);
    }

    /**
     * @notice Authorize or deauthorize a game contract
     * @param contractAddress Address of the game contract
     * @param authorized Whether to authorize or deauthorize
     */
    function setAuthorizedContract(address contractAddress, bool authorized)
        external
        onlyOwner
    {
        require(contractAddress != address(0), "Invalid contract address");
        authorizedContracts[contractAddress] = authorized;
        emit ContractAuthorized(contractAddress, authorized);
    }

    /**
     * @notice Stake an NFT for a match
     * @param nftContract Address of the NFT contract
     * @param tokenId Token ID to stake
     * @param owner Original owner of the NFT
     * @param matchId Match ID this NFT is staked for
     */
    function stakeNFT(
        address nftContract,
        uint256 tokenId,
        address owner,
        uint256 matchId
    ) external onlyAuthorized nonReentrant {
        require(whitelistedCollections[nftContract], "Collection not whitelisted");
        require(owner != address(0), "Invalid owner");
        require(!stakedNFTs[owner][nftContract][tokenId].isStaked, "Already staked");

        // Transfer NFT to vault
        IERC721(nftContract).safeTransferFrom(owner, address(this), tokenId);

        // Record stake
        stakedNFTs[owner][nftContract][tokenId] = StakedNFT({
            nftContract: nftContract,
            tokenId: tokenId,
            owner: owner,
            matchId: matchId,
            isStaked: true
        });

        emit NFTStaked(owner, nftContract, tokenId, matchId);
    }

    /**
     * @notice Release NFT back to original owner (draw or cancelled match)
     * @param owner Original owner
     * @param nftContract NFT contract address
     * @param tokenId Token ID
     */
    function releaseNFT(address owner, address nftContract, uint256 tokenId)
        external
        onlyAuthorized
        nonReentrant
    {
        StakedNFT storage stake = stakedNFTs[owner][nftContract][tokenId];
        require(stake.isStaked, "NFT not staked");

        uint256 matchId = stake.matchId;

        // Clear stake record
        delete stakedNFTs[owner][nftContract][tokenId];

        // Return NFT to owner
        IERC721(nftContract).safeTransferFrom(address(this), owner, tokenId);

        emit NFTReleased(owner, nftContract, tokenId, matchId);
    }

    /**
     * @notice Transfer NFT from loser to winner
     * @param loser Address of the losing player
     * @param winner Address of the winning player
     * @param nftContract NFT contract address
     * @param tokenId Token ID
     */
    function transferToWinner(
        address loser,
        address winner,
        address nftContract,
        uint256 tokenId
    ) external onlyAuthorized nonReentrant {
        require(winner != address(0), "Invalid winner");
        StakedNFT storage stake = stakedNFTs[loser][nftContract][tokenId];
        require(stake.isStaked, "NFT not staked");

        uint256 matchId = stake.matchId;

        // Clear stake record
        delete stakedNFTs[loser][nftContract][tokenId];

        // Transfer NFT to winner
        IERC721(nftContract).safeTransferFrom(address(this), winner, tokenId);

        emit NFTTransferred(loser, winner, nftContract, tokenId, matchId);
    }

    /**
     * @notice Check if an NFT is currently staked
     * @param owner NFT owner
     * @param nftContract NFT contract
     * @param tokenId Token ID
     * @return isStaked Whether the NFT is staked
     */
    function isNFTStaked(address owner, address nftContract, uint256 tokenId)
        external
        view
        returns (bool)
    {
        return stakedNFTs[owner][nftContract][tokenId].isStaked;
    }

    /**
     * @notice Get staked NFT details
     * @param owner NFT owner
     * @param nftContract NFT contract
     * @param tokenId Token ID
     * @return StakedNFT struct
     */
    function getStakedNFT(address owner, address nftContract, uint256 tokenId)
        external
        view
        returns (StakedNFT memory)
    {
        return stakedNFTs[owner][nftContract][tokenId];
    }
}
