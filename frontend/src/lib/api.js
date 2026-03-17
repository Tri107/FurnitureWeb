const API_URL = "http://localhost:9999/api";
const FAV_API_URL = "http://localhost:9999/api/favorites";

const getAuthHeaders = () => {
  const token = localStorage.getItem("accessToken");
  const headers = {
    "Content-Type": "application/json",
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
};

const apiFetch = async (
  endpoint,
  method = "GET",
  body = null,
  isRetry = false
) => {
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

export async function getFavorites(accountId) {
  const token = localStorage.getItem("accessToken");

  const res = await fetch(`${FAV_API_URL}/${accountId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Không thể lấy danh sách favorites");
  }

  return res.json();
}

export async function addFavorite(accountId, productId) {
  console.log('addFavorite');
  const token = localStorage.getItem("accessToken");
  
  const res = await fetch(FAV_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      accountId: accountId,
      productId: productId,
    }),
  });

  return res.json();
}

export const removeFavorite = async (accountId, productId) => {
  console.log('removeFavorite'); 
  const token = localStorage.getItem("accessToken");
   
  const res = await fetch(FAV_API_URL, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      accountId: accountId,
      productId: productId,
    }),
  });

  return res.json();
};

// ================= AUTH =================
export const registerUser = (data) => apiFetch("/auth/register", "POST", data);
export const loginUser    = (data) => apiFetch("/auth/login", "POST", data);
export const verifyOtp    = (data) => apiFetch("/auth/register/verify", "POST", data);
export const googleLogin  = (data) => apiFetch("/auth/google-login", "POST", data);
export const logoutUser   = () => apiFetch("/auth/logout", "POST"); 
export const getMyProfile = () => apiFetch("/profile/me", "GET");
export const updateProfile = (data) => apiFetch("/profile/update", "PUT", data);
// ================= DISCOUNT =================
export const getDiscounts = () => apiFetch("/discounts");
export const createDiscount = (data) => apiFetch("/discounts", "POST", data);
export const updateDiscount = (id, data) =>
  apiFetch(`/discounts/${id}`, "PUT", data);
export const deleteDiscount = (id) => apiFetch(`/discounts/${id}`, "DELETE");

// ================= ACCOUNT (Admin) =================
export const getAccounts = () => apiFetch("/account");
export const getAccountById = (id) => apiFetch(`/account/${id}`);
export const createAccount = (data) => apiFetch("/account", "POST", data);
export const updateAccount = (id, data) =>
  apiFetch(`/account/${id}`, "PUT", data);
export const changeAccountPassword = (id, data) =>
  apiFetch(`/account/${id}/password`, "PUT", data);
export const deleteAccount = (id) => apiFetch(`/account/${id}`, "DELETE");
export const restoreAccount = (id) =>
  apiFetch(`/account/${id}/restore`, "PATCH");

// ================= COLLECTION =================
export const getCollections = () => apiFetch("/collections");
export const createCollection = (data) =>
  apiFetch("/collections", "POST", data);
export const updateCollection = (collectionId, data) =>
  apiFetch(`/collections/${collectionId}`, "PUT", data);
export const deleteCollection = (collectionId) =>
  apiFetch(`/collections/${collectionId}`, "DELETE");

// ================= PAYMENT =================
export const getPayments = () => apiFetch("/payments");
export const createPayment = (data) => apiFetch("/payments", "POST", data);
export const updatePayment = (paymentId, data) =>
  apiFetch(`/payments/${paymentId}`, "PUT", data);
export const deletePayment = (paymentId) =>
  apiFetch(`/payments/${paymentId}`, "DELETE");

// ================= CATEGORY =================
export const getCategories = () => apiFetch("/categories");
export const createCategory = (data) => apiFetch("/categories", "POST", data);
export const updateCategory = (categoryId, data) =>
  apiFetch(`/categories/${categoryId}`, "PUT", data);
export const deleteCategory = (categoryId) =>
  apiFetch(`/categories/${categoryId}`, "DELETE");

// ================= BRAND =================
export const getBrands = () => apiFetch("/brands");
export const createBrand = (data) => apiFetch("/brands", "POST", data);
export const updateBrand = (brandId, data) =>
  apiFetch(`/brands/${brandId}`, "PUT", data);
export const deleteBrand = (brandId) =>
  apiFetch(`/brands/${brandId}`, "DELETE");

// ================= PRODUCT =================
export const getProducts = () => apiFetch("/products");
export const getProductById = (id) => apiFetch(`/products/${id}`);
export const getFeaturedProducts = (params = "") => apiFetch(`/products/home-featured${params ? `?${params}` : ""}`);
export const getHomeCollections = (params = "") => apiFetch(`/products/home-collections${params ? `?${params}` : ""}`);

export const createProduct = (data) => apiFetch("/products/add-product", "POST", data);
export const createVariant = (data) => apiFetch("/products/add-variant", "POST", data);
// Upload images (multipart/form-data — cannot use apiFetch)
export const uploadProductImages = async (files) => {
  const formData = new FormData();
  files.forEach((file) => formData.append("images", file));

  const token = localStorage.getItem("accessToken");
  const headers = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_URL}/products/upload`, {
    method: "POST",
    headers,
    credentials: "include",
    body: formData,
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.message || "Upload ảnh thất bại");
  }
  return res.json();
};

export const updateProduct = (id, data) => apiFetch(`/products/${id}`, "PUT", data);

export const deleteProduct = (id) => apiFetch(`/products/${id}`, "DELETE");