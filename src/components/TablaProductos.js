import React from 'react';

const TablaProductos = ({
  itemsVenta,
  setItemsVenta,
  totalStockProducto,
  eliminarProducto,
}) => {
  // ✅ Obtener estilos dinámicos
  const id_sucursal = localStorage.getItem('Sucursal');

  const estilos =
    id_sucursal === '1'
      ? {
          colorPrincipal: '#667eea',
          fondoClaro: 'rgba(102, 126, 234, 0.08)',
          bordeInput: '#667eea',
        }
      : {
          colorPrincipal: '#f857a6',
          fondoClaro: 'rgba(248, 87, 166, 0.08)',
          bordeInput: '#f857a6',
        };

  console.log('first', itemsVenta);

  return (
    <div className="overflow-auto" style={{ backgroundColor: '#fafafa' }}>
      <table className="table table-hover mb-0">
        <thead
          className="sticky-top"
          style={{
            backgroundColor: estilos.fondoClaro,
            top: 0,
            zIndex: 10,
          }}
        >
          <tr>
            <th
              scope="col"
              className="py-3 fw-bold"
              style={{ color: estilos.colorPrincipal }}
            >
              <i className="bi bi-box-seam me-2"></i>
              Producto
            </th>
            <th
              scope="col"
              className="text-center py-3 fw-bold"
              style={{ color: estilos.colorPrincipal }}
            >
              <i className="bi bi-upc-scan me-1"></i>
              Código
            </th>
            <th
              scope="col"
              className="text-center py-3 fw-bold"
              style={{ color: estilos.colorPrincipal }}
            >
              Marca
            </th>
            <th
              scope="col"
              className="text-center py-3 fw-bold"
              style={{ color: estilos.colorPrincipal }}
            >
              Modelo
            </th>
            <th
              scope="col"
              className="text-center py-3 fw-bold"
              style={{ color: estilos.colorPrincipal }}
            >
              Color
            </th>
            <th
              scope="col"
              className="text-center py-3 fw-bold"
              style={{ color: estilos.colorPrincipal }}
            >
              Talle
            </th>
            <th
              scope="col"
              className="text-center py-3 fw-bold"
              style={{ color: estilos.colorPrincipal }}
            >
              <i className="bi bi-123 me-1"></i>
              Cantidad
            </th>
            <th
              scope="col"
              className="text-center py-3 fw-bold"
              style={{ color: estilos.colorPrincipal }}
            >
              <i className="bi bi-cash me-1"></i>
              Costo
            </th>
            <th
              scope="col"
              className="text-end py-3 fw-bold"
              style={{ color: estilos.colorPrincipal }}
            >
              <i className="bi bi-calculator me-1"></i>
              Subtotal
            </th>
            <th
              scope="col"
              className="text-center py-3 fw-bold"
              style={{ color: estilos.colorPrincipal }}
            >
              <i className="bi bi-trash me-1"></i>
              Acción
            </th>
          </tr>
        </thead>
        <tbody>
          {itemsVenta.map((item, index) => (
            <tr
              key={item.producto_id}
              style={{
                transition: 'all 0.2s ease',
                backgroundColor: index % 2 === 0 ? 'white' : '#fafafa',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = estilos.fondoClaro;
                e.currentTarget.style.transform = 'scale(1.01)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor =
                  index % 2 === 0 ? 'white' : '#fafafa';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              {/* Producto */}
              <td className="py-3">
                <div className="d-flex align-items-center gap-2">
                  <div
                    className="rounded-circle flex-shrink-0"
                    style={{
                      width: '8px',
                      height: '8px',
                      backgroundColor: estilos.colorPrincipal,
                    }}
                  ></div>
                  <span className="fw-semibold">{item.nombre_producto}</span>
                </div>
              </td>

              {/* Código */}
              <td className="text-center py-3">
                <span
                  className="badge"
                  style={{
                    backgroundColor: estilos.fondoClaro,
                    color: estilos.colorPrincipal,
                    fontSize: '0.85rem',
                    padding: '6px 12px',
                    borderRadius: '8px',
                  }}
                >
                  {item.codigo}
                </span>
              </td>

              {/* Marca */}
              <td className="text-center py-3">
                <span className="text-muted">{item.marca}</span>
              </td>

              {/* Modelo */}
              <td className="text-center py-3">
                <span className="text-muted">{item.modelo}</span>
              </td>

              {/* Color */}
              <td className="text-center py-3">
                <span className="badge bg-light text-dark border">
                  {item.color}
                </span>
              </td>

              {/* Talle */}
              <td className="text-center py-3">
                <span className="badge bg-secondary">{item.talle}</span>
              </td>

              {/* Cantidad */}
              <td className="text-center py-3">
                <input
                  type="number"
                  min="1"
                  value={item.cantidad}
                  onChange={(e) => {
                    const nuevaCantidad = parseInt(e.target.value) || 1;
                    setItemsVenta((prev) =>
                      prev.map((p) =>
                        p.producto_id === item.producto_id
                          ? { ...p, cantidad: nuevaCantidad }
                          : p
                      )
                    );
                  }}
                  className="form-control form-control-sm text-center fw-bold"
                  style={{
                    width: '70px',
                    margin: '0 auto',
                    borderRadius: '8px',
                    border: `2px solid ${estilos.bordeInput}`,
                    backgroundColor: 'white',
                  }}
                  onKeyDown={(e) => {
                    if (e.key === '.' || e.key === ',' || e.key === 'e') {
                      e.preventDefault();
                    }
                  }}
                  onFocus={(e) => {
                    e.target.style.boxShadow = `0 0 0 0.15rem ${estilos.colorPrincipal}25`;
                  }}
                  onBlur={(e) => {
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </td>

              {/* Costo */}
              <td className="text-center py-3">
                <div
                  className="input-group input-group-sm"
                  style={{ width: '120px', margin: '0 auto' }}
                >
                  <span
                    className="input-group-text border-0"
                    style={{
                      backgroundColor: estilos.fondoClaro,
                      color: estilos.colorPrincipal,
                      fontWeight: '600',
                    }}
                  >
                    $
                  </span>
                  <input
                    type="number"
                    min="1"
                    value={item.costo}
                    onChange={(e) => {
                      const nuevoCosto = parseInt(e.target.value) || 1;
                      setItemsVenta((prev) =>
                        prev.map((p) =>
                          p.producto_id === item.producto_id
                            ? { ...p, costo: nuevoCosto }
                            : p
                        )
                      );
                    }}
                    className="form-control form-control-sm text-center fw-bold"
                    style={{
                      borderRadius: '0 8px 8px 0',
                      border: `2px solid ${estilos.bordeInput}`,
                      backgroundColor: 'white',
                    }}
                    onKeyDown={(e) => {
                      if (e.key === '.' || e.key === ',' || e.key === 'e') {
                        e.preventDefault();
                      }
                    }}
                    onFocus={(e) => {
                      e.target.style.boxShadow = `0 0 0 0.15rem ${estilos.colorPrincipal}25`;
                    }}
                    onBlur={(e) => {
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>
              </td>

              {/* Subtotal */}
              <td className="text-end py-3">
                <span
                  className="fw-bold fs-5"
                  style={{ color: estilos.colorPrincipal }}
                >
                  ${(item.cantidad * item.costo).toFixed(2)}
                </span>
              </td>

              {/* Eliminar */}
              <td className="text-center py-3">
                <button
                  className="btn btn-sm btn-danger rounded-circle"
                  style={{ width: '35px', height: '35px' }}
                  onClick={() => eliminarProducto(item.producto_id)}
                  title="Eliminar producto"
                >
                  <i className="bi bi-trash"></i>
                </button>
              </td>
            </tr>
          ))}
        </tbody>

        {/* Footer con totales */}
        <tfoot>
          <tr
            style={{
              backgroundColor: estilos.fondoClaro,
              borderTop: `3px solid ${estilos.colorPrincipal}`,
            }}
          >
            <td
              colSpan="6"
              className="py-3 text-end fw-bold"
              style={{ color: estilos.colorPrincipal }}
            >
              <i className="bi bi-calculator me-2"></i>
              TOTALES:
            </td>
            <td className="text-center py-3">
              <span
                className="badge"
                style={{
                  backgroundColor: estilos.colorPrincipal,
                  color: 'white',
                  fontSize: '1rem',
                  padding: '8px 16px',
                }}
              >
                {itemsVenta.reduce((sum, item) => sum + item.cantidad, 0)}
              </span>
            </td>
            <td colSpan="2" className="text-end py-3">
              <span
                className="fw-bold fs-4"
                style={{ color: estilos.colorPrincipal }}
              >
                $
                {itemsVenta
                  .reduce((sum, item) => sum + item.cantidad * item.costo, 0)
                  .toFixed(2)}
              </span>
            </td>
            <td></td>
          </tr>
        </tfoot>
      </table>

      {/* Estado vacío */}
      {itemsVenta.length === 0 && (
        <div className="text-center py-5">
          <i
            className="bi bi-inbox fs-1 mb-3 d-block"
            style={{ color: estilos.colorPrincipal, opacity: 0.3 }}
          ></i>
          <h5 className="text-muted">No hay productos agregados</h5>
          <p className="text-muted mb-0">
            Busca y agrega productos para comenzar
          </p>
        </div>
      )}
    </div>
  );
};

export default TablaProductos;
