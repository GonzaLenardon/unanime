import axios from 'axios';

export const allTipoVentas = async () => {
  try {
    const url = process.env.REACT_APP_API_URL;
    const res = await axios.get(`${url}/tipoventa`, {
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    });

    console.log('TIPO VENTAS : ', res.data); // Mostramos solo la data útil
    return res.data; // Retornar los usuarios si querés usarlos en otro lado
  } catch (error) {
    if (error.code === 'ECONNABORTED') {
      throw new Error(
        'La consulta tardó más de 5 segundos. Verifica tu conexión.'
      );
    } else if (!navigator.onLine) {
      throw new Error('No tienes conexión a Internet.');
    } else {
      throw new Error('Ocurrió un error al obtener TIPO VENTAS.');
    }
  }
};

export const addTipoVentas = async (tipoVenta) => {
  try {
    console.log('Que llega a la API ... ', tipoVenta);
    const url = process.env.REACT_APP_API_URL;
    const res = await axios.post(`${url}/tipoventa`, tipoVenta, {
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    });

    console.log('TIPO VENTAS : ', res.data); // Mostramos solo la data útil
    return res.data; // Retornar los usuarios si querés usarlos en otro lado
  } catch (error) {
    if (error.code === 'ECONNABORTED') {
      throw new Error(
        'La consulta tardó más de 5 segundos. Verifica tu conexión.'
      );
    } else if (!navigator.onLine) {
      throw new Error('No tienes conexión a Internet.');
    } else {
      throw new Error('Ocurrió un error al obtener TIPO VENTAS.');
    }
  }
};

export const upTipoVentas = async (tipoVenta) => {
  try {
    const url = process.env.REACT_APP_API_URL;
    const res = await axios.put(`${url}/tipoventa`, tipoVenta, {
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
      throw new Error('Ocurrió un error al obtener TIPO VENTAS.');
    }
  }
};
