// checkout.js - JavaScript cho trang thanh toán

let appliedVoucher = null;

// Lấy settings từ admin
function getSettings() {
  const settingsStr = localStorage.getItem("adminSettings");
  const settings = settingsStr ? JSON.parse(settingsStr) : {};

  return {
    bankDiscountPercent: settings.bankDiscountPercent || 3,
    shippingFee: settings.shippingFee || 30000,
    freeShipThreshold: settings.freeShipThreshold || 10,
    bankName: settings.bankName || "MB Bank",
    bankAccount: settings.bankAccount || "0123456789",
    bankAccountName: settings.bankAccountName || "CONG TY VINTEK",
  };
}

document.addEventListener("DOMContentLoaded", function () {
  checkAuthentication();

  const cart = getCart();

  console.log("=== CHECKOUT PAGE INIT ===");
  console.log("Cart:", cart);
  console.log("Cart length:", cart.length);

  if (cart.length === 0) {
    alert("Giỏ hàng trống!");
    window.location.href = "products.html";
    return;
  }

  loadCheckoutPage();

  console.log("Checkout page loaded");
});

// Load trang thanh toán
function loadCheckoutPage() {
  console.log("=== LOAD CHECKOUT PAGE ===");

  const user = getCurrentUser();
  const cart = getCart();

  console.log("User:", user);
  console.log("Cart items:", cart.length);

  // Điền số điện thoại
  const phoneInput = document.getElementById("phoneNumber");
  if (phoneInput) {
    phoneInput.value = user.phoneNumber;
    console.log("Phone set:", user.phoneNumber);
  }

  // Hiển thị sản phẩm trong đơn hàng
  const orderItemsContainer = document.getElementById("orderItems");
  if (!orderItemsContainer) {
    console.error("orderItems container not found!");
    return;
  }

  orderItemsContainer.innerHTML = "";

  cart.forEach((item) => {
    console.log("Adding item:", item.name, item.price, item.quantity);
    const itemDiv = document.createElement("div");
    itemDiv.className = "border-bottom pb-2 mb-2";
    itemDiv.innerHTML = `
            <div class="d-flex justify-content-between align-items-start">
                <div class="d-flex gap-2 flex-grow-1">
                    <img src="${
                      item.image
                    }" style="width: 50px; height: 50px; object-fit: cover; border-radius: 8px;" alt="${
      item.name
    }">
                    <div class="flex-grow-1">
                        <div class="small fw-semibold">${item.name}</div>
                        <div class="text-muted small">SL: ${item.quantity}</div>
                    </div>
                </div>
                <div class="text-end">
                    <div class="fw-semibold">${formatPrice(
                      item.price * item.quantity
                    )}</div>
                </div>
            </div>
        `;
    orderItemsContainer.appendChild(itemDiv);
  });

  console.log("Items rendered:", cart.length);

  // QUAN TRỌNG: Cập nhật tóm tắt thanh toán
  // Thêm timeout nhỏ để đảm bảo DOM đã render
  setTimeout(() => {
    console.log("Calling updateOrderSummary...");
    updateOrderSummary();
    console.log("updateOrderSummary completed");
  }, 100);
}

// Cập nhật phương thức thanh toán
function updatePaymentMethod() {
  console.log("=== UPDATE PAYMENT METHOD ===");

  const bankTransferRadio = document.getElementById("bankTransfer");
  const bankTransferInfo = document.getElementById("bankTransferInfo");

  if (!bankTransferRadio || !bankTransferInfo) {
    console.error("Missing payment method elements");
    return;
  }

  const isBankTransfer = bankTransferRadio.checked;
  console.log("Bank transfer selected:", isBankTransfer);

  if (isBankTransfer) {
    bankTransferInfo.style.display = "block";
    console.log("Showing bank transfer info...");
    updateBankTransferInfo();
  } else {
    bankTransferInfo.style.display = "none";
    console.log("Hiding bank transfer info");
  }

  // Cập nhật lại tổng tiền
  updateOrderSummary();
}

