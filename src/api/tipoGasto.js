import axios from 'axios';
import instance from './interceptor';

export const allTipoGastos = async () => {
  const res = await instance.get(`/tipogasto`);

  return res.data; // Retornar los usuarios si querés usarlos en otro lado
};

export const addTipoGastos = async (tipoGasto) => {
  const res = await instance.post(`/tipogasto`, tipoGasto);

  return res.data; // Retornar los usuarios si querés usarlos en otro lado
};

export const upTipoGastos = async (tipoGasto) => {
  const res = await instance.put(`/tipogasto`, tipoGasto);

  return res.data; // Retornar los usuarios si querés usarlos en otro lado
};
