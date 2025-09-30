import { useState, useEffect } from 'react';
import { transferirStock } from '../api/ventas';
import Spinner from './spinner';

function ModalTransferencia({ producto, onTransferir, onClose }) {
  const [origenId, setOrigenId] = useState('');
  const [destinoId, setDestinoId] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(false);
  const id_usuario = localStorage.getItem('id_Usuario');

  const sucursales = producto.stock_por_sucursal;
  console.log('sucrusales', sucursales);

  const handleSubmit = async () => {
    if (origenId === destinoId) {
      alert('La sucursal de origen y destino deben ser distintas.');
      return;
    }

    const origen = sucursales.find((s) => s.id_sucursal === parseInt(origenId));
    if (cantidad > origen.stock_total) {
      alert('La cantidad supera el stock disponible.');
      return;
    }

    const data = {
      productoId: producto.id_producto,
      origenId: parseInt(origenId),
      destinoId: parseInt(destinoId),
      cantidad: parseInt(cantidad),
      id_usuario: parseInt(id_usuario),
    };

    try {
      setLoading(true);
      setMsg('Registrando transferencia ... ');
      const resp = await transferirStock(data);
    } catch (error) {
      console.error('Error al transferir:', error.message);
      setMsg(error.message);
    } finally {
      await new Promise((resolve) => {
        setTimeout(resolve, 3000);
      });
      setLoading(false);
      setMsg('');

      // Limpiar campos
      setCantidad('');
      setDestinoId('');
      setOrigenId('');
    }
  };

  useEffect(() => {
    console.log('first', origenId);
  }, [origenId]);

  return (
    <div
      className="modal show d-block"
      style={{ backgroundColor: 'rgba(1, 16, 15, 0.8)' }}
      tabIndex="-1"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header bg-info">
            <h5 className="modal-title">
              Transferir stock de "{producto.nombre}"
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>

          <div className="modal-body">
            <div className="mb-2">
              <label className="fw-bold">Sucursal de origen:</label>
              <select
                className="form-select"
                style={{ backgroundColor: 'rgba(193, 227, 227, 0.8)' }}
                value={origenId}
                onChange={(e) => setOrigenId(e.target.value)}
              >
                <option value="">Seleccionar...</option>
                {sucursales.map((s) => {
                  const sinStock =
                    s.stock_total === null || s.stock_total === 0;

                  return (
                    <option
                      key={s.id_sucursal}
                      value={s.id_sucursal}
                      disabled={sinStock}
                    >
                      {s.nombre_sucursal}{' '}
                      {s.stock_total === null || s.stock_total === 0
                        ? '(Sin stock cargado)'
                        : `(Stock: ${s.stock_total})`}
                    </option>
                  );
                })}
              </select>
            </div>

            <div className="mb-2">
              <label className="fw-bold">Sucursal de destino:</label>
              <select
                className="form-select"
                style={{ backgroundColor: 'rgba(193, 227, 227, 0.8)' }}
                value={destinoId}
                onChange={(e) => setDestinoId(e.target.value)}
              >
                <option value="">Seleccionar...</option>
                {sucursales
                  .filter((s) => s.id_sucursal?.toString() !== origenId)
                  .map((s) => (
                    <option key={s.id_sucursal} value={s.id_sucursal}>
                      {s.nombre_sucursal}
                    </option>
                  ))}
              </select>
            </div>

            <div className="mb-2">
              <label className="fw-bold">Cantidad</label>
              <input
                type="number"
                className="form-control"
                value={cantidad}
                min="1"
                max={
                  sucursales.find((s) => s.id_sucursal === parseInt(origenId))
                    ?.stock_total || ''
                }
                onChange={(e) => setCantidad(e.target.value)}
                disabled={
                  sucursales.find((s) => s.id_sucursal === parseInt(origenId))
                    ?.stock_total === 0
                }
              />
            </div>
            <label></label>
          </div>

          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button
              className="btn btn-primary"
              onClick={handleSubmit}
              disabled={!(origenId && destinoId && cantidad)}
            >
              Transferir
            </button>
          </div>
        </div>
      </div>

      <Spinner loading={loading} msg={msg} />
    </div>
  );
}

export default ModalTransferencia;
