import React, { useEffect, useState, useRef } from 'react';
import { useGestion } from '../context/UserContext';
import { getSucursal } from '../api/sucursales';
import { useAuth } from '../context/AuthContext';

const ModalSeleccionProducto = ({ onClose, onConfirm }) => {
  const [prod, setProd] = useState([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const [precio, setPrecio] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const { fetchProductos, productos } = useGestion();
  const [idSucursal, setIdSucursal] = useState();
  const { user } = useAuth();
  const inputRef = useRef(null);

  useEffect(() => {
    getProductos();
    fetchSucursal();
  }, []);

  useEffect(() => {
    setProd(productos);
  }, [productos]);

  const getProductos = async () => {
    try {
      await fetchProductos();
      setProd(productos);
    } catch (error) {
      console.error('Error al obtener productos:', error);
    }
  };

  const fetchSucursal = async () => {
    try {
      const res = await getSucursal(user.id);
      setIdSucursal(res.sucursal);
      console.log('SUCURSAL', res.sucursal);
    } catch (error) {
      console.log('error', error);
    }
  };

  const handleConfirmar = () => {
    if (!productoSeleccionado || cantidad <= 0 || precio <= 0) return;

    onConfirm({
      id_producto: productoSeleccionado.id_producto,
      nombre: productoSeleccionado.nombre,
      cantidad: parseInt(cantidad),
      precio_unitario: parseFloat(precio),
      id_detalle_compra: productoSeleccionado.id_detalle_compra,
    });

    onClose();
  };

  // Filtrar stock por sucursal
  const stockProductos = productos
    .filter((producto) =>
      producto.stock_por_sucursal?.some(
        (s) => s.id_sucursal === idSucursal && s.stock_total > 0
      )
    )
    .map((producto) => ({
      ...producto,
      stock_por_sucursal: producto.stock_por_sucursal.filter(
        (s) => s.id_sucursal === idSucursal && s.stock_total > 0
      ),
    }));

  // Filtrar productos por término de búsqueda
  const productosFiltrados = stockProductos.filter((p) => {
    const textoCompleto = `${p.nombre} ${p.marca} ${p.modelo} ${p.codigo}`
      .toLowerCase()
      .replace(/\s+/g, '');
    const termino = searchTerm.toLowerCase().replace(/\s+/g, '');
    return textoCompleto.includes(termino);
  });

  const seleccionarProducto = (producto) => {
    setProductoSeleccionado(producto);
    setPrecio(producto.precio_venta || 0);
    setSearchTerm('');
  };

  return (
    <div className="modal show d-block" tabIndex="-1">
      <div className="modal-dialog modal-xl">
        <div className="modal-content border-0 shadow-lg rounded-4">
          {/* Header con fondo */}
          <div className="modal-header bg-primary text-white rounded-top-4">
            <h5 className="modal-title">Seleccionar Producto</h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={onClose}
            ></button>
          </div>

          {/* Cuerpo con fondo suave */}
          <div className="modal-body" style={{ backgroundColor: '#f8f9fa' }}>
            {/* 🔎 Buscador */}
            <div className="mb-3">
              <label className="fw-bold">Buscar Producto</label>
              <div className="d-flex gap-2 align-items-center">
                <input
                  type="text"
                  className="form-control shadow-sm"
                  style={{ height: '50px' }}
                  placeholder="Buscar por nombre + marca + modelo + código"
                  value={searchTerm}
                  ref={inputRef}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button
                  type="button"
                  className="btn btn-primary btn-ms"
                  onClick={() => {
                    inputRef.current?.focus();
                    setSearchTerm('');
                  }}
                >
                  Limpiar
                </button>
              </div>
              <div className="text-muted small mt-1 fw-bold">
                {`Total de Productos : ${productosFiltrados.length} / ${stockProductos.length} `}
              </div>

              {/* Resultados dinámicos */}
              {searchTerm && productosFiltrados.length > 0 && (
                <div
                  className="list-group mt-2 shadow-sm"
                  style={{ maxHeight: '200px', overflowY: 'auto' }}
                >
                  {productosFiltrados.map((producto) => (
                    <button
                      key={producto.id_producto}
                      className="list-group-item list-group-item-action"
                      style={{
                        transition: '0.2s',
                      }}
                      onClick={() => seleccionarProducto(producto)}
                    >
                      <strong>{producto.nombre}</strong> - {producto.marca} -{' '}
                      {producto.modelo} - {producto.talle} - {producto.color} -{' '}
                      {producto.codigo} - $
                      {producto.precio_venta?.toLocaleString('es-AR')}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Producto seleccionado */}
            {productoSeleccionado && (
              <>
                <div
                  className="card shadow-sm mb-1 border-0 rounded-3"
                  style={{ background: '#d0d6daff' }}
                >
                  <div className="card-body">
                    <div className="d-flex justify-content-evenly flex-wrap gap-3">
                      <p className="fs-5">
                        {' '}
                        <strong>Producto:</strong> {productoSeleccionado.nombre}{' '}
                      </p>
                      <p className="fs-5">
                        <strong>Codigo:</strong> {productoSeleccionado.codigo}
                      </p>

                      <p className="mb-1 fs-5">
                        <strong>Marca:</strong> {productoSeleccionado.marca}
                      </p>
                      <p className="mb-1 fs-5">
                        <strong>Modelo:</strong> {productoSeleccionado.modelo}
                      </p>
                      <p className="mb-1 fs-5">
                        <strong>Talle:</strong> {productoSeleccionado.talle}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Inputs cantidad y precio */}
                <div className="d-flex gap-3 mt-3">
                  <div className="flex-fill">
                    <label className="fw-bold">Cantidad</label>
                    <input
                      type="number"
                      className="form-control shadow-sm"
                      value={cantidad}
                      onChange={(e) => setCantidad(e.target.value)}
                      min="1"
                    />
                  </div>

                  <div className="flex-fill">
                    <label className="fw-bold">Precio Unitario</label>
                    <input
                      type="number"
                      className="form-control shadow-sm"
                      value={precio}
                      onChange={(e) => setPrecio(e.target.value)}
                      min="0"
                    />
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Footer */}
          <div className="modal-footer bg-light rounded-bottom-4">
            <button className="btn btn-outline-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button
              className="btn btn-success"
              onClick={handleConfirmar}
              disabled={!productoSeleccionado}
            >
              Agregar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalSeleccionProducto;
