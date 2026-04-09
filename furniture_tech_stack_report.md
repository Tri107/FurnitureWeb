# Báo Cáo Phân Tích Công Nghệ - Dự Án Furniture Web

Dựa trên mã nguồn của dự án Furniture trong thư mục `npl`, dưới đây là các công nghệ, thư viện, kỹ thuật và pattern được sử dụng cho cả Backend và Frontend.

---

## 1. Backend (Môi trường: Node.js)

### Ngôn ngữ & Framework Chính
- **Ngôn ngữ**: JavaScript (Sử dụng ES6 Modules - `type: "module"`).
- **Framework**: Express.js (Phiên bản 5.x) - Framework phổ biến, nhẹ và mạnh mẽ để xây dựng RESTful APIs.

### Cơ Sở Dữ Liệu (Databases)
- **MongoDB**: Dùng thông qua thư viện `mongoose`. Có thể được dùng để lưu trữ các dữ liệu phi cấu trúc hoặc real-time (như tin nhắn hội thoại).
- **MySQL**: Dùng thông qua thư viện `mysql2`. Có thể được dùng cho các dữ liệu quan hệ chặt chẽ mang tính nghiệp vụ như Người dùng, Đơn hàng, Sản phẩm.
- Việc kết hợp hai database cho thấy hệ thống sử dụng kiến trúc Polyglot Persistence, chọn CSDL phù hợp quy mô dữ liệu.

### Giao Tiếp Theo Thời Gian Thực (Real-time)
- **Socket.io**: Xây dựng máy chủ WebSockets kết hợp với Express HTTP server để xử lý các tính năng thời gian thực như Chat giữa admin và người dùng.

### Bảo Mật & Xác Thực (Security & Authentication)
- **JSON Web Token (JWT)**: Thư viện `jsonwebtoken` dùng để xây dựng cơ chế Authentication & Authorization.
- **Mã hoá mật khẩu**: Sử dụng `bcrypt` / `bcryptjs` để hash password.
- **OAuth 2.0**: Sử dụng `google-auth-library` để hỗ trợ đăng nhập qua tài khoản Google.
- **Xử lý request**: `cookie-parser` (xử lý cookie an toàn), `cors` (kiểm soát Cross-Origin Resource Sharing).

### Các Thư Viện Hỗ Trợ & Tiện Ích
- **Upload File**: `multer` - hỗ trợ quá trình upload từ form (multipart/form-data).
- **Lưu trữ Cloud đám mây**: `@aws-sdk/client-s3` - Amazon S3 để lưu trữ hình ảnh hoặc file static.
- **Cổng thanh toán**: `vnpay` - API tích hợp thanh toán nội địa VNPay.
- **Gửi Email**: `nodemailer` - Cơ chế gửi email tự động (như gửi mã OTP, thông báo đơn đặt hàng).
- **Xử lý File Excel**: `exceljs` - Xuất file báo cáo tài liệu dạng Excel (.xlsx).
- **Môi trường**: `dotenv` để quản lý biến môi trường an toàn.

---

## 2. Frontend (Môi trường: React)

### UI Library & Build Tool
- **Thư viện chính**: React 19.
- **Trình đóng gói (Bundler)**: Vite JS - mang lại tốc độ build và Hot Module Replacement (HMR) cực nhanh.

### Ngôn ngữ & Hệ Thống Kỹ Thuật Giao Diện (Styling)
- **CSS Framework**: Tailwind CSS (version 4) với Tailwind Vite Plugin dùng để thiết kế UI nhanh, mang tính mobile-first và dễ tùy chỉnh.
- **Hỗ trợ xử lý class Tailwind**: Sử dụng `clsx`, `tailwind-merge` và `class-variance-authority` (cva) để thao tác và build custom design system.

### UX/UI Component & Biểu Đồ
- **Radix UI**: Cung cấp các primitives unstyled component (`@radix-ui/react-slot`, `react-scroll-area`) nhằm xây dựng UI tuân thủ accessibility (a11y).
- **Icons**: `lucide-react` để hiển thị bộ icon chuẩn xác.
- **Data Visualization**: Dùng `recharts` để vẽ biểu đồ thống kê cho màn hình Admin Dashboard.
- **Hiển thị mô hình 3D**: `@google/model-viewer` hỗ trợ view ảnh sản phẩm AR/3D.

### Thao Tác Dữ Liệu & Form Validation
- **Gửi API**: Thư viện `axios` chuẩn hóa request tới backend server.
- **Quản lý Form State**: `react-hook-form` giúp thao tác làm việc với UI form (login, checkout) tối ưu không cần render liên tục.
- **Validation**: Schema validation với thư viện `zod` kết hợp với `@hookform/resolvers`.

### Quản Lý Trạng Thái UI, Layout & Ngày tháng
- **Routing/Điều hướng**: Sử dụng `react-router-dom` v7 cho hệ thống dẫn đường SPA (Single Page App).
- **Cảnh báo (Toasts / Notification)**: Dùng `sonner` và `react-hot-toast` hiển thị thông báo.
- **Theo dõi thời gian**: `date-fns` cùng với `react-day-picker` để thao tác ngày tháng, chọn lịch.

### Auth & File utils
- **OAuth Google**: `@react-oauth/google` tạo nút xác thực phía Client.
- **Decode Token**: `jwt-decode`.
- **Excel Export**: `xlsx` (sheetjs) - Để render dữ liệu ra file excel cho client tải xuống.
- **Realtime**: `socket.io-client` để đồng bộ kết nối Chat Box (phía người dùng / admin).

---

## 3. Coding Patterns & Kỹ Thuật Phát Triển

### Backend Patterns
1. **Kiến Trúc MVC (Model-View-Controller)**: Tách biệt rõ ràng tầng Xử lý request (`controllers`), Giao tiếp CSDL (`models`), và Định hướng địa chỉ (`routes`).
2. **Middleware Pattern**: Code backend xây dựng các middleware trung gian (`middlewares/dbErrorHandler.js`) để bắt/lọc lỗi, authguard, parse dữ liệu global thay vì viết thẳng vào Controller.
3. **Polyglot Persistence Pattern**: Chia nhỏ trách nhiệm CSDL (MongoDB & MySQL).
4. **Real-time Event-Driven**: Xây dựng Event Listeners qua Socket.IO để phát luồng thông tin 2 chiều cho Chat.

### Frontend Patterns
1. **Component-Based Architecture**: Cấu trúc module hóa cao (chia rẽ folder `components`, `pages`).
2. **Custom Hooks Pattern**: Tạo thư mục `hooks/` để tách logic nghiệp vụ và logic thay đổi DOM rời rạc khỏi UI (ví dụ logic quản lý giỏ hàng, fetch dữ liệu...). Thiết kế này giúp code có khả năng tái sử dụng tốt (DRY).
3. **Context API for State Management**: React Context (`context/` folder) được dử dụng để quản lý Global State như user session, trạng thái giỏ hàng, chat mà không lạm dụng Redux giúp thu gọn kiến trúc ứng dụng.
4. **Layout Wrappers & Protected Route Pattern**: Thiết kế `AdminLayout` lồng trong `AdminRoute` giúp block hoặc đẩy lùi người truy cập lạ, tạo lớp Layout cố định (sidebar, header) không bị refresh lại khi chuyển các trang admin nội bộ.
5. **UI Component System**: Sử dụng kiểu xây dựng các Atomic Components (tạo Design System) có thể cấu hình được qua props thông qua thư viện hỗ trợ `cva`.
