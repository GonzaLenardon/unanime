import { ToastContainer, toast, Slide } from 'react-toastify';

export const Toast = () => {
  toast.success('Hola .. Actualizandno ');

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={10000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        transition={Slide}
        style={{ zIndex: 9999 }}
      />
    </>
  );
};
