I. Giao diện Khách hàng (Website Customer)
1. Trang Đăng nhập (LoginGate)

Người dùng bắt buộc đăng nhập bằng SĐT trước khi vào website.

Số điện thoại sẽ dùng để:

Lưu đơn hàng

Hiển thị nội dung khi thanh toán chuyển khoản

2. Trang Chủ (HomePage)

Banner ảnh công trình xây dựng

3 khối giới thiệu:
✔ CHống nứt chống thấm
✔ Tiết kiệm chi phí
✔ Freeship

Hiển thị sản phẩm nổi bật

Nút “Đặt hàng ngay” → Trang sản phẩm

3. Trang Danh sách sản phẩm (ProductListPage)

Load sản phẩm từ một mảng tạo sẵn

Bộ lọc theo danh mục:

Ốp lát

Xây trát

Hiển thị theo dạng thẻ (ảnh – tên – giá – khuyến mại)

4. Trang Chi tiết sản phẩm (ProductDetailPage)

Ảnh lớn

Mô tả – Công dụng – Hướng dẫn pha trộn

Chọn số lượng

Nút:

Thêm vào giỏ

Mua ngay → Checkout

Gợi ý Combo + Sản phẩm liên quan

5. Trang Giỏ hàng (CartPage)

Liệt kê sản phẩm

Tăng / giảm / xóa

Tự tính:

Tạm tính

Freeship nếu đủ điều kiện

Tổng tiền

Giỏ hàng lưu vào LocalStorage

6. Trang Thanh toán (CheckoutPage)

Form thông tin khách (tên – địa chỉ – ghi chú)

SĐT tự điền từ bước đăng nhập

2 hình thức thanh toán:

COD

Chuyển khoản
✔ Giảm 1%
✔ Hiển thị mã QR
✔ Hiển thị nội dung CK = số điện thoại
✔ Hiển thị số tiền sau giảm 1%

7. Trang Cảm ơn (ThankYouPage)

Xác nhận đặt hàng thành công

gửi thông tin khách hàng về file excel và thông báo vế email

Nút về Trang chủ / Xem thêm sản phẩm

8. Lịch sử đơn hàng (OrderHistoryPage)

Liệt kê đơn theo SĐT đăng nhập

Thông tin: mã đơn – ngày – trạng thái – tổng

Xem chi tiết đơn

Nút Mua lại đơn hàng

9. Trang Tin tức (NewsList + NewsDetail)

Danh sách bài viết dạng thẻ

Trang chi tiết:

Nội dung đầy đủ

Sản phẩm liên quan




------------------------------------------------

📌 GIAO DIỆN KHÁCH HÀNG (WEBSITE HƯỚNG TỚI KHÁCH HÀNG)
1. Trang Đăng nhập khách hàng (LoginGate.tsx)

Chức năng:

Đây là trang đầu tiên khách hàng nhìn thấy.

Hệ thống yêu cầu khách hàng đăng nhập bằng số điện thoại trước khi truy cập các trang khác.

Việc này dùng để định danh khách hàng trong:

Lưu đơn hàng


2. Trang Chủ (HomePage.tsx)

Mục đích: Giới thiệu thương hiệu VINTEK.
Chức năng:

Banner ảnh công trình xây dựng

3 khối giới thiệu các ưu điểm cốt lõi:

Chống thấm chống nứt

Tiết kiệm chi phí

Freeship

Hiển thị một số sản phẩm nổi bật để thu hút khách hàng

Nút “Đặt hàng ngay” dẫn đến trang sản phẩm

3. Trang Danh sách sản phẩm (ProductListPage.tsx)

Mục đích: Hiển thị tất cả sản phẩm.
Chức năng:

Tải danh sách sản phẩm từ một mảng sản phẩm có sẵn

Bộ lọc theo danh mục:

Ốp lát

Xây trát

Mỗi sản phẩm được hiển thị dạng ProductCard gồm:

Hình ảnh

Tên

Giá

Khuyến mại

4. Trang Chi tiết sản phẩm (ProductDetailPage.tsx)

Mục đích: Cung cấp thông tin đầy đủ về sản phẩm.
Chức năng:

Hiển thị ảnh lớn

Mô tả chi tiết

Công dụng

Pha trộn chính xác

Chọn số lượng

Nút hành động:

Thêm vào giỏ hàng

Mua ngay (thêm vào giỏ + chuyển đến thanh toán)

Gợi ý:

Combo

Sản phẩm liên quan

5. Trang Giỏ hàng (CartPage.tsx)

Mục đích: Xem lại và quản lý sản phẩm đã chọn.
Chức năng:

Danh sách sản phẩm trong giỏ

Tăng / giảm số lượng

Xóa sản phẩm

Tự động tính toán:

Tạm tính

Miễn phí vận chuyển (khi đủ điều kiện ví dụ 2 sản phẩm)
miễn phí ship cho những sản phẩm nào đang đặt miễn phí ship là true còn mất phí là flase phải đủ điều kiện mới được miễn phí

Tổng tiền

Giỏ hàng lưu trong LocalStorage để giữ lại khi tải lại trang

6. Trang Thanh toán (CheckoutPage.tsx)

Mục đích: Thu thập thông tin và hoàn tất đơn hàng.
Chức năng:

Form nhập:

Họ tên

Địa chỉ

Ghi chú

Số điện thoại tự lấy từ lúc đăng nhập


Hai phương thức thanh toán:

COD (trả khi nhận hàng)

Chuyển khoản ngân hàng

Khi chọn chuyển khoản:

Hiển thị mã QR

Hiển thị số tiền cần thanh toán

Tự động áp dụng giảm 1%

Hiển thị nội dung chuyển khoản = SĐT khách hàng

Hiển thị phần giảm % (nổi bật)

Tổng hợp đơn hàng:

Sản phẩm

Phí ship

Giảm giá

7. Trang Cảm ơn (ThankYouPage.tsx)

Mục đích: Xác nhận đơn hàng thành công.
Chức năng:

gủi thông tin khách hàng đã đặt hàng về file excel và thông báo về email

Hiển thị thông báo cảm ơn

Nút điều hướng:

Trang chủ

Xem sản phẩm khác

8. Trang Lịch sử Đơn hàng (OrderHistoryPage.tsx)

Mục đích: Cho khách đã đăng nhập xem đơn đã đặt.
Chức năng:

Liệt kê đơn theo số điện thoại đăng nhập

Thông tin hiển thị:

Mã đơn

Ngày đặt

Tổng tiền

Trạng thái:

Mới

Đang xử lý

Đã giao

Xem chi tiết từng đơn

Tính năng “Mua lại đơn hàng” → tự động thêm vào giỏ hàng

9. Trang Tin tức (NewsListPage & NewsDetailPage)

Mục đích: Hiển thị nội dung, tips thi công, và khuyến mãi.
Chức năng:

Trang danh sách:

Hiển thị bài viết dạng thẻ

Trang chi tiết:

Hiển thị đầy đủ nội dung

Hiển thị sản phẩm liên quan

10 , hiển thị 100 người đã mua hàng rồi chạy liên tục ngẫu nhiên bao gồm tên khách hàng và sản phẩm  chạy dưới góc màn hình


project/
│
├── index.html                     → Trang đăng nhập (yêu cầu SĐT)
│
├── assets/
│   ├── css/
│   │   ├── base.css               → CSS reset + cấu trúc chung
│   │   ├── style.css              → Style giao diện khách hàng
│   │   ├── admin.css              → Style riêng cho Admin Panel
│   │   └── responsive.css         → Style responsive
│   │
│   ├── js/
│
│
├── pages/