function updateBankTransferInfo() {
  const user = getCurrentUser();
  const cart = getCart();
  const settings = getSettings(); // 🔥 Lấy cấu hình động từ admin

  const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 0), 0);

  const subtotal = calculateCartTotal();

  // Phí ship: miễn phí nếu vượt ngưỡng
  const shippingFee =
    totalItems >= settings.freeShipThreshold ? 0 : settings.shippingFee;
  document.getElementById("shippingFee").textContent =
    shippingFee === 0 ? "Miễn phí" : formatPrice(shippingFee);

  // Voucher giảm giá
  let voucherDiscount = 0;
  if (appliedVoucher) {
    if (appliedVoucher.type === "percent") {
      voucherDiscount = Math.round((subtotal * appliedVoucher.value) / 100);
    } else {
      voucherDiscount = appliedVoucher.value;
    }
  }

  // Giảm giá chuyển khoản (3%, hoặc theo admin config)
  const bankDiscount = Math.round(
    subtotal * (settings.bankDiscountPercent / 100)
  );

  // Tổng thanh toán cuối cùng
  const finalAmount = subtotal + shippingFee - voucherDiscount - bankDiscount;

  // ✅ Nội dung chuyển khoản động
  const transferContent = `VINTEK ${user.phoneNumber}`;
  document.getElementById("transferContent").textContent = transferContent;
  document.getElementById("transferAmount").textContent =
    formatPrice(finalAmount);

  // ✅ Cập nhật thông tin ngân hàng từ admin
  document.getElementById("displayBankName").textContent = settings.bankName;
  document.getElementById("displayBankAccount").textContent =
    settings.bankAccount;
  document.getElementById("displayBankAccountName").textContent =
    settings.bankAccountName;

  // ✅ Sinh link QR động từ dữ liệu admin
  const bankCode = encodeURIComponent(settings.bankName.replace(/\s+/g, ""));
  const account = encodeURIComponent(settings.bankAccount);
  const addInfo = encodeURIComponent(transferContent);
  const qrImage = document.getElementById("qrCodeImage");

  qrImage.src = `https://img.vietqr.io/image/${bankCode}-${account}-compact2.png?amount=${finalAmount}&addInfo=${addInfo}`;
}

// Cập nhật tóm tắt đơn hàng
// function updateOrderSummary() {
//   const settings = getSettings(); // Lấy cấu hình từ admin
//   const cart = getCart(); // Lấy giỏ hàng

//   if (!cart || cart.length === 0) {
//     console.error("Giỏ hàng trống trong updateOrderSummary!");
//     return;
//   }

//   // Tính toán tổng số lượng sản phẩm trong giỏ
//   const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 0), 0);

//   // Tính tổng tiền giỏ hàng
//   const subtotal = calculateCartTotal();

//   console.log("=== TÓM TẮT ĐƠN HÀNG ===");
//   console.log("Cart items:", cart.length);
//   console.log("Total items:", totalItems);
//   console.log("Subtotal:", subtotal);

//   if (!subtotal || subtotal === 0) {
//     console.error("Subtotal là 0! Kiểm tra lại calculateCartTotal()");
//     return;
//   }

//   // Tính phí vận chuyển từ settings
//   const shippingFee = totalItems >= settings.freeShipThreshold ? 0 : settings.shippingFee;

//   // Tính giảm giá voucher nếu có
//   let voucherDiscount = 0;
//   if (appliedVoucher) {
//     if (appliedVoucher.type === "percent") {
//       voucherDiscount = Math.round((subtotal * appliedVoucher.value) / 100);
//     } else {
//       voucherDiscount = appliedVoucher.value;
//     }
//   }

//   // Kiểm tra phương thức thanh toán
//   const bankTransferRadio = document.getElementById("bankTransfer");
//   const isBankTransfer = bankTransferRadio && bankTransferRadio.checked;

//   // Tính giảm giá chuyển khoản (3% hoặc theo cấu hình từ admin)
//   const bankDiscountPercent = settings.bankDiscountPercent / 100;
//   const bankDiscount = isBankTransfer ? Math.round(subtotal * bankDiscountPercent) : 0;

//   // Tổng tiền cuối cùng
//   const total = subtotal + shippingFee - voucherDiscount - bankDiscount;

//   console.log("===================");

//   // Cập nhật lại DOM - Hiển thị giá trị vào các phần tử tương ứng
//   const subtotalEl = document.getElementById("subtotal");
//   const shippingFeeEl = document.getElementById("shippingFee");
//   const totalAmountEl = document.getElementById("totalAmount");

//   if (!subtotalEl || !shippingFeeEl || !totalAmountEl) {
//     console.error("Thiếu DOM elements!", {
//       subtotal: !!subtotalEl,
//       shippingFee: !!shippingFeeEl,
//       totalAmount: !!totalAmountEl,
//     });
//     return;
//   }

//   // Hiển thị tổng tiền trước thuế
//   subtotalEl.textContent = formatPrice(subtotal);

//   // Hiển thị phí vận chuyển
//   shippingFeeEl.textContent = shippingFee === 0 ? "Miễn phí" : formatPrice(shippingFee);

//   // Hiển thị tổng tiền thanh toán
//   totalAmountEl.textContent = formatPrice(total);

//   console.log("DOM đã được cập nhật:", {
//     subtotal: subtotalEl.textContent,
//     shipping: shippingFeeEl.textContent,
//     total: totalAmountEl.textContent,
//   });

