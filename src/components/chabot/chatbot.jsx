import React, { useState, useEffect } from "react";
import axios from "axios";

const formatTextToLines = (text, wordsPerLine = 7) => {
  if (!text) return ""; // Add a check to prevent undefined text from being processed
  const words = text.split(" ");
  let lines = [];
  for (let i = 0; i < words.length; i += wordsPerLine) {
    lines.push(words.slice(i, i + wordsPerLine).join(" "));
  }
  return lines.join("\n");
};

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [introText, setIntroText] = useState("");

  useEffect(() => {
    const text =
      "Welcome to StyleBot, your personal clothes fashion stylist. " +
      "I can help you with fashion advice, outfit suggestions, and styling tips. " +
      "Whether you’re looking to update your wardrobe, plan an outfit for a special event, or need advice on trends, I'm here to assist. " +
      "Feel free to ask any questions about fashion, styling, or how to combine different pieces of clothing. " +
      "Let’s make sure you always look your best!";
    let index = 0;

    const intervalId = setInterval(() => {
      setIntroText(text.slice(0, index));
      index++;
      if (index > text.length) {
        clearInterval(intervalId);
      }
    }, 50);

    return () => clearInterval(intervalId);
  }, []);

  const sendMessage = async () => {
    if (input.trim()) {
      const userMessage = {
        sender: "user",
        text: input,
        timestamp: new Date(),
      };
      setMessages((prevMessages) => [...prevMessages, userMessage]);
      setInput("");

      try {
        const response = await axios.post(
          "http://localhost:8000/api/v1/chatbot",
          { message: input },
          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        // Check if response.data and response.data.reply exist
        const reply = response.data && response.data.reply ? response.data.reply : "Sorry, I couldn't process your request.";
        const formattedReply = formatTextToLines(reply);

        const botMessage = {
          sender: "bot",
          text: formattedReply,
          timestamp: new Date(),
        };

        setMessages((prevMessages) => [...prevMessages, botMessage]);

      } catch (error) {
        console.error("Error sending message to chatbot:", error);
        
        // In case of error, show a fallback message in the chat
        const botMessage = {
          sender: "bot",
          text: "Oops, there was an error. Please try again later.",
          timestamp: new Date(),
        };
        setMessages((prevMessages) => [...prevMessages, botMessage]);
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6" style={{
        overflow: "auto",
        height:"400px"
    }}>
      {/* Chat Container */}
      <div className="w-full max-w-md bg-gray-800 text-white p-4 rounded-lg shadow-lg flex flex-col space-y-4">
        {/* Intro Text */}
        <div className="text-sm font-light mb-4">{introText}</div>

        {/* Chat Box */}
        <div className="flex-1 overflow-y-auto">
          {messages.map((message, index) => (
            <div key={index} className={`mb-2 flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`rounded-lg p-3 max-w-xs ${
                  message.sender === "user" ? "bg-green-500 text-white" : "bg-yellow-400 text-black"
                }`}
              >
                {message.text}
              </div>
            </div>
          ))}
        </div>

        {/* Input Container */}
        <div className="flex items-center space-x-2">
          <input
            type="text"
            className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-black"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            onClick={sendMessage}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-500 transition"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
