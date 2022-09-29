import { AuthProvider } from 'providers/authProvider';
import { BrowserRouter } from 'react-router-dom';
import RouterElement from 'router/routes';

function App(): JSX.Element {
  return (
    <AuthProvider>
      <BrowserRouter>
        <RouterElement />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
