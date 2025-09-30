import axios from 'axios';

export const cambio = async (venta) => {
  try {
    const url = process.env.REACT_APP_API_URL;
    const resp = await axios.post(`${url}/cambio`, venta, {
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
      throw new Error('Ocurrió un error al generar el cambio.');
    }
  }
};
