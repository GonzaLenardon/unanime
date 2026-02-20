import { useState } from 'react';
import { resumenDesdeHasta, ventasDesdeHasta } from '../api/listados';
import PieChart from '../components/grafico';
import Spinner from '../components/spinner';
import { Modal, Button } from 'react-bootstrap';
import { ModalDel } from '../components/ModalDel';
import { delVenta } from '../api/ventas';
import { allproductos } from '../api/productos';
import { ToastContainer, toast, Slide } from 'react-toastify';

const VentasResumen = () => {
  const [data, setData] = useState([]);
  const [fecha, setFecha] = useState({ desde: '', hasta: '' });
  const [detalleVtas, setDetalleVtas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [ventaABorrar, setVentaABorrar] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [ventaSeleccionada, setVentaSeleccionada] = useState(null);

  const search = async () => {
    if (!fecha.desde || !fecha.hasta) {
      toast.warning('⚠️ Seleccione ambas fechas');
      return;
    }

    if (fecha.desde > fecha.hasta) {
      toast.error('❌ La fecha Desde debe ser menor que la fecha Hasta');
      return;
    }

    setLoading(true);
    setMsg('Buscando ventas...');
    await fetchResumen();
    await fetchVentas();
    setLoading(false);
    setMsg('');
  };

  const fetchResumen = async () => {
    try {
      const res = await resumenDesdeHasta({
        desde: fecha.desde,
        hasta: fecha.hasta,
      });
      console.log('Data', res.data);

      setData(res.data);
    } catch (error) {
      console.log(error);
      toast.error('Error al cargar resumen');
    }
  };

  const fetchVentas = async () => {
    try {
      const res = await ventasDesdeHasta({
        desde: fecha.desde,
        hasta: fecha.hasta,
      });
      setDetalleVtas(res.data);
      console.log('first', res.data);
    } catch (error) {
      console.log(error);
      toast.error('Error al cargar ventas');
    }
  };

  const handleFechas = (e) => {
    const { name, value } = e.target;
    setFecha((prev) => ({ ...prev, [name]: value }));
  };

  const nombresTipoArray = [
    { id: 1, color: 'rgba(231, 76, 60, 0.75)' }, // rojo coral
    { id: 2, color: 'rgba(52, 152, 219, 0.75)' }, // azul brillante
    { id: 3, color: 'rgba(46, 204, 113, 0.75)' }, // verde esmeralda
    { id: 4, color: 'rgba(155, 89, 182, 0.75)' }, // violeta
    { id: 5, color: 'rgba(241, 196, 15, 0.75)' }, // amarillo mostaza
    { id: 6, color: 'rgba(26, 188, 156, 0.75)' }, // turquesa
    { id: 7, color: 'rgba(230, 126, 34, 0.75)' }, // naranja fuerte
    { id: 8, color: 'rgba(52, 73, 94, 0.75)' }, // azul oscuro
    { id: 9, color: 'rgba(233, 30, 99, 0.75)' }, // rosa intenso
    { id: 10, color: 'rgba(142, 68, 173, 0.75)' }, // púrpura oscuro
  ];

  const resultadoConNombres = data.map((item) => {
    const encontrado = nombresTipoArray.find(
      (x) => x.id === item.id_tipo_venta,
    );

    return {
      id: item.id_tipo_venta,
      tipo: item.tipo_venta,
      color: encontrado?.color ?? 'rgba(180,180,180,0.7)',
      suma_total: item.suma_total,
      transacciones: item.transacciones,
    };
  });

  const totalVentas = data.reduce(
    (acc, el) => {
      acc.suma_total += Number(el.suma_total);
      acc.transacciones += Number(el.transacciones);
      return acc;
    },
    { suma_total: 0, transacciones: 0 },
  );

  const handleShow = (venta) => {
    setVentaSeleccionada(venta);
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setVentaSeleccionada(null);
  };

  const formatedFecha = (fechaString) => {
    const [fecha, hora] = fechaString.split('T');
    return hora.slice(0, 5);
  };

  const handleModalDel = (e, venta) => {
    e.preventDefault();
    setVentaABorrar(venta);
    setShowDeleteModal(true);
  };

  const handleDeleteVenta = async (id) => {
    try {
      setMsg('Borrando venta...');
      setLoading(true);
      setShowDeleteModal(false);
      await delVenta(id);

      await fetchResumen();
      await fetchVentas();

      setVentaABorrar(null);
      toast.success('✅ Venta eliminada correctamente');
    } catch (error) {
      console.error('Error al eliminar venta:', error);
      toast.error('❌ Error al eliminar la venta');
    } finally {
      setLoading(false);
      setMsg('');
    }
  };

  return (
    <div
      className="container-fluid p-4"
      style={{ backgroundColor: '#f8faf9', minHeight: '100vh' }}
    >
      <style>
        {`
          .resumen-card {
            background: white;
            border-radius: 20px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          }
        `}
      </style>

      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h2 className="fw-bold text-success mb-0 d-flex align-items-center gap-3">
          <div
            className="d-flex align-items-center justify-content-center rounded-circle bg-success bg-opacity-25"
            style={{ width: '50px', height: '50px' }}
          >
            <i className="bi bi-journal-text fs-3 text-success"></i>
          </div>
          <span>Listado de Ventas</span>
        </h2>
      </div>

      {/* Filtros de fecha */}
      <div
        className="resumen-card p-4 mb-4"
        style={{
          background: 'linear-gradient(135deg, #d8f3dc 0%, #b7e4c7 100%)',
        }}
      >
        <div className="row g-3 align-items-end">
          <div className="col-12 col-md-4">
            <label className="form-label fw-bold text-success">
              <i className="bi bi-calendar-event me-2"></i>
              Fecha Desde
            </label>
            <input
              type="date"
              className="form-control form-control-lg"
              name="desde"
              value={fecha.desde}
              onChange={handleFechas}
              style={{ borderColor: '#95d5b2', borderRadius: '12px' }}
            />
          </div>
          <div className="col-12 col-md-4">
            <label className="form-label fw-bold text-success">
              <i className="bi bi-calendar-check me-2"></i>
              Fecha Hasta
            </label>
            <input
              type="date"
              className="form-control form-control-lg"
              name="hasta"
              value={fecha.hasta}
              onChange={handleFechas}
              style={{ borderColor: '#95d5b2', borderRadius: '12px' }}
            />
          </div>
          <div className="col-12 col-md-4">
            <button
              className="btn btn-lg w-100 rounded-pill"
              onClick={search}
              style={{
                background: 'linear-gradient(135deg, #40916c 0%, #52b788 100%)',
                color: 'white',
                border: 'none',
                fontWeight: '700',
                boxShadow: '0 4px 12px rgba(64, 145, 108, 0.4)',
              }}
            >
              <i className="bi bi-search me-2"></i>
              Buscar Ventas
            </button>
          </div>
        </div>

        {fecha.desde && fecha.hasta && (
          <div className="mt-3">
            <small className="text-success fw-semibold">
              <i className="bi bi-calendar-range me-2"></i>
              Período: {new Date(fecha.desde).toLocaleDateString(
                'es-AR',
              )} - {new Date(fecha.hasta).toLocaleDateString('es-AR')}
            </small>
          </div>
        )}
      </div>

      {/* Resultados */}
      {data.length > 0 && detalleVtas.length > 0 ? (
        <div className="row g-4">
          {/* Columna Resumen */}
          <div className="col-12 col-lg-5">
            <div
              className="resumen-card"
              style={{
                height: '600px',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div
                className="p-3 text-center rounded-top"
                style={{
                  background:
                    'linear-gradient(135deg, #2d6a4f 0%, #40916c 100%)',
                  color: 'white',
                }}
              >
                <h4 className="mb-0 fw-bold">
                  <i className="bi bi-pie-chart-fill me-2"></i>
                  Resumen por Tipo de Pago
                </h4>
              </div>

              <div className="p-3" style={{ flex: 1 }}>
                <div className="row h-100">
                  {/* TABLA (izquierda) */}
                  <div className="col-12 col-md-6">
                    {/* Header */}
                    <div
                      className="row fw-bold py-2 mb-2 rounded"
                      style={{
                        backgroundColor: '#d8f3dc',
                        color: '#1b4332',
                      }}
                    >
                      <div className="col-5">Tipo</div>
                      <div className="col-3 text-center">Cant.</div>
                      <div className="col-4 text-end">Total</div>
                    </div>

                    {/* Filas */}
                    {data.map((v) => {
                      const tipoInfo = nombresTipoArray.find(
                        (t) => t.id === v.id_tipo_venta,
                      );
                      const colorBase =
                        tipoInfo?.color || 'rgba(149,213,178,0.8)';
                      const colorSoft = tipoInfo?.color
                        ? tipoInfo.color.replace(/0\.75/, '0.4')
                        : 'rgba(149,213,178,0.4)';

                      return (
                        <div
                          key={v.id_tipo_venta}
                          className="row py-2 mb-2 rounded align-items-center"
                          style={{
                            background: `linear-gradient(135deg, ${colorBase} 0%, ${colorSoft} 100%)`,
                            color: '#1b4332',
                            transition: 'all 0.2s ease',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'scale(1.02)';
                            e.currentTarget.style.boxShadow =
                              '0 4px 12px rgba(0,0,0,0.15)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'scale(1)';
                            e.currentTarget.style.boxShadow = 'none';
                          }}
                        >
                          <div className="col-5 fw-semibold d-flex align-items-center gap-2">
                            <i className="bi bi-credit-card"></i>
                            {v.tipo_venta}
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

                    {/* TOTAL */}
                    <div
                      className="row py-3 mt-3 rounded fw-bold"
                      style={{
                        background:
                          'linear-gradient(135deg, #2d6a4f 0%, #40916c 100%)',
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

                  {/* GRÁFICO (derecha) */}
                  <div className="col-12 col-md-6 d-flex justify-content-center align-items-center">
                    <div style={{ width: '100%' }}>
                      <PieChart data={resultadoConNombres} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Columna Ventas */}
          <div className="col-12 col-lg-7">
            <div
              className="resumen-card"
              style={{
                height: '600px',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div
                className="p-3 text-center rounded-top d-flex align-items-center justify-content-between"
                style={{
                  background:
                    'linear-gradient(135deg, #2d6a4f 0%, #40916c 100%)',
                  color: 'white',
                }}
              >
                <h4 className="mb-0 fw-bold">
                  <i className="bi bi-receipt me-2"></i>
                  Detalle de Ventas
                </h4>
                <span className="badge bg-white text-success px-3 py-2">
                  {detalleVtas.length} ventas
                </span>
              </div>

              <div className="overflow-auto" style={{ flex: 1 }}>
                <table className="table table-hover align-middle mb-0">
                  <thead
                    style={{
                      backgroundColor: '#95d5b2',
                      position: 'sticky',
                      top: 0,
                      zIndex: 1,
                    }}
                  >
                    <tr>
                      <th
                        className="py-3 ps-4 fw-bold"
                        style={{ color: '#1b4332' }}
                      >
                        <i className="bi bi-calendar3 me-2"></i>Fecha
                      </th>
                      <th className="py-3 fw-bold" style={{ color: '#1b4332' }}>
                        <i className="bi bi-clock me-2"></i>Hora
                      </th>
                      <th className="py-3 fw-bold" style={{ color: '#1b4332' }}>
                        <i className="bi bi-hash me-2"></i>Nro
                      </th>
                      <th className="py-3 fw-bold" style={{ color: '#1b4332' }}>
                        <i className="bi bi-credit-card me-2"></i>Tipo
                      </th>
                      <th
                        className="py-3 fw-bold text-end"
                        style={{ color: '#1b4332' }}
                      >
                        <i className="bi bi-currency-dollar me-2"></i>Total
                      </th>
                      <th
                        className="py-3 fw-bold text-center"
                        style={{ color: '#1b4332' }}
                      >
                        <i className="bi bi-gear-fill me-2"></i>Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {detalleVtas.map((venta, index) => {
                      return (
                        <tr
                          key={index}
                          style={{
                            backgroundColor:
                              index % 2 === 0 ? '#ffffff' : '#f8f9fa',
                          }}
                        >
                          <td className="ps-4 py-3">
                            {new Date(venta.fecha).toLocaleDateString('es-AR', {
                              timeZone: 'UTC',
                            })}
                          </td>
                          <td className="py-3">
                            <span className="badge bg-light text-dark border px-2 py-1">
                              {formatedFecha(venta.fecha)}
                            </span>
                          </td>
                          <td className="py-3">
                            <span className="badge bg-success bg-opacity-25 text-success px-2 py-1">
                              #{venta.id_venta}
                            </span>
                          </td>
                          <td className="py-3">
                            <div className="d-flex align-items-center gap-2">
                              <i className="bi bi-credit-card"></i>
                              {venta.tipoVenta.tipoVenta}
                            </div>
                          </td>
                          <td
                            className="py-3 text-end fw-bold"
                            style={{ color: '#2d6a4f' }}
                          >
                            ${venta.total.toFixed(2)}
                          </td>
                          <td className="py-3 text-center">
                            <div className="d-flex gap-2 justify-content-center">
                              <button
                                className="btn btn-sm btn-outline-primary rounded-pill px-3"
                                onClick={() => handleShow(venta)}
                              >
                                <i className="bi bi-eye me-1"></i>
                                Ver
                              </button>
                              <button
                                className="btn btn-sm btn-outline-danger rounded-pill px-3"
                                onClick={(e) => handleModalDel(e, venta)}
                              >
                                <i className="bi bi-trash"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      ) : (
        fecha.desde &&
        fecha.hasta && (
          <div className="resumen-card p-5 text-center">
            <i className="bi bi-inbox fs-1 text-muted mb-3 d-block"></i>
            <h4 className="text-muted">No se encontraron ventas</h4>
            <p className="text-muted">
              No hay ventas registradas en el período seleccionado
            </p>
          </div>
        )
      )}

      {/* Modal de Detalles */}
      <Modal
        show={showModal}
        onHide={handleClose}
        size="lg"
        backdrop="static"
        keyboard={false}
        centered
      >
        <Modal.Header
          closeButton
          className="border-0"
          style={{
            background: 'linear-gradient(135deg, #2d6a4f 0%, #40916c 100%)',
          }}
        >
          <Modal.Title className="text-white d-flex align-items-center gap-2">
            <i className="bi bi-receipt-cutoff fs-4"></i>
            Detalles de Venta #{ventaSeleccionada?.id_venta}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4" style={{ backgroundColor: '#f8faf9' }}>
          {ventaSeleccionada && (
            <>
              <div className="row g-3 mb-4">
                <div className="col-6">
                  <div
                    className="p-3 rounded-3"
                    style={{ backgroundColor: '#d8f3dc' }}
                  >
                    <small className="text-muted d-block mb-1">
                      Fecha y Hora
                    </small>
                    <strong style={{ color: '#1b4332' }}>
                      <i className="bi bi-calendar-check me-2"></i>
                      {new Date(ventaSeleccionada.fecha).toLocaleString(
                        'es-AR',
                      )}
                    </strong>
                  </div>
                </div>
                <div className="col-6">
                  <div
                    className="p-3 rounded-3"
                    style={{ backgroundColor: '#b7e4c7' }}
                  >
                    <small className="text-muted d-block mb-1">Total</small>
                    <strong className="fs-4" style={{ color: '#1b4332' }}>
                      ${ventaSeleccionada.total}
                    </strong>
                  </div>
                </div>
              </div>

              <table className="table table-hover">
                <thead style={{ backgroundColor: '#95d5b2' }}>
                  <tr>
                    <th className="py-3">#</th>
                    <th className="py-3">Producto</th>
                    <th className="py-3 text-center">Cantidad</th>
                    <th className="py-3 text-end">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {ventaSeleccionada.detalles?.length > 0 ? (
                    ventaSeleccionada.detalles.map((detalle, idx) => (
                      <tr key={detalle.id_detalleventa}>
                        <td>{idx + 1}</td>
                        <td>
                          <i
                            className="bi bi-box-seam me-2"
                            style={{ color: '#40916c' }}
                          ></i>
                          {detalle.producto?.nombre}
                        </td>
                        <td className="text-center">
                          <span className="badge bg-light text-dark border px-3 py-2">
                            {detalle?.cantidad}
                          </span>
                        </td>
                        <td
                          className="text-end fw-bold"
                          style={{ color: '#2d6a4f' }}
                        >
                          ${detalle?.total}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center text-muted py-4">
                        Sin detalles
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </>
          )}
        </Modal.Body>
        <Modal.Footer
          className="border-0"
          style={{ backgroundColor: '#f8faf9' }}
        >
          <Button
            variant="outline-secondary"
            onClick={handleClose}
            className="px-4 rounded-pill"
          >
            <i className="bi bi-x-circle me-2"></i>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>

      <Spinner loading={loading} msg={msg} />

      <ModalDel
        ventaSeleccionada={ventaABorrar}
        showDeleteModal={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onDelete={handleDeleteVenta}
        tipoTransaccion="venta"
      />

      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        transition={Slide}
      />
    </div>
  );
};

export default VentasResumen;
