// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title GameMath
 * @notice Library for game calculations including price changes and scoring
 * @dev Uses basis points (1 bp = 0.01%) for price calculations
 */
library GameMath {
    // Multiplier precision (2 decimals: 200 = 2.00x, 150 = 1.50x, 100 = 1.00x)
    uint256 constant MULTIPLIER_PRECISION = 100;

    // Leader multiplier (2.0x)
    uint256 constant LEADER_MULTIPLIER = 200;

    // Co-leader multiplier (1.5x)
    uint256 constant CO_LEADER_MULTIPLIER = 150;

    // Regular multiplier (1.0x)
    uint256 constant REGULAR_MULTIPLIER = 100;

    // Basis points precision (10000 = 100%)
    uint256 constant BASIS_POINTS = 10000;

    enum Role {
        Regular,
        CoLeader,
        Leader
    }

    /**
     * @notice Calculate price change in basis points
     * @dev Formula: ((priceEnd - priceStart) / priceStart) * 10000
     * @param priceStart Starting price (must be > 0)
     * @param priceEnd Ending price
     * @return priceChange Price change in basis points (can be negative)
     */
    function calculatePriceChange(int64 priceStart, int64 priceEnd)
        internal
        pure
        returns (int256 priceChange)
    {
        require(priceStart > 0, "Start price must be positive");

        int256 delta = int256(priceEnd) - int256(priceStart);
        priceChange = (delta * int256(BASIS_POINTS)) / int256(priceStart);
    }

    /**
     * @notice Calculate score for a single asset
     * @dev Score = priceChange × multiplier
     * @param priceChange Price change in basis points
     * @param role Asset role (Regular, CoLeader, Leader)
     * @return score Asset score
     */
    function calculateAssetScore(int256 priceChange, Role role)
        internal
        pure
        returns (int256 score)
    {
        uint256 multiplier = getMultiplier(role);
        score = (priceChange * int256(multiplier)) / int256(MULTIPLIER_PRECISION);
    }

    /**
     * @notice Get multiplier for a role
     * @param role Asset role
     * @return multiplier Multiplier value
     */
    function getMultiplier(Role role) internal pure returns (uint256 multiplier) {
        if (role == Role.Leader) {
            return LEADER_MULTIPLIER;
        } else if (role == Role.CoLeader) {
            return CO_LEADER_MULTIPLIER;
        } else {
            return REGULAR_MULTIPLIER;
        }
    }

    /**
     * @notice Calculate total portfolio score
     * @param priceChanges Array of price changes in basis points
     * @param roles Array of roles corresponding to each price change
     * @return totalScore Total portfolio score
     */
    function calculateTotalScore(int256[] memory priceChanges, Role[] memory roles)
        internal
        pure
        returns (int256 totalScore)
    {
        require(priceChanges.length == roles.length, "Length mismatch");
        require(priceChanges.length == 7, "Must have 7 assets");

        totalScore = 0;
        for (uint256 i = 0; i < priceChanges.length; i++) {
            totalScore += calculateAssetScore(priceChanges[i], roles[i]);
        }
    }

    /**
     * @notice Validate role assignments
     * @dev Must have exactly 1 Leader, 1 CoLeader, and 5 Regular
     * @param roles Array of roles to validate
     * @return isValid Whether role assignments are valid
     */
    function validateRoles(Role[] memory roles) internal pure returns (bool isValid) {
        if (roles.length != 7) {
            return false;
        }

        uint256 leaderCount = 0;
        uint256 coLeaderCount = 0;

        for (uint256 i = 0; i < roles.length; i++) {
            if (roles[i] == Role.Leader) {
                leaderCount++;
            } else if (roles[i] == Role.CoLeader) {
                coLeaderCount++;
            }
        }

        return (leaderCount == 1 && coLeaderCount == 1);
    }

    /**
     * @notice Compare two scores to determine winner
     * @param score1 Player 1's score
     * @param score2 Player 2's score
     * @return result 1 if player1 wins, 2 if player2 wins, 0 if tie
     */
    function determineWinner(int256 score1, int256 score2) internal pure returns (uint8 result) {
        if (score1 > score2) {
            return 1;
        } else if (score2 > score1) {
            return 2;
        } else {
            return 0; // Tie
        }
    }

    /**
     * @notice Validate price data freshness
     * @param publishTime Price publish timestamp
     * @param currentTime Current block timestamp
     * @param maxStaleness Maximum allowed staleness in seconds
     * @return isFresh Whether price is fresh enough
     */
    function isPriceFresh(uint256 publishTime, uint256 currentTime, uint256 maxStaleness)
        internal
        pure
        returns (bool isFresh)
    {
        if (currentTime < publishTime) {
            return false; // Future timestamp
        }
        return (currentTime - publishTime) <= maxStaleness;
    }
}
