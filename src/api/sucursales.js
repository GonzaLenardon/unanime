import instance from './interceptor';

export const allSucursal = async () => {
  const res = await instance.get(`/sucursal`);

  return res.data; // Retornar los usuarios si querés usarlos en otro lado
};

export const getSucursal = async (id_usuario) => {
  const res = await instance.get(`/sucursal/usuario/${id_usuario}`);

  return res.data;
};
