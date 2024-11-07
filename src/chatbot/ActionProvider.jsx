// in ActionProvider.jsx
import React from "react";
import { marked } from "marked";

// ActionProvider component to handle chatbot actions
const ActionProvider = ({ createChatBotMessage, setState, children }) => {
  // Function to update the last message in the state
  const updateLastMessage = (message) => {
    setState((prev) => {
      return {
        ...prev,
        messages: [
          ...prev.messages.slice(0, -1), // Remove the last message
          { ...prev.messages.at(-1), message }, // Add the updated message
        ],
      };
    });
  };

  // Function to manipulate the last message in the state
  const manipulateLastMessage = () => {
    setState((prev) => {
      const lastMessage = prev.messages.at(-1); // Get the last message
      const manipulatedMessage = {
        ...lastMessage,
        message: convertMessageToHtml(lastMessage.message), // Convert message to HTML
      };
      return {
        ...prev,
        messages: [...prev.messages.slice(0, -1), manipulatedMessage], // Update the state with manipulated message
      };
    });
  };

  // Function to convert a message to HTML using marked library
  const convertMessageToHtml = (message) => {
    const htmlContent = marked.parse(message.trim()); // Parse the message to HTML
    return <div dangerouslySetInnerHTML={{ __html: htmlContent }} />; // Return HTML content
  };

  // Function to add a new message to the state
  const addMessageToState = (botMessage) => {
    setState((prev) => ({
      ...prev,
      messages: [...prev.messages, botMessage],
    }));
  };

  const callAssistant = (message) => {
    // Get threadId from sessionStorage
    const threadId = sessionStorage.getItem("threadId");
    let url = "/api/art-assistant";

    if (threadId && threadId.trim() !== "") {
      url += `?threadId=${encodeURIComponent(threadId.trim())}`;
    }

    // HTTP call to the backend
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain",
      },
      body: message,
    }).then(async (response) => {
      const reader = response.body.getReader();
      let done, value;
      let messageBuffer = "";
      let decoder = new TextDecoder("utf-8");
      let threadIdBuffer = "";
      let threadIdCaptured = false;

      addMessageToState(createChatBotMessage("thinking...")); //You need a dummy message to update
      while (!done) {
        ({ done, value } = await reader.read());
        const chunk = decoder.decode(value);
        if (!threadIdCaptured) {
          for (let char of chunk) {
            if (char === "@") {
              threadIdCaptured = true;
              sessionStorage.setItem("threadId", threadIdBuffer);
              console.log(threadIdBuffer);
            } else if (!threadIdCaptured) {
              threadIdBuffer += char;
            } else {
              messageBuffer += char;
            }
          }
        } else {
          messageBuffer += chunk;
        }

        if (threadIdCaptured) {
          updateLastMessage(messageBuffer);
        }
      }
      manipulateLastMessage();
    });
  };

  // Put the handleHello function in the actions object to pass to the MessageParser
  return (
    <div>
      {React.Children.map(children, (child) => {
        return React.cloneElement(child, {
          actions: {
            callAssistant,
          },
        });
      })}
    </div>
  );
};

export default ActionProvider;
