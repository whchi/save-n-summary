import { ActionEnum, SettingsContext } from '@/context';
import inputShake from '@options/styles/inputShake.module.css';
import { useContext, useRef, useState } from 'react';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';

const Input = ({ type, name, label, placeholder = null, required = false }) => {
  const [_token, setToken] = useState('');
  const [inputType, setInputType] = useState(type);
  const [showPassword, setShowPassword] = useState(false);
  const [isShaking, setIsShaking] = useState(false);

  const { state, dispatch } = useContext(SettingsContext);

  const handleShowPassword = async () => {
    const { checked } = checkboxRef.current;
    await setShowPassword(!checked);
    let t = !checked ? 'text' : 'password';
    setInputType(t);
  };
  const checkboxRef = useRef(false);
  return (
    <div className="relative mt-1 mb-4">
      <label
        htmlFor={name}
        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
      >
        {label}
      </label>
      <input
        required={required}
        placeholder={placeholder}
        className={`${
          isShaking ? inputShake.shake : ''
        } text-lg px-4 block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
        type={inputType}
        id={name}
        name={name}
        value={state[name]}
        onChange={e => {
          setToken(e.target.value);
          dispatch({ type: ActionEnum.UPDATE, payload: { [name]: e.target.value } });
          if (e.target.value.trim() === '') {
            setIsShaking(true);
            setTimeout(() => {
              setIsShaking(false);
            }, 1000);
            return;
          }
        }}
      />
      {type === 'password' && (
        <div>
          <input
            id={`show-password-${name}`}
            type="checkbox"
            ref={checkboxRef}
            className="hidden"
            checked={showPassword}
          />
          <label
            htmlFor={`show-password-${name}`}
            className="absolute cursor-pointer"
            onClick={handleShowPassword}
            style={{ inset: '50% 1% auto auto' }}
          >
            {showPassword ? (
              <AiOutlineEye color="white" size="28px" />
            ) : (
              <AiOutlineEyeInvisible color="white" size="28px" />
            )}
          </label>
        </div>
      )}
    </div>
  );
};
export default Input;
