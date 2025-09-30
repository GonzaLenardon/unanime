import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';

export const ModalDel = ({
  ventaSeleccionada,
  showDeleteModal,
  onClose,
  onDelete, // ahora el padre se encarga del delete
  tipoTransaccion,
}) => {
  return (
    <Modal
      show={showDeleteModal}
      onHide={onClose}
      centered
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header closeButton className="bg-danger">
        <Modal.Title className="text-white">Confirmar eliminación</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          <strong>
            ¿Estás seguro que deseas eliminar la {tipoTransaccion} ?
          </strong>
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose} className="mx-5">
          Cancelar
        </Button>

        <Button
          variant="danger"
          onClick={() =>
            onDelete(
              ventaSeleccionada?.id_venta ||
                ventaSeleccionada?.compra_id ||
                ventaSeleccionada?.id_compra
            )
          }
        >
          Aceptar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
