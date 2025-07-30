import React, { useState, useEffect } from 'react';
import BaseExercice from './BaseExercice';

const Exercice8 = () => {
  const [paymentAmount, setPaymentAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [contractBalance, setContractBalance] = useState('0');
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState(false);

  // Fonction appelée quand le contrat est chargé
  const handleContractLoaded = async (contract, web3) => {
    try {
      // Récupérer l'adresse du destinataire
      const recipientAddress = await contract.methods.recipient().call();
      setRecipient(recipientAddress);
      
      // Récupérer le solde du contrat
      const balance = await web3.eth.getBalance(contract.options.address);
      setContractBalance(web3.utils.fromWei(balance, 'ether'));
    } catch (error) {
      console.error('Erreur lors du chargement initial:', error);
    }
  };

  // Contenu de l'exercice
  const renderExerciceContent = (contract, web3, account, updateTransactionInfo) => {
    const loadContractInfo = async () => {
      try {
        const recipientAddress = await contract.methods.recipient().call();
        setRecipient(recipientAddress);

        const balance = await web3.eth.getBalance(contract.options.address);
        setContractBalance(web3.utils.fromWei(balance, 'ether'));
      } catch (error) {
        console.error('Erreur lors du chargement des informations:', error);
      }
    };

    const handleSendPayment = async () => {
      if (!paymentAmount || parseFloat(paymentAmount) <= 0) {
        alert('Veuillez entrer un montant valide (> 0)');
        return;
      }

      setLoading(true);
      try {
        const valueInWei = web3.utils.toWei(paymentAmount, 'ether');
        const gasEstimate = await contract.methods.receivePayment().estimateGas({
          from: account,
          value: valueInWei,
        });
        const gasPrice = await web3.eth.getGasPrice();
        const tx = await contract.methods.receivePayment().send({
          from: account,
          value: valueInWei,
          gas: Math.floor(Number(gasEstimate) * 1.2),
          gasPrice: gasPrice
        });

        updateTransactionInfo(tx.transactionHash, tx.gasUsed);

        await loadContractInfo();

        setResults(prev => ({
          ...prev,
          sendPayment: `✅ Paiement de ${paymentAmount} ETH envoyé avec succès!`,
        }));

        setPaymentAmount('');
      } catch (error) {
        console.error('Erreur complète:', error);
        let errorMessage = '❌ Erreur lors du paiement';

        if (error.message.includes('Le montant doit être supérieur à 0')) {
          errorMessage = '❌ Le montant doit être supérieur à 0 ETH';
        } else if (error.message.includes('insufficient funds')) {
          errorMessage = '❌ Fonds insuffisants pour effectuer cette transaction';
        } else if (error.message.includes('revert')) {
          errorMessage = '❌ Transaction rejetée par le contrat';
        } else if (error.message.includes('User denied')) {
          errorMessage = '❌ Transaction annulée par l\'utilisateur';
        }

        setResults(prev => ({
          ...prev,
          sendPayment: errorMessage,
        }));
      }
      setLoading(false);
    };

    const handleWithdraw = async () => {
      if (parseFloat(contractBalance) <= 0) {
        alert('Le contrat n\'a pas de fonds à retirer');
        return;
      }

      setLoading(true);
      try {
        const gasEstimate = await contract.methods.withdraw().estimateGas({
          from: account,
        });
        const gasPrice = await web3.eth.getGasPrice();
        const tx = await contract.methods.withdraw().send({
          from: account,
          gas: Math.floor(Number(gasEstimate) * 1.2),
          gasPrice: gasPrice
        });

        updateTransactionInfo(tx.transactionHash, tx.gasUsed);

        await loadContractInfo();

        setResults(prev => ({
          ...prev,
          withdraw: `✅ Retrait effectué avec succès! ${contractBalance} ETH transférés.`,
        }));
      } catch (error) {
        console.error('Erreur complète:', error);
        let errorMessage = '❌ Erreur lors du retrait';

        if (error.message.includes('Seul le destinataire peut retirer')) {
          errorMessage = '❌ Seul le destinataire peut effectuer un retrait';
        } else if (error.message.includes('Aucun fonds a retirer')) {
          errorMessage = '❌ Aucun fonds à retirer';
        } else if (error.message.includes('revert')) {
          errorMessage = '❌ Transaction rejetée par le contrat';
        } else if (error.message.includes('User denied')) {
          errorMessage = '❌ Transaction annulée par l\'utilisateur';
        }

        setResults(prev => ({
          ...prev,
          withdraw: errorMessage,
        }));
      }
      setLoading(false);
    };

    const handleGetBalance = async () => {
      setLoading(true);
      try {
        const balance = await web3.eth.getBalance(contract.options.address);
        const balanceEth = web3.utils.fromWei(balance, 'ether');
        setResults(prev => ({
          ...prev,
          getBalance: `💰 Solde du contrat: ${balanceEth} ETH`,
        }));
        setContractBalance(balanceEth);
      } catch (error) {
        console.error('Erreur:', error);
        setResults(prev => ({
          ...prev,
          getBalance: '❌ Erreur lors de la récupération du solde',
        }));
      }
      setLoading(false);
    };

    const isRecipient = account && recipient && account.toLowerCase() === recipient.toLowerCase();

    return (
      <div className="exercice-content">
        <div className="header-section">
          <h2>💳 Gestion des paiements</h2>
          <p className="description">
            Ce contrat permet de recevoir des paiements en Ether et de permettre au destinataire autorisé de retirer les fonds.
          </p>
        </div>

        <div className="contract-info">
          <div className="info-card">
            <div className="info-icon">💰</div>
            <div className="info-content">
              <div className="info-label">Solde du contrat</div>
              <div className="balance-value">{contractBalance} ETH</div>
            </div>
          </div>

          <div className="info-card">
            <div className="info-icon">📨</div>
            <div className="info-content">
              <div className="info-label">Destinataire autorisé</div>
              <div className="info-value">
                {recipient || 'Chargement...'}
                {isRecipient && <span className="recipient-badge">Vous</span>}
              </div>
            </div>
          </div>
        </div>

        <div className="action-sections">
          <div className="action-section">
            <h3>💸 Envoyer un paiement</h3>
            <div className="form-group">
              <label>Montant en ETH</label>
              <input
                type="number"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                placeholder="0.00"
                step="0.001"
                min="0.001"
              />
            </div>
            <button
              onClick={handleSendPayment}
              disabled={loading || !paymentAmount || parseFloat(paymentAmount) <= 0}
              className="action-btn primary"
            >
              {loading ? '⏳ Envoi en cours...' : `💸 Envoyer ${paymentAmount || '0'} ETH`}
            </button>
            {results.sendPayment && (
              <div className={`result-box ${results.sendPayment.includes('❌') ? 'error' : 'success'}`}>
                {results.sendPayment}
              </div>
            )}
          </div>

          <div className="action-section">
            <h3>🏦 Retirer les fonds</h3>
            <p className="info-text">
              {isRecipient
                ? '✅ Vous êtes autorisé à effectuer des retraits.'
                : '❌ Seul le destinataire peut effectuer des retraits.'}
            </p>
            <button
              onClick={handleWithdraw}
              disabled={loading || !isRecipient || parseFloat(contractBalance) <= 0}
              className={`action-btn ${isRecipient && parseFloat(contractBalance) > 0 ? 'primary' : 'disabled'}`}
            >
              {loading ? '⏳ Retrait en cours...' : `🏦 Retirer ${contractBalance} ETH`}
            </button>
            {results.withdraw && (
              <div className={`result-box ${results.withdraw.includes('❌') ? 'error' : 'success'}`}>
                {results.withdraw}
              </div>
            )}
          </div>
        </div>

        <div className="secondary-actions">
          <div className="action-section">
            <h3>🔧 Actions supplémentaires</h3>
            <div className="button-group">
              <button onClick={handleGetBalance} disabled={loading} className="action-btn secondary">
                🔄 Actualiser le solde
              </button>
              <button
                onClick={() => {
                  setPaymentAmount('0.01');
                }}
                disabled={loading}
                className="action-btn small"
              >
                💸 Envoyer 0.01 ETH
              </button>
              <button
                onClick={() => {
                  setPaymentAmount('0.1');
                }}
                disabled={loading}
                className="action-btn small"
              >
                💸 Envoyer 0.1 ETH
              </button>
            </div>
            {results.getBalance && <div className="result-box info">{results.getBalance}</div>}
          </div>
        </div>

        <style jsx>{`
          .exercice-content {
            max-width: 900px;
            margin: 0 auto;
            padding: 20px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          }

          .header-section {
            text-align: center;
            margin-bottom: 30px;
          }

          .header-section h2 {
            color: #2c3e50;
            margin-bottom: 10px;
            font-size: 2rem;
          }

          .description {
            color: #666;
            font-size: 1.1rem;
            max-width: 600px;
            margin: 0 auto;
            line-height: 1.6;
          }

          .contract-info {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
          }

          .info-card {
            background: white;
            border-radius: 12px;
            padding: 20px;
            display: flex;
            align-items: center;
            gap: 15px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            border: 1px solid #e5e7eb;
          }

          .info-icon {
            font-size: 2rem;
            width: 60px;
            height: 60px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
          }

          .info-content {
            flex: 1;
          }

          .info-label {
            font-size: 0.9rem;
            color: #64748b;
            margin-bottom: 5px;
            font-weight: 500;
          }

          .info-value {
            font-weight: 500;
            word-break: break-all;
            font-family: 'Monaco', 'Menlo', monospace;
            font-size: 0.9rem;
          }

          .balance-value {
            font-size: 1.5rem;
            font-weight: bold;
            color: #059669;
            font-family: 'Monaco', 'Menlo', monospace;
          }

          .recipient-badge {
            display: inline-block;
            background: linear-gradient(135deg, #10b981, #059669);
            color: white;
            padding: 4px 12px;
            border-radius: 12px;
            font-size: 0.8rem;
            margin-left: 8px;
            font-weight: 600;
          }

          .action-sections {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
            gap: 25px;
            margin-bottom: 30px;
          }

          .action-section {
            background: white;
            border-radius: 12px;
            padding: 25px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            border: 1px solid #e5e7eb;
          }

          .action-section h3 {
            margin-top: 0;
            margin-bottom: 20px;
            color: #1f2937;
            font-size: 1.2rem;
          }

          .form-group {
            margin-bottom: 20px;
          }

          .form-group label {
            display: block;
            margin-bottom: 8px;
            font-weight: 600;
            color: #374151;
          }

          .form-group input {
            width: 100%;
            padding: 12px 16px;
            border: 2px solid #d1d5db;
            border-radius: 8px;
            font-size: 16px;
            transition: border-color 0.2s;
            box-sizing: border-box;
          }

          .form-group input:focus {
            outline: none;
            border-color: #3b82f6;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
          }

          .action-btn {
            width: 100%;
            padding: 12px 16px;
            border: none;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
            margin-bottom: 10px;
            font-size: 1rem;
          }

          .action-btn.primary {
            background: linear-gradient(135deg, #3b82f6, #1d4ed8);
            color: white;
            box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.3);
          }

          .action-btn.primary:hover:not(:disabled) {
            background: linear-gradient(135deg, #2563eb, #1e40af);
            transform: translateY(-1px);
            box-shadow: 0 6px 8px -1px rgba(59, 130, 246, 0.4);
          }

          .action-btn.secondary {
            background: linear-gradient(135deg, #64748b, #475569);
            color: white;
          }

          .action-btn.secondary:hover:not(:disabled) {
            background: linear-gradient(135deg, #475569, #334155);
            transform: translateY(-1px);
          }

          .action-btn.small {
            padding: 8px 12px;
            font-size: 0.9rem;
            background: linear-gradient(135deg, #10b981, #059669);
            color: white;
          }

          .action-btn.small:hover:not(:disabled) {
            background: linear-gradient(135deg, #059669, #047857);
            transform: translateY(-1px);
          }

          .action-btn.disabled {
            background: #f3f4f6;
            color: #9ca3af;
            cursor: not-allowed;
            box-shadow: none;
          }

          .action-btn:disabled {
            opacity: 0.6;
            cursor: not-allowed;
            transform: none !important;
          }

          .info-text {
            color: #64748b;
            font-size: 0.9rem;
            margin-bottom: 15px;
            padding: 10px;
            background: #f8fafc;
            border-radius: 6px;
            border-left: 4px solid #64748b;
          }

          .result-box {
            padding: 16px;
            border-radius: 8px;
            font-size: 14px;
            margin-top: 15px;
            font-weight: 500;
          }

          .result-box.success {
            background: linear-gradient(135deg, #ecfdf5, #d1fae5);
            color: #065f46;
            border-left: 4px solid #10b981;
          }

          .result-box.error {
            background: linear-gradient(135deg, #fef2f2, #fecaca);
            color: #991b1b;
            border-left: 4px solid #ef4444;
          }

          .result-box.info {
            background: linear-gradient(135deg, #eff6ff, #dbeafe);
            color: #1e40af;
            border-left: 4px solid #3b82f6;
          }

          .secondary-actions {
            margin-top: 20px;
          }

          .button-group {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 10px;
          }

          @media (max-width: 768px) {
            .contract-info {
              grid-template-columns: 1fr;
            }
            .action-sections {
              grid-template-columns: 1fr;
            }
            .button-group {
              grid-template-columns: 1fr;
            }
            .exercice-content {
              padding: 15px;
            }
          }
        `}</style>
      </div>
    );
  };

  return (
    <BaseExercice
      titre="Exercice 8 - Paiements"
      description="Gestion des transactions avec msg.sender et msg.value"
      contractName="Payment"
      onContractLoaded={handleContractLoaded}
    >
      {renderExerciceContent}
    </BaseExercice>
  );
};

export default Exercice8;
