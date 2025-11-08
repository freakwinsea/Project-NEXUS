import { Route, Routes, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
