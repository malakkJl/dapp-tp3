// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract Exercice1 {
    // Variables d'état - deux nombres
    uint256 public nombre1;
    uint256 public nombre2;

    // Constructeur : valeurs initiales
    constructor() {
        nombre1 = 10;
        nombre2 = 20;
    }

    // Fonction view : somme des variables d'état
    function addition1() public view returns (uint256) {
        return nombre1 + nombre2;
    }

    // Fonction pure : somme de deux paramètres
    function addition2(uint256 a, uint256 b) public pure returns (uint256) {
        return a + b;
    }
}
