// cart.js - Xử lý giỏ hàng

// Lấy giỏ hàng từ localStorage
function getCart() {
  const cart = localStorage.getItem("cart");
  return cart ? JSON.parse(cart) : [];
}

// Lưu giỏ hàng vào localStorage
function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
}

// Thêm sản phẩm vào giỏ
function addToCart(productId, quantity = 1) {
  const products = getProducts();
  const product = products.find((p) => p.id === productId);

  if (!product) {
    showAlert("Không tìm thấy sản phẩm!", "danger");
    return;
  }

  let cart = getCart();
  const existingItem = cart.find((item) => item.id === productId);

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.salePrice || product.price,
      image: product.image,
      quantity: quantity,
      unit: product.unit,
      freeShip: product.freeShip || false, // 🔥 thêm dòng này
    });
  }

  saveCart(cart);
  showAlert(`Đã thêm ${product.name} vào giỏ hàng!`, "success");
}

// Cập nhật số lượng sản phẩm
function updateCartItemQuantity(productId, quantity) {
  let cart = getCart();
  const item = cart.find((item) => item.id === productId);

  if (item) {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      item.quantity = quantity;
      saveCart(cart);
    }
  }
}

// Xóa sản phẩm khỏi giỏ
function removeFromCart(productId) {
  let cart = getCart();
  cart = cart.filter((item) => item.id !== productId);
  saveCart(cart);

  // Reload trang giỏ hàng nếu đang ở trang đó
  if (window.location.pathname.includes("cart.html")) {
    loadCartPage();
  }
}

// Xóa toàn bộ giỏ hàng
function clearCart() {
  localStorage.removeItem("cart");
  updateCartCount();
}

// Cập nhật số lượng hiển thị trên icon giỏ hàng
function updateCartCount() {
  const cart = getCart();
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const cartCountElements = document.querySelectorAll("#cartCount");
  cartCountElements.forEach((element) => {
    element.textContent = totalItems;
    element.style.display = totalItems > 0 ? "block" : "none";
  });
}

// Tính tổng tiền giỏ hàng
function calculateCartTotal() {
  const cart = getCart();
  const total = cart.reduce((sum, item) => {
    const itemPrice = item.price || 0;
    const itemQty = item.quantity || 0;
    return sum + itemPrice * itemQty;
  }, 0);
  return total;
}

// Lấy danh sách sản phẩm
// function getProducts() {
//   // Lấy từ admin nếu có, không thì dùng default
//   const adminProducts = localStorage.getItem("adminProducts");
//   if (adminProducts) {
//     return JSON.parse(adminProducts);
//   }

//   // Dữ liệu sản phẩm mặc định
//   return [
//     // ===== PHỤ GIA ỐP LÁT =====
//     {
//       id: 1,
//       name: "Phụ gia ốp lát VINTEK 1 túi",
//       category: "Ốp lát",
//       price: 295000,
//       salePrice: null,
//       unit: "Túi 1kg",
//       image:
//         "https://firebasestorage.googleapis.com/v0/b/js230214-7830a.appspot.com/o/VINTEK%2Ffcc4d0514604ca5a93156.jpg?alt=media&token=a4c41355-7753-491c-bec5-211d51f8d784?w=500",
//       description:
//         "Phụ gia ốp lát VINTEK giúp chống bong tróc, tăng độ bám dính cực mạnh, chống nứt và tăng độ dẻo cho vữa ốp lát.",
//       usage:
//         "✅ Chống bong tróc – bám dính cực mạnh.\n" +
//         "✅ Chống nứt vỡ – hạn chế co ngót.\n" +
//         "✅ Tăng độ dẻo – dễ thi công, không khô nhanh.\n\n" +
//         " Tặng 1 cốc đong định lượng khi mua từ 3 túi.",
//         features: ["Giá cả phải chăng", "Chất lượng ổn định", "Dễ sử dụng", "Phù hợp cho mọi công trình"],
//       mixRatio: "2 bao xi măng + 30–50kg cát + 300g phụ gia.",
//       coverage: "1 túi 1kg làm được khoảng 60m² nền và tường.",
//     },
//     {
//       id: 2,
//       name: "Combo 3 túi phụ gia ốp lát VINTEK",
//       category: "Ốp lát",
//       price: 885000,
//       salePrice: 855000,
//       unit: "Combo 3 túi (3kg)",
//       image:
//         "https://firebasestorage.googleapis.com/v0/b/js230214-7830a.appspot.com/o/VINTEK%2Funnamed.jpg?alt=media&token=903b3f54-6503-4f2f-bd14-f43fd1392597?w=500",
//       description:
//         "Combo 3 túi phụ gia ốp lát VINTEK – giá ưu đãi, chất lượng cao, tặng kèm cốc đong định lượng.",
//       usage:
//         "✅ Chống bong tróc – bám dính cực mạnh.\n" +
//         "✅ Chống nứt vỡ – hạn chế co ngót.\n" +
//         "✅ Tăng độ dẻo – dễ thi công, không khô nhanh.\n\n" +
//         " Tặng 1 cốc đong định lượng khi mua từ 3 túi.",
//         features: ["Giá cả phải chăng", "Chất lượng ổn định", "Dễ sử dụng", "Phù hợp cho mọi công trình"],
//       mixRatio: "2 bao xi măng + 30–50kg cát + 300g phụ gia",
//       coverage: "3 túi thi công được khoảng 180m² nền và tường.",
//     },

