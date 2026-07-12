import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { io } from 'socket.io-client';
import { createContext } from 'react';
import axios from 'axios';

import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Display from './pages/Display.jsx';
import Join from './pages/Join.jsx';
import Ticket from './pages/Ticket.jsx';  // ← جديد

export const SocketContext = createContext();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000', {
  transports: ['websocket', 'polling'],
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

// إلى (مؤقتاً للتجربة):
export const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SocketContext.Provider value={socket}>
        <BrowserRouter>
          <div dir="rtl" className="min-h-screen bg-gray-50 font-sans">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/display/:shopId" element={<Display />} />
              <Route path="/join/:shopId" element={<Join />} />
             <Route path="/ticket/:queueId" element={<Ticket />} />  // ← جديد

            </Routes>
          </div>
        </BrowserRouter>
      </SocketContext.Provider>
    </QueryClientProvider>
  );
}

export default App;