//   // Hiển thị giảm giá voucher nếu có
//   const voucherDiscountRow = document.getElementById("voucherDiscountRow");
//   if (voucherDiscountRow) {
//     if (voucherDiscount > 0) {
//       voucherDiscountRow.style.display = "flex";
//       const voucherAmountEl = document.getElementById("voucherDiscountAmount");
//       if (voucherAmountEl) {
//         voucherAmountEl.textContent = "-" + formatPrice(voucherDiscount);
//       }
//     } else {
//       voucherDiscountRow.style.display = "none";
//     }
//   }

//   // Hiển thị giảm giá ngân hàng nếu có
//   const discountRow = document.getElementById("discountRow");
//   if (discountRow) {
//     if (bankDiscount > 0) {
//       discountRow.style.display = "flex";
//       const discountLabel = discountRow.querySelector("span:first-child");
//       if (discountLabel) {
//         discountLabel.textContent = `Giảm giá (${settings.bankDiscountPercent}%):`;
//       }
//       const discountAmountEl = document.getElementById("discountAmount");
//       if (discountAmountEl) {
//         discountAmountEl.textContent = "-" + formatPrice(bankDiscount);
//       }
//     } else {
//       discountRow.style.display = "none";
//     }
//   }
// }

function updateOrderSummary() {
    const cart = getCart(); // Lấy giỏ hàng
    const settings = {
        shippingFee: 30000,      // Phí vận chuyển mặc định
        freeShipThreshold: 5,    // Miễn phí nếu mua >= 5 sản phẩm
        bankDiscountPercent: 3   // Giảm 3% khi chuyển khoản
    };

    if (!cart || cart.length === 0) {
        document.getElementById("subtotal").textContent = "0đ";
        document.getElementById("shippingFee").textContent = formatPrice(settings.shippingFee);
        document.getElementById("totalAmount").textContent = "0đ";
        return;
    }

    // 1. Tính tổng số lượng và subtotal
    let totalItems = 0;
    let subtotal = 0;
    cart.forEach(item => {
        const qty = item.quantity || 1;
        totalItems += qty;
        subtotal += (item.price || 0) * qty;
    });

    // 2. Tính phí vận chuyển
    let shippingFee = totalItems >= settings.freeShipThreshold ? 0 : settings.shippingFee;

    // 3. Giảm giá voucher
    let voucherDiscount = 0;
    if (appliedVoucher) {
        if (appliedVoucher.type === "percent") {
            voucherDiscount = Math.round(subtotal * appliedVoucher.value / 100);
        } else {
            voucherDiscount = appliedVoucher.value;
        }
    }

    // 4. Giảm giá chuyển khoản
    const isBankTransfer = document.getElementById("bankTransfer").checked;
    let bankDiscount = isBankTransfer ? Math.round(subtotal * settings.bankDiscountPercent / 100) : 0;

    // 5. Tổng tiền cuối cùng
    const total = subtotal + shippingFee - voucherDiscount - bankDiscount;

    // 6. Cập nhật DOM
    document.getElementById("subtotal").textContent = formatPrice(subtotal);
    document.getElementById("shippingFee").textContent = shippingFee === 0 ? "Miễn phí" : formatPrice(shippingFee);
    document.getElementById("totalAmount").textContent = formatPrice(total);

    // Hiển thị giảm giá voucher
    const voucherRow = document.getElementById("voucherDiscountRow");
    if (voucherDiscount > 0) {
        voucherRow.style.display = "flex";
        document.getElementById("voucherDiscountAmount").textContent = "-" + formatPrice(voucherDiscount);
        document.getElementById("appliedVoucherCode").textContent = appliedVoucher.code || "";
    } else {
        voucherRow.style.display = "none";
    }

    // Hiển thị giảm giá chuyển khoản
    const discountRow = document.getElementById("discountRow");
    if (bankDiscount > 0) {
        discountRow.style.display = "flex";
        document.getElementById("discountAmount").textContent = "-" + formatPrice(bankDiscount);
    } else {
        discountRow.style.display = "none";
    }
}

// Hàm format số tiền
function formatPrice(num) {
    return num.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
}



// Đặt hàng

