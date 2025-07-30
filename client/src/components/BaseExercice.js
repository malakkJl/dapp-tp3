import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Web3 from 'web3';
import './BaseExercice.css';

const BaseExercice = ({ 
  titre, 
  description, 
  contractName, 
  children,
  onContractLoaded 
}) => {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState('');
  const [loading, setLoading] = useState(true);
  const [blockInfo, setBlockInfo] = useState({});
  const [lastTransaction, setLastTransaction] = useState({});
  const [error, setError] = useState('');

  useEffect(() => {
    initWeb3();
  }, []);

  const initWeb3 = async () => {
    try {
      setLoading(true);
      
      // Connexion à Ganache
      const web3Instance = new Web3('http://127.0.0.1:8545');
      setWeb3(web3Instance);

      // Récupérer les comptes
      const accounts = await web3Instance.eth.getAccounts();
      if (accounts.length > 0) {
        setAccount(accounts[0]);
      }

      // Charger le contrat
      await loadContract(web3Instance);
      
      // Charger les infos blockchain
      await loadBlockchainInfo(web3Instance);
      
      setLoading(false);
    } catch (error) {
      console.error('Erreur lors de l\'initialisation:', error);
      setError('Erreur de connexion à la blockchain. Vérifiez que Ganache est démarré.');
      setLoading(false);
    }
  };

  const loadContract = async (web3Instance) => {
    try {
      // Charger l'ABI et l'adresse du contrat
      const contractABI = require(`../contracts/${contractName}.json`);
      const networkId = await web3Instance.eth.net.getId();
      const deployedNetwork = contractABI.networks[networkId];
      
      if (deployedNetwork) {
        const contractInstance = new web3Instance.eth.Contract(
          contractABI.abi,
          deployedNetwork.address
        );
        setContract(contractInstance);
        
        // Callback pour passer le contrat au composant parent
        if (onContractLoaded) {
          onContractLoaded(contractInstance, web3Instance);
        }
      } else {
        throw new Error('Contrat non déployé sur ce réseau');
      }
    } catch (error) {
      console.error('Erreur lors du chargement du contrat:', error);
      setError(`Erreur lors du chargement du contrat ${contractName}`);
    }
  };

  const loadBlockchainInfo = async (web3Instance) => {
    try {
      const latestBlockNumber = await web3Instance.eth.getBlockNumber();
      const latestBlock = await web3Instance.eth.getBlock(latestBlockNumber);
      
      setBlockInfo({
        blockNumber: latestBlockNumber,
        timestamp: new Date(Number(latestBlock.timestamp) * 1000).toLocaleString(),
        gasLimit: latestBlock.gasLimit,
        gasUsed: latestBlock.gasUsed
      });
    } catch (error) {
      console.error('Erreur lors du chargement des infos blockchain:', error);
    }
  };

  const updateTransactionInfo = (txHash, gasUsed = null) => {
    setLastTransaction({
      hash: txHash,
      gasUsed: gasUsed,
      timestamp: new Date().toLocaleString()
    });
  };

  if (loading) {
    return (
      <div className="exercice-container">
        <div className="loading">
          <div className="spinner"></div>
          <p>Chargement de la blockchain...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="exercice-container">
        <div className="error-message">
          <h3>Erreur</h3>
          <p>{error}</p>
          <button onClick={initWeb3} className="btn btn-primary">
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="exercice-container">
      {/* Header */}
      <header className="exercice-header">
        <div className="exercice-title">
          <h1>{titre}</h1>
          <p>{description}</p>
        </div>
        <Link to="/" className="btn btn-secondary">
          ← Retour au sommaire
        </Link>
      </header>

     

      {/* Contenu principal - passé par les enfants */}
      <div className="exercice-content">
      {typeof children === 'function'
        ? children(contract, web3, account, updateTransactionInfo)
        : null}

      </div>
    </div>
  );
};

export default BaseExercice;