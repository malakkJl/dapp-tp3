import React, { useState } from 'react';
import BaseExercice from './BaseExercice';

const Exercice2 = () => {
  const [etherAmount, setEtherAmount] = useState('');
  const [weiAmount, setWeiAmount] = useState('');
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState(false);

  const renderExerciceContent = (contract, web3, account, updateTransactionInfo) => {
    const handleEtherToWei = async () => {
      if (!etherAmount) {
        alert('Veuillez entrer un montant en Ether');
        return;
      }

      setLoading(true);
      try {
        const result = await contract.methods.etherEnWei(etherAmount).call();
        setResults(prev => ({
          ...prev,
          etherToWei: `${etherAmount} ETH = ${result} Wei`
        }));
      } catch (error) {
        console.error('Erreur:', error);
        setResults(prev => ({
          ...prev,
          etherToWei: 'Erreur lors de la conversion'
        }));
      }
      setLoading(false);
    };

    const handleWeiToEther = async () => {
      if (!weiAmount) {
        alert('Veuillez entrer un montant en Wei');
        return;
      }

      setLoading(true);
      try {
        const result = await contract.methods.weiEnEther(weiAmount).call();
        setResults(prev => ({
          ...prev,
          weiToEther: `${weiAmount} Wei = ${result} ETH`
        }));
      } catch (error) {
        console.error('Erreur:', error);
        setResults(prev => ({
          ...prev,
          weiToEther: 'Erreur lors de la conversion'
        }));
      }
      setLoading(false);
    };

    return (
      <div className="exercice-content">
        <h2>Exercice 2 - Conversion de cryptomonnaies</h2>
        <p className="exercice-description">
          Ce contrat permet de convertir des montants entre Ether et Wei. 
          1 Ether = 10¹⁸ Wei
        </p>

        {/* Conversion Ether → Wei */}
        <div className="section">
          <h3>Conversion Ether → Wei</h3>
          <div className="form-group">
            <label className="form-label">Montant en Ether:</label>
            <input
              type="number"
              className="form-input"
              value={etherAmount}
              onChange={(e) => setEtherAmount(e.target.value)}
              placeholder="Entrez le montant en ETH"
              step="0.000000000000000001"
            />
          </div>
          <button 
            onClick={handleEtherToWei}
            disabled={loading}
            className="btn btn-primary"
          >
            {loading ? 'Conversion...' : 'Convertir en Wei'}
          </button>
          {results.etherToWei && (
            <div className="result-section">
              <div className="result-title">Résultat:</div>
              <div className="result-content">{results.etherToWei}</div>
            </div>
          )}
        </div>

        {/* Conversion Wei → Ether */}
        <div className="section">
          <h3>Conversion Wei → Ether</h3>
          <div className="form-group">
            <label className="form-label">Montant en Wei:</label>
            <input
              type="number"
              className="form-input"
              value={weiAmount}
              onChange={(e) => setWeiAmount(e.target.value)}
              placeholder="Entrez le montant en Wei"
            />
          </div>
          <button 
            onClick={handleWeiToEther}
            disabled={loading}
            className="btn btn-primary"
          >
            {loading ? 'Conversion...' : 'Convertir en Ether'}
          </button>
          {results.weiToEther && (
            <div className="result-section">
              <div className="result-title">Résultat:</div>
              <div className="result-content">{results.weiToEther}</div>
            </div>
          )}
        </div>

      </div>
    );
  };

  return (
    <BaseExercice
      titre="Exercice 2 - Conversion"
      description="Convertit des cryptomonnaies entre Ether et Wei"
      contractName="Exercice2"
    >
      {renderExerciceContent}
    </BaseExercice>
  );
};

export default Exercice2;
