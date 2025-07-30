// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract Exercice6 {
    // Tableau dynamique pour stocker les nombres
    uint256[] public nombres;
    
    // Événements
    event NombreAjoute(uint256 nombre);
    event SommeCalculee(uint256 somme);
    
    // Constructeur - initialise le tableau avec quelques valeurs
    constructor() {
        nombres.push(10);
        nombres.push(20);
        nombres.push(30);
    }
    
    // Fonction pour ajouter un nombre au tableau
    function ajouterNombre(uint256 nombre) public {
        nombres.push(nombre);
        emit NombreAjoute(nombre);
    }
    
    // Fonction qui retourne l'élément à l'indice donné
    function getElement(uint256 index) public view returns (uint256) {
        require(index < nombres.length, "Index n'existe pas dans le tableau");
        return nombres[index];
    }
    
    // Fonction qui retourne le tableau complet
    function afficheTableau() public view returns (uint256[] memory) {
        return nombres;
    }
    
    // Fonction qui calcule et retourne la somme des nombres
    function calculerSomme() public returns (uint256) {
        uint256 somme = 0;
        for (uint256 i = 0; i < nombres.length; i++) {
            somme += nombres[i];
        }
        emit SommeCalculee(somme);
        return somme;
    }
    
    // Version view de calculer somme (sans événement)
    function calculerSommeView() public view returns (uint256) {
        uint256 somme = 0;
        for (uint256 i = 0; i < nombres.length; i++) {
            somme += nombres[i];
        }
        return somme;
    }
    
    // Fonction pour obtenir la taille du tableau
    function getTailleTableau() public view returns (uint256) {
        return nombres.length;
    }
    
    // Fonction pour supprimer le dernier élément
    function supprimerDernier() public {
        require(nombres.length > 0, "Le tableau est vide");
        nombres.pop();
    }
}