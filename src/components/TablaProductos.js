import React from 'react';

const TablaProductos = ({
  itemsVenta,
  setItemsVenta,
  /*   handleCostoVencimiento, */
  totalStockProducto,
  eliminarProducto,
}) => {
  console.log('first', itemsVenta);
  return (
    <div
      className="card shadow-sm rounded-3"
      style={{ height: '55vh', display: 'flex', flexDirection: 'column' }}
    >
      <div
        className="card-body p-2 flex-grow-1 overflow-auto mx-2 rounded-2"
        style={{ backgroundColor: '#f9f9f9' }}
      >
        <table className="table table-bordered table-hover table-sm mb-0 mt-0">
          <thead className="sticky-header" style={{ top: 0 }}>
            <tr>
              <th scope="col" className="col-1  ">
                Producto
              </th>
              <th scope="col" className="col-1 text-center ">
                Codigo
              </th>
              <th scope="col" className="col-1 text-center">
                Marca
              </th>
              <th scope="col" className="col-1 text-center">
                Modelo
              </th>
              <th scope="col" className="col-1 text-center">
                Color
              </th>
              <th scope="col" className="col-1 text-center">
                Talle
              </th>

              <th scope="col" className="col-1 text-center">
                Cantidad
              </th>
              <th scope="col" className="col-1 text-center">
                Costo
              </th>
              <th scope="col" className="col-1 text-center">
                Subtotal
              </th>
              {/*    <th scope="col" className="col-1 text-center">
                Vencimiento
              </th> */}
              <th scope="col" className="col-1 text-center">
                Borrar
              </th>
            </tr>
          </thead>
          <tbody>
            {itemsVenta.map((item) => (
              <tr key={item.producto_id}>
                <td>{item.nombre_producto}</td>
                <td className="text-center">{item.codigo}</td>

                <td className="text-center">{item.marca}</td>
                <td className="text-center">{item.modelo}</td>
                <td className="text-center">{item.color}</td>

                <td className="text-center">{item.talle}</td>

                <td>
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
                    className="form-control form-control-sm"
                    onKeyDown={(e) => {
                      if (e.key === '.' || e.key === ',' || e.key === 'e') {
                        e.preventDefault();
                      }
                    }}
                  />
                </td>

                <td>
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
                    className="form-control form-control-sm"
                    onKeyDown={(e) => {
                      if (e.key === '.' || e.key === ',' || e.key === 'e') {
                        e.preventDefault();
                      }
                    }}
                  />
                </td>
                <td>{item.cantidad * item.costo}</td>

                {/* <td>
                  <input
                    type="date"
                    className="form-select w-100 w-md-20 form-select-sm "
                    value={item.vencimiento}
                    onChange={(e) =>
                      handleCostoVencimiento(
                        item.producto_id,
                        e.target.value,
                        'vencimiento'
                      )
                    }
                  />
                </td> */}

                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => eliminarProducto(item.producto_id)}
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TablaProductos;
