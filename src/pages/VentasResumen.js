import { React, Suspense, useEffect, useState } from 'react';
import {
  resumenDesdeHasta,
  resumenVentas,
  ventasDesdeHasta,
  ventasPorSucursal,
  ventasProducto,
} from '../api/listados';
import PieChart from '../components/grafico';
import Spinner from '../components/spinner';
import { Modal, Button } from 'react-bootstrap';

import { useGestion } from '../context/UserContext';
import { useAuth } from '../context/AuthContext';
import { getSucursal } from '../api/sucursales';
import { ViewVentas } from '../components/ViewVentas';

const VentasResumen = () => {
  const [data, setData] = useState([]);
  const [fecha, setFecha] = useState({ desde: '', hasta: '' });
  const [detalleVtas, setDetalleVtas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(false);
  const [idSucursal, setIdSucursal] = useState();

  const { isAdmin, user } = useAuth();

  console.log('Es admin ', isAdmin, user.id);

  const [showModalInfo, setShowModalInfo] = useState(false);

  const { fetchProductos } = useGestion();

  useEffect(() => {
    const sucursal = async () => {
      const sucursal = await getSucursal(user.id);
      setIdSucursal(sucursal.sucursal);
      console.log('Sucursal', sucursal);
    };
    sucursal();
  }, []);

  const search = async () => {
    if (fecha.desde > fecha.hasta) {
      setShowModalInfo(true);
      return;
    }
    setLoading(true);
    await fetchResumen();
    await fetchVentas();
    setLoading(false);
  };

  const fetchResumen = async () => {
    try {
      const desde = fecha.desde;
      const hasta = fecha.hasta;
      let res;

      if (isAdmin) {
        res = await resumenDesdeHasta({
          desde,
          hasta,
        });
      } else {
        res = await resumenVentas({ desde, hasta }, idSucursal);
        console.log('queu queu que ', res);
      }

      console.log('data de FetchResumn ventas', res);

      setData(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchVentas = async () => {
    try {
      const desde = fecha.desde;
      const hasta = fecha.hasta;
      let res;

      if (isAdmin) {
        res = await ventasDesdeHasta({ desde, hasta });
        console.log('Soy Admin y veo todas las venas', res.data);
      } else {
        res = await ventasPorSucursal({ desde, hasta }, idSucursal);
        console.log('Soy un empleado y veo solo las ventas sucursal', res.data);
      }

      setDetalleVtas(res.data);
      console.log('data', res.data);
    } catch (error) {
      console.error(error);
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

  const handleCloseInfo = () => {
    setShowModalInfo(false);
  };

  return (
    <>
      <div className="py-1">
        <div className="contenedorSeccion1">
          <p className=" m-0 ml" style={{ fontSize: '24px' }}>
            {' '}
            🗒️{' '}
          </p>
          <p className="tituloSeccion">Listado de Ventas Totales</p>
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

        {data.length > 0 && detalleVtas.length > 0 && (
          <div
            className="row mx-1 "
            /*    style={{ height: '60vh', overflow: 'auto' }} */
          >
            <div className="col-12 col-md-6 d-flex flex-column mt-2">
              <div className="bg-info text-white text-center p-3 fs-4 fw-bold rounded">
                Resumen
              </div>

              <div
                className="row g-2 mt-2 shadow-lg p-3 rounded justify-content-around "
                style={{ backgroundColor: 'rgba(0, 175, 239, 0.47)' }}
              >
                {data.length > 0 ? (
                  <>
                    <div className="col-12 col-md-7 d-flex flex-column justify-content-evenly p-2 rounded">
                      <div className="d-flex fw-bold border-bottom pb-1 border-2 border-secondary">
                        <div className="flex-fill" style={{ width: '60%' }}>
                          Tipo
                        </div>
                        <div className="flex-fill">Ventas</div>
                        <div
                          className="flex-fill text-end"
                          style={{ width: '30%' }}
                        >
                          Total
                        </div>
                      </div>

                      {data.map((v) => {
                        const tipoInfo = nombresTipoArray.find(
                          (t) => t.id === v.id_tipo_venta
                        );
                        const bgColor = tipoInfo?.color ?? '#FFFFFF';
                        return (
                          <div
                            key={v.id_tipo_venta}
                            className="d-flex rounded my-1 fw-bold p-2"
                            style={{ backgroundColor: bgColor }}
                          >
                            <div className="flex-fill" style={{ width: '60%' }}>
                              {v.tipo_venta}
                            </div>
                            <div className="flex-fill text-end">
                              {v.transacciones}
                            </div>
                            <div
                              className="flex-fill text-end"
                              style={{ width: '30%' }}
                            >
                              $ {v.suma_total.toFixed(2)}
                            </div>
                          </div>
                        );
                      })}

                      <div className="d-flex fw-bold p-2 border-top mt-2">
                        <div className="flex-fill" style={{ width: '60%' }}>
                          Totales
                        </div>
                        <div className="flex-fill text-end">
                          {totalVentas.transacciones}
                        </div>
                        <div
                          className="flex-fill text-end"
                          style={{ width: '30%' }}
                        >
                          $ {totalVentas.suma_total.toFixed(2)}
                        </div>
                      </div>
                    </div>

                    {/* PieChart */}
                    <div className="col-12 col-md-4 d-flex justify-content-center align-items-center">
                      <PieChart
                        data={data.map((v) => ({
                          id_tipo_venta: v.id_tipo_venta,
                          tipo_venta: v.tipo_venta,
                          suma_total: v.suma_total,
                          transacciones: v.transacciones,
                          label: 'contado',
                          color: nombresTipoArray.find(
                            (c) => c.id === v.id_tipo_venta
                          ).color,
                        }))}
                      />
                    </div>
                  </>
                ) : (
                  <h3 className="text-center">SIN VENTAS</h3>
                )}
              </div>
            </div>

            <div className="col-12 col-md-6  d-flex flex-column mt-2">
              <div className="bg-info text-white text-center p-3 fs-4 fw-bold rounded">
                Listado Ventas
              </div>

              <ViewVentas
                detalleVentas={detalleVtas}
                fetchProductos={fetchProductos}
                fetchResumen={fetchResumen}
                fetchVentas={fetchVentas}
                titulo={'Ventas'}
              />
            </div>
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

export default VentasResumen;
