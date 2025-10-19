// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./IPythOracle.sol";

/**
 * @title MockPyth
 * @notice Mock implementation of Pyth oracle for local testing
 * @dev Simplified interface matching Pyth's core functions
 */
contract MockPyth is IPythOracle {
    struct PriceFeed {
        bytes32 id;
        IPythOracle.Price price;
        IPythOracle.Price emaPrice;
    }

    mapping(bytes32 => PriceFeed) private priceFeeds;
    // Price history: feed ID => timestamp => Price
    mapping(bytes32 => mapping(uint256 => IPythOracle.Price)) private priceHistory;
    uint256 public updateFee;

    event PriceUpdated(bytes32 indexed id, int64 price, uint64 conf, uint256 publishTime);

    constructor() {
        updateFee = 0; // Free for testing
    }

    /**
     * @notice Set price for testing
     * @param id Price feed ID
     * @param price Price value
     * @param conf Confidence interval
     * @param expo Price exponent
     * @param publishTime Publish timestamp
     */
    function setPrice(
        bytes32 id,
        int64 price,
        uint64 conf,
        int32 expo,
        uint256 publishTime
    ) external {
        Price memory newPrice = Price({
            price: price,
            conf: conf,
            expo: expo,
            publishTime: publishTime
        });

        priceFeeds[id] = PriceFeed({id: id, price: newPrice, emaPrice: newPrice});
        priceHistory[id][publishTime] = newPrice;

        emit PriceUpdated(id, price, conf, publishTime);
    }

    /**
     * @notice Batch set prices for multiple feeds
     * @param ids Array of price feed IDs
     * @param prices Array of prices
     * @param confs Array of confidence intervals
     * @param expo Price exponent (same for all)
     * @param publishTime Publish timestamp (same for all)
     */
    function setPrices(
        bytes32[] calldata ids,
        int64[] calldata prices,
        uint64[] calldata confs,
        int32 expo,
        uint256 publishTime
    ) external {
        require(
            ids.length == prices.length && prices.length == confs.length,
            "Array length mismatch"
        );

        for (uint256 i = 0; i < ids.length; i++) {
            Price memory newPrice = Price({
                price: prices[i],
                conf: confs[i],
                expo: expo,
                publishTime: publishTime
            });

            priceFeeds[ids[i]] = PriceFeed({id: ids[i], price: newPrice, emaPrice: newPrice});
            priceHistory[ids[i]][publishTime] = newPrice;

            emit PriceUpdated(ids[i], prices[i], confs[i], publishTime);
        }
    }

    /**
     * @notice Update price feeds (mock implementation)
     * @param updateData Price update data (unused in mock)
     */
    function updatePriceFeeds(bytes[] calldata updateData) external payable {
        // Mock implementation - does nothing
        // In production, this would verify and update prices
        require(msg.value >= updateFee, "Insufficient fee");
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
        returns (Price memory price)
    {
        require(priceFeeds[id].id == id, "Price feed not found");
        price = priceFeeds[id].price;
        require(block.timestamp - price.publishTime <= age, "Price too old");
    }

    /**
     * @notice Get current price (unsafe - doesn't check age)
     * @param id Price feed ID
     * @return price Price struct
     */
    function getPriceUnsafe(bytes32 id) external view returns (Price memory price) {
        require(priceFeeds[id].id == id, "Price feed not found");
        return priceFeeds[id].price;
    }

    /**
     * @notice Get price feed
     * @param id Price feed ID
     * @return priceFeed PriceFeed struct
     */
    function getPriceFeed(bytes32 id) external view returns (PriceFeed memory priceFeed) {
        require(priceFeeds[id].id == id, "Price feed not found");
        return priceFeeds[id];
    }

    /**
     * @notice Get EMA price
     * @param id Price feed ID
     * @return price EMA Price struct
     */
    function getEmaPrice(bytes32 id) external view returns (Price memory price) {
        require(priceFeeds[id].id == id, "Price feed not found");
        return priceFeeds[id].emaPrice;
    }

    /**
     * @notice Get update fee
     * @param updateData Price update data (unused)
     * @return feeAmount Fee amount
     */
    function getUpdateFee(bytes[] calldata updateData) external view returns (uint256 feeAmount) {
        return updateFee * updateData.length;
    }

    /**
     * @notice Set update fee for testing
     * @param newFee New fee amount
     */
    function setUpdateFee(uint256 newFee) external {
        updateFee = newFee;
    }

    /**
     * @notice Check if price feed exists
     * @param id Price feed ID
     * @return exists Whether the feed exists
     */
    function priceFeedExists(bytes32 id) external view returns (bool exists) {
        return priceFeeds[id].id == id;
    }

    /**
     * @notice Get historical price at a specific timestamp
     * @param id Price feed ID
     * @param timestamp Timestamp to query
     * @return price Price at that timestamp
     */
    function getPriceAtTimestamp(bytes32 id, uint256 timestamp)
        external
        view
        returns (Price memory price)
    {
        price = priceHistory[id][timestamp];
        require(price.publishTime == timestamp, "No price at timestamp");
    }
}
