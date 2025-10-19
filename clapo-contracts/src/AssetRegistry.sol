// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title AssetRegistry
 * @notice Stores metadata for all tradable crypto assets in the game
 * @dev Maps asset symbols to Pyth price feed IDs, costs, and enabled status
 */
contract AssetRegistry is Ownable {
    struct Asset {
        bytes32 pythFeedId;  // Pyth price feed identifier
        uint16 cost;         // Cost in points (1-100)
        bool enabled;        // Whether asset is currently enabled for gameplay
        string name;         // Human readable name (e.g., "Bitcoin")
    }

    // Symbol => Asset mapping (e.g., "BTC" => Asset)
    mapping(bytes32 => Asset) public assets;

    // Array of all asset symbols for enumeration
    bytes32[] public assetSymbols;

    // Track which symbols exist
    mapping(bytes32 => bool) public symbolExists;

    event AssetAdded(bytes32 indexed symbol, bytes32 pythFeedId, uint16 cost, string name);
    event AssetUpdated(bytes32 indexed symbol, bytes32 pythFeedId, uint16 cost, bool enabled);
    event AssetToggled(bytes32 indexed symbol, bool enabled);

    constructor() Ownable(msg.sender) {}

    /**
     * @notice Add a new asset to the registry
     * @param symbol Asset symbol (e.g., keccak256("BTC"))
     * @param pythFeedId Pyth price feed ID
     * @param cost Point cost for this asset (1-100)
     * @param name Human readable name
     */
    function addAsset(
        bytes32 symbol,
        bytes32 pythFeedId,
        uint16 cost,
        string calldata name
    ) external onlyOwner {
        require(!symbolExists[symbol], "Asset already exists");
        require(cost > 0 && cost <= 100, "Cost must be 1-100");
        require(pythFeedId != bytes32(0), "Invalid feed ID");

        assets[symbol] = Asset({
            pythFeedId: pythFeedId,
            cost: cost,
            enabled: true,
            name: name
        });

        assetSymbols.push(symbol);
        symbolExists[symbol] = true;

        emit AssetAdded(symbol, pythFeedId, cost, name);
    }

    /**
     * @notice Update an existing asset's properties
     * @param symbol Asset symbol to update
     * @param pythFeedId New Pyth price feed ID
     * @param cost New point cost
     * @param enabled Whether asset should be enabled
     */
    function updateAsset(
        bytes32 symbol,
        bytes32 pythFeedId,
        uint16 cost,
        bool enabled
    ) external onlyOwner {
        require(symbolExists[symbol], "Asset does not exist");
        require(cost > 0 && cost <= 100, "Cost must be 1-100");
        require(pythFeedId != bytes32(0), "Invalid feed ID");

        Asset storage asset = assets[symbol];
        asset.pythFeedId = pythFeedId;
        asset.cost = cost;
        asset.enabled = enabled;

        emit AssetUpdated(symbol, pythFeedId, cost, enabled);
    }

    /**
     * @notice Toggle asset availability
     * @param symbol Asset symbol to toggle
     * @param enabled New enabled status
     */
    function toggleAsset(bytes32 symbol, bool enabled) external onlyOwner {
        require(symbolExists[symbol], "Asset does not exist");
        assets[symbol].enabled = enabled;
        emit AssetToggled(symbol, enabled);
    }

    /**
     * @notice Get asset details
     * @param symbol Asset symbol
     * @return Asset struct
     */
    function getAsset(bytes32 symbol) external view returns (Asset memory) {
        require(symbolExists[symbol], "Asset does not exist");
        return assets[symbol];
    }

    /**
     * @notice Get all enabled assets
     * @return Array of enabled asset symbols
     */
    function getEnabledAssets() external view returns (bytes32[] memory) {
        uint256 enabledCount = 0;

        // Count enabled assets
        for (uint256 i = 0; i < assetSymbols.length; i++) {
            if (assets[assetSymbols[i]].enabled) {
                enabledCount++;
            }
        }

        // Build array of enabled symbols
        bytes32[] memory enabled = new bytes32[](enabledCount);
        uint256 index = 0;

        for (uint256 i = 0; i < assetSymbols.length; i++) {
            if (assets[assetSymbols[i]].enabled) {
                enabled[index] = assetSymbols[i];
                index++;
            }
        }

        return enabled;
    }

    /**
     * @notice Get all assets (enabled and disabled)
     * @return Array of all asset symbols
     */
    function getAllAssets() external view returns (bytes32[] memory) {
        return assetSymbols;
    }

    /**
     * @notice Get total cost of a portfolio
     * @param symbols Array of asset symbols
     * @return Total cost in points
     */
    function getPortfolioCost(bytes32[] calldata symbols) external view returns (uint256) {
        uint256 totalCost = 0;
        for (uint256 i = 0; i < symbols.length; i++) {
            require(symbolExists[symbols[i]], "Asset does not exist");
            require(assets[symbols[i]].enabled, "Asset not enabled");
            totalCost += assets[symbols[i]].cost;
        }
        return totalCost;
    }

    /**
     * @notice Validate a portfolio (7 unique enabled assets, total cost <= 100)
     * @param symbols Array of asset symbols to validate
     * @return isValid Whether the portfolio is valid
     * @return totalCost Total cost of the portfolio
     */
    function validatePortfolio(bytes32[] calldata symbols)
        external
        view
        returns (bool isValid, uint256 totalCost)
    {
        // Must have exactly 7 assets
        if (symbols.length != 7) {
            return (false, 0);
        }

        totalCost = 0;

        // Check for duplicates and calculate cost
        for (uint256 i = 0; i < symbols.length; i++) {
            // Check asset exists and is enabled
            if (!symbolExists[symbols[i]] || !assets[symbols[i]].enabled) {
                return (false, 0);
            }

            // Check for duplicates
            for (uint256 j = i + 1; j < symbols.length; j++) {
                if (symbols[i] == symbols[j]) {
                    return (false, 0);
                }
            }

            totalCost += assets[symbols[i]].cost;
        }

        // Total cost must be <= 100
        isValid = totalCost <= 100;
    }
}
