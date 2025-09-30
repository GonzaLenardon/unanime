import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const ModalDetalles = ({ showModalDetalles, handleClose, compras }) => {
  return (
    <Modal
      show={showModalDetalles}
      onHide={handleClose}
      size="lg"
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header closeButton className="bg-info">
        <Modal.Title>Compras del Producto</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {compras?.length > 0 ? (
          <div>
            <div className="d-flex align-items-end gap-2 text-primary">
              <p className="fs-1 fw-bold mb-0">{compras[0].producto.nombre}</p>
              <p className="fs-5 fw-semibold mb-2">
                {compras[0].producto.marca} - {compras[0].producto.capacidad}
              </p>
            </div>
            <table className="table table-bordered table-striped">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Proveedor</th>
                  <th>Cantidad</th>
                  <th>Costo</th>
                  <th>Vencimiento</th>
                </tr>
              </thead>
              <tbody>
                {compras.map((detalle, idx) => (
                  <tr key={detalle.compra_id}>
                    <td>
                      {new Date(detalle.compra.fecha).toLocaleDateString(
                        'es-AR',
                        {
                          timeZone: 'UTC',
                        }
                      )}
                    </td>
                    <td>{detalle.compra.proveedor.nombre}</td>
                    <td>{detalle.cantidad}</td>
                    <td>$ {detalle.costo}</td>
                    <td>
                      {' '}
                      {new Date(detalle.vencimiento).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>{' '}
          </div>
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
  );
};

export default ModalDetalles;
