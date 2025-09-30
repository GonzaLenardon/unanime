import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const ModalDetalleCompra = ({ showModalDetalles, handleClose, compra }) => {
  if (!compra) return null; // Evita renderizar si no hay datos

  return (
    <Modal
      show={showModalDetalles}
      onHide={handleClose}
      size="xl"
      centered
      backdrop={false} // 👈 No oscurece el fondo nuevamente
      keyboard={false}
      dialogClassName="modal-superpuesto" // 👈 Clase para elevar el z-index
    >
      <Modal.Header closeButton className="bg-info text-dark">
        <Modal.Title>Detalles de Compra xxx</Modal.Title>
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
            {new Date(compra.fecha).toLocaleString()}
          </p>
          <p>
            <strong>Nro. Compra:</strong> {compra.id_compra}
          </p>
          <p>
            <strong>Total Compra:</strong> $ {compra.monto.toFixed(2)}
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
              {compra.detalles.map((detalle, idx) => (
                <tr key={detalle.id_detalleventa}>
                  <td>{idx + 1}</td>
                  <td>
                    {detalle.producto.nombre} - {detalle.producto.marca} -{' '}
                    {detalle.producto.modelo} - {detalle.producto.talle} -{' '}
                    {detalle.producto.color} -{' '}
                    <strong> {detalle.producto.codigo}</strong>
                  </td>
                  <td>{detalle.cantidad}</td>
                  <td>$ {detalle.costo.toFixed(2)}</td>
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

export default ModalDetalleCompra;
