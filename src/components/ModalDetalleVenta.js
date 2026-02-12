import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const ModalDetalleVenta = ({ showModalDetalles, handleClose, venta }) => {
  if (!venta) return null; // Evita renderizar si no hay datos

  console.log('ventas', venta);

  return (
    <Modal
      show={showModalDetalles}
      onHide={handleClose}
      size="lg"
      centered
      backdrop={false} // 👈 No oscurece el fondo nuevamente
      keyboard={false}
      dialogClassName="modal-superpuesto" // 👈 Clase para elevar el z-index
    >
      <Modal.Header closeButton className="bg-success text-white">
        <Modal.Title>Detalles de Ventas</Modal.Title>
      </Modal.Header>
      <Modal.Body
        style={{
          overflowY: 'auto',
          maxHeight: '60vh',
          backgroundColor: '#E8F5DA',
        }}
      >
        <>
          <p>
            <strong>Fecha de Compra:</strong>{' '}
            {new Date(venta.fecha).toLocaleString()}
          </p>
          <p>
            <strong>Nro. Venta:</strong> {venta.id_venta}
          </p>
          <p>
            <strong>Total Venta:</strong> $ {venta?.total.toFixed(2)}
          </p>

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
              {venta.detalles.map((detalle, idx) => (
                <tr key={detalle.id_detalleventa}>
                  <td>{idx + 1}</td>
                  <td>{detalle.producto.nombre}</td>

                  <td>{detalle.cantidad}</td>
                  <td>$ {detalle.total.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      </Modal.Body>
      <Modal.Footer style={{ backgroundColor: '#E8F5DA' }}>
        <Button variant="secondary" onClick={handleClose}>
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalDetalleVenta;
