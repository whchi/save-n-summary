import { getTabId, htmlSanitizer } from '@popup/api';
import Button from '@popup/components/Button';
import { useEffect, useState } from 'react';
import { FiBookmark, FiHash } from 'react-icons/fi';
import TagsInput from 'react-tagsinput';
import 'react-tagsinput/react-tagsinput.css';

const App = () => {
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);

  useEffect(() => {
    const getDomContent = async () => {
      chrome.scripting.executeScript({
        // @ts-ignore
        target: { tabId: await getTabId() },
        files: ['src/pages/content/index.js'],
      });
    };
    getDomContent();
  }, []);

  useEffect(() => {
    const listener = (message: { html: string }) => {
      setContent(htmlSanitizer(message.html));
    };
    chrome.runtime.onMessage.addListener(listener);
    return () => {
      chrome.runtime.onMessage.removeListener(listener);
    };
  }, []);

  const handleTagsChange = (newTags: string[]) => {
    setTags(newTags);
  };

  return (
    <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-6 border border-white/60 shadow-lg shadow-teal-900/5">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0D9488] to-[#14B8A6] flex items-center justify-center shadow-md shadow-teal-500/20">
          <FiBookmark className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-base font-semibold text-[#134E4A] tracking-tight">
            Save Article
          </h1>
          <p className="text-xs text-[#5E7C79]">
            AI summary to GitHub
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-4">
        {/* Tags Section */}
        <div>
          <div className="flex items-center gap-2 text-sm font-medium text-[#134E4A] mb-2">
            <FiHash className="w-4 h-4 text-[#0D9488]" />
            Tags
          </div>
          
          <TagsInput
            value={tags}
            onChange={handleTagsChange}
            className="react-tagsinput"
            maxTags={5}
            onlyUnique={true}
            tagProps={{
              className: 'mx-1 bg-teal-50 border border-teal-200 rounded-lg px-2.5 py-1 text-xs font-medium text-teal-700 cursor-pointer hover:bg-teal-100 transition-colors',
              classNameRemove: 'ml-1 font-semibold text-teal-500 hover:text-teal-700'
            }}
            inputProps={{
              className: 'react-tagsinput-input bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-xs placeholder-gray-400 focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-500/20 transition-all',
              placeholder: 'Add tags...'
            }}
          />
          
          {tags.length === 0 && (
            <p className="text-xs text-[#5E7C79] mt-2">
              Optional: Add tags to organize articles
            </p>
          )}
        </div>

        {/* Action Button */}
        <Button content={content} tags={tags} />
      </div>
    </div>
  );
};

export default App;