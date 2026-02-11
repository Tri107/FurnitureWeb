const API_URL = "http://localhost:9999/api";


// 🔐 Helper tự động thêm token vào header (GIỐNG interceptor axios)
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");

  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};


// Helper xử lý response an toàn
const handleResponse = async (res) => {
  const text = await res.text();

  try {
    const data = JSON.parse(text);

    // Nếu token hết hạn hoặc unauthorized → auto logout
    if (res.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
      throw new Error("Phiên đăng nhập đã hết hạn");
    }

    if (!res.ok) {
      throw new Error(data.message || "Request failed");
    }

    return data;
  } catch {
    throw new Error("Server response is not valid JSON");
  }
};


// ================= AUTH =================

export const registerUser = async (data) => {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: getAuthHeaders(), // 🔥 dùng header mới
    body: JSON.stringify(data),
  });

  return handleResponse(res);
};


export const loginUser = async (data) => {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  return handleResponse(res);
};


export const verifyOtp = async (data) => {
  const res = await fetch(`${API_URL}/auth/register/verify`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  return handleResponse(res);
};


export const googleLogin = async (data) => {
  const res = await fetch(`${API_URL}/auth/google-login`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  return handleResponse(res);
};



