const user = JSON.parse(localStorage.getItem("user"));

{user?.role === "admin" && (
  <Link to="/admin">Admin</Link>
)}
