// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract GestionChaines {
    // Variable d'état de type string
    string public message;
    
    // Événement
    event MessageModifie(string nouveauMessage);
    
    // Constructeur
    constructor() {
        message = "Message initial";
    }
    
    // Fonction pour modifier la valeur de message
    function setMessage(string memory _message) public {
        message = _message;
        emit MessageModifie(_message);
    }
    
    // Fonction pour retourner la valeur de message
    function getMessage() public view returns (string memory) {
        return message;
    }
    
    // Fonction qui concatène deux chaînes passées en paramètres
    function concatener(string memory a, string memory b) public pure returns (string memory) {
        return string.concat(a, b);
    }
    
    // Fonction qui concatène message avec une autre chaîne
    function concatenerAvec(string memory autreChaine) public view returns (string memory) {
        return string.concat(message, autreChaine);
    }
    
    // Fonction qui retourne la longueur d'une chaîne
    function longueur(string memory s) public pure returns (uint256) {
        return bytes(s).length;
    }
    
    // Fonction qui compare deux chaînes et retourne un booléen
    function comparer(string memory a, string memory b) public pure returns (bool) {
        return keccak256(abi.encodePacked(a)) == keccak256(abi.encodePacked(b));
    }
    
    // Fonction pour obtenir la longueur du message actuel
    function longueurMessage() public view returns (uint256) {
        return bytes(message).length;
    }
}