import React, { useState, useEffect, Children } from 'react';

import { useNavigate } from 'react-router-dom';
import Spinner from '../components/spinner';
import axios, { AxiosError } from 'axios';

import { useAuth } from '../context/AuthContext';
import { useGestion } from '../context/UserContext';
import { log, resetPassword } from '../api/allUsuarios';
import { getAxiosErrorMessage } from '../utils/axiosError';

const url = process.env.REACT_APP_API_URL;

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('Validando usuario ...');
  const [modal, setModal] = useState(false);
  const [resetData, setResetData] = useState({
    nombre: '',
    nuevaPassword: '',
  });

  const navigator = useNavigate();
  /*  const { user, checkSession, setUser } = useAuth(); // 💡 */

  const toggleShowPassword = () => setShowPassword((prev) => !prev);

  const handleSubmit = async (e) => {
    setLoading(true);
    try {
      const resp = await log(usuario, password);
      console.log('RRRRRRRRRRRRRRR', resp);
      setMsg(`Hola, ${resp.user}`);

      localStorage.setItem('Usuario', resp.user);
      localStorage.setItem('Usuario_id', resp.id);
      localStorage.setItem('admin', resp.admin);
      localStorage.setItem('sucursal_id', resp.Sucursal);
      localStorage.setItem('NombreSucursal', resp.NombreSucursal);

      await new Promise((resolve) => setTimeout(resolve, 3000));

      navigator('/home', { replace: true });

      /*  await checkSession(); */
    } catch (error) {
      setMsg(error.message);
      await new Promise((resolve) => setTimeout(resolve, 3000));
      setMsg('');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = (e) => {
    setResetData({
      ...resetData,
      [e.target.name]: e.target.value,
    });
  };

  const reset = async () => {
    const nombre = resetData.nombre?.trim();
    const new_password = resetData.nuevaPassword?.trim();

    // Validar antes de activar loading
    if (!nombre || !new_password) {
      return alert('Por favor, complete todos los campos.');
    }

    const data = { nombre, new_password };

    try {
      setLoading(true);
      setMsg('Reseteando contraseña ...');

      console.log('Datos limpios para enviar:', data);

      const newPass = await resetPassword(data);
      console.log('newPass', newPass);

      setMsg('Contraseña actualizada');

      // Pequeño helper reutilizable
      await new Promise((resolve) => setTimeout(resolve, 3000));

      // Reset de estados
      setModal(false);
      setResetData({});
      setMsg('');

      navigator('/');
    } catch (error) {
      console.error('Error al resetear contraseña:', error);

      setMsg(getAxiosErrorMessage(error));

      await new Promise((resolve) => setTimeout(resolve, 3000));
      setMsg('');
    } finally {
      // Esto se ejecuta siempre, haya error o no
      setLoading(false);
    }
  };

  return (
    <>
      <div
        className="position-fixed top-0 start-0 w-100 h-100 d-flex"
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          overflow: 'hidden',
        }}
      >
        {/* Columna Izquierda - Imagen (8 columnas) */}
        <div
          className="d-none d-lg-flex col-lg-8 position-relative align-items-center justify-content-center p-5"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {/* Overlay con gradiente */}
          <div
            className="position-absolute top-0 start-0 w-100 h-100"
            style={{
              background:
                'linear-gradient(135deg, rgba(102, 126, 234, 0.85) 0%, rgba(118, 75, 162, 0.85) 100%)',
            }}
          ></div>

          {/* Contenido sobre la imagen */}
          <div className="position-relative text-white text-center z-2">
            <div
              className="mb-4 d-flex align-items-center justify-content-center mx-auto rounded-circle"
              style={{
                width: '120px',
                height: '120px',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(10px)',
                border: '3px solid rgba(255, 255, 255, 0.3)',
              }}
            >
              <i className="bi bi-shop-window" style={{ fontSize: '4rem' }}></i>
            </div>
            <h1
              className="display-3 fw-bold mb-3"
              style={{ textShadow: '0 4px 15px rgba(0,0,0,0.3)' }}
            >
              Unanime
            </h1>
            <p
              className="fs-4 fw-light mb-4"
              style={{ textShadow: '0 2px 10px rgba(0,0,0,0.2)' }}
            >
              Sistema de Gestión de Ventas
            </p>
            {/*   <div className="d-flex gap-4 justify-content-center mt-5">
              <div className="text-center">
                <div className="fs-1 fw-bold">500+</div>
                <div className="text-white-50">Productos</div>
              </div>
              <div className="text-center">
                <div className="fs-1 fw-bold">3</div>
                <div className="text-white-50">Sucursales</div>
              </div>
              <div className="text-center">
                <div className="fs-1 fw-bold">24/7</div>
                <div className="text-white-50">Soporte</div>
              </div>
            </div> */}
          </div>
        </div>

        {/* Columna Derecha - Formulario (4 columnas) */}
        <div
          className="col-12 col-lg-4 d-flex align-items-center justify-content-center p-4"
          style={{
            backgroundColor: 'white',
            boxShadow: '-10px 0 30px rgba(0,0,0,0.1)',
          }}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
            className="w-100"
            style={{ maxWidth: '400px' }}
          >
            {/* Logo móvil */}
            <div className="d-lg-none text-center mb-4">
              <div
                className="mx-auto rounded-circle d-flex align-items-center justify-content-center mb-3"
                style={{
                  width: '80px',
                  height: '80px',
                  background:
                    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                }}
              >
                <i
                  className="bi bi-shop-window text-white"
                  style={{ fontSize: '2.5rem' }}
                ></i>
              </div>
              <h2
                className="fw-bold"
                style={{
                  background:
                    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Unanime
              </h2>
            </div>

            <h2 className="fw-bold mb-2" style={{ color: '#667eea' }}>
              ¡Bienvenido! 👋
            </h2>
            <p className="text-muted mb-4">
              Ingresa tus credenciales para continuar
            </p>

            {/* Usuario */}
            <div className="mb-3">
              <label className="form-label fw-semibold text-muted small">
                USUARIO
              </label>
              <div className="position-relative">
                <i
                  className="bi bi-person-fill position-absolute text-muted"
                  style={{
                    left: '15px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    fontSize: '1.2rem',
                  }}
                ></i>
                <input
                  className="form-control form-control-lg ps-5 border-2"
                  type="text"
                  placeholder="Ingresa tu usuario"
                  value={usuario}
                  autoComplete="off"
                  onChange={(e) => setUsuario(e.target.value)}
                  style={{
                    borderRadius: '12px',
                    borderColor: '#e0e0e0',
                    transition: 'all 0.3s ease',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#667eea';
                    e.target.style.boxShadow =
                      '0 0 0 0.2rem rgba(102, 126, 234, 0.15)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e0e0e0';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
            </div>

            {/* Contraseña */}
            <div className="mb-3">
              <label className="form-label fw-semibold text-muted small">
                CONTRASEÑA
              </label>
              <div className="position-relative">
                <i
                  className="bi bi-lock-fill position-absolute text-muted"
                  style={{
                    left: '15px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    fontSize: '1.2rem',
                  }}
                ></i>
                <input
                  className="form-control form-control-lg ps-5 pe-5 border-2"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Ingresa tu contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    borderRadius: '12px',
                    borderColor: '#e0e0e0',
                    transition: 'all 0.3s ease',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#667eea';
                    e.target.style.boxShadow =
                      '0 0 0 0.2rem rgba(102, 126, 234, 0.15)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e0e0e0';
                    e.target.style.boxShadow = 'none';
                  }}
                />
                <button
                  className="btn position-absolute border-0"
                  type="button"
                  onClick={toggleShowPassword}
                  style={{
                    right: '5px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    fontSize: '1.2rem',
                  }}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            {/* Olvidaste contraseña */}
            <div className="text-end mb-4">
              <span
                className="text-decoration-none fw-semibold"
                style={{
                  color: '#667eea',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                }}
                onClick={() => setModal(true)}
              >
                ¿Olvidaste tu contraseña?
              </span>
            </div>

            {/* Botón Ingresar */}
            <button
              className="btn btn-lg w-100 text-white fw-bold shadow-sm mb-3"
              type="submit"
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '12px',
                padding: '14px',
                border: 'none',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow =
                  '0 8px 20px rgba(102, 126, 234, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 10px rgba(0,0,0,0.1)';
              }}
            >
              <i className="bi bi-box-arrow-in-right me-2"></i>
              Iniciar Sesión
            </button>

            <div className="text-center mt-4 pt-3 border-top">
              <small className="text-muted">
                © 2024 Unanime. Todos los derechos reservados.
              </small>
            </div>
          </form>
        </div>

        {/* Modal Reset Password */}
        {modal && (
          <>
            <div
              className="position-fixed top-0 start-0 w-100 h-100"
              style={{
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                zIndex: 9998,
                backdropFilter: 'blur(5px)',
              }}
              onClick={() => setModal(false)}
            ></div>

            <div
              className="position-fixed top-50 start-50 translate-middle bg-white rounded-4 shadow-lg p-4"
              style={{
                zIndex: 9999,
                maxWidth: '450px',
                width: '90%',
              }}
            >
              <div className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom">
                <h3 className="fw-bold mb-0" style={{ color: '#667eea' }}>
                  <i className="bi bi-key me-2"></i>
                  Resetear Contraseña
                </h3>
                <button
                  type="button"
                  className="btn btn-sm btn-danger rounded-circle"
                  onClick={() => {
                    setResetData({ nombre: '', nuevaPassword: '' });
                    setModal(false);
                  }}
                  style={{ width: '35px', height: '35px' }}
                >
                  <i className="bi bi-x-lg"></i>
                </button>
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold text-muted small">
                  USUARIO
                </label>
                <input
                  className="form-control form-control-lg border-2"
                  type="text"
                  name="nombre"
                  placeholder="Ingresa tu usuario"
                  value={resetData.nombre}
                  autoComplete="off"
                  onChange={handleReset}
                  style={{ borderRadius: '12px' }}
                />
              </div>

              <div className="mb-4">
                <label className="form-label fw-semibold text-muted small">
                  NUEVA CONTRASEÑA
                </label>
                <input
                  className="form-control form-control-lg border-2"
                  type="password"
                  name="nuevaPassword"
                  placeholder="Ingresa tu nueva contraseña"
                  value={resetData.nuevaPassword}
                  autoComplete="off"
                  onChange={handleReset}
                  style={{ borderRadius: '12px' }}
                />
              </div>

              <button
                type="button"
                className="btn btn-lg w-100 text-white fw-bold"
                onClick={reset}
                style={{
                  background:
                    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  borderRadius: '12px',
                  border: 'none',
                }}
              >
                <i className="bi bi-check-circle me-2"></i>
                Confirmar Cambio
              </button>
            </div>
          </>
        )}
      </div>

      <Spinner loading={loading} msg={msg} />
    </>
  );
};

export default Login;
