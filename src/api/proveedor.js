import axios from 'axios';

export const addProveedor = async (data) => {
  try {
    const { nombre, direccion, telefono } = data;
    const url = process.env.REACT_APP_API_URL;

    const res = await axios.post(`${url}/proveedor`, data, {
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    });

    console.log('Proveedor', res.data); // Mostramos solo la data útil
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

export const allProveedores = async () => {
  try {
    const url = process.env.REACT_APP_API_URL;
    const res = await axios.get(`${url}/proveedor`, {
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    });

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

export const updateProveedores = async (data) => {
  try {
    const url = process.env.REACT_APP_API_URL;
    const res = await axios.put(
      `${url}/proveedor`,
      data,

      {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 10000,
      }
    );
    console.log('Proveedores', res.data); // Mostramos solo la data útil
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
