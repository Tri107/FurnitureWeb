FURNITUREWEB/
├── 📂 backend/               # Server-side (Node.js & Express)
│   ├── 📂 src/
│   │   ├── 📂 config/        # Cấu hình Database, Cloudinary, Env
│   │   ├── 📂 controllers/   # Logic xử lý các request từ client
│   │   ├── 📂 middlewares/   # Các hàm trung gian (Auth, Error handling)
│   │   ├── 📂 models/        # Định nghĩa Schema dữ liệu (MongoDB)
│   │   ├── 📂 routes/        # Khai báo các API Endpoints
│   │   ├── 📂 utils/         # Các hàm bổ trợ (Helpers, Formatters)
│   │   └── 📄 server.js      # Entry point của Backend
│   ├── 📄 .env               # Biến môi trường (Secret keys)
│   ├── 📄 .gitignore         # Các file cần bỏ qua khi đẩy lên Git
│   ├── 📄 package.json       # Quản lý dependencies của Backend
│   └── 📄 package-lock.json
│
└── 📂 frontend/              # Client-side (React & Vite)
    ├── 📂 public/            # Tài nguyên tĩnh công khai
    ├── 📂 src/
    │   ├── 📂 assets/        # Hình ảnh, Icons nội bộ
    │   ├── 📂 components/
    │   │   └── 📂 ui/        # Các UI Components dùng chung (shadcn/ui)
    │   ├── 📂 lib/           # Cấu hình thư viện ngoài (Axios, Utils)
    │   ├── 📂 pages/         # Các màn hình chính (Home, Shop, Cart)
    │   ├── 📄 App.jsx        # Component gốc điều hướng (Routes)
    │   ├── 📄 App.css        # Style chung của ứng dụng
    │   ├── 📄 index.css      # Style hệ thống (Tailwind/Reset)
    │   └── 📄 main.jsx       # File khởi tạo React
    ├── 📄 .gitignore         # Các file cần bỏ qua (node_modules, dist)
    ├── 📄 index.html         # File HTML chính
    ├── 📄 package.json       # Quản lý dependencies của Frontend
    ├── 📄 vite.config.js     # Cấu hình trình biên dịch Vite
    └── 📄 README.md          # Tài liệu hướng dẫn dự án