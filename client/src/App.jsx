import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Lobby from './pages/Lobby';
import CodeBlockPage from './pages/CodeBlock';
import { CodeBlockProvider } from './context/CodeBlockContext';

function App() {
  return (
    <CodeBlockProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Lobby />} />
          <Route path="/codeblock/:id" element={<CodeBlockPage />} />
        </Routes>
      </Router>
    </CodeBlockProvider>
  );
}

export default App;
