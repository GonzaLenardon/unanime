import instance from './interceptor';
const url = process.env.REACT_APP_API_URL;

export const allproductos = async () => {
  const res = await instance.get(`/sucursal/productos`);
  return res.data;
};

export const productosConStock = async () => {
  const res = await instance.get(`/sucursal/stock/productos`);
  return res.data;
};

export const addProductos = async (data) => {
  const res = await instance.post(`${url}/productos`, data);
  return res.data; // Retornar los usuarios si querés usarlos en otro lado
};

export const upProductos = async (data) => {
  const res = await instance.put(`${url}/productos`, data);

  return res.data; // Retornar los usuarios si querés usarlos en otro lado
};
