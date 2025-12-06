import { React, useRef } from 'react';

const BuscarProducto = ({
  searchTerm,
  setSearchTerm,
  productos,
  agregarProductoAVenta,
}) => {
  const inputRef = useRef(null);

  // ✅ Obtener estilos dinámicos
  const id_sucursal = localStorage.getItem('sucursal_id');

  const estilos =
    id_sucursal === '1'
      ? {
          gradiente: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          colorPrincipal: '#667eea',
          fondoClaro: 'rgba(102, 126, 234, 0.08)',
        }
      : {
          gradiente: 'linear-gradient(135deg, #f857a6 0%, #ff5858 100%)',
          colorPrincipal: '#f857a6',
          fondoClaro: 'rgba(248, 87, 166, 0.08)',
        };

  const handleChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    const match = productos.find(
      (p) =>
        p.codigo && p.codigo.toString().toLowerCase() === value.toLowerCase()
    );

    if (match) {
      agregarProductoAVenta(match);
      setSearchTerm('');
    }
  };

  const productosFiltrados = productos.filter((p) => {
    const textoCompleto =
      `${p.nombre} ${p.marca} ${p.modelo} ${p.talle} ${p.color} ${p.codigo}`
        .toLowerCase()
        .replace(/\s+/g, '');
    const termino = searchTerm.toLowerCase().replace(/\s+/g, '');
    return textoCompleto.includes(termino);
  });

  return (
    <div
      className="card border-0 shadow-sm mb-3"
      style={{ borderRadius: '15px' }}
    >
      {/* ✅ FONDO CON GRADIENTE */}
      <div
        className="card-body p-4 rounded rounded-3"
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
                  backgroundColor: 'white',
                }}
                placeholder="Escanea código o busca por nombre, marca, modelo..."
                value={searchTerm}
                onChange={handleChange}
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
              {productosFiltrados.length} / {productos.length}
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
                  e.currentTarget.style.backgroundColor = estilos.fondoClaro;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <div>
                  <div className="fw-bold mb-1">{producto.nombre}</div>
                  <small className="text-muted">
                    {producto.marca} · {producto.modelo} · {producto.talle} ·{' '}
                    {producto.color}
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
                    Stock: {producto.stock_total || 0}
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BuscarProducto;
