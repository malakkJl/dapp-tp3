import React, { useState, useEffect } from 'react';
import BaseExercice from './BaseExercice';

const Exercice3Content = ({ contract, web3, account, updateTransactionInfo }) => {
  const [newMessage, setNewMessage] = useState('');
  const [currentMessage, setCurrentMessage] = useState('');
  const [chaine1, setChaine1] = useState('');
  const [chaine2, setChaine2] = useState('');
  const [chaineConcat, setChaineConcat] = useState('');
  const [chaineLongueur, setChaineLongueur] = useState('');
  const [chaineComp1, setChaineComp1] = useState('');
  const [chaineComp2, setChaineComp2] = useState('');
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (contract) {
      loadCurrentMessage();
    }
  }, [contract]);

  const loadCurrentMessage = async () => {
    try {
      const message = await contract.methods.getMessage().call();
      setCurrentMessage(message);
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
    }
  };

  const handleSetMessage = async () => {
    if (!newMessage) return alert('Veuillez entrer un message');

    setLoading(true);
    try {
      const tx = await contract.methods.setMessage(newMessage).send({
        from: account,
        gas: 300000,
        gasPrice: await web3.eth.getGasPrice(),
      });
      updateTransactionInfo(tx.transactionHash, tx.gasUsed);
      await loadCurrentMessage();
      setResults(prev => ({
        ...prev,
        setMessage: `Message mis à jour: "${newMessage}"`,
      }));
      setNewMessage('');
    } catch (error) {
      console.error('Erreur:', error);
      setResults(prev => ({ ...prev, setMessage: 'Erreur lors de la mise à jour' }));
    }
    setLoading(false);
  };

  const handleGetMessage = async () => {
    setLoading(true);
    try {
      const message = await contract.methods.getMessage().call();
      setResults(prev => ({
        ...prev,
        getMessage: `Message actuel: "${message}"`,
      }));
    } catch (error) {
      console.error('Erreur:', error);
      setResults(prev => ({ ...prev, getMessage: 'Erreur lors de la récupération' }));
    }
    setLoading(false);
  };

  const handleConcatener = async () => {
    if (!chaine1 || !chaine2) return alert('Veuillez entrer les deux chaînes');

    setLoading(true);
    try {
      const result = await contract.methods.concatener(chaine1, chaine2).call();
      setResults(prev => ({ ...prev, concatener: `Résultat: "${result}"` }));
    } catch (error) {
      console.error('Erreur:', error);
      setResults(prev => ({ ...prev, concatener: 'Erreur lors de la concaténation' }));
    }
    setLoading(false);
  };

  const handleConcatenerAvec = async () => {
    if (!chaineConcat) return alert('Veuillez entrer une chaîne');

    setLoading(true);
    try {
      const result = await contract.methods.concatenerAvec(chaineConcat).call();
      setResults(prev => ({ ...prev, concatenerAvec: `Résultat: "${result}"` }));
    } catch (error) {
      console.error('Erreur:', error);
      setResults(prev => ({ ...prev, concatenerAvec: 'Erreur lors de la concaténation' }));
    }
    setLoading(false);
  };

  const handleLongueur = async () => {
    if (!chaineLongueur) return alert('Veuillez entrer une chaîne');

    setLoading(true);
    try {
      const result = await contract.methods.longueur(chaineLongueur).call();
      setResults(prev => ({
        ...prev,
        longueur: `Longueur de "${chaineLongueur}": ${result} caractères`,
      }));
    } catch (error) {
      console.error('Erreur:', error);
      setResults(prev => ({ ...prev, longueur: 'Erreur lors du calcul' }));
    }
    setLoading(false);
  };

  const handleComparer = async () => {
    if (!chaineComp1 || !chaineComp2) return alert('Veuillez entrer les deux chaînes à comparer');

    setLoading(true);
    try {
      const result = await contract.methods.comparer(chaineComp1, chaineComp2).call();
      setResults(prev => ({
        ...prev,
        comparer: `"${chaineComp1}" ${result ? '==' : '!='} "${chaineComp2}"`,
      }));
    } catch (error) {
      console.error('Erreur:', error);
      setResults(prev => ({ ...prev, comparer: 'Erreur lors de la comparaison' }));
    }
    setLoading(false);
  };

