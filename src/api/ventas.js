import axios from 'axios';

export const addVenta = async (venta) => {
  try {
    const url = process.env.REACT_APP_API_URL;
    const resp = await axios.post(`${url}/ventas`, venta, {
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

export const allVentas = async (fecha) => {
  try {
    const url = process.env.REACT_APP_API_URL;
    const resp = await axios.get(`${url}/ventas`, {
      params: fecha,
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

export const tipoVenta = async () => {
  try {
    const url = process.env.REACT_APP_API_URL;
    const resp = await axios.get(
      `${url}/tipoventa`,
      {},
      {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 10000,
      }
    );
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

export const verStock = async (sucursal) => {
  try {
    const url = process.env.REACT_APP_API_URL;

    const resp = await axios.get(
      `${url}/listados/stock/sucursal/${sucursal}`,

      {},
      {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 10000,
      }
    );

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

export const delVenta = async (id) => {
  try {
    const url = process.env.REACT_APP_API_URL;

    const resp = await axios.delete(
      `${url}/ventas/${id}`,
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
      const msg =
        error.response?.data?.error || 'Error desconocido del servidor';
      throw new Error(msg);
    }
  }
};

export const detallesVentas = async (id) => {
  try {
    const url = process.env.REACT_APP_API_URL;
    const resp = await axios.get(
      `${url}/ventas/detalles/${id}`,
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
      throw new Error('Ocurrió un error al obtener los detalles de la venta.');
    }
  }
};

export const transferirStock = async (data) => {
  try {
    const url = process.env.REACT_APP_API_URL;
    const resp = await axios.post(`${url}/stock/transferir`, data, {
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
      throw new Error('Ocurrió un error al transferir stock.');
    }
  }
};
