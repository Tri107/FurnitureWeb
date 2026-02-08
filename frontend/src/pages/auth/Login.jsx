import { Link } from "react-router-dom";
import AuthCard from "../../components/ui/AuthCard";
import AuthBenefits from "../../components/ui/AuthBenefits";
import AuthForm from "../../components/ui/AuthForm";
import InputField from "../../components/ui/InputField";
import SocialLogin from "../../components/ui/SocialLogin";

const Login = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login submit");
  };

  return (
    <div className="min-h-screen w-full bg-white relative">
  {/* Amber Glow Background */}
  <div
    className="absolute inset-0 z-0"
    style={{
      backgroundImage: `
        radial-gradient(125% 125% at 50% 90%, #ffffff 40%, #f59e0b 100%)
      `,
      backgroundSize: "100% 100%",
    }}
  />
  {/* Your Content/Components */}

   {/* Content wrapper – căn giữa toàn bộ */}
      <div className="relative z-10 w-screen min-h-screen flex items-center justify-center">
        <AuthCard>
          <AuthBenefits />

          <AuthForm onSubmit={handleSubmit} submitText="Đăng nhập">
          <InputField placeholder="Email" />
          <InputField type="password" placeholder="Mật khẩu" />

  {/* 👇 CHỈ THÊM ĐOẠN NÀY */}
  <div className="flex justify-end">
    <span className="text-sm text-gray-600">
      Chưa có tài khoản?{" "}
      <Link
        to="/register"
        className="text-red-500 font-medium hover:underline"
      >
        Đăng ký ngay
      </Link>
    </span>
  </div>
           </AuthForm>
          <SocialLogin />
        </AuthCard>
      </div>
    </div>    
  );
};

export default Login;
