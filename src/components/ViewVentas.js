import { React, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import Spinner from './spinner';
import { ModalDel } from './ModalDel';
import { delVenta } from '../api/ventas';
import { ViewDetallesVenta } from './ViewDetallesVenta';
import { useAuth } from '../context/AuthContext';

export const ViewVentas = ({
  detalleVentas,
  fetchProductos,
  fetchResumen,
  fetchVentas,
  /* titulo, */
}) => {
  const [ventaSeleccionada, setVentaSeleccionada] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [ventaABorrar, setVentaABorrar] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const { isAdmin } = useAuth();

  /*  const nombresTipoArray = [
    { id: 1, nombre: 'CONTADO', color: '#FF6B6B' }, // Rojo coral suave
    { id: 2, nombre: 'TARJETA', color: '#4ECDC4' }, // Turquesa claro
    { id: 3, nombre: 'DEBITO', color: '#FFD93D' }, // Amarillo vibrante
    { id: 4, nombre: 'MPAGO', color: '#1A535C' }, // Azul petróleo oscuro
    { id: 5, nombre: 'TRANSF.', color: '#FF9F1C' }, // Naranja cálido
    { id: 6, nombre: 'DESC. 10', color: '#2E86AB' }, // Azul cielo profundo
    { id: 7, nombre: 'OTROS1', color: '#6A4C93' }, // Púrpura suave
    { id: 8, nombre: 'OTROS2', color: '#F25F5C' }, // Salmón
    { id: 9, nombre: 'OTROS3', color: '#247BA0' }, // Azul medio
    { id: 10, nombre: 'OTROS4', color: '#70C1B3' }, // Verde agua
  ]; */

  const handleShow = (venta) => {
    setVentaSeleccionada(venta);
    console.log('Esta es la venta seleccionada ... ', venta);
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setVentaSeleccionada(null);
  };

  const formatedFecha = (fechaString) => {
    const [fecha, hora] = fechaString.split('T');
    const fHora = hora.slice(0, 5);
    return fHora;
  };

  const handleModalDel = (e, venta) => {
    e.preventDefault(); // evita el menú por defecto del navegador
    setVentaABorrar(venta);
    setShowDeleteModal(true);
    console.log('hososoossososo');
  };

  const handleDeleteVenta = async (id) => {
    console.log('IdVentasAboorar', id);
    try {
      setMsg('Borrando venta ...');
      setLoading(true);
      setShowDeleteModal(false);
      const resp = await delVenta(id);
      setMsg(resp.mensaje);

      await new Promise((resolve) => setTimeout(resolve, 3000));
      console.log('Paso x aca');
      await fetchProductos();
      await fetchResumen();
      await fetchVentas();

      setVentaSeleccionada(null);
    } catch (error) {
      console.error('Error al eliminar venta:', error);
      setMsg(error.message);

      await new Promise((resolve) => setTimeout(resolve, 3000));
    } finally {
      setLoading(false);
      setMsg();
    }
  };

  return (
    <>
      {showModal && <div className="container-padre"></div>}

      <div className="d-flex flex-column" style={{ height: '70vh' }}>
        <div className="mt-2 overflow-auto" style={{ flex: 1 }}>
          <table className="table table-success table-striped table-sm table-hover mt-2 ">
            <thead className={!showModal ? 'sticky-header' : ''}>
              <tr>
                <th>Fecha</th>
                <th>Hora</th>
                <th>Sucursal</th>
                <th>Nro</th>
                <th>Tipo</th>
                <th className="text-center">Cambio</th>
                <th className="text-center">Total</th>
                {isAdmin ? <th>Borrar</th> : null}
                <th>
                  <span className="d-none d-md-inline"> Detalles</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {detalleVentas.map((venta, index) => {
                /*  const tipoInfo = nombresTipoArray.find(
                  (t) => t.id === venta.id_tipo_venta
                ); */

                return (
                  <tr key={index} style={{ cursor: 'pointer' }}>
                    <td>
                      {new Date(venta.fecha).toLocaleDateString('es-AR', {
                        timeZone: 'UTC',
                      })}
                    </td>
                    <td>{formatedFecha(venta.fecha)}</td>
                    <td className="text-center">{venta.sucursal?.nombre}</td>
                    <td className="text-center">{venta.id_venta}</td>
                    <td> {venta.tipoVenta.tipoVenta ?? 'Desconocido'} </td>
                    <td className="text-center">
                      {venta.ventacambio ? 'Si' : null}
                    </td>

                    <td className="text-start ps-3 ">
                      $ {venta.totalFinal.toFixed(2)}
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-primary"
                        onClick={() => handleShow(venta)}
                      >
                        <span className="d-none d-sm-inline">Detalles</span>
                        🔎
                      </button>
                    </td>
                    {isAdmin ? (
                      <td>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={(e) => handleModalDel(e, venta)}
                        >
                          <span className="d-none d-sm-inline">Borrar</span>
                          🗑️
                        </button>
                      </td>
                    ) : null}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <ViewDetallesVenta
        showModal={showModal}
        handleClose={handleClose}
        ventaSeleccionada={ventaSeleccionada}
      />

      <Spinner loading={loading} msg={msg} />

      <ModalDel
        ventaSeleccionada={ventaABorrar}
        showDeleteModal={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onDelete={handleDeleteVenta}
        tipoTransaccion="venta"
      />
    </>
  );
};
