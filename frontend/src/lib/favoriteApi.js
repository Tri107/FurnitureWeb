const FAV_API_URL = "http://localhost:9999/api/favorites";

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
