import axios from 'axios';
import instance from './interceptor';

export const resumenVentas = async (fechas, sucursal) => {
  const resp = await instance.post(`/listados/${sucursal}`, fechas);
  return resp;
};

export const resumenDesdeHasta = async (fechas) => {
  const resp = await instance.post(`/listados/ventas/resumen`, fechas);
  console.log('RESUMEN', resp);
  return resp;
};

export const ventasPorSucursales = async (fechas) => {
  const resp = await instance.post(`/listados/ventas/sucursales`, fechas);
  console.log('RESUMEN', resp);
  return resp;
};

export const ventasDesdeHasta = async (fechas) => {
  const resp = await instance.post(`/ventas/desdehasta`, fechas);

  return resp;
};

export const ventasPorSucursal = async (fechas, sucursal) => {
  const resp = await instance.post(`/ventas/sucursal/${sucursal}`, fechas);
  return resp;
};

export const comprasProducto = async (id) => {
  const resp = await instance.get(`/compra/${id}`);

  return resp;
};

export const ventasProducto = async (id) => {
  const resp = await instance.get(`/ventas/${id}`);

  return resp;
};
