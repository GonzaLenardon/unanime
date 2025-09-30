import { React, useState, useRef, useEffect } from 'react';

const SearchProductos = ({
  modalSearch,
  handleModalSearch,
  agregarProductoAVenta,
  productos,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const inputRef = useRef(null);

  console.log('modal Serarch ', modalSearch);

  const productosFiltrados = productos.filter(
    (p) =>
      p.codigo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.nombre?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    if (modalSearch && inputRef.current) {
      inputRef.current.focus();
    }
  }, [modalSearch]);

  return (
    <>
      {modalSearch && (
        <>
          <div className="container-padre"></div>
          <div
            className="position-fixed top-0 start-0 w-100 h-100  d-flex justify-content-center align-items-center"
            style={{ zIndex: 1040 }}
          >
            <div
              className="bg-white rounded shadow p-4 d-flex flex-column"
              style={{
                width: '90%',
                maxWidth: '600px',
                height: '85vh', // altura fija del modal
                zIndex: 1050,
              }}
            >
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="m-0">Buscar Producto</h5>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => {
                    setSearchTerm('');
                    handleModalSearch();
                  }}
                >
                  X
                </button>
              </div>

              <div className="d-flex align-items-center gap-2 mb-3 bg-info p-3 rounded-2">
                <label className="fw-bold mb-0">Buscar</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Buscar por código o nombre..."
                  value={searchTerm}
                  ref={inputRef}
                  /* onChange={(e) => setSearchTerm(e.target.value)} */

                  onChange={(e) => {
                    const value = e.target.value;
                    setSearchTerm(value);

                    // Buscar coincidencia exacta por código
                    const match = productos.find(
                      (p) =>
                        p.codigo &&
                        p.codigo.toString().toLowerCase() ===
                          value.toLowerCase()
                    );

                    if (match) {
                      agregarProductoAVenta(match);
                      setSearchTerm('');
                      handleModalSearch(); // Cerrar modal
                    }
                  }}
                />
                <button
                  className="btn btn-secondary"
                  onClick={() => setSearchTerm('')}
                >
                  Limpiar
                </button>
              </div>

              {/* Lista scrollable */}
              <div style={{ overflowY: 'auto', flexGrow: 1 }}>
                {searchTerm && productosFiltrados.length > 0 ? (
                  <div className="list-group bg-primary p-3 rounded-2">
                    {productosFiltrados.map((producto) => (
                      <button
                        key={producto.id_producto}
                        className="list-group-item list-group-item-action"
                        onClick={() => {
                          agregarProductoAVenta(producto);
                          setSearchTerm('');
                          handleModalSearch(); // cerrar modal
                        }}
                      >
                        {producto.nombre} - {producto.codigo}
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted">No hay resultados</p>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default SearchProductos;
