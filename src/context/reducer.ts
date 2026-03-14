import { Action, ActionEnum, State, initState } from './SettingsContext';

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case ActionEnum.UPDATE: {
      return { ...state, ...action.payload };
    }
    case ActionEnum.REMOVE: {
      return { ...initState };
    }
    default: {
      throw Error('Unknown action');
    }
  }
};

export default reducer;
