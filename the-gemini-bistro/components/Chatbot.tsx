declare global {
  interface SpeechRecognition extends EventTarget {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    onend: (() => void) | null;
    onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
    onresult: ((event: SpeechRecognitionEvent) => void) | null;
    onstart: (() => void) | null;
    start: () => void;
    stop: () => void;
  }

  interface SpeechRecognitionEvent extends Event {
    readonly resultIndex: number;
    readonly results: SpeechRecognitionResultList;
  }

  interface SpeechRecognitionResultList {
    readonly length: number;
    item(index: number): SpeechRecognitionResult;
    [index: number]: SpeechRecognitionResult;
  }

  interface SpeechRecognitionResult {
    readonly isFinal: boolean;
    readonly length: number;
    item(index: number): SpeechRecognitionAlternative;
    [index: number]: SpeechRecognitionAlternative;
  }

  interface SpeechRecognitionAlternative {
    readonly transcript: string;
  }

  interface SpeechRecognitionErrorEvent extends Event {
    readonly error: string;
  }

  interface Window {
    SpeechRecognition?: new () => SpeechRecognition;
    webkitSpeechRecognition?: new () => SpeechRecognition;
  }
}

import React, { useState, useRef, useEffect } from 'react';
import type { ChatMessage } from '../types';
import { getAiResponse } from '../services/geminiService';
import { motion, AnimatePresence } from 'framer-motion';
import { logError, trackEvent } from '../services/monitoringService';
import { useTranslations } from '../hooks/useTranslations';

