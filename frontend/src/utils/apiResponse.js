export const getItems = (response) => {
  if (!response) return [];

  const data = response.data ?? response;

  if (Array.isArray(data)) return data;
  if (Array.isArray(data.items)) return data.items;
  if (Array.isArray(data.data)) return data.data;
  if (Array.isArray(data.results)) return data.results;

  return [];
};

export const getItem = (response) => {
  if (!response) return null;

  const data = response.data ?? response;

  if (data.item) return data.item;
  if (data.data && !Array.isArray(data.data)) return data.data;

  return data;
};

export const getErrorMessage = (error, fallback = "Ocurrió un error") => {
  return (
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    fallback
  );
};

export const formatDate = (value) => {
  if (!value) return "Sin fecha";

  try {
    let dateValue = value;

    if (value?._seconds) {
      dateValue = new Date(value._seconds * 1000);
    } else if (value?.seconds) {
      dateValue = new Date(value.seconds * 1000);
    } else {
      dateValue = new Date(value);
    }

    if (Number.isNaN(dateValue.getTime())) {
      return "Sin fecha";
    }

    return dateValue.toLocaleString("es-MX", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "Sin fecha";
  }
};

export const formatCurrency = (value) => {
  const number = Number(value || 0);

  return number.toLocaleString("es-MX", {
    style: "currency",
    currency: "MXN",
  });
};

export const formatNumber = (value) => {
  const number = Number(value || 0);

  return number.toLocaleString("es-MX");
};
