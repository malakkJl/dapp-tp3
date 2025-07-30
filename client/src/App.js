import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Blockchain from './components/Blockchain';

// Composants
import Accueil from './components/Accueil';
import Exercice1 from './components/Exercice1';
import Exercice2 from './components/Exercice2';
import Exercice3 from './components/Exercice3';
import Exercice4 from './components/Exercice4';
import Exercice5 from './components/Exercice5';
import Exercice6 from './components/Exercice6';
import Exercice7 from './components/Exercice7';
import Exercice8 from './components/Exercice8';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>🚀 dApp TP3 - Blockchain & Web3</h1>
          <p>Application décentralisée pour les exercices Solidity</p>
        </header>
        
        <main className="App-main">
          <Routes>
            <Route path="/" element={<Accueil />} />
            <Route path="/exercice1" element={<Exercice1 />} />
            <Route path="/exercice2" element={<Exercice2 />} />
            <Route path="/exercice3" element={<Exercice3 />} />
            <Route path="/exercice4" element={<Exercice4 />} />
            <Route path="/exercice5" element={<Exercice5 />} />
            <Route path="/exercice6" element={<Exercice6 />} />
            <Route path="/exercice7" element={<Exercice7 />} />
            <Route path="/exercice8" element={<Exercice8 />} />
            <Route path="/blockchain" element={<Blockchain />} />

          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;