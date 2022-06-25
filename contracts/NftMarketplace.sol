//SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

error NftMarketplace__NotApprovedForListing();
error NftMarketplace__AlreadyListed(address nftAddress, uint256 tokenId);
error NftMarketplace__NotOwner();

contract NftMarketplace is ReentrancyGuard {
  //
  struct Listing {
    uint256 price;
    address seller;
  }

  //event
  event ItemListed(
    address indexed seller,
    address indexed nftAddress,
    uint256 indexed tokenId,
    uint256 price
  );

  //NFT Contract Address -> NFT TokenId --> Listing
  mapping(address => mapping(uint256 => Listing)) private s_listings;

  //Modifiers
  modifier notListed(
    address nftAddress,
    uint256 tokenId,
    address owner
  ) {
    Listing memory listing = s_listings[nftAddress][tokenId];
    if (listing.price > 0) {
      revert NftMarketplace__AlreadyListed(nftAddress, tokenId);
    }
    _;
  }

  modifier isOwner(
    address nftAddress,
    uint256 tokenId,
    address spender
  ) {
    IERC721 nft = IERC721(nftAddress);
    address owner = nft.ownerOf(tokenId);
    if (owner != spender) {
      revert NftMarketplace__NotOwner();
    }
    _;
  }

  // Address Main Functions
  // Function to list NFT items
  function listItem(
    address nftAddress,
    uint256 tokenId,
    uint256 price
  ) external notListed(nftAddress, tokenId, msg.sender) isOwner(nftAddress, tokenId, msg.sender) {
    //owners can hold NFTs and give marketplace approval
    IERC721 nft = IERC721(nftAddress);

    if (nft.getApproved(tokenId) != address(this)) {
      revert NftMarketplace__NotApprovedForListing();
    }

    //seller would be msg.sender
    s_listings[nftAddress][tokenId] = Listing(price, msg.sender);
    emit ItemListed(msg.sender, nftAddress, tokenId, price);
  }

  //
}
