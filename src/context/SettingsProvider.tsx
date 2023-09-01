import { useReducer, useEffect } from 'react';
import reducer from './reducer';
import { initState, SettingsContext, ActionEnum } from './SettingsContext';
import { getSettings } from '@options/api';

const SettingsProvider = ({ children }: any) => {
  const [state, dispatch] = useReducer(reducer, initState);

  useEffect(() => {
    const fetchSettings = async () => {
      const settings = await getSettings();
      // @ts-ignore
      dispatch({ type: ActionEnum.UPDATE, payload: settings.settings });
    };
    fetchSettings();
  }, []);

  if (state === null) {
    return <>Loading...</>;
  }

  return (
    <SettingsContext.Provider value={{ state, dispatch }}>
      {children}
    </SettingsContext.Provider>
  );
};

export default SettingsProvider;
