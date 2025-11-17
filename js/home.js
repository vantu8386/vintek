// home.js - JavaScript cho trang chủ

document.addEventListener('DOMContentLoaded', function() {
    // Kiểm tra đăng nhập
    checkAuthentication();
    
    // Hiển thị số điện thoại user
    displayUserPhone();
    
    // Load featured products
    loadFeaturedProducts();
    
    // Update cart count
    updateCartCount();
});

// Hiển thị số điện thoại user
function displayUserPhone() {
    const user = getCurrentUser();
    if (user && user.phoneNumber) {
        const userPhoneElement = document.getElementById('userPhone');
        if (userPhoneElement) {
            userPhoneElement.textContent = user.phoneNumber;
        }
    }
}

// Load sản phẩm nổi bật
function loadFeaturedProducts() {
    const products = getProducts();
    const featuredProducts = products.slice(0, 3); // Lấy 3 sản phẩm đầu
    
    const container = document.getElementById('featuredProducts');
    container.innerHTML = '';
    
    featuredProducts.forEach(product => {
        const col = document.createElement('div');
        col.className = 'col-md-4';
        col.innerHTML = `
            <div class="card product-card h-100">
                <div class="position-relative">
                    <img src="${product.image}" class="product-image" alt="${product.name}">
                    ${product.salePrice ? `<span class="product-badge">-${Math.round((1 - product.salePrice/product.price) * 100)}%</span>` : ''}
                    ${product.freeShip ? '<span class="badge bg-success position-absolute top-0 start-0 m-2"><i class="bi bi-truck"></i> Free ship</span>' : ''}
                </div>
                <div class="card-body">
                    <span class="badge bg-secondary mb-2">${product.category}</span>
                    <h5 class="card-title">${product.name}</h5>
                    <p class="card-text text-muted small">${product.description}</p>
                    <div class="d-flex justify-content-between align-items-center mb-3">
                        <div>
                            ${product.salePrice ? 
                                `<span class="price-old">${formatPrice(product.price)}</span>
                                 <span class="price-new d-block">${formatPrice(product.salePrice)}</span>` 
                                : 
                                `<span class="price-new">${formatPrice(product.price)}</span>`
                            }
                        </div>
                    </div>
                    <div class="d-grid gap-2">
                        <a href="product-detail.html?id=${product.id}" class="btn btn-outline-primary">
                            <i class="bi bi-eye"></i> Xem chi tiết
                        </a>
                        <button class="btn btn-primary" onclick="addToCart(${product.id})">
                            <i class="bi bi-cart-plus"></i> Thêm vào giỏ
                        </button>
                    </div>
                </div>
            </div>
        `;
        container.appendChild(col);
    });
}

// Format giá tiền
function formatPrice(price) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(price);
}