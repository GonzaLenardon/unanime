import axios from 'axios';
const url = process.env.REACT_APP_API_URL;

export const allproductos = async () => {
  try {
    const res = await axios.get(
      `${url}/productos`,
      {},

      {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 10000,
      }
    );
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

export const addProductos = async (data) => {
  try {
    const res = await axios.post(`${url}/productos`, data, {
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    });

    console.log('Producto', res.data); // Mostramos solo la data útil
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

export const upProductos = async (data) => {
  try {
    const res = await axios.put(`${url}/productos`, data, {
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    });

    console.log('Actualizar Producto', res.data); // Mostramos solo la data útil
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
