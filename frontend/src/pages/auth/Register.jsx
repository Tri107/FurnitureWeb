import { Link } from "react-router-dom";
import AuthCard from "../../components/ui/AuthCard";
import AuthBenefits from "../../components/ui/AuthBenefits";
import AuthForm from "../../components/ui/AuthForm";
import InputField from "../../components/ui/InputField";
import SocialLogin from "../../components/ui/SocialLogin";

const Register = () => {
  return (
    <div className="w-screen relative min-h-screen w-full overflow-hidden">
      {/* Peachy Sunrise Glow Background */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `
            linear-gradient(180deg, 
              rgba(255,247,237,1) 0%, 
              rgba(255,237,213,0.8) 25%, 
              rgba(254,215,170,0.6) 50%, 
              rgba(251,146,60,0.4) 75%, 
              rgba(249,115,22,0.3) 100%
            ),
            radial-gradient(circle at 20% 80%, rgba(255,255,255,0.6) 0%, transparent 40%),
            radial-gradient(circle at 80% 20%, rgba(254,215,170,0.5) 0%, transparent 50%),
            radial-gradient(circle at 60% 60%, rgba(252,165,165,0.3) 0%, transparent 45%)
          `,
        }}
      />

      {/* Content – căn giữa */}
      <div className="relative z-10 min-h-screen flex items-center justify-center">
        <AuthCard>
          <AuthBenefits />

         <AuthForm submitText="Đăng ký">
  <InputField placeholder="Email" />
  <InputField type="password" placeholder="Mật khẩu" />
  <InputField type="password" placeholder="Xác nhận mật khẩu" />
  <div className="flex justify-end">
    <span className="text-sm text-gray-600">
      Đã có tài khoản?{" "}
      <Link
        to="/login"
        className="text-red-500 font-medium hover:underline"
      >
        Đăng nhập ngay
      </Link>
    </span>
  </div>
</AuthForm>


          <div className="mt-6">
            <SocialLogin />
          </div>
        </AuthCard>
      </div>
    </div>
  );
};

export default Register;
