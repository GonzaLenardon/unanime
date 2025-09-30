import React, { useState } from 'react';
import { Form } from 'react-bootstrap';
import VentasResumen from './VentasResumen';
import { CompraResumen } from './CompraResumen';

/* const ComponenteVentas = () => <div>📦 Componente de Ventas</div>;
const ComponenteCompras = () => <div>🛒 Componente de Compras</div>; */

const Resumen = () => {
  const [tipoResumen, setTipoResumen] = useState('ventas'); // estado inicial

  return (
    <div className="py-1 ">
      <div className="d-flex align-items-center mb-1">
        <h2 className="ms-2 fw-bold">📋 Resumen</h2>
      </div>

      <div className="d-flex flex-wrap align-items-end justify-content-evenly gap-3 myNavBar">
        <Form.Check
          type="radio"
          label="Ventas"
          name="tipoResumen"
          id="radioVentas"
          value="ventas"
          checked={tipoResumen === 'ventas'}
          onChange={(e) => setTipoResumen(e.target.value)}
          className={`fw-bold ${
            tipoResumen === 'ventas' ? 'text-primary' : 'text-white'
          }`}
        />
        <Form.Check
          type="radio"
          label="Compras"
          name="tipoResumen"
          id="radioCompras"
          value="compras"
          checked={tipoResumen === 'compras'}
          onChange={(e) => setTipoResumen(e.target.value)}
          className={`fw-bold ${
            tipoResumen === 'ventas' ? 'text-primary' : 'text-white'
          }`}
        />
      </div>

      <div className="mt-4">
        {tipoResumen === 'ventas' ? <VentasResumen /> : <CompraResumen />}
      </div>
    </div>
  );
};

export default Resumen;
