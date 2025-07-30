// SPDX-License-Identifier: MIT 
pragma solidity ^0.8.19;

// Contrat abstrait Forme
abstract contract Forme {
    uint256 public x;
    uint256 public y;

    event FormeDeplacement(uint256 nouvelleX, uint256 nouvelleY);

    constructor(uint256 _x, uint256 _y) {
        x = _x;
        y = _y;
    }

    function deplacerForme(uint256 dx, uint256 dy) public {
        x = dx;
        y = dy;
        emit FormeDeplacement(dx, dy);
    }

    function afficheXY() public view returns (uint256, uint256) {
        return (x, y);
    }

    function afficheInfos() public pure virtual returns (string memory) {
        return "Je suis une forme";
    }

    function surface() public view virtual returns (uint256);
}

// Contrat Rectangle
contract Rectangle is Forme {
    uint256 public lo;
    uint256 public la;

    event DimensionsModifiees(uint256 longueur, uint256 largeur);

    constructor(uint256 _x, uint256 _y, uint256 _longueur, uint256 _largeur)
        Forme(_x, _y)
    {
        lo = _longueur;
        la = _largeur;
    }

    // ✅ Fonction initialiser placée ici, dans Rectangle
    function initialiser(uint256 _x, uint256 _y, uint256 _longueur, uint256 _largeur) public {
        x = _x;
        y = _y;
        lo = _longueur;
        la = _largeur;
        emit FormeDeplacement(_x, _y);
        emit DimensionsModifiees(_longueur, _largeur);
    }

    function surface() public view override returns (uint256) {
        return lo * la;
    }

    function afficheInfos() public pure override returns (string memory) {
        return "Je suis Rectangle";
    }

    function afficheLoLa() public view returns (uint256, uint256) {
        return (lo, la);
    }

    function setDimensions(uint256 _longueur, uint256 _largeur) public {
        lo = _longueur;
        la = _largeur;
        emit DimensionsModifiees(_longueur, _largeur);
    }

    function perimetre() public view returns (uint256) {
        return 2 * (lo + la);
    }
}
