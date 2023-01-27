import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { ChakraProvider } from '@chakra-ui/react'
import { BrowserRouter as Router } from 'react-router-dom';
import { ChatProvider } from './contexts/ChatContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ChatProvider>
      <ChakraProvider>
        <Router>
          <App />
        </Router>
      </ChakraProvider>
    </ChatProvider>
  </React.StrictMode>
);

