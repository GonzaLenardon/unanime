import { useState, useEffect, useRef } from 'react';
import { addVenta, tipoVenta } from '../api/ventas';
import Spinner from '../components/spinner';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useGestion } from '../context/UserContext';

/* import { ToastContainer, toast, Slide } from 'react-toastify';
 */ import { getSucursal } from '../api/sucursales';

const Ventas = () => {
  const { productos, fetchProductos } = useGestion([]); // viene del context
  const [itemsVenta, setItemsVenta] = useState([]);
  const [tipoVta, setTipoVta] = useState([]);
  const [tipo, setTipo] = useState({ porcentajeVenta: 0 });
  const [idSucursal, setIdSucursal] = useState();
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [modalSearch, setModalSearch] = useState(false);
  const navigate = useNavigate();
  const inputRef = useRef(null);

  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        await fetchTipoVenta();
        await fetchProductos();
        await fetchSucursal();
        console.log('productos', productos);
      } catch (error) {
        setMsg(error.mensaje);
      } finally {
        setLoading(false);
        inputRef.current?.focus();
      }
    };
    fetchData();
  }, []);

  const fetchTipoVenta = async () => {
    try {
      setLoading(true);
      const resp = await tipoVenta();
      console.log('Tipos de Ventas ... ', resp.data);
      setTipoVta(resp.data);
    } catch (error) {
      console.log('dfafadf', error);
    } finally {
      setLoading(false);
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

  const agregarProductoAVenta = (producto) => {
    const { nombre, id_producto, precio_venta, stock_por_sucursal } = producto;

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
        stock_total: stock_por_sucursal[0].stock_total,
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
      id_usuario: user.id,
      id_tipo_venta: tipo.id_tipo,
      id_sucursal: idSucursal,
      porcentaje_aplicado: tipo.porcentajeVenta,
      /*   monto_descuento: 0, */
      /*  total: totalVenta, */
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

  console.log('Stock por sucursla', stockProductos);

  /*  const productosFiltrados = stockProductos.filter(
    (p) =>
      p.codigo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.nombre?.toLowerCase().includes(searchTerm.toLowerCase())
  ); */

  /* const handleModalSearch = () => setModalSearch(!modalSearch); */

  const productosFiltrados = stockProductos.filter((p) => {
    const textoCompleto =
      `${p.nombre} ${p.marca} ${p.modelo} ${p.talle} ${p.color} ${p.codigo}`
        .toLowerCase()
        .replace(/\s+/g, ''); // Quitamos espacios para búsquedas como "buzocanguromarcaf"

    const termino = searchTerm.toLowerCase().replace(/\s+/g, '');

    return textoCompleto.includes(termino);
  });

  useEffect(() => {
    console.log('ttttttttttttttttttt ', tipo);
  }, []);

  const tventasHabilitadas = tipoVta.filter((tv) => tv.habilitado === true);

  return (
    <>
      <div className="container-fluid py-1 ">
        {/* Header */}

        <div className="contenedorSeccion1">
          <p className=" m-0" style={{ fontSize: '24px' }}>
            🛒{' '}
          </p>

          <p className="tituloSeccion">Ventas</p>
        </div>

        {/* Card de búsqueda */}
        <div className="card shadow-sm rounded-3 mb-1 ">
          <div className="card-body myNavBar px-2">
            <div className="d-flex flex-wrap align-items-end gap-3">
              <div className="d-flex w-100  justify-content-center align-items-center gap-5">
                <label className="fs-5 fs-md-3 fw-bold mb-2 mb-md-0">
                  Buscar Producto
                </label>

                <input
                  type="text"
                  className="form-control"
                  style={{ height: '50px', width: '100%', maxWidth: '500px' }}
                  placeholder="Buscar por nombre + marca + modelo + talle + color"
                  value={searchTerm}
                  ref={inputRef}
                  onChange={(e) => {
                    const value = e.target.value;
                    setSearchTerm(value);

                    const match = stockProductos.find(
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
                  {`Total de Productos : ${productosFiltrados.length} / ${stockProductos.length} `}
                </div>
              </div>
            </div>

            {/* Resultados dinámicos */}
            {searchTerm && stockProductos && (
              /*    <div className="list-group mt-3">
                {productosFiltrados.map((producto) => (
                  <button
                    key={producto.id_producto}
                    className="list-group-item list-group-item-action "
                    onClick={() => {
                      agregarProductoAVenta(producto);
                      setSearchTerm('');
                    }}
                  >
                    {producto.nombre} - cccc {producto.marca} -{' '}
                    {producto.modelo} - {producto.talle} - {producto.color} -{' '}
                    {producto.codigo}
                  </button>
                ))}
              </div> */
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

        {/* Card de tabla y footer */}
        {itemsVenta.length > 0 && (
          <div
            className="card shadow-sm rounded-3 myNavBar"
            style={{ height: '60vh', display: 'flex', flexDirection: 'column' }}
          >
            <div
              className="card-body p-2 flex-grow-1 overflow-auto mx-2"
              style={{ backgroundColor: '#f9f9f9' }}
            >
              <table className="table table-bordered table-hover table-sm mb-0 mt-0">
                <thead className="sticky-header">
                  <tr>
                    <th style={{ width: '40%' }}>Producto</th>
                    <th style={{ width: '10%' }}>Precio</th>
                    <th style={{ width: '10%' }}>Cantidad</th>
                    <th style={{ width: '10%' }}>Stock</th>
                    <th style={{ width: '10%' }}>Subtotal</th>
                    <th style={{ width: '5%' }}>Eliminar</th>
                  </tr>
                </thead>
                <tbody>
                  {itemsVenta.map((item) => (
                    <tr key={item.id_producto}>
                      <td>{item.nombre}</td>
                      <td>${item.precio_venta.toFixed(2)}</td>
                      <td>
                        <input
                          type="number"
                          min="1"
                          value={item.cantidad}
                          className="form-control form-control-sm"
                          max={item.stock_total}
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
                      <td>{item?.stock_total}</td>
                      <td>$ {item.subtotal.toFixed(2)}</td>
                      <td>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => eliminarProducto(item.id_producto)}
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Footer fijo abajo */}
            {/*      <div className="card-footer mx-2 border-top py-3 d-flex flex-wrap align-items-center gap-3">
              <select
                className="form-select w-50"
                value={tipo?.id_tipo || ''}
                onChange={(e) => {
                  const selected = tipoVta.find(
                    (t) => t.id_tipo === parseInt(e.target.value)
                  );
                  setTipo(selected);
                }}
              >
                <option value="" disabled>
                  Tipo Venta
                </option>
                {tventasHabilitadas.map((t) => (
                  <option key={t.id_tipo} value={t.id_tipo}>
                    {t.tipoVenta}
                  </option>
                ))}
              </select>

              <div className="bg-info d-flex flex-colum">
                <h4 className="text-dark fw-bold flex-grow-1 text-end mb-0">
                  Subtotal: ${totalVenta.toFixed(2)}
                </h4>
                <h4 className="text-dark fw-bold flex-grow-1 text-end mb-0">
                  Descuento {tipo?.porcentajeVenta} % : $ {descuento}
                </h4>
                <span className="text-dark fw-bold flex-grow-1 text-end mb-0">
                  Total : $ {subtotal}
                </span>
              </div>

              <button
                className="btn btn-success btn-lg"
                onClick={() => finalizarVenta()}
                disabled={!tipo}
              >
                Confirmar venta ✅
              </button>
            </div> */}
            <div
              className="card-footer border-top p-3 px-5 mt-2 rounded-3 mx-auto"
              style={{ background: '#a9d0d2ff', width: '99%' }}
            >
              <div className="row g-3 align-items-center">
                {/* Selector de tipo de venta */}

                <div className="col-12 col-md-4">
                  <select
                    className="form-select"
                    value={tipo?.id_tipo || ''}
                    onChange={(e) => {
                      const selected = tipoVta.find(
                        (t) => t.id_tipo === parseInt(e.target.value)
                      );
                      setTipo(selected);
                    }}
                  >
                    <option value="" disabled>
                      Tipo Venta
                    </option>
                    {tventasHabilitadas.map((t) => (
                      <option key={t.id_tipo} value={t.id_tipo}>
                        {t.tipoVenta}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Totales */}
                <div className="col-12 col-md-5">
                  <div className="rounded p-2 shadow-sm ">
                    <div className="row mb-1">
                      <div className="col col-8 fw-bold text-end">
                        Subtotal:
                      </div>
                      <div className="col col-4 text-end fw-bold">
                        $ {totalVenta.toFixed(2)}
                      </div>
                    </div>
                    <div className="row mb-1">
                      <div className="col col-8 fw-bold text-end">
                        Dto. {tipo?.porcentajeVenta || 0}%:
                      </div>
                      <div className="col col-4 text-end text-danger fw-bold">
                        - $ {descuento.toFixed(2)}
                      </div>
                    </div>
                    <div className="row">
                      <div className="col col-8 fw-bold text-end">Total:</div>
                      <div className="col col-4 text-end fs-4 fw-bold h5 mb-0">
                        $ {subtotal.toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Botón */}
                <div className="col-12 col-md-3 text-md-end text-center">
                  <button
                    className="btn btn-success btn-lg w-100"
                    onClick={() => finalizarVenta()}
                    disabled={!tipo}
                  >
                    Confirmar venta ✅
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <Spinner loading={loading} msg={msg} />
      {/*    <ToastContainer
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
      /> */}
      {/*  <SearchProductos
        modalSearch={modalSearch}
        handleModalSearch={handleModalSearch}
        productos={productos}
        agregarProductoAVenta={agregarProductoAVenta}
      /> */}
    </>
  );
};

export default Ventas;
