import { BrowserRouter } from 'react-router-dom';
import Compiler from './components/Compiler';

export default function App() {
  return (
    <BrowserRouter>
      <Compiler />
    </BrowserRouter>
  );
}
