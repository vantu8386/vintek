# VINTEK - Website Thương Mại Điện Tử Vật Liệu Xây Dựng

## 🎯 Mô Tả Dự Án

Website bán vật liệu xây dựng với đầy đủ tính năng thương mại điện tử, hỗ trợ 2 phương thức thanh toán (COD và Chuyển khoản giảm 3%), có trang quản trị Admin hoàn chỉnh.

## 📁 Cấu Trúc Thư Mục

```
vintek-website/
│
├── index.html                 # ✅ Trang đăng nhập (bắt buộc)
├── home.html                  # ✅ Trang chủ
├── products.html              # ✅ Danh sách sản phẩm (có lọc)
├── product-detail.html        # ✅ Chi tiết sản phẩm
├── cart.html                  # ✅ Giỏ hàng (tăng/giảm số lượng)
├── checkout.html              # ✅ Thanh toán (COD & Chuyển khoản -3%)
├── thank-you.html             # ✅ Trang cảm ơn
├── orders.html                # ✅ Lịch sử đơn hàng
├── news.html                  # ✅ Danh sách tin tức
├── news-detail.html           # ✅ Chi tiết tin tức
├── admin.html                 # ✅ Trang quản trị (mật khẩu: vintekadmin)
│
├── css/
│   └── style.css              # ✅ CSS chính (Bootstrap 5 + Custom)
│
├── js/
│   ├── auth.js                # ✅ Đăng nhập/đăng xuất
│   ├── cart.js                # ✅ Quản lý giỏ hàng
│   ├── home.js                # ✅ Trang chủ
│   ├── products.js            # ✅ Danh sách sản phẩm
│   ├── product-detail.js      # ✅ Chi tiết sản phẩm
│   ├── cart-page.js           # ✅ Trang giỏ hàng
│   ├── checkout.js            # ✅ Thanh toán
│   ├── orders.js              # ✅ Đơn hàng
│   ├── news.js                # ✅ Tin tức
│   ├── news-detail.js         # ✅ Chi tiết tin tức
│   └── admin.js               # ✅ Quản trị
│
└── data/
    ├── products.json          # ✅ Dữ liệu 6 sản phẩm
    └── news.json              # ✅ Dữ liệu 5 bài viết
```

## ✨ Tính Năng Đã Hoàn Thành

### 🛒 Khách Hàng
- ✅ **Đăng nhập bắt buộc** bằng số điện thoại (10-11 chữ số)
- ✅ **Trang chủ** với banner, 3 ưu điểm cốt lõi, sản phẩm nổi bật
- ✅ **Danh sách sản phẩm** với bộ lọc theo danh mục (Ốp lát / Xây trát)
- ✅ **Chi tiết sản phẩm** đầy đủ (hình ảnh, mô tả, công dụng, tỉ lệ pha)
- ✅ **Giỏ hàng** với:
  - Tăng/giảm số lượng
  - Xóa sản phẩm
  - **Hiển thị số lượng tăng dần** trên icon
  - Lưu trong LocalStorage
  - Tự động tính phí ship (miễn phí từ 10 sản phẩm)
- ✅ **Thanh toán** với 2 phương thức:
  - **COD**: Trả tiền khi nhận hàng
  - **Chuyển khoản**: Giảm 3%, hiển thị QR code
    - Nội dung CK: VINTEK + số điện thoại
    - Số tiền đã trừ 3%
- ✅ **Trang cảm ơn** sau khi đặt hàng
- ✅ **Lịch sử đơn hàng** với tính năng mua lại
- ✅ **Tin tức** với danh sách và chi tiết bài viết

### 🔐 Quản Trị Admin
- ✅ **Đăng nhập Admin** (mật khẩu: **vintekadmin**)
- ✅ **Quản lý đơn hàng**:
  - Xem danh sách tất cả đơn hàng
  - Thay đổi trạng thái (Mới, Chờ thanh toán, Đang xử lý, Đã giao, Hủy)
  - Xem chi tiết từng đơn hàng
- ✅ **Quản lý sản phẩm**:
  - Xem danh sách sản phẩm
  - Chỉnh sửa/Xóa sản phẩm
- ✅ **Quản lý bài viết**
- ✅ **Quản lý mã giảm giá** (Vouchers)
- ✅ **Quản lý khách hàng**:
  - Tự động tạo danh sách từ đơn hàng
  - Thống kê: tổng đơn, tổng sản phẩm, tổng chi tiêu
- ✅ **Cài đặt hệ thống**:
  - Giảm giá chuyển khoản (%)
  - Phí vận chuyển
  - Ngưỡng miễn phí ship
  - Thông tin ngân hàng

## 🚀 Hướng Dẫn Sử Dụng

### 1. Cài Đặt
```bash
# Không cần cài đặt gì
# Chỉ cần mở file index.html bằng trình duyệt
```

