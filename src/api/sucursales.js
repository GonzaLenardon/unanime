import axios from 'axios';

export const allSucursal = async () => {
  try {
    const url = process.env.REACT_APP_API_URL;
    const res = await axios.get(`${url}/sucursal`, {
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    });

    console.log('SUCURSALES : ', res.data); // Mostramos solo la data útil
    return res.data; // Retornar los usuarios si querés usarlos en otro lado
  } catch (error) {
    if (error.code === 'ECONNABORTED') {
      throw new Error(
        'La consulta tardó más de 5 segundos. Verifica tu conexión.'
      );
    } else if (!navigator.onLine) {
      throw new Error('No tienes conexión a Internet.');
    } else {
      throw new Error('Ocurrió un error al obtener SUCURSALES.');
    }
  }
};

export const getSucursal = async (id_usuario) => {
  try {
    const url = process.env.REACT_APP_API_URL;
    const res = await axios.get(`${url}/sucursal/usuario/${id_usuario}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    });

    return res.data;
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
