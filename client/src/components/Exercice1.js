import React, { useState, useEffect } from 'react';
import BaseExercice from './BaseExercice';

const Exercice1 = () => {
  const [paramA, setParamA] = useState('');
  const [paramB, setParamB] = useState('');
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState(false);

  const handleContractLoaded = async (contract) => {
    try {
      const val1 = await contract.methods.nombre1().call();
      const val2 = await contract.methods.nombre2().call();
      setResults(prev => ({
        ...prev,
        nombre1: val1,
        nombre2: val2
      }));
    } catch (error) {
      console.error('Erreur de chargement:', error);
    }
  };

  const renderExerciceContent = (contract, web3, account, updateTransactionInfo) => {
    const handleAddition1 = async () => {
      setLoading(true);
      try {
        const result = await contract.methods.addition1().call();
        setResults(prev => ({
          ...prev,
          addition1: `Somme des variables d'état: ${result}`
        }));
      } catch (error) {
        console.error('Erreur:', error);
        setResults(prev => ({
          ...prev,
          addition1: 'Erreur lors du calcul'
        }));
      }
      setLoading(false);
    };

    const handleAddition2 = async () => {
      if (!paramA || !paramB) {
        alert('Veuillez entrer les deux paramètres');
        return;
      }

      setLoading(true);
      try {
        const result = await contract.methods.addition2(parseInt(paramA), parseInt(paramB)).call();
        setResults(prev => ({
          ...prev,
          addition2: `Somme de ${paramA} + ${paramB} = ${result}`
        }));
      } catch (error) {
        console.error('Erreur:', error);
        setResults(prev => ({
          ...prev,
          addition2: 'Erreur lors du calcul'
        }));
      }
      setLoading(false);
    };

    return (
      <div className="exercice-content">
        <div className="section">
          <h3>Valeurs du contrat</h3>
          <div className="current-values">
            <div className="value-display">
              <label>Nombre 1:</label>
              <div className="value">{results.nombre1 || 'Chargement...'}</div>
            </div>
            <div className="value-display">
              <label>Nombre 2:</label>
              <div className="value">{results.nombre2 || 'Chargement...'}</div>
            </div>
          </div>
        </div>

        <div className="section">
          <h3>Addition 1 (fonction view)</h3>
          <p className="description">Somme des variables d'état du contrat</p>
          <div className="action-buttons">
            <button onClick={handleAddition1} disabled={loading}>
              {loading ? 'Calcul...' : 'Calculer addition1()'}
            </button>
          </div>
          {results.addition1 && <div className="result">{results.addition1}</div>}
        </div>

        <div className="section">
          <h3>Addition 2 (fonction pure)</h3>
          <p className="description">Somme de deux paramètres</p>
          <div className="form-group">
            <label>Paramètre A</label>
            <input
              type="number"
              value={paramA}
              onChange={(e) => setParamA(e.target.value)}
              placeholder="Premier nombre"
            />
          </div>
          <div className="form-group">
            <label>Paramètre B</label>
            <input
              type="number"
              value={paramB}
              onChange={(e) => setParamB(e.target.value)}
              placeholder="Deuxième nombre"
            />
          </div>
          <div className="action-buttons">
            <button onClick={handleAddition2} disabled={loading}>
              {loading ? 'Calcul...' : 'Calculer addition2()'}
            </button>
          </div>
          {results.addition2 && <div className="result">{results.addition2}</div>}
        </div>

        {/* CSS intégré */}
        <style jsx>{`
          .exercice-content {
            padding: 20px;
            max-width: 800px;
            margin: 0 auto;
          }

          .section {
            margin-bottom: 30px;
            padding: 20px;
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            background-color: #f9f9f9;
          }

          .current-values {
            display: flex;
            gap: 20px;
            margin-bottom: 15px;
          }

          .value-display {
            flex: 1;
          }

          .value-display label {
            display: block;
            margin-bottom: 5px;
            font-weight: 500;
            color: #555;
          }

          .value {
            padding: 10px;
            background-color: white;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-family: monospace;
          }

          .form-group {
            margin-bottom: 15px;
          }

          .form-group label {
            display: block;
            margin-bottom: 8px;
            font-weight: 500;
            color: #333;
          }

          .form-group input {
            width: 100%;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 14px;
          }

          .action-buttons {
            margin-top: 15px;
          }

          button {
            padding: 10px 15px;
            background-color: #4CAF50;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            transition: background-color 0.3s;
          }

          button:hover {
            background-color: #45a049;
          }

          button:disabled {
            background-color: #cccccc;
            cursor: not-allowed;
          }

          .result {
            margin-top: 15px;
            padding: 12px;
            background-color: #f0f8ff;
            border-left: 4px solid #4CAF50;
            border-radius: 4px;
            font-size: 14px;
          }

          .description {
            color: #666;
            margin-bottom: 15px;
            font-size: 14px;
          }

          h3 {
            margin-top: 0;
            margin-bottom: 20px;
            color: #2c3e50;
            border-bottom: 1px solid #eee;
            padding-bottom: 10px;
          }
        `}</style>
      </div>
    );
  };

  return (
    <BaseExercice
      titre="Exercice 1 - Addition"
      description="Contrat avec deux nombres comme variables d'état et deux fonctions d'addition"
      contractName="Exercice1"
      onContractLoaded={handleContractLoaded}
    >
      {renderExerciceContent}
    </BaseExercice>
  );
};

export default Exercice1;
