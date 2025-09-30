import { React, useEffect, useState } from 'react';
import { ventasDesdeHasta, ventasPorSucursales } from '../api/listados';
import PieChart from '../components/grafico';
import Spinner from '../components/spinner';
import { Modal, Button } from 'react-bootstrap';
import { useGestion } from '../context/UserContext';
import { allSucursal, getSucursal } from '../api/sucursales';
import { ViewVentas } from '../components/ViewVentas';
import { useAuth } from '../context/AuthContext';

const VentasPorSucursales = () => {
  const [data, setData] = useState([]);
  const [fecha, setFecha] = useState({ desde: '', hasta: '' });
  const [detalleVtas, setDetalleVtas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(false);
  const [showModalInfo, setShowModalInfo] = useState(false);
  const { fetchProductos } = useGestion();
  const [ventaSeleccionada, setVentaSeleccionada] = useState(null);
  const [ventasSucursal, setVentasSucursal] = useState([]);
  const [showVentas, setShowVentas] = useState(false);
  const [sucursales, setSucursales] = useState('');
  const [nombreSucursal, setNombreSucursal] = useState('');

  const search = async () => {
    if (fecha.desde > fecha.hasta) {
      setShowModalInfo(true);
      return;
    }
    setLoading(true);
    await fetchResumen();
    await fetchVentas();
    await fetchSucursales();
    setLoading(false);
  };

  const fetchSucursales = async () => {
    try {
      setLoading(true);
      console.log('dddddddddddddddddd');
      const resp = await allSucursal();
      console.log('Sucursales ', resp);
      setSucursales(resp);
    } finally {
      setLoading(false);
    }
  };

  const fetchResumen = async () => {
    try {
      const res = await ventasPorSucursales({
        desde: fecha.desde,
        hasta: fecha.hasta,
      });
      console.log('data de FetchResumn ventas', res);

      setData(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchVentas = async () => {
    try {
      const res = await ventasDesdeHasta({
        desde: fecha.desde,
        hasta: fecha.hasta,
      });
      setDetalleVtas(res.data);
      console.log('data', res);
    } catch (error) {
      console.log(error);
    }
  };

  const handleFechas = (e) => {
    const { name, value } = e.target;
    console.log('desdehasta', name, value);

    setFecha((prev) => ({ ...prev, [name]: value }));
  };

  const nombresTipoArray = [
    { id: 1, color: '#b92b2bff' }, // Rojo coral suave
    { id: 2, color: '#4ECDC4' }, // Turquesa claro
    { id: 3, color: '#FFD93D' }, // Amarillo vibrante
    { id: 4, color: '#1A535C' }, // Azul petróleo oscuro
    { id: 5, color: '#FF9F1C' }, // Naranja cálido
    { id: 6, color: '#2E86AB' }, // Azul cielo profundo
    { id: 7, color: '#6A4C93' }, // Púrpura suave
    { id: 8, color: '#F25F5C' }, // Salmón
    { id: 9, color: '#247BA0' }, // Azul medio
    { id: 10, color: '#70C1B3' }, // Verde agua
  ];

  const totalVentas = data.reduce(
    (acc, el) => {
      acc.suma_total += Number(el.suma_total);
      acc.transacciones += Number(el.transacciones);
      return acc;
    },
    { suma_total: 0, transacciones: 0 }
  );

  const handleShow = (sucursal) => {
    const filtrarVentas = detalleVtas.filter((v) => v.id_sucursal === sucursal);
    setVentasSucursal(filtrarVentas);
    const nombreSucursal = sucursales.filter((s) => s.id_sucursal === sucursal);
    setNombreSucursal(nombreSucursal[0].nombre);
    setShowVentas(true);
  };

  const handleClose = () => {
    setShowVentas(false);
    setVentaSeleccionada(null);
  };

  const handleCloseInfo = () => {
    setShowModalInfo(false);
  };

  return (
    <>
      <div className="py-1">
        <div className="contenedorSeccion1">
          <p className=" m-0 ml" style={{ fontSize: '24px' }}>
            🗒️{' '}
          </p>
          <p className="tituloSeccion">Listado Ventas por Sucursales</p>
        </div>

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

        {data.length > 0 && (
          <div className="d-flex flex-column mx-3">
            <div className="row justify-content-between mt-3">
              {data.map((sucursal) => {
                const ventas = sucursal.ventas;

                const totalSuma = Object.values(ventas).reduce(
                  (acc, v) => {
                    acc.sumaTotal += v.total;
                    acc.transacciones += v.transacciones;

                    return acc;
                  },

                  { sumaTotal: 0, transacciones: 0 }
                );

                return (
                  <div
                    key={sucursal.id_sucursal}
                    className="col-12 col-md-4 mb-3"
                  >
                    <div
                      className="shadow-lg p-3 rounded"
                      style={{
                        backgroundColor: 'rgba(30, 98, 51, 0.47)',
                        minHeight: '100%',
                      }}
                    >
                      <div className="fw-bold text-center fs-3 mb-2">
                        Sucursal{' '}
                        {sucursales &&
                          (sucursales?.find(
                            (s) => s.id_sucursal === sucursal.id_sucursal
                          )?.nombre ??
                            '#')}
                      </div>

                      <p
                        className="text-end text-primary"
                        style={{ cursor: 'pointer' }}
                      >
                        <strong
                          onClick={() => handleShow(sucursal.id_sucursal)}
                        >
                          {' '}
                          Detalles{' '}
                        </strong>{' '}
                      </p>

                      <div className="row">
                        {/* Tabla */}
                        <div className="col-12 col-md-7 d-flex flex-column justify-content-evenly p-2 rounded">
                          <div className="d-flex fw-bold border-bottom pb-1 border-2 border-secondary">
                            <div className="ps-2" style={{ width: '50%' }}>
                              Tipos
                            </div>
                            <div className="flex-fill text-end">Cantidad</div>
                            <div className="text-end" style={{ width: '40%' }}>
                              Total
                            </div>
                          </div>
                          {Object.entries(ventas).map(([tipo, datos]) => {
                            const tipoInfo = nombresTipoArray.find(
                              (t) => t.id === datos.id_tipo_venta
                            );

                            const bgColor = tipoInfo?.color ?? '#FFFFFF';

                            return (
                              <div
                                key={tipo}
                                className="d-flex rounded my-1 fw-bold p-2"
                                style={{ backgroundColor: bgColor }}
                              >
                                <div
                                  className="truncate"
                                  style={{ width: '50%' }}
                                >
                                  {tipo}
                                </div>
                                <div className="flex-fill text-end">
                                  {datos.transacciones}
                                </div>
                                <div
                                  className="text-end"
                                  style={{ width: '40%' }}
                                >
                                  $ {datos.total.toFixed(2)}
                                </div>
                              </div>
                            );
                          })}
                          <div className="d-flex fw-bold p-2 border-top mt-2">
                            <div className="" style={{ width: '50%' }}>
                              Total
                            </div>
                            <div className="flex-fill text-end">
                              {totalSuma.transacciones}
                            </div>

                            <div className="text-end" style={{ width: '40%' }}>
                              ${totalSuma.sumaTotal.toFixed(2)}
                            </div>
                          </div>
                        </div>

                        {/* PieChart */}
                        <div className="col-12 col-md-5 d-flex justify-content-center align-items-center">
                          <PieChart
                            data={Object.values(ventas).map((v) => ({
                              id_tipo_venta: v.id_tipo_venta,
                              tipo_venta: v.tipo_venta,
                              suma_total: v.total,
                              transacciones: v.transacciones,
                              label: 'contado',
                              color: nombresTipoArray.find(
                                (c) => c.id === v.id_tipo_venta
                              ).color,
                            }))}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <Modal
              show={showVentas}
              onHide={handleClose}
              size="xl"
              backdrop="static"
              keyboard={false}
            >
              <Modal.Header closeButton className="bg-info text-dark">
                <Modal.Title className="fw-bold fs-3">{`Ventas Sucursal ${nombreSucursal} `}</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <ViewVentas
                  detalleVentas={ventasSucursal}
                  fetchProductos={fetchProductos}
                  fetchResumen={fetchResumen}
                  fetchVentas={fetchVentas}
                  /* titulo={`Listado de Ventas Sucursal ${nombreSucursal} `} */
                />
              </Modal.Body>

              <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                  Cerrar
                </Button>
              </Modal.Footer>
            </Modal>
          </div>
        )}
      </div>

      <Modal
        show={showModalInfo}
        onHide={handleCloseInfo}
        centered
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton className="bg-warning">
          <Modal.Title className="text-dark fs-5">Atención</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center fs-6">
          La fecha <strong>Desde</strong> debe ser menor que la fecha{' '}
          <strong>Hasta</strong>.
        </Modal.Body>
        <Modal.Footer className="justify-content-center">
          <Button variant="primary" onClick={handleCloseInfo}>
            Entendido
          </Button>
        </Modal.Footer>
      </Modal>

      <Spinner loading={loading} msg={msg} />
    </>
  );
};

export default VentasPorSucursales;
