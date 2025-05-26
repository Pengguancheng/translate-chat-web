"use client";

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

interface Sender {
  id: string;
  name: string;
  language: string;
}

interface ChatMessage {
  id: string;
  sender: Sender;
  originalContent: string;
  originalLanguage: string;
  translatedLanguage: string;
  translatedContent: string;
  timestamp: string;
}

export default function Chat() {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [userId, setUserId] = useState('');
  const searchParams = useSearchParams();
  const name = searchParams.get('name') || 'Anonymous';
  const language = searchParams.get('language') || 'Unknown';

  useEffect(() => {
    const newUserId = Math.random().toString(36).substring(7); // Generate a random user ID
    setUserId(newUserId);

    // Get WebSocket URL from environment variable
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:5000/ws';

    // Create WebSocket connection
    const ws = new WebSocket(`${wsUrl}?userId=${newUserId}&userName=${name}&language=${language}`);

    ws.onopen = () => {
      console.log('WebSocket Connected');
      setSocket(ws);
      ws.send('Hi!, 大家好!');
    };

    ws.onmessage = (event) => {
      const chatMessage: ChatMessage = JSON.parse(event.data);
      setMessages(prev => [...prev, chatMessage]);
    };

    ws.onerror = (error) => {
      console.error('WebSocket Error:', error);
    };

    ws.onclose = () => {
      console.log('WebSocket Disconnected');
    };

    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, [name, language]);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (socket && inputMessage && inputMessage.length <= 200) {
      socket.send(inputMessage);
      setInputMessage('');
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-start bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-4xl p-4 flex flex-col h-screen">
        <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
          Chat Room - {name} ({language})
        </h1>
        <div className="flex-grow overflow-y-auto mb-4 bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`mb-4 p-2 rounded ${
                msg.sender.id === userId 
                  ? 'bg-blue-100 dark:bg-blue-900 ml-auto' 
                  : 'bg-gray-100 dark:bg-gray-700 mr-auto'
              } max-w-[70%]`}
            >
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {msg.sender.name} ({msg.sender.language}) - {new Date(msg.timestamp).toLocaleString()}
              </p>
              <p className="text-gray-800 dark:text-gray-200">{msg.originalContent}</p>
              {msg.translatedContent && (
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Translated ({msg.translatedLanguage}): {msg.translatedContent}
                </p>
              )}
            </div>
          ))}
        </div>
        <form onSubmit={sendMessage} className="flex flex-col">
          <div className="flex mb-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value.slice(0, 200))}
              className="flex-grow mr-2 p-2 border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
              placeholder="Type a message..."
              maxLength={200}
            />
            <button 
              type="submit" 
              className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            >
              Send
            </button>
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {inputMessage.length}/200 characters
          </div>
        </form>
      </div>
    </div>
  );
}