import { useContext, useState } from 'react';
import { TypeOptions, toast } from 'react-toastify';
import { ActionEnum, SettingsContext } from './SettingsContext';
import { clear, save } from './api';

const SettingsGroup = () => {
  const { state, dispatch } = useContext(SettingsContext);
  const notify = (type: TypeOptions) => {
    toast('action complete!', { type });
  };
  const [isClicked, setIsClicked] = useState(false);
  const handleClick = async (callback: Function) => {
    setIsClicked(true);
    await callback();
    notify('success');
    setIsClicked(false);
  };

  const clearSettings = async () => {
    clear();
    dispatch({ type: ActionEnum.REMOVE });
  };
  const saveSettings = async () => {
    save(state);
  };

  return (
    <div className="flex justify-around content-center">
      <button
        className="mt-4 text-indigo-500 bg-white border-0 py-2 px-6 focus:outline-indigo-600 hover:bg-indigo-200 rounded text-lg w-32"
        disabled={isClicked}
        onClick={() => handleClick(clearSettings)}
      >
        clear
      </button>
      <button
        className="mt-4 text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-lg w-32"
        onClick={() => handleClick(saveSettings)}
        disabled={isClicked}
      >
        save
      </button>
    </div>
  );
};

export default SettingsGroup;
