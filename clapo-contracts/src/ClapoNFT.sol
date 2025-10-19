// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title ClapoNFT
 * @notice Demo ERC721 NFT for testing the Clapo Game
 */
contract ClapoNFT is ERC721, Ownable {
    uint256 private _tokenIdCounter;

    constructor() ERC721("Clapo Game NFT", "CLAPO") Ownable(msg.sender) {}

    /**
     * @notice Mint a new NFT to an address
     * @param to Recipient address
     * @return tokenId Minted token ID
     */
    function mint(address to) external returns (uint256) {
        uint256 tokenId = _tokenIdCounter++;
        _safeMint(to, tokenId);
        return tokenId;
    }

    /**
     * @notice Batch mint NFTs to an address
     * @param to Recipient address
     * @param amount Number of NFTs to mint
     */
    function batchMint(address to, uint256 amount) external {
        for (uint256 i = 0; i < amount; i++) {
            uint256 tokenId = _tokenIdCounter++;
            _safeMint(to, tokenId);
        }
    }

    /**
     * @notice Get current token counter
     * @return Current token ID counter
     */
    function currentTokenId() external view returns (uint256) {
        return _tokenIdCounter;
    }
}
