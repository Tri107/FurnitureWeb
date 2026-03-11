const API_URL = "http://localhost:9999/api";

const getAuthHeaders = () => {
  const token = localStorage.getItem("accessToken"); 
  const headers = {
    "Content-Type": "application/json",
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
};

const apiFetch = async (endpoint, method = "GET", body = null, isRetry = false) => {
  const options = {
    method,
    headers: getAuthHeaders(),
    credentials: "include", 
  };
  
  if (body) options.body = JSON.stringify(body);
  
  try {
    let res = await fetch(`${API_URL}${endpoint}`, options);
    // XỬ LÝ HẾT HẠN TOKEN
    if (res.status === 401 && !isRetry) {
      try {
        // gọi API lấy token mới
        const refreshRes = await fetch(`${API_URL}/auth/refresh-token`, {
          method: "POST", // Hoặc GET tùy vào cấu hình Route ở Backend của bạn
          credentials: "include", // Vẫn phải mang theo Cookie
        });

        if (refreshRes.ok) {
          const refreshData = await refreshRes.json();
         
          localStorage.setItem("accessToken", refreshData.accessToken);
          
         
          return await apiFetch(endpoint, method, body, true); 
        } else {
          // Nếu refresh token cũng hết hạn -> Chấp nhận đăng xuất
          throw new Error("Refresh Token Expired");
        }
      } catch (refreshError) {
        // Xóa sạch thông tin và đẩy về trang login
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
        throw new Error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
      }
    }

   
    // XỬ LÝ RESPONSE BÌNH THƯỜNG CÁC MÃ LỖI KHÁC
   
    const text = await res.text();
    let data;
    try {
      data = text ? JSON.parse(text) : {};
    } catch (err) {
      throw new Error("Lỗi hệ thống: Phản hồi từ server không hợp lệ.");
    }

    if (!res.ok) {
      const errorMsg = data.message || `Lỗi ${res.status}: Thao tác thất bại`;
      throw new Error(errorMsg);
    }

    return data;
    
  } catch (error) {
    // Ném lỗi ra ngoài để component (VD: trang Đăng nhập) có thể catch và dùng toast.error() hiển thị
    throw error; 
  }
};

// ================= AUTH =================
export const registerUser = (data) => apiFetch("/auth/register", "POST", data);
export const loginUser    = (data) => apiFetch("/auth/login", "POST", data);
export const verifyOtp    = (data) => apiFetch("/auth/register/verify", "POST", data);
export const googleLogin  = (data) => apiFetch("/auth/google-login", "POST", data);
export const logoutUser   = () => apiFetch("/auth/logout", "POST"); 
// ================= DISCOUNT =================
export const getDiscounts = () => apiFetch("/discounts");
export const createDiscount = (data) => apiFetch("/discounts", "POST", data);
export const updateDiscount = (id, data) => apiFetch(`/discounts/${id}`, "PUT", data);
export const deleteDiscount = (id) => apiFetch(`/discounts/${id}`, "DELETE");
// ================= ACCOUNT (Admin) =================
export const getAccounts = () => apiFetch("/account");
export const getAccountById = (id) => apiFetch(`/account/${id}`);
export const createAccount = (data) => apiFetch("/account", "POST", data);
export const updateAccount = (id, data) => apiFetch(`/account/${id}`, "PUT", data);
export const changeAccountPassword = (id, data) => apiFetch(`/account/${id}/password`, "PUT", data);
export const deleteAccount = (id) => apiFetch(`/account/${id}`, "DELETE");
export const restoreAccount = (id) => apiFetch(`/account/${id}/restore`, "PATCH");
// ================= COLLECTION =================
export const getCollections = () => apiFetch("/collections");
export const createCollection = (data) => apiFetch("/collections", "POST", data);
export const updateCollection = (collectionId, data) => apiFetch(`/collections/${collectionId}`, "PUT", data);
export const deleteCollection = (collectionId) => apiFetch(`/collections/${collectionId}`, "DELETE");
// ================= PAYMENT =================
export const getPayments = () => apiFetch("/payments");
export const createPayment = (data) => apiFetch("/payments", "POST", data);
export const updatePayment = (paymentId, data) => apiFetch(`/payments/${paymentId}`, "PUT", data);
export const deletePayment = (paymentId) => apiFetch(`/payments/${paymentId}`, "DELETE");