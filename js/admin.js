// admin.js - JavaScript cho trang quản trị với CRUD đầy đủ

const ADMIN_PASSWORD = 'vintekadmin';
let currentTab = 'orders';
let editingProductId = null;
let editingNewsId = null;
let editingVoucherId = null;

document.addEventListener('DOMContentLoaded', function() {
    checkAdminLogin();
});

// ========== ĐĂNG NHẬP ADMIN ==========
function checkAdminLogin() {
    const isAdminLoggedIn = sessionStorage.getItem('adminLoggedIn');
    if (isAdminLoggedIn === 'true') {
        showAdminPanel();
    } else {
        showLoginModal();
    }
}

function showLoginModal() {
    const modal = new bootstrap.Modal(document.getElementById('adminLoginModal'));
    modal.show();
    
    document.getElementById('adminLoginForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const password = document.getElementById('adminPassword').value;
        
        if (password === ADMIN_PASSWORD) {
            sessionStorage.setItem('adminLoggedIn', 'true');
            modal.hide();
            showAdminPanel();
        } else {
            alert('Mật khẩu không đúng!');
        }
    });
}

function showAdminPanel() {
    document.getElementById('adminPanel').style.display = 'block';
    loadOrders();
}

function adminLogout() {
    if (confirm('Bạn có chắc muốn đăng xuất?')) {
        sessionStorage.removeItem('adminLoggedIn');
        window.location.reload();
    }
}

// ========== CHUYỂN TAB ==========
function showTab(tabName) {
    document.querySelectorAll('.admin-tab').forEach(tab => tab.style.display = 'none');
    document.querySelectorAll('.admin-menu-item').forEach(item => item.classList.remove('active'));
    document.getElementById(tabName + 'Tab').style.display = 'block';
    event.target.closest('.admin-menu-item').classList.add('active');
    
    currentTab = tabName;
    
    switch(tabName) {
        case 'orders': loadOrders(); break;
        case 'products': loadProductsAdmin(); break;
        case 'news': loadNewsAdmin(); break;
        case 'vouchers': loadVouchers(); break;
        case 'customers': loadCustomers(); break;
        case 'settings': loadSettings(); break;
    }
}

