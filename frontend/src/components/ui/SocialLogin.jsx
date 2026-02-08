const SocialLogin = () => {
  return (
    <div className="mt-6 text-center">
      <p className="text-sm text-gray-500 mb-3">
        hoặc đăng nhập bằng
      </p>

      <button
        type="button"
        className=" mx-auto flex items-center justify-center w-16 h-16 border rounded-lg hover:bg-gray-100 "
      >
        <img
          src="https://www.svgrepo.com/show/475656/google-color.svg"
          alt="Google"
          className="w-10 h-10"
        />
      </button>
    </div>
  );
};

export default SocialLogin;
