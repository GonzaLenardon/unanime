import axios from 'axios';

export const resumenVentas = async (fechas, sucursal) => {
  try {
    const url = process.env.REACT_APP_API_URL;

    const resp = await axios.post(`${url}/listados/${sucursal}`, fechas, {
      timeout: 10000,
      headers: { 'Content-Type': 'application/json' },
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

export const resumenDesdeHasta = async (fechas) => {
  try {
    const url = process.env.REACT_APP_API_URL;
    const resp = await axios.post(`${url}/listados/ventas/resumen`, fechas, {
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 5000,
    });
    console.log('RESUMEN', resp);
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

export const ventasPorSucursales = async (fechas) => {
  try {
    const url = process.env.REACT_APP_API_URL;
    const resp = await axios.post(`${url}/listados/ventas/sucursales`, fechas, {
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 5000,
    });
    console.log('RESUMEN', resp);
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

export const ventasDesdeHasta = async (fechas) => {
  try {
    const url = process.env.REACT_APP_API_URL;
    const resp = await axios.post(`${url}/ventas/desdehasta`, fechas, {
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 5000,
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

export const ventasPorSucursal = async (fechas, sucursal) => {
  console.log('llega ventasporsucur', sucursal);
  try {
    const url = process.env.REACT_APP_API_URL;
    const resp = await axios.post(
      `${url}/ventas/sucursal/${sucursal}`,
      fechas,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 5000,
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

export const comprasProducto = async (id) => {
  try {
    const url = process.env.REACT_APP_API_URL;

    const resp = await axios.get(
      `${url}/compra/${id}`,
      {},
      {
        timeout: 10000,
        headers: { 'Content-Type': 'application/json' },
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

export const ventasProducto = async (id) => {
  try {
    const url = process.env.REACT_APP_API_URL;

    const resp = await axios.get(
      `${url}/ventas/${id}`,
      {},
      {
        timeout: 10000,
        headers: { 'Content-Type': 'application/json' },
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
      throw new Error('Ocurrió un error al obtener las ventas del productos.');
    }
  }
};
