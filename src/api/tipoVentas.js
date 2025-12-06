import instance from './interceptor';

export const allTipoVentas = async () => {
  const res = await instance.get(`/tipoventa`);

  return res.data;
};

export const addTipoVentas = async (tipoVenta) => {
  const res = await instance.post(`/tipoventa`, tipoVenta);

  return res.data; // Retornar los usuarios si querés usarlos en otro lado
};

export const upTipoVentas = async (tipoVenta) => {
  const res = await instance.put(`/tipoventa`, tipoVenta);

  return res.data; // Retornar los usuarios si querés usarlos en otro lado
};
