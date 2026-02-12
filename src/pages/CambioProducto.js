import React, { useEffect, useState } from 'react';
import { detallesVentas } from '../api/ventas';
import ModalSeleccionProducto from '../components/ModalSeleccionarProducto';
import { useGestion } from '../context/UserContext';
import { toast } from 'react-toastify'; // Opcional si usás notificaciones
import { cambio } from '../api/cambios';
import { ToastContainer, Slide } from 'react-toastify';

import { allTipoVentas } from '../api/tipoVentas';

const CambioProducto = () => {
  const [nroVenta, setNroVenta] = useState('');
  const [ventaOriginal, setVentaOriginal] = useState(null);
  const [devueltos, setDevueltos] = useState([]);
  const [recibidos, setRecibidos] = useState([]);
  const [observaciones, setObservaciones] = useState('');
  const [showModalRecibido, setShowModalRecibido] = useState(false);
  const [tiposVentas, setTiposVentas] = useState([]);
  const [tventaSeleccionada, setTventaSeleccionada] = useState();
  const [producto, setProductos] = useState([]);
  const { fetchProductos, productos } = useGestion();

  const handleNro = (e) => setNroVenta(e.target.value);

  useEffect(() => {
    tVentas();
  }, []);

  const fetchDetallesVenta = async () => {
    if (!nroVenta) return;
    try {
      setVentaOriginal([]);
      setDevueltos([]);
      setRecibidos([]);

      const resp = await detallesVentas(nroVenta);
      console.log('Que recibo de detalles ... ', resp.ventaOriginal.id_venta);
      setVentaOriginal(resp);
    } catch (error) {
      console.error('Error al obtener detalles de la venta:', error);
      toast.error('No se encontró la venta');
    }
  };

  const getProductos = async () => {
    try {
      const resp = await fetchProductos();
      setProductos(resp);
    } catch (error) {
      console.log('Error al obenter productos ', error);
    }
  };

  const agregarProductoDevuelto = (item) => {
    const isExist = devueltos.some((p) => p.id_producto === item.id_producto);

    console.log('devuelto', item);

    if (isExist) return;

    const nuevo = {
      id_producto: item.id_producto,
      nombre: item.nombreProducto,
      cantidad: item.cantidad,
      precio_unitario: item.precio_unitario,
      id_detalle_compra: item.id_detalle_compra,
    };
    setDevueltos((prev) => [...prev, nuevo]);
  };

  useEffect(() => {
    console.log('Devueltos', devueltos);
    if (devueltos.length === 0) setRecibidos([]);
  }, [devueltos]);

  const handleAgregarRecibido = (producto) => {
    setRecibidos((prev) => [...prev, producto]);
  };

  const tVentas = async () => {
    const resp = await allTipoVentas();
    console.log('tipoVentas', resp);
    setTiposVentas(resp);
  };

  const handleRemoveDevuelto = (index) => {
    setDevueltos(devueltos.filter((_, i) => i !== index));
    console.log('devueltos', devueltos.length.toString());
    console.log(devueltos);
  };

  const handleRemoveRecibido = (index) => {
    setRecibidos(recibidos.filter((_, i) => i !== index));
  };

  const calcularTotal = (items) =>
    items.reduce((acc, item) => acc + item.precio_unitario * item.cantidad, 0);

  const diferencia = calcularTotal(recibidos) - calcularTotal(devueltos);

  const handleConfirmarCambio = async () => {
    if (!ventaOriginal || devueltos.length === 0 || recibidos.length === 0) {
      toast.error('Debes agregar productos devueltos y recibidos.');
      return;
    }

    const cambioPayload = {
      id_venta_original: ventaOriginal.ventaOriginal.id_venta,
      observaciones,

      tventaSeleccionada: parseInt(tventaSeleccionada),
      diferencia: diferencia > 0 ? diferencia : 0,

      devuelto: devueltos.map((d) => ({
        producto_id: d.id_producto,
        cantidad: d.cantidad,
        precio_unitario: d.precio_unitario,
        id_detalle_compra: d.id_detalle_compra,
      })),
      recibido: recibidos.map((r) => ({
        producto_id: r.id_producto,
        cantidad: r.cantidad,
        precio_unitario: r.precio_unitario,
        id_detalle_compra: r.id_detalle_compra,
      })),
    };

    try {
      const resp = await cambio(cambioPayload);
      toast.success(resp.message || 'Cambio registrado correctamente');
      // limpiar estados si querés
      console.log('payload', cambioPayload);
      setNroVenta('');
      setVentaOriginal(null);
      setDevueltos([]);
      setRecibidos([]);
      setObservaciones('');
    } catch (error) {
      console.error(error);
      toast.error('Error al registrar el cambio');
    }
  };

  const cancelar = async () => {
    setNroVenta('');
    setVentaOriginal(null);
    setDevueltos([]);
    setRecibidos([]);
    setObservaciones('');
  };

  useEffect(() => {
    console.log('TipoventaSele', tventaSeleccionada);
  }, [tventaSeleccionada]);

  return (
    <>
      <div className="container-fluid p-1">
        <div className="contenedorSeccion">
          <p className=" m-0 ml" style={{ fontSize: '24px' }}>
            {' '}
            🔄
          </p>
          <p className="tituloSeccion">Cambios de Productos</p>
        </div>

        {/* Buscador */}
        <div className="container d-flex w-100 justify-content-center align-items-center gap-3 py-2">
          <label className="fs-5 fw-bold mb-0 align-self-center">
            Venta N°
          </label>

          <input
            type="number"
            className="form-control"
            style={{ maxWidth: '300px' }}
            placeholder="Ingresar N° de venta"
            value={nroVenta}
            onChange={handleNro}
          />

          <button
            type="button"
            className="btn btn-success"
            onClick={fetchDetallesVenta}
          >
            Buscar
          </button>

          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={cancelar}
          >
            Limpiar
          </button>
        </div>

        <div
          className="container p-5 rounded"
          style={{ background: '#e7eeefff' }}
        >
          {/* Detalle de la venta original */}

          <div>
            <h5>Detalle de la Venta Original</h5>

            <table className="table table-bordered ">
              <thead className="table-secondary">
                <tr>
                  <th>#</th>
                  <th>Producto</th>
                  <th>Cantidad</th>
                  <th>Total Detalle</th>
                </tr>
              </thead>
              <tbody>
                {ventaOriginal?.ventaOriginal?.productos.map((detalle, idx) => (
                  <tr key={idx}>
                    <td>{idx + 1}</td>
                    <td>{detalle.nombre}</td>

                    <td>{detalle.cantidad}</td>
                    <td>$ {detalle.precio_unitario.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <h5>Cambios</h5>

            <div className="mb-4">
              <h5>Historial de Cambios</h5>

              {ventaOriginal?.cambios && ventaOriginal.cambios.length > 0 ? (
                ventaOriginal.cambios.map((cambio) => (
                  <div key={cambio.id_cambio} className="card mb-3">
                    <div className="card-header bg-info text-white">
                      <strong>Cambio #{cambio.numero}</strong> -{' '}
                      {new Date(cambio.fecha).toLocaleString('es-AR')}
                      {cambio.observaciones && (
                        <span className="ms-3">
                          <small>({cambio.observaciones})</small>
                        </span>
                      )}
                    </div>
                    <div className="card-body">
                      <div className="row">
                        {/* PRODUCTOS DEVUELTOS */}
                        <div className="col-md-6">
                          <h6 className="text-danger">
                            <i className="bi bi-arrow-left-circle"></i> Devolvió
                          </h6>
                          <table className="table table-sm table-bordered">
                            <thead className="table-light">
                              <tr>
                                <th>Producto</th>
                                <th>Cant.</th>
                                <th>Precio</th>
                                <th>Lote</th>
                              </tr>
                            </thead>
                            <tbody>
                              {cambio.devueltos.map((prod) => (
                                <tr key={prod.id_detalle_cambio}>
                                  <td>{prod.nombre}</td>
                                  <td>{prod.cantidad}</td>
                                  <td>
                                    ${' '}
                                    {prod.precio_unitario.toLocaleString(
                                      'es-AR'
                                    )}
                                  </td>
                                  <td>
                                    <small className="text-muted">
                                      #{prod.id_detalle_compra}
                                    </small>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>

                        {/* PRODUCTOS RECIBIDOS */}
                        <div className="col-md-6">
                          <h6 className="text-success">
                            <i className="bi bi-arrow-right-circle"></i> Recibió
                          </h6>
                          <table className="table table-sm table-bordered">
                            <thead className="table-light">
                              <tr>
                                <th>Producto</th>
                                <th>Cant.</th>
                                <th>Precio</th>
                                <th>Lote</th>
                              </tr>
                            </thead>
                            <tbody>
                              {cambio.recibidos.map((prod) => (
                                <tr key={prod.id_detalle_cambio}>
                                  <td>{prod.nombre}</td>
                                  <td>{prod.cantidad}</td>
                                  <td>
                                    ${' '}
                                    {prod.precio_unitario.toLocaleString(
                                      'es-AR'
                                    )}
                                  </td>
                                  <td>
                                    <small className="text-muted">
                                      #{prod.id_detalle_compra}
                                    </small>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="alert alert-info">
                  No hay cambios registrados para esta venta
                </div>
              )}
            </div>
          </div>

          {ventaOriginal?.vigentes?.length > 0 && (
            <div className="mb-4">
              <h5>Detalle de la Venta</h5>
              <ul className="list-group">
                {ventaOriginal.vigentes.map((item) => (
                  <li
                    key={item.id_venta_original}
                    className="list-group-item d-flex justify-content-between align-items-center"
                  >
                    <span>
                      {item.nombre} x {item.cantidad} =
                      <strong> $ {item.precio_unitario}</strong>
                    </span>
                    <div className="d-flex align-items-center gap-2">
                      <input
                        type="number"
                        min="1"
                        max={item.cantidad}
                        className="form-control form-control-sm"
                        style={{ width: '80px' }}
                        onChange={(e) => {
                          const valor = Number(e.target.value);
                          if (valor > 0 && valor <= item.cantidad) {
                            // Guardar la cantidad temporalmente en el objeto
                            item.cantidadDevolver = valor;
                          }
                        }}
                      />
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => {
                          if (!item.cantidadDevolver) {
                            toast.error('Ingrese una cantidad válida');
                            return;
                          }
                          agregarProductoDevuelto({
                            ...item,
                            cantidad: item.cantidadDevolver,
                            precio_unitario:
                              item.precio_unitario / item.cantidad,
                          });
                        }}
                      >
                        ➕
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Productos devueltos */}

          <div className="d-flex gap-1">
            <div
              className="mb-4 alert p-3 w-50 rounded"
              style={{ background: '#a9c1c3ff' }}
            >
              <h5>Productos Devueltos</h5>
              <ul className="list-group">
                {devueltos.map((item, index) => (
                  <li
                    key={index}
                    className="list-group-item d-flex justify-content-between align-items-center"
                  >
                    <span>
                      {item.nombre} x {item.cantidad} = $
                      {(item.precio_unitario * item.cantidad).toLocaleString(
                        'es-AR'
                      )}
                    </span>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleRemoveDevuelto(index)}
                    >
                      ❌
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Productos recibidos */}
            <div
              className="mb-4 alert  p-3 w-50 rounded card-body"
              style={{ background: '#a9c1c3ff' }}
            >
              <h5>Productos Entregados</h5>

              <ul className="list-group">
                {recibidos.map((item, index) => (
                  <li
                    key={index}
                    className="list-group-item d-flex justify-content-between align-items-center"
                  >
                    <span>
                      {item.nombre} x {item.cantidad} = $
                      {(item.precio_unitario * item.cantidad).toLocaleString(
                        'es-AR'
                      )}
                    </span>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleRemoveRecibido(index)}
                    >
                      ❌
                    </button>
                  </li>
                ))}
              </ul>
              <button
                className="btn btn-outline-success my-2"
                onClick={() => setShowModalRecibido(true)}
                disabled={devueltos.length === 0}
              >
                + Agregar Recibido
              </button>
            </div>
          </div>

          <select
            className="form-select w-25"
            value={tventaSeleccionada}
            onChange={(e) => setTventaSeleccionada(e.target.value)}
          >
            <option value="" disables>
              Tipo Venta
            </option>
            {tiposVentas?.map((tv) => (
              <option key={tv.id_tipo} value={tv.id_tipo}>
                {tv.tipoVenta}{' '}
              </option>
            ))}
          </select>

          {/* Resumen de diferencia */}
          <div
            className={`d-flex alert ${
              diferencia < 0
                ? 'alert-warning'
                : diferencia > 0
                ? 'alert-success'
                : 'alert-info'
            }`}
          >
            <div className="w-25">
              <h5>Diferencia</h5>

              <div>
                Total Devuelto: $
                {calcularTotal(devueltos).toLocaleString('es-AR')}
                <br />
                Total Recibido: $
                {calcularTotal(recibidos).toLocaleString('es-AR')}
                <br />
                <strong>
                  {diferencia > 0
                    ? `Cliente debe abonar $${diferencia.toLocaleString(
                        'es-AR'
                      )}`
                    : diferencia < 0
                    ? `Devolver $${Math.abs(diferencia).toLocaleString(
                        'es-AR'
                      )} al cliente`
                    : 'Cambio parejo'}
                </strong>
              </div>
            </div>

            <div className="w-50">
              <label>Observaciones</label>
              <textarea
                className="form-control"
                maxLength={200}
                value={observaciones}
                onChange={(e) => setObservaciones(e.target.value)}
              />
              <small className="text-muted">{observaciones.length}/200</small>
            </div>
          </div>

          {/* Botones finales */}
          <div className="d-flex justify-content-end gap-3">
            <button className="btn btn-secondary" onClick={cancelar}>
              Cancelar
            </button>
            <button className="btn btn-success" onClick={handleConfirmarCambio}>
              Confirmar Cambio
            </button>
          </div>
        </div>
      </div>

      {/* Modal de selección de producto recibido */}

      {showModalRecibido && (
        <ModalSeleccionProducto
          onClose={() => setShowModalRecibido(false)}
          onConfirm={handleAgregarRecibido}
        />
      )}

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        transition={Slide}
      />
    </>
  );
};

export default CambioProducto;
