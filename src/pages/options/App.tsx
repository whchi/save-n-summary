import { SettingsProvider } from '@/context';
import ButtonsGroup from '@options/ButtonsGroup';
import Input from '@options/components/Input';
import { FiSettings, FiGithub, FiKey } from 'react-icons/fi';
import { ToastContainer } from 'react-toastify';

const App = () => {
  return (
    <SettingsProvider>
      <div className="max-w-2xl mx-auto animate-fade-slide-up">
        {/* Main Card */}
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl p-8 mb-6 border border-white/60 shadow-lg shadow-teal-900/5">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0D9488] to-[#14B8A6] flex items-center justify-center shadow-md shadow-teal-500/30">
              <FiSettings className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-[#134E4A] tracking-tight">
                Settings
              </h1>
              <p className="text-sm text-[#5E7C79]">
                Configure your integrations
              </p>
            </div>
          </div>

          {/* GitHub Section */}
          <div className="bg-gray-50 rounded-xl p-5 mb-5 border border-teal-100">
            <div className="flex items-center gap-2 text-sm font-semibold text-[#134E4A] mb-4">
              <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center">
                <FiGithub className="w-4 h-4 text-[#0D9488]" />
              </div>
              <span>GitHub Integration</span>
            </div>
            
            <div className="space-y-4">
              <Input
                type="password"
                name="githubToken"
                label="Personal Access Token"
                placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  type="text"
                  name="githubRepoOwner"
                  label="Owner"
                  placeholder="username"
                  required={true}
                />
                <Input
                  type="text"
                  name="githubRepoName"
                  label="Repository"
                  placeholder="repo-name"
                  required={true}
                />
              </div>
            </div>
          </div>

          {/* OpenAI Section */}
          <div className="bg-gray-50 rounded-xl p-5 mb-6 border border-teal-100">
            <div className="flex items-center gap-2 text-sm font-semibold text-[#134E4A] mb-4">
              <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center">
                <FiKey className="w-4 h-4 text-[#0D9488]" />
              </div>
              <span>AI Configuration</span>
            </div>
            
            <Input
              type="password"
              name="openAiToken"
              label="OpenAI API Key"
              placeholder="sk-xxxxxxxxxxxxxxxxxxxxxxxx"
            />
          </div>

          {/* Action Buttons */}
          <ButtonsGroup />
        </div>

        {/* Toast Container */}
        <ToastContainer
          pauseOnFocusLoss={false}
          pauseOnHover={false}
          className="text-sm font-medium"
          position="top-center"
          autoClose={2000}
          limit={3}
          toastClassName="bg-white border border-teal-200 shadow-lg rounded-xl"
        />
      </div>
    </SettingsProvider>
  );
};

export default App;