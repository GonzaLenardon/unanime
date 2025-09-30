import { useState } from 'react';

import { gastosDesdeHasta } from '../api/gastos';

const GastosResumen = () => {
  const [fecha, setFecha] = useState({ desde: '', hasta: '' });
  const [showModalInfo, setShowModalInfo] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(false);
  const [gastos, setGastos] = useState([]);

  const handleFechas = (e) => {
    const { name, value } = e.target;
    console.log('desdehasta', name, value);
    setFecha((prev) => ({ ...prev, [name]: value }));
  };

  const search = async () => {
    if (fecha.desde > fecha.hasta) {
      setShowModalInfo(true);
      return;
    }
    setLoading(true);
    try {
      const resp = await gastosDesdeHasta(fecha);
      setGastos(resp);
      console.log('Respuesta gastos Desde Hasta ', resp);
      // Acá deberías hacer setData(resp.data);
    } catch (error) {
      console.log('erorroro', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-1">
      <div className="contenedorSeccion1">
        <p className=" m-0 ml" style={{ fontSize: '24px' }}>
          {' '}
          🗒️{' '}
        </p>
        <p className="tituloSeccion">Listado de Gastos</p>
      </div>

      {/* Filtros */}
      <div className="d-flex flex-wrap align-items-center justify-content-evenly gap-3 myNavBar">
        <div className="d-flex align-items-center gap-2">
          <label className="text-dark mb-0 fw-bold">Fecha Desde</label>
          <input
            type="date"
            className="form-control"
            style={{ width: '200px' }}
            name="desde"
            value={fecha.desde}
            onChange={handleFechas}
          />
        </div>

        <div className="d-flex align-items-center gap-2">
          <label className="text-dark mb-0 fw-bold">Fecha Hasta</label>
          <input
            type="date"
            className="form-control"
            style={{ width: '200px' }}
            name="hasta"
            value={fecha.hasta}
            onChange={handleFechas}
          />
        </div>

        <div>
          <button className="btn btn-primary btn-md px-5" onClick={search}>
            Buscar 🔍
          </button>
        </div>
      </div>

      {/* Tabla de resultados */}
      {gastos.length > 0 && (
        <div
          className="col-12 d-flex flex-column mt-2"
          style={{ maxHeight: '72vh' }}
        >
          <div className="container-tabla">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th style={{ width: '15%' }}>Fecha</th>
                  <th style={{ width: '15%' }}>Sucursal</th>
                  <th style={{ width: '15%' }}>Tipo Gasto</th>
                  <th style={{ width: '40%' }}>Observaciones</th>
                  <th style={{ width: '15%' }}>Monto</th>
                </tr>
              </thead>
              <tbody>
                {(() => {
                  const rows = [];
                  let currentSucursal = null;
                  let totalSucursal = 0;

                  const gastosOrdenados = [...gastos].sort(
                    (a, b) => a.id_sucursal - b.id_sucursal
                  );

                  gastosOrdenados.forEach((item, index) => {
                    const cambioSucursal = item.id_sucursal !== currentSucursal;

                    if (cambioSucursal && index !== 0) {
                      rows.push(
                        <tr
                          key={`total-${currentSucursal}`}
                          className="table-gastos"
                        >
                          <td colSpan="4 " className="text-end">
                            Total de la sucursal:
                          </td>

                          <td>
                            ${' '}
                            {parseFloat(totalSucursal).toLocaleString('es-AR', {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </td>
                        </tr>
                      );
                      rows.push(
                        <tr key={`separador-${currentSucursal}`}>
                          <td colSpan="5">&nbsp;</td>
                        </tr>
                      );
                      totalSucursal = 0;
                    }

                    totalSucursal += parseFloat(item.monto);
                    currentSucursal = item.id_sucursal;

                    rows.push(
                      <tr
                        key={item.id_gasto}
                        style={{
                          cursor: 'pointer',
                        }}
                      >
                        <td>
                          {new Date(item.fecha).toLocaleDateString('es-AR', {
                            timeZone: 'UTC',
                          })}
                        </td>
                        <td>{item.sucursal?.nombre || '-'}</td>
                        <td>{item.tipogasto?.tipoGasto || '-'}</td>
                        <td
                          style={{
                            wordBreak: 'break-word',
                            whiteSpace: 'normal',
                          }}
                        >
                          {item.observaciones}
                        </td>
                        <td>$ {parseFloat(item.monto).toFixed(2)}</td>
                      </tr>
                    );

                    if (index === gastosOrdenados.length - 1) {
                      rows.push(
                        <tr
                          key={`total-final-${item.id_sucursal}`}
                          className="table-gastos"
                        >
                          <td colSpan="4" className="text-end">
                            Total de la sucursal:
                          </td>

                          <td>
                            ${' '}
                            {parseFloat(totalSucursal).toLocaleString('es-AR', {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </td>
                        </tr>
                      );
                    }
                  });

                  return rows;
                })()}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default GastosResumen;
