import instance from './interceptor';

export const addProveedor = async (data) => {
  const res = await instance.post(`/proveedor`, data);
  return res.data; // Retornar los usuarios si querés usarlos en otro lado
};

export const allProveedores = async () => {
  const res = await instance.get(`/proveedor`);
  return res.data; // Retornar los usuarios si querés usarlos en otro lado
};

export const updateProveedores = async (data) => {
  const res = await instance.put(`/proveedor`, data);

  return res.data; // Retornar los usuarios si querés usarlos en otro lado
};
