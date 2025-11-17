// checkout.js - JavaScript cho trang thanh toán

const BANK_TRANSFER_DISCOUNT = 0.01; // 1% giảm giá

document.addEventListener('DOMContentLoaded', function() {
    checkAuthentication();
    
    const cart = getCart();
    if (cart.length === 0) {
        alert('Giỏ hàng trống!');
        window.location.href = 'products.html';
        return;
    }
    
    loadCheckoutPage();
});

// Load trang thanh toán
function loadCheckoutPage() {
    const user = getCurrentUser();
    const cart = getCart();
    
    // Điền số điện thoại
    document.getElementById('phoneNumber').value = user.phoneNumber;
    
    // Hiển thị sản phẩm trong đơn hàng
    const orderItemsContainer = document.getElementById('orderItems');
    orderItemsContainer.innerHTML = '';
    
    cart.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'border-bottom pb-2 mb-2';
        itemDiv.innerHTML = `
            <div class="d-flex justify-content-between align-items-start">
                <div class="d-flex gap-2 flex-grow-1">
                    <img src="${item.image}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 8px;" alt="${item.name}">
                    <div class="flex-grow-1">
                        <div class="small fw-semibold">${item.name}</div>
                        <div class="text-muted small">SL: ${item.quantity}</div>
                        ${item.freeShip ? '<span class="badge bg-success">Miễn phí ship</span>' : ''}
                    </div>
                </div>
                <div class="text-end">
                    <div class="fw-semibold">${formatPrice(item.price * item.quantity)}</div>
                </div>
            </div>
        `;
        orderItemsContainer.appendChild(itemDiv);
    });
    
    // Cập nhật tóm tắt thanh toán
    updateOrderSummary();
}

// Cập nhật phương thức thanh toán
function updatePaymentMethod() {
    const bankTransferRadio = document.getElementById('bankTransfer');
    const bankTransferInfo = document.getElementById('bankTransferInfo');
    
    if (bankTransferRadio.checked) {
        bankTransferInfo.style.display = 'block';
        updateBankTransferInfo();
    } else {
        bankTransferInfo.style.display = 'none';
    }
    
    updateOrderSummary();
}

// Cập nhật thông tin chuyển khoản
function updateBankTransferInfo() {
    const user = getCurrentUser();
    const cart = getCart();
    const subtotal = calculateCartTotal();
    const shippingFee = calculateShippingFee();
    const discount = Math.round(subtotal * BANK_TRANSFER_DISCOUNT);
    const finalAmount = subtotal + shippingFee - discount;
    
    // Nội dung chuyển khoản: VINTEK + số điện thoại
    const transferContent = `VINTEK ${user.phoneNumber}`;
    document.getElementById('transferContent').textContent = transferContent;
    document.getElementById('transferAmount').textContent = formatPrice(finalAmount);
    
    // Cập nhật QR code
    const qrImage = document.getElementById('qrCodeImage');
    const amount = finalAmount;
    const addInfo = encodeURIComponent(transferContent);
    qrImage.src = `https://img.vietqr.io/image/MB-8090112121997-compact2.png?amount=${amount}&addInfo=${addInfo}`;
}

// Cập nhật tóm tắt đơn hàng
function updateOrderSummary() {
    const cart = getCart();
    const subtotal = calculateCartTotal();
    const shippingFee = calculateShippingFee();
    
    // Kiểm tra phương thức thanh toán
    const isBankTransfer = document.getElementById('bankTransfer').checked;
    const discount = isBankTransfer ? Math.round(subtotal * BANK_TRANSFER_DISCOUNT) : 0;
    const total = subtotal + shippingFee - discount;
    
    // Kiểm tra điều kiện miễn ship để hiển thị thông báo
    const hasFreeShipProduct = cart.some(item => item.freeShip === true);
    
    // Cập nhật hiển thị
    document.getElementById('subtotal').textContent = formatPrice(subtotal);
    
    const shippingFeeElement = document.getElementById('shippingFee');
    if (shippingFee === 0) {
        shippingFeeElement.innerHTML = `
            <span class="text-success">Miễn phí</span>
            ${hasFreeShipProduct ? 
                '<br><small class="text-muted">(Có sản phẩm miễn ship)</small>' : 
                '<br><small class="text-muted"></small>'}
        `;
    } else {
        shippingFeeElement.textContent = formatPrice(shippingFee);
    }
    
    const discountRow = document.getElementById('discountRow');
    if (discount > 0) {
        discountRow.style.display = 'flex';
        document.getElementById('discountAmount').textContent = '-' + formatPrice(discount);
    } else {
        discountRow.style.display = 'none';
    }
    
    document.getElementById('totalAmount').textContent = formatPrice(total);
}

