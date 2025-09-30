import axios from 'axios';

export const allUsuarios = async () => {
  try {
    const url = process.env.REACT_APP_API_URL;
    const res = await axios.get(
      `${url}/user`,
      {},
      {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 10000,
      }
    );
    console.log('Usuarios:', res.data); // Mostramos solo la data útil
    return res.data; // Retornar los usuarios si querés usarlos en otro lado
  } catch (error) {
    if (error.code === 'ECONNABORTED') {
      throw new Error(
        'La consulta tardó más de 5 segundos. Verifica tu conexión.'
      );
    } else if (!navigator.onLine) {
      throw new Error('No tienes conexión a Internet.');
    } else {
      throw new Error('Ocurrió un error al obtener los productos.');
    }
  }
};

export const login = async (usuario, password) => {
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
  try {
    const url = process.env.REACT_APP_API_URL;
    const res = await axios.put(`${url}/user`, user, {
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    });
    console.log('Usuarios:', res.data); // Mostramos solo la data útil
    return res.data; // Retornar los usuarios si querés usarlos en otro lado
  } catch (error) {
    if (error.code === 'ECONNABORTED') {
      throw new Error(
        'La consulta tardó más de 5 segundos. Verifica tu conexión.'
      );
    } else if (!navigator.onLine) {
      throw new Error('No tienes conexión a Internet.');
    } else {
      throw new Error('Ocurrió un error al actualizar user.');
    }
  }
};

export const addUser = async (user) => {
  try {
    const url = process.env.REACT_APP_API_URL;
    const res = await axios.post(`${url}/user`, user, {
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    });
    console.log('Usuarios:', res.data); // Mostramos solo la data útil
    return res.data; // Retornar los usuarios si querés usarlos en otro lado
  } catch (error) {
    if (error.code === 'ECONNABORTED') {
      throw new Error(
        'La consulta tardó más de 5 segundos. Verifica tu conexión.'
      );
    } else if (!navigator.onLine) {
      throw new Error('No tienes conexión a Internet.');
    } else {
      throw new Error('Ocurrió un error al actualizar user.');
    }
  }
};
