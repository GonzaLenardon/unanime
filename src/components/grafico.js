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

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  LinearScale
);

const PieChart = ({ data }) => {
  // Obtener id_sucursal para adaptar colores
  const id_sucursal = localStorage.getItem('Sucursal');

  // Función para oscurecer un color al hacer hover
  const darkenColor = (color, percent = 20) => {
    const num = parseInt(color.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) - amt;
    const G = ((num >> 8) & 0x00ff) - amt;
    const B = (num & 0x0000ff) - amt;
    return (
      '#' +
      (
        0x1000000 +
        (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
        (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
        (B < 255 ? (B < 1 ? 0 : B) : 255)
      )
        .toString(16)
        .slice(1)
    );
  };

  const chartData = {
    labels: data.map((item) => item.tipo_venta), // ✅ Mostrar labels
    datasets: [
      {
        data: data.map((item) => item.suma_total),
        backgroundColor: data.map((item) => item.color),
        // ✅ Colores hover más oscuros automáticamente
        hoverBackgroundColor: data.map((item) => darkenColor(item.color, 15)),
        borderWidth: 3, // ✅ Borde blanco entre secciones
        borderColor: '#ffffff',
        hoverBorderWidth: 4, // ✅ Borde más grueso en hover
        hoverBorderColor: '#ffffff',
        // ✅ Efecto de separación al hover
        hoverOffset: 15,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          padding: 15,
          font: {
            size: 12,
            weight: '600',
          },
          color: '#2d3748',
          usePointStyle: true, // ✅ Círculos en lugar de cuadrados
          pointStyle: 'circle',
          boxWidth: 8,
          boxHeight: 8,
        },
      },
      tooltip: {
        enabled: true,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        padding: 12,
        cornerRadius: 8,
        displayColors: true,
        // ✅ Formato personalizado del tooltip
        callbacks: {
          label: function (context) {
            const label = context.label || '';
            const value = context.parsed || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: $${value.toFixed(2)} (${percentage}%)`;
          },
        },
      },
    },
    // ✅ Animación suave
    animation: {
      animateRotate: true,
      animateScale: true,
      duration: 1000,
      easing: 'easeInOutQuart',
    },
  };

  return (
    <div
      className="d-flex flex-column"
      style={{ width: '100%', height: '100%' }}
    >
      {/* Título del gráfico */}
      <div
        className="fw-bold text-center mb-3"
        style={{
          fontSize: '1.1rem',
          color: id_sucursal === '1' ? '#667eea' : '#f857a6',
        }}
      >
        <i className="bi bi-pie-chart-fill me-2"></i>
        Distribución de Ventas
      </div>

      {/* Contenedor del gráfico */}
      <div
        style={{
          flex: 1,
          minHeight: '250px',
          position: 'relative',
        }}
      >
        <Pie data={chartData} options={options} />
      </div>

      {/* Total general (opcional) */}
      <div className="text-center mt-3 pt-3 border-top">
        <small className="text-muted fw-semibold">TOTAL GENERAL</small>
        <div
          className="fs-4 fw-bold"
          style={{
            color: id_sucursal === '1' ? '#667eea' : '#f857a6',
          }}
        >
          ${data.reduce((sum, item) => sum + item.suma_total, 0).toFixed(2)}
        </div>
      </div>
    </div>
  );
};

export default PieChart;
