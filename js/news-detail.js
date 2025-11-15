// news-detail.js

let currentArticle = null;

document.addEventListener('DOMContentLoaded', function() {
    checkAuthentication();
    loadNewsDetail();
    updateCartCount();
});

// Load chi tiết bài viết
function loadNewsDetail() {
    const urlParams = new URLSearchParams(window.location.search);
    const newsId = parseInt(urlParams.get('id'));
    
    if (!newsId) {
        alert('Không tìm thấy bài viết!');
        window.location.href = 'news.html';
        return;
    }
    
    const allNews = getNews();
    currentArticle = allNews.find(n => n.id === newsId);
    
    if (!currentArticle) {
        alert('Bài viết không tồn tại!');
        window.location.href = 'news.html';
        return;
    }
    
    // Update page content
    document.title = currentArticle.title + ' - VINTEK';
    document.getElementById('breadcrumbNews').textContent = currentArticle.title;
    document.getElementById('newsTitle').textContent = currentArticle.title;
    document.getElementById('newsAuthor').textContent = currentArticle.author;
    document.getElementById('newsDate').textContent = formatDate(currentArticle.createdAt);
    document.getElementById('newsThumbnail').src = currentArticle.thumbnail;
    document.getElementById('newsThumbnail').alt = currentArticle.title;
    document.getElementById('newsContent').innerHTML = currentArticle.content;
    
    // Load related products
    loadRelatedProducts();
    
    // Load latest news
    loadLatestNews();
}

// Load sản phẩm liên quan
function loadRelatedProducts() {
    if (!currentArticle.relatedProducts || currentArticle.relatedProducts.length === 0) {
        document.getElementById('relatedProducts').innerHTML = 
            '<p class="text-muted">Không có sản phẩm liên quan</p>';
        return;
    }
    
    const products = getProducts();
    const relatedProducts = products.filter(p => 
        currentArticle.relatedProducts.includes(p.id)
    );
    
    const container = document.getElementById('relatedProducts');
    container.innerHTML = '';
    
    relatedProducts.forEach(product => {
        const productDiv = document.createElement('div');
        productDiv.className = 'mb-3 pb-3 border-bottom';
        productDiv.innerHTML = `
            <div class="d-flex gap-2">
                <img src="${product.image}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px;" alt="${product.name}">
                <div class="flex-grow-1">
                    <h6 class="mb-1 small">${product.name}</h6>
                    <div class="text-primary fw-bold small">
                        ${product.salePrice ? formatPrice(product.salePrice) : formatPrice(product.price)}
                    </div>
                    <a href="product-detail.html?id=${product.id}" class="btn btn-sm btn-outline-primary mt-1">
                        Xem chi tiết
                    </a>
                </div>
            </div>
        `;
        container.appendChild(productDiv);
    });
}

// Load tin tức mới nhất
function loadLatestNews() {
    const allNews = getNews();
    const latestNews = allNews
        .filter(n => n.id !== currentArticle.id)
        .slice(0, 3);
    
    const container = document.getElementById('latestNews');
    container.innerHTML = '';
    
    latestNews.forEach(article => {
        const newsDiv = document.createElement('div');
        newsDiv.className = 'mb-3 pb-3 border-bottom';
        newsDiv.innerHTML = `
            <a href="news-detail.html?id=${article.id}" class="text-decoration-none text-dark">
                <div class="d-flex gap-2">
                    <img src="${article.thumbnail}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px;" alt="${article.title}">
                    <div>
                        <h6 class="mb-1 small">${article.title}</h6>
                        <small class="text-muted">
                            <i class="bi bi-calendar"></i> ${formatDate(article.createdAt)}
                        </small>
                    </div>
                </div>
            </a>
        `;
        container.appendChild(newsDiv);
    });
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Format price
function formatPrice(price) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(price);
}