import axios from 'axios';
import instance from './interceptor';

export const allGastos = async () => {
  const res = await instance.get(`/gastos`);

  return res.data; // Retornar los usuarios si querés usarlos en otro lado
};

export const gastosDesdeHasta = async (fechas) => {
  const res = await instance.post(`/gastos/desdehasta`, fechas);

  console.log('Gastos', res.data); // Mostramos solo la data útil
  return res.data; // Retornar los usuarios si querés usarlos en otro lado
};

export const addGastos = async (gastos) => {
  const res = await instance.post(`/gastos`, gastos);

  return res.data; // Retornar los usuarios si querés usarlos en otro lado
};

export const upGastos = async (Gasto) => {
  const res = await instance.put(`/gastos`, Gasto);

  return res.data; // Retornar los usuarios si querés usarlos en otro lado
};
