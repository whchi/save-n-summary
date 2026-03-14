import { ActionEnum } from '@/context';
import { useSettingsContext } from '@/context/SettingsContext';
import { useState } from 'react';
import { FiEye, FiEyeOff } from 'react-icons/fi';

interface InputProps {
  type: string;
  name: string;
  label: string;
  placeholder?: string | null;
  required?: boolean;
}

const Input = ({
  type,
  name,
  label,
  placeholder = null,
  required = false,
}: InputProps) => {
  const [inputType, setInputType] = useState(type);
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const { state, dispatch } = useSettingsContext();

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
    setInputType(!showPassword ? 'text' : 'password');
  };

  return (
    <div className="space-y-1.5">
      <label
        htmlFor={name}
        className="block text-xs font-semibold text-gray-500 uppercase tracking-wide"
      >
        {label}
        {required && <span className="ml-0.5 text-orange-500">*</span>}
      </label>

      <div className="relative">
        <input
          required={required}
          placeholder={placeholder || undefined}
          className={`w-full px-4 py-2.5 rounded-xl text-sm text-[#134E4A] transition-all duration-150 ${
            isFocused
              ? 'bg-white border-teal-500 ring-2 ring-teal-500/20'
              : 'bg-white/50 border-gray-200 hover:border-gray-300'
          } border`}
          type={inputType}
          id={name}
          name={name}
          value={state[name as keyof typeof state]}
          onChange={(e) => {
            dispatch({
              type: ActionEnum.UPDATE,
              payload: { [name]: e.target.value },
            });
          }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />

        {type === 'password' && (
          <button
            type="button"
            onClick={handleTogglePassword}
            className={`absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg transition-colors cursor-pointer ${
              showPassword
                ? 'text-teal-600 bg-teal-50'
                : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
            }`}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? (
              <FiEye className="w-4 h-4" />
            ) : (
              <FiEyeOff className="w-4 h-4" />
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default Input;