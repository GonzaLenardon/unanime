import { Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import instance from '../api/interceptor';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const [auth, setAuth] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    instance
      .get('/user/me')
      .then((response) => {
        console.log('✅ Usuario autenticado:', response.data);
        setAuth(true);
        setIsAdmin(response.data.admin || response.data.rol === 'admin');
      })
      .catch((error) => {
        console.log('❌ No autenticado');
        setAuth(false);
      });
  }, []);

  // Mostrar loading
  if (auth === null) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: '60vh' }}
      >
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  // No autenticado
  if (!auth) {
    return <Navigate to="/" replace />;
  }

  // Autenticado pero sin permisos de admin
  if (adminOnly && !isAdmin) {
    return (
      <div className="alert alert-danger m-3">
        <h4>Acceso Denegado</h4>
        <p>No tienes permisos para acceder a esta sección.</p>
      </div>
    );
  }

  // Todo OK
  return children;
};

export default ProtectedRoute;
