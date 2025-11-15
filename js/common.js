// common.js - Các function dùng chung

// Hiển thị số điện thoại user trên navbar
function displayUserPhone() {
    const user = getCurrentUser();
    if (user && user.phoneNumber) {
        const userPhoneElement = document.getElementById('userPhone');
        if (userPhoneElement) {
            userPhoneElement.textContent = user.phoneNumber;
        }
    }
}

// Format giá tiền VND
function formatPrice(price) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(price);
}

// Format ngày tháng
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Export functions
window.displayUserPhone = displayUserPhone;
window.formatPrice = formatPrice;
window.formatDate = formatDate;