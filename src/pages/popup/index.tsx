import '@/tailwind.css';
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

const root = createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <React.StrictMode>
    <div className="flex p-8 flex-col bg-slate-400">
      <App />
    </div>
  </React.StrictMode>,
);