// Đặt hàng
// function placeOrder() {
//     const form = document.getElementById('checkoutForm');
    
//     if (!form.checkValidity()) {
//         form.reportValidity();
//         return;
//     }
    
//     const user = getCurrentUser();
//     const cart = getCart();
//     const subtotal = calculateCartTotal();
//     const shippingFee = calculateShippingFee();
    
//     const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;
//     const discount = paymentMethod === 'bank' ? Math.round(subtotal * BANK_TRANSFER_DISCOUNT) : 0;
//     const total = subtotal + shippingFee - discount;
    
//     // Tạo đơn hàng
//     const order = {
//         id: 'ORD' + Date.now(),
//         phoneNumber: user.phoneNumber,
//         fullName: document.getElementById('fullName').value,
//         address: document.getElementById('address').value,
//         note: document.getElementById('note').value,
//         items: cart,
//         subtotal: subtotal,
//         shippingFee: shippingFee,
//         discount: discount,
//         total: total,
//         paymentMethod: paymentMethod === 'cod' ? 'COD' : 'Chuyển khoản',
//         status: paymentMethod === 'cod' ? 'Mới' : 'Chờ thanh toán',
//         createdAt: new Date().toISOString()
//     };
    
//     // Lưu đơn hàng
//     let orders = JSON.parse(localStorage.getItem('orders') || '[]');
//     orders.unshift(order);
//     localStorage.setItem('orders', JSON.stringify(orders));
    
//     // Xóa giỏ hàng
//     clearCart();
    
//     // Chuyển đến trang cảm ơn
//     localStorage.setItem('lastOrderId', order.id);
//     window.location.href = 'thank-you.html';
// }

// Đặt hàng
function placeOrder() {
    const form = document.getElementById('checkoutForm');

    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    const user = getCurrentUser();
    const cart = getCart();
    const subtotal = calculateCartTotal();
    const shippingFee = calculateShippingFee();

    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;
    const discount = paymentMethod === 'bank' ? Math.round(subtotal * BANK_TRANSFER_DISCOUNT) : 0;
    const total = subtotal + shippingFee - discount;

    // Tạo đơn hàng
    const order = {
        id: 'ORD' + Date.now(),
        phoneNumber: user.phoneNumber,
        fullName: document.getElementById('fullName').value,
        address: document.getElementById('address').value,
        note: document.getElementById('note').value,
        items: cart,
        subtotal: subtotal,
        shippingFee: shippingFee,
        // discount: discount,
        bankDiscount: paymentMethod === 'bank' ? discount : 0,
        total: total,
        paymentMethod: paymentMethod === 'cod' ? 'COD' : 'Chuyển khoản',
        status: paymentMethod === 'cod' ? 'Mới' : 'Chờ thanh toán',
        createdAt: new Date().toISOString()
    };

    // Gửi lên Google Sheet
    fetch("https://script.google.com/macros/s/AKfycbytiSVlScLIGAIp-oRI1locK7FeplgDwMsMC6SxmMiH062d4Dt_ZXjSEP6nISGKvd7-Kw/exec", {
        method: "POST",
        mode: "no-cors",
        body: JSON.stringify(order),
    });

    // Lưu LocalStorage
    let orders = JSON.parse(localStorage.getItem('orders') || '[]');
    orders.unshift(order);
    localStorage.setItem('orders', JSON.stringify(orders));

    // Clear giỏ hàng
    clearCart();

    localStorage.setItem('lastOrderId', order.id);

    window.location.href = 'thank-you.html';
}



// Format giá
function formatPrice(price) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(price);
}

// Export functions
window.updatePaymentMethod = updatePaymentMethod;
window.placeOrder = placeOrder;