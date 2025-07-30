const Exercice1 = artifacts.require("Exercice1");
const Exercice2 = artifacts.require("Exercice2");
const GestionChaines = artifacts.require("GestionChaines");
const Exercice4 = artifacts.require("Exercice4");
const Exercice5 = artifacts.require("Exercice5");
const Exercice6 = artifacts.require("Exercice6");
const Rectangle = artifacts.require("Rectangle");
const Payment = artifacts.require("Payment");

module.exports = function (deployer, network, accounts) {
  // Déploiement de tous les contrats
  deployer.deploy(Exercice1);
  deployer.deploy(Exercice2);
  deployer.deploy(GestionChaines);
  deployer.deploy(Exercice4);
  deployer.deploy(Exercice5);
  deployer.deploy(Exercice6);
  
  // Rectangle avec des paramètres par défaut (x=0, y=0, longueur=10, largeur=5)
  deployer.deploy(Rectangle, 0, 0, 10, 5);
  
  // Payment avec le premier compte comme destinataire
  deployer.deploy(Payment, accounts[0]);
};