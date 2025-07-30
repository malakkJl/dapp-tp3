// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract Payment {
    // Variable d'état pour stocker l'adresse du destinataire
    address public recipient;
    
    // Événements
    event PaymentReceived(address from, uint256 amount);
    event Withdrawal(address to, uint256 amount);
    
    // Constructeur pour initialiser le destinataire
    constructor(address _recipient) {
        require(_recipient != address(0), "Adresse du destinataire invalide");
        recipient = _recipient;
    }
    
    // Fonction pour recevoir des paiements
    function receivePayment() public payable {
        require(msg.value > 0, "Le montant doit etre superieur a 0");
        emit PaymentReceived(msg.sender, msg.value);
    }
    
    // Fonction pour retirer les fonds
    function withdraw() public {
        require(msg.sender == recipient, "Seul le destinataire peut retirer les fonds");
        require(address(this).balance > 0, "Aucun fonds a retirer");
        
        uint256 amount = address(this).balance;
        payable(recipient).transfer(amount);
        emit Withdrawal(recipient, amount);
    }
    
    // Fonction pour obtenir le solde du contrat
    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }
    
    // Fonction pour changer le destinataire (seulement par le destinataire actuel)
    function changeRecipient(address newRecipient) public {
        require(msg.sender == recipient, "Seul le destinataire actuel peut changer l'adresse");
        require(newRecipient != address(0), "Nouvelle adresse invalide");
        recipient = newRecipient;
    }
    
    // Fonction pour recevoir des Ethers directement (fallback)
    receive() external payable {
        require(msg.value > 0, "Le montant doit etre superieur a 0");
        emit PaymentReceived(msg.sender, msg.value);
    }
}