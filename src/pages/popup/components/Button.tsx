import { Process } from '@popup/api';
import buttonStyles from '@popup/styles/button.module.css';
import { useState } from 'react';

const LoadingDots = () => {
  return (
    <span className="waiting">
      <span>&bull;</span>
      <span>&bull;</span>
      <span>&bull;</span>
    </span>
  );
};

enum ButtonState {
  INIT = 'init',
  WAITING = 'waiting',
  FAIL = 'fail',
}
const Button = ({ content, tags }): JSX.Element => {
  const [isClicked, setIsClicked] = useState(false);
  const [buttonState, setButtonState] = useState(ButtonState.INIT);
  const [title, setTitle] = useState('');
  const defaultStyle =
    'text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-lg';
  const stylesMap = {
    [ButtonState.INIT]: defaultStyle,
    [ButtonState.WAITING]: `${defaultStyle} ${buttonStyles.waiting} cursor-wait bg-zinc-300 hover:bg-zinc-300`,
    [ButtonState.FAIL]: defaultStyle + ' ' + buttonStyles.shake,
  };
  const handleClick = async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    const articleUrl = tab.url;
    if (!articleUrl) {
      throw new Error('Invalid URL');
    }
    setIsClicked(true);
    const processor = Process.getInstance(articleUrl);
    setButtonState(ButtonState.WAITING);
    try {
      await processor.summary(content);
      await processor.save(tags);
      setButtonState(ButtonState.INIT);
      setTitle(tab.title || '');
      setTimeout(() => {
        setTitle('');
      }, 3000);
    } catch (error) {
      console.error(error);
      setButtonState(ButtonState.FAIL);
    }
    setIsClicked(false);
  };

  return (
    <div className="mt-2 text-center">
      <button
        disabled={isClicked}
        className={stylesMap[buttonState]}
        onClick={handleClick}
      >
        {buttonState === ButtonState.WAITING ? <LoadingDots /> : 'save'}
      </button>
      {!!title && (
        <div className="text-center">
          <span className="text-white text-lg">{title} saved!</span>
        </div>
      )}
    </div>
  );
};

export default Button;
