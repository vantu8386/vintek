// news.js - JavaScript cho trang tin tức

document.addEventListener('DOMContentLoaded', function() {
    checkAuthentication();
    loadNews();
    updateCartCount();
});

// Load danh sách tin tức
function loadNews() {
    const news = getNews();
    const container = document.getElementById('newsList');
    container.innerHTML = '';
    
    news.forEach(article => {
        const col = document.createElement('div');
        col.className = 'col-md-6 col-lg-4';
        col.innerHTML = `
            <div class="card news-card h-100 shadow-sm">
                <img src="${article.thumbnail}" class="news-thumbnail" alt="${article.title}">
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title fw-bold">${article.title}</h5>
                    <p class="card-text text-muted flex-grow-1">${article.summary}</p>
                    <div class="d-flex justify-content-between align-items-center text-muted small mb-3">
                        <span><i class="bi bi-person"></i> ${article.author}</span>
                        <span><i class="bi bi-calendar"></i> ${formatDate(article.createdAt)}</span>
                    </div>
                    <a href="news-detail.html?id=${article.id}" class="btn btn-outline-primary">
                        <i class="bi bi-book"></i> Đọc thêm
                    </a>
                </div>
            </div>
        `;
        container.appendChild(col);
    });
}

// Lấy dữ liệu tin tức
function getNews() {
    // Lấy từ admin nếu có
    const adminNews = localStorage.getItem('adminNews');
    if (adminNews) {
        return JSON.parse(adminNews);
    }
    
    // Dữ liệu tin tức mặc định
    return [
        {
            id: 1,
            title: "5 Bí Quyết Chọn Keo Dán Gạch Chất Lượng Cao",
            summary: "Hướng dẫn chi tiết cách lựa chọn keo dán gạch phù hợp cho từng loại công trình và loại gạch khác nhau.",
            thumbnail: "https://images.unsplash.com/photo-1581094271901-8022df4466f9?w=800",
            content: "<h4>1. Xác định loại gạch cần dán</h4><p>Trước tiên, bạn cần xác định loại gạch sẽ sử dụng: gạch men, gạch granite, gạch đá tự nhiên... Mỗi loại gạch sẽ cần một loại keo phù hợp với độ bám dính khác nhau.</p><h4>2. Xem xét vị trí thi công</h4><p>Keo dán gạch dùng cho tường và sàn có yêu cầu khác nhau. Đặc biệt, khu vực ẩm ướt như nhà vệ sinh, bể bơi cần keo có khả năng chống thấm tốt.</p><h4>3. Kiểm tra độ bám dính</h4><p>Độ bám dính là yếu tố quan trọng nhất. Keo chất lượng cao phải có độ bám dính từ 0.5 MPa trở lên theo tiêu chuẩn TCVN.</p><h4>4. Thời gian đóng rắn</h4><p>Tùy vào tiến độ công trình, bạn có thể chọn keo có thời gian đóng rắn nhanh hoặc chậm. Keo đóng rắn nhanh giúp tiết kiệm thời gian thi công.</p><h4>5. Thương hiệu uy tín</h4><p>Nên chọn keo từ các thương hiệu có uy tín như VINTEK để đảm bảo chất lượng và độ bền của công trình.</p>",
            author: "VINTEK Team",
            createdAt: "2024-11-01T10:00:00Z",
            relatedProducts: [1, 2, 3]
        },
        {
            id: 2,
            title: "Hướng Dẫn Thi Công Trát Tường Đạt Chuẩn",
            summary: "Quy trình thi công trát tường chuyên nghiệp, đảm bảo bề mặt phẳng, mịn và bền đẹp theo thời gian.",
            thumbnail: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800",
            content: "<h4>Chuẩn bị bề mặt</h4><p>Bề mặt tường cần được làm sạch, loại bỏ bụi bẩn, dầu mỡ. Nếu tường cũ bị bong tróc, cần gỡ bỏ lớp vữa cũ và sửa chữa các vết nứt.</p><h4>Pha trộn vữa</h4><p>Pha vữa trát VINTEK theo tỉ lệ 1 bao (40kg) + 8-10 lít nước sạch. Khuấy đều cho đến khi vữa đạt độ sệt vừa phải, không quá loãng hay quá đặc.</p><h4>Trát lớp lót</h4><p>Trát lớp lót dày khoảng 5-8mm, dùng bay trét để tạo bề mặt phẳng. Chờ lớp lót khô khoảng 4-6 giờ trước khi trát lớp phủ.</p><h4>Trát lớp phủ</h4><p>Trát lớp phủ mỏng khoảng 2-3mm, dùng bay trét để tạo bề mặt mịn. Sau khi khô, có thể chà nhám nhẹ để tạo độ phẳng hoàn hảo.</p><h4>Bảo dưỡng</h4><p>Phun nước ẩm nhẹ trong 3-5 ngày đầu để vữa đạt độ cứng tối đa. Tránh để tường bị khô quá nhanh.</p>",
            author: "Kỹ sư Nguyễn Văn A",
            createdAt: "2024-10-28T14:30:00Z",
            relatedProducts: [4, 5]
        },
        {
            id: 3,
            title: "Khuyến Mãi Tháng 11 - Giảm Giá Lên Đến 20%",
            summary: "Chương trình khuyến mãi hấp dẫn trong tháng 11 với nhiều ưu đãi đặc biệt cho khách hàng thân thiết.",
            thumbnail: "https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=800",
            content: "<h4>Ưu đãi đặc biệt tháng 11</h4><p>Nhân dịp tháng 11, VINTEK tri ân khách hàng với chương trình khuyến mãi lớn:</p><ul><li><strong>Giảm 20%</strong> cho đơn hàng từ 50 sản phẩm trở lên</li><li><strong>Giảm 15%</strong> cho đơn hàng từ 30 sản phẩm</li><li><strong>Giảm 10%</strong> cho đơn hàng từ 20 sản phẩm</li><li><strong>Miễn phí vận chuyển</strong> cho mọi đơn hàng</li></ul><h4>Sản phẩm khuyến mãi</h4><p>Tất cả các dòng sản phẩm keo dán gạch, vữa trát tường, vữa xây đều được áp dụng chương trình khuyến mãi.</p><h4>Thời gian áp dụng</h4><p>Từ ngày 01/11/2024 đến hết ngày 30/11/2024. Số lượng có hạn, nhanh tay đặt hàng!</p><p><strong>Lưu ý:</strong> Không áp dụng đồng thời với các chương trình khuyến mãi khác.</p>",
            author: "VINTEK Marketing",
            createdAt: "2024-11-05T09:00:00Z",
            relatedProducts: [1, 2, 3, 4, 5, 6]
        },
        {
            id: 4,
            title: "Công Nghệ Sản Xuất Vật Liệu Xây Dựng Hiện Đại",
            summary: "Tìm hiểu về công nghệ sản xuất tiên tiến được VINTEK áp dụng để tạo ra những sản phẩm chất lượng cao.",
            thumbnail: "https://images.unsplash.com/photo-1590932815317-7fd1e388ba77?w=800",
            content: "<h4>Công nghệ sản xuất tiên tiến</h4><p>VINTEK đầu tư dây chuyền sản xuất hiện đại từ Châu Âu, đảm bảo chất lượng sản phẩm đồng đều và ổn định.</p><h4>Nguyên liệu cao cấp</h4><p>Chúng tôi sử dụng xi măng Portland, cát thạch anh và các phụ gia nhập khẩu để tạo ra sản phẩm có độ bám dính vượt trội.</p><h4>Kiểm soát chất lượng nghiêm ngặt</h4><p>Mọi sản phẩm đều được kiểm tra chất lượng theo tiêu chuẩn TCVN và ISO 9001:2015 trước khi xuất xưởng.</p><h4>Thân thiện môi trường</h4><p>Quy trình sản xuất của VINTEK tuân thủ các tiêu chuẩn môi trường, không gây hại cho sức khỏe người sử dụng.</p>",
            author: "Phòng R&D VINTEK",
            createdAt: "2024-10-20T11:00:00Z",
            relatedProducts: [1, 3, 6]
        },
        {
            id: 5,
            title: "Mẹo Tiết Kiệm Chi Phí Khi Xây Dựng",
            summary: "Những mẹo hay giúp bạn tiết kiệm chi phí vật liệu xây dựng mà vẫn đảm bảo chất lượng công trình.",
            thumbnail: "https://images.unsplash.com/photo-1628624747186-a8c5cb2a3f0e?w=800",
            content: "<h4>1. Chọn vật liệu chất lượng</h4><p>Đầu tư vào vật liệu chất lượng cao ngay từ đầu sẽ giúp tiết kiệm chi phí sửa chữa về sau. Sản phẩm VINTEK có độ phủ cao hơn 30% so với sản phẩm thông thường.</p><h4>2. Tính toán chính xác</h4><p>Đo đạc và tính toán chính xác diện tích thi công để đặt hàng đúng số lượng, tránh lãng phí hoặc thiếu hụt.</p><h4>3. Mua số lượng lớn</h4><p>Đặt hàng số lượng lớn sẽ được giảm giá và miễn phí vận chuyển. VINTEK có chương trình ưu đãi hấp dẫn cho đơn hàng lớn.</p><h4>4. Thi công đúng kỹ thuật</h4><p>Tuân thủ hướng dẫn thi công để tránh sai sót và lãng phí vật liệu. VINTEK cung cấp hỗ trợ kỹ thuật miễn phí.</p><h4>5. Bảo quản đúng cách</h4><p>Bảo quản vật liệu ở nơi khô ráo, thoáng mát để tránh hư hỏng.</p>",
            author: "VINTEK Team",
            createdAt: "2024-10-15T16:00:00Z",
            relatedProducts: [1, 2, 4, 5]
        }
    ];
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

// Export functions
window.getNews = getNews;