//     {
//       id: 3,
//       name: "Combo 5 túi phụ gia ốp lát VINTEK",
//       category: "Ốp lát",
//       price: 1475000,
//       salePrice: 1325000,
//       unit: "Combo 5 túi (5kg)",
//       image:
//         "https://firebasestorage.googleapis.com/v0/b/js230214-7830a.appspot.com/o/VINTEK%2Funnamed%20(1).jpg?alt=media&token=09eaad29-39db-41a8-a0f5-9e8ede3c75f9?w=500",
//       description:
//         "Combo 5 túi phụ gia ốp lát VINTEK – dành cho công trình vừa, tiết kiệm , miễn phí vận chuyển toàn quốc.",
//       usage:
//         "✅ Giá chỉ còn 265.000đ/túi.\n" +
//         "✅ Chống bong tróc – tăng bám dính cực mạnh.\n" +
//         "✅ Phù hợp cho công trình 300m².\n" +
//         "⭐ Miễn phí giao hàng + tặng cốc đong định lượng ⭐",
//         features: ["Giá cả phải chăng", "Chất lượng ổn định", "Dễ sử dụng", "Phù hợp cho mọi công trình"],
//       mixRatio: "2 bao xi măng + 30–50kg cát + 300g phụ gia.",
//       coverage: "5 túi thi công được khoảng 300m² nền và tường.",
//     },
//     {
//       id: 4,
//       name: "Combo 10 túi phụ gia ốp lát VINTEK",
//       category: "Ốp lát",
//       price: 2950000,
//       salePrice: 2650000,
//       unit: "Combo 10 túi (10kg)",
//       image:
//         "https://firebasestorage.googleapis.com/v0/b/js230214-7830a.appspot.com/o/VINTEK%2Funnamed%20(2).jpg?alt=media&token=c28fd032-6a28-4626-b491-16f74a563c44?w=500",
//       description:
//         "Combo 10 túi phụ gia ốp lát VINTEK – giá sỉ cho công trình lớn, chiết khấu cao, freeship toàn quốc.",
//       usage:
//         "✅ Chỉ còn 265.000đ/túi.\n" +
//         "✅ Tặng 2 cốc đong định lượng.\n" +
//         "✅ Thi công 600m² nền và tường.\n" +
//         "⭐ Miễn phí giao hàng toàn quốc ⭐",
//         features: ["Giá cả phải chăng", "Chất lượng ổn định", "Dễ sử dụng", "Phù hợp cho mọi công trình"],
//       mixRatio: "2 bao xi măng + 30–50kg cát + 300g phụ gia.",
//       coverage: "10 túi thi công được khoảng 600m² nền và tường.",
//     },

