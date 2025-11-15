// products.js - JavaScript cho trang sản phẩm

let currentFilter = 'all';

document.addEventListener('DOMContentLoaded', function() {
    checkAuthentication();
    loadProducts();
    updateCartCount();
});

// Load và hiển thị sản phẩm
function loadProducts(category = 'all') {
    const products = getProducts();
    const filteredProducts = category === 'all' 
        ? products 
        : products.filter(p => p.category === category);
    
    const container = document.getElementById('productsGrid');
    const emptyState = document.getElementById('emptyState');
    
    container.innerHTML = '';
    
    if (filteredProducts.length === 0) {
        emptyState.style.display = 'block';
        return;
    }
    
    emptyState.style.display = 'none';
    
    filteredProducts.forEach(product => {
        const col = document.createElement('div');
        col.className = 'col-md-4 col-lg-3';
        col.innerHTML = `
            <div class="card product-card h-100">
                <div class="position-relative">
                    <img src="${product.image}" class="product-image" alt="${product.name}">
                    ${product.salePrice ? 
                        `<span class="product-badge">-${Math.round((1 - product.salePrice/product.price) * 100)}%</span>` 
                        : ''}
                </div>
                <div class="card-body d-flex flex-column">
                    <span class="badge bg-secondary mb-2 align-self-start">${product.category}</span>
                    <h5 class="card-title">${product.name}</h5>
                    <p class="card-text text-muted small flex-grow-1">${product.description}</p>
                    <div class="mb-3">
                        <small class="text-muted">${product.unit}</small>
                    </div>
                    <div class="mb-3">
                        ${product.salePrice ? 
                            `<div class="d-flex align-items-center gap-2">
                                <span class="price-old small">${formatPrice(product.price)}</span>
                                <span class="price-new">${formatPrice(product.salePrice)}</span>
                            </div>` 
                            : 
                            `<span class="price-new">${formatPrice(product.price)}</span>`
                        }
                    </div>
                    <div class="d-grid gap-2">
                        <a href="product-detail.html?id=${product.id}" class="btn btn-outline-primary btn-sm">
                            <i class="bi bi-eye"></i> Xem chi tiết
                        </a>
                        <button class="btn btn-primary btn-sm" onclick="addToCart(${product.id})">
                            <i class="bi bi-cart-plus"></i> Thêm vào giỏ
                        </button>
                    </div>
                </div>
            </div>
        `;
        container.appendChild(col);
    });
}

// Lọc sản phẩm theo danh mục
function filterProducts(category) {
    currentFilter = category;
    
    // Update active button
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Load products with filter
    loadProducts(category);
}

// Format giá tiền
function formatPrice(price) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(price);
}

// Export function
window.filterProducts = filterProducts;