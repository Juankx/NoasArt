import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Home from './pages/Home';
import Materiales from './pages/Materiales';
import Cotizaciones from './pages/Cotizaciones';
import Historial from './pages/Historial';
import Clientes from './pages/Clientes';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/materiales" element={<Materiales />} />
          <Route path="/cotizaciones" element={<Cotizaciones />} />
          <Route path="/historial" element={<Historial />} />
          <Route path="/clientes" element={<Clientes />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
