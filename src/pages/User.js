import { useEffect, useState } from 'react';
import { addUser, allUsuarios, upUser } from '../api/allUsuarios';
import { allSucursal } from '../api/sucursales';
import { Modal, Button, Toast } from 'react-bootstrap';
import Spinner from '../components/spinner';
import { ToastContainer, Slide, toast } from 'react-toastify';

const User = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [sucursal, setSucursal] = useState({});
  const [modal, setModal] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [newUser, SetNewUser] = useState({});
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAllUser();
    fetchSucursales();
  }, []);

  const fetchAllUser = async () => {
    try {
      const resp = await allUsuarios();
      setUsuarios(resp);
      console.log('Usuarios ', resp);
    } catch (error) {}
  };

  const fetchSucursales = async () => {
    try {
      console.log('dddddddddddddddddd');
      const resp = await allSucursal();
      console.log('Sucursales ', resp);
      setSucursal(resp);
    } catch (error) {
    } finally {
    }
  };

  const updateUser = async () => {
    try {
      if (!validarCampos()) return;

      setLoading(true);
      setModal(false);
      const resp = await upUser(newUser);
      setMsg(resp.message);
    } catch (error) {
      setMsg(error.message);
    } finally {
      await new Promise((resolve) => setTimeout(resolve, 3000));
      setLoading(false);
      setMsg('');
      fetchAllUser();
    }
  };

  const insertUser = async () => {
    try {
      if (!validarCampos()) return; // 👈 Agregá esto
      setLoading(true);
      setModal(false);
      const resp = await addUser(newUser);
      setMsg(resp.message);
    } catch (error) {
      console.log('User', error.mensaje);
      setMsg(error.message);
    } finally {
      await new Promise((resolve) => setTimeout(resolve, 3000));
      setLoading(false);
      setMsg('');
      fetchAllUser();
    }
  };

  const modalUpUser = (item) => {
    console.log('ITMES ', item);
    const { id_usuario, rol, nombre, id_sucursal } = item;
    SetNewUser({ id_usuario, rol, nombre, id_sucursal });
    setIsUpdate(true);
    setModal(true);
  };

  const modalNewUser = () => {
    SetNewUser({ nombre: '', rol: '', id_sucursal: null }); // 👈 default limpio
    setIsUpdate(false);
    setModal(true);
  };

  const handleUser = async (e) => {
    const { name, value } = e.target;
    console.log('newUser', name, value);
    SetNewUser((prev) => ({ ...prev, [name]: value }));
  };

  const modalClose = () => {
    setModal(false);
    SetNewUser({});
  };

  const validarCampos = () => {
    console.log('que valido', newUser);
    for (const campo of Object.values(newUser)) {
      if (
        campo === undefined ||
        campo === null ||
        (typeof campo === 'string' && campo.trim() === '')
      ) {
        toast.error('Completar todos los campos');
        return false;
      }
    }

    return true; // ✅ Agregá esto para asegurar que retorne true si todo está OK
  };

  return (
    <div className="py-1">
      <div className="contenedorSeccion">
        <p className=" m-0 ml" style={{ fontSize: '24px' }}>
          {' '}
          👤{' '}
        </p>
        <p className="tituloSeccion">Usuarios</p>

        <div className="d-flex flex-grow-1 justify-content-star ms-3">
          <button
            type="button"
            className="btn btn-success btn-ms d-flex align-items-center gap-2"
            onClick={() => modalNewUser()}
          >
            <span className="d-none d-sm-inline">Nuevo</span>
            <i className="bi bi-plus-circle"></i>
          </button>
        </div>
      </div>

      <div>
        <div className="container-sm">
          <table className="table table-hover">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Rol</th>
                <th>Sucursal</th>
                <th>Actualizar</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((item) => (
                <tr
                  key={item.id_tipo}
                  style={{ cursor: 'pointer' }}
                  /*   onClick={() => modalNew(item)} */
                >
                  <td>{item.nombre}</td>
                  <td>{item.rol}</td>
                  <td>{item.sucursal.nombre}</td>
                  <td className="d-none d-md-table-cell">
                    <button
                      className="btn btn-sm btn-primary "
                      style={{ width: '80px' }}
                      onClick={(e) => {
                        e.stopPropagation();
                        modalUpUser(item);
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
      </div>

      <Spinner loading={loading} msg={msg} />

      {modal && (
        <>
          <div className="container-padre"></div>
          <Modal
            show={modal}
            onHide={modalClose}
            size="md"
            backdrop="static"
            keyboard={false}
          >
            <Modal.Header closeButton className="bg-info ">
              <Modal.Title>
                {' '}
                {isUpdate ? 'Actualizar Usuario' : 'Nuevo Usuario'}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body className="modal-body-custom">
              <div className="py-1 fw-bold">
                <label>Nombre</label>
                <input
                  className="form-control rounded"
                  name="nombre"
                  type="text"
                  value={newUser?.nombre || ''}
                  onChange={(e) => handleUser(e)}
                />
              </div>

              <div className="py-1 fw-bold">
                <label>Rol</label>
                <select
                  className="form-select w-50"
                  name="rol"
                  value={newUser?.rol || ''}
                  onChange={(e) => handleUser(e)}
                >
                  <option value="" disabled>
                    Tipo Empleado
                  </option>

                  <option key="admin" value="supervisor">
                    Administrador
                  </option>
                  <option key="operador" value="operador">
                    Operador
                  </option>
                </select>
              </div>

              <div className="py-1 fw-bold">
                <label>Sucursal</label>
                <select
                  className="form-select w-50"
                  name="id_sucursal"
                  value={newUser?.id_sucursal || ''}
                  onChange={(e) => handleUser(e)}
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
              </div>
            </Modal.Body>

            <Modal.Footer className="justify-content-center">
              <Button
                variant="success"
                className="btn-lg w-50"
                onClick={isUpdate ? updateUser : insertUser}
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
    </div>
  );
};

export default User;
