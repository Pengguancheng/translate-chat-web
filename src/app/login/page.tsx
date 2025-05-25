"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const ChatLanguages = ["zh-Hans", "vi", "th", "id"];

export default function Login() {
  const [name, setName] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState(ChatLanguages[0]);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      router.push(`/chat?name=${encodeURIComponent(name)}&language=${selectedLanguage}`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center login-container">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6 text-center">Login to Chat</h1>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full rounded-md shadow-sm focus:ring-2 focus:ring-opacity-50"
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="language" className="block text-sm font-medium mb-1">Preferred Language</label>
            <select
              id="language"
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="mt-1 block w-full rounded-md shadow-sm focus:ring-2 focus:ring-opacity-50"
            >
              {ChatLanguages.map((lang) => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="w-full rounded-md py-2 px-4 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-opacity-50"
          >
            Enter Chat
          </button>
        </form>
      </div>
    </div>
  );
}