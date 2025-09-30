import { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { jsPDF } from 'jspdf';
import JsBarcode from 'jsbarcode';

const ImprimirProd = ({ productos, label, all }) => {
  const [pdfUrl, setPdfUrl] = useState(null);
  const [show, setShow] = useState(false);

  const handleClose = () => {
    setShow(false);
    setPdfUrl(null);
  };

  const generarPDF = () => {
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: [50, 25],
    });

    const items = all ? productos : Array(1).fill(productos[0]);

    items.forEach((producto, index) => {
      if (index !== 0) doc.addPage();

      const canvas = document.createElement('canvas');
      JsBarcode(canvas, producto.codigo, {
        format: 'CODE128',
        width: 1.5,
        height: 16.8, // 40% más alto
        displayValue: false,
      });

      const barcodeImage = canvas.toDataURL('image/png');

      const pageWidth = doc.internal.pageSize.getWidth();
      const barcodeWidth = 40;
      const barcodeHeight = 16.8;

      const x = (pageWidth - barcodeWidth) / 2;
      const y = 4.5; // ajustado para que todo entre

      // ➕ Texto arriba del código
      const descripcion = `${producto.nombre} - ${producto.marca} - ${producto.talle} - ${producto.modelo}`;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7);
      const descWidth = doc.getTextWidth(descripcion);
      const descX = (pageWidth - descWidth) / 2;
      doc.text(descripcion, descX, y - 2); // arriba del código

      // Código de barras
      doc.addImage(barcodeImage, 'PNG', x, y, barcodeWidth, barcodeHeight);

      // Texto debajo del código (código del producto)
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      const text = producto.codigo;
      const textWidth = doc.getTextWidth(text);
      const textX = (pageWidth - textWidth) / 2;
      const textY = y + barcodeHeight + 2.5; // antes daba 26.3, ahora queda en ~23.8
      doc.text(text, textX, textY);
    });

    const blob = doc.output('blob');
    const url = URL.createObjectURL(blob);
    setPdfUrl(url);
    setShow(true);
  };

  return (
    <>
      <button
        className="btn btn-sm btn-warning"
        style={{ minWidth: '80px' }}
        onClick={(e) => {
          e.stopPropagation();
          generarPDF();
        }}
      >
        {label}
      </button>

      <Modal show={show} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Vista previa de etiqueta</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {pdfUrl && (
            <iframe
              id="pdf-preview"
              title="Vista previa PDF"
              src={pdfUrl}
              width="100%"
              height="500px"
              style={{ border: 'none' }}
            />
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cerrar
          </Button>
          <a href={pdfUrl} download="etiqueta_codigo.pdf">
            <Button variant="primary">Descargar PDF</Button>
          </a>
          <Button
            variant="warning"
            onClick={() => {
              const iframe = document.getElementById('pdf-preview');
              iframe?.contentWindow?.print();
            }}
          >
            Imprimir PDF
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ImprimirProd;
