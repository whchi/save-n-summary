import React, { createContext } from 'react';

export type State = {
  githubToken: string;
  githubRepoOwner: string;
  githubRepoName: string;
  openAiToken: string;
};

export enum ActionEnum {
  UPDATE = 'update',
  REMOVE = 'remove',
}

export type Action = {
  type: ActionEnum.UPDATE | ActionEnum.REMOVE;
  payload?: State;
};

export const initState: State = {
  githubToken: '',
  openAiToken: '',
  githubRepoOwner: '',
  githubRepoName: '',
};

export const SettingsContext = createContext<{
  state: State;
  dispatch: React.Dispatch<Action>;
}>({
  state: initState,
  dispatch: () => {},
});
