// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract Exercice5 {
    // Événement pour logger les vérifications de parité
    event VerificationParite(uint256 nombre, bool estPair);
    
    // Fonction pour vérifier si un nombre est pair
    function estPair(uint256 nombre) public returns (bool) {
        bool resultat = nombre % 2 == 0;
        emit VerificationParite(nombre, resultat);
        return resultat;
    }
    
    // Fonction pour vérifier si un nombre est impair
    function estImpair(uint256 nombre) public returns (bool) {
        bool resultat = nombre % 2 != 0;
        emit VerificationParite(nombre, !resultat);
        return resultat;
    }
    
    // Version view de la fonction de parité (sans événement)
    function estPairView(uint256 nombre) public pure returns (bool) {
        return nombre % 2 == 0;
    }
    
    // Version view pour impair
    function estImpairView(uint256 nombre) public pure returns (bool) {
        return nombre % 2 != 0;
    }
    
    // Fonction pour obtenir le type de parité sous forme de string
    function getTypeParite(uint256 nombre) public pure returns (string memory) {
        if (nombre % 2 == 0) {
            return "pair";
        } else {
            return "impair";
        }
    }
}