// ========== QUẢN LÝ ĐƠN HÀNG ==========
function loadOrders() {
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const tbody = document.getElementById('ordersTableBody');
    tbody.innerHTML = '';
    
    if (orders.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center text-muted">Chưa có đơn hàng nào</td></tr>';
        return;
    }
    
    orders.forEach(order => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><strong>${order.id}</strong></td>
            <td>
                <div>${order.fullName}</div>
                <small class="text-muted">${order.phoneNumber}</small>
            </td>
            <td class="fw-bold text-primary">${formatPrice(order.total)}</td>
            <td><span class="badge bg-info">${order.paymentMethod}</span></td>
            <td>
                <select class="form-select form-select-sm status-badge ${getStatusClass(order.status)}" 
                        onchange="updateOrderStatus('${order.id}', this.value)">
                    <option value="Mới" ${order.status === 'Mới' ? 'selected' : ''}>Mới</option>
                    <option value="Chờ thanh toán" ${order.status === 'Chờ thanh toán' ? 'selected' : ''}>Chờ thanh toán</option>
                    <option value="Đang xử lý" ${order.status === 'Đang xử lý' ? 'selected' : ''}>Đang xử lý</option>
                    <option value="Đã giao" ${order.status === 'Đã giao' ? 'selected' : ''}>Đã giao</option>
                    <option value="Hủy" ${order.status === 'Hủy' ? 'selected' : ''}>Hủy</option>
                </select>
            </td>
            <td><small>${formatDate(order.createdAt)}</small></td>
            <td>
                <button class="btn btn-sm btn-outline-primary" onclick="viewOrderDetailAdmin('${order.id}')">
                    <i class="bi bi-eye"></i>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function updateOrderStatus(orderId, newStatus) {
    let orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const order = orders.find(o => o.id === orderId);
    
    if (order) {
        order.status = newStatus;
        localStorage.setItem('orders', JSON.stringify(orders));
        showAlert('Đã cập nhật trạng thái đơn hàng!', 'success');
        loadOrders();
    }
}

function viewOrderDetailAdmin(orderId) {
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const order = orders.find(o => o.id === orderId);
    
    if (!order) return;
    
    const modalContent = document.getElementById('adminOrderDetailContent');
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
                            <td>${item.name}</td>
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
                        <span>Giảm giá CK (3%):</span>
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

// ========== QUẢN LÝ SẢN PHẨM - CRUD ĐẦY ĐỦ ==========
function loadProductsAdmin() {
    const products = getAdminProducts();
    const container = document.getElementById('productsList');
    container.innerHTML = '';
    
    products.forEach(product => {
        const col = document.createElement('div');
        col.className = 'col-md-4';
        col.innerHTML = `
            <div class="card h-100 shadow-sm">
                <img src="${product.image}" class="card-img-top" style="height: 200px; object-fit: cover;" alt="${product.name}">
                <div class="card-body">
                    <span class="badge bg-secondary mb-2">${product.category}</span>
                    <h6 class="card-title">${product.name}</h6>
                    <p class="small text-muted">${product.description}</p>
                    <div class="mb-2">
                        ${product.salePrice ? 
                            `<span class="text-decoration-line-through small">${formatPrice(product.price)}</span>
                             <span class="text-danger fw-bold d-block">${formatPrice(product.salePrice)}</span>` 
                            : 
                            `<span class="text-primary fw-bold">${formatPrice(product.price)}</span>`
                        }
                    </div>
                    <div class="d-grid gap-2">
                        <button class="btn btn-sm btn-outline-primary" onclick="editProduct(${product.id})">
                            <i class="bi bi-pencil"></i> Sửa
                        </button>
                        <button class="btn btn-sm btn-outline-danger" onclick="deleteProduct(${product.id})">
                            <i class="bi bi-trash"></i> Xóa
                        </button>
                    </div>
                </div>
            </div>
        `;
        container.appendChild(col);
    });
}

function showProductForm(productId = null) {
    editingProductId = productId;
    const product = productId ? getAdminProducts().find(p => p.id === productId) : null;
    
    const formHtml = `
        <div class="modal fade" id="productFormModal" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header bg-primary text-white">
                        <h5 class="modal-title">${product ? 'Sửa sản phẩm' : 'Thêm sản phẩm mới'}</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <form id="productForm">
                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Tên sản phẩm *</label>
                                    <input type="text" class="form-control" id="productName" 
                                           value="${product?.name || ''}" required>
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Danh mục *</label>
                                    <select class="form-select" id="productCategory" required>
                                        <option value="Ốp lát" ${product?.category === 'Ốp lát' ? 'selected' : ''}>Ốp lát</option>
                                        <option value="Xây trát" ${product?.category === 'Xây trát' ? 'selected' : ''}>Xây trát</option>
                                    </select>
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Giá gốc (VNĐ) *</label>
                                    <input type="number" class="form-control" id="productPrice" 
                                           value="${product?.price || ''}" required min="0">
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Giá khuyến mãi (VNĐ)</label>
                                    <input type="number" class="form-control" id="productSalePrice" 
                                           value="${product?.salePrice || ''}" min="0">
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Đơn vị *</label>
                                    <input type="text" class="form-control" id="productUnit" 
                                           value="${product?.unit || ''}" required>
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">URL Hình ảnh *</label>
                                    <input type="url" class="form-control" id="productImage" 
                                           value="${product?.image || ''}" required>
                                </div>
                                <div class="col-12 mb-3">
                                    <label class="form-label">Mô tả ngắn *</label>
                                    <textarea class="form-control" id="productDescription" rows="2" required>${product?.description || ''}</textarea>
                                </div>
                                <div class="col-12 mb-3">
                                    <label class="form-label">Công dụng *</label>
                                    <textarea class="form-control" id="productUsage" rows="2" required>${product?.usage || ''}</textarea>
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Tỉ lệ pha trộn *</label>
                                    <input type="text" class="form-control" id="productMixRatio" 
                                           value="${product?.mixRatio || ''}" required>
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Độ phủ *</label>
                                    <input type="text" class="form-control" id="productCoverage" 
                                           value="${product?.coverage || ''}" required>
                                </div>
                                <div class="col-12 mb-3">
                                    <label class="form-label">Đặc điểm (mỗi dòng 1 đặc điểm) *</label>
                                    <textarea class="form-control" id="productFeatures" rows="3" required>${product?.features?.join('\n') || ''}</textarea>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Hủy</button>
                        <button type="button" class="btn btn-primary" onclick="saveProduct()">
                            <i class="bi bi-check-circle"></i> ${product ? 'Cập nhật' : 'Thêm mới'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Remove old modal if exists
    const oldModal = document.getElementById('productFormModal');
    if (oldModal) oldModal.remove();
    
    document.body.insertAdjacentHTML('beforeend', formHtml);
    const modal = new bootstrap.Modal(document.getElementById('productFormModal'));
    modal.show();
}

function saveProduct() {
    const form = document.getElementById('productForm');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    let products = getAdminProducts();
    const featuresText = document.getElementById('productFeatures').value;
    const features = featuresText.split('\n').filter(f => f.trim());
    
    const productData = {
        id: editingProductId || Date.now(),
        name: document.getElementById('productName').value,
        category: document.getElementById('productCategory').value,
        price: parseInt(document.getElementById('productPrice').value),
        salePrice: document.getElementById('productSalePrice').value ? 
                   parseInt(document.getElementById('productSalePrice').value) : null,
        unit: document.getElementById('productUnit').value,
        image: document.getElementById('productImage').value,
        description: document.getElementById('productDescription').value,
        usage: document.getElementById('productUsage').value,
        mixRatio: document.getElementById('productMixRatio').value,
        coverage: document.getElementById('productCoverage').value,
        features: features
    };
    
    if (editingProductId) {
        const index = products.findIndex(p => p.id === editingProductId);
        products[index] = productData;
        showAlert('Đã cập nhật sản phẩm!', 'success');
    } else {
        products.push(productData);
        showAlert('Đã thêm sản phẩm mới!', 'success');
    }
    
    saveAdminProducts(products);
    bootstrap.Modal.getInstance(document.getElementById('productFormModal')).hide();
    loadProductsAdmin();
}

function editProduct(productId) {
    showProductForm(productId);
}

function deleteProduct(productId) {
    if (!confirm('Bạn có chắc muốn xóa sản phẩm này?')) return;
    
    let products = getAdminProducts();
    products = products.filter(p => p.id !== productId);
    saveAdminProducts(products);
    showAlert('Đã xóa sản phẩm!', 'success');
    loadProductsAdmin();
}

// ========== QUẢN LÝ BÀI VIẾT - CRUD ĐẦY ĐỦ ==========
function loadNewsAdmin() {
    const news = getAdminNews();
    const container = document.getElementById('newsList');
    container.innerHTML = '';
    
    news.forEach(article => {
        const col = document.createElement('div');
        col.className = 'col-md-4';
        col.innerHTML = `
            <div class="card h-100 shadow-sm">
                <img src="${article.thumbnail}" class="card-img-top" style="height: 150px; object-fit: cover;">
                <div class="card-body">
                    <h6 class="card-title">${article.title}</h6>
                    <p class="card-text small text-muted">${article.summary}</p>
                    <small class="text-muted">${formatDate(article.createdAt)}</small>
                    <div class="d-grid gap-2 mt-3">
                        <button class="btn btn-sm btn-outline-primary" onclick="editNews(${article.id})">
                            <i class="bi bi-pencil"></i> Sửa
                        </button>
                        <button class="btn btn-sm btn-outline-danger" onclick="deleteNews(${article.id})">
                            <i class="bi bi-trash"></i> Xóa
                        </button>
                    </div>
                </div>
            </div>
        `;
        container.appendChild(col);
    });
}

function showNewsForm(newsId = null) {
    editingNewsId = newsId;
    const article = newsId ? getAdminNews().find(n => n.id === newsId) : null;
    
    const formHtml = `
        <div class="modal fade" id="newsFormModal" tabindex="-1">
            <div class="modal-dialog modal-xl">
                <div class="modal-content">
                    <div class="modal-header bg-primary text-white">
                        <h5 class="modal-title">${article ? 'Sửa bài viết' : 'Thêm bài viết mới'}</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <form id="newsForm">
                            <div class="row">
                                <div class="col-md-8 mb-3">
                                    <label class="form-label">Tiêu đề *</label>
                                    <input type="text" class="form-control" id="newsTitle" 
                                           value="${article?.title || ''}" required>
                                </div>
                                <div class="col-md-4 mb-3">
                                    <label class="form-label">Tác giả *</label>
                                    <input type="text" class="form-control" id="newsAuthor" 
                                           value="${article?.author || 'VINTEK Team'}" required>
                                </div>
                                <div class="col-12 mb-3">
                                    <label class="form-label">Tóm tắt *</label>
                                    <textarea class="form-control" id="newsSummary" rows="2" required>${article?.summary || ''}</textarea>
                                </div>
                                <div class="col-12 mb-3">
                                    <label class="form-label">URL Hình thumbnail *</label>
                                    <input type="url" class="form-control" id="newsThumbnail" 
                                           value="${article?.thumbnail || ''}" required>
                                </div>
                                <div class="col-12 mb-3">
                                    <label class="form-label">Nội dung (HTML) *</label>
                                    <textarea class="form-control" id="newsContent" rows="8" required>${article?.content || ''}</textarea>
                                    <small class="text-muted">Hỗ trợ HTML: &lt;h4&gt;, &lt;p&gt;, &lt;ul&gt;, &lt;li&gt;, &lt;strong&gt;</small>
                                </div>
                                <div class="col-12 mb-3">
                                    <label class="form-label">ID Sản phẩm liên quan (cách nhau bởi dấu phẩy)</label>
                                    <input type="text" class="form-control" id="newsRelatedProducts" 
                                           value="${article?.relatedProducts?.join(',') || ''}" 
                                           placeholder="VD: 1,2,3">
                                </div>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Hủy</button>
                        <button type="button" class="btn btn-primary" onclick="saveNews()">
                            <i class="bi bi-check-circle"></i> ${article ? 'Cập nhật' : 'Thêm mới'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    const oldModal = document.getElementById('newsFormModal');
    if (oldModal) oldModal.remove();
    
    document.body.insertAdjacentHTML('beforeend', formHtml);
    const modal = new bootstrap.Modal(document.getElementById('newsFormModal'));
    modal.show();
}

function saveNews() {
    const form = document.getElementById('newsForm');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    let allNews = getAdminNews();
    const relatedProductsText = document.getElementById('newsRelatedProducts').value;
    const relatedProducts = relatedProductsText ? 
        relatedProductsText.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id)) : [];
    
    const newsData = {
        id: editingNewsId || Date.now(),
        title: document.getElementById('newsTitle').value,
        summary: document.getElementById('newsSummary').value,
        thumbnail: document.getElementById('newsThumbnail').value,
        content: document.getElementById('newsContent').value,
        author: document.getElementById('newsAuthor').value,
        createdAt: editingNewsId ? 
            allNews.find(n => n.id === editingNewsId).createdAt : 
            new Date().toISOString(),
        relatedProducts: relatedProducts
    };
    
    if (editingNewsId) {
        const index = allNews.findIndex(n => n.id === editingNewsId);
        allNews[index] = newsData;
        showAlert('Đã cập nhật bài viết!', 'success');
    } else {
        allNews.unshift(newsData);
        showAlert('Đã thêm bài viết mới!', 'success');
    }
    
    saveAdminNews(allNews);
    bootstrap.Modal.getInstance(document.getElementById('newsFormModal')).hide();
    loadNewsAdmin();
}

function editNews(newsId) {
    showNewsForm(newsId);
}

function deleteNews(newsId) {
    if (!confirm('Bạn có chắc muốn xóa bài viết này?')) return;
    
    let allNews = getAdminNews();
    allNews = allNews.filter(n => n.id !== newsId);
    saveAdminNews(allNews);
    showAlert('Đã xóa bài viết!', 'success');
    loadNewsAdmin();
}

// ========== QUẢN LÝ VOUCHER - CRUD ĐẦY ĐỦ ==========
function loadVouchers() {
    const vouchers = getAdminVouchers();
    const container = document.getElementById('vouchersList');
    container.innerHTML = '';
    
    if (vouchers.length === 0) {
        container.innerHTML = '<p class="text-muted">Chưa có mã giảm giá nào</p>';
        return;
    }
    
    vouchers.forEach(voucher => {
        const div = document.createElement('div');
        div.className = 'card mb-3';
        const isExpired = voucher.expiryDate && new Date(voucher.expiryDate) < new Date();
        const isLimitReached = voucher.usageLimit && voucher.usedCount >= voucher.usageLimit;
        
        div.innerHTML = `
            <div class="card-body ${isExpired || isLimitReached ? 'bg-light' : ''}">
                <div class="row align-items-center">
                    <div class="col-md-2">
                        <h5 class="mb-0">
                            <span class="badge ${isExpired || isLimitReached ? 'bg-secondary' : 'bg-primary'}">${voucher.code}</span>
                        </h5>
                        ${voucher.phoneNumber ? `<small class="text-muted">Cho: ${voucher.phoneNumber}</small>` : ''}
                    </div>
                    <div class="col-md-2">
                        <div class="small text-muted">Giảm giá</div>
                        <div class="fw-bold">${voucher.type === 'percent' ? voucher.value + '%' : formatPrice(voucher.value)}</div>
                    </div>
                    <div class="col-md-2">
                        <div class="small text-muted">Hết hạn</div>
                        <div class="${isExpired ? 'text-danger' : ''}">${voucher.expiryDate ? new Date(voucher.expiryDate).toLocaleDateString('vi-VN') : 'Không giới hạn'}</div>
                    </div>
                    <div class="col-md-2">
                        <div class="small text-muted">Đã dùng</div>
                        <div class="fw-bold ${isLimitReached ? 'text-danger' : 'text-success'}">
                            ${voucher.usedCount || 0}${voucher.usageLimit ? '/' + voucher.usageLimit : ''}
                        </div>
                    </div>
                    <div class="col-md-2">
                        ${isExpired ? '<span class="badge bg-danger">Hết hạn</span>' : ''}
                        ${isLimitReached ? '<span class="badge bg-warning">Hết lượt</span>' : ''}
                        ${!isExpired && !isLimitReached ? '<span class="badge bg-success">Hoạt động</span>' : ''}
                    </div>
                    <div class="col-md-2 text-end">
                        <button class="btn btn-sm btn-outline-primary me-1" onclick="editVoucher(${voucher.id})">
                            <i class="bi bi-pencil"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger" onclick="deleteVoucher(${voucher.id})">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
        container.appendChild(div);
    });
}

function showVoucherForm(voucherId = null) {
    editingVoucherId = voucherId;
    const voucher = voucherId ? getAdminVouchers().find(v => v.id === voucherId) : null;
    
    const formHtml = `
        <div class="modal fade" id="voucherFormModal" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header bg-primary text-white">
                        <h5 class="modal-title">${voucher ? 'Sửa voucher' : 'Tạo voucher mới'}</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <form id="voucherForm">
                            <div class="mb-3">
                                <label class="form-label">Mã voucher *</label>
                                <input type="text" class="form-control" id="voucherCode" 
                                       value="${voucher?.code || ''}" required 
                                       placeholder="VD: VINTEK2024">
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Loại giảm giá *</label>
                                <select class="form-select" id="voucherType" required>
                                    <option value="percent" ${voucher?.type === 'percent' ? 'selected' : ''}>Phần trăm (%)</option>
                                    <option value="fixed" ${voucher?.type === 'fixed' ? 'selected' : ''}>Số tiền cố định (VNĐ)</option>
                                </select>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Giá trị *</label>
                                <input type="number" class="form-control" id="voucherValue" 
                                       value="${voucher?.value || ''}" required min="0">
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Ngày hết hạn</label>
                                <input type="date" class="form-control" id="voucherExpiry" 
                                       value="${voucher?.expiryDate || ''}">
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Giới hạn số lần sử dụng</label>
                                <input type="number" class="form-control" id="voucherLimit" 
                                       value="${voucher?.usageLimit || ''}" min="0" 
                                       placeholder="Để trống nếu không giới hạn">
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Số điện thoại (để trống nếu áp dụng cho tất cả)</label>
                                <input type="text" class="form-control" id="voucherPhone" 
                                       value="${voucher?.phoneNumber || ''}" 
                                       placeholder="VD: 0123456789">
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Hủy</button>
                        <button type="button" class="btn btn-primary" onclick="saveVoucher()">
                            <i class="bi bi-check-circle"></i> ${voucher ? 'Cập nhật' : 'Tạo mới'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    const oldModal = document.getElementById('voucherFormModal');
    if (oldModal) oldModal.remove();
    
    document.body.insertAdjacentHTML('beforeend', formHtml);
    const modal = new bootstrap.Modal(document.getElementById('voucherFormModal'));
    modal.show();
}

function saveVoucher() {
    const form = document.getElementById('voucherForm');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    let vouchers = getAdminVouchers();
    
    const voucherData = {
        id: editingVoucherId || Date.now(),
        code: document.getElementById('voucherCode').value.toUpperCase(),
        type: document.getElementById('voucherType').value,
        value: parseInt(document.getElementById('voucherValue').value),
        expiryDate: document.getElementById('voucherExpiry').value || null,
        usageLimit: document.getElementById('voucherLimit').value ? 
                    parseInt(document.getElementById('voucherLimit').value) : null,
        phoneNumber: document.getElementById('voucherPhone').value || null,
        usedCount: editingVoucherId ? 
            vouchers.find(v => v.id === editingVoucherId).usedCount : 0
    };
    
    if (editingVoucherId) {
        const index = vouchers.findIndex(v => v.id === editingVoucherId);
        vouchers[index] = voucherData;
        showAlert('Đã cập nhật voucher!', 'success');
    } else {
        vouchers.push(voucherData);
        showAlert('Đã tạo voucher mới!', 'success');
    }
    
    saveAdminVouchers(vouchers);
    bootstrap.Modal.getInstance(document.getElementById('voucherFormModal')).hide();
    loadVouchers();
}

function editVoucher(voucherId) {
    showVoucherForm(voucherId);
}

function deleteVoucher(voucherId) {
    if (!confirm('Bạn có chắc muốn xóa voucher này?')) return;
    
    let vouchers = getAdminVouchers();
    vouchers = vouchers.filter(v => v.id !== voucherId);
    saveAdminVouchers(vouchers);
    showAlert('Đã xóa voucher!', 'success');
    loadVouchers();
}

// ========== QUẢN LÝ KHÁCH HÀNG ==========
function loadCustomers() {
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const customersMap = new Map();
    
    orders.forEach(order => {
        const phone = order.phoneNumber;
        if (!customersMap.has(phone)) {
            customersMap.set(phone, {
                phoneNumber: phone,
                fullName: order.fullName,
                totalOrders: 0,
                totalProducts: 0,
                totalSpent: 0
            });
        }
        
        const customer = customersMap.get(phone);
        customer.totalOrders++;
        customer.totalProducts += order.items.reduce((sum, item) => sum + item.quantity, 0);
        customer.totalSpent += order.total;
    });
    
    const tbody = document.getElementById('customersTableBody');
    tbody.innerHTML = '';
    
    if (customersMap.size === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="text-center text-muted">Chưa có khách hàng nào</td></tr>';
        return;
    }
    
    customersMap.forEach(customer => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><strong>${customer.phoneNumber}</strong></td>
            <td>${customer.fullName}</td>
            <td><span class="badge bg-primary">${customer.totalOrders}</span></td>
            <td><span class="badge bg-info">${customer.totalProducts}</span></td>
            <td class="fw-bold text-success">${formatPrice(customer.totalSpent)}</td>
        `;
        tbody.appendChild(tr);
    });
}

// ========== CÀI ĐẶT ==========
function loadSettings() {
    console.log('Loading settings...');
    const settingsStr = localStorage.getItem('adminSettings');
    console.log('Settings from localStorage:', settingsStr);
    
    const settings = settingsStr ? JSON.parse(settingsStr) : {};
    
    // Load các giá trị hoặc dùng default
    const bankDiscount = settings.bankDiscountPercent || 3;
    const shipping = settings.shippingFee || 30000;
    const freeShip = settings.freeShipThreshold || 10;
    const bank = settings.bankName || 'MB Bank';
    const account = settings.bankAccount || '0123456789';
    const accountName = settings.bankAccountName || 'CONG TY VINTEK';
    
    console.log('Loaded values:', {bankDiscount, shipping, freeShip, bank, account, accountName});
    
    // Set giá trị vào input
    const bankDiscountEl = document.getElementById('bankDiscountPercent');
    const shippingEl = document.getElementById('shippingFee');
    const freeShipEl = document.getElementById('freeShipThreshold');
    const bankNameEl = document.getElementById('bankName');
    const bankAccountEl = document.getElementById('bankAccount');
    const bankAccountNameEl = document.getElementById('bankAccountName');
    
    if (bankDiscountEl) bankDiscountEl.value = bankDiscount;
    if (shippingEl) shippingEl.value = shipping;
    if (freeShipEl) freeShipEl.value = freeShip;
    if (bankNameEl) bankNameEl.value = bank;
    if (bankAccountEl) bankAccountEl.value = account;
    if (bankAccountNameEl) bankAccountNameEl.value = accountName;
    
    console.log('Settings loaded successfully');
}

function saveSettings() {
    console.log('Saving settings...');
    
    // Lấy giá trị từ input
    const bankDiscountPercent = document.getElementById('bankDiscountPercent').value;
    const shippingFee = document.getElementById('shippingFee').value;
    const freeShipThreshold = document.getElementById('freeShipThreshold').value;
    const bankName = document.getElementById('bankName').value;
    const bankAccount = document.getElementById('bankAccount').value;
    const bankAccountName = document.getElementById('bankAccountName').value;
    
    console.log('Values to save:', {
        bankDiscountPercent,
        shippingFee,
        freeShipThreshold,
        bankName,
        bankAccount,
        bankAccountName
    });
    
    const settings = {
        bankDiscountPercent: parseFloat(bankDiscountPercent),
        shippingFee: parseInt(shippingFee),
        freeShipThreshold: parseInt(freeShipThreshold),
        bankName: bankName,
        bankAccount: bankAccount,
        bankAccountName: bankAccountName,
        updatedAt: new Date().toISOString()
    };
    
    // Lưu vào localStorage
    localStorage.setItem('adminSettings', JSON.stringify(settings));
    console.log('Saved to localStorage:', localStorage.getItem('adminSettings'));
    
    showAlert('✓ Đã lưu cài đặt thành công!', 'success');
    
    // Reload để xem kết quả
    setTimeout(() => {
        loadSettings();
    }, 500);
}

function resetSettings() {
    if (!confirm('Bạn có chắc muốn khôi phục cài đặt mặc định?')) return;
    
    console.log('Resetting settings...');
    
    // Xóa settings
    localStorage.removeItem('adminSettings');
    
    // Load lại với giá trị mặc định
    loadSettings();
    
    showAlert('✓ Đã khôi phục cài đặt mặc định!', 'info');
}

// ========== HELPER FUNCTIONS ==========
function getAdminProducts() {
    const saved = localStorage.getItem('adminProducts');
    if (saved) return JSON.parse(saved);
    
    // Default products
    const defaultProducts = [
        {id: 1, name: "Keo dán gạch VINTEK Premium", category: "Ốp lát", price: 180000, salePrice: 150000, unit: "Bao 25kg", image: "https://images.unsplash.com/photo-1581094271901-8022df4466f9?w=500", description: "Keo dán gạch cao cấp, độ bám dính vượt trội", usage: "Dùng để dán gạch men, gạch granite, gạch đá cao cấp cho tường và sàn", mixRatio: "1 bao keo + 6-7 lít nước", coverage: "Phủ được 4-5m² (gạch 30x30cm)", features: ["Độ bám dính cao", "Chống thấm tốt", "Dễ thi công", "Tiết kiệm vật liệu"]},
        {id: 2, name: "Keo dán gạch VINTEK Standard", category: "Ốp lát", price: 120000, salePrice: null, unit: "Bao 25kg", image: "https://images.unsplash.com/photo-1600585152915-d208bec867a1?w=500", description: "Keo dán gạch tiêu chuẩn", usage: "Dùng để dán gạch thông thường cho tường và sàn", mixRatio: "1 bao keo + 6-7 lít nước", coverage: "Phủ được 4-5m² (gạch 30x30cm)", features: ["Giá cả phải chăng", "Chất lượng ổn định", "Dễ sử dụng", "Phù hợp công trình dân dụng"]},
        {id: 3, name: "Keo dán gạch VINTEK Super Bond", category: "Ốp lát", price: 220000, salePrice: 190000, unit: "Bao 25kg", image: "https://images.unsplash.com/photo-1607400201889-565b1ee75f8e?w=500", description: "Keo siêu dính", usage: "Dùng để dán gạch lớn 60x60cm, 80x80cm", mixRatio: "1 bao keo + 5-6 lít nước", coverage: "Phủ được 3-4m² (gạch 60x60cm)", features: ["Độ dính cực cao", "Chịu lực tốt", "Chống sag", "Thời gian đóng rắn nhanh"]},
        {id: 4, name: "Vữa trát tường VINTEK Smooth", category: "Xây trát", price: 95000, salePrice: 85000, unit: "Bao 40kg", image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=500", description: "Vữa trát mịn", usage: "Dùng để trát tường, trát trần", mixRatio: "1 bao vữa + 8-10 lít nước", coverage: "Phủ được 15-20m² (độ dày 1cm)", features: ["Bề mặt mịn màng", "Dễ thi công", "Khô nhanh", "Độ bền cao"]},
        {id: 5, name: "Vữa xây gạch VINTEK Block", category: "Xây trát", price: 75000, salePrice: null, unit: "Bao 40kg", image: "https://images.unsplash.com/photo-1628624747186-a8c5cb2a3f0e?w=500", description: "Vữa xây chất lượng", usage: "Dùng để xây gạch block", mixRatio: "1 bao vữa + 9-11 lít nước", coverage: "Xây được 50-60 viên gạch block", features: ["Độ bám dính tốt", "Khối lượng nhẹ", "Dễ thi công", "Tiết kiệm xi măng"]},
        {id: 6, name: "Vữa chống thấm VINTEK Shield", category: "Xây trát", price: 350000, salePrice: 320000, unit: "Bao 25kg", image: "https://images.unsplash.com/photo-1590932815317-7fd1e388ba77?w=500", description: "Chống thấm tuyệt đối", usage: "Dùng để chống thấm sàn, tường, bể nước", mixRatio: "1 bao + 5-6 lít nước", coverage: "Phủ được 8-10m² (2 lớp)", features: ["Chống thấm tuyệt đối", "Độ bền cao", "An toàn cho sức khỏe", "Thân thiện môi trường"]}
    ];
    
    localStorage.setItem('adminProducts', JSON.stringify(defaultProducts));
    return defaultProducts;
}

function saveAdminProducts(products) {
    localStorage.setItem('adminProducts', JSON.stringify(products));
}

function getAdminNews() {
    const saved = localStorage.getItem('adminNews');
    if (saved) return JSON.parse(saved);
    
    // Default news from news.js
    const defaultNews = [
        {id: 1, title: "5 Bí Quyết Chọn Keo Dán Gạch Chất Lượng Cao", summary: "Hướng dẫn chi tiết cách lựa chọn keo dán gạch phù hợp", thumbnail: "https://images.unsplash.com/photo-1581094271901-8022df4466f9?w=800", content: "<h4>1. Xác định loại gạch cần dán</h4><p>Trước tiên, bạn cần xác định loại gạch sẽ sử dụng.</p>", author: "VINTEK Team", createdAt: "2024-11-01T10:00:00Z", relatedProducts: [1, 2, 3]},
        {id: 2, title: "Hướng Dẫn Thi Công Trát Tường Đạt Chuẩn", summary: "Quy trình thi công trát tường chuyên nghiệp", thumbnail: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800", content: "<h4>Chuẩn bị bề mặt</h4><p>Bề mặt tường cần được làm sạch.</p>", author: "Kỹ sư Nguyễn Văn A", createdAt: "2024-10-28T14:30:00Z", relatedProducts: [4, 5]}
    ];
    
    localStorage.setItem('adminNews', JSON.stringify(defaultNews));
    return defaultNews;
}

function saveAdminNews(news) {
    localStorage.setItem('adminNews', JSON.stringify(news));
}

function getAdminVouchers() {
    const saved = localStorage.getItem('adminVouchers');
    return saved ? JSON.parse(saved) : [];
}

function saveAdminVouchers(vouchers) {
    localStorage.setItem('adminVouchers', JSON.stringify(vouchers));
}

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

function formatPrice(price) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(price);
}

function showAlert(message, type = 'info') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed top-0 start-50 translate-middle-x mt-3`;
    alertDiv.style.zIndex = '9999';
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(alertDiv);
    
    setTimeout(() => {
        alertDiv.remove();
    }, 3000);
}

// Export functions
window.showTab = showTab;
window.adminLogout = adminLogout;
window.updateOrderStatus = updateOrderStatus;
window.viewOrderDetailAdmin = viewOrderDetailAdmin;
window.showProductForm = showProductForm;
window.saveProduct = saveProduct;
window.editProduct = editProduct;
window.deleteProduct = deleteProduct;
window.showNewsForm = showNewsForm;
window.saveNews = saveNews;
window.editNews = editNews;
window.deleteNews = deleteNews;
window.showVoucherForm = showVoucherForm;
window.saveVoucher = saveVoucher;
window.editVoucher = editVoucher;
window.deleteVoucher = deleteVoucher;
window.saveSettings = saveSettings;
window.resetSettings = resetSettings;