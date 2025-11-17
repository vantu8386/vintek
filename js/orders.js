// orders.js - JavaScript cho trang đơn hàng

document.addEventListener('DOMContentLoaded', function() {
    checkAuthentication();
    loadOrders();
    updateCartCount();
});

// Load danh sách đơn hàng
function loadOrders() {
    const user = getCurrentUser();
    const allOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    
    // Lọc đơn hàng theo số điện thoại
    const userOrders = allOrders.filter(order => order.phoneNumber === user.phoneNumber);
    
    const ordersListContainer = document.getElementById('ordersList');
    const emptyOrders = document.getElementById('emptyOrders');
    
    if (userOrders.length === 0) {
        ordersListContainer.style.display = 'none';
        emptyOrders.style.display = 'block';
        return;
    }
    
    ordersListContainer.style.display = 'block';
    emptyOrders.style.display = 'none';
    ordersListContainer.innerHTML = '';
    
    userOrders.forEach(order => {
        const orderCard = document.createElement('div');
        orderCard.className = 'card mb-3 shadow-sm';
        orderCard.innerHTML = `
            <div class="card-body">
                <div class="row align-items-center">
                    <div class="col-md-3">
                        <h6 class="mb-1 fw-bold">${order.id}</h6>
                        <small class="text-muted">${formatDate(order.createdAt)}</small>
                    </div>
                    <div class="col-md-3 mt-2 mt-md-0">
                        <div class="text-muted small">Tổng tiền</div>
                        <div class="fw-bold text-primary">${formatPrice(order.total)}</div>
                    </div>
                    <div class="col-md-2 mt-2 mt-md-0">
                        <span class="status-badge ${getStatusClass(order.status)}">
                            ${order.status}
                        </span>
                    </div>
                    <div class="col-md-2 mt-2 mt-md-0">
                        <div class="text-muted small">Thanh toán</div>
                        <div class="small">${order.paymentMethod}</div>
                    </div>
                    <div class="col-md-2 mt-2 mt-md-0 text-end">
                        <button class="btn btn-sm btn-outline-primary mb-1" onclick="viewOrderDetail('${order.id}')">
                            <i class="bi bi-eye"></i> Chi tiết
                        </button>
                        <button class="btn btn-sm btn-outline-success" onclick="reorder('${order.id}')">
                            <i class="bi bi-arrow-repeat"></i> Mua lại
                        </button>
                    </div>
                </div>
            </div>
        `;
        ordersListContainer.appendChild(orderCard);
    });
}

// Xem chi tiết đơn hàng
function viewOrderDetail(orderId) {
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const order = orders.find(o => o.id === orderId);
    
    if (!order) return;
    
    const modalContent = document.getElementById('orderDetailContent');
    modalContent.innerHTML = `
        <div class="row mb-4">
            <div class="col-md-6">
                <h6 class="fw-bold">Thông tin đơn hàng</h6>
                <p class="mb-1"><strong>Mã đơn:</strong> ${order.id}</p>
                <p class="mb-1"><strong>Ngày đặt:</strong> ${formatDate(order.createdAt)}</p>
                <p class="mb-1"><strong>Trạng thái:</strong> 
                    <span class="status-badge ${getStatusClass(order.status)}">${order.status}</span>
                </p>
                <p class="mb-1"><strong>Thanh toán:</strong> ${order.paymentMethod}</p>
            </div>
            <div class="col-md-6">
                <h6 class="fw-bold">Thông tin giao hàng</h6>
                <p class="mb-1"><strong>Người nhận:</strong> ${order.fullName}</p>
                <p class="mb-1"><strong>SĐT:</strong> ${order.phoneNumber}</p>
                <p class="mb-1"><strong>Địa chỉ:</strong> ${order.address}</p>
                ${order.note ? `<p class="mb-1"><strong>Ghi chú:</strong> ${order.note}</p>` : ''}
            </div>
        </div>
        
        <h6 class="fw-bold mb-3">Sản phẩm</h6>
        <div class="table-responsive">
            <table class="table table-bordered">
                <thead class="table-light">
                    <tr>
                        <th>Sản phẩm</th>
                        <th class="text-center">Số lượng</th>
                        <th class="text-end">Đơn giá</th>
                        <th class="text-end">Thành tiền</th>
                    </tr>
                </thead>
                <tbody>
                    ${order.items.map(item => `
                        <tr>
                            <td>
                                <div class="d-flex align-items-center">
                                    <img src="${item.image}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 5px;" class="me-2">
                                    <span>${item.name}</span>
                                </div>
                            </td>
                            <td class="text-center">${item.quantity}</td>
                            <td class="text-end">${formatPrice(item.price)}</td>
                            <td class="text-end">${formatPrice(item.price * item.quantity)}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
        
        <div class="row">
            <div class="col-md-6 offset-md-6">
                <div class="d-flex justify-content-between mb-2">
                    <span>Tạm tính:</span>
                    <span>${formatPrice(order.subtotal)}</span>
                </div>
                <div class="d-flex justify-content-between mb-2">
                    <span>Phí vận chuyển:</span>
                    <span>${order.shippingFee === 0 ? 'Miễn phí' : formatPrice(order.shippingFee)}</span>
                </div>
                ${order.voucherDiscount > 0 ? `
                    <div class="d-flex justify-content-between mb-2 text-success">
                        <span>Voucher (${order.voucherCode}):</span>
                        <span>-${formatPrice(order.voucherDiscount)}</span>
                    </div>
                ` : ''}
                ${order.bankDiscount > 0 ? `
                    <div class="d-flex justify-content-between mb-2 text-success">
                        <span>Giảm giá CK (1%):</span>
                        <span>-${formatPrice(order.bankDiscount)}</span>
                    </div>
                ` : ''}
                ${order.discount > 0 && !order.bankDiscount ? `
                    <div class="d-flex justify-content-between mb-2 text-success">
                        <span>Giảm giá:</span>
                        <span>-${formatPrice(order.discount)}</span>
                    </div>
                ` : ''}
                <div class="d-flex justify-content-between border-top pt-2">
                    <strong class="fs-5">Tổng cộng:</strong>
                    <strong class="fs-5 text-primary">${formatPrice(order.total)}</strong>
                </div>
            </div>
        </div>
    `;
    
    const modal = new bootstrap.Modal(document.getElementById('orderDetailModal'));
    modal.show();
}

// Mua lại đơn hàng
function reorder(orderId) {
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const order = orders.find(o => o.id === orderId);
    
    if (!order) return;
    
    if (confirm('Thêm tất cả sản phẩm từ đơn hàng này vào giỏ?')) {
        let cart = getCart();
        
        order.items.forEach(item => {
            const existingItem = cart.find(i => i.id === item.id);
            if (existingItem) {
                existingItem.quantity += item.quantity;
            } else {
                cart.push({...item});
            }
        });
        
        saveCart(cart);
        showAlert('Đã thêm sản phẩm vào giỏ hàng!', 'success');
        
        setTimeout(() => {
            window.location.href = 'cart.html';
        }, 1500);
    }
}

// Get status class
function getStatusClass(status) {
    const statusMap = {
        'Mới': 'status-new',
        'Chờ thanh toán': 'status-new',
        'Đang xử lý': 'status-processing',
        'Đã giao': 'status-completed',
        'Hủy': 'status-cancelled'
    };
    return statusMap[status] || 'status-new';
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Format price
function formatPrice(price) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(price);
}

// Export functions
window.viewOrderDetail = viewOrderDetail;
window.reorder = reorder;