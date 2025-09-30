import React, { useState, useEffect } from 'react';
import Spinner from '../components/spinner';
import { allTipoVentas } from '../api/tipoVentas';
import { tipoVenta } from '../api/ventas';
/* import './ProductEntryForm.css'; // si querés estilos personalizados */

export const TipoVentas = () => {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState();
  const [tipoVentas, setTipoVentas] = useState([]);
  const [modal, setModal] = useState(false);

  const [formData, setFormData] = useState({
    product: '',
    quantity: '',
    supplier: '',
    date: '',
    comments: '',
  });

  useEffect(() => {
    fetchTipoVenta();
  }, []);

  const fetchTipoVenta = async () => {
    try {
      setLoading(true);
      console.log('dddddddddddddddddd');
      const resp = await allTipoVentas();
      console.log('tipoVenas ', resp);
      setTipoVentas(resp);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const modalNew = () => {
    setModal(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Enviando:', formData);
    // acá va el fetch o axios.post
  };

  return (
    <div className=" py-4" style={{ backgroundColor: 'rgb(54, 98, 110)' }}>
      {modal && (
        <form
          onSubmit={handleSubmit}
          className="mx-auto"
          style={{ maxWidth: 600 }}
        >
          <h3 className="text-white mb-4">Record Product Entry</h3>

          <div className="mb-3">
            <label className="form-label text-white">Product</label>
            <select
              name="product"
              className="form-select text-white border-secondary"
              style={{ backgroundColor: 'rgb(7, 38, 46)' }}
              value={formData.product}
              onChange={handleChange}
            >
              <option value="">Select Product</option>
              <option value="one">One</option>
              <option value="two">Two</option>
              <option value="three">Three</option>
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label text-white">Quantity</label>
            <input
              type="number"
              name="quantity"
              className="form-control  text-white border-secondary"
              style={{ backgroundColor: 'rgb(89, 152, 160)' }}
              placeholder="Enter Quantity"
              value={formData.quantity}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label className="form-label text-white">Supplier</label>
            <select
              name="supplier"
              className="form-select bg-dark text-white border-secondary"
              value={formData.supplier}
              onChange={handleChange}
            >
              <option value="">Select Supplier</option>
              <option value="prov1">Proveedor 1</option>
              <option value="prov2">Proveedor 2</option>
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label text-white">Reception Date</label>
            <input
              type="date"
              name="date"
              className="form-control bg-dark text-white border-secondary"
              value={formData.date}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label className="form-label text-white">Comments</label>
            <textarea
              name="comments"
              className="form-control bg-dark text-white border-secondary"
              placeholder="Add comments"
              rows={4}
              value={formData.comments}
              onChange={handleChange}
            ></textarea>
          </div>

          <div className="d-flex justify-end">
            <button type="submit" className="btn btn-success fw-bold">
              Record Entry
            </button>
          </div>
        </form>
      )}

      {!modal && (
        <div className="container-fluid p-1">
          <div className="d-flex align-items-center mb-1">
            <h2 className="ms-2 fw-bold text-white">🚚 Tipo Ventas</h2>

            <div className="d-flex flex-grow-1 justify-content-star ms-3">
              <button
                type="button"
                className="btn btn-success btn-ms d-flex align-items-center gap-2"
              >
                <span className="d-none d-sm-inline">Nuevo</span>
                <i className="bi bi-plus-circle"></i>
              </button>
            </div>
          </div>

          <div className="container-sm px-4 py-3">
            <div className="table-responsive">
              <table className="mi-tabla">
                <thead>
                  <tr>
                    <th>Tipo Venta</th>
                    <th>Descuento</th>
                  </tr>
                </thead>
                <tbody>
                  {tipoVentas.map((item) => (
                    <tr key={item.id_tipo} onClick={modalNew}>
                      <td>{item.tipoVenta}</td>
                      <td>{item.porcentajeVenta}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/*     {modal && (
          <>
            <div className="container-padre"></div>
            <Modal
              show={modal}
              onHide={modalNew}
              size="md"
              backdrop="static"
              keyboard={false}
            >
              <Modal.Header closeButton className="bg-info">
                <Modal.Title>
                  {' '}
                  {isEdition ? 'Actualizar Proveedor' : 'Nuevo Proveedor'}
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                {inputs.map((input, index) => (
                  <div className="py-1 fw-bold" key={index}>
                    <label>{input.label}</label>
                    <input
                      className="form-control rounded"
                      type="text"
                      id={input.nombre}
                      placeholder={`Ingrese su ${input.label.toLowerCase()}`}
                      value={nuevoProveedor[input.nombre] || ''}
                      onChange={handleInputChange}
                    />
                  </div>
                ))}
              </Modal.Body>

              <Modal.Footer className="justify-content-center">
                <Button
                  variant="success"
                  className="btn-lg w-50"
                  onClick={isEdition ? updateProveedor : insertarProveedor}
                >
                  {isEdition ? 'Actualizar      ✅' : 'Aceptar    ✅'}
                </Button>
              </Modal.Footer>
            </Modal>
          </>
        )} */}
        </div>
      )}
      {/*   <Spinner loading={loading} msg={msg} /> */}
      {/* mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm */}
    </div>
  );
};
