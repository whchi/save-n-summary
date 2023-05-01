import { initState } from '@/context';
export class SummaryError extends Error {}
export class SaveError extends Error {}

export const htmlSanitizer = (html: string) => {
  const parser = new DOMParser();
  const htmlDoc = parser.parseFromString(html, 'text/html');
  const tagsToSanitize = [
    'iframe',
    'button',
    'code',
    'table',
    'script',
    'img',
    'figure',
    'video',
    'svg',
    'style',
    'footer',
  ];
  tagsToSanitize.forEach(tag => {
    const elements = htmlDoc.querySelectorAll(tag);
    elements.forEach(element => element.remove());
  });
  const innerText = htmlDoc.body.innerText;
  const filterText = innerText.replace(/\s{2,}/gi, '');

  return filterText;
};

export const getTabId = async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return tab.id;
};

const getTabTitle = async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return tab.title;
};
const MAX_TOKENS: number = 3500;
export class Process {
  private static instance: Process;
  private url: string;
  private aiSummary: string = '';

  constructor(url: string) {
    this.url = url;
  }
  public static getInstance(url: string): Process {
    if (!Process.instance) {
      Process.instance = new Process(url);
    }
    return Process.instance;
  }
  private countTokens(text) {
    const wordRegex = /[\p{L}\p{N}]+/gu;
    const nonWordRegex = /[^\p{L}\p{N}\p{Z}]+/gu;

    const wordTokens = text.match(wordRegex);
    const nonWordTokens = text.match(nonWordRegex);

    const wordTokenCount = wordTokens ? wordTokens.length : 0;
    const nonWordTokenCount = nonWordTokens ? nonWordTokens.join('').length : 0;

    return wordTokenCount + nonWordTokenCount;
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
  private async getParagraphSummary(openAiToken: string, content: string) {
    try {
      const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${openAiToken}`,
        },
        body: JSON.stringify({
          model: 'text-davinci-003',
          prompt:
            'Summarize the following article within 50~150 characters:\n\n' + content,
          max_tokens: 100,
          n: 1,
          stop: null,
          temperature: 0.7,
        }),
      };
      const response = await fetch(
        'https://api.openai.com/v1/completions',
        requestOptions,
      );
      const chatGptData = await response.json();
      const summary = chatGptData.choices[0].text.trim();
      this.aiSummary += summary + ' ';
    } catch (error) {
      console.error(error);
      throw new SummaryError('Error summarizing article');
    }
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
    if (this.countTokens(content) > MAX_TOKENS) {
      const paragraphs = content.split(/\n+/);
      const maxChunks = Math.ceil(content.length / MAX_TOKENS);
      const perChunk = paragraphs.length / maxChunks === 0 ? maxChunks : maxChunks + 1;
      const chunks: string[] = new Array(maxChunks).fill('');
      let i = 0;
      for (const [idx, paragraph] of paragraphs.entries()) {
        chunks[i] += paragraph + ' ';
        if (idx % perChunk === 0 && idx !== 0) {
          i += 1;
        }
      }
      for (const chunk of chunks) {
        await this.getParagraphSummary(openAiToken, chunk);
      }
    } else {
      const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${openAiToken}`,
        },
        body: JSON.stringify({
          model: 'text-davinci-003',
          prompt:
            'Summarize the following article within 300~500 characters:\n\n' + content,
          max_tokens: 250,
          n: 1,
          stop: null,
          temperature: 0.7,
        }),
      };
      const response = await fetch(
        'https://api.openai.com/v1/completions',
        requestOptions,
      );
      if (response.status === 200) {
        const chatGptData = await response.json();
        const summary = chatGptData.choices[0].text.trim();
        this.aiSummary = summary;
      } else {
        console.error(await response.json());
        throw new SummaryError('Error summarizing article.');
      }
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
    const githubResponse = await fetch(
      `https://api.github.com/repos/${settings.githubRepoOwner}/${settings.githubRepoName}/issues`,
      githubRequestOptions,
    );
    if (githubResponse.status !== 201) {
      console.error(await githubResponse.json());
      throw new SaveError('Error saving article and summary to GitHub issue.');
    }
  }
}
