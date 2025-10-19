// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Script.sol";
import "../src/AssetRegistry.sol";
import "../src/NFTVault.sol";
import "../src/Matchmaker.sol";
import "../src/ClapoNFT.sol";

/**
 * @title DeployMonad
 * @notice Deployment script for Monad testnet with real Pyth oracle
 * @dev Requires PYTH_ORACLE_ADDRESS environment variable
 */
contract DeployMonad is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

        // Get Pyth oracle address from environment
        // For Monad testnet, check https://docs.pyth.network/price-feeds/contract-addresses
        address pythOracleAddress = vm.envAddress("PYTH_ORACLE_ADDRESS");

        require(pythOracleAddress != address(0), "PYTH_ORACLE_ADDRESS not set");

        vm.startBroadcast(deployerPrivateKey);

        // Deploy contracts
        console.log("=== Deploying to Monad Testnet ===");
        console.log("Using Pyth Oracle at:", pythOracleAddress);
        console.log("");

        console.log("Deploying AssetRegistry...");
        AssetRegistry assetRegistry = new AssetRegistry();
        console.log("AssetRegistry deployed at:", address(assetRegistry));

        console.log("Deploying NFTVault...");
        NFTVault nftVault = new NFTVault();
        console.log("NFTVault deployed at:", address(nftVault));

        console.log("Deploying Matchmaker...");
        Matchmaker matchmaker = new Matchmaker(
            address(assetRegistry),
            address(nftVault),
            pythOracleAddress // Use real Pyth oracle
        );
        console.log("Matchmaker deployed at:", address(matchmaker));

        console.log("Deploying ClapoNFT...");
        ClapoNFT clapoNFT = new ClapoNFT();
        console.log("ClapoNFT deployed at:", address(clapoNFT));

        // Setup NFT Vault
        console.log("\nSetting up NFTVault...");
        nftVault.setWhitelistedCollection(address(clapoNFT), true);
        nftVault.setAuthorizedContract(address(matchmaker), true);
        console.log("NFTVault configured");

        // Add assets to registry with real Pyth feed IDs
        console.log("\nAdding assets to AssetRegistry...");
        _addAssets(assetRegistry);

        vm.stopBroadcast();

        // Output deployment summary
        console.log("\n=== MONAD TESTNET DEPLOYMENT SUMMARY ===");
        console.log("AssetRegistry:", address(assetRegistry));
        console.log("NFTVault:", address(nftVault));
        console.log("PythOracle:", pythOracleAddress);
        console.log("Matchmaker:", address(matchmaker));
        console.log("ClapoNFT:", address(clapoNFT));
        console.log("=======================================\n");

        // Save deployment addresses to file
        string memory deployments = string(abi.encodePacked(
            "# Monad Testnet Deployment\n",
            "NEXT_PUBLIC_ASSET_REGISTRY_ADDRESS=", vm.toString(address(assetRegistry)), "\n",
            "NEXT_PUBLIC_NFT_VAULT_ADDRESS=", vm.toString(address(nftVault)), "\n",
            "NEXT_PUBLIC_PYTH_ORACLE_ADDRESS=", vm.toString(pythOracleAddress), "\n",
            "NEXT_PUBLIC_MATCHMAKER_ADDRESS=", vm.toString(address(matchmaker)), "\n",
            "NEXT_PUBLIC_CLAPO_NFT_ADDRESS=", vm.toString(address(clapoNFT)), "\n"
        ));

        // Note: File writing disabled due to Foundry permissions
        // Addresses printed above - copy to .env.monad manually
        console.log("\nCopy these addresses to clapo-frontend/.env.local");
    }

    function _addAssets(AssetRegistry registry) internal {
        // Real Pyth price feed IDs
        // Source: https://pyth.network/developers/price-feed-ids

        console.log("Adding Tier A assets...");
        // Tier A - Premium assets
        registry.addAsset(
            keccak256("BTC"),
            0xe62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43, // BTC/USD
            30,
            "Bitcoin"
        );
        registry.addAsset(
            keccak256("ETH"),
            0xff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace, // ETH/USD
            25,
            "Ethereum"
        );
        registry.addAsset(
            keccak256("SOL"),
            0xef0d8b6fda2ceba41da15d4095d1da392a0d2f8ed0c6c7bc0f4cfac8c280b56d, // SOL/USD
            18,
            "Solana"
        );

        console.log("Adding Tier B assets...");
        // Tier B
        registry.addAsset(
            keccak256("BNB"),
            0x2f95862b045670cd22bee3114c39763a4a08beeb663b145d283c31d7d1101c4f, // BNB/USD
            16,
            "BNB"
        );
        registry.addAsset(
            keccak256("AVAX"),
            0x93da3352f9f1d105fdfe4971cfa80e9dd777bfc5d0f683ebb6e1294b92137bb7, // AVAX/USD
            12,
            "Avalanche"
        );
        registry.addAsset(
            keccak256("XRP"),
            0xec5d399846a9209f3fe5881d70aae9268c94339ff9817e8d18ff19fa05eea1c8, // XRP/USD
            12,
            "Ripple"
        );

        console.log("Adding Tier C assets...");
        // Tier C
        registry.addAsset(
            keccak256("ADA"),
            0x2a01deaec9e51a579277b34b122399984d0bbf57e2458a7e42fecd2829867a0d, // ADA/USD
            10,
            "Cardano"
        );
        registry.addAsset(
            keccak256("MATIC"),
            0x5de33a9112c2b700b8d30b8a3402c103578ccfa2765696471cc672bd5cf6ac52, // MATIC/USD
            10,
            "Polygon"
        );
        registry.addAsset(
            keccak256("NEAR"),
            0xc415de8d2eba7db216527dff4b60e8f3a5311c740dadb233e13e12547e226750, // NEAR/USD
            10,
            "NEAR Protocol"
        );

        console.log("Adding Tier D assets...");
        // Tier D
        registry.addAsset(
            keccak256("DOGE"),
            0xdcef50dd0a4cd2dcc17e45df1676dcb336a11a61c69df7a0299b0150c672d25c, // DOGE/USD
            9,
            "Dogecoin"
        );
        registry.addAsset(
            keccak256("TRX"),
            0x67aed5a24fdad045475e7195c98a98aea119c763f272d4523f5bac93a4f33c2b, // TRX/USD
            8,
            "Tron"
        );
        registry.addAsset(
            keccak256("SUI"),
            0x23d7315113f5b1d3ba7a83604c44b94d79f4fd69af77f804fc7f920a6dc65744, // SUI/USD
            8,
            "Sui"
        );

        console.log("Adding Tier E assets...");
        // Tier E
        registry.addAsset(
            keccak256("ASTAR"),
            0xb7e3904c08ddd9c0c10c6d207d390fd19e87eb6aab96304f571ed94caebdefa0, // ASTR/USD
            7,
            "Astar"
        );
        registry.addAsset(
            keccak256("SHIB"),
            0xf0d57deca57b3da2fe63a493f4c25925fdfd8edf834b20f93e1f84dbd1504d4a, // SHIB/USD
            6,
            "Shiba Inu"
        );
        registry.addAsset(
            keccak256("PEPE"),
            0xd69731a2e74ac1ce884fc3890f7ee324b6deb66147055249568869ed700882e4, // PEPE/USD
            5,
            "Pepe"
        );
        registry.addAsset(
            keccak256("HYPE"),
            0x7c28a4f3ca1e583f83c5c430ae9ad42f80bc3f6fcbde13906e7b569cd6f22aa1, // HYPE/USD
            5,
            "Hype"
        );

        console.log("Adding Tier F assets...");
        // Tier F
        registry.addAsset(
            keccak256("DOT"),
            0xca3eed9b267293f6595901c734c7525ce8ef49adafe8284606ceb307afa2ca5b, // DOT/USD
            10,
            "Polkadot"
        );
        registry.addAsset(
            keccak256("APT"),
            0x03ae4db29ed4ae33d323568895aa00337e658e348b37509f5372ae51f0af00d5, // APT/USD
            9,
            "Aptos"
        );

        console.log("Successfully added 18 assets to registry");
    }
}
