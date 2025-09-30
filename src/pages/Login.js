import React, { useState, useEffect, Children } from 'react';

import { login } from '../api/allUsuarios';
import { useNavigate } from 'react-router-dom';
import Spinner from '../components/spinner';
import axios from 'axios';

import { useAuth } from '../context/AuthContext';
import { useGestion } from '../context/UserContext';

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
  const { user, checkSession, setUser } = useAuth(); // 💡

  const toggleShowPassword = () => setShowPassword((prev) => !prev);

  const handleSubmit = async (e) => {
    setLoading(true);
    try {
      const resp = await login(usuario, password);

      console.log('RRRRRRRRRRRRRRR', resp);
      setMsg(`Hola, ${resp.user}`);
      localStorage.setItem('Sucursal', resp.Sucursal);
      localStorage.setItem('id_Usuario', resp.id);
      localStorage.setItem('NombreSucursal', resp.NombreSucursal);

      await new Promise((resolve) => setTimeout(resolve, 3000));
      await checkSession();
    } catch (error) {
      setMsg(error.message);
      await new Promise((resolve) => setTimeout(resolve, 3000));
      setMsg('');
    } finally {
      setLoading(false);
    }
  };

  if (user) {
    // Ya está logueado, redirigir a home
    navigator('/home');
  }

  const handleReset = (e) => {
    setResetData({
      ...resetData,
      [e.target.name]: e.target.value,
    });
  };

  const reset = async () => {
    setLoading(true);
    setMsg('Reseteando contraseña ... ');
    // 1. Limpiar los campos
    const nombre = resetData.nombre.trim();
    const new_password = resetData.nuevaPassword.trim();

    // 2. Validar que no estén vacíos
    if (!nombre || !new_password) {
      alert('Por favor, complete todos los campos.');
      return;
    }

    // 3. Armar el objeto para enviar
    const data = {
      nombre,
      new_password,
    };

    console.log('Datos limpios para enviar:', data);

    try {
      // Acá harías el POST a tu backend

      const res = await axios.post(`${url}/user/reset`, data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log('resssss', res);

      await new Promise((resolve, reject) => {
        setTimeout(resolve, 2000);
      });
      setMsg('Contraseña actualizada');
      await new Promise((resolve, reject) => {
        setTimeout(resolve, 3000);
      });
      setLoading(false); // Cerrar el modal
      setModal(false);
      setMsg('');
      setResetData({});
      navigator('/');
    } catch (error) {
      console.error('Error al resetear contraseña:', error);
      /*  const mensaje = error.response?.data?.mensaje || 'Error de conexión o servidor';
      alert('Error al resetear contraseña'); */

      setMsg(error.response.data.message);

      await new Promise((resolve, reject) => {
        setTimeout(resolve, 3000);
      });
      setMsg('');
      setLoading(false);
    }
  };

  return (
    <>
      <div
        className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
        style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', zIndex: 1 }}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault(); // evita que se recargue la página
            handleSubmit(); // llama tu función de login
          }}
          className="container-sm myNavBar rounded p-4 d-flex flex-column gap-3 justify-content-center align-items-center bg-success"
          style={{ minHeigth: '50vh', maxWidth: '400px' }}
        >
          <h2 className="text-white fw-bold">Iniciar Sesión</h2>

          <input
            className="form-control form-control-lg"
            type="text"
            id="user"
            placeholder="Ingrese su usuario"
            value={usuario}
            autoComplete="off"
            onChange={(e) => setUsuario(e.target.value)}
          />

          <div className="input-group">
            <input
              className="form-control form-control-lg"
              type={showPassword ? 'text' : 'password'}
              id="password"
              placeholder="Ingrese su contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              className="btn btn-outline-light"
              type="button"
              title={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              onClick={toggleShowPassword}
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>

          <button className="btn btn-primary w-100 py-3 mt-2" type="submit">
            Ingresar
          </button>

          <label
            className="fs-5 text-white"
            style={{ cursor: 'pointer', textDecoration: 'underline' }}
            onClick={() => setModal(!modal)}
          >
            ¿Olvidaste tu contraseña?
          </label>
        </form>
      </div>

      {modal && (
        <>
          <div className="container-padre"></div>
          <div
            className="position-fixed top-50 start-50 translate-middle d-flex flex-column gap-1 col-10 col-md-4 p-4 
          rounded shadow z-3"
            style={{ backgroundColor: '#127CE6', zIndex: 9999 }}
          >
            <div className="d-flex justify-content-center align-items-center position-relative py-2">
              <h2 className="fw-bold text-white">Resetear contraseña</h2>
              <div className="position-absolute end-0 pe-3">
                <button
                  type="button"
                  className="btn btn-danger w-auto"
                  onClick={() => {
                    setResetData({});
                    setModal(false);
                  }} //
                >
                  X
                </button>
              </div>
            </div>

            <input
              className="form-control form-control-sm w-100 w-lg-50 fs-5 fw-bold"
              type="text"
              name="nombre" // 👈 le pones name
              placeholder="Ingrese su Usuario"
              value={resetData.nombre}
              autoComplete="off"
              onChange={handleReset}
            />

            <input
              className="form-control form-control-sm w-100 w-lg-50 fs-5 fw-bold"
              type="password"
              name="nuevaPassword" // 👈 le pones name
              placeholder="Ingrese su nueva contraseña"
              value={resetData.nuevaPassword}
              autoComplete="off"
              onChange={handleReset}
            />

            <button
              type="button"
              className="btn btn-lg bg-success text-white w-auto mt-2 "
              onClick={reset}
            >
              Aceptar ✅
            </button>
          </div>
        </>
      )}
      <Spinner loading={loading} msg={msg} />
    </>
  );
};

export default Login;