function placeOrder() {
  const form = document.getElementById("checkoutForm");
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  const settings = getSettings();
  const user = getCurrentUser();
  const cart = getCart();
  const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 0), 0);

  const subtotal = calculateCartTotal();

  const shippingFee =
    totalItems >= settings.freeShipThreshold ? 0 : settings.shippingFee;
  const paymentMethod = document.querySelector(
    'input[name="paymentMethod"]:checked'
  ).value;

  let voucherDiscount = 0;
  if (appliedVoucher) {
    voucherDiscount =
      appliedVoucher.type === "percent"
        ? Math.round((subtotal * appliedVoucher.value) / 100)
        : appliedVoucher.value;
  }

  const bankDiscount =
    paymentMethod === "bank"
      ? Math.round(subtotal * (settings.bankDiscountPercent / 100))
      : 0;

  const total = subtotal + shippingFee - voucherDiscount - bankDiscount;

  const order = {
    id: "ORD" + Date.now(),
    createdAt: new Date().toISOString(),

    fullName: document.getElementById("fullName").value,
    phoneNumber: user.phoneNumber,
    address: document.getElementById("address").value,
    note: document.getElementById("note").value,
    paymentMethod: paymentMethod,

    voucherCode: appliedVoucher ? appliedVoucher.code : "",
    subtotal: subtotal,
    shippingFee: shippingFee,
    voucherDiscount: voucherDiscount,
    bankDiscount: bankDiscount,
    total: total,

    items: cart,
  };

  fetch(
    "https://script.google.com/macros/s/AKfycbytiSVlScLIGAIp-oRI1locK7FeplgDwMsMC6SxmMiH062d4Dt_ZXjSEP6nISGKvd7-Kw/exec",
    {
      method: "POST",
      mode: "no-cors",
      body: JSON.stringify(order),
    }
  )
    .then(() => {
      console.log("Đã gửi lên Google Apps Script (no-cors).");

      // 1. Lưu đơn hàng local
      let orders = JSON.parse(localStorage.getItem("orders") || "[]");
      orders.unshift(order);
      localStorage.setItem("orders", JSON.stringify(orders));

      // 2. Clear giỏ hàng
      clearCart();

      // 3. Lưu lastOrderId
      localStorage.setItem("lastOrderId", order.id);

      // 4. Chuyển sang trang cảm ơn
      setTimeout(() => {
        window.location.href = "thank-you.html";
      }, 1200);
    })
    .catch((err) => {
      console.error("LỖI:", err);
    });
}

// Áp dụng voucher
function applyVoucher() {
  const code = document
    .getElementById("voucherCode")
    .value.trim()
    .toUpperCase();
  const messageEl = document.getElementById("voucherMessage");

  if (!code) {
    messageEl.className = "small mt-1 text-danger";
    messageEl.textContent = "Vui lòng nhập mã voucher";
    return;
  }

  // Lấy danh sách voucher
  const vouchers = JSON.parse(localStorage.getItem("adminVouchers") || "[]");
  const voucher = vouchers.find((v) => v.code === code);

  if (!voucher) {
    messageEl.className = "small mt-1 text-danger";
    messageEl.textContent = "Mã voucher không tồn tại";
    return;
  }

  // Kiểm tra hết hạn
  if (voucher.expiryDate) {
    const expiry = new Date(voucher.expiryDate);
    if (expiry < new Date()) {
      messageEl.className = "small mt-1 text-danger";
      messageEl.textContent = "Mã voucher đã hết hạn";
      return;
    }
  }

  // Kiểm tra giới hạn sử dụng
  if (voucher.usageLimit && voucher.usedCount >= voucher.usageLimit) {
    messageEl.className = "small mt-1 text-danger";
    messageEl.textContent = "Mã voucher đã hết lượt sử dụng";
    return;
  }

  // Kiểm tra số điện thoại
  if (voucher.phoneNumber) {
    const user = getCurrentUser();
    if (voucher.phoneNumber !== user.phoneNumber) {
      messageEl.className = "small mt-1 text-danger";
      messageEl.textContent = "Mã voucher không áp dụng cho tài khoản này";
      return;
    }
  }

  // Áp dụng voucher
  appliedVoucher = voucher;
  messageEl.className = "small mt-1 text-success";
  messageEl.textContent = `✓ Đã áp dụng mã ${code}`;

  // Hiển thị voucher đã áp dụng
  document.getElementById("appliedVoucherCode").textContent = code;
  document.getElementById("voucherCode").value = "";

  // Cập nhật tổng tiền
  updateOrderSummary();
}

// Xóa voucher
function removeVoucher() {
  appliedVoucher = null;
  document.getElementById("voucherMessage").textContent = "";
  updateOrderSummary();
}

// Cập nhật số lần sử dụng voucher
function updateVoucherUsage(voucherId) {
  let vouchers = JSON.parse(localStorage.getItem("adminVouchers") || "[]");
  const voucher = vouchers.find((v) => v.id === voucherId);

  if (voucher) {
    voucher.usedCount = (voucher.usedCount || 0) + 1;
    localStorage.setItem("adminVouchers", JSON.stringify(vouchers));
  }
}

// Format giá
function formatPrice(price) {
  if (!price && price !== 0) return "0₫";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
}

// Export functions
window.updatePaymentMethod = updatePaymentMethod;
window.placeOrder = placeOrder;
window.applyVoucher = applyVoucher;
window.removeVoucher = removeVoucher;
