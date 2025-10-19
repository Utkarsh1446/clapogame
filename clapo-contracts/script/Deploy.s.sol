// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Script.sol";
import "../src/AssetRegistry.sol";
import "../src/NFTVault.sol";
import "../src/MockPyth.sol";
import "../src/Matchmaker.sol";
import "../src/ClapoNFT.sol";

contract DeployScript is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        // Deploy contracts
        console.log("Deploying AssetRegistry...");
        AssetRegistry assetRegistry = new AssetRegistry();
        console.log("AssetRegistry deployed at:", address(assetRegistry));

        console.log("Deploying NFTVault...");
        NFTVault nftVault = new NFTVault();
        console.log("NFTVault deployed at:", address(nftVault));

        console.log("Deploying MockPyth...");
        MockPyth pythOracle = new MockPyth();
        console.log("MockPyth deployed at:", address(pythOracle));

        console.log("Deploying Matchmaker...");
        Matchmaker matchmaker = new Matchmaker(
            address(assetRegistry),
            address(nftVault),
            address(pythOracle)
        );
        console.log("Matchmaker deployed at:", address(matchmaker));

        console.log("Deploying ClapoNFT...");
        ClapoNFT clapoNFT = new ClapoNFT();
        console.log("ClapoNFT deployed at:", address(clapoNFT));

        // Setup NFT Vault
        console.log("\nSetting up NFTVault...");
        nftVault.setWhitelistedCollection(address(clapoNFT), true);
        nftVault.setAuthorizedContract(address(matchmaker), true);

        // Add assets to registry
        console.log("\nAdding assets to AssetRegistry...");
        _addAssets(assetRegistry);

        vm.stopBroadcast();

        // Output deployment addresses
        console.log("\n=== DEPLOYMENT SUMMARY ===");
        console.log("AssetRegistry:", address(assetRegistry));
        console.log("NFTVault:", address(nftVault));
        console.log("MockPyth:", address(pythOracle));
        console.log("Matchmaker:", address(matchmaker));
        console.log("ClapoNFT:", address(clapoNFT));
        console.log("==========================\n");

        // Save deployment addresses to file
        string memory deployments = string(abi.encodePacked(
            "ASSET_REGISTRY=", vm.toString(address(assetRegistry)), "\n",
            "NFT_VAULT=", vm.toString(address(nftVault)), "\n",
            "PYTH_ORACLE=", vm.toString(address(pythOracle)), "\n",
            "MATCHMAKER=", vm.toString(address(matchmaker)), "\n",
            "CLAPO_NFT=", vm.toString(address(clapoNFT)), "\n"
        ));

        vm.writeFile(".env.deployed", deployments);
        console.log("Deployment addresses saved to .env.deployed");
    }

    function _addAssets(AssetRegistry registry) internal {
        // TODO: Replace with actual Pyth price feed IDs for production

        // Tier A
        registry.addAsset(
            keccak256("BTC"),
            bytes32(uint256(0xe62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43)), // BTC/USD feed
            30,
            "Bitcoin"
        );
        registry.addAsset(
            keccak256("ETH"),
            bytes32(uint256(0xff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace)), // ETH/USD feed
            25,
            "Ethereum"
        );
        registry.addAsset(
            keccak256("SOL"),
            bytes32(uint256(0xef0d8b6fda2ceba41da15d4095d1da392a0d2f8ed0c6c7bc0f4cfac8c280b56d)), // SOL/USD feed
            18,
            "Solana"
        );

        // Tier B
        registry.addAsset(keccak256("BNB"), bytes32(uint256(0x2f95862b045670cd22bee3114c39763a4a08beeb663b145d283c31d7d1101c4f)), 16, "BNB");
        registry.addAsset(keccak256("AVAX"), bytes32(uint256(0x93da3352f9f1d105fdfe4971cfa80e9dd777bfc5d0f683ebb6e1294b92137bb7)), 12, "Avalanche");
        registry.addAsset(keccak256("XRP"), bytes32(uint256(0xec5d399846a9209f3fe5881d70aae9268c94339ff9817e8d18ff19fa05eea1c8)), 12, "Ripple");

        // Tier C
        registry.addAsset(keccak256("ADA"), bytes32(uint256(0x2a01deaec9e51a579277b34b122399984d0bbf57e2458a7e42fecd2829867a0d)), 10, "Cardano");
        registry.addAsset(keccak256("MATIC"), bytes32(uint256(0x5de33a9112c2b700b8d30b8a3402c103578ccfa2765696471cc672bd5cf6ac52)), 10, "Polygon");
        registry.addAsset(keccak256("NEAR"), bytes32(uint256(0xc415de8d2eba7db216527dff4b60e8f3a5311c740dadb233e13e12547e226750)), 10, "NEAR Protocol");

        // Tier D
        registry.addAsset(keccak256("DOGE"), bytes32(uint256(0xdcef50dd0a4cd2dcc17e45df1676dcb336a11a61c69df7a0299b0150c672d25c)), 9, "Dogecoin");
        registry.addAsset(keccak256("TRX"), bytes32(uint256(0x67aed5a24fdad045475e7195c98a98aea119c763f272d4523f5bac93a4f33c2b)), 8, "Tron");
        registry.addAsset(keccak256("SUI"), bytes32(uint256(0x23d7315113f5b1d3ba7a83604c44b94d79f4fd69af77f804fc7f920a6dc65744)), 8, "Sui");

        // Tier E
        registry.addAsset(keccak256("ASTAR"), bytes32(uint256(0xb7e3904c08ddd9c0c10c6d207d390fd19e87eb6aab96304f571ed94caebdefa0)), 7, "Astar");
        registry.addAsset(keccak256("SHIB"), bytes32(uint256(0xf0d57deca57b3da2fe63a493f4c25925fdfd8edf834b20f93e1f84dbd1504d4a)), 6, "Shiba Inu");
        registry.addAsset(keccak256("PEPE"), bytes32(uint256(0xd69731a2e74ac1ce884fc3890f7ee324b6deb66147055249568869ed700882e4)), 5, "Pepe");
        registry.addAsset(keccak256("HYPE"), bytes32(uint256(0x1)), 5, "Hype"); // Placeholder

        // Tier F
        registry.addAsset(keccak256("DOT"), bytes32(uint256(0xca3eed9b267293f6595901c734c7525ce8ef49adafe8284606ceb307afa2ca5b)), 10, "Polkadot");
        registry.addAsset(keccak256("APT"), bytes32(uint256(0x03ae4db29ed4ae33d323568895aa00337e658e348b37509f5372ae51f0af00d5)), 9, "Aptos");

        console.log("Added 18 assets to registry");
    }
}
