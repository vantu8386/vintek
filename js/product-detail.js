// product-detail.js

let currentProduct = null;

document.addEventListener('DOMContentLoaded', function() {
    checkAuthentication();
    loadProductDetail();
    updateCartCount();
});

// Load chi tiết sản phẩm
function loadProductDetail() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id'));
    
    if (!productId) {
        alert('Không tìm thấy sản phẩm!');
        window.location.href = 'products.html';
        return;
    }
    
    const products = getProducts();
    currentProduct = products.find(p => p.id === productId);
    
    if (!currentProduct) {
        alert('Sản phẩm không tồn tại!');
        window.location.href = 'products.html';
        return;
    }
    
    // Update page content
    document.title = currentProduct.name + ' - VINTEK';
    document.getElementById('breadcrumbProduct').textContent = currentProduct.name;
    document.getElementById('productImage').src = currentProduct.image;
    document.getElementById('productImage').alt = currentProduct.name;
    document.getElementById('productCategory').textContent = currentProduct.category;
    document.getElementById('productName').textContent = currentProduct.name;
    document.getElementById('productDescription').textContent = currentProduct.description;
    document.getElementById('productUnit').textContent = currentProduct.unit;
    document.getElementById('productUsage').textContent = currentProduct.usage;
    document.getElementById('productMixRatio').textContent = currentProduct.mixRatio;
    document.getElementById('productCoverage').textContent = currentProduct.coverage;
    
    // Price section
    const priceSection = document.getElementById('priceSection');
    if (currentProduct.salePrice) {
        priceSection.innerHTML = `
            <div class="d-flex align-items-center gap-3">
                <span class="text-decoration-line-through text-muted fs-5">${formatPrice(currentProduct.price)}</span>
                <span class="text-danger fw-bold" style="font-size: 2rem;">${formatPrice(currentProduct.salePrice)}</span>
                <span class="badge bg-danger">-${Math.round((1 - currentProduct.salePrice/currentProduct.price) * 100)}%</span>
            </div>
        `;
    } else {
        priceSection.innerHTML = `
            <span class="text-primary fw-bold" style="font-size: 2rem;">${formatPrice(currentProduct.price)}</span>
        `;
    }
    
    // Features
    const featuresList = document.getElementById('productFeatures');
    featuresList.innerHTML = currentProduct.features.map(feature => 
        `<li class="mb-2"><i class="bi bi-check-circle-fill text-success me-2"></i>${feature}</li>`
    ).join('');
    
    // Load related products
    loadRelatedProducts();
}

// Load sản phẩm liên quan
function loadRelatedProducts() {
    const products = getProducts();
    const relatedProducts = products
        .filter(p => p.category === currentProduct.category && p.id !== currentProduct.id)
        .slice(0, 3);
    
    const container = document.getElementById('relatedProducts');
    container.innerHTML = '';
    
    relatedProducts.forEach(product => {
        const col = document.createElement('div');
        col.className = 'col-md-4';
        col.innerHTML = `
            <div class="card product-card h-100">
                <div class="position-relative">
                    <img src="${product.image}" class="product-image" alt="${product.name}">
                    ${product.salePrice ? 
                        `<span class="product-badge">-${Math.round((1 - product.salePrice/product.price) * 100)}%</span>` 
                        : ''}
                </div>
                <div class="card-body">
                    <span class="badge bg-secondary mb-2">${product.category}</span>
                    <h6 class="card-title">${product.name}</h6>
                    <div class="mb-3">
                        ${product.salePrice ? 
                            `<span class="price-old small">${formatPrice(product.price)}</span>
                             <span class="price-new d-block">${formatPrice(product.salePrice)}</span>` 
                            : 
                            `<span class="price-new">${formatPrice(product.price)}</span>`
                        }
                    </div>
                    <div class="d-grid gap-2">
                        <a href="product-detail.html?id=${product.id}" class="btn btn-outline-primary btn-sm">
                            <i class="bi bi-eye"></i> Xem chi tiết
                        </a>
                    </div>
                </div>
            </div>
        `;
        container.appendChild(col);
    });
}

// Tăng số lượng
function increaseQty() {
    const qtyInput = document.getElementById('quantity');
    qtyInput.value = parseInt(qtyInput.value) + 1;
}

// Giảm số lượng
function decreaseQty() {
    const qtyInput = document.getElementById('quantity');
    if (parseInt(qtyInput.value) > 1) {
        qtyInput.value = parseInt(qtyInput.value) - 1;
    }
}

// Thêm vào giỏ hàng
function addToCartDetail() {
    const quantity = parseInt(document.getElementById('quantity').value);
    if (quantity < 1) {
        showAlert('Số lượng không hợp lệ!', 'danger');
        return;
    }
    
    addToCart(currentProduct.id, quantity);
    document.getElementById('quantity').value = 1;
}

// Mua ngay
function buyNow() {
    const quantity = parseInt(document.getElementById('quantity').value);
    if (quantity < 1) {
        showAlert('Số lượng không hợp lệ!', 'danger');
        return;
    }
    
    addToCart(currentProduct.id, quantity);
    window.location.href = 'checkout.html';
}

// Format giá
function formatPrice(price) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(price);
}

// Export functions
window.increaseQty = increaseQty;
window.decreaseQty = decreaseQty;
window.addToCartDetail = addToCartDetail;
window.buyNow = buyNow;