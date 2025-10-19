// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title IPythOracle
 * @notice Unified interface for Pyth oracle (works with both MockPyth and real Pyth)
 */
interface IPythOracle {
    struct Price {
        int64 price;
        uint64 conf;
        int32 expo;
        uint256 publishTime;
    }

    /**
     * @notice Get price no older than a certain age
     * @param id Price feed ID
     * @param age Maximum age in seconds
     * @return price Price struct
     */
    function getPriceNoOlderThan(bytes32 id, uint256 age)
        external
        view
        returns (Price memory price);

    /**
     * @notice Get current price (unsafe - doesn't check age)
     * @param id Price feed ID
     * @return price Price struct
     */
    function getPriceUnsafe(bytes32 id) external view returns (Price memory price);
}
