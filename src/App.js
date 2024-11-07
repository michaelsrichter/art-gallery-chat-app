import "./custom.css";
import "./App.css";

import Chatbot from "react-chatbot-kit";
import "react-chatbot-kit/build/main.css";

import config from "./chatbot/config.js";
import MessageParser from "./chatbot/MessageParser";
import ActionProvider from "./chatbot/ActionProvider";

function App() {
  return (
    <div className="App">
      <header className="App-header">
      <div className="App-info">
        <p>
          This is a demo app that demonstrates the features of Elasticsearch
          integration with Azure OpenAI.
        </p>
        <p>
          For more information and to see the source code, visit{" "}
          <a
            href="https://aka.ms/art-chat-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            this link
          </a>
          .
        </p>
      </div>
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
