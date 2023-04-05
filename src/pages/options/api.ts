import { initState, State } from './SettingsContext';

export const save = (params: any) => {
  const { githubToken, openAiToken, githubRepoName, githubRepoOwner } = params;
  chrome.storage.local.set({
    settings: { githubToken, openAiToken, githubRepoName, githubRepoOwner },
  });
};

export const clear = () => {
  chrome.storage.local.clear();
};

export const getSettings = async (): Promise<State> => {
  const settings = (await chrome.storage.local.get('settings')) as State;
  if (Object.keys(settings).length === 0) {
    return initState;
  }
  return settings;
};
