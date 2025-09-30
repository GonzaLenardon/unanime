import { React, useRef } from 'react';

const BuscarProducto = ({
  searchTerm,
  setSearchTerm,
  productos,
  agregarProductoAVenta,
}) => {
  const inputRef = useRef(null);

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

  /*   const productosFiltrados = productos.filter(
    (p) =>
      p.codigo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.nombre?.toLowerCase().includes(searchTerm.toLowerCase())
  ); */

  const productosFiltrados = productos.filter((p) => {
    const textoCompleto =
      `${p.nombre} ${p.marca} ${p.modelo} ${p.talle}  ${p.color} ${p.codigo}`
        .toLowerCase()
        .replace(/\s+/g, ''); // Quitamos espacios para búsquedas como "buzocanguromarcaf"

    const termino = searchTerm.toLowerCase().replace(/\s+/g, '');

    return textoCompleto.includes(termino);
  });

  return (
    <div className="card shadow-sm rounded-3 mb-1 ">
      <div className="card-body myNavBar px-2">
        <div className="d-flex flex-wrap align-items-end gap-3">
          <div className="d-flex w-100 justify-content-center align-items-center gap-5">
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
              onChange={handleChange}
            />

            <button
              type="button"
              className="btn btn-primary btn-ms d-flex align-items-center gap-2"
              onClick={() => {
                inputRef.current?.focus();

                setSearchTerm('');
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

        {searchTerm && productosFiltrados.length > 0 && (
          <div className="list-group mt-3 mx-auto w-50">
            {productosFiltrados.map((producto) => (
              <button
                key={producto.id_producto}
                className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                onClick={() => {
                  agregarProductoAVenta(producto);
                  setSearchTerm('');
                }}
              >
                <div className="fw-bold">{producto.nombre}</div>
                <div className="text-muted small">
                  {producto.marca} · {producto.modelo} · {producto.talle} ·{' '}
                  {producto.color} · {producto.codigo}
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
