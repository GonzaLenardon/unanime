import React, { useState, useEffect } from 'react';
import Spinner from '../components/spinner';

import { Modal, Button } from 'react-bootstrap';
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { addTipoGastos, allTipoGastos, upTipoGastos } from '../api/tipoGasto';
/* import './ProductEntryForm.css'; // si querés estilos personalizados */

export const TipoGastos = () => {
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState();
  const [tipoGasto, setTipoGasto] = useState([]);
  const [modal, setModal] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [newTipo, setNewTipo] = useState({});

  useEffect(() => {
    fetchTipoGastos();
  }, []);

  const fetchTipoGastos = async () => {
    try {
      setLoading(true);
      console.log('dddddddddddddddddd');
      const resp = await allTipoGastos();
      console.log('tipoGastos ', resp);
      setTipoGasto(resp);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const fetchAddTipoGastos = async () => {
    if (!newTipo.tipoGasto) {
      toast.error(`Debe ingresar un tipo de Gastos`);

      return;
    }

    const tipo = cleanAndCapitalizeTipo();
    try {
      setLoading(true);
      const resp = await addTipoGastos(tipo);
      setMsg(resp.message);
    } catch (error) {
      setMsg('Error al registrar tipo de ventas');
    } finally {
      await new Promise((resolve) => setTimeout(resolve, 3000));
      setLoading(false);
      setMsg('');
      await fetchTipoGastos();
      modalNewClose();
    }
  };

  const fetchUpTipoVenta = async () => {
    if (!newTipo.tipoGasto) {
      toast.error(`Debe ingresar un tipo de Gastos`);
      return;
    }

    const tipo = cleanAndCapitalizeTipo();

    try {
      setLoading(true);
      const resp = await upTipoGastos(tipo);
      setMsg(resp.message);
    } catch (error) {
      setMsg(error.message);
    } finally {
      await new Promise((resolve) => setTimeout(resolve, 3000));
      setLoading(false);
      setMsg('');
      await fetchTipoGastos();
      modalNewClose();
    }
  };

  const cleanAndCapitalizeTipo = () => {
    if (!newTipo?.tipoGasto) return newTipo;

    const textoLimpio = newTipo.tipoGasto
      .trim()
      .toLowerCase()
      .replace(/\s+/g, ' ') // reemplaza múltiples espacios por uno solo
      .replace(/^./, (c) => c.toUpperCase());

    return {
      ...newTipo,
      tipoGasto: textoLimpio,
    };
  };

  /*  const validarTipoVenta = () => {
    if (
      !newTipo.tipoVenta ||
      newTipo.tipoVenta.toString().trim() === '' ||
      newTipo.porcentajeVenta === undefined ||
      newTipo.porcentajeVenta === null ||
      newTipo.porcentajeVenta.toString().trim() === ''
    ) {
      toast.error('Todos los campos son obligatorios.');
      return false;
    }

    if (isNaN(Number(newTipo.porcentajeVenta))) {
      toast.error('El porcentaje debe ser un número válido.');
      return false;
    }

    if (newTipo.porcentajeVenta < 0) {
      toast.error('El porcentaje debe ser mayor o igual a 0.');
      return false;
    }

    const existe = tipoVentas.find(
      (tv) =>
        tv.tipoVenta.trim().toLowerCase() ===
          newTipo.tipoVenta.trim().toLowerCase() &&
        Number(tv.porcentajeVenta) === Number(newTipo.porcentajeVenta) &&
        tv.id_tipo !== newTipo.id_tipo // importante para permitir editar
    );

    if (existe) {
      toast.error('Ya existe otro tipo de venta con esos datos.');
      return false;
    }

    return true;
  }; */

  const modalNew = (item) => {
    console.log('ITMES ', item);
    const { id_tipogasto, tipoGasto } = item;
    setNewTipo({ id_tipogasto, tipoGasto });
    setIsUpdate(true);
    setModal(true);
  };

  const handleNew = async () => {
    setNewTipo({
      tipoGasto: '',
    });
    setIsUpdate(false);
    setModal(true);
  };

  const modalNewClose = () => {
    setModal(false);
    setNewTipo({});
  };

  useEffect(() => {
    console.log('newTipo', newTipo);
  }, [newTipo]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(' yyyyyyy ', name, value);
    setNewTipo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="container-fluid p-1">
      <div className="contenedorSeccion">
        <p className=" m-0 ml" style={{ fontSize: '24px' }}>
          {' '}
          🛠️{' '}
        </p>
        <p className="tituloSeccion">Tipo Gastos</p>

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

      <div className="container w-50">
        <table className="table  table-hover">
          <thead>
            <tr>
              <th>Tipo Gastos</th>
              <th>Actualizar</th>
            </tr>
          </thead>
          <tbody>
            {tipoGasto.map((item) => (
              <tr
                key={item.id_tipo}
                style={{ cursor: 'pointer' }}
                onClick={() => modalNew(item)}
              >
                <td>{item.tipoGasto}</td>

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
            <Modal.Header closeButton className="bg-info">
              <Modal.Title>
                {' '}
                {isUpdate ? 'Actualizar Tipo Gastos' : 'Nuevo Tipo Gastos'}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="py-1 fw-bold">
                <label>Tipo de Gastos</label>
                <input
                  className="form-control rounded"
                  name="tipoGasto"
                  type="text"
                  value={newTipo?.tipoGasto || ''}
                  onChange={(e) => handleChange(e)}
                />
              </div>
            </Modal.Body>

            <Modal.Footer className="justify-content-center">
              <Button
                variant="success"
                className="btn-lg w-50"
                onClick={isUpdate ? fetchUpTipoVenta : fetchAddTipoGastos}
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
