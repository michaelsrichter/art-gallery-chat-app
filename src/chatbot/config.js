// in config.js
import { createChatBotMessage } from 'react-chatbot-kit';

const botName = 'New York City Art Galleries Bot';

const config = {
  initialMessages: [createChatBotMessage(`Hi! I'm the ${botName}. I can help you find information about art galleries in New York City.`)],
  botName: botName,
  customStyles: {
    botMessageBox: {
      backgroundColor: '#376B7E',
    },
    chatButton: {
      backgroundColor: '#5ccc9d',
    },
  },
};

export default config;