//     // ===== PHỤ GIA XÂY TRÁT =====
//     {
//       id: 5,
//       name: "Phụ gia xây trát VINTEK 1 túi",
//       category: "Xây trát",
//       price: 185000,
//       salePrice: null,
//       unit: "Túi 1kg",
//       image:
//         "https://firebasestorage.googleapis.com/v0/b/js230214-7830a.appspot.com/o/VINTEK%2F28571848027275613789.jpg?alt=media&token=629c374d-9966-43d7-94b5-c86345beace1?w=500",
//       description:
//         "Phụ gia xây trát VINTEK giúp chống nứt, chống thấm và tăng độ dẻo cho vữa trát, cho bề mặt tường bền đẹp lâu dài.",
//       usage:
//         "💪 Tăng cường độ bền bằng cách chống lại sự tấn công của muối, sự ăn mòn của cốt thép và sự xâm nhập của nước.\n" +
//         "💪 Giảm thiểu cơ hội bong tróc tách lớp.\n" +
//         "💪 Duy trì tính thẩm mỹ bằng khả năng kháng ố bẩn, đổi màu, nấm mốc và rỉ sét.\n" +
//         "💪 Tăng cường khả năng thi công, cải thiện độ bám dính và giảm nứt.\n" +
//         "💪 Tự trám kín các khe nứt nhỏ, chịu được áp lực nước do mưa gió.\n" +
//         "💪 Đơn giản hóa thi công, rút ngắn thời gian xây dựng.\n" +
//         "💪 Giảm chi phí nhân công, tăng tuổi thọ công trình, giảm chi phí bảo trì.\n" +
//         "💪 Cải thiện tính thẩm mỹ lâu dài, nâng cao danh tiếng về chất lượng công trình.",
//         features: ["Giá cả phải chăng", "Chất lượng ổn định", "Dễ sử dụng", "Phù hợp cho mọi công trình"],
//       mixRatio: "1 bao xi măng + 100kg cát + 50–80g phụ gia.",
//       coverage: "1 túi 1kg dùng được cho khoảng 100m² tường.",
//     },
//     {
//       id: 6,
//       name: "Combo 3 túi phụ gia xây trát VINTEK",
//       category: "Xây trát",
//       price: 555000,
//       salePrice: 525000,
//       unit: "Combo 3 túi (3kg)",
//       image:
//         "https://firebasestorage.googleapis.com/v0/b/js230214-7830a.appspot.com/o/VINTEK%2Funnamed%20(3).jpg?alt=media&token=4d68636c-66ae-439a-b76f-ff588b564b30?w=500",
//       description:
//         "Combo 3 túi phụ gia xây trát VINTEK – tiết kiệm, hiệu quả, tặng cốc đong định lượng, freeship toàn quốc.",
//       usage:
//         "💪 Tăng cường độ bền bằng cách chống lại sự tấn công của muối, sự ăn mòn của cốt thép và sự xâm nhập của nước.\n" +
//         "💪 Giảm thiểu cơ hội bong tróc tách lớp.\n" +
//         "💪 Duy trì tính thẩm mỹ bằng khả năng kháng ố bẩn, đổi màu, nấm mốc và rỉ sét.\n" +
//         "💪 Tăng cường khả năng thi công, cải thiện độ bám dính và giảm nứt.\n" +
//         "💪 Tự trám kín các khe nứt nhỏ, chịu được áp lực nước do mưa gió.\n" +
//         "💪 Đơn giản hóa thi công, rút ngắn thời gian xây dựng.\n" +
//         "💪 Giảm chi phí nhân công, tăng tuổi thọ công trình, giảm chi phí bảo trì.\n" +
//         "💪 Cải thiện tính thẩm mỹ lâu dài, nâng cao danh tiếng về chất lượng công trình.",
//         features: ["Giá cả phải chăng", "Chất lượng ổn định", "Dễ sử dụng", "Phù hợp cho mọi công trình"],
//       mixRatio: "1 bao xi măng + 100kg cát + 50–80g phụ gia",
//       coverage: "3 túi thi công được khoảng 300m² tường.",
//     },
//     {
//       id: 7,
//       name: "Combo 5 túi phụ gia xây trát VINTEK",
//       category: "Xây trát",
//       price: 925000,
//       salePrice: 850000,
//       unit: "Combo 5 túi (5kg)",
//       image:
//         "https://firebasestorage.googleapis.com/v0/b/js230214-7830a.appspot.com/o/VINTEK%2Funnamed%20(5).jpg?alt=media&token=78d02302-300e-4827-8c87-4b4fd76a1722?w=500",
//       description:
//         "Combo 5 túi phụ gia xây trát VINTEK – giá cực ưu đãi cho thợ chuyên nghiệp, chống nứt thấm tuyệt đối.",
//       usage:
//         "💪 Tăng cường độ bền bằng cách chống lại sự tấn công của muối, sự ăn mòn của cốt thép và sự xâm nhập của nước.\n" +
//         "💪 Giảm thiểu cơ hội bong tróc tách lớp.\n" +
//         "💪 Duy trì tính thẩm mỹ bằng khả năng kháng ố bẩn, đổi màu, nấm mốc và rỉ sét.\n" +
//         "💪 Tăng cường khả năng thi công, cải thiện độ bám dính và giảm nứt.\n" +
//         "💪 Tự trám kín các khe nứt nhỏ, chịu được áp lực nước do mưa gió.\n" +
//         "💪 Đơn giản hóa thi công, rút ngắn thời gian xây dựng.\n" +
//         "💪 Giảm chi phí nhân công, tăng tuổi thọ công trình, giảm chi phí bảo trì.\n" +
//         "💪 Cải thiện tính thẩm mỹ lâu dài, nâng cao danh tiếng về chất lượng công trình.",
//         features: ["Giá cả phải chăng", "Chất lượng ổn định", "Dễ sử dụng", "Phù hợp cho mọi công trình"],
//       mixRatio: "1 bao xi măng + 100kg cát + 50–80g phụ gia",
//       coverage: "5 túi thi công được khoảng 500m² tường.",
//     },
//     {
//       id: 8,
//       name: "Combo 10 túi phụ gia xây trát VINTEK",
//       category: "Xây trát",
//       price: 1850000,
//       salePrice: 1600000,
//       unit: "Combo 10 túi (10kg)",
//       image:
//         "https://firebasestorage.googleapis.com/v0/b/js230214-7830a.appspot.com/o/VINTEK%2Funnamed%20(6).jpg?alt=media&token=83a00b14-b3ea-4e28-a1fe-ce903d03aeaf?w=500",
//       description:
//         "Combo 10 túi phụ gia xây trát VINTEK – giá sỉ cho đại lý, công trình lớn, hiệu quả cao và siêu tiết kiệm.",
//       usage:
//         "💪 Tăng cường độ bền bằng cách chống lại sự tấn công của muối, sự ăn mòn của cốt thép và sự xâm nhập của nước.\n" +
//         "💪 Giảm thiểu cơ hội bong tróc tách lớp.\n" +
//         "💪 Duy trì tính thẩm mỹ bằng khả năng kháng ố bẩn, đổi màu, nấm mốc và rỉ sét.\n" +
//         "💪 Tăng cường khả năng thi công, cải thiện độ bám dính và giảm nứt.\n" +
//         "💪 Tự trám kín các khe nứt nhỏ, chịu được áp lực nước do mưa gió.\n" +
//         "💪 Đơn giản hóa thi công, rút ngắn thời gian xây dựng.\n" +
//         "💪 Giảm chi phí nhân công, tăng tuổi thọ công trình, giảm chi phí bảo trì.\n" +
//         "💪 Cải thiện tính thẩm mỹ lâu dài, nâng cao danh tiếng về chất lượng công trình.",
//         features: ["Giá cả phải chăng", "Chất lượng ổn định", "Dễ sử dụng", "Phù hợp cho mọi công trình"],
//       mixRatio: "1 bao xi măng + 100kg cát + 50–80g phụ gia.",
//       coverage: "10 túi thi công được khoảng 1.000m² tường.",
//     },
//   ];
// }

