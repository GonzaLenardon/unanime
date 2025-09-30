import { createContext, useContext, useState } from 'react';
import { allproductos } from '../api/productos';
import { allProveedores } from '../api/proveedor';
import { allSucursal, getSucursal } from '../api/sucursales';
// Crear el contexto
const ProductosContext = createContext();

// Proveedor del contexto
export const StockProvider = ({ children }) => {
  const [productos, setProductos] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [dataUser, setDataUser] = useState({ id: '', user: '' });

  /*  const fetchProductos = async () => {
    const resp = await allproductos(); // Dejá que el error suba
    setProductos(resp);
  }; */

  const fetchProductos = async () => {
    try {
      const resp = await allproductos();
      setProductos(resp);
      return true; // Éxito
    } catch (error) {
      // Guardás el error para que el componente pueda mostrarlo (si quiere)
      console.log('catch allProductos ..', error);
      throw error;
    }
  };

  const fetchProveedores = async () => {
    try {
      const resp = await allProveedores();
      console.log(resp);
      setProveedores(resp);
    } catch (error) {
      console.error('Error al obtener Proveedores:', error.message);
    }
  };

  return (
    <ProductosContext.Provider
      value={{
        productos,
        setProductos,
        proveedores,
        setProveedores,
        fetchProductos,
        fetchProveedores,

        dataUser,
      }}
    >
      {children}
    </ProductosContext.Provider>
  );
};

// Hook personalizado para usarlo fácilmente
export const useGestion = () => {
  const context = useContext(ProductosContext);
  if (!context) {
    throw new Error('useProductos debe usarse dentro de <StockProvider>');
  }
  return context;
};
