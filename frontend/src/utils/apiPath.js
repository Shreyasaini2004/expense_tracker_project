export const BASE_URL = "http://localhost:8000";

export const API_URL = {
  AUTH: {
    LOGIN: "/api/v1/auth/login",
    REGISTER: "/api/v1/auth/register",
    GET_USER_INFO: "/api/v1/auth/getUser",
  },

  DASHBOARD: {
    GET_DATA: "/api/v1/dashboard",
  },

  INCOME: {
    GET_ALL_INCOME: "/api/v1/income/get",
    ADD_INCOME: "/api/v1/income/add",
    DELETE_INCOME: (incomeId) => `/api/v1/income/${incomeId}`, // ✅ function
    DOWNLOAD_INCOME: "/api/v1/income/downloadexcel",
  },

  EXPENSE: {
    GET_ALL_EXPENSE: "/api/v1/expense/get",
    ADD_EXPENSE: "/api/v1/expense/add",
    DELETE_EXPENSE: (expenseId) => `/api/v1/expense/${expenseId}`, // ✅ function
    DOWNLOAD_EXPENSE: "/api/v1/expense/downloadexcel",
    PROCESS_OCR: '/api/v1/expense/process-ocr',
  },

  IMAGE: {
    UPLOAD_IMAGE: "/api/v1/auth/upload-image",
  },
};