### 2. Đăng Nhập Khách Hàng
- Mở **index.html**
- Nhập số điện thoại (10-11 chữ số)
- VD: 0123456789

### 3. Mua Hàng
1. Browse sản phẩm tại **Sản phẩm** hoặc từ trang chủ
2. Click "Thêm vào giỏ" hoặc "Xem chi tiết"
3. Tại trang chi tiết: chọn số lượng → "Thêm vào giỏ" hoặc "Mua ngay"
4. Vào giỏ hàng: kiểm tra, tăng/giảm số lượng
5. Click "Thanh toán"
6. Nhập thông tin giao hàng
7. Chọn phương thức thanh toán:
   - **COD**: Đặt hàng luôn
   - **Chuyển khoản**: Quét QR hoặc chuyển khoản thủ công
     - Nội dung: VINTEK + số điện thoại
     - Số tiền đã giảm 3%

### 4. Đăng Nhập Admin
- Mở **admin.html**
- Nhập mật khẩu: **vintekadmin**
- Quản lý đơn hàng, sản phẩm, khách hàng...

## 💡 Tính Năng Đặc Biệt

### Thanh Toán Chuyển Khoản
- ✅ Giảm ngay 3% khi chọn chuyển khoản
- ✅ Hiển thị QR code tự động
- ✅ Nội dung CK: **VINTEK + [Số điện thoại đăng nhập]**
- ✅ Số tiền đã trừ 3% được hiển thị rõ ràng

### Giỏ Hàng Thông Minh
- ✅ Icon giỏ hàng hiển thị số lượng tăng dần
- ✅ Lưu giỏ hàng trong LocalStorage (không mất khi tải lại trang)
- ✅ Tự động tính phí ship
- ✅ Miễn phí ship từ 10 sản phẩm

### Quản Lý Đơn Hàng
- ✅ Khách hàng xem lịch sử đơn hàng
- ✅ Tính năng "Mua lại" đơn hàng cũ
- ✅ Admin thay đổi trạng thái đơn hàng

## 📊 Dữ Liệu Mẫu

### Sản Phẩm
- 6 sản phẩm mẫu (3 Ốp lát + 3 Xây trát)
- Có giá gốc và giá khuyến mãi
- Hình ảnh từ Unsplash

### Tin Tức
- 5 bài viết mẫu
- Hướng dẫn kỹ thuật và khuyến mãi

## 🔐 Thông Tin Đăng Nhập

### Admin
- **URL**: admin.html
- **Mật khẩu**: vintekadmin

### Thanh Toán Chuyển Khoản
- **Ngân hàng**: MB Bank
- **Số TK**: 0123456789
- **Chủ TK**: CONG TY VINTEK
- **Nội dung**: VINTEK + [Số điện thoại]

## 🌐 Trình Duyệt Hỗ Trợ

- ✅ Chrome (khuyến nghị)
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Mobile browsers

## 🎨 Công Nghệ Sử Dụng

- **HTML5**: Cấu trúc trang
- **CSS3**: Styling
- **Bootstrap 5**: Framework UI
- **Bootstrap Icons**: Icons
- **JavaScript (Vanilla)**: Logic xử lý
- **LocalStorage**: Lưu trữ dữ liệu

## 📝 Lưu Ý Quan Trọng

1. **Không cần server** - Chạy trực tiếp trên trình duyệt
2. **Dữ liệu lưu trong LocalStorage** - Không mất khi reload
3. **Responsive** - Tương thích mobile và desktop
4. **Miễn phí ship** từ 10 sản phẩm
5. **Giảm 3%** khi chuyển khoản

## 🐛 Xử Lý Lỗi

### Nếu không thấy sản phẩm
- Kiểm tra file js/cart.js đã load chưa
- Xóa cache trình duyệt (Ctrl + Shift + Delete)

### Nếu không đăng nhập được
- Kiểm tra số điện thoại 10-11 chữ số
- Không có ký tự đặc biệt

### Nếu giỏ hàng mất
- Kiểm tra LocalStorage có bị tắt không
- Thử trình duyệt khác

## 📞 Liên Hệ

- **Website**: VINTEK
- **Email**: info@vintek.vn
- **Hotline**: 1900 xxxx
- **Địa chỉ**: Hà Nội, Việt Nam

---

## ✅ HOÀN THÀNH 100%

Tất cả tính năng theo yêu cầu đã được hoàn thành:
- ✅ Đăng nhập bắt buộc bằng số điện thoại
- ✅ Giỏ hàng với số lượng tăng dần
- ✅ 2 phương thức thanh toán (COD & Chuyển khoản)
- ✅ Chuyển khoản giảm 3%
- ✅ Hiển thị số điện thoại trong nội dung CK
- ✅ Hiển thị số tiền đã trừ 3%
- ✅ Trang quản trị Admin hoàn chỉnh
- ✅ Sắp xếp file gọn gàng và chuyên nghiệp

**Version 1.0 - 2024**
**Phát triển bởi VINTEK Team**