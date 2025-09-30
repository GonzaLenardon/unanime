import axios from 'axios';

export const allTipoGastos = async () => {
  try {
    const url = process.env.REACT_APP_API_URL;
    const res = await axios.get(`${url}/tipogasto`, {
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    });

    console.log('TIPO GASTOS : ', res.data); // Mostramos solo la data útil
    return res.data; // Retornar los usuarios si querés usarlos en otro lado
  } catch (error) {
    if (error.code === 'ECONNABORTED') {
      throw new Error(
        'La consulta tardó más de 5 segundos. Verifica tu conexión.'
      );
    } else if (!navigator.onLine) {
      throw new Error('No tienes conexión a Internet.');
    } else {
      throw new Error('Ocurrió un error al obtener TIPO GASTOS.');
    }
  }
};

export const addTipoGastos = async (tipoGasto) => {
  try {
    console.log('Que llega a la API ... ', tipoGasto);
    const url = process.env.REACT_APP_API_URL;
    const res = await axios.post(`${url}/tipogasto`, tipoGasto, {
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    });

    console.log('TIPO GASTO : ', res.data); // Mostramos solo la data útil
    return res.data; // Retornar los usuarios si querés usarlos en otro lado
  } catch (error) {
    if (error.code === 'ECONNABORTED') {
      throw new Error(
        'La consulta tardó más de 5 segundos. Verifica tu conexión.'
      );
    } else if (!navigator.onLine) {
      throw new Error('No tienes conexión a Internet.');
    } else {
      throw new Error('Ocurrió un error al obtener TIPO GASTO.');
    }
  }
};

export const upTipoGastos = async (tipoGasto) => {
  try {
    console.log('Que llega a la API ... ', tipoGasto);
    const url = process.env.REACT_APP_API_URL;
    const res = await axios.put(`${url}/tipogasto`, tipoGasto, {
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    });

    console.log('TIPO GASTOS : ', res.data); // Mostramos solo la data útil
    return res.data; // Retornar los usuarios si querés usarlos en otro lado
  } catch (error) {
    if (error.code === 'ECONNABORTED') {
      throw new Error(
        'La consulta tardó más de 5 segundos. Verifica tu conexión.'
      );
    } else if (!navigator.onLine) {
      throw new Error('No tienes conexión a Internet.');
    } else {
      throw new Error('Ocurrió un error al obtener TIPO GASTOS.');
    }
  }
};
