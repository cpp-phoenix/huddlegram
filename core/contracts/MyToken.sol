// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract MyToken is ERC721 {

    uint public totalSupply;
    uint public tokenId = 0;
    string public tokenURIs;

    constructor(uint _totalSupply, string memory tokenName, string memory tokenSym, string memory _tokenURIs) ERC721(tokenName, tokenSym) {
        totalSupply = _totalSupply;
        tokenURIs = _tokenURIs;
    }

    function tokenURI(uint256 _tokenId) public view virtual override returns (string memory) {
        _requireMinted(_tokenId);
        return tokenURIs;
    }

    function mintNFT() public {
        _safeMint(msg.sender, tokenId);
        tokenId +=1;
    }
}
