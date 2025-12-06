import axios from 'axios';
const url = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const instance = axios.create({
  baseURL: url,
  withCredentials: true,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Estado global para el spinner
let isShowingSessionExpired = false;

// Request interceptor
instance.interceptors.request.use(
  (config) => {
    // ✅ CAMBIO: usar process.env.NODE_ENV en lugar de import.meta.env.DEV
    if (process.env.NODE_ENV === 'development') {
      console.log(`📤 ${config.method.toUpperCase()} ${config.url}`);
    }
    return config;
  },
  (error) => {
    console.log('Error en request');
    console.error('❌ Error en request:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
instance.interceptors.response.use(
  (response) => {
    // ✅ CAMBIO: usar process.env.NODE_ENV en lugar de import.meta.env.DEV
    if (process.env.NODE_ENV === 'development') {
      console.log(`✅ ${response.status} - ${response.config.url}`);
    }
    return response;
  },
  (error) => {
    // Token expirado o inválido
    if (error.response?.status === 401 && !isShowingSessionExpired) {
      isShowingSessionExpired = true;
      console.log('🔒 Sesión expirada - Redirigiendo...');

      // Crear y mostrar spinner
      const spinnerOverlay = document.createElement('div');
      spinnerOverlay.id = 'session-expired-spinner';
      spinnerOverlay.innerHTML = `
        <div 
          class="position-fixed top-0 start-0 w-100 h-100 d-flex flex-column 
                 justify-content-center align-items-center"
          style="background-color: rgba(0,0,0,.9); z-index:9999;"
        >
          <div 
            class="spinner-border text-primary"
            role="status"
            style="width:3rem; height:3rem;"
          ></div>

          <span class="text-primary fs-3 fw-bold mt-3">
            Sesión expirada
          </span>
        </div>
      `;

      document.body.appendChild(spinnerOverlay);

      // Esperar 4 segundos y redirigir
      setTimeout(() => {
        localStorage.clear();
        window.location.href = '/';
      }, 4000);
    }

    // Sin conexión
    if (error.code === 'ERR_NETWORK') {
      console.error('🌐 Sin conexión al servidor');
    }

    // Timeout
    if (error.code === 'ECONNABORTED') {
      console.error('⏱️ La petición tardó demasiado');
    }

    return Promise.reject(error);
  }
);

export default instance;
export { url };
