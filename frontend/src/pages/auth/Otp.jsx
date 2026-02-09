import { useRef } from "react";
import AuthCard from "../../components/ui/AuthCard";

const Otp = () => {
  const inputsRef = useRef([]);

  const handleChange = (value, index) => {
    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
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
      <div className="w-screen relative z-10 min-h-screen flex items-center justify-center">
        <AuthCard>
          <h2 className="text-xl font-semibold mb-2 text-center">
            Xác minh OTP
          </h2>

          <p className="text-sm text-gray-600 mb-6 text-center">
            Nhập mã gồm 6 chữ số đã gửi về email của bạn
          </p>

          <div className="flex justify-center gap-3 mb-6">
            {[...Array(6)].map((_, index) => (
              <input
                key={index}
                ref={(el) => (inputsRef.current[index] = el)}
                type="text"
                maxLength="1"
                onChange={(e) =>
                  handleChange(e.target.value, index)
                }
                className="
                  w-12 h-12
                  text-center
                  border
                  rounded-lg
                  text-lg
                  focus:outline-none
                  focus:ring-2
                  focus:ring-red-500
                "
              />
            ))}
          </div>

          <button
            className="
              w-full
              !bg-red-500
              hover:bg-red-600
              active:scale-[0.98]
              text-white
              font-semibold
              py-3
              rounded-full
              transition
            "
          >
            Xác minh
          </button>
        </AuthCard>
      </div>
    </div>
  );
};

export default Otp;
