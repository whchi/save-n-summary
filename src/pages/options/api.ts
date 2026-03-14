import { initState, State } from '@/context';

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export const validateSettings = (params: State): string[] => {
  const errors: string[] = [];

  if (params.githubToken && !params.githubToken.startsWith('ghp_')) {
    errors.push('GitHub token must start with "ghp_"');
  }

  if (params.openAiToken && !params.openAiToken.startsWith('sk-')) {
    errors.push('OpenAI token must start with "sk-"');
  }

  return errors;
};

export const save = (params: State): void => {
  const errors = validateSettings(params);
  if (errors.length > 0) {
    throw new ValidationError(errors.join(', '));
  }

  const { githubToken, openAiToken, githubRepoName, githubRepoOwner, openAiModel } = params;
  chrome.storage.local.set({
    settings: { githubToken, openAiToken, githubRepoName, githubRepoOwner, openAiModel },
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
