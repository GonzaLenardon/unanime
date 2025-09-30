import { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import ModalComprasProducto from './ModalDetalleCompra';
/* import { delCompra, detalleCompras } from '../api/compras'; */
import { detalleCompras, delCompra } from '../api/compras';
import Spinner from './spinner';
import { ModalDel } from './ModalDel';
import { comprasProducto } from '../api/listados';
import { useGestion } from '../context/UserContext';
import { useAuth } from '../context/AuthContext';

const ModalCompras = ({
  showModalDetalles,
  handleClose,
  compras,
  setCompras,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [compraSeleccionada, setCompraSeleccionada] = useState(null);
  const [compraABorrar, setCompraABorrar] = useState(null);

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(false);
  const [showModalDelete, setShowDeleteModal] = useState(false);
  const { fetchProductos } = useGestion();

  const { isAdmin } = useAuth();

  const handleCloseDetalles = () => setShowModal(false);

  const fetchVerFactura = async (id) => {
    setMsg('Busando compra .. ');
    setLoading(true);
    try {
      const resp = await detalleCompras(id);
      setCompraSeleccionada(resp);
      setShowModal(true);
    } catch (error) {
      console.error('Error al obtener detalles de la compra:', error);
    } finally {
      setLoading(false);
      setMsg('');
    }
  };

  console.log('comprita ... ', compras);

  const idProducto = compras[0]?.producto_id;

  const handleModalDel = (e, venta) => {
    console.log('detalles ', venta);
    e.preventDefault(); // evita el menú por defecto del navegador
    setCompraABorrar(venta);
    setShowDeleteModal(true);
  };

  const handleDeleteCompra = async (id) => {
    try {
      setMsg('Borrando compra');
      setLoading(true);
      setShowDeleteModal(false);
      const resp = await delCompra(id);

      setMsg(resp.mensaje);
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const update = await comprasProducto(idProducto);
      setCompras(update.data);

      fetchProductos();

      console.log('respuesta borrando compra', resp);
      setCompraSeleccionada(null);
      setLoading(false);
      setMsg();
    } catch (err) {
      console.error('Error al eliminar venta:', err.message);
      setMsg(err.message);
      await new Promise((resolve) => setTimeout(resolve, 3000));

      setLoading(false);
    }
  };

  return (
    <>
      <Modal
        show={showModalDetalles}
        onHide={handleClose}
        size="xl"
        backdrop="static"
        keyboard={false}
        dialogClassName="modal-detalles-compra"
      >
        <Modal.Header closeButton className="bg-info text-dark">
          <Modal.Title className="fw-bold fs-3">
            Compras del Producto
          </Modal.Title>
        </Modal.Header>

        <Modal.Body className="p-4 ">
          {compras?.length > 0 ? (
            <>
              {/* Info del producto */}
              <div className="mb-4">
                <h4 className="fw-bold text-primary mb-1">
                  {compras[0].producto.nombre}
                </h4>
                <p className="text-muted mb-0">
                  {compras[0].producto.marca} / {compras[0].producto.talle} /{' '}
                  {compras[0].producto.modelo}
                </p>
              </div>

              {/* Tabla de compras */}
              <div className="table-responsive">
                <table className="table table-sm table-bordered table-hover table-striped align-middle">
                  <thead className="table-secondary">
                    <tr>
                      <th>Fecha</th>
                      <th className="text-center">Numero</th>

                      <th className="text-center">Proveedor</th>
                      <th className="text-center">Cant.</th>
                      <th className="text-center">Costo</th>
                      <th className="text-center">Vto.</th>
                      <th className="text-center">Compra</th>
                      {isAdmin && <th className="text-center">Borrar</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {compras.map((detalle, idx) => (
                      <tr key={`${detalle.compra_id}-${idx}`}>
                        <td>
                          {new Date(detalle.compra.fecha).toLocaleDateString(
                            'es-AR'
                          )}
                        </td>
                        <td className="text-center">{detalle.compra_id}</td>
                        <td className="text-center">
                          {detalle.compra.proveedor.nombre}
                        </td>
                        <td className="text-center">{detalle.cantidad}</td>
                        <td className="text-center">
                          $ {detalle.costo.toFixed(2)}
                        </td>
                        <td className="text-center">
                          {new Date(detalle.vencimiento).toLocaleDateString(
                            'es-AR'
                          )}
                        </td>
                        <td className="text-center">
                          <Button
                            size="sm"
                            variant="primary"
                            onClick={() => fetchVerFactura(detalle.compra_id)}
                          >
                            🔍 Detalles
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
          <Button variant="secondary" onClick={handleClose}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>

      <ModalComprasProducto
        showModalDetalles={showModal}
        handleClose={handleCloseDetalles}
        compra={compraSeleccionada}
      />

      <Spinner loading={loading} msg={msg} />

      <ModalDel
        ventaSeleccionada={compraABorrar}
        showDeleteModal={showModalDelete}
        onClose={() => setShowDeleteModal(false)}
        onDelete={handleDeleteCompra}
        tipoTransaccion="compra"
      />
    </>
  );
};

export default ModalCompras;
