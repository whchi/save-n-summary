import { SettingsProvider } from '@/context';
import ButtonsGroup from '@options/ButtonsGroup';
import Input from '@options/components/Input';
import { ToastContainer } from 'react-toastify';
const App = () => {
  return (
    <SettingsProvider>
      <div className="w-3/4 mx-auto p-8">
        <div className="flex p-8 flex-col bg-slate-400">
          <Input type="password" name="githubToken" label="github token" />
          <Input
            type="text"
            name="githubRepoOwner"
            label="github repo owner"
            required={true}
          />
          <Input
            type="text"
            name="githubRepoName"
            label="github repo name"
            required={true}
          />
          <Input type="password" name="openAiToken" label="openAI token" />
          <ButtonsGroup />
          <ToastContainer
            pauseOnFocusLoss={false}
            pauseOnHover={false}
            style={{ fontSize: '1.2rem', zIndex: 99 }}
            position="top-center"
            autoClose={500}
            limit={3}
          />
        </div>
      </div>
    </SettingsProvider>
  );
};

export default App;