const Chatbot: React.FC = () => {
  const { t, language } = useTranslations();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { sender: 'ai', text: t('chatbot.initialMessage') }
  ]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Voice Assistant State
  const [isListening, setIsListening] = useState(false);
  const [isTtsEnabled, setIsTtsEnabled] = useState(true);
  const [speechApiSupported, setSpeechApiSupported] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    setMessages(msgs => {
      if (msgs.length === 1 && msgs[0].sender === 'ai') {
        return [{ sender: 'ai', text: t('chatbot.initialMessage') }];
      }
      return msgs;
    });
  }, [t]);
  
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      setSpeechApiSupported(true);
      const recognition: SpeechRecognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;

      recognition.onresult = (event) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        if (finalTranscript) {
          setUserInput(prev => prev + finalTranscript);
          recognition.stop();
        }
      };

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        logError(new Error(`Speech recognition error: ${event.error}`), { context: "Chatbot STT" });
        setIsListening(false);
      };
      recognitionRef.current = recognition;
    }

    return () => {
      recognitionRef.current?.stop();
      window.speechSynthesis.cancel();
    };
  }, []);

  const speak = (text: string) => {
    if (!isTtsEnabled) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language === 'ro' ? 'ro-RO' : 'en-US';
    window.speechSynthesis.speak(utterance);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim() || isLoading) return;

    const userMessage = userInput.trim();
    const newMessages: ChatMessage[] = [...messages, { sender: 'user', text: userMessage }];
    setMessages(newMessages);
    setUserInput('');
    setIsLoading(true);

    trackEvent('chatbot_message_sent', { message_length: userMessage.length, method: isListening ? 'voice' : 'text' });
    
    recognitionRef.current?.stop();
    window.speechSynthesis.cancel();

    try {
      const aiResponse = await getAiResponse(newMessages.slice(1), userMessage, language);
      setMessages([...newMessages, { sender: 'ai', text: aiResponse }]);
      speak(aiResponse);
    } catch (error) {
      logError(error as Error, { context: "Chatbot handleSendMessage" });
      const errorMsg = t('chatbot.errorMessage');
      setMessages([...newMessages, { sender: 'ai', text: errorMsg }]);
      speak(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleToggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      setUserInput('');
      if (recognitionRef.current) {
        recognitionRef.current.lang = language === 'ro' ? 'ro-RO' : 'en-US';
        recognitionRef.current.start();
      }
    }
  };

  // Icons
  const ChatIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 sm:h-7 sm:w-7 text-white" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.892 8.892 0 01-4.13-1.054A.5.5 0 005.5 16.5v-1.014A6.965 6.965 0 012 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM4.5 13.5a.5.5 0 01.5-.5h5a.5.5 0 010 1h-5a.5.5 0 01-.5-.5zm0-2a.5.5 0 01.5-.5h7a.5.5 0 010 1h-7a.5.5 0 01-.5-.5zm0-2a.5.5 0 01.5-.5h7a.5.5 0 010 1h-7a.5.5 0 01-.5-.5z" clipRule="evenodd" />
    </svg>
  );

  const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );

  const VolumeUpIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
    </svg>
  );

  const VolumeOffIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l-4-4m0 4l4-4" />
    </svg>
  );

  const MicrophoneIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
    </svg>
  );
  
  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          >
            <button
              onClick={() => setIsOpen(true)}
              className="bg-amber-500 hover:bg-amber-600 text-white p-3.5 sm:p-4 rounded-full shadow-2xl shadow-amber-500/30 flex items-center justify-center min-w-[52px] min-h-[52px] active:scale-95 transition"
              aria-label={t('chatbot.openChat')}
            >
              <ChatIcon />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-x-2 bottom-2 sm:inset-x-auto sm:bottom-6 sm:right-6 z-50 w-auto sm:w-96 max-w-full sm:max-w-md h-[82vh] sm:h-[580px] max-h-[calc(100svh-1rem)] bg-gray-800 rounded-2xl shadow-2xl flex flex-col border border-gray-700/70 overflow-hidden"
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', stiffness: 400, damping: 28 }}
          >
            {/* Header */}
            <div className="flex justify-between items-center p-3.5 sm:p-4 bg-gray-900 border-b border-gray-700/60">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <h3 className="text-base sm:text-lg font-bold text-amber-400 tracking-tight">{t('chatbot.headerTitle')}</h3>
              </div>
              <div className="flex items-center space-x-1 sm:space-x-2">
                <button
                  onClick={() => setIsTtsEnabled(!isTtsEnabled)}
                  className="p-2 min-w-[36px] min-h-[36px] flex items-center justify-center rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition"
                  aria-label={isTtsEnabled ? t('chatbot.disableVoice') : t('chatbot.enableVoice')}
                >
                  {isTtsEnabled ? <VolumeUpIcon /> : <VolumeOffIcon />}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 min-w-[36px] min-h-[36px] flex items-center justify-center rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition"
                  aria-label={t('chatbot.closeChat')}
                >
                  <CloseIcon />
                </button>
              </div>
            </div>

            {/* Messages body */}
            <div className="flex-1 p-3 sm:p-4 overflow-y-auto space-y-3.5 bg-gray-850">
              {messages.map((msg, index) => (
                <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[85%] sm:max-w-[80%] rounded-2xl px-4 py-2.5 text-sm sm:text-base leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-amber-500 text-white rounded-br-none shadow-md shadow-amber-500/20'
                        : 'bg-gray-700/90 text-gray-100 rounded-bl-none border border-gray-600/50'
                    }`}
                  >
                    <p style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-700/90 text-gray-200 rounded-2xl rounded-bl-none px-4 py-3 border border-gray-600/50">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></div>
                      <div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <div className="p-3 bg-gray-900 border-t border-gray-700/60">
              <form onSubmit={handleSendMessage} className="flex gap-2 items-center">
                <input
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder={isListening ? t('chatbot.inputPlaceholderListening') : t('chatbot.inputPlaceholder')}
                  className="flex-1 bg-gray-800 border border-gray-700 rounded-xl py-2.5 px-3.5 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-white text-base sm:text-sm min-h-[44px]"
                  disabled={isLoading}
                />
                {speechApiSupported && (
                  <button
                    type="button"
                    onClick={handleToggleListening}
                    className={`min-w-[44px] min-h-[44px] p-2.5 rounded-xl text-white transition-all relative flex items-center justify-center ${
                      isListening ? 'bg-red-600 shadow-md shadow-red-600/40' : 'bg-gray-800 border border-gray-700 hover:bg-gray-700'
                    }`}
                    aria-label={isListening ? t('chatbot.stopListening') : t('chatbot.startListening')}
                  >
                    <MicrophoneIcon />
                    {isListening && <span className="animate-ping absolute inline-flex h-full w-full rounded-xl bg-red-400 opacity-75"></span>}
                  </button>
                )}
                <button
                  type="submit"
                  className="min-w-[44px] min-h-[44px] bg-amber-500 hover:bg-amber-600 text-white p-2.5 rounded-xl disabled:bg-gray-700 disabled:text-gray-500 transition-colors flex items-center justify-center shadow-md shadow-amber-500/20 active:scale-95"
                  disabled={isLoading || !userInput.trim()}
                  aria-label={t('chatbot.sendMessage')}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
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
