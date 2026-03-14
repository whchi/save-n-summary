import { ActionEnum } from '@/context';
import { useSettingsContext } from '@/context/SettingsContext';
import { clear, save } from '@options/api';
import { useState } from 'react';
import { FiTrash2, FiSave } from 'react-icons/fi';
import { TypeOptions, toast } from 'react-toastify';

type ButtonState = 'idle' | 'loading';

const ButtonsGroup = () => {
  const { state, dispatch } = useSettingsContext();
  const [isLoading, setIsLoading] = useState(false);
  const [actionType, setActionType] = useState<'save' | 'clear' | null>(null);

  const notify = (type: TypeOptions, message: string) => {
    toast(message, { type });
  };

  const handleAction = async (action: 'save' | 'clear') => {
    setIsLoading(true);
    setActionType(action);

    try {
      if (action === 'clear') {
        clear();
        dispatch({ type: ActionEnum.REMOVE });
        notify('success', 'Settings cleared successfully');
      } else {
        save(state);
        notify('success', 'Settings saved successfully');
      }
    } catch (error) {
      notify('error', 'An error occurred');
    } finally {
      setIsLoading(false);
      setActionType(null);
    }
  };

  return (
    <div className="flex gap-3 pt-2">
      {/* Clear Button */}
      <button
        type="button"
        disabled={isLoading}
        onClick={() => handleAction('clear')}
        className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-medium text-sm text-teal-700 bg-teal-50 border border-teal-200 hover:bg-teal-100 active:scale-[0.98] transition-all duration-150 cursor-pointer disabled:opacity-50"
      >
        {actionType === 'clear' && isLoading ? (
          <span className="w-4 h-4 border-2 border-teal-300 border-t-teal-600 rounded-full animate-spin" />
        ) : (
          <FiTrash2 className="w-4 h-4" />
        )}
        Clear
      </button>

      {/* Save Button - Orange CTA */}
      <button
        type="button"
        disabled={isLoading}
        onClick={() => handleAction('save')}
        className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-orange-500 to-orange-600 shadow-md shadow-orange-500/30 hover:shadow-lg hover:shadow-orange-500/40 active:scale-[0.98] transition-all duration-150 cursor-pointer disabled:opacity-50"
      >
        {actionType === 'save' && isLoading ? (
          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          <FiSave className="w-4 h-4" />
        )}
        Save Settings
      </button>
    </div>
  );
};

export default ButtonsGroup;