import { useState, useEffect, useRef } from 'react';
import { addVenta } from '../api/ventas';
import { allTipoVentas } from '../api/tipoVentas';
import Spinner from '../components/spinner';
import { useNavigate } from 'react-router-dom';
import { productosConStock } from '../api/productos';

const Ventas = () => {
  const [stock, setStock] = useState([]);
  const [itemsVenta, setItemsVenta] = useState([]);
  const [tipoVta, setTipoVta] = useState([]);
  const [tipo, setTipo] = useState({ porcentajeVenta: 0 });
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const navigate = useNavigate();
  const inputRef = useRef(null);

  // Obtener id_sucursal para estilos dinámicos
  const id_sucursal = localStorage.getItem('sucursal_id');

  const estilos =
    id_sucursal === '1'
      ? {
          gradiente: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          colorPrincipal: '#667eea',
          fondoClaro: 'rgba(102, 126, 234, 0.08)',
          iconoVentas: 'bi-cart-check-fill',
        }
      : {
          gradiente: 'linear-gradient(135deg, #f857a6 0%, #ff5858 100%)',
          colorPrincipal: '#f857a6',
          fondoClaro: 'rgba(248, 87, 166, 0.08)',
          iconoVentas: 'bi-bag-heart-fill',
        };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await fetchTipoVenta();
      await fetchStockProductos();
      setLoading(false);
      inputRef.current?.focus();
    };

    fetchData();
  }, []);

  const fetchTipoVenta = async () => {
    try {
      const resp = await allTipoVentas();
      setTipoVta(resp);
    } catch (error) {
      console.error('Error al obtener Tipo ventas:', error.message);
    }
  };

  const fetchStockProductos = async () => {
    try {
      const resp = await productosConStock();
      console.log('Prod con Stock', resp);
      setStock(resp);
    } catch (error) {
      console.error('Error al obtener stock:', error.message);
    }
  };

  const agregarProductoAVenta = (producto) => {
    const { nombre, id_producto, precio_venta, stock_total } = producto;
    console.log('producto', producto);

    const existe = itemsVenta.find(
      (item) => item.id_producto === producto.id_producto
    );
    if (existe) return;

    setItemsVenta([
      ...itemsVenta,
      {
        nombre,
        id_producto,
        precio_venta,
        stock_total: stock_total,
        cantidad: 1,
        subtotal: producto.precio_venta,
      },
    ]);
  };

  const actualizarCantidad = (id_producto, nuevaCantidad) => {
    const actualizados = itemsVenta.map((item) =>
      item.id_producto === id_producto
        ? {
            ...item,
            cantidad: nuevaCantidad,
            subtotal: nuevaCantidad * item.precio_venta,
          }
        : item
    );
    setItemsVenta(actualizados);
  };

  const eliminarProducto = (id_producto) => {
    setItemsVenta(
      itemsVenta.filter((item) => item.id_producto !== id_producto)
    );
  };

  const totalVenta = itemsVenta.reduce((acc, item) => acc + item.subtotal, 0);
  const descuento = (totalVenta * tipo?.porcentajeVenta) / 100;
  const subtotal = totalVenta - descuento;

  const finalizarVenta = async () => {
    setLoading(true);
    setMsg('Registrando venta ... ');
    const filtroDetalles = itemsVenta.map(
      ({ id_producto, cantidad, precio_venta }) => ({
        id_producto,
        cantidad,
        precio_venta,
      })
    );

    const venta = {
      id_tipo_venta: tipo.id_tipo,
      porcentaje_aplicado: tipo.porcentajeVenta,
      detalles: filtroDetalles,
    };
    console.log('FINAL VTAS ', venta);

    try {
      await addVenta(venta);
      setLoading(false);
      navigate('/home');
    } catch (error) {
      console.log('error', error);
      setMsg('Se produjo un error ...');
      setLoading(false);
    }
  };

  const productosFiltrados = stock.filter((p) => {
    const textoCompleto =
      `${p.nombre} ${p.marca} ${p.modelo} ${p.talle} ${p.color} ${p.codigo}`
        .toLowerCase()
        .replace(/\s+/g, '');
    const termino = searchTerm.toLowerCase().replace(/\s+/g, '');
    return textoCompleto.includes(termino);
  });

  const tventasHabilitadas = tipoVta.filter((tv) => tv.habilitado === true);

  return (
    <>
      <div className="container-fluid p-3">
        {/* Header */}
        <div className="d-flex align-items-center gap-3 mb-4">
          <div
            className="rounded-circle d-flex align-items-center justify-content-center"
            style={{
              width: '60px',
              height: '60px',
              background: estilos.gradiente,
            }}
          >
            <i className={`bi ${estilos.iconoVentas} text-white fs-3`}></i>
          </div>
          <div>
            <h2
              className="mb-0 fw-bold"
              style={{ color: estilos.colorPrincipal }}
            >
              Nueva Venta
            </h2>
            <p className="text-muted mb-0">
              Busca y agrega productos a la venta
            </p>
          </div>
        </div>

        {/* Buscador */}
        <div
          className="card border-0 shadow-sm mb-3"
          style={{ borderRadius: '15px' }}
        >
          <div
            className="card-body p-4"
            style={{ background: estilos.gradiente }}
          >
            <div className="d-flex flex-column flex-lg-row align-items-center gap-3">
              {/* Icono y Label */}
              <div className="d-flex align-items-center gap-3 text-white">
                <div
                  className="d-flex align-items-center justify-content-center rounded-circle"
                  style={{
                    width: '50px',
                    height: '50px',
                    backgroundColor: 'rgba(255, 255, 255, 0.25)',
                  }}
                >
                  <i className="bi bi-search fs-4"></i>
                </div>
                <label className="fs-5 fw-bold mb-0 text-nowrap">
                  Buscar Producto
                </label>
              </div>

              {/* Input */}
              <div className="flex-grow-1 w-100" style={{ maxWidth: '600px' }}>
                <div className="position-relative">
                  <i
                    className="bi bi-upc-scan position-absolute text-muted"
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
                    }}
                    placeholder="Escanea código o busca por nombre, marca, modelo..."
                    value={searchTerm}
                    onChange={(e) => {
                      const value = e.target.value;
                      setSearchTerm(value);

                      const match = stock.find(
                        (p) =>
                          p.codigo &&
                          p.codigo.toString().toLowerCase() ===
                            value.toLowerCase()
                      );

                      if (match) {
                        agregarProductoAVenta(match);
                        setSearchTerm('');
                      }
                    }}
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
                  inputRef.current?.focus();
                  setSearchTerm('');
                }}
              >
                <i className="bi bi-x-circle fs-5"></i>
                Limpiar
              </button>

              {/* Contador */}
              <div
                className="badge bg-white bg-opacity-25 text-white px-4 py-3 d-flex align-items-center gap-2"
                style={{
                  borderRadius: '50px',
                  fontSize: '0.95rem',
                  fontWeight: '600',
                  minWidth: '180px',
                  justifyContent: 'center',
                }}
              >
                <i className="bi bi-box-seam"></i>
                <span>
                  {productosFiltrados.length} / {stock.length}
                </span>
              </div>
            </div>

            {/* Resultados de búsqueda */}
            {searchTerm && productosFiltrados.length > 0 && (
              <div
                className="mt-3 bg-white rounded-4 shadow-lg"
                style={{ maxHeight: '300px', overflowY: 'auto' }}
              >
                {productosFiltrados.slice(0, 10).map((producto) => (
                  <button
                    key={producto.id_producto}
                    className="w-100 text-start border-0 bg-transparent p-3 d-flex justify-content-between align-items-center"
                    style={{
                      borderBottom: '1px solid #f0f0f0',
                      transition: 'all 0.2s ease',
                    }}
                    onClick={() => {
                      agregarProductoAVenta(producto);
                      setSearchTerm('');
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor =
                        estilos.fondoClaro;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <div>
                      <div className="fw-bold mb-1">{producto.nombre}</div>
                      <small className="text-muted">
                        {producto.marca} · {producto.modelo} · {producto.talle}{' '}
                        · {producto.color}
                      </small>
                    </div>
                    <div className="d-flex align-items-center gap-3">
                      <span
                        className="badge"
                        style={{
                          backgroundColor: estilos.fondoClaro,
                          color: estilos.colorPrincipal,
                          padding: '8px 12px',
                        }}
                      >
                        {producto.codigo}
                      </span>
                      <span
                        className="fw-bold"
                        style={{ color: estilos.colorPrincipal }}
                      >
                        ${producto.precio_venta}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Tabla de productos */}
        {itemsVenta.length > 0 && (
          <div
            className="card border-0 shadow-sm"
            style={{
              borderRadius: '15px',
              minHeight: '60vh',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Header de la tabla */}
            <div
              className="card-header border-0 text-white py-3"
              style={{
                background: estilos.gradiente,
                borderRadius: '15px 15px 0 0',
              }}
            >
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0 fw-bold">
                  <i className="bi bi-cart3 me-2"></i>
                  Productos en Venta
                </h5>
                <span className="badge bg-white bg-opacity-25 px-3 py-2">
                  {itemsVenta.length}{' '}
                  {itemsVenta.length === 1 ? 'producto' : 'productos'}
                </span>
              </div>
            </div>

            {/* Tabla */}
            <div
              className="card-body p-0 flex-grow-1 overflow-auto"
              style={{ backgroundColor: '#fafafa' }}
            >
              <table className="table table-hover mb-0">
                <thead
                  className="sticky-top"
                  style={{ backgroundColor: '#f8f9fa' }}
                >
                  <tr>
                    <th className="py-3">Producto</th>
                    <th className="text-center py-3">Precio Unit.</th>
                    <th className="text-center py-3">Cantidad</th>
                    <th className="text-center py-3">Stock</th>
                    <th className="text-end py-3">Subtotal</th>
                    <th className="text-center py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {itemsVenta.map((item) => (
                    <tr key={item.id_producto}>
                      <td className="py-3">
                        <div className="fw-semibold">{item.nombre}</div>
                      </td>
                      <td className="text-center py-3">
                        <span
                          className="badge"
                          style={{
                            backgroundColor: estilos.fondoClaro,
                            color: estilos.colorPrincipal,
                            fontSize: '0.9rem',
                            padding: '6px 12px',
                          }}
                        >
                          ${item.precio_venta.toFixed(2)}
                        </span>
                      </td>
                      <td className="text-center py-3">
                        <input
                          type="number"
                          min="1"
                          max={item.stock_total}
                          value={item.cantidad}
                          className="form-control form-control-sm text-center fw-bold"
                          style={{
                            width: '80px',
                            margin: '0 auto',
                            borderRadius: '8px',
                            border: `2px solid ${estilos.colorPrincipal}40`,
                          }}
                          onChange={(e) => {
                            let cantidad = parseInt(e.target.value, 10);
                            if (cantidad > item.stock_total)
                              cantidad = item.stock_total;
                            if (cantidad < 1) cantidad = 1;
                            actualizarCantidad(item.id_producto, cantidad);
                          }}
                          onBlur={(e) => {
                            if (
                              e.target.value === '' ||
                              parseInt(e.target.value, 10) < 1
                            ) {
                              actualizarCantidad(item.id_producto, 1);
                            }
                          }}
                        />
                      </td>
                      <td className="text-center py-3">
                        <span
                          className={`badge ${
                            item.stock_total < 5
                              ? 'bg-danger'
                              : item.stock_total < 10
                              ? 'bg-warning'
                              : 'bg-success'
                          }`}
                          style={{ fontSize: '0.9rem', padding: '6px 12px' }}
                        >
                          {item.stock_total}
                        </span>
                      </td>
                      <td className="text-end py-3">
                        <span
                          className="fw-bold fs-5"
                          style={{ color: estilos.colorPrincipal }}
                        >
                          ${item.subtotal.toFixed(2)}
                        </span>
                      </td>
                      <td className="text-center py-3">
                        <button
                          className="btn btn-sm btn-danger rounded-circle"
                          style={{ width: '35px', height: '35px' }}
                          onClick={() => eliminarProducto(item.id_producto)}
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Footer con totales */}
            <div
              className="card-footer border-0 p-4"
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '0 0 15px 15px',
              }}
            >
              <div className="row g-3 align-items-center">
                {/* Selector de tipo */}
                <div className="col-12 col-lg-4">
                  <label className="form-label fw-semibold small text-muted">
                    TIPO DE VENTA
                  </label>
                  <select
                    className="form-select form-select-lg border-2"
                    style={{
                      borderRadius: '12px',
                      borderColor: estilos.colorPrincipal,
                    }}
                    value={tipo?.id_tipo || ''}
                    onChange={(e) => {
                      const selected = tipoVta.find(
                        (t) => t.id_tipo === parseInt(e.target.value)
                      );
                      setTipo(selected);
                    }}
                  >
                    <option value="" disabled>
                      Selecciona un tipo
                    </option>
                    {tventasHabilitadas.map((t) => (
                      <option key={t.id_tipo} value={t.id_tipo}>
                        {t.tipoVenta}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Totales */}
                <div className="col-12 col-lg-5">
                  <div
                    className="rounded-4 p-3 shadow-sm"
                    style={{ backgroundColor: estilos.fondoClaro }}
                  >
                    <div className="d-flex justify-content-between mb-2">
                      <span className="fw-semibold">Subtotal:</span>
                      <span className="fw-bold">${totalVenta.toFixed(2)}</span>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                      <span className="fw-semibold">
                        Descuento {tipo?.porcentajeVenta || 0}%:
                      </span>
                      <span className="fw-bold text-danger">
                        -${descuento.toFixed(2)}
                      </span>
                    </div>
                    <div className="d-flex justify-content-between pt-2 border-top">
                      <span className="fw-bold fs-5">TOTAL:</span>
                      <span
                        className="fw-bold fs-4"
                        style={{ color: estilos.colorPrincipal }}
                      >
                        ${subtotal.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Botón confirmar */}
                <div className="col-12 col-lg-3">
                  <button
                    className="btn btn-lg w-100 text-white fw-bold shadow"
                    style={{
                      background: estilos.gradiente,
                      borderRadius: '12px',
                      padding: '14px',
                      border: 'none',
                      transition: 'all 0.3s ease',
                    }}
                    onClick={finalizarVenta}
                    disabled={!tipo}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = `0 8px 20px ${estilos.colorPrincipal}60`;
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 4px 10px rgba(0,0,0,0.1)';
                    }}
                  >
                    <i className="bi bi-check-circle me-2"></i>
                    Confirmar Venta
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Estado vacío */}
        {itemsVenta.length === 0 && !loading && (
          <div
            className="card border-0 shadow-sm text-center py-5"
            style={{ borderRadius: '15px' }}
          >
            <div className="card-body">
              <i
                className={`bi ${estilos.iconoVentas} fs-1 mb-3 d-block`}
                style={{ color: estilos.colorPrincipal, opacity: 0.3 }}
              ></i>
              <h4 className="text-muted">Carrito vacío</h4>
              <p className="text-muted mb-0">
                Busca productos usando el código de barras o el nombre
              </p>
            </div>
          </div>
        )}
      </div>

      <Spinner loading={loading} msg={msg} />
    </>
  );
};

export default Ventas;
