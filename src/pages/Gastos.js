import React, { useState, useEffect } from 'react';
import Spinner from '../components/spinner';

import { Modal, Button } from 'react-bootstrap';
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { addTipoGastos, allTipoGastos, upTipoGastos } from '../api/tipoGasto';
import { addGastos, allGastos, upGastos } from '../api/gastos';
import { allSucursal } from '../api/sucursales';
/* import './ProductEntryForm.css'; // si querés estilos personalizados */

export const Gastos = () => {
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState();
  const [gastos, setGastos] = useState([]);
  const [tipogastos, setTipoGastos] = useState([]);
  const [modal, setModal] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [newGastos, setNewGastos] = useState({});
  const [sucursal, setSucursal] = useState({});

  useEffect(() => {
    fetchGastos();
    fetchTipoGastos();
    /*  fetchSucursales(); */
  }, []);

  const fetchGastos = async () => {
    try {
      setLoading(true);
      console.log('dddddddddddddddddd');
      const resp = await allGastos();
      console.log('tipoGastos ', resp);
      setGastos(resp);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  /*   const fetchSucursales = async () => {
    try {
      setLoading(true);
      console.log('dddddddddddddddddd');
      const resp = await allSucursal();
      console.log('Sucursales ', resp);
      setSucursal(resp);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  }; */

  const fetchTipoGastos = async () => {
    try {
      setLoading(true);
      console.log('dddddddddddddddddd');
      const resp = await allTipoGastos();
      console.log('tipoGastos ', resp);
      setTipoGastos(resp);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const fetchAddGastos = async () => {
    if (!newGastos.id_tipogasto) {
      toast.error(`Debe ingresar un tipo de Gastos`);
      return;
    }

    const tipo = cleanAndCapitalizeTipo();
    console.log('Que recibo de tipo', tipo);

    try {
      setLoading(true);
      const resp = await addGastos(tipo);
      setMsg(resp.message);
      await fetchGastos();

      setTimeout(() => {
        setMsg('');
      }, 10000);
    } catch (error) {
      setMsg('Error al registrar tipo de ventas');
      setTimeout(() => setMsg(''), 3000);
    } finally {
      setMsg('');
      setLoading(false);
      modalNewClose();
    }
  };

  const fetchUpGastos = async () => {
    if (!newGastos.id_tipogasto) {
      toast.error(`Debe ingresar un tipo de Gastos`);
      return;
    }

    const tipo = cleanAndCapitalizeTipo();
    console.log('TIPOOOOSSSSSSSSSSSSSS', tipo);
    try {
      setLoading(true);
      const resp = await upGastos(tipo);
      setMsg(resp.message);
      await fetchGastos();

      setTimeout(() => {
        setMsg('');
      }, 10000);
    } catch (error) {
      setMsg(error.message);
      setTimeout(() => setMsg(''), 3000);
    } finally {
      setMsg('');
      setLoading(false);
      modalNewClose();
    }
  };

  const cleanAndCapitalizeTipo = () => {
    if (!newGastos?.observaciones) return newGastos;

    console.log('llega ', newGastos);

    const textoLimpio = newGastos.observaciones
      .trim()
      .toLowerCase()
      .replace(/\s+/g, ' ') // reemplaza múltiples espacios por uno solo
      .replace(/^./, (c) => c.toUpperCase());

    return {
      ...newGastos,
      observaciones: textoLimpio,
    };
  };

  const modalNew = (item) => {
    console.log('ITMES ', item);
    const { id_gasto, id_sucursal, fecha, id_tipogasto, observaciones, monto } =
      item;
    setNewGastos({
      id_gasto,
      id_sucursal,
      fecha,
      id_tipogasto,
      observaciones,
      monto,
    });
    setIsUpdate(true);
    setModal(true);
  };

  const handleNew = async () => {
    setNewGastos({
      fecha: '',
      id_tipogasto: '',
      observaciones: '',
      monto: '',
    });
    setIsUpdate(false);
    setModal(true);
  };

  const modalNewClose = () => {
    setModal(false);
    setNewGastos({});
  };

  useEffect(() => {
    console.log('newTipo', newGastos);
  }, [newGastos]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(' yyyyyyy ', name, value);
    setNewGastos((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="container-fluid p-1">
      <div className="contenedorSeccion">
        <p className=" m-0" style={{ fontSize: '24px' }}>
          {' '}
          💸
        </p>
        <p className="tituloSeccion">Gastos</p>

        <div className="d-flex flex-grow-1 justify-content-star ms-3">
          <button
            type="button"
            className="btn btn-success btn-ms d-flex align-items-center gap-2"
          >
            <span className="d-none d-sm-inline" onClick={() => handleNew()}>
              Nuevo
            </span>
            <i className="bi bi-plus-circle"></i>
          </button>
        </div>
      </div>

      <div className="container-tabla">
        <table className="table table-hover">
          <thead>
            <tr>
              <th style={{ width: '15%' }}>Fecha</th>
              <th style={{ width: '15%' }}>Sucursal</th>
              <th style={{ width: '15%' }}>Tipo Gasto</th>
              <th style={{ width: '40%' }}>Observaciones</th>
              <th style={{ width: '15%' }}>Monto</th>
              <th style={{ width: '15%' }}>Actualizar</th>
            </tr>
          </thead>
          <tbody>
            {gastos.length > 0 &&
              gastos.map((item) => (
                <tr
                  key={item.id_tipo}
                  style={{ cursor: 'pointer' }}
                  onClick={() => modalNew(item)}
                >
                  <td style={{ width: '15%' }}>
                    {' '}
                    {new Date(item.fecha).toLocaleDateString('es-AR', {
                      timeZone: 'UTC',
                    })}
                  </td>
                  <td style={{ width: '15%' }}>{item.sucursal.nombre}</td>
                  <td style={{ width: '15%' }}>{item.tipogasto.tipoGasto}</td>
                  <td
                    style={{
                      width: '40%',
                      wordBreak: 'break-word',
                      whiteSpace: 'normal',
                    }}
                  >
                    {item.observaciones}
                  </td>
                  <td style={{ width: '15%' }}>$ {item.monto}</td>

                  <td className="d-none d-md-table-cell">
                    <button
                      className="btn btn-sm btn-primary "
                      style={{ width: '80px' }}
                      onClick={(e) => {
                        e.stopPropagation();
                        modalNew(item);
                      }}
                    >
                      Actualizar
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {modal && (
        <>
          <div className="container-padre"></div>
          <Modal
            show={modal}
            onHide={modalNewClose}
            size="md"
            backdrop="static"
            keyboard={false}
          >
            <Modal.Header closeButton className="bg-info ">
              <Modal.Title>
                {' '}
                {isUpdate ? 'Actualizar Gastos' : 'Nuevo Gastos'}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body className="modal-body-custom">
              <div className="py-1 fw-bold">
                <label>Fecha</label>
                <input
                  className="form-control w-50 rounded"
                  name="fecha"
                  type="date"
                  value={newGastos?.fecha ? newGastos.fecha.slice(0, 10) : ''}
                  onChange={(e) => handleChange(e)}
                />
              </div>
              <div className="py-1 fw-bold">
                <label>Tipo</label>
                <select
                  className="form-select w-50"
                  name="id_tipogasto"
                  value={newGastos?.id_tipogasto || ''}
                  onChange={(e) => handleChange(e)}
                >
                  <option value="" disabled>
                    Tipo Venta
                  </option>
                  {tipogastos.map((t) => (
                    <option key={t.id_tipogasto} value={t.id_tipogasto}>
                      {t.tipoGasto}
                    </option>
                  ))}
                </select>
              </div>
              {/*   <div className="py-1 fw-bold">
                <label>Sucursal</label>
                <select
                  className="form-select w-50"
                  name="id_sucursal"
                  value={newGastos?.id_sucursal || ''}
                  onChange={(e) => handleChange(e)}
                >
                  <option value="" disabled>
                    Sucursal
                  </option>
                  {sucursal.map((t) => (
                    <option key={t.id_sucursal} value={t.id_sucursal}>
                      {t.nombre}
                    </option>
                  ))}
                </select>
              </div> */}
              <div className="py-1 fw-bold">
                <label>Observaciones</label>
                <textarea
                  className="form-control rounded"
                  name="observaciones"
                  value={newGastos?.observaciones || ''}
                  onChange={(e) => handleChange(e)}
                />
              </div>
              <div className="py-1 fw-bold">
                <label>Monto</label>
                <input
                  className="form-control rounded"
                  name="monto"
                  type="number"
                  value={newGastos?.monto || ''}
                  onChange={(e) => handleChange(e)}
                />
              </div>
            </Modal.Body>

            <Modal.Footer className="justify-content-center">
              <Button
                variant="success"
                className="btn-lg w-50"
                onClick={isUpdate ? fetchUpGastos : fetchAddGastos}
              >
                {isUpdate ? 'Actualizar      ✅' : 'Aceptar    ✅'}
              </Button>
            </Modal.Footer>
          </Modal>
        </>
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

      <Spinner loading={loading} msg={msg} />
    </div>
  );
};
