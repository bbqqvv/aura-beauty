# Hướng dẫn Chạy Docker Toàn diện cho Aura Beauty Shop

Tệp hướng dẫn này giúp bạn dễ dàng đóng gói, di chuyển toàn bộ hệ thống nguồn (bao gồm Frontend, Backend, Database MongoDB, Storage MinIO) và chạy mượt mà ngay lập tức trên máy của khách hàng chỉ với một vài câu lệnh.

---

## 📋 Yêu cầu Chuẩn bị trên Máy Khách hàng
Trước khi cài đặt, hãy đảm bảo máy khách hàng đã cài đặt sẵn:
1. **Docker Desktop** (Dành cho Windows/macOS) hoặc **Docker Engine** + **Docker Compose** (Dành cho Linux).
   * Tải Docker Desktop tại: [https://www.docker.com/products/docker-desktop/](https://www.docker.com/products/docker-desktop/)

---

## 🚀 Hướng dẫn Cài đặt & Khởi chạy (Chỉ 3 Bước)

### Bước 1: Sao chép Thư mục Dự án sang Máy Khách
Copy toàn bộ thư mục dự án `shofy-Beauty-and-Cosmetics-ecommerce-client` (thư mục chứa tệp `docker-compose.yml` này) sang máy của khách hàng qua USB, Google Drive, hoặc Git clone.

### Bước 2: Khởi động Toàn bộ Hệ thống qua Docker Compose
Mở terminal (PowerShell, Command Prompt hoặc Bash) tại thư mục chứa tệp `docker-compose.yml`, rồi chạy câu lệnh sau:
```bash
docker compose up --build -d
```
* **Giải thích lệnh**:
  * `--build`: Tự động biên dịch mã nguồn của Frontend (Next.js) và Backend (Node.js/Express) thành các Docker Image chuẩn sản xuất tối ưu.
  * `-d`: Chạy ngầm toàn bộ dịch vụ (detached mode) để bạn có thể tắt terminal đi.
* **Thời gian hoàn thành**: Lần đầu tiên chạy có thể mất từ 3 - 5 phút tùy thuộc tốc độ mạng và cấu hình máy vì Docker sẽ tải các base image và build Next.js. Những lần sau sẽ chạy ngay lập tức (<5 giây).

### Bước 3: Đổ dữ liệu mẫu (Seed Data) vào MongoDB
Sau khi toàn bộ dịch vụ đã khởi chạy thành công (`shofy_backend`, `shofy_mongodb`), bạn cần import dữ liệu sản phẩm, danh mục, cấu hình hệ thống vào database bằng cách chạy lệnh sau ngay tại terminal:
```bash
docker exec -it shofy_backend npm run data:import
```
* **Kết quả**: Dữ liệu sản phẩm mỹ phẩm Aura, tài khoản admin mẫu và thông tin khuyến mãi sẽ tự động được đồng bộ vào MongoDB trong container.

---

## 🌐 Các cổng kết nối & Địa chỉ Truy cập

Sau khi chạy xong, bạn có thể bàn giao hệ thống cho khách hàng truy cập qua các địa chỉ sau:

| Dịch vụ | Địa chỉ truy cập | Ghi chú |
| :--- | :--- | :--- |
| **Frontend Store** | `http://localhost:3000` | Trang bán hàng mỹ phẩm Aura của khách hàng |
| **Frontend Admin** | `http://localhost:3000/admin/login` | Trang quản trị của Admin (Sản phẩm, Đơn hàng, Coupon) |
| **Backend API** | `http://localhost:7000` | Cổng API dịch vụ |
| **MinIO Console** | `http://localhost:9006` | Trực quan quản lý File Storage (Tài khoản: `shofyadmin` / Mật khẩu: `shofypassword123`) |
| **MongoDB** | `mongodb://localhost:27017` | Kết nối Database bằng Robo 3T hoặc MongoDB Compass |

---

## 🛠️ Một số lệnh quản lý hữu ích khi bảo trì cho khách hàng

* **Xem log thời gian thực của toàn bộ hệ thống** (để debug khi có lỗi):
  ```bash
  docker compose logs -f
  ```
* **Xem log của riêng Backend**:
  ```bash
  docker compose logs -f backend
  ```
* **Tạm dừng hệ thống** (không mất dữ liệu):
  ```bash
  docker compose stop
  ```
* **Khởi động lại hệ thống**:
  ```bash
  docker compose start
  ```
* **Xóa toàn bộ container để cài lại từ đầu** (vẫn giữ dữ liệu Database trong Volume):
  ```bash
  docker compose down
  ```
* **Xóa sạch hệ thống kèm theo cả dữ liệu Database** (cẩn thận khi chạy):
  ```bash
  docker compose down -v
  ```

---

*Chúc bạn bàn giao dự án Aura Beauty thành công tốt đẹp cho khách hàng!*
