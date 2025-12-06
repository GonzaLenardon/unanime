import React, { useState, useEffect, useRef } from 'react';

import { addCompra } from '../api/compras';

import Spinner from '../components/spinner';
import { useNavigate } from 'react-router-dom';
import { useGestion } from '../context/UserContext';
import { useAuth } from '../context/AuthContext';
import TablaProductos from '../components/TablaProductos';
import BuscarProducto from './BuscarProducto';

const Compras = () => {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState();
  const navigator = useNavigate();
  const [itemsVenta, setItemsVenta] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  /*   const [modalSearch, setModalSearch] = useState(false);
   */ const [stockSuc, setStockSuc] = useState([]);
  const { fetchProductos, productos, fetchProveedores, proveedores } =
    useGestion();
  const inputRef = useRef(null);
  /*   const { user } = useAuth(); */

  const [compra, setCompra] = useState({
    proveedor_id: '',
    fecha: new Date().toISOString().split('T')[0],
    numero: '',
    monto: '',
    detalles: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([fetchProveedores(), fetchProductos()]);
      setLoading(false);
    };
    fetchData();
  }, []);

  useEffect(() => {
    console.log('obje', itemsVenta);
  }, [itemsVenta]);

  const handleCompra = (e) => {
    const { name, value } = e.target;
    setCompra((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const construirCompraFinal = async () => {
    if (!validarCompraCompleta()) {
      alert('Faltan datos o hay productos con costo o stock en cero.');
      return;
    }

    const detalles = itemsVenta.map((item) => ({
      producto_id: item.producto_id,
      costo: Number(item.costo),
      nombreProducto: item.nombre_producto,
      vencimiento: item.vencimiento,
      cantidad: item.cantidad, // 👈 cantidad total
    }));

    const compraFinal = {
      fecha: compra.fecha,
      monto: totalCompra(),
      /*  id_usuario: user.id, */
      proveedor_id: Number(compra.proveedor_id),
      numero: compra.numero,
      detalles, // 👈 este contiene toda la info de productos y stock
    };

    console.log('Compra lista para enviar:', compraFinal);

    try {
      setLoading(true);
      const resp = await addCompra(compraFinal);
      console.log('Compra guardada', resp.data);
      setMsg(resp.data.message);
    } catch (error) {
      // Este bloque captura errores de Axios y del backend
      let msg = 'Error inesperado';

      // 1. Mensaje del backend (ej: { error: 'Error al registrar la compra' })
      if (error.response?.data?.error) {
        msg = error.response.data.error;
      }
      // 2. Timeout de Axios
      else if (error.code === 'ECONNABORTED') {
        msg = 'La consulta tardó más de 10 segundos. Verifica tu conexión.';
      }
      // 3. Sin conexión a Internet
      else if (typeof navigator !== 'undefined' && !navigator.onLine) {
        msg = 'No tienes conexión a Internet.';
      }
      // 4. Otro error genérico
      else if (error.message) {
        msg = error.message;
      }

      console.error(error);
      setMsg(msg);
    } finally {
      await new Promise((resolve) => setTimeout(resolve, 3000));
      setLoading(false);
      navigator('/home');
    }
  };

  const agregarProductoAVenta = (producto) => {
    const { nombre, modelo, marca, talle, color, codigo, id_producto } =
      producto;

    const existe = itemsVenta.find(
      (item) => item.producto_id === producto.id_producto
    );
    if (existe) return;

    setItemsVenta([
      ...itemsVenta,
      {
        producto_id: id_producto,
        nombre_producto: nombre,
        codigo: codigo,
        modelo: modelo,
        marca: marca,
        talle: talle,
        color: color,
        costo: 1,
        vencimiento: new Date().toISOString().split('T')[0],
        cantidad: 1,
      },
    ]);

    console.log('Salgo de agegarproducto');
  };

  /*   const updateStock = (producto_id, sucursal, stock) => {
    setItemsVenta((prev) =>
      prev.map((item) =>
        item.producto_id === producto_id
          ? {
              ...item,
              detalles: item.detalles.map((s) =>
                s.sucursal === sucursal ? { ...s, stock } : s
              ),
            }
          : item
      )
    );
  }; */

  /*   const handleCostoVencimiento = (producto_id, value, campo) => {
    setItemsVenta((prev) =>
      prev.map((item) =>
        item.producto_id === producto_id ? { ...item, [campo]: value } : item
      )
    );
  };
 */

  const eliminarProducto = (id_producto) => {
    setItemsVenta(
      itemsVenta.filter((item) => item.producto_id !== id_producto)
    );
  };

  const totalCompra = () =>
    itemsVenta.reduce((total, item) => total + item.cantidad * item.costo, 0);

  const validarCompraCompleta = () => {
    const datosBasicosOk = compra.proveedor_id && compra.fecha && compra.numero;
    const sinCostosCero = itemsVenta.every((item) => Number(item.costo) > 0);
    const sinStocksCero = itemsVenta.every((item) => Number(item.cantidad) > 0);

    return datosBasicosOk && sinCostosCero && sinStocksCero;
  };

  /*   const totalStockProducto = (producto_id) => {
    const producto = itemsVenta.find(
      (item) => item.producto_id === producto_id
    );
    if (!producto) return 0;

    return 9;
  }; */

  return (
    <>
      <div className="container-fluid py-1">
        <div className="contenedorSeccion1">
          <p className=" m-0" style={{ fontSize: '24px' }}>
            🛍️
          </p>
          <p className="tituloSeccion">Stock</p>
        </div>

        <div className="d-flex flex-column flex-md-row gap-4  myNavBar  p-3 mb-3 rounded-3">
          <select
            className="form-select w-100 w-md-25"
            name="proveedor_id"
            value={compra.proveedor_id}
            onChange={handleCompra}
          >
            <option value="">Seleccionar proveedor</option>
            {proveedores.map((items) => (
              <option key={items.id_proveedor} value={items.id_proveedor}>
                {items.nombre}
              </option>
            ))}
          </select>

          <input
            type="date"
            className="form-select w-100 w-md-25"
            name="fecha"
            value={compra.fecha}
            onChange={handleCompra}
          />

          <input
            type="text"
            className="form-control w-100 w-md-25"
            placeholder="Factura / Comprobante"
            name="numero"
            value={compra.numero}
            onChange={handleCompra}
          />
        </div>

        <BuscarProducto
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          productos={productos}
          agregarProductoAVenta={agregarProductoAVenta}
        />

        {itemsVenta.length > 0 && (
          <div
            className="card shadow-sm rounded-3 myNavBar"
            style={{ height: '55vh', display: 'flex', flexDirection: 'column' }}
          >
            <TablaProductos
              itemsVenta={itemsVenta}
              setItemsVenta={setItemsVenta}
              /*   handleCostoVencimiento={handleCostoVencimiento} */
              /*   updateStock={updateStock} */
              /*   totalStockProducto={totalStockProducto} */
              eliminarProducto={eliminarProducto}
            />

            <div className="card-footer border-top  mx-2 d-flex flex-wrap align-items-center gap-5">
              <h4 className="text-dark fw-bold flex-grow-1 text-end mb-0">
                Total: {totalCompra().toFixed(2)}
              </h4>

              <button
                className="btn btn-success btn-lg"
                /* onClick={() => console.log('Guardar venta', itemsVenta)} */
                /*  onClick={() => finalizarVenta()}
                disabled={!tipo} */
                onClick={construirCompraFinal}
                disabled={!validarCompraCompleta()}
              >
                Confirmar compra ✅
              </button>
            </div>
          </div>
        )}
      </div>
      <Spinner loading={loading} msg={msg} />
    </>
  );
};

export default Compras;
