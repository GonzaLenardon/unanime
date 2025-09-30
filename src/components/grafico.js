import React from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  LinearScale,
} from 'chart.js';
import { color } from 'chart.js/helpers';

// Registrar los elementos de Chart.js
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  LinearScale
);

const PieChart = ({ data }) => {
  // Prepara los datos para el gráfico circular

  console.log('data', data);
  /* const coloresPorTipo = [
    { id: 1, nombre: 'CONTADO', color: '#FF6B6B' }, // Rojo coral suave
    { id: 2, nombre: 'TARJETA', color: '#4ECDC4' }, // Turquesa claro
    { id: 3, nombre: 'DEBITO', color: '#FFD93D' }, // Amarillo vibrante
    { id: 4, nombre: 'MPAGO', color: '#1A535C' }, // Azul petróleo oscuro
    { id: 5, nombre: 'TRANSFERENCIA', color: '#FF9F1C' }, // Naranja cálido
    { id: 6, nombre: 'DESC. 10', color: '#2E86AB' }, // Azul cielo profundo
    { id: 7, nombre: 'OTROS1', color: '#6A4C93' }, // Púrpura suave
    { id: 8, nombre: 'OTROS2', color: '#F25F5C' }, // Salmón
    { id: 9, nombre: 'OTROS3', color: '#247BA0' }, // Azul medio
    { id: 10, nombre: 'OTROS4', color: '#70C1B3' }, // Verde agua
  ]; */

  const chartData = {
    /*  labels: data.map((item) => item.label), */

    datasets: [
      {
        data: data.map((item) => item.suma_total),
        backgroundColor: data.map((item) => item.color), // <- colores personalizados

        hoverBackgroundColor: [
          '#626469ff', // Colores al pasar el mouse
        ],
      },
    ],
  };

  return (
    <div
      className="d-flex flex-column"
      style={{ width: '100%', height: '100%' }}
    >
      <div className="fw-bolder text-center">Ventas</div>

      <div style={{ flex: 1, minHeight: '200px' }}>
        <Pie
          data={chartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
          }}
        />
      </div>
    </div>
  );
};

export default PieChart;
