# Mindset Coffee POS

Web POS frontend cho quán cà phê **Mindset**, có 2 loại tài khoản:

- Admin / Quản lý
- Nhân viên

## Chức năng

### Admin
- Quản lý tài khoản nhân viên: thêm / sửa / xóa / cấp quyền Admin
- Quản lý món và topping
- Upload QR chuyển khoản
- Theo dõi doanh thu theo ngày / tháng
- Xem doanh thu theo nhân viên
- Quản lý ca IN / OUT

### Nhân viên
- POS chọn món
- Thêm topping riêng
- Thanh toán tiền mặt
- Thanh toán chuyển khoản bằng QR do Admin upload
- Xem đơn của mình
- IN / OUT ca

## Tài khoản demo

Admin:
- username: `admin`
- password: `admin123`

Nhân viên:
- username: `nhanvien`
- password: `123456`

## Chạy trên GitHub Pages

Đây là bản **frontend demo**, không cần Node.js.

1. Tạo repository trên GitHub, ví dụ `mindset-pos`.
2. Upload `index.html`, `style.css`, `app.js`, `README.md`.
3. Vào **Settings → Pages**.
4. Chọn **Deploy from a branch**.
5. Chọn branch `main` và thư mục `/root`.
6. Save.
7. GitHub sẽ tạo link dạng:
   `https://TEN-GITHUB-CUA-BAN.github.io/mindset-pos/`

## Lưu ý quan trọng

Bản này dùng `localStorage` để mô phỏng database, nên:
- Dữ liệu chỉ lưu trên trình duyệt hiện tại.
- Tài khoản và mật khẩu chưa có bảo mật server.
- Nhiều máy/nhân viên sẽ không dùng chung một database.
- Upload QR cũng được lưu trong trình duyệt.

Nếu đưa vào quán thật, nên nâng cấp backend + database + authentication, ví dụ:
- Supabase
- Firebase
- hoặc Node.js/Express + PostgreSQL/MySQL

Khi đó nhiều máy POS có thể dùng chung dữ liệu và admin quản lý tập trung.
