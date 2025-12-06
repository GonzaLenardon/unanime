import axios from 'axios';
import instance from './interceptor';

export const addVenta = async (venta) => {
  const resp = await instance.post(`/ventas`, venta);

  return resp;
};

export const allVentas = async (fecha) => {
  const resp = await instance.get(`/ventas`, {
    params: fecha,
  });

  return resp;
};

/* export const tipoVenta = async () => {
  const resp = await instance.get(`/tipoventa`);
  return resp;
}; */

export const verStock = async (sucursal) => {
  const resp = await instance.get(`/listados/stock/sucursal/${sucursal}`);
  return resp;
};

export const delVenta = async (id) => {
  const resp = await instance.delete(`/ventas/${id}`);

  return resp.data;
};

export const detallesVentas = async (id) => {
  const resp = await instance.get(`/ventas/detalles/${id}`);

  return resp.data;
};

export const transferirStock = async (data) => {
  const resp = await instance.post(`/stock/transferir`, data);

  return resp;
};
