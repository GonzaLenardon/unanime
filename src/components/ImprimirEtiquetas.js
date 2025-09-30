import { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import JsBarcode from 'jsbarcode';

export const ImprimirEtiquetas = ({ productos }) => {
  const [htmlUrl, setHtmlUrl] = useState(null);
  const [show, setShow] = useState(false);

  const generarHTMLyMostrar = () => {
    const etiquetas = productos.flatMap((p) => [p, p]); // duplicar cada producto
    let contenido = `
      <html>
        <head>
          <style>
            body { font-family: sans-serif; padding: 4mm; }
            .fila { display: flex; margin-bottom: 4mm; }
            .etiqueta {
              width: 5cm;
              height: 2.5cm;
              border: 1px solid #ccc;
              margin-right: 4mm;
              padding: 2mm;
              box-sizing: border-box;
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
            }
            canvas {
              display: block;
              margin-top: 1mm;
              max-width: 100%;
              height: auto;
            }
          </style>
        </head>
        <body>
    `;

    for (let i = 0; i < etiquetas.length; i += 2) {
      contenido += `<div class="fila">`;
      for (let j = 0; j < 2; j++) {
        const idx = i + j;
        const p = etiquetas[idx];
        if (!p) continue;
        contenido += `
          <div class="etiqueta">
            <div style="font-size:10px;text-align:center;">
              ${p.nombre}<br />
              ${p.codigo}
            </div>
            <canvas id="barcode-${idx}"></canvas>
          </div>
        `;
      }
      contenido += `</div>`;
    }

    contenido += `
      <script src="https://cdn.jsdelivr.net/npm/jsbarcode@3.11.5/dist/JsBarcode.all.min.js"></script>
      <script>
        window.onload = function () {
          ${etiquetas
            .map(
              (p, idx) => `
            JsBarcode("#barcode-${idx}", "${p.codigo}", {
              format: "CODE128",
              width: 1,
              height: 30,
              displayValue: false
            });
          `
            )
            .join('\n')}
        };
      </script>
    </body></html>`;

    const blob = new Blob([contenido], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    setHtmlUrl(url);
    setShow(true);
  };

  return (
    <>
      <Button variant="success" onClick={generarHTMLyMostrar}>
        Vista previa etiquetas
      </Button>

      <Modal show={show} onHide={() => setShow(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Vista previa de etiquetas</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {htmlUrl && (
            <iframe
              id="etiqueta-preview"
              src={htmlUrl}
              title="Vista previa etiquetas"
              width="100%"
              height="500px"
              style={{ border: 'none' }}
            ></iframe>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShow(false)}>
            Cerrar
          </Button>
          <Button
            variant="warning"
            onClick={() => {
              const iframe = document.getElementById('etiqueta-preview');
              iframe?.contentWindow?.print();
            }}
          >
            Imprimir
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
