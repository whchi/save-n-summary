import '@/styles/tailwind.css';
import App from '@popup/App';
import React from 'react';
import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <React.StrictMode>
    <div className="flex p-8 flex-col bg-slate-400 items-center justify-center min-w-[360px]">
      <App />
    </div>
  </React.StrictMode>,
);
