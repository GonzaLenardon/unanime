import axios from 'axios';
import instance from './interceptor';

export const allUsuarios = async () => {
  const res = await instance.get(`/user`);

  return res.data; // Retornar los usuarios si querés usarlos en otro lado
};

/* export const login = async (usuario, password) => {
  try {
    const url = process.env.REACT_APP_API_URL;
    const res = await axios.post(
      `${url}/user/login`,
      {
        nombre: usuario,
        password: password,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 10000,
        withCredentials: true, // ✅ importante para cookies
      }
    );

    return res.data; // Retornar los usuarios si querés usarlos en otro lado
  } catch (error) {
    console.error('Error al obtener login de usuarios:', error);
    const mensaje =
      error.response?.data?.mensaje || 'Error de conexión o servidor';
    throw new Error(mensaje); // Devolvés un array vacío o podés manejar el error de otra forma
  }
}; */

export const log = async (usuario, password) => {
  const url = process.env.REACT_APP_API_URL;
  console.log('paso x login');

  const resp = await axios.post(
    `${url}/user/login`,
    { nombre: usuario, password: password },
    {
      withCredentials: true, // 👈 IMPORTANTE: permite enviar/recibir cookies
    }
  );
  return resp.data;
};

export const auth = async () => {
  try {
    const url = process.env.REACT_APP_API_URL;
    const res = await axios.get(`${url}/user/me`, {
      withCredentials: true, // 👈 Esto es fundamental para enviar la cookie
    });
    console.log('Usuario autenticado:', res.data);
    return res.data;
  } catch (error) {
    console.error('Error al autenticar usuario:', error.message);
    return null; // O manejalo como necesites
  }
};

export const upUser = async (user) => {
  const res = await instance.put(`/user`, user);
  console.log('Usuarios:', res.data); // Mostramos solo la data útil
  return res.data; // Retornar los usuarios si querés usarlos en otro lado
};

export const addUser = async (user) => {
  const res = await instance.post(`/user`, user);

  return res.data; // Retornar los usuarios si querés usarlos en otro lado
};

export const resetPassword = async (data) => {
  const res = await instance.post(`/user/reset`, data);
  return res.data;
};
