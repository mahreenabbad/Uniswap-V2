// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;
//import contacts 
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";


//erc20 token for use in dex
contract MyTokenA is ERC20, Ownable {
    constructor(address initialOwner)
        ERC20("MyTokenA", "TA")
        Ownable(initialOwner)
    {}

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
}
