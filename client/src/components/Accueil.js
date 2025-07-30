import React from 'react';
import { Link } from 'react-router-dom';
import './Accueil.css';

const Accueil = () => {
  const exercices = [
    { id: 1, titre: "Exercice 1", description: "Contrat simple avec variables d'état" },
    { id: 2, titre: "Exercice 2", description: "Gestion des utilisateurs" },
    { id: 3, titre: "Exercice 3", description: "Système de vote" },
    { id: 4, titre: "Exercice 4", description: "Token ERC20 simple" },
    { id: 5, titre: "Exercice 5", description: "Marketplace basique" },
    { id: 6, titre: "Exercice 6", description: "Système d'enchères" },
    { id: 7, titre: "Exercice 7", description: "Multi-signature wallet" },
    { id: 8, titre: "Exercice 8", description: "DAO (Organisation autonome décentralisée)" }
  ];

  return (
    <div className="accueil-container">
      <div className="hero-section">
        <h2>Exercices - TP3</h2>
        <p>Choisissez un exercice pour commencer à interagir avec les contrats intelligents</p>
        
        {/* Nouveau bouton pour la page Blockchain */}
        <div className="blockchain-nav">
          <Link to="/blockchain" className="blockchain-button">
            🔗 Informations Blockchain
          </Link>
        </div>
      </div>

      <div className="exercices-grid">
        {exercices.map((exercice) => (
          <div key={exercice.id} className="exercice-card">
            <div className="exercice-header">
              <h3>{exercice.titre}</h3>
              <span className="exercice-numero">#{exercice.id}</span>
            </div>
            <p className="exercice-description">{exercice.description}</p>
            <Link 
              to={`/exercice${exercice.id}`} 
              className="exercice-link"
            >
              Accéder à l'exercice →
            </Link>
          </div>
        ))}
      </div>

      <div className="info-section">
     
       
      </div>
    </div>
  );
};

export default Accueil;