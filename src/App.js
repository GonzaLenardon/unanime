import './App.css';
import './css/style.css';
import { React } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Productos from './pages/Productos';
import Proveedores from './pages/Proveedores';
import Ventas from './pages/Ventas';
import Compras from './pages/Compras';
import { Nav } from './components/Nav';
import Home from './pages/Home';
import Login from './pages/Login';
import { CompraResumen } from './pages/CompraResumen';
import VentasResumen from './pages/VentasResumen';
import ComprasVentasProductos from './pages/ComprasVentasProducto';
import { TipoVentas } from './pages/TipoVentas';
import { TipoGastos } from './pages/TipoGastos';
import { Gastos } from './pages/Gastos';
import GastosResumen from './pages/GastosResumen';
import User from './pages/User';
import CambioProducto from './pages/CambioProducto';
import VentasPorSucursales from './pages/VentasPorSucursales';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const navegacion = [
    { path: '/home', admin: false, element: <Home /> },
    { path: '/productos', admin: false, element: <Productos /> },
    { path: '/proveedores', admin: false, element: <Proveedores /> },
    { path: '/ventas', admin: false, element: <Ventas /> },
    { path: '/compras', admin: false, element: <Compras /> },
    { path: '/listado/compra', admin: false, element: <CompraResumen /> },
    { path: '/listado/venta', admin: false, element: <VentasResumen /> },
    /*  {
      path: '/listado/ventas/sucursales',
      admin: true,
      element: <VentasPorSucursales />,
    }, */
    {
      path: '/listado/producto',
      admin: false,
      element: <ComprasVentasProductos />,
    },
    { path: '/listado/gastos', admin: false, element: <GastosResumen /> },
    { path: '/tipoventas', admin: false, element: <TipoVentas /> },
    { path: '/gastos/tipos', admin: false, element: <TipoGastos /> },
    { path: '/gastos', admin: false, element: <Gastos /> },
    /*   { path: '/cambios', admin: false, element: <CambioProducto /> }, */
    { path: '/usuarios', admin: false, element: <User /> },
    { path: '*', admin: false, element: <Navigate to="/home" /> },
  ];

  return (
    <div className="m-1">
      <Routes>
        {/* Ruta de login sin protección */}
        <Route path="/" element={<Login />} />

        {/* Rutas protegidas */}
        {navegacion.map((item, index) => (
          <Route
            key={index}
            path={item.path}
            element={
              <ProtectedRoute adminOnly={item.admin}>
                <Nav />
                <div className="position-relative rounded d-flex flex-column w-100 mt-2 tamanio myBackground">
                  {item.element}
                </div>
              </ProtectedRoute>
            }
          />
        ))}
      </Routes>

      <div className="d-flex justify-content-end mt-2 pe-3">
        <small className="text-secondary">Versión 1.0</small>
      </div>
    </div>
  );
}

export default App;
