// auth.js - Xử lý đăng nhập và xác thực

// Kiểm tra đăng nhập khi load trang
document.addEventListener('DOMContentLoaded', function() {
    // Nếu đang ở trang index.html, xử lý form đăng nhập
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Nếu không phải trang đăng nhập, kiểm tra xác thực
    if (!window.location.pathname.includes('index.html') && 
        window.location.pathname !== '/' && 
        !window.location.pathname.includes('admin.html')) {
        checkAuthentication();
    }
});

// Xử lý đăng nhập
function handleLogin(e) {
    e.preventDefault();
    
    const phoneNumber = document.getElementById('phoneNumber').value.trim();
    
    // Validate số điện thoại
    if (!validatePhoneNumber(phoneNumber)) {
        showAlert('Vui lòng nhập số điện thoại hợp lệ (10-11 chữ số)', 'danger');
        return;
    }
    
    // Lưu thông tin đăng nhập
    const user = {
        phoneNumber: phoneNumber,
        loginTime: new Date().toISOString()
    };
    
    localStorage.setItem('currentUser', JSON.stringify(user));
    
    // Chuyển đến trang chủ
    showAlert('Đăng nhập thành công!', 'success');
    setTimeout(() => {
        window.location.href = 'home.html';
    }, 1000);
}

// Validate số điện thoại
function validatePhoneNumber(phone) {
    const phoneRegex = /^[0-9]{10,11}$/;
    return phoneRegex.test(phone);
}

// Kiểm tra xác thực
function checkAuthentication() {
    const currentUser = localStorage.getItem('currentUser');
    
    if (!currentUser) {
        // Chưa đăng nhập, chuyển về trang đăng nhập
        window.location.href = 'index.html';
        return false;
    }
    
    return true;
}

// Lấy thông tin user hiện tại
function getCurrentUser() {
    const userStr = localStorage.getItem('currentUser');
    return userStr ? JSON.parse(userStr) : null;
}

// Đăng xuất
function logout() {
    if (confirm('Bạn có chắc muốn đăng xuất?')) {
        localStorage.removeItem('currentUser');
        window.location.href = 'index.html';
    }
}

// Hiển thị thông báo
function showAlert(message, type = 'info') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed top-0 start-50 translate-middle-x mt-3`;
    alertDiv.style.zIndex = '9999';
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(alertDiv);
    
    setTimeout(() => {
        alertDiv.remove();
    }, 3000);
}

// Export functions
window.checkAuthentication = checkAuthentication;
window.getCurrentUser = getCurrentUser;
window.logout = logout;
window.showAlert = showAlert;