import React, { useState, useEffect } from 'react';
import Spinner from '../components/spinner';
import { addTipoVentas, allTipoVentas, upTipoVentas } from '../api/tipoVentas';
import { tipoVenta } from '../api/ventas';
import { Modal, Button } from 'react-bootstrap';
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
/* import './ProductEntryForm.css'; // si querés estilos personalizados */

export const TipoVentas = () => {
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState();
  const [tipoVentas, setTipoVentas] = useState([]);
  const [modal, setModal] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [newTipo, setNewTipo] = useState({});

  useEffect(() => {
    fetchTipoVenta();
  }, []);

  const fetchTipoVenta = async () => {
    try {
      setLoading(true);
      console.log('dddddddddddddddddd');
      const resp = await allTipoVentas();
      console.log('tipoVenas ', resp);
      setTipoVentas(resp);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const fetchAddTipoVenta = async () => {
    if (!newTipo.tipoVenta) return alert('Debe ingresar un tipo de venta');
    const tipo = cleanAndCapitalizeTipo();
    try {
      setLoading(true);
      const resp = await addTipoVentas(tipo);
      setMsg(resp.message);
    } catch (error) {
      setMsg('Error al registrar tipo de ventas');
    } finally {
      await new Promise((resolve) => setTimeout(resolve, 3000));
      setLoading(false);

      await fetchTipoVenta();
      modalNewClose();
    }
  };

  const fetchUpTipoVenta = async () => {
    if (!validarTipoVenta()) return;
    const tipo = cleanAndCapitalizeTipo();

    try {
      setLoading(true);
      const resp = await upTipoVentas(tipo);
      setMsg(resp.message);
    } catch (error) {
      setMsg(error.message);
    } finally {
      await new Promise((resolve) => setTimeout(resolve, 3000));
      setLoading(false);
      setMsg('');
      await fetchTipoVenta();
      modalNewClose();
    }
  };

  const cleanAndCapitalizeTipo = () => {
    if (!newTipo?.tipoVenta) return newTipo;

    const textoLimpio = newTipo.tipoVenta
      .trim()
      .toLowerCase()
      .replace(/\s+/g, ' ') // reemplaza múltiples espacios por uno solo
      .replace(/^./, (c) => c.toUpperCase());

    return {
      ...newTipo,
      tipoVenta: textoLimpio,
    };
  };

  const validarTipoVenta = () => {
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
  };

  const modalNew = (item) => {
    console.log('ITMES ', item);
    const { id_tipo, tipoVenta, porcentajeVenta, habilitado } = item;
    setNewTipo({ id_tipo, tipoVenta, porcentajeVenta, habilitado });
    setIsUpdate(true);
    setModal(true);
  };

  const handleNew = async () => {
    setNewTipo({
      tipoVenta: '',
      porcentajeVenta: 0,
      habilitado: false,
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
    const { name, value, type } = e.target;
    console.log(' yyyyyyy ', name, value, type);
    setNewTipo((prev) => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value,
    }));
  };

  return (
    <div className="container-fluid p-1">
      <div className="contenedorSeccion">
        <p className=" m-0 ml" style={{ fontSize: '24px' }}>
          {' '}
          🛠️{' '}
        </p>
        <p className="tituloSeccion">Tipo Ventas </p>

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

      <div className="container-sm">
        <table className="table table-hover">
          <thead>
            <tr>
              <th>Tipo Venta</th>
              <th>Descuento</th>
              <th>Habilitado</th>
              <th>Actualizar</th>
            </tr>
          </thead>
          <tbody>
            {tipoVentas.map((item) => (
              <tr
                key={item.id_tipo}
                style={{ cursor: 'pointer' }}
                onClick={() => modalNew(item)}
              >
                <td>{item.tipoVenta}</td>
                <td>{item.porcentajeVenta}%</td>
                <td>{item.habilitado.toString()}</td>
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
                {isUpdate ? 'Actualizar Tipo Ventas' : 'Nuevo Tipo Ventas'}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="py-1 fw-bold">
                <label>Tipo de Venta</label>
                <input
                  className="form-control rounded"
                  name="tipoVenta"
                  type="text"
                  value={newTipo?.tipoVenta || ''}
                  onChange={(e) => handleChange(e)}
                />
              </div>
              <div className="py-1 fw-bold">
                <label>Porcentaje</label>
                <input
                  className="form-control rounded"
                  name="porcentajeVenta"
                  type="number"
                  value={newTipo?.porcentajeVenta || 0}
                  onChange={(e) => handleChange(e)}
                />
              </div>

              <div className="py-1 fw-bold bg-info d-flex align-items-center justify-content-center gap-3 my-3 py-2 rounded">
                <label className="mb-0">Habilitado</label>
                <input
                  className="form-check-input"
                  name="habilitado"
                  type="checkbox"
                  checked={!!newTipo?.habilitado}
                  onChange={(e) =>
                    setNewTipo((prev) => ({
                      ...prev,
                      habilitado: e.target.checked,
                    }))
                  }
                />
              </div>
            </Modal.Body>

            <Modal.Footer className="justify-content-center">
              <Button
                variant="success"
                className="btn-lg w-50"
                onClick={isUpdate ? fetchUpTipoVenta : fetchAddTipoVenta}
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
