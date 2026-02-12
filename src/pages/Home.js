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

  const sucursal_id = localStorage.getItem('sucursal_id');

  /*   const { user } = useAuth(); */

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      /*    const { sucursal } = await getSucursal(user.id); */

      /* console.log('idSucursal', sucursal); */

      await fetchResumenVentas(sucursal_id);
      await fetchVerStock(sucursal_id);
      await fetchVentas(sucursal_id);

      setLoading(false);
    };

    fetchData();
  }, []);
  const id_sucursal = localStorage.getItem('sucursal_id');

  // Definir estilos según sucursal
  const estilos =
    id_sucursal === '1'
      ? {
          // SUCURSAL 1: Masculino (Púrpura-Azul)
          gradiente: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          colorPrincipal: '#667eea',
          colorSecundario: '#764ba2',
          fondoClaro: 'rgba(102, 126, 234, 0.08)',
          iconoVentas: 'bi-cart-check-fill',
          iconoResumen: 'bi-graph-up-arrow',
          iconoStock: 'bi-boxes',
        }
      : {
          // SUCURSAL 2: Femenino (Rosa-Coral)
          gradiente: 'linear-gradient(135deg, #f857a6 0%, #ff5858 100%)',
          colorPrincipal: '#f857a6',
          colorSecundario: '#ff5858',
          fondoClaro: 'rgba(248, 87, 166, 0.08)',
          iconoVentas: 'bi-bag-heart-fill',
          iconoResumen: 'bi-pie-chart-fill',
          iconoStock: 'bi-shop-window',
        };

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

  /*   const nombresTipoArray = [
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
  ]; */

  const nombresTipoArray = [
    { id: 1, color: '#667EEA' }, // Púrpura azulado
    { id: 2, color: '#F857A6' }, // Rosa vibrante
    { id: 3, color: '#FFD93D' }, // Dorado brillante
    { id: 4, color: '#6BCF7F' }, // Verde esmeralda
    { id: 5, color: '#FF6B9D' }, // Rosa chicle
    { id: 6, color: '#4FACFE' }, // Azul cielo
    { id: 7, color: '#C471ED' }, // Púrpura lavanda
    { id: 8, color: '#F093FB' }, // Rosa claro
    { id: 9, color: '#43E97B' }, // Verde lima
    { id: 10, color: '#FA709A' }, // Rosa coral
  ];

  const nombresTipoArrayParafuturocambios = [
    { id: 1, color: '#FF3CAC' }, // Rosa vibrante
    { id: 2, color: '#00D9FF' }, // Cyan brillante
    { id: 3, color: '#FFD700' }, // Oro puro
    { id: 4, color: '#7B2FF7' }, // Púrpura intenso
    { id: 5, color: '#FF4E50' }, // Rojo coral
    { id: 6, color: '#00E5A0' }, // Verde jade
    { id: 7, color: '#FF8C42' }, // Naranja mandarina
    { id: 8, color: '#5B9AFF' }, // Azul periwinkle
    { id: 9, color: '#F765A3' }, // Rosa frambuesa
    { id: 10, color: '#16BFD6' }, // Turquesa tropical
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
    <div className="container-fluid p-3">
      {/* Header con estadísticas rápidas */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-md-4">
          <div
            className="card border-0 shadow-sm h-100"
            style={{
              background: estilos.gradiente,
              borderRadius: '15px',
            }}
          >
            <div className="card-body text-white d-flex align-items-center justify-content-between">
              <div>
                <h6 className="text-white-50 fw-semibold mb-2">VENTAS HOY</h6>
                <h2 className="fw-bold mb-0">{ventasHoy.length}</h2>
                <small className="text-white-50">Transacciones</small>
              </div>
              <div
                className="rounded-circle d-flex align-items-center justify-content-center"
                style={{
                  width: '60px',
                  height: '60px',
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                }}
              >
                <i className={`bi ${estilos.iconoVentas} fs-2`}></i>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-4">
          <div
            className="card border-0 shadow-sm h-100"
            style={{ borderRadius: '15px' }}
          >
            <div className="card-body d-flex align-items-center justify-content-between">
              <div>
                <h6 className="text-muted fw-semibold mb-2">TOTAL VENTAS</h6>
                <h2
                  className="fw-bold mb-0"
                  style={{ color: estilos.colorPrincipal }}
                >
                  ${totalVentas.suma_total.toFixed(2)}
                </h2>
                <small className="text-muted">
                  {totalVentas.transacciones} ventas
                </small>
              </div>
              <div
                className="rounded-circle d-flex align-items-center justify-content-center"
                style={{
                  width: '60px',
                  height: '60px',
                  backgroundColor: estilos.fondoClaro,
                }}
              >
                <i
                  className={`bi ${estilos.iconoResumen} fs-2`}
                  style={{ color: estilos.colorPrincipal }}
                ></i>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-4">
          <div
            className="card border-0 shadow-sm h-100"
            style={{ borderRadius: '15px' }}
          >
            <div className="card-body d-flex align-items-center justify-content-between">
              <div>
                <h6 className="text-muted fw-semibold mb-2">PRODUCTOS</h6>
                <h2
                  className="fw-bold mb-0"
                  style={{ color: estilos.colorPrincipal }}
                >
                  {stock.length}
                </h2>
                <small className="text-muted">En stock</small>
              </div>
              <div
                className="rounded-circle d-flex align-items-center justify-content-center"
                style={{
                  width: '60px',
                  height: '60px',
                  backgroundColor: estilos.fondoClaro,
                }}
              >
                <i
                  className={`bi ${estilos.iconoStock} fs-2`}
                  style={{ color: estilos.colorPrincipal }}
                ></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="row g-3" style={{ minHeight: '60vh' }}>
        {/* Columna Ventas */}
        <div className="col-12 col-lg-4">
          <div
            className="card border-0 shadow-sm h-100"
            style={{ borderRadius: '15px' }}
          >
            <div
              className="card-header border-0 text-white d-flex align-items-center gap-3 py-3"
              style={{
                background: estilos.gradiente,
                borderRadius: '15px 15px 0 0',
              }}
            >
              <i className={`bi ${estilos.iconoVentas} fs-4`}></i>
              <h5 className="mb-0 fw-bold">Ventas del Día</h5>
            </div>

            <div
              className="card-body p-0"
              style={{ maxHeight: '500px', overflowY: 'auto' }}
            >
              {ventasHoy.length > 0 ? (
                <table className="table table-hover mb-0">
                  <thead
                    className="sticky-top"
                    style={{ backgroundColor: '#f8f9fa' }}
                  >
                    <tr>
                      <th className="py-3">Hora</th>
                      <th className="text-end py-3">Nro</th>
                      <th className="text-end py-3">Tipo</th>
                      <th className="text-end py-3">Total</th>
                      <th className="text-center py-3">
                        <i className="bi bi-search"></i>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {ventasHoy.map((p, index) => (
                      <tr
                        key={index}
                        onContextMenu={(e) => handleRightClick(e, p)}
                        style={{ cursor: 'pointer' }}
                      >
                        <td className="py-3">
                          <span className="badge bg-light text-dark">
                            {formatedFecha(p.fecha)}
                          </span>
                        </td>
                        <td className="text-end py-3 fw-semibold">
                          #{p.id_venta}
                        </td>
                        <td className="text-end py-3">
                          <span
                            className="badge"
                            style={{
                              backgroundColor: estilos.fondoClaro,
                              color: estilos.colorPrincipal,
                            }}
                          >
                            {p.tipoVenta.tipoVenta}
                          </span>
                        </td>
                        <td
                          className="text-end py-3 fw-bold"
                          style={{ color: estilos.colorPrincipal }}
                        >
                          ${p.total.toFixed(2)}
                        </td>
                        <td className="text-center py-3">
                          <button
                            className="btn btn-sm"
                            onClick={() => handleShow(p)}
                            style={{
                              backgroundColor: estilos.fondoClaro,
                              color: estilos.colorPrincipal,
                              border: 'none',
                              borderRadius: '8px',
                            }}
                          >
                            <i className="bi bi-eye"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-center py-5">
                  <i className="bi bi-inbox fs-1 text-muted mb-3 d-block"></i>
                  <h5 className="text-muted">Sin ventas registradas</h5>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Columna Resumen */}
        <div className="col-12 col-lg-5">
          <div
            className="card border-0 shadow-sm h-100"
            style={{ borderRadius: '15px' }}
          >
            <div
              className="card-header border-0 text-white d-flex align-items-center gap-3 py-3"
              style={{
                background: estilos.gradiente,
                borderRadius: '15px 15px 0 0',
              }}
            >
              <i className={`bi ${estilos.iconoResumen} fs-4`}></i>
              <h5 className="mb-0 fw-bold">Resumen por Tipo</h5>
            </div>

            <div className="card-body">
              {ventas.length > 0 ? (
                <div className="row">
                  {/* Tabla de ventas */}
                  <div className="col-12 col-md-6">
                    {/* Encabezado */}
                    <div
                      className="row fw-bold py-2 mb-2 rounded"
                      style={{
                        backgroundColor: estilos.fondoClaro,
                        color: estilos.colorPrincipal,
                      }}
                    >
                      <div className="col-5">Tipo</div>
                      <div className="col-3 text-center">Cant.</div>
                      <div className="col-4 text-end">Total</div>
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
                          className="row py-2 mb-2 rounded align-items-center"
                          style={{
                            backgroundColor: bgColor,
                            transition: 'all 0.2s ease',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'scale(1.02)';
                            e.currentTarget.style.boxShadow =
                              '0 4px 12px rgba(0,0,0,0.1)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'scale(1)';
                            e.currentTarget.style.boxShadow = 'none';
                          }}
                        >
                          <div className="col-5 fw-semibold">
                            {v.tipo_venta}
                            {v.id_tipo_venta}
                          </div>
                          <div className="col-3 text-center">
                            <span className="badge bg-dark">
                              {v.transacciones}
                            </span>
                          </div>
                          <div className="col-4 text-end fw-bold">
                            ${v.suma_total.toFixed(2)}
                          </div>
                        </div>
                      );
                    })}

                    {/* Totales */}
                    <div
                      className="row py-3 mt-3 rounded fw-bold"
                      style={{
                        background: estilos.gradiente,
                        color: 'white',
                      }}
                    >
                      <div className="col-5">TOTAL</div>
                      <div className="col-3 text-center">
                        {totalVentas.transacciones}
                      </div>
                      <div className="col-4 text-end">
                        ${totalVentas.suma_total.toFixed(2)}
                      </div>
                    </div>
                  </div>

                  {/* Gráfico */}
                  <div className="col-12 col-md-6 d-flex justify-content-center align-items-center">
                    <PieChart
                      data={ventas.map((v) => ({
                        id_tipo_venta: v.id_tipo_venta,
                        tipo_venta: v.tipo_venta,
                        suma_total: v.suma_total,
                        transacciones: v.transacciones,
                        label: 'contado',
                        color:
                          nombresTipoArray.find((c) => c.id === v.id_tipo_venta)
                            ?.color || estilos.colorPrincipal,
                      }))}
                    />
                  </div>
                </div>
              ) : (
                <div className="text-center py-5">
                  <i className="bi bi-pie-chart fs-1 text-muted mb-3 d-block"></i>
                  <h5 className="text-muted">Sin datos de resumen</h5>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Columna Stock */}
        <div className="col-12 col-lg-3">
          <div
            className="card border-0 shadow-sm h-100"
            style={{ borderRadius: '15px' }}
          >
            <div
              className="card-header border-0 text-white d-flex align-items-center gap-3 py-3"
              style={{
                background: estilos.gradiente,
                borderRadius: '15px 15px 0 0',
              }}
            >
              <i className={`bi ${estilos.iconoStock} fs-4`}></i>
              <h5 className="mb-0 fw-bold">Stock Bajo</h5>
            </div>

            <div
              className="card-body p-0"
              style={{ maxHeight: '500px', overflowY: 'auto' }}
            >
              {stock.length > 0 ? (
                <table className="table table-hover mb-0">
                  <thead
                    className="sticky-top"
                    style={{ backgroundColor: '#f8f9fa' }}
                  >
                    <tr>
                      <th className="py-3">Producto</th>
                      <th className="text-end py-3">Stock</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stock.map((p, index) => (
                      <tr key={index}>
                        <td className="py-3">
                          <div className="d-flex align-items-center gap-2">
                            <div
                              className="rounded-circle flex-shrink-0"
                              style={{
                                width: '8px',
                                height: '8px',
                                backgroundColor:
                                  p.stock_total < 5
                                    ? '#dc3545'
                                    : p.stock_total < 10
                                    ? '#ffc107'
                                    : '#198754',
                              }}
                            ></div>
                            <span className="fw-semibold">{p.nombre}</span>
                          </div>
                        </td>
                        <td className="text-end py-3">
                          <span
                            className="badge rounded-pill"
                            style={{
                              backgroundColor:
                                p.stock_total < 5
                                  ? '#dc354515'
                                  : p.stock_total < 10
                                  ? '#ffc10715'
                                  : '#19875415',
                              color:
                                p.stock_total < 5
                                  ? '#dc3545'
                                  : p.stock_total < 10
                                  ? '#ffc107'
                                  : '#198754',
                              fontSize: '0.9rem',
                              padding: '6px 12px',
                            }}
                          >
                            {p.stock_total}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-center py-5">
                  <i className="bi bi-check-circle fs-1 text-success mb-3 d-block"></i>
                  <h5 className="text-muted">Stock suficiente</h5>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modales */}
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
