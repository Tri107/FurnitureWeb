import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../../lib/api";
import toast from "react-hot-toast";

import AuthCard from "../../components/ui/AuthCard";
import AuthBenefits from "../../components/ui/AuthBenefits";
import AuthForm from "../../components/ui/AuthForm";
import InputField from "../../components/ui/InputField";
import SocialLogin from "../../components/ui/SocialLogin";

const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.email || !form.password || !form.confirmPassword) {
      toast.error("Vui lòng nhập đầy đủ thông tin");
      
    }

    if (form.password.length < 6) {
      toast.error("Mật khẩu phải có ít nhất 6 ký tự");
      
    }

    if (form.password !== form.confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp");
     
    }

    try {
      setLoading(true);

      const res = await registerUser({
        email: form.email,
        password: form.password,
      });

      if (res?.email) {
        toast.success("OTP đã được gửi tới email");
        navigate("/otp", {
          state: { email: res.email },
        });
      } else {
        toast.error(res?.message || "Đăng ký thất bại");
       
      }

    } catch  {
      toast.error("Không thể kết nối đến server");
      
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-screen relative min-h-screen overflow-hidden">
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
            )
          `,
        }}
      />

      <div className="relative z-10 min-h-screen flex items-center justify-center">
        <AuthCard>
          <AuthBenefits />

          <AuthForm
            onSubmit={handleSubmit}
            submitText={loading ? "Đang đăng ký..." : "Đăng ký"}
          >
            {error && (
              <div className="mb-3 text-sm text-red-500 text-center">
                {error}
              </div>
            )}

            <InputField
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
            />

            <InputField
              type="password"
              name="password"
              placeholder="Mật khẩu"
              value={form.password}
              onChange={handleChange}
            />

            <InputField
              type="password"
              name="confirmPassword"
              placeholder="Xác nhận mật khẩu"
              value={form.confirmPassword}
              onChange={handleChange}
            />

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
