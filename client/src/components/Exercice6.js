import React, { useState, useEffect } from 'react';
import BaseExercice from './BaseExercice';

const Exercice6Content = ({ contract, web3, account, updateTransactionInfo }) => {
  const [nouveauNombre, setNouveauNombre] = useState('');
  const [indexRecherche, setIndexRecherche] = useState('');
  const [tableau, setTableau] = useState([]);
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState(false);

  const clearResult = (key, delay = 5000) => {
    setTimeout(() => {
      setResults(prev => ({ ...prev, [key]: '' }));
    }, delay);
  };

  const loadTableau = async () => {
    if (!contract) return;
    try {
      console.log('Chargement du tableau...');
      const tableauActuel = await contract.methods.afficheTableau().call();
      console.log('Tableau reçu:', tableauActuel);
      const tableauConverti = tableauActuel.map(n => n.toString());
      setTableau(tableauConverti);
    } catch (error) {
      console.error('Erreur lors du chargement du tableau:', error);
      setResults(prev => ({
        ...prev,
        error: 'Erreur lors du chargement du tableau'
      }));
      clearResult('error');
    }
  };

  useEffect(() => {
    loadTableau();
  }, [contract]);

  const handleAjouterNombre = async () => {
    // Forcer le type string
    const nombreStr = String(nouveauNombre).trim();
    if (!/^\d+$/.test(nombreStr)) {
      alert('Veuillez entrer un nombre entier valide');
      return;
    }

    if (!contract || !account) {
      alert('Veuillez vous connecter');
      return;
    }

    setLoading(true);

    try {
      console.log('Ajout du nombre:', nombreStr);
      const gasEstimate = await contract.methods
        .ajouterNombre(nombreStr)
        .estimateGas({ from: account });

const gasEstimateNumber = Number(gasEstimate);
const gasLimit = Math.floor(gasEstimateNumber * 1.2);
const gasPrice = await web3.eth.getGasPrice();

const tx = await contract.methods
  .ajouterNombre(nombreStr)
  .send({
    from: account,
    gas: gasLimit,
    gasPrice: gasPrice, // 👈 ceci résout l'erreur Eip1559NotSupportedError
  });


      console.log('Transaction réussie:', tx);

      if (updateTransactionInfo) {
        updateTransactionInfo(tx.transactionHash, tx.gasUsed);
      }

      await new Promise(resolve => setTimeout(resolve, 1000));
      await loadTableau();

      setResults(prev => ({
        ...prev,
        ajouterNombre: `✅ Nombre ${nombreStr} ajouté au tableau`
      }));
      clearResult('ajouterNombre');

      setNouveauNombre('');
    } catch (error) {
      console.error('Erreur lors de l\'ajout:', error);

      let errorMessage = '❌ Erreur lors de l\'ajout';
      if (error.message && error.message.includes('User denied')) {
        errorMessage = '❌ Transaction annulée par l\'utilisateur';
      } else if (error.message && error.message.includes('insufficient funds')) {
        errorMessage = '❌ Fonds insuffisants';
      }

      setResults(prev => ({
        ...prev,
        ajouterNombre: errorMessage
      }));
      clearResult('ajouterNombre');
    }

    setLoading(false);
  };

  const handleGetElement = async () => {
    if (indexRecherche === '' || !contract) {
      alert('Veuillez entrer un index');
      return;
    }

    setLoading(true);
    try {
      const element = await contract.methods
        .getElement(parseInt(indexRecherche, 10))
        .call();
      setResults(prev => ({
        ...prev,
        getElement: `Élément à l'index ${indexRecherche}: ${element}`
      }));
      clearResult('getElement');
    } catch (error) {
      console.error('Erreur:', error);
      let errorMessage = 'Erreur lors de la récupération';
      if (error.message && (error.message.includes('Index n\'existe pas') || error.message.includes('revert'))) {
        errorMessage = `Index ${indexRecherche} invalide (tableau a ${tableau.length} éléments)`;
      }
      setResults(prev => ({
        ...prev,
        getElement: errorMessage
      }));
      clearResult('getElement');
    }
    setLoading(false);
  };

  const handleAfficheTableau = async () => {
    if (!contract) return;

    setLoading(true);
    try {
      const tableauResult = await contract.methods.afficheTableau().call();
      const tableauStr = tableauResult.length > 0 ? `[${tableauResult.join(', ')}]` : '[]';
      setResults(prev => ({
        ...prev,
        afficheTableau: `Tableau actuel: ${tableauStr}`
      }));
      setTableau(tableauResult.map(n => n.toString()));
      clearResult('afficheTableau');
    } catch (error) {
      console.error('Erreur:', error);
      setResults(prev => ({
        ...prev,
        afficheTableau: 'Erreur lors de l\'affichage'
      }));
      clearResult('afficheTableau');
    }
    setLoading(false);
  };

  const handleCalculerSomme = async () => {
    if (!contract) return;

    setLoading(true);
    try {
      const somme = await contract.methods.calculerSomme().call();
      setResults(prev => ({
        ...prev,
        calculerSomme: `Somme de tous les éléments: ${somme}`
      }));
      clearResult('calculerSomme');
    } catch (error) {
      console.error('Erreur:', error);
      setResults(prev => ({
        ...prev,
        calculerSomme: 'Erreur lors du calcul de la somme'
      }));
      clearResult('calculerSomme');
    }
    setLoading(false);
  };

  const handleAjoutsRapides = async () => {
    if (!contract || !account) return;

    const nombres = [10, 20, 30, 40, 50];
    setLoading(true);

    try {
      for (const nombre of nombres) {
        await contract.methods
          .ajouterNombre(nombre.toString())
          .send({
            from: account,
            gas: 300000
          });
      }

      await loadTableau();
      setResults(prev => ({
        ...prev,
        ajoutsRapides: `Nombres ${nombres.join(', ')} ajoutés au tableau`
      }));
      clearResult('ajoutsRapides');
    } catch (error) {
      console.error('Erreur:', error);
      setResults(prev => ({
        ...prev,
        ajoutsRapides: 'Erreur lors des ajouts rapides'
      }));
      clearResult('ajoutsRapides');
    }
    setLoading(false);
  };

  return (
    <div className="exercice-content">
      <div className="section tableau-section">
        <h3>Tableau actuel</h3>
        <div className="tableau-info">
          <div className="info-item"><strong>Taille:</strong> {tableau.length} éléments</div>
          <div className="tableau-elements">
            {tableau.length > 0 ? (
              tableau.map((el, idx) => (
                <div key={idx} className="tableau-element">
                  <span className="index">[{idx}]</span> : <span className="value">{el}</span>
                </div>
              ))
            ) : (
              <div className="empty-message">Tableau vide</div>
            )}
          </div>
        </div>
      </div>

      <div className="section">
        <h3>Ajouter un nombre</h3>
        <div className="form-group">
          <label>Nombre à ajouter</label>
          <div className="input-group">
            <input
              type="number"
              value={nouveauNombre}
              onChange={(e) => setNouveauNombre(e.target.value)}
              placeholder="Entrez un nombre entier"
              disabled={loading}
            />
            <button onClick={handleAjouterNombre} disabled={loading}>
              Ajouter
            </button>
          </div>
        </div>
        <div className="form-group">
          <button onClick={handleAjoutsRapides} disabled={loading} className="quick-add-btn">
            Ajouter 10, 20, 30, 40, 50
          </button>
        </div>
        {results.ajouterNombre && <div className="result">{results.ajouterNombre}</div>}
        {results.ajoutsRapides && <div className="result">{results.ajoutsRapides}</div>}
      </div>

      <div className="section">
        <h3>Récupérer un élément</h3>
        <div className="form-group">
          <label>Index à récupérer</label>
          <div className="input-group">
            <input
              type="number"
              value={indexRecherche}
              onChange={(e) => setIndexRecherche(e.target.value)}
              placeholder="Index dans le tableau"
              disabled={loading}
            />
            <button onClick={handleGetElement} disabled={loading}>
              Récupérer
            </button>
          </div>
        </div>
        {results.getElement && <div className="result">{results.getElement}</div>}
      </div>

      <div className="section">
        <h3>Opérations sur le tableau</h3>
        <div className="action-buttons">
          <button onClick={handleAfficheTableau} disabled={loading}>
            Afficher le tableau
          </button>
          <button onClick={handleCalculerSomme} disabled={loading}>
            Calculer la somme
          </button>
        </div>
        {results.afficheTableau && <div className="result">{results.afficheTableau}</div>}
        {results.calculerSomme && <div className="result">{results.calculerSomme}</div>}
      </div>

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
        .tableau-section {
          background-color: #f0f8ff;
        }
        .tableau-info {
          margin-top: 15px;
        }
        .info-item {
          margin-bottom: 10px;
          font-size: 14px;
        }
        .tableau-elements {
          max-height: 200px;
          overflow-y: auto;
          border: 1px solid #ddd;
          padding: 10px;
          border-radius: 4px;
          background-color: white;
        }
        .tableau-element {
          padding: 5px 0;
          border-bottom: 1px solid #eee;
          display: flex;
          align-items: center;
        }
        .tableau-element:last-child {
          border-bottom: none;
        }
        .index {
          color: #666;
          font-family: monospace;
          min-width: 50px;
        }
        .value {
          font-weight: 500;
        }
        .empty-message {
          color: #999;
          font-style: italic;
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
        .input-group {
          display: flex;
          gap: 10px;
        }
        .input-group input {
          flex: 1;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 14px;
        }
        button {
          padding: 10px 15px;
          background-color: #4caf50;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          transition: background-color 0.3s;
        }
        .quick-add-btn {
          background-color: #2196f3;
          width: 100%;
        }
        .action-buttons {
          display: flex;
          gap: 10px;
        }
        button:hover:not(:disabled) {
          opacity: 0.9;
        }
        button:disabled {
          background-color: #cccccc;
          cursor: not-allowed;
        }
        .result {
          margin-top: 10px;
          padding: 12px;
          background-color: #f0f0f0;
          border-left: 4px solid #4caf50;
          border-radius: 4px;
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

const Exercice6 = () => {
  return (
    <BaseExercice
      titre="Exercice 6 - Tableau"
      description="Gestion d'un tableau dynamique avec calcul de somme"
      contractName="Exercice6"
    >
      {(contract, web3, account, updateTransactionInfo) => (
        <Exercice6Content
          contract={contract}
          web3={web3}
          account={account}
          updateTransactionInfo={updateTransactionInfo}
        />
      )}
    </BaseExercice>
  );
};

export default Exercice6;
