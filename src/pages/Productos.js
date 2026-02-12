import React, { useEffect, useState, useRef } from 'react';
import { allproductos, addProductos, upProductos } from '../api/productos';
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Spinner from '../components/spinner';
import { Modal, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import ModalDetalles from '../components/ModalDetalles';
import { comprasProducto } from '../api/listados';
import ModalTransferencia from '../components/ModalTransferencia';
import ImprimirProd from '../components/ImprimirProd';
import { ImprimirEtiquetas } from '../components/ImprimirEtiquetas';

const Productos = () => {
  const [productos, setProductos] = useState([]);
  const [modal, setModal] = useState(false);
  const [nuevoProducto, setNuevoProducto] = useState({});
  const [isEdition, setIsedition] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(false);
  const [showModalDetalles, setShowModalDetalles] = useState(false);
  const [comprasProd, setComprasProd] = useState([]);
  const [modalIntercambio, setModalIntercambio] = useState(false);
  const [productoStock, setProductoStock] = useState({});
  const inputRef = useRef(null);

  const isAdmin = localStorage.getItem('admin') === 'true';

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
      if (campo.nombre === 'codigo') continue;

      let valor = nuevoProducto[campo.nombre];

      if (campo.nombre === 'observaciones' && (!valor || valor.trim() === '')) {
        nuevoProducto[campo.nombre] = 'Sin observaciones';
        valor = 'Sin observaciones';
      }

      if (
        valor === undefined ||
        valor === null ||
        valor.toString().trim() === ''
      ) {
        toast.error(`El campo "${campo.label}" está vacío.`);
        return false;
      }

      if (campo.tipo === 'number' && isNaN(Number(valor))) {
        toast.error(`El campo "${campo.label}" debe ser un número válido.`);
        return false;
      }
    }

    const newProducto = toTitleCase(nuevoProducto);

    const existe = productos.find(
      (prod) =>
        prod.nombre === newProducto.nombre &&
        prod.codigo === newProducto.codigo &&
        prod.marca === newProducto.marca &&
        prod.modelo === newProducto.modelo &&
        prod.color === newProducto.color &&
        prod.talle === newProducto.talle &&
        prod.id_producto !== newProducto.id_producto,
    );

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
    fetchProductos();
  }, []);

  const fetchProductos = async () => {
    try {
      setLoading(true);
      setMsg('');
      const data = await allproductos();
      console.log('todos los productos', data);
      setProductos(data);
    } catch (error) {
      setMsg(
        error.response?.data?.error ||
          error.message ||
          'Error al obtener productos',
      );
      console.log('Error desde productos:', error);
      setProductos([]);
    } finally {
      setLoading(false);
    }
  };

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

  const productosFiltrados = productos.filter((p) => {
    const textoCompleto =
      `${p.nombre} ${p.marca} ${p.modelo} ${p.talle} ${p.color} ${p.codigo}`
        .toLowerCase()
        .replace(/\s+/g, '');

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
        error.message,
      );
    } finally {
      setLoading(false);
      setMsg();
    }
  };

  const handleCloseModalDetalles = (p) => {
    setShowModalDetalles(false);
    setComprasProd([]);
  };

  const id_sucursal = localStorage.getItem('sucursal_id');

  const estilos =
    id_sucursal === '1'
      ? {
          gradiente: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          colorPrincipal: '#667eea',
          fondoClaro: 'rgba(102, 126, 234, 0.08)',
          border: '#667eea',
        }
      : {
          gradiente: 'linear-gradient(135deg, #f857a6 0%, #ff5858 100%)',
          colorPrincipal: '#f857a6',
          fondoClaro: 'rgba(248, 87, 166, 0.08)',
          border: '#d3ababff',
        };

  return (
    <div className="container-fluid p-3">
      {/* Header */}
      <div className="d-flex align-items-center gap-3 mb-4">
        <div className="d-flex align-items-center gap-3 text-white">
          <div
            className="rounded-circle d-flex align-items-center justify-content-center"
            style={{
              width: '60px',
              height: '60px',
              background: estilos.gradiente,
            }}
          >
            <i className={`bi bi-box-seam fs-4 text-white fs-3`}></i>
          </div>
          <div>
            <h2
              className="mb-0 fw-bold"
              style={{ color: estilos.colorPrincipal }}
            >
              Productos
            </h2>
            <small className="" style={{ color: estilos.colorPrincipal }}>
              Gestiona tu catálogo
            </small>
          </div>
        </div>

        <div className="d-flex align-items-center gap-3">
          {isAdmin && (
            <button
              type="button"
              className="btn btn-light fw-semibold shadow-sm d-flex align-items-center gap-2 text-white"
              onClick={modalNew}
              style={{
                borderRadius: '12px',
                padding: '10px 20px',
                background: estilos.gradiente,
                opacity: 0.75,
              }}
            >
              <i className="bi bi-plus-circle"></i>
              <span className="d-none d-sm-inline">Nuevo Producto</span>
            </button>
          )}
        </div>
      </div>

      {/* Buscador */}
      <div
        className="card border-0 shadow-sm mb-4"
        style={{
          background: estilos.gradiente,
          borderRadius: '15px',
        }}
      >
        <div className="card-body p-4">
          <div className="d-flex flex-column flex-lg-row align-items-center gap-3">
            <div className="d-flex align-items-center gap-3 text-white">
              <div
                className="d-flex align-items-center justify-content-center rounded-circle bg-white bg-opacity-25"
                style={{ width: '50px', height: '50px' }}
              >
                <i className="bi bi-search fs-4 text-white"></i>
              </div>
              <label className="fs-5 fw-bold mb-0 text-nowrap">
                Buscar Producto
              </label>
            </div>

            <div className="flex-grow-1 w-100" style={{ maxWidth: '600px' }}>
              <div className="position-relative">
                <i
                  className="bi bi-search position-absolute text-muted"
                  style={{
                    left: '15px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    fontSize: '1.2rem',
                  }}
                ></i>
                <input
                  ref={inputRef}
                  type="text"
                  className="form-control border-0 shadow-sm ps-5"
                  style={{
                    height: '55px',
                    borderRadius: '50px',
                    fontSize: '1rem',
                    backgroundColor: 'white',
                  }}
                  placeholder="Buscar por nombre, marca, modelo, talle o color..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <button
              type="button"
              className="btn btn-light border-0 shadow-sm d-flex align-items-center gap-2 px-4"
              style={{
                height: '55px',
                borderRadius: '50px',
                fontWeight: '600',
                minWidth: '130px',
              }}
              onClick={() => {
                setSearchTerm('');
                inputRef.current?.focus();
              }}
            >
              <i className="bi bi-x-circle fs-5"></i>
              Limpiar
            </button>

            <div
              className="badge bg-white bg-opacity-25 text-white px-4 py-3 d-flex align-items-center gap-2"
              style={{
                borderRadius: '50px',
                fontSize: '0.95rem',
                fontWeight: '600',
                minWidth: '200px',
                justifyContent: 'center',
              }}
            >
              <i className="bi bi-box-seam"></i>
              <span>
                {productosFiltrados.length} / {productos.length} productos
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* TABLA COMPLETAMENTE REDISEÑADA - LEGIBLE Y CLARA */}
      <div className="card border-0 shadow-sm">
        <div className="card-body p-0">
          <div style={{ overflowX: 'auto' }}>
            <table className="table mb-0" style={{ minWidth: '1400px' }}>
              <thead style={{ backgroundColor: '#f8f9fa' }}>
                <tr>
                  <th
                    className="py-3 px-4 fw-bold"
                    style={{
                      fontSize: '0.85rem',
                      color: '#495057',
                      borderBottom: `3px solid ${estilos.border}`,
                      width: '250px',
                    }}
                  >
                    PRODUCTO
                  </th>
                  <th
                    className="py-3 px-4 fw-bold"
                    style={{
                      fontSize: '0.85rem',
                      color: '#495057',
                      borderBottom: `3px solid ${estilos.border}`,
                      width: '120px',
                    }}
                  >
                    CÓDIGO
                  </th>

                  <th
                    className="py-3 px-4 fw-bold"
                    style={{
                      fontSize: '0.85rem',
                      color: '#495057',
                      borderBottom: `3px solid ${estilos.border}`,
                      width: '180px',
                    }}
                  >
                    MARCA
                  </th>
                  <th
                    className="py-3 px-4 fw-bold"
                    style={{
                      fontSize: '0.85rem',
                      color: '#495057',
                      borderBottom: `3px solid ${estilos.border}`,
                      width: '180px',
                    }}
                  >
                    MODELO
                  </th>
                  <th
                    className="py-3 px-4 fw-bold text-center"
                    style={{
                      fontSize: '0.85rem',
                      color: '#495057',
                      borderBottom: `3px solid ${estilos.border}`,
                      width: '100px',
                    }}
                  >
                    TALLE
                  </th>
                  <th
                    className="py-3 px-4 fw-bold text-center"
                    style={{
                      fontSize: '0.85rem',
                      color: '#495057',
                      borderBottom: `3px solid ${estilos.border}`,
                      width: '120px',
                    }}
                  >
                    COLOR
                  </th>
                  <th
                    className="py-3 px-4 fw-bold text-end"
                    style={{
                      fontSize: '0.85rem',
                      color: '#495057',
                      borderBottom: `3px solid ${estilos.border}`,
                      width: '130px',
                    }}
                  >
                    PRECIO
                  </th>
                  <th
                    className="py-3 px-4 fw-bold text-center"
                    style={{
                      fontSize: '0.85rem',
                      color: '#495057',
                      borderBottom: `3px solid ${estilos.border}`,
                      width: '100px',
                    }}
                  >
                    STOCK
                  </th>
                  {isAdmin && (
                    <th
                      className="py-3 px-4 fw-bold text-center"
                      style={{
                        fontSize: '0.85rem',
                        color: '#495057',
                        borderBottom: `3px solid ${estilos.border}`,
                        width: '220px',
                      }}
                    >
                      ACCIONES
                    </th>
                  )}
                </tr>
              </thead>

              <tbody>
                {productosFiltrados.map((p, index) => (
                  <tr
                    key={index}
                    style={{
                      transition: 'all 0.2s ease',
                      backgroundColor: index % 2 === 0 ? '#ffffff' : '#f8f9fa',
                    }}
                    className="producto-row"
                  >
                    <td
                      className="py-4 px-4"
                      style={{ verticalAlign: 'middle' }}
                    >
                      <span
                        className="text-dark fw-bold"
                        style={{
                          fontSize: '1.2rem',
                          display: 'block',
                          lineHeight: '1.4',
                        }}
                      >
                        {p.nombre}
                      </span>
                    </td>

                    {/* Código */}
                    <td
                      className="py-4 px-4"
                      style={{ verticalAlign: 'middle' }}
                    >
                      <span
                        className="d-inline-block px-3 py-2 rounded fw-bold text-white"
                        style={{
                          fontSize: '0.85rem',
                          background: estilos.gradiente,
                          letterSpacing: '0.5px',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {p.codigo}
                      </span>
                    </td>

                    {/* Nombre */}

                    {/* Marca */}
                    <td
                      className="py-4 px-4"
                      style={{ verticalAlign: 'middle' }}
                    >
                      <span
                        className="text-dark"
                        style={{
                          fontSize: '0.9rem',
                          fontWeight: '500',
                        }}
                      >
                        {p.marca}
                      </span>
                    </td>

                    {/* Modelo */}
                    <td
                      className="py-4 px-4"
                      style={{ verticalAlign: 'middle' }}
                    >
                      <span
                        className="text-muted"
                        style={{
                          fontSize: '0.9rem',
                          fontWeight: '500',
                        }}
                      >
                        {p.modelo}
                      </span>
                    </td>

                    {/* Talle */}
                    <td
                      className="py-4 px-4 text-center"
                      style={{ verticalAlign: 'middle' }}
                    >
                      <span
                        className="d-inline-block px-3 py-2 rounded-pill fw-semibold"
                        style={{
                          fontSize: '0.85rem',
                          backgroundColor: '#e0f2fe',
                          color: '#0369a1',
                          border: '2px solid #bae6fd',
                          minWidth: '60px',
                        }}
                      >
                        {p.talle}
                      </span>
                    </td>

                    {/* Color */}
                    <td
                      className="py-4 px-4 text-center"
                      style={{ verticalAlign: 'middle' }}
                    >
                      <span
                        className="d-inline-block px-3 py-2 rounded-pill fw-semibold"
                        style={{
                          fontSize: '0.85rem',
                          backgroundColor: '#fef3c7',
                          color: '#92400e',
                          border: '2px solid #fde68a',
                          minWidth: '80px',
                        }}
                      >
                        {p.color}
                      </span>
                    </td>

                    {/* Precio */}
                    <td
                      className="py-4 px-4 text-end"
                      style={{ verticalAlign: 'middle' }}
                    >
                      <span
                        className="fw-bold"
                        style={{
                          fontSize: '1.1rem',
                          color: '#059669',
                          fontFamily: 'monospace',
                        }}
                      >
                        ${parseFloat(p.precio_venta).toFixed(2)}
                      </span>
                    </td>

                    {/* Stock */}
                    <td
                      className="py-4 px-4 text-center"
                      style={{ verticalAlign: 'middle' }}
                    >
                      <div
                        className={`d-inline-flex align-items-center justify-content-center rounded-circle fw-bold ${
                          p.stock_total > 10
                            ? 'text-success'
                            : p.stock_total > 0
                              ? 'text-warning'
                              : 'text-danger'
                        }`}
                        style={{
                          width: '50px',
                          height: '50px',
                          fontSize: '1.1rem',
                          backgroundColor:
                            p.stock_total > 10
                              ? '#d1fae5'
                              : p.stock_total > 0
                                ? '#fef3c7'
                                : '#fee2e2',
                          border: `3px solid ${
                            p.stock_total > 10
                              ? '#10b981'
                              : p.stock_total > 0
                                ? '#f59e0b'
                                : '#ef4444'
                          }`,
                        }}
                      >
                        {p.stock_total || 0}
                      </div>
                    </td>

                    {/* Acciones Admin */}
                    {isAdmin && (
                      <td
                        className="py-4 px-4 text-center"
                        style={{ verticalAlign: 'middle' }}
                      >
                        <div className="d-flex gap-2 justify-content-center">
                          <button
                            className="btn btn-outline-primary btn-sm px-3 py-2"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleUpdate(p);
                            }}
                            style={{
                              fontSize: '0.85rem',
                              fontWeight: '600',
                              borderRadius: '8px',
                              minWidth: '85px',
                            }}
                          >
                            <i className="bi bi-pencil-square me-1"></i>
                            Editar
                          </button>

                          <div onClick={(e) => e.stopPropagation()}>
                            <ImprimirProd
                              productos={[p]}
                              label={
                                <span style={{ fontSize: '0.85rem' }}>
                                  <i className="bi bi-printer-fill me-1"></i>
                                  Imprimir
                                </span>
                              }
                              all={false}
                            />
                          </div>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mensaje si no hay productos */}
          {productosFiltrados.length === 0 && !loading && (
            <div className="text-center py-5">
              <i className="bi bi-inbox fs-1 text-muted mb-3 d-block"></i>
              <p className="text-muted fs-5">No se encontraron productos</p>
            </div>
          )}
        </div>
      </div>

      {/* CSS personalizado */}
      <style jsx>{`
        .producto-row:hover {
          background-color: ${estilos.fondoClaro} !important;
          transform: scale(1.005);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          cursor: pointer;
        }

        .form-control:focus {
          box-shadow: 0 0 0 0.25rem rgba(102, 126, 234, 0.25) !important;
          border-color: #667eea !important;
        }

        .btn-outline-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
        }

        .btn-light:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
          transition: all 0.3s ease;
        }
      `}</style>

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
