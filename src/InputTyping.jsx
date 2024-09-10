import React, { useState, useImperativeHandle, forwardRef } from 'react';
import PropTypes from 'prop-types';
import { FaPaperPlane } from 'react-icons/fa';

// Define InputTyping component with forwardRef and displayName
const InputTyping = forwardRef(({ onSend }, ref) => {
  const [userInput, setUserInput] = useState('');
  const inputRef = React.useRef(null);

  // Expose methods to parent component
  useImperativeHandle(ref, () => ({
    clearInput: () => setUserInput(''),
    focus: () => inputRef.current.focus(),
    getInputValue: () => userInput,
  }));

  const handleSendMessage = () => {
    if (userInput.trim()) {
      onSend(userInput);
      setUserInput('');
    }
  };

  const handleEnterKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="flex items-center p-4 border-t border-gray-300 bg-white shadow-md rounded-lg">
      <input
        type="text"
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        placeholder="Type a message..."
        className="flex-grow p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        ref={inputRef}
        onKeyPress={handleEnterKeyPress}
      />
      <button
        onClick={handleSendMessage}
        className="ml-3 p-3 bg-blue-500 text-white rounded-full shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 flex items-center justify-center"
      >
        <FaPaperPlane size={20} />
      </button>
    </div>
  );
});

InputTyping.displayName = 'InputTyping'; // Adding display name

InputTyping.propTypes = {
  onSend: PropTypes.func.isRequired, // Validate that onSend is a required function
};

export default InputTyping;
