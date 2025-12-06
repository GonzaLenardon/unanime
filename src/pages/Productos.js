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
  // ✅ AGREGAR ESTE ESTADO
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

  // ✅ CORRECCIÓN: Agregar comillas

  const isAdmin = localStorage.getItem('admin') === 'true'; // Ajusta según tu lógica

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
        prod.id_producto !== newProducto.id_producto
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

  // ✅ CORRECCIÓN: Guardar productos en estado
  const fetchProductos = async () => {
    try {
      setLoading(true);
      setMsg('');
      const data = await allproductos();
      console.log('todos los productos', data);
      setProductos(data); // ✅ CRÍTICO
    } catch (error) {
      setMsg(
        error.response?.data?.error ||
          error.message ||
          'Error al obtener productos'
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
        error.message
      );
    } finally {
      setLoading(false);
      setMsg();
    }
  };

  /*   const handleIntercambioStock = async (e) => {
    setProductoStock(e);
    setModalIntercambio(true);
  }; */

  const handleCloseModalDetalles = (p) => {
    setShowModalDetalles(false);
    setComprasProd([]);
  };

  const id_sucursal = localStorage.getItem('sucursal_id');

  // Definir estilos según sucursal
  const estilos =
    id_sucursal === '1'
      ? {
          // SUCURSAL 1: Estilo Masculino (Púrpura-Azul)
          gradiente: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          colorPrincipal: '#667eea',
          colorSecundario: '#764ba2',
          textoHover: '#667eea',
          nombreTienda: 'Unanime Man',
        }
      : {
          // SUCURSAL 2: Estilo Femenino (Rosa-Coral)
          gradiente: 'linear-gradient(135deg, #f857a6 0%, #ff5858 100%)',
          colorPrincipal: '#e386b3ff',
          colorSecundario: '#ff5858',
          textoHover: '#f857a6',
          nombreTienda: 'Unanime Woman',
        };

  return (
    <div className="container-fluid p-1">
      <div className="contenedorSeccion1">
        <p className="m-0" style={{ fontSize: '24px' }}>
          📦
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

          <div className="d-flex me-5">
            <ImprimirEtiquetas productos={productosFiltrados} />
          </div>
        </div>
      </div>

      <div
        className="card border-0 shadow-sm mb-4"
        style={{
          background: estilos.gradiente,

          borderRadius: '15px',
        }}
      >
        <div className="card-body p-4">
          <div className="d-flex flex-column flex-lg-row align-items-center gap-3">
            {/* Icono y Label */}
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

            {/* Input de búsqueda */}
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

            {/* Botón Limpiar */}
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

            {/* Contador de productos */}
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

      {/* CSS adicional */}
      <style jsx>{`
        .form-control:focus {
          box-shadow: 0 0 0 0.25rem rgba(102, 126, 234, 0.25) !important;
          border-color: #667eea !important;
        }

        .btn-light:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
          transition: all 0.3s ease;
        }

        .btn-light:active {
          transform: translateY(0);
        }
      `}</style>

      {/* 
      <div className="container-tabla">
        <table className="table table-hover">
          <thead className="table-light">
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
                Stock
              </th>

              {isAdmin && (
                <>
                  <th scope="col" className="d-none d-md-table-cell">
                    Actualizar
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
              <tr key={index} style={{ cursor: 'pointer' }}>
                <td className="d-md-table-cell">
                  <div className="d-flex  align-items-center">{p.nombre}</div>
                  <div>
                    <strong>
                      <span style={{ fontSize: '0.8em' }}> {p.codigo} </span>
                    </strong>
                  </div>
                </td>

                <td className="d-md-table-cell">{p.marca}</td>
                <td className="d-md-table-cell">{p.modelo}</td>
                <td className="d-md-table-cell">{p.talle}</td>
                <td className="d-none d-md-table-cell">{p.color}</td>
                <td className="d-none d-md-table-cell">{p.precio_venta}</td>

                <td className="d-none d-md-table-cell text-center">
                  {p.stock_total || 0}
                </td>

                {isAdmin && (
                  <>
                    <td className="d-none d-md-table-cell">
                      <button
                        className="btn btn-sm btn-primary"
                        style={{ width: '80px' }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUpdate(p);
                        }}
                      >
                        Actualizar
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
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div> */}

      {/* <div className="container-tabla">
        <div className="table-responsive">
          <table className="table table-borderless">
            <thead>
              <tr className="border-bottom border-2 border-primary">
                <th
                  scope="col"
                  className="text-uppercase text-muted small fw-bold"
                >
                  <i className="bi bi-box-seam me-2"></i>Producto
                </th>
                <th
                  scope="col"
                  className="text-uppercase text-muted small fw-bold d-none d-lg-table-cell"
                >
                  <i className="bi bi-tag me-2"></i>Detalles
                </th>
                <th
                  scope="col"
                  className="text-uppercase text-muted small fw-bold d-none d-md-table-cell text-end"
                >
                  <i className="bi bi-cash-coin me-2"></i>Precio
                </th>
                <th
                  scope="col"
                  className="text-uppercase text-muted small fw-bold d-none d-md-table-cell text-center"
                >
                  <i className="bi bi-boxes me-2"></i>Stock
                </th>
                {isAdmin && (
                  <th
                    scope="col"
                    className="text-uppercase text-muted small fw-bold d-none d-md-table-cell text-center"
                  >
                    <i className="bi bi-gear me-2"></i>Acciones
                  </th>
                )}
                <th scope="col" className="d-none d-md-table-cell"></th>
              </tr>
            </thead>
            <tbody>
              {productosFiltrados.map((p, index) => (
                <tr
                  key={index}
                  className="border-bottom"
                  style={{
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                  }}
                >
                  <td className="py-3">
                    <div className="d-flex flex-column">
                      <span
                        className="fw-bold text-dark mb-1"
                        style={{ fontSize: '1.05rem' }}
                      >
                        {p.nombre}
                      </span>
                      <div className="d-flex gap-2 flex-wrap align-items-center">
                        <span className="badge rounded-pill bg-dark text-white px-3">
                          {p.codigo}
                        </span>
                        <span className="d-md-none text-muted small">
                          ${p.precio_venta} • Stock: {p.stock_total || 0}
                        </span>
                      </div>
                    </div>
                  </td>

               
                  <td className="py-3 d-none d-lg-table-cell">
                    <div className="d-flex flex-wrap gap-2">
                      <span className="badge bg-primary bg-opacity-10 text-primary border border-primary px-3 py-2">
                        <i className="bi bi-award me-1"></i>
                        {p.marca}
                      </span>
                      <span className="badge bg-secondary bg-opacity-10 text-secondary border border-secondary px-3 py-2">
                        <i className="bi bi-grid me-1"></i>
                        {p.modelo}
                      </span>
                      <span className="badge bg-info bg-opacity-10 text-info border border-info px-3 py-2">
                        <i className="bi bi-rulers me-1"></i>
                        {p.talle}
                      </span>
                      <span className="badge bg-warning bg-opacity-10 text-warning border border-warning px-3 py-2">
                        <i className="bi bi-palette me-1"></i>
                        {p.color}
                      </span>
                    </div>
                  </td>

         
                  <td className="py-3 d-none d-md-table-cell text-end">
                    <div className="fs-5 fw-bold text-success">
                      ${parseFloat(p.precio_venta).toFixed(2)}
                    </div>
                  </td>

       
                  <td className="py-3 d-none d-md-table-cell text-center">
                    <div
                      className={`d-inline-flex align-items-center justify-content-center rounded-circle ${
                        p.stock_total > 10
                          ? 'bg-success bg-opacity-10 text-success border border-success'
                          : p.stock_total > 0
                          ? 'bg-warning bg-opacity-10 text-warning border border-warning'
                          : 'bg-danger bg-opacity-10 text-danger border border-danger'
                      }`}
                      style={{
                        width: '50px',
                        height: '50px',
                        fontSize: '1.1rem',
                        fontWeight: 'bold',
                      }}
                    >
                      {p.stock_total || 0}
                    </div>
                  </td>

              
                  {isAdmin && (
                    <td className="py-3 d-none d-md-table-cell text-center">
                      <div className="d-flex gap-2 justify-content-center">
                        <button
                          className="btn btn-outline-primary btn-sm rounded-pill px-3"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleUpdate(p);
                          }}
                          style={{ minWidth: '90px' }}
                        >
                          <i className="bi bi-pencil me-1"></i>
                          Editar
                        </button>
                      </div>
                    </td>
                  )}

        
                  <td className="py-3 d-none d-md-table-cell text-end">
                    <ImprimirProd
                      productos={[p]}
                      label={
                        <span>
                          <i className="bi bi-printer me-1"></i>
                          Imprimir
                        </span>
                      }
                      all={false}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div> */}

      <div className="container-tabla">
        <div className="table-responsive">
          <table className="table table-borderless">
            <thead>
              <tr className="border-bottom border-2 border-primary">
                <th
                  scope="col"
                  className="text-uppercase text-muted small fw-bold"
                >
                  <i className="bi bi-box-seam me-2"></i>Producto
                </th>
                <th
                  scope="col"
                  className="text-uppercase text-muted small fw-bold d-none d-lg-table-cell"
                >
                  <i className="bi bi-tag me-2"></i>Detalles
                </th>
                <th
                  scope="col"
                  className="text-uppercase text-muted small fw-bold d-none d-md-table-cell text-end"
                >
                  <i className="bi bi-cash-coin me-2"></i>Precio
                </th>
                <th
                  scope="col"
                  className="text-uppercase text-muted small fw-bold d-none d-md-table-cell text-center"
                >
                  <i className="bi bi-boxes me-2"></i>Stock
                </th>
                {isAdmin && (
                  <th
                    scope="col"
                    className="text-uppercase text-muted small fw-bold d-none d-md-table-cell text-center"
                  >
                    <i className="bi bi-gear me-2"></i>Acciones
                  </th>
                )}
                <th scope="col" className="d-none d-md-table-cell"></th>
              </tr>
            </thead>
            <tbody>
              {productosFiltrados.map((p, index) => (
                <tr
                  key={index}
                  className="border-bottom"
                  style={{
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                  }}
                >
                  {/* Columna Principal: Nombre + Código */}
                  <td className="py-3">
                    <div className="d-flex flex-column">
                      <span
                        className="fw-bold text-dark mb-1"
                        style={{ fontSize: '1.05rem' }}
                      >
                        {p.nombre}
                      </span>
                      <div className="d-flex gap-2 flex-wrap align-items-center">
                        <span
                          className="badge rounded-pill bg-dark text-white px-3 py-2"
                          style={{ fontSize: '0.85rem' }}
                        >
                          {p.codigo}
                        </span>
                        <span className="d-md-none text-muted small">
                          ${p.precio_venta} • Stock: {p.stock_total || 0}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Detalles: Marca, Modelo, Talle, Color - MEJORADOS */}
                  <td className="py-3 d-none d-lg-table-cell">
                    <div className="d-flex flex-column gap-2">
                      {/* Marca */}
                      <div className="d-flex align-items-center">
                        <span
                          className="badge bg-primary bg-opacity-10 text-primary border border-primary px-3 py-2"
                          style={{
                            fontSize: '0.95rem',
                            fontWeight: '600',
                            minWidth: '120px',
                          }}
                        >
                          <i className="bi bi-award me-2"></i>
                          {p.marca}
                        </span>
                      </div>

                      {/* Segunda fila: Modelo, Talle, Color */}
                      <div className="d-flex gap-2 flex-wrap">
                        <span
                          className="badge bg-secondary bg-opacity-10 text-secondary border border-secondary px-3 py-2"
                          style={{ fontSize: '0.9rem', fontWeight: '600' }}
                        >
                          <i className="bi bi-grid me-1"></i>
                          {p.modelo}
                        </span>
                        <span
                          className="badge bg-info bg-opacity-10 text-info border border-info px-3 py-2"
                          style={{ fontSize: '0.9rem', fontWeight: '600' }}
                        >
                          <i className="bi bi-rulers me-1"></i>
                          {p.talle}
                        </span>
                        <span
                          className="badge bg-warning bg-opacity-10 text-warning border border-warning px-3 py-2"
                          style={{ fontSize: '0.9rem', fontWeight: '600' }}
                        >
                          <i className="bi bi-palette me-1"></i>
                          {p.color}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Precio */}
                  <td className="py-3 d-none d-md-table-cell text-end">
                    <div className="fs-5 fw-bold text-success">
                      ${parseFloat(p.precio_venta).toFixed(2)}
                    </div>
                  </td>

                  {/* Stock */}
                  <td className="py-3 d-none d-md-table-cell text-center">
                    <div
                      className={`d-inline-flex align-items-center justify-content-center rounded-circle ${
                        p.stock_total > 10
                          ? 'bg-success bg-opacity-10 text-success border border-success'
                          : p.stock_total > 0
                          ? 'bg-warning bg-opacity-10 text-warning border border-warning'
                          : 'bg-danger bg-opacity-10 text-danger border border-danger'
                      }`}
                      style={{
                        width: '50px',
                        height: '50px',
                        fontSize: '1.1rem',
                        fontWeight: 'bold',
                      }}
                    >
                      {p.stock_total || 0}
                    </div>
                  </td>

                  {/* Acciones Admin */}
                  {isAdmin && (
                    <td className="py-3 d-none d-md-table-cell text-center">
                      <div className="d-flex gap-2 justify-content-center">
                        <button
                          className="btn btn-outline-primary btn-sm rounded-pill px-3"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleUpdate(p);
                          }}
                          style={{ minWidth: '90px' }}
                        >
                          <i className="bi bi-pencil me-1"></i>
                          Editar
                        </button>
                      </div>
                    </td>
                  )}

                  {/* Imprimir */}
                  <td className="py-3 d-none d-md-table-cell text-end">
                    <ImprimirProd
                      productos={[p]}
                      label={
                        <span>
                          <i className="bi bi-printer me-1"></i>
                          Imprimir
                        </span>
                      }
                      all={false}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CSS adicional */}
      <style jsx>{`
        .table tbody tr:hover {
          background-color: #f8f9fa;
          transform: translateX(5px);
          box-shadow: -3px 0 0 0 #0d6efd;
        }

        .badge {
          font-weight: 600;
          letter-spacing: 0.3px;
          transition: all 0.2s ease;
        }

        .badge:hover {
          transform: scale(1.05);
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

      {/*    {modalIntercambio && (
        <ModalTransferencia
          modalIntercambio={modalIntercambio}
          producto={productoStock}
          onClose={() => setModalIntercambio(false)}
        />
      )} */}

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
