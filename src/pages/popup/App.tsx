import { useEffect, useState } from 'react';
import Button from './Button';
import { getTabId } from './api';
import TagsInput from 'react-tagsinput';
import 'react-tagsinput/react-tagsinput.css';

const App = () => {
  const [content, setContent] = useState('');
  const [tags, setTags] = useState([]);
  useEffect(() => {
    const getDomContent = async () => {
      chrome.scripting.executeScript({
        target: { tabId: await getTabId() },
        files: ['src/pages/content/index.js'],
      });
    };
    getDomContent();
  }, []);

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    setContent(message.content);
  });
  const handleTagsChange = tags => {
    setTags(tags);
  };
  return (
    <div className="w-96">
      <TagsInput
        value={tags}
        onChange={handleTagsChange}
        className="react-tagsinput rounded"
        focusedClassName="border-indigo-300"
        maxTags={5}
        onlyUnique={true}
        tagProps={{
          className: 'mx-1 bg-indigo-100 border-indigo-400 p-2 text-indigo-600',
          classNameRemove:
            'cursor-pointer font-bold text-indigo-600 after:content-["_×"]',
        }}
        inputProps={{
          className: 'react-tagsinput-input',
          placeholder: 'add',
        }}
      />
      <Button content={content} tags={tags} />
    </div>
  );
};

export default App;