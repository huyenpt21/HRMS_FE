import { BrowserRouter } from 'react-router-dom';
import RouterElement from 'router/routes';

function App(): JSX.Element {
  return (
    <BrowserRouter>
      <RouterElement />
    </BrowserRouter>
  );
}

export default App;