function getProducts() {
  // Lấy dữ liệu từ localStorage nếu có
  const adminProducts = localStorage.getItem("adminProducts");
  let products;

  if (adminProducts) {
    products = JSON.parse(adminProducts);
  } else {
    // Dữ liệu mặc định
    products = [
      // ===== PHỤ GIA ỐP LÁT =====
      {
        id: 1,
        name: "Phụ gia ốp lát VINTEK 1 túi",
        category: "Ốp lát",
        price: 295000,
        salePrice: null,
        unit: "Túi 1kg",
        image:
          "https://firebasestorage.googleapis.com/v0/b/js230214-7830a.appspot.com/o/VINTEK%2Ffcc4d0514604ca5a93156.jpg?alt=media&token=a4c41355-7753-491c-bec5-211d51f8d784?w=500",
        description:
          "Phụ gia ốp lát VINTEK giúp chống bong tróc, tăng độ bám dính cực mạnh, chống nứt và tăng độ dẻo cho vữa ốp lát.",
        usage:
          "✅ Chống bong tróc – bám dính cực mạnh.\n" +
          "✅ Chống nứt vỡ – hạn chế co ngót.\n" +
          "✅ Tăng độ dẻo – dễ thi công, không khô nhanh.\n\n" +
          " Tặng 1 cốc đong định lượng khi mua từ 3 túi.",
        features: [
          "Giá cả phải chăng",
          "Chất lượng ổn định",
          "Dễ sử dụng",
          "Phù hợp cho mọi công trình",
        ],
        mixRatio: "2 bao xi măng + 30–50kg cát + 300g phụ gia.",
        coverage: "1 túi 1kg làm được khoảng 60m² nền và tường.",
        freeShip: true,
      },
      {
        id: 2,
        name: "Combo 3 túi phụ gia ốp lát VINTEK",
        category: "Ốp lát",
        price: 885000,
        salePrice: 855000,
        unit: "Combo 3 túi (3kg)",
        image:
          "https://firebasestorage.googleapis.com/v0/b/js230214-7830a.appspot.com/o/VINTEK%2Funnamed.jpg?alt=media&token=903b3f54-6503-4f2f-bd14-f43fd1392597?w=500",
        description:
          "Combo 3 túi phụ gia ốp lát VINTEK – giá ưu đãi, chất lượng cao, tặng kèm cốc đong định lượng.",
        usage:
          "✅ Chống bong tróc – bám dính cực mạnh.\n" +
          "✅ Chống nứt vỡ – hạn chế co ngót.\n" +
          "✅ Tăng độ dẻo – dễ thi công, không khô nhanh.\n\n" +
          " Tặng 1 cốc đong định lượng khi mua từ 3 túi.",
        features: [
          "Giá cả phải chăng",
          "Chất lượng ổn định",
          "Dễ sử dụng",
          "Phù hợp cho mọi công trình",
        ],
        mixRatio: "2 bao xi măng + 30–50kg cát + 300g phụ gia",
        coverage: "3 túi thi công được khoảng 180m² nền và tường.",
        freeShip: true,
      },

      {
        id: 3,
        name: "Combo 5 túi phụ gia ốp lát VINTEK",
        category: "Ốp lát",
        price: 1475000,
        salePrice: 1375000,
        unit: "Combo 5 túi (5kg)",
        image:
          "https://firebasestorage.googleapis.com/v0/b/js230214-7830a.appspot.com/o/VINTEK%2Funnamed%20(1).jpg?alt=media&token=09eaad29-39db-41a8-a0f5-9e8ede3c75f9?w=500",
        description:
          "Combo 5 túi phụ gia ốp lát VINTEK – dành cho công trình vừa, tiết kiệm , miễn phí vận chuyển toàn quốc.",
        usage:
          "✅ Giá chỉ còn 275.000đ/túi.\n" +
          "✅ Chống bong tróc – tăng bám dính cực mạnh.\n" +
          "✅ Phù hợp cho công trình 300m².\n" +
          "⭐ Miễn phí giao hàng + tặng cốc đong định lượng ⭐",
        features: [
          "Giá cả phải chăng",
          "Chất lượng ổn định",
          "Dễ sử dụng",
          "Phù hợp cho mọi công trình",
        ],
        mixRatio: "2 bao xi măng + 30–50kg cát + 300g phụ gia.",
        coverage: "5 túi thi công được khoảng 300m² nền và tường.",
        freeShip: true,
      },
      {
        id: 4,
        name: "Combo 10 túi phụ gia ốp lát VINTEK",
        category: "Ốp lát",
        price: 2950000,
        salePrice: 2620000,
        unit: "Combo 10 túi (10kg)",
        image:
          "https://firebasestorage.googleapis.com/v0/b/js230214-7830a.appspot.com/o/VINTEK%2Funnamed%20(2).jpg?alt=media&token=c28fd032-6a28-4626-b491-16f74a563c44?w=500",
        description:
          "Combo 10 túi phụ gia ốp lát VINTEK – giá sỉ cho công trình lớn, chiết khấu cao, freeship toàn quốc.",
        usage:
          "✅ Chỉ còn 262.000đ/túi.\n" +
          "✅ Tặng 2 cốc đong định lượng.\n" +
          "✅ Thi công 600m² nền và tường.\n" +
          "⭐ Miễn phí giao hàng toàn quốc ⭐",
        features: [
          "Giá cả phải chăng",
          "Chất lượng ổn định",
          "Dễ sử dụng",
          "Phù hợp cho mọi công trình",
        ],
        mixRatio: "2 bao xi măng + 30–50kg cát + 300g phụ gia.",
        coverage: "10 túi thi công được khoảng 600m² nền và tường.",
        freeShip: true,
      },

      // ===== PHỤ GIA XÂY TRÁT =====
      {
        id: 5,
        name: "Phụ gia xây trát VINTEK 1 túi",
        category: "Xây trát",
        price: 185000,
        salePrice: null,
        unit: "Túi 1kg",
        image:
          "https://firebasestorage.googleapis.com/v0/b/js230214-7830a.appspot.com/o/VINTEK%2F28571848027275613789.jpg?alt=media&token=629c374d-9966-43d7-94b5-c86345beace1?w=500",
        description:
          "Phụ gia xây trát VINTEK giúp chống nứt, chống thấm và tăng độ dẻo cho vữa trát, cho bề mặt tường bền đẹp lâu dài.",
        usage:
          "💪 Tăng cường độ bền bằng cách chống lại sự tấn công của muối, sự ăn mòn của cốt thép và sự xâm nhập của nước.\n" +
          "💪 Giảm thiểu cơ hội bong tróc tách lớp.\n" +
          "💪 Duy trì tính thẩm mỹ bằng khả năng kháng ố bẩn, đổi màu, nấm mốc và rỉ sét.\n" +
          "💪 Tăng cường khả năng thi công, cải thiện độ bám dính và giảm nứt.\n" +
          "💪 Tự trám kín các khe nứt nhỏ, chịu được áp lực nước do mưa gió.\n" +
          "💪 Đơn giản hóa thi công, rút ngắn thời gian xây dựng.\n" +
          "💪 Giảm chi phí nhân công, tăng tuổi thọ công trình, giảm chi phí bảo trì.\n" +
          "💪 Cải thiện tính thẩm mỹ lâu dài, nâng cao danh tiếng về chất lượng công trình.",
        features: [
          "Giá cả phải chăng",
          "Chất lượng ổn định",
          "Dễ sử dụng",
          "Phù hợp cho mọi công trình",
        ],
        mixRatio: "1 bao xi măng + 100kg cát + 50–80g phụ gia.",
        coverage: "1 túi 1kg dùng được cho khoảng 100m² tường.",
        freeShip: false,
      },
      {
        id: 6,
        name: "Combo 3 túi phụ gia xây trát VINTEK",
        category: "Xây trát",
        price: 555000,
        salePrice: 525000,
        unit: "Combo 3 túi (3kg)",
        image:
          "https://firebasestorage.googleapis.com/v0/b/js230214-7830a.appspot.com/o/VINTEK%2Funnamed%20(3).jpg?alt=media&token=4d68636c-66ae-439a-b76f-ff588b564b30?w=500",
        description:
          "Combo 3 túi phụ gia xây trát VINTEK – tiết kiệm, hiệu quả, tặng cốc đong định lượng, freeship toàn quốc.",
        usage:
          "💪 Tăng cường độ bền bằng cách chống lại sự tấn công của muối, sự ăn mòn của cốt thép và sự xâm nhập của nước.\n" +
          "💪 Giảm thiểu cơ hội bong tróc tách lớp.\n" +
          "💪 Duy trì tính thẩm mỹ bằng khả năng kháng ố bẩn, đổi màu, nấm mốc và rỉ sét.\n" +
          "💪 Tăng cường khả năng thi công, cải thiện độ bám dính và giảm nứt.\n" +
          "💪 Tự trám kín các khe nứt nhỏ, chịu được áp lực nước do mưa gió.\n" +
          "💪 Đơn giản hóa thi công, rút ngắn thời gian xây dựng.\n" +
          "💪 Giảm chi phí nhân công, tăng tuổi thọ công trình, giảm chi phí bảo trì.\n" +
          "💪 Cải thiện tính thẩm mỹ lâu dài, nâng cao danh tiếng về chất lượng công trình.",
        features: [
          "Giá cả phải chăng",
          "Chất lượng ổn định",
          "Dễ sử dụng",
          "Phù hợp cho mọi công trình",
        ],
        mixRatio: "1 bao xi măng + 100kg cát + 50–80g phụ gia",
        coverage: "3 túi thi công được khoảng 300m² tường.",
        freeShip: true,
      },
      {
        id: 7,
        name: "Combo 5 túi phụ gia xây trát VINTEK",
        category: "Xây trát",
        price: 925000,
        salePrice: 850000,
        unit: "Combo 5 túi (5kg)",
        image:
          "https://firebasestorage.googleapis.com/v0/b/js230214-7830a.appspot.com/o/VINTEK%2Funnamed%20(5).jpg?alt=media&token=78d02302-300e-4827-8c87-4b4fd76a1722?w=500",
        description:
          "Combo 5 túi phụ gia xây trát VINTEK – giá cực ưu đãi cho thợ chuyên nghiệp, chống nứt thấm tuyệt đối.",
        usage:
          "💪 Tăng cường độ bền bằng cách chống lại sự tấn công của muối, sự ăn mòn của cốt thép và sự xâm nhập của nước.\n" +
          "💪 Giảm thiểu cơ hội bong tróc tách lớp.\n" +
          "💪 Duy trì tính thẩm mỹ bằng khả năng kháng ố bẩn, đổi màu, nấm mốc và rỉ sét.\n" +
          "💪 Tăng cường khả năng thi công, cải thiện độ bám dính và giảm nứt.\n" +
          "💪 Tự trám kín các khe nứt nhỏ, chịu được áp lực nước do mưa gió.\n" +
          "💪 Đơn giản hóa thi công, rút ngắn thời gian xây dựng.\n" +
          "💪 Giảm chi phí nhân công, tăng tuổi thọ công trình, giảm chi phí bảo trì.\n" +
          "💪 Cải thiện tính thẩm mỹ lâu dài, nâng cao danh tiếng về chất lượng công trình.",
        features: [
          "Giá cả phải chăng",
          "Chất lượng ổn định",
          "Dễ sử dụng",
          "Phù hợp cho mọi công trình",
        ],
        mixRatio: "1 bao xi măng + 100kg cát + 50–80g phụ gia",
        coverage: "5 túi thi công được khoảng 500m² tường.",
        freeShip: true,
      },
      {
        id: 8,
        name: "Combo 10 túi phụ gia xây trát VINTEK",
        category: "Xây trát",
        price: 1850000,
        salePrice: 1620000,
        unit: "Combo 10 túi (10kg)",
        image:
          "https://firebasestorage.googleapis.com/v0/b/js230214-7830a.appspot.com/o/VINTEK%2Funnamed%20(6).jpg?alt=media&token=83a00b14-b3ea-4e28-a1fe-ce903d03aeaf?w=500",
        description:
          "Combo 10 túi phụ gia xây trát VINTEK – giá sỉ cho đại lý, công trình lớn, hiệu quả cao và siêu tiết kiệm.",
        usage:
          "💪 Tăng cường độ bền bằng cách chống lại sự tấn công của muối, sự ăn mòn của cốt thép và sự xâm nhập của nước.\n" +
          "💪 Giảm thiểu cơ hội bong tróc tách lớp.\n" +
          "💪 Duy trì tính thẩm mỹ bằng khả năng kháng ố bẩn, đổi màu, nấm mốc và rỉ sét.\n" +
          "💪 Tăng cường khả năng thi công, cải thiện độ bám dính và giảm nứt.\n" +
          "💪 Tự trám kín các khe nứt nhỏ, chịu được áp lực nước do mưa gió.\n" +
          "💪 Đơn giản hóa thi công, rút ngắn thời gian xây dựng.\n" +
          "💪 Giảm chi phí nhân công, tăng tuổi thọ công trình, giảm chi phí bảo trì.\n" +
          "💪 Cải thiện tính thẩm mỹ lâu dài, nâng cao danh tiếng về chất lượng công trình.",
        features: [
          "Giá cả phải chăng",
          "Chất lượng ổn định",
          "Dễ sử dụng",
          "Phù hợp cho mọi công trình",
        ],
        mixRatio: "1 bao xi măng + 100kg cát + 50–80g phụ gia.",
        coverage: "10 túi thi công được khoảng 1.000m² tường.",
        freeShip: true,
      },
    ];
  }

  // 🔀 Xáo trộn mảng sản phẩm mỗi lần gọi hàm
  products = products.sort(() => Math.random() - 0.5);

  return products;
}

// Export các functions
window.addToCart = addToCart;
window.updateCartItemQuantity = updateCartItemQuantity;
window.removeFromCart = removeFromCart;
window.clearCart = clearCart;
window.getCart = getCart;
window.calculateCartTotal = calculateCartTotal;
window.getProducts = getProducts;
