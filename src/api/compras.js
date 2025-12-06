import axios from 'axios';
import api from './api';
import instance from './interceptor';

export const addCompra = async (compra) => {
  const resp = await instance.post(`/compra`, compra);
  return resp;
};

export const comprasDesdeHasta = async (fechas) => {
  const resp = await instance.post(`/compra/desdehasta`, fechas);

  return resp;
};

export const delCompra = async (id) => {
  const resp = await instance.delete(`/compra/${id}`);

  return resp.data;
};

export const detalleCompras = async (id) => {
  const resp = await instance.get(`/compra/detalles/${id}`);

  return resp.data;
};
