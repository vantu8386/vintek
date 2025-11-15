// cart-page.js - JavaScript cho trang giỏ hàng

// Lấy settings từ admin
function getSettings() {
  const settingsStr = localStorage.getItem("adminSettings");
  const settings = settingsStr ? JSON.parse(settingsStr) : {};

  return {
    shippingFee: settings.shippingFee || 30000,
    freeShipThreshold: settings.freeShipThreshold || 2,
  };
}

document.addEventListener("DOMContentLoaded", function () {
  checkAuthentication();
  loadCartPage();
  updateCartCount();
});

// Load trang giỏ hàng
function loadCartPage() {
  const cart = getCart();
  const cartItemsContainer = document.getElementById("cartItems");
  const emptyCart = document.getElementById("emptyCart");
  const orderSummaryCard = document.getElementById("orderSummaryCard");

  if (cart.length === 0) {
    cartItemsContainer.style.display = "none";
    emptyCart.style.display = "block";
    orderSummaryCard.style.display = "none";
    return;
  }

  cartItemsContainer.style.display = "block";
  emptyCart.style.display = "none";
  orderSummaryCard.style.display = "block";

  // Render cart items
  cartItemsContainer.innerHTML = "";

  cart.forEach((item) => {
    const itemDiv = document.createElement("div");
    itemDiv.className = "border-bottom pb-3 mb-3";
    itemDiv.innerHTML = `
            <div class="row align-items-center">
                <div class="col-md-2 col-3">
                    <img src="${item.image}" class="cart-item-img w-100" alt="${
      item.name
    }">
                </div>
                <div class="col-md-4 col-9">
                    <h6 class="mb-1">${item.name}</h6>
                    <small class="text-muted">${item.unit}</small>
                    <div class="text-primary fw-bold mt-1">${formatPrice(
                      item.price
                    )}</div>
                </div>
                <div class="col-md-3 col-6 mt-3 mt-md-0">
                    <div class="quantity-control">
                        <button class="btn btn-sm" onclick="decreaseQuantity(${
                          item.id
                        })">
                            <i class="bi bi-dash"></i>
                        </button>
                        <input type="number" class="form-control form-control-sm" 
                               value="${item.quantity}" min="1" 
                               onchange="updateQuantity(${item.id}, this.value)"
                               style="width: 60px; text-align: center;">
                        <button class="btn btn-sm" onclick="increaseQuantity(${
                          item.id
                        })">
                            <i class="bi bi-plus"></i>
                        </button>
                    </div>
                </div>
                <div class="col-md-2 col-4 mt-3 mt-md-0 text-end">
                    <div class="fw-bold text-primary mb-2">
                        ${formatPrice(item.price * item.quantity)}
                    </div>
                    <button class="btn btn-sm btn-outline-danger" onclick="confirmRemoveItem(${
                      item.id
                    })">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            </div>
        `;
    cartItemsContainer.appendChild(itemDiv);
  });

  // Update order summary
  updateOrderSummary();
}

// Tăng số lượng
function increaseQuantity(productId) {
  const cart = getCart();
  const item = cart.find((i) => i.id === productId);
  if (item) {
    item.quantity++;
    saveCart(cart);
    loadCartPage();
  }
}

// Giảm số lượng
function decreaseQuantity(productId) {
  const cart = getCart();
  const item = cart.find((i) => i.id === productId);
  if (item && item.quantity > 1) {
    item.quantity--;
    saveCart(cart);
    loadCartPage();
  }
}

// Cập nhật số lượng
function updateQuantity(productId, quantity) {
  const qty = parseInt(quantity);
  if (qty > 0) {
    updateCartItemQuantity(productId, qty);
    loadCartPage();
  }
}

// Xác nhận xóa sản phẩm
function confirmRemoveItem(productId) {
  if (confirm("Bạn có chắc muốn xóa sản phẩm này khỏi giỏ hàng?")) {
    removeFromCart(productId);
    loadCartPage();
    showAlert("Đã xóa sản phẩm khỏi giỏ hàng", "success");
  }
}

// Cập nhật tóm tắt đơn hàng
function updateOrderSummary() {
  const settings = getSettings();
  const cart = getCart();
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = calculateCartTotal();

  // Tính phí vận chuyển theo settings admin
  // const shippingFee = totalItems >= settings.freeShipThreshold ? 0 : settings.shippingFee;
  // Kiểm tra nếu có sản phẩm được free ship riêng
  const hasFreeShipItem = cart.some((item) => item.freeShip === true);

  let shippingFee = 0;

  if (hasFreeShipItem) {
    shippingFee = 0; // sản phẩm này free ship
  } else if (totalItems >= settings.freeShipThreshold) {
    shippingFee = 0; // đạt ngưỡng miễn ship
  } else {
    shippingFee = settings.shippingFee; // tính phí ship bình thường
  }

  const total = subtotal + shippingFee;

  // Cập nhật hiển thị
  document.getElementById("subtotal").textContent = formatPrice(subtotal);
  document.getElementById("shippingFee").textContent =
    shippingFee === 0 ? "Miễn phí" : formatPrice(shippingFee);
  document.getElementById("total").textContent = formatPrice(total);

  // Hiển thị thông báo free ship
//   const freeShipNotice = document.getElementById("freeShipNotice");
//   if (totalItems >= settings.freeShipThreshold) {
//     freeShipNotice.innerHTML = `
//             <i class="bi bi-check-circle-fill"></i>
//             Bạn được miễn phí vận chuyển!
//         `;
//     freeShipNotice.className = "alert alert-success small";
//   } else {
//     const remaining = settings.freeShipThreshold - totalItems;
//     freeShipNotice.innerHTML = `
//             <i class="bi bi-info-circle"></i>
//             Mua thêm <strong>${remaining} sản phẩm</strong> để được miễn phí ship!
//         `;
//     freeShipNotice.className = "alert alert-info small";
//   }

const freeShipNotice = document.getElementById("freeShipNotice");

if (shippingFee === 0) {
  freeShipNotice.innerHTML = `
        <i class="bi bi-check-circle-fill"></i>
        Bạn được miễn phí vận chuyển!
    `;
  freeShipNotice.className = "alert alert-success small";
} else {
  const remaining = settings.freeShipThreshold - totalItems;
  freeShipNotice.innerHTML = `
        <i class="bi bi-info-circle"></i>
        Mua thêm <strong>${remaining} sản phẩm</strong> để được miễn phí ship!
    `;
  freeShipNotice.className = "alert alert-info small";
}

}

// Format giá
function formatPrice(price) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
}

// Export functions
window.increaseQuantity = increaseQuantity;
window.decreaseQuantity = decreaseQuantity;
window.updateQuantity = updateQuantity;
window.confirmRemoveItem = confirmRemoveItem;
window.loadCartPage = loadCartPage;
