import React, { useState, useEffect } from 'react';
import './Blockchain.css';

const Blockchain = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [account, setAccount] = useState('');
  const [balance, setBalance] = useState('0');
  const [blockData, setBlockData] = useState({
    number: '-',
    hash: '-',
    timestamp: '-',
    txCount: '-'
  });
  const [networkData, setNetworkData] = useState({
    name: '-',
    chainId: '-',
    gasPrice: '-'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const checkMetaMask = () => {
    if (typeof window.ethereum !== 'undefined') {
      console.log('MetaMask détecté !');
      return true;
    } else {
      setError('MetaMask n\'est pas installé. Veuillez l\'installer depuis metamask.io');
      return false;
    }
  };

  const connectMetaMask = async () => {
    if (!checkMetaMask()) return;

    try {
      setLoading(true);
      setError('');
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setAccount(accounts[0]);
      setIsConnected(true);
      await loadBlockchainData(accounts[0]);
    } catch (err) {
      console.error('Erreur de connexion:', err);
      setError('Erreur de connexion à MetaMask: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadBlockchainData = async (userAccount = account) => {
    if (!window.ethereum || !userAccount) return;

    try {
      setLoading(true);
      setError('');

      const blockNumber = await window.ethereum.request({ method: 'eth_blockNumber' });
      const blockNumberDec = parseInt(blockNumber, 16);

      const block = await window.ethereum.request({
        method: 'eth_getBlockByNumber',
        params: [blockNumber, false]
      });

      const balanceWei = await window.ethereum.request({
        method: 'eth_getBalance',
        params: [userAccount, 'latest']
      });
      const balanceEth = parseInt(balanceWei, 16) / 1e18;

      const gasPrice = await window.ethereum.request({ method: 'eth_gasPrice' });
      const gasPriceGwei = parseInt(gasPrice, 16) / 1e9;

      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      const chainIdDec = parseInt(chainId, 16);

      setBalance(balanceEth.toFixed(4));
      setBlockData({
        number: blockNumberDec,
        hash: block.hash,
        timestamp: new Date(parseInt(block.timestamp, 16) * 1000).toLocaleString(),
        txCount: block.transactions.length
      });
      setNetworkData({
        name: getNetworkName(chainIdDec),
        chainId: chainIdDec,
        gasPrice: gasPriceGwei.toFixed(2) + ' Gwei'
      });
    } catch (err) {
      console.error('Erreur lors du chargement des données:', err);
      setError('Erreur lors du chargement des données: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const getNetworkName = (chainId) => {
    const networks = {
      1: 'Ethereum Mainnet',
      3: 'Ropsten Testnet',
      4: 'Rinkeby Testnet',
      5: 'Goerli Testnet',
      42: 'Kovan Testnet',
      56: 'Binance Smart Chain',
      137: 'Polygon',
      1337: 'Ganache Local',
      11155111: 'Sepolia Testnet'
    };
    return networks[chainId] || `Réseau inconnu (${chainId})`;
  };

  useEffect(() => {
    const checkConnection = async () => {
      if (!checkMetaMask()) return;

      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          setIsConnected(true);
          await loadBlockchainData(accounts[0]);
        }
      } catch (err) {
        console.error('Erreur lors de la vérification de la connexion:', err);
      }
    };

    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          setIsConnected(true);
          loadBlockchainData(accounts[0]);
        } else {
          setIsConnected(false);
          setAccount('');
        }
      });

      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      });

      checkConnection();
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeAllListeners('accountsChanged');
        window.ethereum.removeAllListeners('chainChanged');
      }
    };
  }, []);

  return (
    <div className="blockchain-container">
      <h1>🔗 Informations Blockchain</h1>
      
      <div className={`status ${isConnected ? 'connected' : 'disconnected'}`}>
        {isConnected ? 'MetaMask connecté ✅' : 'MetaMask non connecté ❌'}
      </div>
      
      <div className="buttons-container">
        <button onClick={connectMetaMask} className="connect-btn" disabled={isConnected || loading}>
          {isConnected ? 'Connecté' : 'Se connecter à MetaMask'}
        </button>
        <button onClick={() => loadBlockchainData()} className="refresh-btn" disabled={!isConnected || loading}>
          Actualiser les données
        </button>
      </div>
      
      {isConnected && (
        <div className="account-info">
          <div className="info-row">
            <span className="label">Adresse du compte :</span>
            <span className="value">{account}</span>
          </div>
          <div className="balance">Solde : {balance} ETH</div>
        </div>
      )}
      
      <div className="blockchain-info">
        <h3>📦 Dernier bloc :</h3>
        <div className="info-row">
          <span className="label">Numéro :</span>
          <span className="value">{blockData.number}</span>
        </div>
        <div className="info-row">
          <span className="label">Hash :</span>
          <span className="value">{blockData.hash}</span>
        </div>
        <div className="info-row">
          <span className="label">Timestamp :</span>
          <span className="value">{blockData.timestamp}</span>
        </div>
        <div className="info-row">
          <span className="label">Transactions :</span>
          <span className="value">{blockData.txCount}</span>
        </div>
      </div>
      
      <div className="blockchain-info">
        <h3>🌐 Réseau :</h3>
        <div className="info-row">
          <span className="label">Nom :</span>
          <span className="value">{networkData.name}</span>
        </div>
        <div className="info-row">
          <span className="label">Chain ID :</span>
          <span className="value">{networkData.chainId}</span>
        </div>
        <div className="info-row">
          <span className="label">Prix du gas :</span>
          <span className="value">{networkData.gasPrice}</span>
        </div>
      </div>
      
      {error && <div className="error">{error}</div>}
      {loading && <div className="loading">Chargement des données blockchain...</div>}
    </div>
  );
};

export default Blockchain;