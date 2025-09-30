import React from 'react';
import jsPDF from 'jspdf';
import JsBarcode from 'jsbarcode';

const ListadoConCodigos = ({ productos }) => {
  console.log('productos ', productos);
  const generarPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    const margenX = 20;
    const margenY = 20;

    const barcodeWidth = 60;
    const barcodeHeight = 30;

    let y = margenY;

    productos.forEach((producto, index) => {
      doc.setFontSize(11);

      // COLUMNA IZQUIERDA – Datos descriptivos
      doc.text(`Producto: ${producto.nombre}`, margenX, y);
      doc.text(`Marca: ${producto.marca}`, margenX, y + 6);
      doc.text(`Modelo: ${producto.modelo}`, margenX, y + 12);
      doc.text(`Color: ${producto.color}`, margenX, y + 18);
      doc.text(`Talle: ${producto.talle}`, margenX, y + 24);

      // COLUMNA DERECHA – Código de barras
      const canvas = document.createElement('canvas');
      JsBarcode(canvas, producto.codigo, {
        format: 'CODE128',
        width: 1, // más angosto
        height: barcodeHeight,
        displayValue: false,
      });

      const barcodeImage = canvas.toDataURL('image/png');

      const xBarcode = pageWidth - margenX - barcodeWidth;
      const yBarcode = y;

      doc.addImage(
        barcodeImage,
        'PNG',
        xBarcode,
        yBarcode,
        barcodeWidth,
        barcodeHeight
      );

      // Texto debajo del código
      const codigoText = `${producto.codigo}`;
      const textWidth = doc.getTextWidth(codigoText);
      const xText = xBarcode + (barcodeWidth - textWidth) / 2;
      doc.text(codigoText, xText, yBarcode + barcodeHeight + 5);

      // Avanzamos hacia abajo
      y += 40;

      if (y + 40 > pageHeight - margenY) {
        doc.addPage();
        y = margenY;
      }
    });

    doc.save('productos_codigos.pdf');
  };

  return (
    <button className="btn btn-success" onClick={generarPDF}>
      Generar PDF con Códigos de Barras
    </button>
  );
};

export default ListadoConCodigos;
