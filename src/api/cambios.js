import instance from './interceptor';

export const cambio = async (venta) => {
  const resp = await instance.post(`/cambio`, venta);
  return resp;
};
