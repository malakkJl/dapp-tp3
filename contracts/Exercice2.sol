// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract Exercice2 {
    // Pas de variables d'état selon le TP
    
    // Fonction pour convertir Ether en Wei
    function etherEnWei(uint256 montantEther) public pure returns (uint256) {
        return montantEther * 1 ether;
    }
    
    // Fonction bonus pour convertir Wei en Ether
    function weiEnEther(uint256 montantWei) public pure returns (uint256) {
        return montantWei / 1 ether;
    }
    
    // Fonction utilitaire pour obtenir la valeur de 1 ether en wei
    function getOneEtherInWei() public pure returns (uint256) {
        return 1 ether;
    }
}