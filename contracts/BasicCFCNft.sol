//SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract BasicCFCNft is ERC721 {
  string public constant TOKEN_URI = "ipfs://QmSumRkgBY7PzatJ6ncYdZUdo3h6w6efHEvitUPArDaiB6";
  uint256 private s_tokenCounter;

  constructor() ERC721("Basic CFC NFT", "BCNFT") {
    s_tokenCounter = 0;
  }

  function mintNft() public returns (uint256) {
    _safeMint(msg.sender, s_tokenCounter);
    s_tokenCounter = s_tokenCounter + 1;
    return s_tokenCounter;
  }

  function tokenURI(uint256 tokenId) public view override returns (string memory) {
    // require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");
    return TOKEN_URI;
  }

  function getTokenCounter() public view returns (uint256) {
    return s_tokenCounter;
  }
}
