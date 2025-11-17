// notification.js - Hệ thống thông báo người mua ảo

// Danh sách 100 tên khách hàng (90% nam, 10% nữ)
const customerNames = [
  "Nguyễn Minh", "Trần Anh", "Lê Huy", "Phạm Long",
"Vũ Tuấn", "Đặng Tùng", "Bùi Hùng", "Hoàng Khoa",
"Ngô Thắng", "Dương Nam", "Phan Sơn", "Lý Cường",
"Trịnh Phong", "Mai Thành", "Võ Tâm", "Đỗ Vinh",
"Lưu Đạt", "Đinh Minh", "Hồ Tú", "Tô Hải",
"Chu Mạnh", "La Hoàng", "Thái Bình", "Hà Toàn",
"Cao Đức", "Tạ Lợi", "Bạch Bình", "Đoàn Thắng",
"Ông Tuấn", "Từ Hưng", "Kiều Tài", "Doãn Anh",
"Nghiêm Hùng", "Lâm Phong", "Lại Quân", "Sử Dũng",
"Khổng Thọ", "Mạc Sơn", "Nhâm Long", "Ứng Tân",
"Trương Hải", "Thân Hùng", "Lộc Đạt", "Quách Toàn",
"An Trung", "Lăng Tùng", "Uông Hiếu", "Tăng Nhật",
"Trầm Duy", "Âu Khôi", "Nghị Tiến", "Viên Bảo",
"Dữ Lâm", "Gia Phúc", "Trang Tuấn", "Diệp Trí",
"Lục Hải", "Lữ Đức", "Ân Hưng", "Kiên Nam",
"Tiêu Thành", "Cung Tân", "Đường Liêm", "Giang Hòa",
"Hứa Khánh", "Khưu Thịnh", "Lãnh Phú", "Mạnh Vũ",
"Nhan Tín", "Ôn Tuệ", "Phó Huy", "Quan Thái",
"Sái Kiên", "Thiều Tú", "Ưng Khang", "Văn Anh",
"Xương Hòa", "Yên Hiếu", "Ấu Minh", "Bành Tuấn",
"Bồ Đạt", "Cái Phương", "Dụng Trí", "Đạm Nam",
"Đan Hải", "Giang Tú", "Hoa Thắng", "Hồng Lâm",
"Kha Bình", "Khải Quân", "Lăng Tài", "Liêu Duy", "Phương Vinh","Nguyễn Hoa", "Trần Lan", "Lê Mai", "Phạm Hương",
"Vũ Thanh", "Đặng Nga", "Bùi Linh", "Hoàng Thu",
"Ngô Trang", "Dương Hà"

];

// Danh sách sản phẩm
const products = [
  "Phụ gia ốp lát VINTEK 1 túi",
  "Combo 3 túi phụ gia ốp lát",
  "Combo 5 túi phụ gia ốp lát",
  "Combo 10 túi phụ gia ốp lát",
  "Phụ gia xây trát VINTEK 1 túi",
  "Combo 3 túi phụ gia xây trát",
  "Combo 5 túi phụ gia xây trát",
  "Combo 10 túi phụ gia xây trát"
];

// Danh sách địa điểm
const locations = [
  "Hà Nội", "TP.HCM", "Đà Nẵng", "Hải Phòng", "Cần Thơ",
  "Biên Hòa", "Nha Trang", "Huế", "Vinh", "Buôn Ma Thuột",
  "Quy Nhơn", "Thái Nguyên", "Thanh Hóa", "Nam Định", "Hải Dương",
  "Bắc Ninh", "Vũng Tàu", "Bình Dương", "Đồng Nai", "Long An",
  "Bắc Giang", "Quảng Ninh", "Nghệ An", "Thừa Thiên Huế", "Quảng Nam"
];

let notificationQueue = [];
let isNotificationShowing = false;

// Khởi tạo hệ thống thông báo
function initNotificationSystem() {
  // Tạo container cho notification
  if (!document.getElementById('purchaseNotification')) {
    const notificationHTML = `
      <div id="purchaseNotification" class="position-fixed" style="bottom: 20px; left: 20px; z-index: 9999; display: none;">
        <div class="card shadow-lg border-0" style="max-width: 350px; border-radius: 12px; overflow: hidden;">
          <div class="card-body p-3">
            <div class="d-flex align-items-center">
              <div class="flex-shrink-0">
                <div class="bg-success rounded-circle d-flex align-items-center justify-content-center" style="width: 40px; height: 40px;">
                  <i class="bi bi-bag-check-fill text-white fs-5"></i>
                </div>
              </div>
              <div class="flex-grow-1 ms-3">
                <div class="fw-bold text-dark" id="notificationCustomer" style="font-size: 0.9rem;"></div>
                <div class="text-muted small" id="notificationProduct"></div>
                <div class="text-muted small">
                  <i class="bi bi-geo-alt-fill"></i> <span id="notificationLocation"></span>
                  <span class="ms-2"><i class="bi bi-clock-fill"></i> Vừa xong</span>
                </div>
              </div>
              <button type="button" class="btn-close btn-sm ms-2" onclick="closeNotification()"></button>
            </div>
          </div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', notificationHTML);
  }
  
  // Bắt đầu hiển thị thông báo mỗi 5 giây
  setInterval(showRandomNotification, 8000);
  
  // Hiển thị notification đầu tiên sau 2 giây
  setTimeout(showRandomNotification, 4000);
}

// Hiển thị thông báo ngẫu nhiên
function showRandomNotification() {
  if (isNotificationShowing) return;
  
  const randomCustomer = customerNames[Math.floor(Math.random() * customerNames.length)];
  const randomProduct = products[Math.floor(Math.random() * products.length)];
  const randomLocation = locations[Math.floor(Math.random() * locations.length)];
  
  document.getElementById('notificationCustomer').textContent = randomCustomer;
  document.getElementById('notificationProduct').textContent = `vừa mua ${randomProduct}`;
  document.getElementById('notificationLocation').textContent = randomLocation;
  
  const notification = document.getElementById('purchaseNotification');
  notification.style.display = 'block';
  
  // Thêm animation
  notification.style.animation = 'slideInLeft 0.5s ease-out';
  
  isNotificationShowing = true;
  
  // Tự động ẩn sau 4 giây
  setTimeout(() => {
    closeNotification();
  }, 4000);
}

// Đóng thông báo
function closeNotification() {
  const notification = document.getElementById('purchaseNotification');
  notification.style.animation = 'slideOutLeft 0.5s ease-in';
  
  setTimeout(() => {
    notification.style.display = 'none';
    isNotificationShowing = false;
  }, 500);
}

// Thêm CSS animation
const style = document.createElement('style');
style.textContent = `
  @keyframes slideInLeft {
    from {
      transform: translateX(-100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @keyframes slideOutLeft {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(-100%);
      opacity: 0;
    }
  }
  
  #purchaseNotification .card {
    transition: all 0.3s ease;
  }
  
  #purchaseNotification .card:hover {
    transform: scale(1.02);
    box-shadow: 0 8px 25px rgba(0,0,0,0.2) !important;
  }
  
  @media (max-width: 576px) {
    #purchaseNotification {
      left: 10px !important;
      right: 10px !important;
    }
    
    #purchaseNotification .card {
      max-width: 100% !important;
    }
  }
`;
document.head.appendChild(style);

// Khởi động khi trang load
document.addEventListener('DOMContentLoaded', function() {
  initNotificationSystem();
});

// Export functions
window.closeNotification = closeNotification;
window.initNotificationSystem = initNotificationSystem;