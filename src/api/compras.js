import axios from 'axios';
import api from './api';

export const addCompra = async (compra) => {
  const resp = await api.post(`/compra`, compra);
  return resp;
};

export const comprasDesdeHasta = async (fechas) => {
  try {
    const url = process.env.REACT_APP_API_URL;
    const resp = await axios.post(`${url}/compra/desdehasta`, fechas, {
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    });

    return resp;
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

export const delCompra = async (id) => {
  try {
    const url = process.env.REACT_APP_API_URL;
    const resp = await axios.delete(`${url}/compra/${id}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    });

    return resp.data;
  } catch (error) {
    console.log('desde la api recibo error', error);
    if (error.code === 'ECONNABORTED') {
      throw new Error(
        'La consulta tardó más de 5 segundos. Verifica tu conexión.'
      );
    } else if (!navigator.onLine) {
      throw new Error('No tienes conexión a Internet.');
    } else {
      const msg =
        error.response?.data?.error || 'Error desconocido del servidor';
      throw new Error(msg);
    }
  }
};

export const detalleCompras = async (id) => {
  try {
    const url = process.env.REACT_APP_API_URL;
    const resp = await axios.get(
      `${url}/compra/detalles/${id}`,
      {},
      {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 10000,
      }
    );

    return resp.data;
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
