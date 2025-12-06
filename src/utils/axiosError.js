export const getAxiosErrorMessage = (error) => {
  return (
    error?.response?.data?.mensaje ||
    error?.response?.data?.error ||
    error?.response?.data?.message ||
    error?.message ||
    'Error desconocido'
  );
};
