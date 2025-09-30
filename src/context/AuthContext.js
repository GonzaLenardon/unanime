import { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../api/allUsuarios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const checkSession = async () => {
    try {
      console.log('Arranco desde checksission y llamo a Auth');
      const res = await auth();
      console.log('Auth =>', res);
      setUser(res);
      setIsAdmin(res.rol === 'supervisor');
      return res; // ✅ devolvés el usuario
    } catch (err) {
      setUser(null);
    } finally {
      setLoadingUser(false);
    }
  };

  const userLogout = () => {
    setUser(null);
    // También podrías hacer un logout en el backend o limpiar cookies
  };

  useEffect(() => {
    checkSession();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loadingUser,
        checkSession,
        userLogout,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
