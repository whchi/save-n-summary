import '@/styles/tailwind.css';
import App from '@options/App';
import React from 'react';
import { createRoot } from 'react-dom/client';
import 'react-toastify/dist/ReactToastify.css';

const root = createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <React.StrictMode>
    <div className="min-h-screen bg-[#F0FDFA] py-10 px-4">
      <App />
    </div>
  </React.StrictMode>,
);