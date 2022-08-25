// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import {PlonkVerifier} from "./CheckPassword_plonk.sol";
import {Groth16Verifier} from "./CheckPassword_groth16.sol";

contract MintZKNft is ERC721, Ownable {
    using Strings for uint256;

    PlonkVerifier public plonkVerifier;
    Groth16Verifier public groth16Verifier;

    uint256 public constant SALE_MAX = 100;
    uint16 public constant AMOUNT = 1;
    uint16 public constant NFT_ID_OFFSET = 10;
    address public PAYOUT_ADDRESS;
    string private _tokenBaseURI =
        "https://nft-api.flyingnobita.workers.dev/api/metadata/";
    string private signPrefix = "Signed for Kanji Minting:";
    uint256 public totalSupply;
    bool public saleLive = true;

    constructor(address addressPlonkVerifier, address addressGroth16Verifier)
        ERC721("Kanji", "KANJI")
    {
        PAYOUT_ADDRESS = msg.sender;
        plonkVerifier = PlonkVerifier(addressPlonkVerifier);
        groth16Verifier = Groth16Verifier(addressGroth16Verifier);
    }

    function mintPlonk(bytes memory proof, uint256[] memory pubSignals)
        external
        payable
    {
        require(totalSupply + AMOUNT <= SALE_MAX, "Kanji: Max Minted");
        require(
            plonkVerifier.verifyProof(proof, pubSignals),
            "Kanji: Contract Mint Not Allowed"
        );

        _mint(msg.sender, totalSupply + AMOUNT + NFT_ID_OFFSET);
        totalSupply += AMOUNT;
    }

    function mintGroth16(
        uint[2] memory a,
        uint[2][2] memory b,
        uint[2] memory c,
        uint[3] memory input
    ) external payable {
        require(totalSupply + AMOUNT <= SALE_MAX, "Kanji: Max Minted");
        require(
            groth16Verifier.verifyProof(a, b, c, input),
            "Kanji: Contract Mint Not Allowed"
        );

        _mint(msg.sender, totalSupply + AMOUNT + NFT_ID_OFFSET);
        totalSupply += AMOUNT;
    }

    function withdraw() external onlyOwner {
        payable(PAYOUT_ADDRESS).transfer(address(this).balance);
    }

    function toggleSale() external onlyOwner {
        saleLive = !saleLive;
    }

    function setBaseURI(string calldata uri) external onlyOwner {
        _tokenBaseURI = uri;
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721)
        returns (string memory)
    {
        require(_exists(tokenId), "Kanji: Cannot query non-existent token");

        return string(abi.encodePacked(_tokenBaseURI, tokenId.toString()));
    }
}
