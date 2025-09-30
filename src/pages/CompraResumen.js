import { React, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { comprasDesdeHasta, delCompra } from '../api/compras';
import Spinner from '../components/spinner';
import { ModalDel } from '../components/ModalDel';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ModalDetalleCompra from '../components/ModalDetalleCompra';

export const CompraResumen = () => {
  const [fecha, setFecha] = useState({ desde: '', hasta: '' });
  const [showModalInfo, setShowModalInfo] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(false);
  const [data, setData] = useState([]);
  const [compraSeleccionada, setCompraSeleccionada] = useState(null);
  const [showModalDelete, setShowDeleteModal] = useState(false);
  const navigator = useNavigate();

  const handleFechas = (e) => {
    const { name, value } = e.target;
    console.log('desdehasta', name, value);
    setFecha((prev) => ({ ...prev, [name]: value }));
  };

  const search = async () => {
    if (fecha.desde > fecha.hasta) {
      setShowModalInfo(true);
      return;
    }
    setLoading(true);
    await fetchResumen();
    setLoading(false);
  };

  const handleCloseInfo = () => {
    setShowModalInfo(false);
  };
  const handleClose = () => {
    setShowModal(false);
  };

  const fetchResumen = async () => {
    setLoading(true);
    try {
      const res = await comprasDesdeHasta({
        desde: fecha.desde,
        hasta: fecha.hasta,
      });
      setData(res.data);
      console.log('data', res);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const formatedFecha = (fechaString) => {
    const [fecha, hora] = fechaString.split('T');
    const fHora = hora.slice(0, 5);
    return fHora;
  };

  const handleShow = (compra) => {
    console.log('sssss', compra);
    setCompraSeleccionada(compra);
    setShowModal(true);
  };

  const handleModalDel = (e, venta) => {
    e.preventDefault(); // evita el menú por defecto del navegador
    setCompraSeleccionada(venta);
    setShowDeleteModal(true);
    console.log('hososoossososo');
  };

  const handleDeleteCompra = async (id) => {
    try {
      setMsg('Borrando compra');
      setLoading(true);
      setShowDeleteModal(false);

      const update = await delCompra(id);
      setMsg(update.mensaje);

      await new Promise((resolve) => {
        setTimeout(resolve, 2000);
      });

      await fetchResumen();

      setCompraSeleccionada(null);
      setLoading(false);
      setMsg();
    } catch (error) {
      console.error('Error al eliminar venta:', error);
      setMsg(error.message);

      await new Promise((resolve) => {
        setTimeout(resolve, 3000);
      });

      setLoading(false);
    }
  };

  return (
    <>
      <div className="py-1">
        <div className="contenedorSeccion1">
          <p className=" m-0 ml" style={{ fontSize: '24px' }}>
            🗒️{' '}
          </p>
          <p className="tituloSeccion">Listado de Compras</p>
        </div>

        <div className="d-flex flex-wrap align-items-center justify-content-evenly gap-3 myNavBar">
          <div className="d-flex align-items-center gap-2">
            <label className="text-dark mb-0 fw-bold">Fecha Desde</label>
            <input
              type="date"
              className="form-control"
              style={{ width: '200px' }}
              name="desde"
              value={fecha.desde}
              onChange={handleFechas}
            />
          </div>

          <div className="d-flex align-items-center gap-2">
            <label className="text-dark mb-0 fw-bold">Fecha Hasta</label>
            <input
              type="date"
              className="form-control"
              style={{ width: '200px' }}
              name="hasta"
              value={fecha.hasta}
              onChange={handleFechas}
            />
          </div>

          <div>
            <button className="btn btn-primary btn-md px-5" onClick={search}>
              Buscar 🔍
            </button>
          </div>
        </div>

        <div
          className="col-12  d-flex flex-column mt-2"
          style={{ maxHeight: '72vh' }}
        >
          {data.length > 0 && (
            /*    <div className="m-md-2 overflow-auto" style={{ flex: 1 }}>
              <table className="table table-success table-striped table-sm table-hover mt-2 "> */

            <div className="container-tabla">
              <table className="table  table-hover">
                <thead /* className="sticky-header" */>
                  <tr>
                    <th>Fecha</th>
                    <th className="d-none d-md-table-cell">Hora</th>
                    <th className="d-none d-md-table-cell">Nro</th>
                    <th>Proveedor</th>
                    <th>Total</th>
                    <th>
                      <span className="d-none d-md-inline"> Detalles</span>
                    </th>
                    <th>
                      <span className="d-none d-md-inline"> Borrar</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((compra, index) => (
                    <tr
                      key={index}
                      style={{
                        cursor: 'pointer',
                      }}
                    >
                      <td>
                        {new Date(compra.fecha).toLocaleDateString('es-AR', {
                          timeZone: 'UTC',
                        })}
                      </td>
                      {/*  <td>{compra.fecha}</td> */}
                      <td className="d-none d-md-table-cell">
                        {formatedFecha(compra.fecha)}
                      </td>
                      <td className="d-none d-md-table-cell">
                        {compra.id_compra}
                      </td>
                      <td>{compra.proveedor.nombre}</td>
                      <td>$ {compra.monto.toFixed(2)}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-primary"
                          onClick={() => handleShow(compra)}
                        >
                          <span className="d-none d-sm-inline">Detalles</span>
                          🔎
                        </button>
                      </td>

                      <td>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={(e) => handleModalDel(e, compra)}
                        >
                          <span className="d-none d-sm-inline">Borrar</span>
                          🗑️
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <Modal
        show={showModalInfo}
        onHide={handleCloseInfo}
        centered
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton className="bg-warning">
          <Modal.Title className="text-dark fs-5">Atención</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center fs-6">
          La fecha <strong>Desde</strong> debe ser menor que la fecha{' '}
          <strong>Hasta</strong>.
        </Modal.Body>
        <Modal.Footer className="justify-content-center">
          <Button variant="primary" onClick={handleCloseInfo}>
            Entendido
          </Button>
        </Modal.Footer>
      </Modal>

      <Spinner loading={loading} msg={msg} />

      <ModalDetalleCompra
        showModalDetalles={showModal}
        handleClose={handleClose}
        compra={compraSeleccionada}
      />

      <ModalDel
        ventaSeleccionada={compraSeleccionada}
        showDeleteModal={showModalDelete}
        onClose={() => setShowDeleteModal(false)}
        onDelete={handleDeleteCompra}
        tipoTransaccion="compra"
      />
    </>
  );
};
