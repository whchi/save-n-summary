import '@/styles/tailwind.css';
import App from '@popup/App';
import React from 'react';
import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <React.StrictMode>
    <div className="min-h-screen w-[400px] bg-[#F0FDFA] flex items-center justify-center p-5">
      <div className="w-full animate-fade-slide-up">
        <App />
      </div>
    </div>
  </React.StrictMode>,
);