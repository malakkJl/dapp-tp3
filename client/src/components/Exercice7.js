import React, { useState, useEffect } from 'react';
import BaseExercice from './BaseExercice';

const Exercice7 = () => {
  const [x, setX] = useState('');
  const [y, setY] = useState('');
  const [longueur, setLongueur] = useState('');
  const [largeur, setLargeur] = useState('');
  const [dx, setDx] = useState('');
  const [dy, setDy] = useState('');
  const [rectangleInfo, setRectangleInfo] = useState({});
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState(false);

  // Fonction appelée quand le contrat est chargé
  const handleContractLoaded = async (contract, web3) => {
    try {
      await loadRectangleInfo(contract);
    } catch (error) {
      console.error('Erreur lors du chargement initial:', error);
    }
  };

  // Charger les informations du rectangle
  const loadRectangleInfo = async (contract) => {
    try {
      const coords = await contract.methods.afficheXY().call();
      const dimensions = await contract.methods.afficheLoLa().call();
      const surface = await contract.methods.surface().call();
      
      setRectangleInfo({
        x: coords[0],
        y: coords[1],
        longueur: dimensions[0],
        largeur: dimensions[1],
        surface: surface
      });
    } catch (error) {
      console.error('Erreur lors du chargement des informations:', error);
    }
  };

  // Fonction de rendu du contenu (passée comme children)
  const renderExerciceContent = (contract, web3, account, updateTransactionInfo) => {
    const handleCreerRectangle = async () => {
      if (!x || !y || !longueur || !largeur) {
        alert('Veuillez remplir tous les champs');
        return;
      }

      setLoading(true);
      try {
        const gasPrice = await web3.eth.getGasPrice();
        const tx = await contract.methods.initialiser(x, y, longueur, largeur).send({
          from: account,
          gas: 500000,
          gasPrice
    });

        updateTransactionInfo(tx.transactionHash, tx.gasUsed);
        await loadRectangleInfo(contract);
        
        setResults(prev => ({
          ...prev,
          creerRectangle: `Rectangle créé avec succès à (${x},${y}) de ${longueur}×${largeur}`
        }));

        setX('');
        setY('');
        setLongueur('');
        setLargeur('');
      } catch (error) {
        console.error('Erreur:', error);
        setResults(prev => ({
          ...prev,
          creerRectangle: 'Erreur lors de la création du rectangle'
        }));
      }
      setLoading(false);
    };

    const handleDeplacerForme = async () => {
      if (!dx || !dy) {
        alert('Veuillez entrer les déplacements dx et dy');
        return;
      }

      setLoading(true);
      try {
        const gasPrice = await web3.eth.getGasPrice();
        const tx = await contract.methods.deplacerForme(dx, dy).send({
          from: account,
          gas: 300000,
          gasPrice
});


        updateTransactionInfo(tx.transactionHash, tx.gasUsed);
        await loadRectangleInfo(contract);
        
        setResults(prev => ({
          ...prev,
          deplacerForme: `Rectangle déplacé de (${dx}, ${dy})`
        }));

        setDx('');
        setDy('');
      } catch (error) {
        console.error('Erreur:', error);
        setResults(prev => ({
          ...prev,
          deplacerForme: 'Erreur lors du déplacement'
        }));
      }
      setLoading(false);
    };

    const handleAfficheXY = async () => {
      setLoading(true);
      try {
        const coords = await contract.methods.afficheXY().call();
        setResults(prev => ({
          ...prev,
          afficheXY: `Coordonnées actuelles: (${coords[0]}, ${coords[1]})`
        }));
      } catch (error) {
        console.error('Erreur:', error);
        setResults(prev => ({
          ...prev,
          afficheXY: 'Erreur lors de la récupération des coordonnées'
        }));
      }
      setLoading(false);
    };

    const handleAfficheInfos = async () => {
      setLoading(true);
      try {
        const info = await contract.methods.afficheInfos().call();
        setResults(prev => ({
          ...prev,
          afficheInfos: `${info}`
        }));
      } catch (error) {
        console.error('Erreur:', error);
        setResults(prev => ({
          ...prev,
          afficheInfos: 'Erreur lors de la récupération des informations'
        }));
      }
      setLoading(false);
    };

    const handleSurface = async () => {
      setLoading(true);
      try {
        const surface = await contract.methods.surface().call();
        setResults(prev => ({
          ...prev,
          surface: `Surface du rectangle: ${surface} unités²`
        }));
      } catch (error) {
        console.error('Erreur:', error);
        setResults(prev => ({
          ...prev,
          surface: 'Erreur lors du calcul de la surface'
        }));
      }
      setLoading(false);
    };

    const handleAfficheLoLa = async () => {
      setLoading(true);
      try {
        const dimensions = await contract.methods.afficheLoLa().call();
        setResults(prev => ({
          ...prev,
          afficheLoLa: `Dimensions: Longueur = ${dimensions[0]}, Largeur = ${dimensions[1]}`
        }));
      } catch (error) {
        console.error('Erreur:', error);
        setResults(prev => ({
          ...prev,
          afficheLoLa: 'Erreur lors de la récupération des dimensions'
        }));
      }
      setLoading(false);
    };

   return (
      <div className="exercice-content">
        <div className="header-section">
          <h2>Héritage et Programmation Orientée Objet</h2>
          <p className="description">
            Contrat abstrait <code>Forme</code> et contrat <code>Rectangle</code> qui en hérite
          </p>
        </div>

        {/* Visualisation du rectangle */}
        <div className="visualization-section">
          <div className="rectangle-container">
            <div className="rectangle-visual">
              <svg width="100%" height="200" viewBox="0 0 300 200" className="rectangle-svg">
                <defs>
                  <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e2e8f0" strokeWidth="0.5"/>
                  </pattern>
                </defs>
                <rect width="300" height="200" fill="url(#grid)" />
                
                {rectangleInfo.longueur && rectangleInfo.largeur && (
                  <>
                    <rect
                      x={Math.max(10, Math.min(250, parseInt(rectangleInfo.x) * 5 || 50))}
                      y={Math.max(10, Math.min(150, parseInt(rectangleInfo.y) * 5 || 50))}
                      width={Math.min(240, parseInt(rectangleInfo.longueur) * 5 || 40)}
                      height={Math.min(140, parseInt(rectangleInfo.largeur) * 5 || 30)}
                      fill="#3b82f6"
                      fillOpacity="0.7"
                      stroke="#1e40af"
                      strokeWidth="2"
                    />
                    <circle 
                      cx={Math.max(10, Math.min(250, parseInt(rectangleInfo.x) * 5 || 50))} 
                      cy={Math.max(10, Math.min(150, parseInt(rectangleInfo.y) * 5 || 50))} 
                      r="4" 
                      fill="#ef4444" 
                    />
                    <text 
                      x={Math.max(15, Math.min(255, parseInt(rectangleInfo.x) * 5 + 10 || 60))} 
                      y={Math.max(15, Math.min(145, parseInt(rectangleInfo.y) * 5 - 10 || 40))} 
                      fontSize="12" 
                      fill="#374151"
                      fontWeight="bold"
                    >
                      ({rectangleInfo.x || 0}, {rectangleInfo.y || 0})
                    </text>
                  </>
                )}
              </svg>
            </div>
            
            <div className="rectangle-info">
              <div className="info-item">
                <span className="info-label">Position:</span>
                <span className="info-value">({rectangleInfo.x || 0}, {rectangleInfo.y || 0})</span>
              </div>
              <div className="info-item">
                <span className="info-label">Dimensions:</span>
                <span className="info-value">{rectangleInfo.longueur || 0} × {rectangleInfo.largeur || 0}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Surface:</span>
                <span className="info-value">{rectangleInfo.surface || 0} unités²</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sections d'actions */}
        <div className="action-sections">
          {/* Création du rectangle */}
          <div className="action-section">
            <h3>Créer un rectangle</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>Position X</label>
                <input
                  type="number"
                  value={x}
                  onChange={(e) => setX(e.target.value)}
                  placeholder="Coordonnée X"
                />
              </div>
              <div className="form-group">
                <label>Position Y</label>
                <input
                  type="number"
                  value={y}
                  onChange={(e) => setY(e.target.value)}
                  placeholder="Coordonnée Y"
                />
              </div>
              <div className="form-group">
                <label>Longueur</label>
                <input
                  type="number"
                  value={longueur}
                  onChange={(e) => setLongueur(e.target.value)}
                  placeholder="Longueur"
                />
              </div>
              <div className="form-group">
                <label>Largeur</label>
                <input
                  type="number"
                  value={largeur}
                  onChange={(e) => setLargeur(e.target.value)}
                  placeholder="Largeur"
                />
              </div>
            </div>
            <button 
              onClick={handleCreerRectangle}
              disabled={loading}
              className="action-btn primary"
            >
              {loading ? 'Création en cours...' : 'Créer le rectangle'}
            </button>
            {results.creerRectangle && (
              <div className="result-box success">
                {results.creerRectangle}
              </div>
            )}
          </div>

          {/* Déplacement du rectangle */}
          <div className="action-section">
            <h3>Déplacer le rectangle</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Déplacement X (dx)</label>
                <input
                  type="number"
                  value={dx}
                  onChange={(e) => setDx(e.target.value)}
                  placeholder="Déplacement en X"
                />
              </div>
              <div className="form-group">
                <label>Déplacement Y (dy)</label>
                <input
                  type="number"
                  value={dy}
                  onChange={(e) => setDy(e.target.value)}
                  placeholder="Déplacement en Y"
                />
              </div>
            </div>
            <button 
              onClick={handleDeplacerForme}
              disabled={loading}
              className="action-btn primary"
            >
              {loading ? 'Déplacement en cours...' : 'Déplacer le rectangle'}
            </button>
            {results.deplacerForme && (
              <div className="result-box success">
                {results.deplacerForme}
              </div>
            )}
          </div>

          {/* Fonctions d'affichage */}
          <div className="action-section">
            <h3>Fonctions d'affichage</h3>
            <div className="button-grid">
              <button 
                onClick={handleAfficheXY}
                disabled={loading}
                className="action-btn"
              >
                Afficher XY
              </button>
              <button 
                onClick={handleAfficheLoLa}
                disabled={loading}
                className="action-btn"
              >
                Afficher Lo/La
              </button>
              <button 
                onClick={handleSurface}
                disabled={loading}
                className="action-btn"
              >
                Calculer surface
              </button>
              <button 
                onClick={handleAfficheInfos}
                disabled={loading}
                className="action-btn"
              >
                Afficher infos
              </button>
            </div>
            
            {(results.afficheXY || results.afficheLoLa || results.surface || results.afficheInfos) && (
              <div className="result-box">
                {results.afficheXY && <div>{results.afficheXY}</div>}
                {results.afficheLoLa && <div>{results.afficheLoLa}</div>}
                {results.surface && <div>{results.surface}</div>}
                {results.afficheInfos && <div>{results.afficheInfos}</div>}
              </div>
            )}
          </div>
        </div>

        <style jsx>{`
          .exercice-content {
            max-width: 1000px;
            margin: 0 auto;
            padding: 20px;
          }

          .header-section {
            text-align: center;
            margin-bottom: 30px;
          }

          .header-section h2 {
            color: #2c3e50;
            margin-bottom: 10px;
          }

          .description {
            color: #666;
            font-size: 1.1rem;
            max-width: 600px;
            margin: 0 auto;
          }

          .visualization-section {
            background: white;
            border-radius: 10px;
            padding: 20px;
            margin-bottom: 30px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.05);
          }

          .rectangle-container {
            display: flex;
            flex-wrap: wrap;
            gap: 30px;
          }

          .rectangle-visual {
            flex: 1;
            min-width: 300px;
          }

          .rectangle-svg {
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            background: white;
          }

          .rectangle-info {
            flex: 1;
            min-width: 200px;
            display: flex;
            flex-direction: column;
            justify-content: center;
          }

          .info-item {
            margin-bottom: 15px;
          }

          .info-label {
            display: block;
            font-weight: 500;
            color: #4b5563;
            margin-bottom: 5px;
          }

          .info-value {
            font-size: 1.1rem;
            font-weight: 600;
            color: #1f2937;
          }

          .action-sections {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 25px;
          }

          .action-section {
            background: white;
            border-radius: 10px;
            padding: 20px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.05);
          }

          .form-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
            gap: 15px;
            margin-bottom: 20px;
          }

          .form-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
            margin-bottom: 20px;
          }

          .form-group {
            margin-bottom: 0;
          }

          .form-group label {
            display: block;
            margin-bottom: 8px;
            font-weight: 500;
            color: #4b5563;
          }

          .form-group input {
            width: 100%;
            padding: 10px;
            border: 1px solid #d1d5db;
            border-radius: 6px;
            font-size: 14px;
          }

          .button-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
            margin-bottom: 20px;
          }

          .action-btn {
            width: 100%;
            padding: 12px;
            border: none;
            border-radius: 6px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s;
            margin-bottom: 10px;
          }

          .action-btn.primary {
            background: #3b82f6;
            color: white;
          }

          .action-btn.primary:hover {
            background: #2563eb;
          }

          .action-btn {
            background: #e5e7eb;
            color: #4b5563;
          }

          .action-btn:hover {
            background: #d1d5db;
          }

          button:disabled {
            background: #f3f4f6 !important;
            color: #9ca3af !important;
            cursor: not-allowed;
          }

          .result-box {
            padding: 15px;
            border-radius: 6px;
            font-size: 14px;
            margin-top: 15px;
          }

          .result-box.success {
            background: #ecfdf5;
            color: #065f46;
            border-left: 4px solid #10b981;
          }

          .result-box {
            background: #f3f4f6;
            color: #1f2937;
            border-left: 4px solid #9ca3af;
          }

          @media (max-width: 768px) {
            .rectangle-container {
              flex-direction: column;
            }
            
            .rectangle-visual {
              min-width: 100%;
            }
            
            .button-grid {
              grid-template-columns: 1fr;
            }
          }
        `}</style>
      </div>
    );
  };

  return (
    <BaseExercice
      titre="Exercice 7 - POO et Héritage"
      description="Contrat abstrait Forme et Rectangle concret avec héritage"
      contractName="Rectangle"
      onContractLoaded={handleContractLoaded}
    >
      {renderExerciceContent}
    </BaseExercice>
  );
};

export default Exercice7;