import { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import ModalComprasProducto from './ModalDetalleCompra';
import { useNavigate } from 'react-router-dom';
import { ventasProducto } from '../api/listados';

import Spinner from './spinner';
import { delVenta, detallesVentas } from '../api/ventas';
import ModalDetalleVenta from './ModalDetalleVenta';
import { ModalDel } from './ModalDel';
import { useGestion } from '../context/UserContext';
import { useAuth } from '../context/AuthContext';

const ModalVentas = ({
  showModalVentas,
  handleCloseVentas,
  ventas,
  setVentas,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [ventaSeleccionada, setVentaSeleccionada] = useState(null);
  const [ventaABorrar, setVentaABorrar] = useState(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { fetchProductos } = useGestion();
  const { isAdmin } = useAuth();
  const navigator = useNavigate();

  /* const handleCloseDetalles = () => setShowModal(false);
   */
  if (!ventas) return null;
  console.log('dddddddddddddddd', ventas);
  const idProducto = ventas[0]?.id_producto;

  const fetchDetallesVenta = async (id) => {
    setMsg('Busando venta ... ');
    setLoading(true);
    try {
      const resp = await detallesVentas(id);
      console.log('Detalle Ventas ... ', resp);
      setVentaSeleccionada(resp);
      setShowModal(true);
    } catch (error) {
      console.error('Error al obtener detalles de la compra:', error);
    } finally {
      setLoading(false);
      setMsg('');
    }
  };

  const handleDeleteVenta = async (id) => {
    try {
      setMsg('Borrando venta ...');
      setLoading(true);
      setShowDeleteModal(false);
      const resp = await delVenta(id);
      setMsg(resp.mensaje);

      await new Promise((resolve) => setTimeout(resolve, 2000));

      const updated = await ventasProducto(idProducto); // <-- vuelvo a consultar
      setVentas(updated.data); // <-- actualizo el estado en el componente padre

      fetchProductos();

      setVentaSeleccionada(null);

      setLoading(false);
      setMsg();
    } catch (error) {
      console.error('Error al eliminar venta:', error);
      setMsg(error.message);

      await new Promise((resolve) => setTimeout(resolve, 3000));
      setLoading(false);
    }
  };

  const handleCloseDetalles = async () => {
    setShowModal(false);
    setVentaSeleccionada();
  };

  const handleModalDel = (e, venta) => {
    e.preventDefault(); // evita el menú por defecto del navegador
    setVentaABorrar(venta);
    setShowDeleteModal(true);
    console.log('hososoossososo');
  };

  return (
    <>
      <Modal
        show={showModalVentas}
        onHide={handleCloseVentas}
        size="xl"
        backdrop="static"
        keyboard={false}
        dialogClassName="modal-detalles-compra"
      >
        <Modal.Header closeButton className="bg-success text-white">
          <Modal.Title className="fs-3 fw-bold">
            Ventas del Producto
          </Modal.Title>
        </Modal.Header>

        <Modal.Body className="p-4 ">
          {ventas?.length > 0 ? (
            <>
              {/* Info del producto */}
              <div className="mb-4">
                <h4 className="fw-bold text-primary mb-1">
                  {ventas[0].producto.nombre}
                </h4>
                <p className="text-muted mb-0">
                  {ventas[0].producto.marca} / {ventas[0].producto.talle} /
                  {'  '}
                  {ventas[0].producto.modelo}
                </p>
              </div>

              {/* Tabla de compras */}
              <div className="table-responsive">
                <table className="table table-sm table-bordered table-hover table-striped align-middle">
                  <thead className="table-secondary">
                    <tr>
                      <th>Fecha</th>
                      <th className="text-center">Numero</th>
                      <th className="text-center">Cant.</th>
                      <th className="text-center">Precio</th>
                      <th className="text-center">Detalles</th>
                      {isAdmin && <th className="text-center">Borrar</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {ventas.map((detalle, idx) => (
                      <tr key={`${detalle.id_detalleventa}-${idx}`}>
                        <td>
                          {new Date(detalle.venta.fecha).toLocaleDateString(
                            'es-AR'
                          )}
                        </td>
                        <td className="text-center">{detalle.id_venta}</td>
                        <td className="text-center">{detalle.cantidad}</td>

                        <td className="text-center">
                          $ {detalle.total.toFixed(2)}
                        </td>

                        <td className="text-center">
                          <Button
                            size="sm"
                            variant="success"
                            onClick={() => fetchDetallesVenta(detalle.id_venta)}
                          >
                            🔍 Detelles
                          </Button>
                        </td>

                        {isAdmin && (
                          <td className="text-center">
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={(e) => handleModalDel(e, detalle)}
                            >
                              <span className="d-none d-sm-inline">
                                🗑️ Borrar
                              </span>
                            </button>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <p className="text-muted">
              No hay compras registradas para este producto.
            </p>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseVentas}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>

      <ModalDetalleVenta
        showModalDetalles={showModal}
        handleClose={handleCloseDetalles}
        venta={ventaSeleccionada}
      />

      <ModalDel
        ventaSeleccionada={ventaABorrar}
        showDeleteModal={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onDelete={handleDeleteVenta}
        tipoTransaccion="venta"
      />

      <Spinner loading={loading} msg={msg} />
    </>
  );
};

export default ModalVentas;
