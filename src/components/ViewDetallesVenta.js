import React from 'react';
import { Modal, Button } from 'react-bootstrap';

export const ViewDetallesVenta = ({
  showModal,
  handleClose,
  ventaSeleccionada,
}) => {
  console.log('first', ventaSeleccionada);

  const formatedFecha = (fechaString) => {
    const [fecha, hora] = fechaString.split('T');
    const fHora = hora.slice(0, 5);
    return fHora;
  };

  return (
    <div>
      <Modal
        show={showModal}
        onHide={handleClose}
        size="xl"
        backdrop="static"
        keyboard={false}
        style={
          ventaSeleccionada?.ventacambio === null
            ? { marginTop: '150px' }
            : { marginTop: '10px' }
        }
      >
        <Modal.Header closeButton className="bg-info">
          <Modal.Title>Detalles de Venta</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {ventaSeleccionada && (
            <>
              <div className="d-flex">
                <div className="w-50">
                  <p className="w-50">
                    <strong>Fecha de Venta:</strong>{' '}
                    {new Date(ventaSeleccionada.fecha).toLocaleDateString(
                      'es-AR',
                      {
                        timeZone: 'UTC',
                      },
                    )}{' '}
                    - {formatedFecha(ventaSeleccionada.fecha)} Hs
                  </p>

                  <p className="w-50">
                    <strong>Tipo Venta:</strong>{' '}
                    {ventaSeleccionada.tipoVenta.tipoVenta}
                  </p>
                </div>

                <p className="text-end pe-3 fw-bold  w-50">
                  Nro. {ventaSeleccionada.id_venta}
                </p>
              </div>

              {ventaSeleccionada.detalles[0].id_producto === null ? (
                <h2>Venta registrada por Devolucion</h2>
              ) : (
                <>
                  <table className="table table-bordered table-striped">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Producto</th>
                        <th>Cantidad</th>
                        <th>Total Detalle</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ventaSeleccionada.detalles.map((detalle, idx) => (
                        <tr key={detalle.id_detalleventa}>
                          <td>{idx + 1}</td>
                          <td>
                            {detalle.producto.nombre} - {detalle.producto.marca}{' '}
                            - {detalle.producto.modelo} -{' '}
                            {detalle.producto.talle} - {detalle.producto.color}{' '}
                            - <strong>{detalle.producto.codigo}</strong>
                          </td>
                          <td>{detalle.cantidad}</td>
                          <td>${detalle.total}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {ventaSeleccionada.ventacambio && (
                    <>
                      <p>
                        <strong>Cambio de producto</strong>
                      </p>

                      <table className="table table-bordered table-striped">
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>Producto</th>
                            <th>Tipo</th>
                            <th>Cantidad</th>
                            <th>Total Detalle</th>
                          </tr>
                        </thead>
                        <tbody>
                          {ventaSeleccionada.ventacambio.cambiodetalles.map(
                            (detalle, idx) => (
                              <tr key={detalle.id_detalleventa}>
                                <td>{idx + 1}</td>
                                <td>{detalle.detallecambioproducto.nombre}</td>
                                <td>{detalle.tipo}</td>
                                <td>{detalle.cantidad}</td>
                                <td>${detalle.precio_unitario}</td>
                              </tr>
                            ),
                          )}
                        </tbody>
                      </table>
                    </>
                  )}
                </>
              )}
              <p className="text-end m-3">
                <strong>Total Venta:</strong> $ {ventaSeleccionada?.total}
              </p>
              {ventaSeleccionada.ventacambio && (
                <div className="text-end m-3">
                  <p>
                    <strong>Diferencia por cambio:</strong> $
                    {ventaSeleccionada.diferenciaCambio}
                  </p>
                  <p>
                    <strong>Total Final:</strong> $
                    {ventaSeleccionada.totalFinal}
                  </p>

                  <p>
                    <strong>
                      Diferencia de Pago registrado en Nro Recibo :
                    </strong>{' '}
                    {ventaSeleccionada.ventacambio.id_venta_diferencia}
                  </p>
                </div>
              )}
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
