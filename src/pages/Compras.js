import React, { useState, useEffect, useRef } from 'react';
import { addCompra } from '../api/compras';
import Spinner from '../components/spinner';
import { useNavigate } from 'react-router-dom';
import { useGestion } from '../context/UserContext';
import TablaProductos from '../components/TablaProductos';
import BuscarProducto from './BuscarProducto';

const Compras = () => {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState();
  const navigator = useNavigate();
  const [itemsVenta, setItemsVenta] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const { fetchProductos, productos, fetchProveedores, proveedores } =
    useGestion();
  const inputRef = useRef(null);

  const [compra, setCompra] = useState({
    proveedor_id: '',
    fecha: new Date().toISOString().split('T')[0],
    numero: '',
    monto: '',
    detalles: [],
  });

  // Obtener id_sucursal para estilos dinámicos

  const id_sucursal = localStorage.getItem('sucursal_id');

  const estilos =
    id_sucursal === '1'
      ? {
          gradiente: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          colorPrincipal: '#667eea',
          fondoClaro: 'rgba(102, 126, 234, 0.08)',
          iconoStock: 'bi-boxes',
        }
      : {
          gradiente: 'linear-gradient(135deg, #f857a6 0%, #ff5858 100%)',
          colorPrincipal: '#f857a6',
          fondoClaro: 'rgba(248, 87, 166, 0.08)',
          iconoStock: 'bi-shop-window',
        };

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
      cantidad: item.cantidad,
    }));

    const compraFinal = {
      fecha: compra.fecha,
      monto: totalCompra(),
      proveedor_id: Number(compra.proveedor_id),
      numero: compra.numero,
      detalles,
    };

    console.log('Compra lista para enviar:', compraFinal);

    try {
      setLoading(true);
      const resp = await addCompra(compraFinal);
      console.log('Compra guardada', resp.data);
      setMsg(resp.data.message);
    } catch (error) {
      let msg = 'Error inesperado';

      if (error.response?.data?.error) {
        msg = error.response.data.error;
      } else if (error.code === 'ECONNABORTED') {
        msg = 'La consulta tardó más de 10 segundos. Verifica tu conexión.';
      } else if (typeof navigator !== 'undefined' && !navigator.onLine) {
        msg = 'No tienes conexión a Internet.';
      } else if (error.message) {
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

    console.log('Salgo de agregarproducto');
  };

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
            <i className={`bi ${estilos.iconoStock} text-white fs-3`}></i>
          </div>
          <div>
            <h2
              className="mb-0 fw-bold"
              style={{ color: estilos.colorPrincipal }}
            >
              Registro de Compras
            </h2>
            <p className="mb-0" style={{ color: estilos.colorPrincipal }}>
              Gestiona el ingreso de stock y productos
            </p>
          </div>
        </div>

        {/* Card de datos de compra */}

        <div
          className="card border-0 shadow-sm mb-3"
          style={{ borderRadius: '15px' }}
        >
          <div
            className="card-header border-0 text-white py-3"
            style={{
              background: estilos.gradiente,
              borderRadius: '15px 15px 0 0',
            }}
          >
            <h5 className="mb-0 fw-bold">
              <i className="bi bi-file-text me-2"></i>
              Datos de la Compra
            </h5>
          </div>

          <div className="card-body p-4">
            <div className="row g-3">
              {/* Proveedor */}
              <div className="col-12 col-md-4">
                <label className="form-label fw-semibold small text-muted">
                  <i
                    className="bi bi-truck me-2"
                    style={{ color: estilos.colorPrincipal }}
                  ></i>
                  PROVEEDOR
                </label>
                <select
                  className="form-select form-select-lg border-2"
                  name="proveedor_id"
                  value={compra.proveedor_id}
                  onChange={handleCompra}
                  style={{
                    borderRadius: '12px',
                    borderColor: compra.proveedor_id
                      ? estilos.colorPrincipal
                      : '#dee2e6',
                  }}
                >
                  <option value="">Seleccionar proveedor</option>
                  {proveedores.map((items) => (
                    <option key={items.id_proveedor} value={items.id_proveedor}>
                      {items.nombre}
                    </option>
                  ))}
                </select>
              </div>

              {/* Fecha */}
              <div className="col-12 col-md-4">
                <label className="form-label fw-semibold small text-muted">
                  <i
                    className="bi bi-calendar-event me-2"
                    style={{ color: estilos.colorPrincipal }}
                  ></i>
                  FECHA
                </label>
                <input
                  type="date"
                  className="form-control form-control-lg border-2"
                  name="fecha"
                  value={compra.fecha}
                  onChange={handleCompra}
                  style={{
                    borderRadius: '12px',
                    borderColor: compra.fecha
                      ? estilos.colorPrincipal
                      : '#dee2e6',
                  }}
                />
              </div>

              {/* Número de factura */}
              <div className="col-12 col-md-4">
                <label className="form-label fw-semibold small text-muted">
                  <i
                    className="bi bi-receipt me-2"
                    style={{ color: estilos.colorPrincipal }}
                  ></i>
                  FACTURA / COMPROBANTE
                </label>
                <input
                  type="text"
                  className="form-control form-control-lg border-2"
                  placeholder="Ej: FC 001-00001234"
                  name="numero"
                  value={compra.numero}
                  onChange={handleCompra}
                  style={{
                    borderRadius: '12px',
                    borderColor: compra.numero
                      ? estilos.colorPrincipal
                      : '#dee2e6',
                  }}
                />
              </div>
            </div>

            {/* Indicador de validación */}
            <div className="mt-3">
              {!validarCompraCompleta() && itemsVenta.length > 0 && (
                <div
                  className="alert d-flex align-items-center gap-2"
                  style={{
                    backgroundColor: '#fff3cd',
                    border: '1px solid #ffc107',
                    borderRadius: '12px',
                  }}
                >
                  <i className="bi bi-exclamation-triangle text-warning"></i>
                  <small>
                    Completa todos los campos y verifica que los productos
                    tengan costo y cantidad válidos
                  </small>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Buscador de productos */}
        <BuscarProducto
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          productos={productos}
          agregarProductoAVenta={agregarProductoAVenta}
        />

        {/* Tabla de productos */}
        {itemsVenta.length > 0 && (
          <div
            className="card border-0 shadow-sm"
            style={{
              borderRadius: '15px',
              minHeight: '55vh',
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
                  <i className="bi bi-basket me-2"></i>
                  Productos a Ingresar
                </h5>
                <span className="badge bg-white bg-opacity-25 px-3 py-2">
                  {itemsVenta.length}{' '}
                  {itemsVenta.length === 1 ? 'producto' : 'productos'}
                </span>
              </div>
            </div>

            {/* Componente tabla */}
            <div className="flex-grow-1 overflow-auto">
              <TablaProductos
                itemsVenta={itemsVenta}
                setItemsVenta={setItemsVenta}
                eliminarProducto={eliminarProducto}
              />
            </div>

            {/* Footer con total */}
            <div
              className="card-footer border-0 p-4"
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '0 0 15px 15px',
              }}
            >
              <div className="row g-3 align-items-center">
                {/* Resumen */}
                <div className="col-12 col-lg-8">
                  <div
                    className="rounded-4 p-3 d-flex flex-column flex-md-row justify-content-between align-items-center gap-3"
                    style={{ backgroundColor: estilos.fondoClaro }}
                  >
                    <div className="d-flex align-items-center gap-3">
                      <div
                        className="rounded-circle d-flex align-items-center justify-content-center"
                        style={{
                          width: '50px',
                          height: '50px',
                          backgroundColor: 'white',
                          border: `2px solid ${estilos.colorPrincipal}`,
                        }}
                      >
                        <i
                          className="bi bi-calculator"
                          style={{
                            color: estilos.colorPrincipal,
                            fontSize: '1.5rem',
                          }}
                        ></i>
                      </div>
                      <div>
                        <small className="text-muted fw-semibold d-block">
                          MONTO TOTAL
                        </small>
                        <div className="d-flex align-items-baseline gap-2">
                          <span
                            className="fs-2 fw-bold"
                            style={{ color: estilos.colorPrincipal }}
                          >
                            ${totalCompra().toFixed(2)}
                          </span>
                          <small className="text-muted">
                            (
                            {itemsVenta.reduce(
                              (sum, item) => sum + item.cantidad,
                              0
                            )}{' '}
                            unidades)
                          </small>
                        </div>
                      </div>
                    </div>

                    {/* Info adicional */}
                    <div className="text-center text-md-end">
                      <small className="text-muted d-block">Proveedor</small>
                      <div className="fw-bold">
                        {compra.proveedor_id
                          ? proveedores.find(
                              (p) => p.id_proveedor == compra.proveedor_id
                            )?.nombre
                          : 'Sin seleccionar'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Botón confirmar */}
                <div className="col-12 col-lg-4">
                  <button
                    className="btn btn-lg w-100 text-white fw-bold shadow"
                    style={{
                      background: validarCompraCompleta()
                        ? estilos.gradiente
                        : '#6c757d',
                      borderRadius: '12px',
                      padding: '14px',
                      border: 'none',
                      transition: 'all 0.3s ease',
                      opacity: validarCompraCompleta() ? 1 : 0.6,
                    }}
                    onClick={construirCompraFinal}
                    disabled={!validarCompraCompleta()}
                    onMouseEnter={(e) => {
                      if (validarCompraCompleta()) {
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = `0 8px 20px ${estilos.colorPrincipal}60`;
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 4px 10px rgba(0,0,0,0.1)';
                    }}
                  >
                    <i className="bi bi-check-circle me-2"></i>
                    Confirmar Compra
                  </button>

                  {!validarCompraCompleta() && (
                    <small className="text-danger d-block text-center mt-2">
                      <i className="bi bi-info-circle me-1"></i>
                      Completa todos los datos
                    </small>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Estado vacío */}
        {itemsVenta.length === 0 && !loading && (
          <div
            className="card border-0 shadow-sm text-center py-5 mt-3"
            style={{ borderRadius: '15px' }}
          >
            <div className="card-body">
              <i
                className={`bi ${estilos.iconoStock} fs-1 mb-3 d-block`}
                style={{ color: estilos.colorPrincipal, opacity: 0.3 }}
              ></i>
              <h4 className="text-muted">Sin productos agregados</h4>
              <p className="text-muted mb-0">
                Busca y agrega productos para registrar la compra
              </p>
            </div>
          </div>
        )}
      </div>

      <Spinner loading={loading} msg={msg} />
    </>
  );
};

export default Compras;
