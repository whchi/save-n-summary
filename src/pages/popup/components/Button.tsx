import { Process } from '@popup/api';
import { useState } from 'react';
import { FiCheck, FiLoader, FiAlertCircle, FiSave } from 'react-icons/fi';

type ButtonState = 'init' | 'waiting' | 'fail' | 'success';

interface ButtonProps {
  content: string;
  tags: string[];
}

const Button = ({ content, tags }: ButtonProps): React.JSX.Element => {
  const [buttonState, setButtonState] = useState<ButtonState>('init');
  const [title, setTitle] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleClick = async () => {
    if (buttonState === 'waiting') return;

    try {
      setErrorMessage('');
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      const articleUrl = tab.url;
      
      if (!articleUrl) {
        throw new Error('Invalid URL');
      }

      setButtonState('waiting');
      const processor = Process.getInstance(articleUrl);
      
      await processor.summary(content);
      await processor.save(tags);
      
      setButtonState('success');
      setTitle(tab.title || 'Article');
      
      setTimeout(() => {
        setButtonState('init');
        setTitle('');
      }, 3000);
    } catch (error: any) {
      console.error('Save failed:', error);
      setButtonState('fail');
      setErrorMessage(error.message || 'An error occurred. Please try again.');
      
      setTimeout(() => {
        setButtonState('init');
        setErrorMessage('');
      }, 4000);
    }
  };

  const getButtonClasses = () => {
    const base = 'w-full py-3 px-5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-150';
    
    switch (buttonState) {
      case 'waiting':
        return `${base} bg-gray-200 text-gray-400 cursor-wait`;
      case 'success':
        return `${base} bg-gradient-to-r from-[#0D9488] to-[#14B8A6] text-white shadow-md shadow-teal-500/30`;
      case 'fail':
        return `${base} bg-red-500 text-white shadow-md shadow-red-500/30 hover:bg-red-600`;
      default:
        return `${base} bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md shadow-orange-500/30 hover:shadow-lg hover:shadow-orange-500/40 active:scale-[0.98] cursor-pointer`;
    }
  };

  return (
    <div className="mt-3">
      <button
        type="button"
        disabled={buttonState === 'waiting'}
        className={getButtonClasses()}
        onClick={handleClick}
      >
        {buttonState === 'waiting' && (
          <span className="flex items-center gap-2">
            <FiLoader className="w-4 h-4 animate-spin" />
            <span>Processing...</span>
          </span>
        )}
        {buttonState === 'success' && (
          <span className="flex items-center gap-2 animate-success">
            <FiCheck className="w-4 h-4" />
            <span>Saved</span>
          </span>
        )}
        {buttonState === 'fail' && (
          <span className="flex items-center gap-2">
            <FiAlertCircle className="w-4 h-4" />
            <span>Try Again</span>
          </span>
        )}
        {buttonState === 'init' && (
          <span className="flex items-center gap-2">
            <FiSave className="w-4 h-4" />
            <span>Save Article</span>
          </span>
        )}
      </button>

      {errorMessage && (
        <div className="mt-3 animate-fade-slide-up">
          <div className="flex items-start gap-2 p-3 text-xs font-medium rounded-xl bg-red-50 text-red-700 border border-red-200 shadow-sm shadow-red-500/10">
            <FiAlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
            <span className="leading-relaxed">{errorMessage}</span>
          </div>
        </div>
      )}

      {title && (
        <div className="mt-3 text-center animate-fade-slide-up">
          <span className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200">
            <FiCheck className="w-3.5 h-3.5 text-teal-600" />
            {title.length > 30 ? title.substring(0, 30) + '...' : title} saved!
          </span>
        </div>
      )}
    </div>
  );
};

export default Button;