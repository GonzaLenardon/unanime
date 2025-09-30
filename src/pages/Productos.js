import React, { useEffect, useState, useRef } from 'react';
import { allproductos, addProductos, upProductos } from '../api/productos';
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Spinner from '../components/spinner';
import { useGestion } from '../context/UserContext';
import { Modal, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { auth } from '../api/allUsuarios';
import { useAuth } from '../context/AuthContext';
import ModalDetalles from '../components/ModalDetalles';
import { comprasProducto } from '../api/listados';
import ModalTransferencia from '../components/ModalTransferencia';
import ImprimirProd from '../components/ImprimirProd';
import { ImprimirEtiquetas } from '../components/ImprimirEtiquetas';

const Productos = () => {
  const [modal, setModal] = useState(false);
  const [nuevoProducto, setNuevoProducto] = useState({});
  const [isEdition, setIsedition] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { productos, fetchProductos } = useGestion();
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(false);
  const [showModalDetalles, setShowModalDetalles] = useState(false);
  const [comprasProd, setComprasProd] = useState([]);
  const [modalIntercambio, setModalIntercambio] = useState(false);
  const [productoStock, setProductoStock] = useState({});
  const inputRef = useRef(null);

  const { user, isAdmin } = useAuth();

  const navigator = useNavigate();

  const prod = [
    { nombre: 'nombre', label: 'Nombre', tipo: 'string' },
    { nombre: 'codigo', label: 'Codigo', tipo: 'string' },
    { nombre: 'marca', label: 'Marca', tipo: 'string' },
    { nombre: 'modelo', label: 'Modelo', tipo: 'string' },
    { nombre: 'talle', label: 'Talle', tipo: 'string' },
    { nombre: 'color', label: 'Color', tipo: 'string' },
    { nombre: 'costo', label: 'Costo', tipo: 'number' },
    { nombre: 'porcentaje', label: 'Porcentaje', tipo: 'number' },
    { nombre: 'observaciones', label: 'Observaciones', tipo: 'string' },
    { nombre: 'precio_venta', label: 'Precio', tipo: 'number' },
  ];

  const validarProducto = () => {
    console.log('nuevo producto', nuevoProducto);
    for (const campo of prod) {
      let valor = nuevoProducto[campo.nombre];

      if (campo.nombre === 'observaciones' && (!valor || valor.trim() === '')) {
        nuevoProducto[campo.nombre] = 'Sin observaciones';
        valor = 'Sin observaciones';
      }

      // Validar campos vacíos
      if (
        valor === undefined ||
        valor === null ||
        valor.toString().trim() === ''
      ) {
        toast.error(`El campo "${campo.label}" está vacío.`);
        return false;
      }

      // Validar números
      if (campo.tipo === 'number' && isNaN(Number(valor))) {
        toast.error(`El campo "${campo.label}" debe ser un número válido.`);
        return false;
      }
    }

    const newProducto = toTitleCase(nuevoProducto);
    console.log('productos', productos);
    console.log('nuevoProducto ...', newProducto);

    const existe = productos.find(
      (prod) =>
        prod.nombre === newProducto.nombre &&
        prod.codigo === newProducto.codigo &&
        prod.marca === newProducto.marca &&
        prod.modelo === newProducto.modelo &&
        prod.color === newProducto.color &&
        prod.talle === newProducto.talle &&
        prod.id_producto !== newProducto.id_producto
    );
    console.log('existe ... ', existe);
    if (existe) {
      toast.error('Ya existe otro producto con esos mismos datos.');
      return false;
    }

    return true;
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!user) {
      navigator('/');
      return; // ⛔ importante: evita que siga ejecutando fetchData
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        await fetchProductos();
        console.log('Productos', productos);
      } catch (error) {
        setMsg(error.message || 'Error al obtener productos');
        console.log('Error desde productos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const addProducto = async () => {
    if (!validarProducto()) {
      return;
    }

    try {
      setMsg('Agregando Producto');
      setLoading(true);
      const resp = await addProductos(toTitleCase(nuevoProducto));
      console.log('respuesta de newProductos', resp);
      await fetchProductos();
    } catch (error) {
      console.error('Error al insertar Producto:', error.message);
      setMsg(error.message);
      await new Promise((resolve) => setTimeout(resolve, 3000));
    } finally {
      setNuevoProducto({});
      setLoading(false);
      modalNew();
    }
  };

  const updateProducto = async () => {
    if (!validarProducto()) {
      /*   toast.error('Por favor, completá todos los campos requeridos.'); */
      return;
    }
    try {
      setMsg('Actualizando Producto');
      setLoading(true);
      const resp = await upProductos(toTitleCase(nuevoProducto));
      console.log('respuesta de update Productos', resp);
      await fetchProductos();
      setNuevoProducto({});
      setLoading(false);
    } catch (error) {
      console.error('Error al actualizar Productos:', error.message);
      setMsg(error.message);
      await new Promise((resolve) => setTimeout(resolve, 3000));
    } finally {
      setNuevoProducto({});
      setLoading(false);
      modalNew();
    }
  };
  const handleProducto = (e) => {
    const { id, value } = e.target;

    setNuevoProducto((prev) => {
      const actualizado = {
        ...prev,
        [id]: value,
      };

      const costo = parseFloat(actualizado.costo) || 0;
      const porcentaje = parseFloat(actualizado.porcentaje) || 0;

      if (id === 'costo' || id === 'porcentaje') {
        const precio = costo + (costo * porcentaje) / 100;
        actualizado.precio_venta = precio.toFixed(2);
      }

      // Este return faltaba
      return actualizado;
    });
  };

  const toTitleCase = (prod) => {
    const nuevoProd = { ...prod };

    ['nombre', 'marca', 'modelo', 'talle', 'color'].forEach((campo) => {
      if (nuevoProd[campo]) {
        nuevoProd[campo] = nuevoProd[campo]
          .trim()
          .toLowerCase()
          .split(' ')
          .filter((word) => word.trim() !== '')
          .map((word) => word[0].toUpperCase() + word.slice(1))
          .join(' ');
      }
    });

    return nuevoProd;
  };

  const modalNew = () => {
    setModal(!modal);
    setNuevoProducto({});
    setIsedition(false);
  };

  const handleUpdate = (producto) => {
    console.log('resto .. ', producto);
    const { createdAt, updatedAt, ...resto } = producto;
    setIsedition(true);
    setNuevoProducto(resto);
    setModal(true);
  };

  /*   const productosFiltrados = productos.filter(
    (p) =>
      p.codigo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.marca?.toLowerCase().includes(searchTerm.toLowerCase())
  );
 */
  const productosFiltrados = productos.filter((p) => {
    const textoCompleto =
      `${p.nombre} ${p.marca} ${p.modelo} ${p.talle} ${p.color} ${p.codigo}`
        .toLowerCase()
        .replace(/\s+/g, ''); // Quitamos espacios para búsquedas como "buzocanguromarcaf"

    const termino = searchTerm.toLowerCase().replace(/\s+/g, '');

    return textoCompleto.includes(termino);
  });

  const handleDetalles = async (idProd) => {
    try {
      setMsg('Buscando compras ...');
      setLoading(true);
      const resp = await comprasProducto(idProd);
      setComprasProd(resp.data);
      setShowModalDetalles(true);
    } catch (error) {
      console.error(
        'Error al consultar las compras del Productos:',
        error.message
      );
    } finally {
      setLoading(false);
      setMsg();
    }
  };

  const handleIntercambioStock = async (e) => {
    setProductoStock(e);
    setModalIntercambio(true);
  };

  const handleCloseModalDetalles = (p) => {
    setShowModalDetalles(false);
    setComprasProd([]);
  };

  const handleImprimir = (prod) => {
    console.log(prod);
  };

  return (
    <div className="container-fluid p-1">
      <div className="contenedorSeccion1">
        <p className=" m-0" style={{ fontSize: '24px' }}>
          📦{' '}
        </p>

        <p className="tituloSeccion">Productos</p>
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

          {/*    <ListadoConCodigos productos={productosFiltrados} /> */}

          <div className="d-flex me-5 ">
            {/*  <ImprimirProd
              productos={productosFiltrados}
              label={'Imprimir listado Productos'}
              all={true}
            /> */}

            <ImprimirEtiquetas productos={productosFiltrados} />
          </div>
        </div>
      </div>

      {/* Campo de búsqueda por código */}
      <div className="card-body myNavBar mb-3">
        <div className="d-flex flex-wrap align-items-end gap-3">
          <div className="d-flex flex-column flex-md-row w-100 justify-content-center align-items-center gap-1 gap-md-5 p-2">
            <label className="fs-5 fs-md-3 fw-bold mb-2 mb-md-0">
              Buscar Producto
            </label>
            <input
              ref={inputRef}
              type="text"
              className="form-control"
              style={{ height: '50px', width: '100%', maxWidth: '500px' }}
              placeholder="Buscar por nombre + marca + modelo + talle + color"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <button
              type="button"
              className="btn btn-primary btn-ms d-flex align-items-center gap-2"
              onClick={() => {
                setSearchTerm('');
                inputRef.current?.focus();
              }}
            >
              <i className="bi bi-x-circle"></i>
              Limpiar
            </button>
            <div className="text-white ">
              {`Total de Productos : ${productosFiltrados.length} / ${productos.length}`}
            </div>
          </div>
        </div>
      </div>
      <div className="container-tabla">
        <table className="table  table-hover">
          <thead class="table-light">
            <tr>
              <th scope="col" className="d-md-table-cell">
                Nombre
              </th>
              <th scope="col" className="d-md-table-cell">
                Marca
              </th>
              <th scope="col" className="d-md-table-cell">
                Modelo
              </th>
              <th scope="col" className="d-md-table-cell">
                Talle
              </th>

              <th scope="col" className="d-none d-md-table-cell">
                Color
              </th>
              <th scope="col" className="d-none d-md-table-cell">
                Precio
              </th>

              <th scope="col" className="d-none d-md-table-cell">
                Brown
              </th>
              <th scope="col" className="d-none d-md-table-cell">
                Cervantes
              </th>
              <th scope="col" className="d-none d-md-table-cell">
                Crespo
              </th>

              {isAdmin && (
                <>
                  <th scope="col" className="d-none d-md-table-cell">
                    Actualizar
                  </th>

                  <th scope="col" className="d-none d-md-table-cell">
                    Intercambiar
                  </th>
                </>
              )}
              <th scope="col" className="d-none d-md-table-cell">
                Imprimir
              </th>
            </tr>
          </thead>
          <tbody>
            {productosFiltrados.map((p, index) => (
              <tr
                key={index}
                /*  onClick={() => handleUpdate(p)} */
                style={{ cursor: 'pointer' }}
              >
                <td className="d-md-table-cell">{p.nombre}</td>
                <td className="d-md-table-cell">{p.marca}</td>
                <td className="d-md-table-cell">{p.modelo}</td>
                <td className="d-md-table-cell">{p.talle}</td>
                <td className="d-none d-md-table-cell">{p.color}</td>
                <td className="d-none d-md-table-cell">{p.precio_venta}</td>
                <td className="d-none d-md-table-cell text-center">
                  {p.stock_por_sucursal[0]?.stock_total || 0}
                </td>
                <td className="d-none d-md-table-cell text-center">
                  {p.stock_por_sucursal[1]?.stock_total || 0}
                </td>
                <td className="d-none d-md-table-cell text-center">
                  {p.stock_por_sucursal[2]?.stock_total || 0}
                </td>

                {isAdmin && (
                  <>
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

                    <td className="d-none d-md-table-cell">
                      <button
                        className="btn btn-sm btn-success"
                        style={{ width: '80px' }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleIntercambioStock(p);
                        }}
                      >
                        Stock
                      </button>
                    </td>
                  </>
                )}

                <td className="d-none d-md-table-cell">
                  <ImprimirProd
                    productos={[p]}
                    label={'Imprimir'}
                    all={false}
                  />
                  {/* <ListadoPorProducto productos={[p]} /> */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Modal */}
      {modal && (
        <>
          <div className="container-padre"></div>
          <Modal
            show={modal}
            onHide={modalNew}
            size="lg"
            backdrop="static"
            keyboard={false}
          >
            <Modal.Header closeButton className="bg-info">
              <Modal.Title>
                {isEdition ? 'Actualizar Producto' : 'Cargar nuevo Producto'}
              </Modal.Title>
            </Modal.Header>

            <Modal.Body>
              <div className="d-flex flex-wrap gap-3 justify-content-between">
                {prod.map((p, index) => (
                  <div
                    key={index}
                    className="form-floating"
                    style={{ width: '48%' }}
                  >
                    <input
                      className="form-control form-control-sm fs-5 fw-bold"
                      type="text"
                      id={p.nombre}
                      placeholder={p.label}
                      readOnly={p.nombre === 'precio_venta'}
                      value={
                        p.nombre === 'precio_venta'
                          ? nuevoProducto.costo && nuevoProducto.porcentaje
                            ? (
                                nuevoProducto.costo *
                                (1 + nuevoProducto.porcentaje / 100)
                              ).toFixed(2)
                            : ''
                          : nuevoProducto[p.nombre] || ''
                      }
                      onChange={(e) => handleProducto(e)}
                    />
                    <label htmlFor={p.nombre}>{p.label}</label>
                  </div>
                ))}
              </div>
            </Modal.Body>

            <Modal.Footer className="justify-content-center">
              <Button
                variant="success"
                className="btn-lg w-50"
                onClick={isEdition ? updateProducto : addProducto}
              >
                {isEdition ? 'Actualizar ✅' : 'Aceptar ✅'}
              </Button>
            </Modal.Footer>
          </Modal>
        </>
      )}

      <Spinner loading={loading} msg={msg} />

      {modalIntercambio && (
        <ModalTransferencia
          modalIntercambio={modalIntercambio}
          producto={productoStock}
          onClose={() => setModalIntercambio(false)}
        />
      )}

      <ModalDetalles
        showModalDetalles={showModalDetalles}
        handleClose={handleCloseModalDetalles}
        compras={comprasProd}
      />
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

export default Productos;
