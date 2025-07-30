import React, { useState } from 'react';
import BaseExercice from './BaseExercice';

const Exercice5 = () => {
  const [nombre, setNombre] = useState('');
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState(false);

  const renderExerciceContent = (contract, web3, account, updateTransactionInfo) => {
    const handleVerifierParite = async () => {
      if (nombre === '') {
        alert('Veuillez entrer un nombre');
        return;
      }

      setLoading(true);
      try {
        const result = await contract.methods.estPair(nombre).call();
        const message = result ? 
          `🟦 Le nombre ${nombre} est PAIR` : 
          `🟨 Le nombre ${nombre} est IMPAIR`;

        setResults(prev => ({
          ...prev,
          verification: message
        }));
      } catch (error) {
        console.error('Erreur:', error);
        setResults(prev => ({
          ...prev,
          verification: 'Erreur lors de la vérification'
        }));
      }
      setLoading(false);
    };

    const handleTestSequence = async () => {
      const testNumbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      setLoading(true);

      try {
        const testResults = [];
        for (const num of testNumbers) {
          const result = await contract.methods.estPair(num).call();
          testResults.push({
            number: num,
            isPair: result
          });
        }

        const resultText = testResults.map(test =>
          `${test.number}: ${test.isPair ? '🟦 Pair' : '🟨 Impair'}`
        ).join('\n');

        setResults(prev => ({
          ...prev,
          testSequence: resultText
        }));
      } catch (error) {
        console.error('Erreur:', error);
        setResults(prev => ({
          ...prev,
          testSequence: 'Erreur lors des tests de séquence'
        }));
      }
      setLoading(false);
    };

    const handleTestNegatifs = async () => {
      const testNumbers = [-10, -5, -2, -1];
      setLoading(true);

      try {
        const testResults = [];
        for (const num of testNumbers) {
          const result = await contract.methods.estPair(num).call();
          testResults.push({
            number: num,
            isPair: result
          });
        }

        const resultText = testResults.map(test =>
          `${test.number}: ${test.isPair ? ' Pair' : ' Impair'}`
        ).join('\n');

        setResults(prev => ({
          ...prev,
          testNegatifs: resultText
        }));
      } catch (error) {
        console.error('Erreur:', error);
        setResults(prev => ({
          ...prev,
          testNegatifs: 'Erreur lors des tests de nombres négatifs'
        }));
      }
      setLoading(false);
    };

    return (
      <div className="exercice-content">
        <div className="header-section">
          <h2>Vérification de parité</h2>
          <p className="description">
            Ce contrat vérifie si un nombre entier est pair (divisible par 2)
          </p>
        </div>

        <div className="main-sections">
          {/* Section de vérification */}
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
                  onClick={handleVerifierParite}
                  disabled={loading}
                  className="verify-btn"
                >
                  {loading ? 'Vérification...' : 'Vérifier'}
                </button>
              </div>
            </div>

            {results.verification && (
              <div className={`result-box ${results.verification.isError ? 'error' : 
                results.verification.isPair ? 'pair' : 'impair'}`}>
                <div className="result-icon">
                  {results.verification.isPair ? '🟦 pair ' : '🟨 impair'}
                </div>
                <div className="result-text">
                  {results.verification.message}
                </div>
              </div>
            )}
          </div>

          {/* Section de tests */}
          <div className="test-sections">
            <div className="test-section">
              <h3>Séquence standard (0-10)</h3>
              <button
                onClick={handleTestSequence}
                disabled={loading}
                className="test-btn"
              >
                {loading ? 'Test en cours...' : 'Tester 0 à 10'}
              </button>

              {results.testSequence && (
                <div className="test-results">
                  {Array.isArray(results.testSequence) ? (
                    <div className="result-grid">
                      {results.testSequence.map((test, index) => (
                        <div 
                          key={index} 
                          className={`result-item ${test.isPair ? 'pair' : 'impair'}`}
                        >
                          <div className="number">{test.number}</div>
                          <div className="status">
                            {test.isPair ? '🟦 Pair' : '🟨 Impair'}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="error-message">
                      {results.testSequence.message}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="test-section">
              <h3>Nombres négatifs</h3>
              <button
                onClick={handleTestNegatifs}
                disabled={loading}
                className="test-btn"
              >
                {loading ? 'Test en cours...' : 'Tester négatifs'}
              </button>

              {results.testNegatifs && (
                <div className="test-results">
                  {Array.isArray(results.testNegatifs) ? (
                    <div className="result-grid">
                      {results.testNegatifs.map((test, index) => (
                        <div 
                          key={index} 
                          className={`result-item ${test.isPair ? 'pair' : 'impair'}`}
                        >
                          <div className="number">{test.number}</div>
                          <div className="status">
                            {test.isPair ? '🟦 Pair' : '🟨 Impair'}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="error-message">
                      {results.testNegatifs.message}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Section d'exemples */}
        <div className="examples-section">
          <h3>Classification visuelle</h3>
          <div className="examples-grid">
            <div className="example-card pair">
              <h4>Nombres Pairs</h4>
              <div className="numbers-grid">
                {[0, 2, 4, 6, 8, 10].map(num => (
                  <div key={num} className="number-circle">
                    {num}
                  </div>
                ))}
              </div>
              <p className="example-description">Divisible par 2 (reste = 0)</p>
            </div>
            <div className="example-card impair">
              <h4>Nombres Impairs</h4>
              <div className="numbers-grid">
                {[1, 3, 5, 7, 9, 11].map(num => (
                  <div key={num} className="number-circle">
                    {num}
                  </div>
                ))}
              </div>
              <p className="example-description">Non divisible par 2 (reste = 1)</p>
            </div>
          </div>
        </div>

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

          .verification-section {
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
            display: flex;
            align-items: center;
            gap: 10px;
          }

          .pair {
            background: #e3f2fd;
            color: #0d47a1;
            border-left: 4px solid #2196F3;
          }

          .impair {
            background: #fff8e1;
            color: #e65100;
            border-left: 4px solid #FF9800;
          }

          .error {
            background: #ffebee;
            color: #c62828;
            border-left: 4px solid #f44336;
          }

          .result-icon {
            font-size: 1.2rem;
          }

          .test-sections {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
          }

          .test-section {
            background: white;
            border-radius: 10px;
            padding: 20px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.05);
          }

          .test-results {
            margin-top: 20px;
          }

          .result-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
            gap: 10px;
          }

          .result-item {
            padding: 12px;
            border-radius: 6px;
            text-align: center;
          }

          .result-item.pair {
            background: #e3f2fd;
            border: 1px solid #bbdefb;
          }

          .result-item.impair {
            background: #fff8e1;
            border: 1px solid #ffecb3;
          }

          .number {
            font-size: 1.1rem;
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
            grid-template-columns: 1fr 1fr;
            gap: 20px;
          }

          .example-card {
            padding: 20px;
            border-radius: 10px;
            text-align: center;
          }

          .example-card.pair {
            background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
            border: 2px solid #2196F3;
          }

          .example-card.impair {
            background: linear-gradient(135deg, #fff8e1 0%, #ffecb3 100%);
            border: 2px solid #FF9800;
          }

          .example-card h4 {
            margin-top: 0;
            color: inherit;
          }

          .numbers-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 10px;
            margin: 15px 0;
          }

          .number-circle {
            width: 50px;
            height: 50px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            margin: 0 auto;
          }

          .example-card.pair .number-circle {
            background: #2196F3;
            color: white;
          }

          .example-card.impair .number-circle {
            background: #FF9800;
            color: white;
          }

          .example-description {
            font-size: 0.9rem;
            color: inherit;
            opacity: 0.8;
          }

          @media (max-width: 768px) {
            .input-group {
              flex-direction: column;
            }
            
            .test-sections {
              grid-template-columns: 1fr;
            }
            
            .examples-grid {
              grid-template-columns: 1fr;
            }
          }
        `}</style>
      </div>
    );
  };

  return (
    <BaseExercice
      titre="Exercice 5 - Parité"
      description="Vérification de la parité d'un nombre entier"
      contractName="Exercice5"
    >
      {renderExerciceContent}
    </BaseExercice>
  );
};

export default Exercice5;
