import { useState, useEffect } from 'react';

export function Reloj() {
  const [fechaHora, setFechaHora] = useState('');
  const isMobile = window.innerWidth <= 980;

  useEffect(() => {
    const interval = setInterval(() => {
      const ahora = new Date();
      const dias = [
        'Domingo',
        'Lunes',
        'Martes',
        'Miércoles',
        'Jueves',
        'Viernes',
        'Sábado',
      ];

      const diaSemana = dias[ahora.getDay()];
      const dia = String(ahora.getDate()).padStart(2, '0');
      const mes = String(ahora.getMonth() + 1).padStart(2, '0');
      const año = ahora.getFullYear();
      const horas = String(ahora.getHours()).padStart(2, '0');
      const minutos = String(ahora.getMinutes()).padStart(2, '0');
      const segundos = String(ahora.getSeconds()).padStart(2, '0');

      setFechaHora(
        `${diaSemana} ${dia}/${mes}/${año} ${horas}:${minutos}:${segundos}`
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {!isMobile && (
        <div className="fs-5 me-5" style={{ width: '350px' }}>
          {fechaHora}
        </div>
      )}
    </>
  );
}
