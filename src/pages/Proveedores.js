import React, { useEffect, useState } from 'react';
import {
  addProveedor,
  allProveedores,
  updateProveedores,
} from '../api/proveedor';
import Spinner from '../components/spinner';
import { Modal, Button } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';

const Proveedores = () => {
  const [proveedor, setProveedor] = useState([]);
  const [modal, setModal] = useState(false);
  const [nuevoProveedor, setNuevoProveedor] = useState({});
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState();
  const [isEdition, setIsEdition] = useState(false);
  const isAdmin = localStorage.getItem('admin');

  const inputs = [
    { nombre: 'nombre', label: 'Nombre' },
    { nombre: 'direccion', label: 'Dirección' },
    { nombre: 'telefono', label: 'Teléfono' },
    { nombre: 'email', label: 'Email' },
    { nombre: 'contacto', label: 'Contacto' },
  ];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await fetchProveedor();
      setLoading(false);
    };
    fetchData();
  }, []);

  const fetchProveedor = async () => {
    try {
      const resp = await allProveedores();
      setProveedor(resp);
    } catch (error) {
      console.error('Error al obtener proveedores:', error.message);
    }
  };

  const modalNew = () => {
    setModal(!modal);
    if (!modal) {
      setNuevoProveedor({});
      setIsEdition(false);
    }
  };

  const insertarProveedor = async () => {
    try {
      setMsg('Insertando Proveedor ...');
      setLoading(true);
      await addProveedor(nuevoProveedor);
      await fetchProveedor();
    } catch (error) {
      console.error('Error al insertar proveedor:', error.message);
    } finally {
      modalNew();

      setLoading(false);
    }
  };

  const updateProveedor = async () => {
    try {
      setMsg('Actualizando Proveedor ...');
      setLoading(true);
      await updateProveedores(nuevoProveedor);
      await fetchProveedor();
    } catch (error) {
      console.error('Error al actualizar proveedor:', error.message);
    } finally {
      modalNew();
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setNuevoProveedor((prev) => ({ ...prev, [id]: value }));
    console.log('MMMMM ', nuevoProveedor);
  };

  useEffect(() => {
    console.log('XXXXXXXXXXX .. ', nuevoProveedor);
  }, [nuevoProveedor]);

  const handleUpdate = (proveedor) => {
    const { createdAt, updatedAt, ...data } = proveedor;
    setNuevoProveedor(data);
    setIsEdition(true);
    setModal(true);
  };

  return (
    <>
      <div className="container-fluid p-1">
        <div className="contenedorSeccion">
          <p className=" m-0 ml" style={{ fontSize: '24px' }}>
            {' '}
            🚚{' '}
          </p>
          <p className="tituloSeccion">Proveedores</p>

          <div
            className={`d-flex flex-grow-1 ms-3 ${
              isAdmin ? 'justify-content-between' : 'justify-content-end'
            }`}
          >
            {isAdmin && (
              <button
                type="button"
                className="btn btn-success btn-ms d-flex align-items-center gap-2"
                onClick={modalNew}
              >
                <span className="d-none d-sm-inline">Nuevo</span>
                <i className="bi bi-plus-circle"></i>
              </button>
            )}
          </div>
        </div>

        <div className="container-tabla">
          {/*  <table className="table table-success table-bordered table-striped table-hover table-sm mb-0 mt-0"> */}
          <table className="table  table-hover">
            <thead /* className="sticky-header" */>
              <tr>
                <th scope="col">Nombre</th>
                <th scope="col" className="d-none d-md-table-cell">
                  Dirección
                </th>
                <th scope="col">Teléfono</th>
                <th scope="col" className="d-none d-md-table-cell">
                  Email
                </th>
                <th scope="col">Contacto</th>

                {isAdmin && <th scope="col">Actualizar</th>}
              </tr>
            </thead>
            <tbody>
              {proveedor.map((p, index) => (
                <tr key={index} style={{ cursor: 'pointer' }}>
                  <td>{p.nombre}</td>
                  <td className="d-none d-md-table-cell">{p.direccion}</td>
                  <td>{p.telefono}</td>
                  <td className="d-none d-md-table-cell">{p.email}</td>
                  <td>{p.contacto}</td>

                  {isAdmin && (
                    <td className="d-none d-md-table-cell">
                      <button
                        className="btn btn-sm btn-primary "
                        style={{ width: '80px' }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUpdate(p);
                        }}
                      >
                        Actualizar
                      </button>
                    </td>
                  )}
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
              onHide={modalNew}
              size="md"
              backdrop="static"
              keyboard={false}
            >
              <Modal.Header closeButton className="bg-info">
                <Modal.Title>
                  {' '}
                  {isEdition ? 'Actualizar Proveedor' : 'Nuevo Proveedor'}
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                {inputs.map((input, index) => (
                  <div className="py-1 fw-bold" key={index}>
                    <label>{input.label}</label>
                    <input
                      className="form-control rounded"
                      type="text"
                      id={input.nombre}
                      placeholder={`Ingrese su ${input.label.toLowerCase()}`}
                      value={nuevoProveedor[input.nombre] || ''}
                      onChange={handleInputChange}
                    />
                  </div>
                ))}
              </Modal.Body>

              <Modal.Footer className="justify-content-center">
                <Button
                  variant="success"
                  className="btn-lg w-50"
                  onClick={isEdition ? updateProveedor : insertarProveedor}
                >
                  {isEdition ? 'Actualizar      ✅' : 'Aceptar    ✅'}
                </Button>
              </Modal.Footer>
            </Modal>
          </>
        )}
      </div>

      <Spinner loading={loading} msg={msg} />
    </>
  );
};

export default Proveedores;
