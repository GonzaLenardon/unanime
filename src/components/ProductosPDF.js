import jsPDF from 'jspdf';
import 'jspdf-autotable';

const ProductosPDF = ({ productos }) => {
  const generarPDF = () => {
    const doc = new jsPDF();

    // Título
    doc.setFontSize(18);
    doc.text('Listado de Productos', 14, 20);

    // Cabecera de tabla
    const columnas = [
      { header: 'Código', dataKey: 'codigo' },
      { header: 'Nombre', dataKey: 'nombre' },
      { header: 'Precio', dataKey: 'precio' },
      { header: 'Stock', dataKey: 'stock' },
    ];

    // Data del array de productos
    const rows = productos.map((prod) => ({
      codigo: prod.codigo || '-', // o prod.id si no tenés un campo `codigo`
      nombre: prod.nombre,
      precio: `$${prod.precio}`,
      stock: prod.stock,
    }));

    // Insertar tabla
    doc.autoTable({
      startY: 30,
      columns: columnas,
      body: rows,
    });

    // Guardar o abrir PDF
    doc.save('productos.pdf');
  };

  return (
    <button className="btn btn-primary" onClick={generarPDF}>
      Generar PDF
    </button>
  );
};

export default ProductosPDF;
