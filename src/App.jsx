import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { HomePage } from './components/home/HomePage';
import { AuthPage } from './components/auth/AuthPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<HomePage />} />
          <Route path="auth" element={<AuthPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
