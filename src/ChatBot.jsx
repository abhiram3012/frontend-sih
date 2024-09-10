import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import './Chatbot.css'; // Assuming you might have some additional custom CSS
import InputTyping from './InputTyping';

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [isScrollingUp, setIsScrollingUp] = useState(false); // State for scroll direction
  const chatHistoryRef = useRef(null); // Ref for chat history container
  const messageInputRef = useRef(null); // Ref for focusing input on render

  // Function to handle user input submission
  const handleSendMessage = async (userInput) => {
    if (!userInput.trim()) return;

    // Add user message to chat
    setMessages((prevMessages) => [...prevMessages, { sender: 'user', text: userInput }]);

    try {
      // Send message to backend API
      const response = await axios.post('http://localhost:5000/chat', {
        message: userInput,
      });

      // Add bot response to chat
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: 'bot', text: response.data.reply },
      ]);
    } catch (error) {
      console.error('Error fetching response:', error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: 'bot', text: 'Sorry, I am having trouble understanding you.' },
      ]);
    }

    // Clear input field
    messageInputRef.current.clearInput();

    // Focus input after sending message (using ref)
    messageInputRef.current.focus();

    // Scroll chat history to the bottom after sending
    chatHistoryRef.current.scrollTo({ top: chatHistoryRef.current.scrollHeight, behavior: 'smooth' });
  };

  // Function to detect scroll direction (optional for animation)
  useEffect(() => {
    const chatHistory = chatHistoryRef.current;
    const handleScroll = () => {
      const scrollTop = chatHistory.scrollTop;
      const prevScrollTop = chatHistory.previousElementSibling ? chatHistory.previousElementSibling.scrollTop : 0;

      setIsScrollingUp(scrollTop < prevScrollTop);
    };

    chatHistory.addEventListener('scroll', handleScroll);

    return () => chatHistory.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="chatbot-container">
      <div className="chatbot-header">
        <h1 className="chatbot-title">Chatbot</h1>
        {/* Add optional avatar or logo here */}
      </div>
      <div className={`chat-history ${isScrollingUp ? 'scrolling-up' : ''}`} ref={chatHistoryRef}>
        {messages.map((message, index) => (
          <div key={index} className={`chat-message ${message.sender}`}>
            <div className="message-content">{message.text}</div>
          </div>
        ))}
      </div>
      <InputTyping onSend={handleSendMessage} ref={messageInputRef} />
    </div>
  );
};

export default Chatbot;
