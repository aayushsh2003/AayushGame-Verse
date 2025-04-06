
import { createRoot } from 'react-dom/client';
import App from './App.tsx';

// Import Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';
// Import custom styles
import './index.css';

createRoot(document.getElementById("root")!).render(<App />);
