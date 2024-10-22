import './custom.css';
import './App.css';

import Chatbot from 'react-chatbot-kit'
import 'react-chatbot-kit/build/main.css'

import config from './chatbot/config.js';
import MessageParser from './chatbot/MessageParser';
import ActionProvider from './chatbot/ActionProvider';


function App() {
  return (
    <div className="App">
    <header className="App-header">
    <Chatbot
        config={config}
        messageParser={MessageParser}
        actionProvider={ActionProvider}
      />
    </header>
  </div>
  );
}

export default App;
