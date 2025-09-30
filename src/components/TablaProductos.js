import React from 'react';

const TablaProductos = ({
  itemsVenta,
  /*   handleStock,*/
  updateStock,
  handleCostoVencimiento,
  totalStockProducto,
  eliminarProducto,
}) => {
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
                Brown
              </th>
              <th scope="col" className="col-1 text-center">
                Cervantes
              </th>
              <th scope="col" className="col-1 text-center">
                Crespo
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

                <td className="text-center">{item.marca}</td>
                <td className="text-center">{item.modelo}</td>
                <td className="text-center">{item.color}</td>

                <td className="text-center">{item.talle}</td>

                {[1, 2, 3].map((id) => (
                  <td>
                    <input
                      type="number"
                      value={
                        item.detalles.find((s) => s.sucursal === id)?.stock ?? 0
                      }
                      onChange={(e) =>
                        updateStock(
                          item.producto_id,
                          id,
                          parseInt(e.target.value) || 0
                        )
                      }
                      className="form-control form-control-sm"
                      onKeyDown={(e) => {
                        if (e.key === '.' || e.key === ',' || e.key === 'e') {
                          e.preventDefault();
                        }
                      }}
                    />
                  </td>
                ))}

                <td>
                  <input
                    type="number"
                    min="1"
                    value={totalStockProducto(item.producto_id)}
                    className="form-control form-control-sm"
                    disabled
                  />
                </td>
                <td>
                  <input
                    type="number"
                    min="1"
                    value={item.costo}
                    className="form-control form-control-sm"
                    onChange={(e) =>
                      handleCostoVencimiento(
                        item.producto_id,
                        parseFloat(e.target.value),
                        'costo'
                      )
                    }
                    onBlur={(e) => {
                      if (
                        e.target.value === '' ||
                        parseInt(e.target.value, 10) < 1
                      ) {
                        handleCostoVencimiento(item.producto_id, 1, 'costo');
                      }
                    }}
                  />
                </td>
                <td>
                  $
                  {(
                    (item.costo || 0) * totalStockProducto(item.producto_id)
                  ).toFixed(2)}
                </td>

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
