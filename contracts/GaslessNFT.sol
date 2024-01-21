// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.18;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {ERC20Permit} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";

import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/ShortStrings.sol";
import "@openzeppelin/contracts/utils/cryptography/EIP712.sol";
import {
    ERC2771Context
} from "@gelatonetwork/relay-context/contracts/vendor/ERC2771Context.sol";


contract GaslessNFT is EIP712,ERC2771Context {
    using ShortStrings for *;
    uint256 public price;
    uint256 public supply;
    ERC20Permit public token;
    bytes32 private constant _PERMIT_TYPEHASH =
        keccak256(
            "Permit(address owner,address spender,uint256 value,uint256 nonce,uint256 deadline)"
        );
    bytes32 private constant _TYPE_HASH =
        keccak256(
            "EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)"
        );

    constructor(
        ERC20Permit _token,
        address trustedForwarder
    )  EIP712("DemoToken", "1") ERC2771Context(trustedForwarder) {
        token = _token;
    }

    function trade(
        address spender,
        uint256 amount,
        uint256 deadline,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external {
        bytes32 structHash = keccak256(
            abi.encode(
                _PERMIT_TYPEHASH,
                _msgSender(),
                spender,
                amount,
                token.nonces(_msgSender()),
                deadline
            )
        );

        bytes32 hash = _hashTypedDataV4Custom(structHash);

        address signer = ECDSA.recover(hash, v, r, s);

        require(signer == _msgSender(),'NOOO');

        token.permit(_msgSender(), address(this), amount, deadline, v, r, s);
        token.transferFrom(_msgSender(), address(this), amount);
    }

    function _buildDomainSeparatorCustom() private view returns (bytes32) {
           string memory name;
     string memory version;
        (, name, version, , , , ) = token.eip712Domain();
        bytes32 _hashedName = keccak256(bytes(name));
        bytes32 _hashedVersion = keccak256(bytes(version));
        return
            keccak256(
                abi.encode(
                    _TYPE_HASH,
                    _hashedName,
                    _hashedVersion,
                    block.chainid,
                    address(token)
                )
            );
    }

    function _hashTypedDataV4Custom(
        bytes32 structHash
    )  internal view virtual returns (bytes32) {
        return toTypedDataHashCustom(_buildDomainSeparatorCustom(), structHash);
    }

        function toTypedDataHashCustom(bytes32 domainSeparator, bytes32 structHash) internal pure returns (bytes32 digest) {
        /// @solidity memory-safe-assembly
        assembly {
            let ptr := mload(0x40)
            mstore(ptr, hex"19_01")
            mstore(add(ptr, 0x02), domainSeparator)
            mstore(add(ptr, 0x22), structHash)
            digest := keccak256(ptr, 0x42)
        }
    }
}