return (
    <div className="exercice-content">
      <div className="section">
        <h3>Gestion du message</h3>
        <div className="form-group">
          <label>Nouveau message</label>
          <div className="input-group">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Entrez votre message"
            />
            <button onClick={handleSetMessage} disabled={loading}>
              Définir message
            </button>
          </div>
        </div>
        <div className="form-group">
          <button onClick={handleGetMessage} disabled={loading}>
            Afficher message
          </button>
        </div>
        {results.setMessage && <div className="result">{results.setMessage}</div>}
        {results.getMessage && <div className="result">{results.getMessage}</div>}
      </div>

      <div className="section">
        <h3>Concaténation</h3>
        <div className="form-group">
          <label>Chaîne 1</label>
          <div className="input-group">
            <input
              type="text"
              value={chaine1}
              onChange={(e) => setChaine1(e.target.value)}
              placeholder="Première chaîne"
            />
          </div>
        </div>
        <div className="form-group">
          <label>Chaîne 2</label>
          <div className="input-group">
            <input
              type="text"
              value={chaine2}
              onChange={(e) => setChaine2(e.target.value)}
              placeholder="Deuxième chaîne"
            />
            <button onClick={handleConcatener} disabled={loading}>
              Concaténer
            </button>
          </div>
        </div>
        {results.concatener && <div className="result">{results.concatener}</div>}

        <div className="form-group">
          <label>Chaîne à concaténer avec message</label>
          <div className="input-group">
            <input
              type="text"
              value={chaineConcat}
              onChange={(e) => setChaineConcat(e.target.value)}
              placeholder="Chaîne supplémentaire"
            />
            <button onClick={handleConcatenerAvec} disabled={loading}>
              Concaténer avec message
            </button>
          </div>
        </div>
        {results.concatenerAvec && <div className="result">{results.concatenerAvec}</div>}
      </div>

      <div className="section">
        <h3>Longueur</h3>
        <div className="form-group">
          <label>Chaîne à mesurer</label>
          <div className="input-group">
            <input
              type="text"
              value={chaineLongueur}
              onChange={(e) => setChaineLongueur(e.target.value)}
              placeholder="Entrez une chaîne"
            />
            <button onClick={handleLongueur} disabled={loading}>
              Calculer longueur
            </button>
          </div>
        </div>
        {results.longueur && <div className="result">{results.longueur}</div>}
      </div>

      <div className="section">
        <h3>Comparaison</h3>
        <div className="form-group">
          <label>Chaîne 1</label>
          <div className="input-group">
            <input
              type="text"
              value={chaineComp1}
              onChange={(e) => setChaineComp1(e.target.value)}
              placeholder="Première chaîne"
            />
          </div>
        </div>
        <div className="form-group">
          <label>Chaîne 2</label>
          <div className="input-group">
            <input
              type="text"
              value={chaineComp2}
              onChange={(e) => setChaineComp2(e.target.value)}
              placeholder="Deuxième chaîne"
            />
            <button onClick={handleComparer} disabled={loading}>
              Comparer
            </button>
          </div>
        </div>
        {results.comparer && <div className="result">{results.comparer}</div>}
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
          margin-top: 10px;
          padding: 12px;
          background-color: #f0f8ff;
          border-left: 4px solid #4CAF50;
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

// Et on remplace la fonction par ce composant dans Exercice3 :
const Exercice3 = () => {
  return (
    <BaseExercice
      titre="Exercice 3 - Gestion des chaînes"
      description="Manipulation des chaînes de caractères en Solidity"
      contractName="GestionChaines"
    >
      {(contract, web3, account, updateTransactionInfo) => (
        <Exercice3Content
          contract={contract}
          web3={web3}
          account={account}
          updateTransactionInfo={updateTransactionInfo}
        />
      )}
    </BaseExercice>
  );
};

export default Exercice3;
