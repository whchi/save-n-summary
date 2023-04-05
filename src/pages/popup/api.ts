import { initState } from '@/pages/options/SettingsContext';
export class SummaryError extends Error {}
export class SaveError extends Error {}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export const getTabId = async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return tab.id;
};

const getTabTitle = async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return tab.title;
};

export class Process {
  private static instance: Process;
  private url: string;
  private origin: string;
  private aiSummary: string = '';

  constructor(url: string, origin: string) {
    this.url = url;
    this.origin = origin;
  }
  public static getInstance(url: string, origin: string): Process {
    if (!Process.instance) {
      Process.instance = new Process(url, origin);
    }
    return Process.instance;
  }

  private async getSettings() {
    let settings = await chrome.storage.local.get('settings');
    if (Object.keys(settings).length === 0) {
      settings = initState;
    } else {
      settings = settings.settings;
    }
    return settings;
  }

  public async summary(content: string = ''): Promise<string | void> {
    if (!content) {
      return;
    }
    const { openAiToken } = await this.getSettings();
    if (!openAiToken) {
      alert('Please set your OpenAI API key in the extension options.');
      return;
    }
    const prompt = `Summarize the following article within 300~500 characters: ${content}`;

    if (prompt.length > 10000) {
      console.log(prompt);
      // @todo 改成 promise.all 執行
      throw new SummaryError('The article is too long, max 10000 characters');
    }
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${openAiToken}`,
      },
      body: JSON.stringify({
        model: 'text-davinci-003',
        prompt: `Summarize the following article within 300~500 characters: ${content}`,
        max_tokens: 1000, // english 500, 中文 300
        n: 1,
        stop: null,
        temperature: 0.7,
      }),
    };
    console.log('chatGPT summary begin');
    const response = await fetch(
      'https://api.openai.com/v1/completions',
      requestOptions,
    );
    if (response.status === 200) {
      const chatGptData = await response.json();
      const summary = chatGptData.choices[0].text.trim();
      this.aiSummary = summary;
      console.log('chatGPT summary success');
    } else {
      console.error(await response.json());
      throw new SummaryError('Error summarizing article.');
    }
  }

  public async save(tags: any = []): Promise<void> {
    const settings = await this.getSettings();
    if (!settings.githubToken) {
      alert('Please set your GitHub personal access token in the extension options.');
      return;
    }
    const githubRequestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/vnd.github+json',
        Authorization: `token ${settings.githubToken}`,
        'X-GitHub-Api-Version': '2022-11-28',
      },
      body: JSON.stringify({
        title: `Article summary: [${await getTabTitle()}]`,
        body: `Article URL: \n${this.url}\n\nSummary:\n${this.aiSummary}`,
        labels: tags,
      }),
    };
    console.log('save to github issue begin');
    const githubResponse = await fetch(
      `https://api.github.com/repos/${settings.githubRepoOwner}/${settings.githubRepoName}/issues`,
      githubRequestOptions,
    );
    const res = await githubResponse.json();
    if (githubResponse.status === 201) {
      console.log('save to github issue success');
    } else {
      console.error(res);
      throw new SaveError('Error saving article and summary to GitHub issue.');
    }
  }
}
