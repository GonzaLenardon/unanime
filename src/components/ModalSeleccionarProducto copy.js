import React, { useEffect, useState } from 'react';
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

  useEffect(() => {
    getProductos();
    fetchSucursal();
  }, []);

  useEffect(() => {
    setProd(productos); // solo si realmente necesitás esta copia
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

    console.log('seleccionado ', productoSeleccionado);

    onConfirm({
      id_producto: productoSeleccionado.id_producto,
      nombre: productoSeleccionado.nombre,
      cantidad: parseInt(cantidad),
      precio_unitario: parseFloat(precio),
      id_detalle_compra: productoSeleccionado.id_detalle_compra,
    });

    onClose();
  };

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

  const productosFiltrados = stockProductos.filter((p) => {
    const textoCompleto = `${p.nombre} ${p.marca} ${p.modelo} ${p.codigo}`
      .toLowerCase()
      .replace(/\s+/g, ''); // Quitamos espacios para búsquedas como "buzocanguromarcaf"

    const termino = searchTerm.toLowerCase().replace(/\s+/g, '');

    return textoCompleto.includes(termino);
  });

  return (
    <div className="modal show d-block" tabIndex="-1">
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Seleccionar Producto</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>

          <div className="modal-body">
            <select
              className="form-select mb-3"
              onChange={(e) => {
                const prod = productosFiltrados.find(
                  (p) => p.id_producto === parseInt(e.target.value)
                );

                setProductoSeleccionado(prod);
                setPrecio(prod?.precio_venta || 0);
              }}
            >
              <option value="">-- Selecciona un producto --</option>
              {productosFiltrados.map((prod) => (
                <option key={prod.id_producto} value={prod.id_producto}>
                  {prod.nombre} - {prod.modelo} - {prod.marca} - $
                  {prod.precio_venta?.toLocaleString('es-AR')}
                </option>
              ))}
            </select>

            <div className="d-flex gap-3">
              <div className="flex-fill">
                <label>Cantidad</label>
                <input
                  type="number"
                  className="form-control"
                  value={cantidad}
                  onChange={(e) => setCantidad(e.target.value)}
                  min="1"
                />
              </div>

              <div className="flex-fill">
                <label>Precio Unitario</label>
                <input
                  type="number"
                  className="form-control"
                  value={precio}
                  onChange={(e) => setPrecio(e.target.value)}
                  min="0"
                />
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button className="btn btn-success" onClick={handleConfirmar}>
              Agregar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalSeleccionProducto;
