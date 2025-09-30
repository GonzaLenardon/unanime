import React, { useEffect, useState, useRef } from 'react';
import { allproductos, addProductos, upProductos } from '../api/productos';
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Spinner from '../components/spinner';
import { useGestion } from '../context/UserContext';
import { Modal, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { auth } from '../api/allUsuarios';
import { useAuth } from '../context/AuthContext';

import { comprasProducto, ventasProducto } from '../api/listados';

import ModalVentas from '../components/ModalVentas';
import ModalCompras from '../components/ModalCompras';

const ComprasVentasProductos = () => {
  const [modal, setModal] = useState(false);
  const [nuevoProducto, setNuevoProducto] = useState({});
  const [isEdition, setIsedition] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { productos, fetchProductos } = useGestion();
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(false);
  const [showModalDetalles, setShowModalDetalles] = useState(false);
  const [comprasProd, setComprasProd] = useState([]);

  const [showModalVentas, setShowModalVentas] = useState(false);
  const [ventasProd, setVentasProd] = useState([]);
  const scrollRef = useRef(null);

  const { user } = useAuth();
  const navigator = useNavigate();

  useEffect(() => {
    if (!user) {
      navigator('/');
      return; // ⛔ importante: evita que siga ejecutando fetchData
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        await fetchProductos();
      } catch (error) {
        setMsg(error.message || 'Error al obtener productos');
        console.log('Error desde productos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  useEffect(() => {
    console.log(' MMMMMMMMMM ', nuevoProducto);
  }, [nuevoProducto]);

  const modalNew = () => {
    setModal(!modal);
    setNuevoProducto({});
    setIsedition(false);
  };

  const productosFiltrados = productos.filter(
    (p) =>
      p.codigo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.nombre?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleModalDetalles = async (idProd) => {
    try {
      setMsg('Buscando compras ...');
      setLoading(true);
      const resp = await comprasProducto(idProd);
      setComprasProd(resp.data);
      setShowModalDetalles(true);
    } catch (error) {
      console.error(
        'Error al consultar las compras del Productos:',
        error.message
      );
    } finally {
      setLoading(false);
      setMsg();
    }
  };

  const handleModalVentas = async (idProd) => {
    try {
      setMsg('Buscando ventas ...');
      setLoading(true);
      const resp = await ventasProducto(idProd);
      console.log('Ventas por producto', resp);
      setVentasProd(resp.data);
      setShowModalVentas(true);
    } catch (error) {
      console.error(
        'Error al consultar las compras del Productos:',
        error.message
      );
    } finally {
      setLoading(false);
      setMsg();
    }
  };

  const handleCloseModalDetalles = () => {
    setShowModalDetalles(false);
    setComprasProd([]);
  };

  const handleCloseVentas = () => {
    setShowModalVentas(false);
    setVentasProd([]);
  };

  return (
    <div className="container-fluid p-1">
      <div className="contenedorSeccion1">
        <p className=" m-0 ml" style={{ fontSize: '24px' }}>
          🗒️{' '}
        </p>
        <p className="tituloSeccion">Compras / Ventas</p>
      </div>

      {/* Campo de búsqueda por código */}
      <div className="card-body myNavBar mb-3">
        <div className="d-flex flex-wrap align-items-end gap-3">
          <div className="d-flex flex-column flex-md-row w-100 justify-content-center align-items-center gap-1 gap-md-5 p-2">
            <label className="fs-5 fs-md-3 fw-bold mb-2 mb-md-0">
              Buscar producto:
            </label>
            <input
              type="text"
              className="form-control"
              style={{ height: '50px', width: '100%', maxWidth: '500px' }}
              placeholder="Buscar por código de producto..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                if (scrollRef.current) {
                  scrollRef.current.scrollTop = 0;
                }
              }}
            />
            <button
              type="button"
              className="btn btn-primary btn-ms d-flex align-items-center gap-2"
              onClick={() => setSearchTerm('')}
            >
              <i className="bi bi-x-circle"></i>
              Limpiar
            </button>
          </div>

          {/*   <div className="d-flex  ms-5">
            <button
              type="button"
              className="btn btn-primary btn-ms d-flex align-items-center gap-2"
              onClick={() => setSearchTerm('')}
            >
              <i className="bi bi-x-circle"></i>
              Limpiar
            </button>
          </div> */}
        </div>
      </div>
      <div className="container-tabla">
        <table className="table table-success table-striped table-hover ">
          <thead>
            <tr>
              <th
                scope="col"
                className="d-md-table-cell"
                style={{ width: '25%' }}
              >
                Nombre
              </th>
              <th scope="col" className="d-none d-md-table-cell">
                Marca
              </th>
              <th scope="col" className="d-none d-md-table-cell">
                Talle
              </th>
              <th scope="col" className="d-none d-md-table-cell">
                Modelo
              </th>
              <th scope="col" className="d-none d-md-table-cell">
                Color
              </th>

              <th scope="col" className="d-none d-md-table-cell text-end">
                Precio Venta
              </th>
              <th scope="col" className="d-none d-md-table-cell text-end">
                Stock Total
              </th>

              <th scope="col" className="d-md-table-cell text-center">
                Ventas
              </th>
              <th scope="col" className="d-md-table-cell text-center">
                Compras
              </th>
            </tr>
          </thead>
          <tbody>
            {productosFiltrados.map((p, index) => (
              <tr
                key={index}
                /*  onClick={() => handleUpdate(p)} */
                style={{ cursor: 'pointer' }}
              >
                <td className="d-md-table-cell">{p.nombre}</td>
                <td className="d-none d-md-table-cell">{p.marca}</td>
                <td className="d-none d-md-table-cell">{p.talle}</td>
                <td className="d-none d-md-table-cell">{p.modelo}</td>
                <td className="d-none d-md-table-cell">{p.color}</td>

                <td className="d-none d-md-table-cell text-end">
                  $ {p.precio_venta.toFixed(2)}
                </td>
                <td className="d-none d-md-table-cell text-end">
                  {p.stock_total_producto}
                </td>

                <td className="d-md-table-cell text-center">
                  <button
                    className="btn btn-sm btn-success"
                    onClick={() => handleModalVentas(p.id_producto)}
                    style={{ width: '100px' }}
                  >
                    <span className="d-sm-inline w-5">Ventas</span>
                    🔎
                  </button>
                </td>

                <td className="d-md-table-cell text-center">
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={() => {
                      handleModalDetalles(p.id_producto);
                    }}
                    style={{ width: '100px' }}
                  >
                    <span className="d-sm-inline w-5">Compras</span>
                    🔎
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Spinner loading={loading} msg={msg} />

      {/*     <ModalCompras
        showModalDetalles={showModalDetalles}
        handleClose={handleCloseModalDetalles}
        compras={comprasProd}
      /> */}
      <ModalCompras
        showModalDetalles={showModalDetalles}
        handleClose={handleCloseModalDetalles}
        compras={comprasProd}
        setCompras={setComprasProd}
      />

      <ModalVentas
        showModalVentas={showModalVentas}
        handleCloseVentas={handleCloseVentas}
        ventas={ventasProd}
        setVentas={setVentasProd}
      />

      <ToastContainer
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
      />
    </div>
  );
};

export default ComprasVentasProductos;
