import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { googleLogin } from "../../lib/api";

const SocialLogin = () => {
  const navigate = useNavigate();

  const handleSuccess = async (credentialResponse) => {
    console.log("Google credential:", credentialResponse);

    if (!credentialResponse?.credential) {
      console.error("Không nhận được id_token");
      return;
    }

    try {
      const res = await googleLogin({
        token: credentialResponse.credential, // id_token
      });

      if (res?.token) {
        localStorage.setItem("token", res.token);
        navigate("/");
      }
    } catch (err) {
      console.error("Login error:", err);
    }
  };

  return (
    <div className="mt-6 text-center">
      <p className="text-sm text-gray-500 mb-3">
        hoặc đăng nhập bằng
      </p>

      <GoogleLogin
        onSuccess={handleSuccess}
        onError={() => console.log("Google Login Failed")}
      />
    </div>
  );
};

export default SocialLogin;
