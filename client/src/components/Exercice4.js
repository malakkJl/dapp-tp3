import React, { useState } from 'react';
import BaseExercice from './BaseExercice';

const Exercice4 = () => {
  const [nombre, setNombre] = useState('');
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState(false);

  const renderExerciceContent = (contract, web3, account, updateTransactionInfo) => {
    const handleVerifierPositif = async () => {
      if (nombre === '') {
        alert('Veuillez entrer un nombre');
        return;
      }

      setLoading(true);
      try {
        const result = await contract.methods.estPositif(nombre).call();
        const message = result
          ? `Le nombre ${nombre} est positif`
          : `Le nombre ${nombre} est négatif`;

        setResults(prev => ({
          ...prev,
          verification: {
            message,
            isPositive: result,
          },
        }));
      } catch (error) {
        console.error('Erreur:', error);
        setResults(prev => ({
          ...prev,
          verification: {
            message: 'Erreur lors de la vérification',
            isError: true,
          },
        }));
      }
      setLoading(false);
    };

    const handleTestMultiple = async () => {
      const testNumbers = [-5, -1, 0, 1, 42, 100];
      setLoading(true);

      try {
        const testResults = [];
        for (const num of testNumbers) {
          const result = await contract.methods.estPositif(num).call();
          testResults.push({
            number: num,
            isPositive: result,
          });
        }

        setResults(prev => ({
          ...prev,
          testMultiple: testResults,
        }));
      } catch (error) {
        console.error('Erreur:', error);
        setResults(prev => ({
          ...prev,
          testMultiple: {
            message: 'Erreur lors des tests multiples',
            isError: true,
          },
        }));
      }
      setLoading(false);
    };

    return (
      <div className="exercice-content">
        <div className="header-section">
          <h2>Vérification de nombre positif</h2>
          <p className="description">
            Ce contrat vérifie si un nombre entier est strictement positif (supérieur à 0)
          </p>
        </div>

        <div className="main-sections">
          <div className="verification-section">
            <div className="input-section">
              <h3>Vérifier un nombre</h3>
              <div className="input-group">
                <input
                  type="number"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Entrez un nombre entier"
                />
                <button 
                  onClick={handleVerifierPositif}
                  disabled={loading}
                  className="verify-btn"
                >
                  {loading ? 'Vérification...' : 'Vérifier'}
                </button>
              </div>
            </div>

            {results.verification && (
              <div className={`result-box ${
                results.verification.isError ? 'error' :
                results.verification.isPositive ? 'positive' : 'negative'
              }`}>
                {results.verification.message}
              </div>
            )}
          </div>

          <div className="test-section">
            <h3>Tests multiples</h3>
            <p className="test-description">
              Tester rapidement une série de nombres prédéfinis
            </p>
            <button
              onClick={handleTestMultiple}
              disabled={loading}
              className="test-btn"
            >
              {loading ? 'Test en cours...' : 'Lancer les tests'}
            </button>

            {results.testMultiple && (
              <div className="test-results">
                {Array.isArray(results.testMultiple) ? (
                  <div className="result-grid">
                    {results.testMultiple.map((test, index) => (
                      <div 
                        key={index} 
                        className={`result-item ${test.isPositive ? 'positive' : 'negative'}`}
                      >
                        <div className="number">{test.number}</div>
                        <div className="status">
                          {test.isPositive ? '✅ Positif' : '❌ Non positif'}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="error-message">
                    {results.testMultiple.message}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="examples-section">
          <h3>Exemples de résultats attendus</h3>
          <div className="examples-grid">
            <div className="example-card negative">
              <div className="value">-5</div>
              <div className="label">Négatif</div>
            </div>
            <div className="example-card negative">
              <div className="value">-1</div>
              <div className="label">Négatif</div>
            </div>
            <div className="example-card zero">
              <div className="value">0</div>
              <div className="label">Zéro</div>
            </div>
            <div className="example-card positive">
              <div className="value">1</div>
              <div className="label">Positif</div>
            </div>
            <div className="example-card positive">
              <div className="value">42</div>
              <div className="label">Positif</div>
            </div>
          </div>
        </div>

        {/* Style intégré */}
        <style jsx>{`
          .exercice-content {
            max-width: 900px;
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

          .main-sections {
            display: grid;
            gap: 30px;
            margin-bottom: 40px;
          }

          .verification-section, .test-section {
            background: white;
            border-radius: 10px;
            padding: 25px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.05);
          }

          .input-group {
            display: flex;
            gap: 10px;
            margin-top: 15px;
          }

          .input-group input {
            flex: 1;
            padding: 12px;
            border: 1px solid #ddd;
            border-radius: 6px;
            font-size: 16px;
          }

          .verify-btn, .test-btn {
            padding: 12px 20px;
            border: none;
            border-radius: 6px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s;
          }

          .verify-btn {
            background: #4CAF50;
            color: white;
          }

          .verify-btn:hover {
            background: #3d8b40;
          }

          .test-btn {
            background: #2196F3;
            color: white;
            width: 100%;
            margin-top: 15px;
          }

          .test-btn:hover {
            background: #0b7dda;
          }

          button:disabled {
            background: #cccccc !important;
            cursor: not-allowed;
          }

          .result-box {
            margin-top: 20px;
            padding: 15px;
            border-radius: 6px;
            font-weight: 500;
            text-align: center;
          }

          .positive {
            background: #f0fdf4;
            color: #166534;
            border-left: 4px solid #22c55e;
          }

          .negative {
            background: #fef2f2;
            color: #991b1b;
            border-left: 4px solid #ef4444;
          }

          .zero {
            background: #f9fafb;
            color: #4b5563;
            border-left: 4px solid #9ca3af;
          }

          .error {
            background: #fef2f2;
            color: #991b1b;
            border-left: 4px solid #ef4444;
          }

          .test-description {
            color: #666;
            margin-bottom: 15px;
          }

          .test-results {
            margin-top: 20px;
          }

          .result-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
            gap: 15px;
          }

          .result-item {
            padding: 15px;
            border-radius: 6px;
            text-align: center;
          }

          .result-item.positive {
            background: #f0fdf4;
            border: 1px solid #bbf7d0;
          }

          .result-item.negative {
            background: #fef2f2;
            border: 1px solid #fecaca;
          }

          .number {
            font-size: 1.2rem;
            font-weight: bold;
            margin-bottom: 5px;
          }

          .status {
            font-size: 0.9rem;
          }

          .examples-section {
            margin-top: 30px;
          }

          .examples-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
            gap: 15px;
            margin-top: 20px;
          }

          .example-card {
            padding: 20px 10px;
            border-radius: 8px;
            text-align: center;
            transition: transform 0.2s;
          }

          .example-card:hover {
            transform: translateY(-3px);
          }

          .example-card.positive {
            background: #f0fdf4;
            border: 2px solid #22c55e;
          }

          .example-card.negative {
            background: #fef2f2;
            border: 2px solid #ef4444;
          }

          .example-card.zero {
            background: #f9fafb;
            border: 2px solid #9ca3af;
          }

          .value {
            font-size: 1.5rem;
            font-weight: bold;
            margin-bottom: 5px;
          }

          .label {
            font-size: 0.9rem;
            color: #555;
          }

          @media (max-width: 768px) {
            .input-group {
              flex-direction: column;
            }

            .result-grid {
              grid-template-columns: repeat(2, 1fr);
            }
          }
        `}</style>
      </div>
    );
  };

  return (
    <BaseExercice
      titre="Exercice 4 - Nombre positif"
      description="Vérification si un nombre entier est positif"
      contractName="Exercice4"
    >
      {renderExerciceContent}
    </BaseExercice>
  );
};

export default Exercice4;
