// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract Exercice4 {
    // Événement pour logger les vérifications
    event VerificationPositif(int256 nombre, bool resultat);
    
    // Fonction pour vérifier si un nombre est positif
    function estPositif(int256 nombre) public returns (bool) {
        bool resultat = nombre > 0;
        emit VerificationPositif(nombre, resultat);
        return resultat;
    }
    
    // Version view de la fonction (sans événement)
    function estPositifView(int256 nombre) public pure returns (bool) {
        return nombre > 0;
    }
    
    // Fonction utilitaire pour tester avec zéro
    function estPositifOuNul(int256 nombre) public pure returns (bool) {
        return nombre >= 0;
    }
}