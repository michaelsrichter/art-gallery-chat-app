// in config.js
import { createChatBotMessage } from 'react-chatbot-kit';

const botName = 'New York City Art Galleries Bot';

const config = {
  initialMessages: [
    createChatBotMessage(
      `Hi! I'm the ${botName}. I can help you find information about art galleries in New York City. ` +
      `You can ask me about the kinds of art you can find, where the galleries are, how much they cost, ` +
      `whether they are children friendly and more! Ask me for a list or a table, or to compare the galleries.`
    )
  ],
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