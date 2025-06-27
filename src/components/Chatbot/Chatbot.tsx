import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, ChevronDown, Zap, UserCircle } from 'lucide-react'; // Added more icons

interface Message {
  text: string;
  isUser: boolean;
  timestamp?: string;
}

function formatMessage(text: string) {
  return text.split('\n').map((line, i) => {
    const boldText = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    const formattedText = boldText.replace(/\*(.*?)\*/g, '<em>$1</em>');
    return <p key={i} dangerouslySetInnerHTML={{ __html: formattedText }} />;
  });
}

function Chatbot() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatWindowRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
    }
  }, [isOpen]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // Handle outside clicks to close chat on mobile
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        isOpen && 
        chatWindowRef.current && 
        !chatWindowRef.current.contains(event.target as Node) &&
        !(event.target as Element).closest('button')
      ) {
        if (window.innerWidth < 640) {
          setIsOpen(false);
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Adjust chat window height on resize
  useEffect(() => {
    function handleResize() {
      if (chatWindowRef.current) {
        if (window.innerWidth < 640) {
          chatWindowRef.current.style.height = '85vh';
        } else {
          chatWindowRef.current.style.height = '70vh';
        }
      }
    }

    if (isOpen) {
      handleResize();
      window.addEventListener('resize', handleResize);
    }

    return () => window.removeEventListener('resize', handleResize);
  }, [isOpen]);

  const getCurrentTime = () => {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setMessages(prev => [...prev, { 
      text: input, 
      isUser: true,
      timestamp: getCurrentTime()
    }]);
    
    setIsLoading(true);
    const userInput = input;
    setInput('');

    try {
      const response = await fetch('/api/v1/chat/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userInput })
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Error getting response');
      }

      setMessages(prev => [...prev, {
        text: data.data.response,
        isUser: false,
        timestamp: getCurrentTime()
      }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, {
        text: `Error: ${error instanceof Error ? error.message : 'Failed to get response'}`,
        isUser: false,
        timestamp: getCurrentTime()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed z-50">
      {/* Background overlay */}
      <div className={`
        ${isOpen ? 'fixed inset-0 bg-black/60 backdrop-blur-sm z-40 sm:bg-opacity-0 sm:backdrop-blur-none sm:relative sm:inset-auto' : 'hidden'}
        transition-opacity duration-300
      `} />
      
      {/* Chat Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed z-50 p-4 right-5 bottom-5 rounded-full shadow-xl bg-green-600 hover:bg-green-500 text-white 
          transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2
          motion-safe:hover:scale-110"
          aria-label="Open chat"
        >
          <MessageCircle size={24} />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div 
          ref={chatWindowRef}
          className={`
            bg-white flex flex-col rounded-2xl shadow-2xl overflow-hidden border border-gray-200 z-50
            fixed transition-all duration-300 ease-in-out
            sm:max-w-md lg:max-w-lg w-[calc(100%-2rem)] sm:w-[22rem] lg:w-[28rem]
            animate-in fade-in slide-in-from-bottom duration-300
            inset-0 m-4 sm:m-0 sm:right-5 sm:bottom-5 sm:left-auto sm:top-auto
          `}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 to-green-500 text-white py-4 px-5 flex justify-between items-center shadow-md relative z-10">
            <div className="flex items-center space-x-2">
              <Zap className="h-6 w-6" strokeWidth={2} />
              <h2 className="text-xl font-bold">Travel Assistant</h2>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-full hover:bg-green-700/50 transition-colors duration-200"
              aria-label="Close chat"
            >
              <ChevronDown size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 flex flex-col gap-4 bg-gray-50">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500 px-4 text-center gap-3">
                <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mb-2">
                  <MessageCircle className="h-8 w-8 text-green-500" />
                </div>
                <h3 className="text-lg font-semibold">Travel Assistant</h3>
                <p className="text-gray-500">Ask me anything about your travel needs!</p>
              </div>
            ) : (
              messages.map((msg, index) => (
                <div key={index} className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'} group`}>
                  {!msg.isUser && (
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mr-2">
                      <Zap className="h-4 w-4 text-green-600" />
                    </div>
                  )}
                  <div 
                    className={`
                      relative p-3.5 rounded-2xl max-w-[85%] sm:max-w-[75%] text-sm
                      whitespace-pre-wrap break-words leading-relaxed
                      ${msg.isUser
                        ? 'bg-gradient-to-br from-green-600 to-green-500 text-white rounded-br-none shadow-lg'
                        : 'bg-white text-gray-800 rounded-bl-none border border-gray-200 shadow-sm'
                      }
                    `}
                  >
                    <div className={`${msg.isUser ? 'text-white/90' : 'text-gray-900'}`}>
                      {formatMessage(msg.text)}
                    </div>
                    {msg.timestamp && (
                      <div className={`text-[10px] opacity-0 group-hover:opacity-70 transition-opacity mt-1 text-right
                        ${msg.isUser ? 'text-white/70' : 'text-gray-500'}
                      `}>
                        {msg.timestamp}
                      </div>
                    )}
                  </div>
                  {msg.isUser && (
                    <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center flex-shrink-0 ml-2">
                      <UserCircle className="h-5 w-5 text-white" />
                    </div>
                  )}
                </div>
              ))
            )}
            {isLoading && (
              <div className="flex justify-start">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mr-2">
                  <Zap className="h-4 w-4 text-green-600" />
                </div>
                <div className="relative p-4 rounded-2xl bg-white text-gray-800 border border-gray-200 shadow-sm rounded-bl-none">
                  <div className="flex space-x-2">
                    <span className="w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse" />
                    <span className="w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse delay-150" />
                    <span className="w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse delay-300" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Section */}
          <form onSubmit={handleSubmit} className="flex items-center p-4 bg-white border-t border-gray-200 gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Message Travel Assistant..."
              disabled={isLoading}
              className="flex-1 px-4 py-3 text-sm rounded-full border border-gray-300 
                focus:ring-2 focus:ring-green-400 focus:border-green-400 focus:outline-none 
                text-gray-700 disabled:opacity-60 disabled:cursor-not-allowed placeholder:text-gray-400
                shadow-sm"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="p-3 bg-green-600 text-white font-medium rounded-full 
                hover:bg-green-500 transition-colors shadow-sm disabled:opacity-60 
                disabled:cursor-not-allowed disabled:bg-green-600"
              aria-label="Send message"
            >
              <Send size={18} className="h-5 w-5" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default Chatbot;
