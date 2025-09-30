import { React, useEffect, useState } from 'react';
import axios from 'axios';
import {
  resumenVentas,
  ventasDesdeHasta,
  ventasPorSucursal,
} from '../api/listados';
import PieChart from '../components/grafico';
import { allVentas, delVenta, verStock } from '../api/ventas';
import Spinner from '../components/spinner';
import { Modal, Button } from 'react-bootstrap';
import { ModalDel } from '../components/ModalDel';
import { getSucursal } from '../api/sucursales';

import { useAuth } from '../context/AuthContext';
import { ViewVentas } from '../components/ViewVentas';
import { ViewDetallesVenta } from '../components/ViewDetallesVenta';

const Home = () => {
  const [ventas, setVentas] = useState([]);
  const [stock, setStock] = useState([]);
  const [ventasHoy, setVentasHoy] = useState([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [ventaSeleccionada, setVentaSeleccionada] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { sucursal } = await getSucursal(user.id);
      console.log('idSucursal', sucursal);
      await fetchResumenVentas(sucursal);
      await fetchVerStock(sucursal);
      await fetchVentas(sucursal);

      setLoading(false);
    };

    fetchData();
  }, []);

  const getFechaHoy = () => {
    const fecha = new Date();
    const yyyy = fecha.getFullYear();
    const mm = String(fecha.getMonth() + 1).padStart(2, '0');
    const dd = String(fecha.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const desde = getFechaHoy();
  const hasta = getFechaHoy();

  /* const hoy = new Date();
  const tresHorasEnMs = 3 * 60 * 60 * 1000;
  const fecha = new Date(hoy.getTime() - tresHorasEnMs);
  console.log('fecha', fecha); */

  const fetchResumenVentas = async (sucursal) => {
    const res = await resumenVentas({ desde, hasta }, sucursal);
    console.log('Resumen Ventas .. ', res);

    setVentas(res.data);
  };

  const fetchVerStock = async (sucursal) => {
    try {
      const res = await verStock(sucursal);
      /*    console.log('SOKITIOSOSOS', res); */
      setStock(res.data);
    } catch (error) {
      console.error('Error al obtener Stock:', error.message);
    }
  };

  const fetchVentas = async (sucursal) => {
    try {
      const res = await ventasPorSucursal({ desde, hasta }, sucursal);
      console.log('Ventas de ', res.data);

      setVentasHoy(res.data);
    } catch (error) {
      console.error('Error al obtener Ventas:', error.message);
    }
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

  const totalVentas = ventas.reduce(
    (acc, el) => {
      acc.suma_total += Number(el.suma_total);
      acc.transacciones += Number(el.transacciones);
      return acc;
    },
    { suma_total: 0, transacciones: 0 }
  );

  const formatedFecha = (fechaString) => {
    const [fecha, hora] = fechaString.split('T');
    const fHora = hora.slice(0, 5);
    return fHora;
  };

  const handleShow = (venta) => {
    console.log('ventitasss ', venta);
    setVentaSeleccionada(venta);
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setVentaSeleccionada(null);
  };

  const handleRightClick = (e, venta) => {
    e.preventDefault(); // evita el menú por defecto del navegador
    setVentaSeleccionada(venta);
    setShowDeleteModal(true);
    console.log('hososoossososo');
  };

  const handleDeleteVenta = async (id) => {
    try {
      setMsg('Borrando venta ...');
      setLoading(true);
      setShowDeleteModal(false);
      const resp = await delVenta(id);
      setMsg(resp.mensaje);
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setVentaSeleccionada(null);

      // 🔁 Refrescar datos luego de borrar
      await fetchResumenVentas();
      await fetchVerStock();
      await fetchVentas();

      setLoading(false);
      setMsg();
    } catch (error) {
      console.error('Error al eliminar venta:', error);
      setMsg('Se produjo un error ');
      setLoading(false);
    }
  };

  return (
    <div className="">
      <div
        className="row g-2 px-md-5 py-md-3 rounded-4"
        style={{ height: '80vh', backgroundColor: 'rgba(0, 175, 239, 0.10)' }}
      >
        <div className="col-12 col-md-4 d-flex flex-column h-100 shadow-lg bg-white rounded-4 p-3">
          <div className="bg-info text-white text-center p-3 fs-4 fw-bold rounded w-100">
            Ventas
          </div>
          {ventasHoy.length > 0 ? (
            <div
              className="shadow-lg p-3 rounded mt-2 overflow-auto"
              style={{
                /*  backgroundColor: 'rgba(0, 175, 239, 0.68)', */
                flexGrow: 1,
              }}
            >
              <table className="table">
                <thead>
                  <tr className="table-secondary">
                    <th>Hora</th>
                    <th className="text-end">Nro</th>
                    <th className="text-end">Tipo</th>
                    <th className="text-end">Total</th>
                    <th className="text-center">
                      <span className="d-none d-sm-inline">Detalles</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {ventasHoy.map((p, index) => {
                    const tipoVenta = nombresTipoArray.find(
                      (tipo) => tipo.id === p.id_tipo_venta
                    );

                    return (
                      <tr
                        key={index}
                        onContextMenu={(e) => handleRightClick(e, p)}
                      >
                        <td>{formatedFecha(p.fecha)}</td>
                        <td className="text-end">{p.id_venta}</td>
                        <td className="text-end">{p.tipoVenta.tipoVenta}</td>
                        <td className="text-end">${p.total.toFixed(2)}</td>
                        <td className="text-end">
                          <button
                            className="btn btn-sm btn-primary"
                            onClick={() => handleShow(p)}
                          >
                            <span className="d-none d-sm-inline">Detalles</span>
                            🔎
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {/*     <Modal
                show={showModal}
                onHide={handleClose}
                size="lg"
                backdrop="static"
                keyboard={false}
              >
                <Modal.Header closeButton className="bg-info">
                  <Modal.Title>Detalles de Venta ttt</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  {ventaSeleccionada && (
                    <>
                      <p>
                        <strong>Fecha de Venta:</strong>{' '}
                        {new Date(ventaSeleccionada.fecha).toLocaleString(
                          'es-AR',
                          { timeZone: 'UTC' }
                        )}
                      </p>
                      <p>
                        <strong>Total Venta:</strong> ${ventaSeleccionada.total}
                      </p>

                      {ventaSeleccionada.detalles[0].id_producto === null ? (
                        <h2>Venta registrada por Devolucion</h2>
                      ) : (
                        <table className="table table-bordered table-striped">
                          <thead>
                            <tr>
                              <th>#</th>
                              <th>Producto</th>
                              <th>Precio</th>

                              <th>Cantidad</th>
                              <th>Total Detalle</th>
                            </tr>
                          </thead>
                          <tbody>
                            {ventaSeleccionada.detalles?.length > 0 ? (
                              ventaSeleccionada.detalles.map((detalle, idx) => (
                                <tr key={detalle.id_detalleventa}>
                                  <td>{idx + 1}</td>
                                  <td>
                                    {detalle.producto.nombre} -
                                    {detalle.producto.marca}-
                                    {detalle.producto.modelo}-
                                    {detalle.producto.color}-
                                    {detalle.producto.talle}
                                  </td>
                                  <td>{detalle.producto.precio_venta} </td>

                                  <td>{detalle.cantidad}</td>
                                  <td>${detalle.total}</td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan="4" className="text-center">
                                  Sin detalles
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      )}
                    </>
                  )}
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={handleClose}>
                    Cerrar
                  </Button>
                </Modal.Footer>
              </Modal> */}
            </div>
          ) : (
            <h3 className="text-center">SIN VENTAS</h3>
          )}
        </div>

        <div className="col-12 col-md-5 d-flex flex-column h-100 shadow-lg bg-white rounded-4 p-3">
          <div className="bg-info text-white text-center p-3 fs-4 fw-bold p-3 rounded">
            Resumen
          </div>
          {ventas.length > 0 ? (
            <div
              className="mt-2 shadow-lg rounded "
              /*     style={{ backgroundColor: 'rgba(0, 175, 239, 0.47)' }} */
            >
              <div className="p-3 row">
                {/* Tabla de ventas */}
                <div className="col-12 col-md-5 d-flex flex-column justify-content-evenly rounded">
                  {/* Encabezado */}

                  {/* Encabezado */}
                  <div className="row fw-bold border-bottom pb-1 border-2 border-secondary">
                    <div className="col-5">Tipo</div>
                    <div className="col-2 text-start">Ventas</div>
                    <div className="col-5 text-end">Total</div>
                  </div>

                  {/* Filas */}
                  {ventas.map((v) => {
                    const tipoInfo = nombresTipoArray.find(
                      (t) => t.id === v.id_tipo_venta
                    );

                    const bgColor = tipoInfo?.color ?? '#FFFFFF';
                    return (
                      <div
                        key={v.id_tipo_venta}
                        className="row rounded my-1 fw-bold p-2"
                        style={{ backgroundColor: bgColor }}
                      >
                        <div className="col-5 text-star">{v.tipo_venta}</div>
                        <div className="col-2 text-end ">{v.transacciones}</div>
                        <div className="col-5 text-end">
                          $ {v.suma_total.toFixed(2)}
                        </div>
                      </div>
                    );
                  })}

                  {/* Totales */}
                  <div className="row fw-bold p-2 border-top mt-2">
                    <div className="col-5">Totales</div>
                    <div className="col-2 text-end">
                      {totalVentas.transacciones}
                    </div>
                    <div className="col-5 text-end">
                      $ {totalVentas.suma_total.toFixed(2)}
                    </div>
                  </div>
                </div>

                {/* PieChart */}
                <div className="col-12 col-md-7 d-flex justify-content-center align-items-center">
                  <PieChart
                    data={ventas.map((v) => ({
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
              </div>
            </div>
          ) : (
            <h3 className="text-center">SIN VENTAS</h3>
          )}
        </div>

        <div className="col-12 col-md-3 d-flex flex-column h-100 shadow-lg bg-white rounded-4 p-3">
          <div className="bg-info text-white text-center p-3 fs-4 fw-bold p-3 rounded">
            Stock
          </div>

          <div
            className="mt-2 shadow-lg p-3 rounded"
            style={{
              /*    backgroundColor: 'rgba(0, 175, 239, 0.68)', */
              overflow: 'auto',
            }}
          >
            <table className="table">
              <thead>
                <tr className="table-secondary">
                  <th>Productos</th>
                  <th className="text-end">Stock</th>
                </tr>
              </thead>
              <tbody>
                {stock.map((p, index) => (
                  <tr key={index}>
                    <td>{p.nombre}</td>
                    <td className="text-end">{p.stock_total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <ViewDetallesVenta
        showModal={showModal}
        handleClose={handleClose}
        ventaSeleccionada={ventaSeleccionada}
      />

      <Spinner loading={loading} msg={msg} />
      <ModalDel
        ventaSeleccionada={ventaSeleccionada}
        showDeleteModal={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onDelete={handleDeleteVenta}
        tipoTransaccion="venta"
      />
    </div>
  );
};

export default Home;
