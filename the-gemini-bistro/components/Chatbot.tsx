import React, { useState, useRef, useEffect } from 'react';
import type { ChatMessage } from '../types';
import { getAiResponse } from '../services/geminiService';
import { motion, AnimatePresence } from 'framer-motion';

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { sender: 'ai', text: "Hello! I'm the virtual host for The Gemini Bistro. How can I help you with our menu today?" }
  ]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim() || isLoading) return;

    const newMessages: ChatMessage[] = [...messages, { sender: 'user', text: userInput }];
    setMessages(newMessages);
    setUserInput('');
    setIsLoading(true);

    try {
      const aiResponse = await getAiResponse(newMessages.slice(1), userInput); // Exclude initial greeting from history
      setMessages([...newMessages, { sender: 'ai', text: aiResponse }]);
    } catch (error) {
      setMessages([...newMessages, { sender: 'ai', text: "Sorry, I'm having trouble connecting right now." }]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const ChatIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.892 8.892 0 01-4.13-1.054A.5.5 0 005.5 16.5v-1.014A6.965 6.965 0 012 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM4.5 13.5a.5.5 0 01.5-.5h5a.5.5 0 010 1h-5a.5.5 0 01-.5-.5zm0-2a.5.5 0 01.5-.5h7a.5.5 0 010 1h-7a.5.5 0 01-.5-.5zm0-2a.5.5 0 01.5-.5h7a.5.5 0 010 1h-7a.5.5 0 01-.5-.5z" clipRule="evenodd" />
    </svg>
  );

  const CloseIcon = () => (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
  );


  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            className="fixed bottom-5 right-5 z-50"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          >
            <button
              onClick={() => setIsOpen(true)}
              className="bg-amber-600 hover:bg-amber-700 text-white p-4 rounded-full shadow-lg"
              aria-label="Open Chat"
            >
              <ChatIcon />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-5 right-5 z-50 w-[calc(100%-2.5rem)] max-w-sm h-[70vh] max-h-[600px] bg-gray-800 rounded-lg shadow-2xl flex flex-col origin-bottom-right"
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          >
            <div className="flex justify-between items-center p-4 bg-gray-900 rounded-t-lg">
              <h3 className="text-lg font-semibold text-amber-400">Ask the AI Chef</h3>
              <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white">
                <CloseIcon />
              </button>
            </div>

            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {messages.map((msg, index) => (
                <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs md:max-w-sm rounded-lg px-4 py-2 ${msg.sender === 'user' ? 'bg-amber-600 text-white' : 'bg-gray-700 text-gray-200'}`}>
                    <p className="text-sm" style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                   <div className="bg-gray-700 text-gray-200 rounded-lg px-4 py-2">
                     <div className="flex items-center space-x-2">
                       <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
                       <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                       <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                     </div>
                   </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 bg-gray-900 rounded-b-lg">
              <form onSubmit={handleSendMessage} className="flex space-x-2">
                <input
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder="Ask about the menu..."
                  className="flex-1 bg-gray-700 border-gray-600 rounded-full p-2 px-4 focus:ring-amber-500 focus:border-amber-500 text-white"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  className="bg-amber-500 hover:bg-amber-600 text-white p-2 rounded-full disabled:bg-gray-600"
                  disabled={isLoading || !userInput.trim()}
                  aria-label="Send Message"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chatbot;
