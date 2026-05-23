import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import AdminLayout, { adminSearchEvent } from '@/layout/admin-layout';
import SEO from '@/components/seo';
import { useGetAllProductsQuery } from '@/redux/features/productApi';
import { useDeleteReviewMutation, useReplyReviewMutation } from '@/redux/features/reviewApi';
import Loader from '@/components/loader/loader';
import { Trash2, MessageSquare, X, Send, Eye } from 'lucide-react';
import { notifySuccess, notifyError } from '@/utils/toast';
import dayjs from 'dayjs';
import { Rating } from 'react-simple-star-rating';

const AdminReviews = () => {
  const { data: productsData, isLoading, isError, refetch } = useGetAllProductsQuery({ limit: 1000 }, { refetchOnMountOrArgChange: true });
  const [deleteReview] = useDeleteReviewMutation();
  const [replyReview] = useReplyReviewMutation();
  const [searchTerm, setSearchTerm] = useState('');
  const [localReviews, setLocalReviews] = useState([]);

  // Modal State
  const [selectedReview, setSelectedReview] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);

  useEffect(() => {
    const handler = (e) => setSearchTerm(e.detail);
    if (adminSearchEvent) {
      adminSearchEvent.addEventListener('search', handler);
      return () => adminSearchEvent.removeEventListener('search', handler);
    }
  }, []);

  // Aggregate reviews from products into local state
  useEffect(() => {
    if (productsData?.data) {
      const allReviews = [];
      productsData.data.forEach(product => {
        if (product.reviews && product.reviews.length > 0) {
          product.reviews.forEach(review => {
            allReviews.push({
              ...review,
              productObj: product
            });
          });
        }
      });
      // Sort by newest
      setLocalReviews(allReviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    }
  }, [productsData]);

  const filteredReviews = localReviews.filter(r => 
    r.comment?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (r.userId?.name || r.name)?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (r.productObj?.title || r.productObj?.name)?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa đánh giá này không?")) {
      try {
        await deleteReview(id).unwrap();
        setLocalReviews(prev => prev.filter(r => r._id !== id));
        notifySuccess("Đã xóa đánh giá!");
        refetch();
      } catch (err) {
        notifyError("Lỗi khi xóa đánh giá. Vui lòng kiểm tra lại API.");
      }
    }
  };

  const handleSendReply = async () => {
    if (!replyText.trim()) {
      notifyError("Vui lòng nhập nội dung phản hồi!");
      return;
    }
    
    setIsSubmittingReply(true);
    try {
      await replyReview({ id: selectedReview._id, reply: replyText }).unwrap();
      
      // Update local state
      setLocalReviews(prev => prev.map(r => {
        if (r._id === selectedReview._id) {
          return { ...r, reply: replyText };
        }
        return r;
      }));
      
      notifySuccess("Đã gửi phản hồi thành công!");
      setSelectedReview(null);
      refetch();
    } catch (err) {
      notifyError("Không thể gửi phản hồi. Vui lòng kiểm tra lại API.");
    } finally {
      setIsSubmittingReply(false);
    }
  };

  return (
    <AdminLayout title="Quản lý Đánh giá">
      <SEO pageTitle="Quản lý Đánh giá" />
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}} />

      <div className="admin-content-card glass-panel" style={{ padding: 0, overflow: 'hidden', marginTop: '1.5rem' }}>
        {isLoading ? (
          <div className="d-flex justify-content-center p-5"><Loader loading={isLoading} /></div>
        ) : isError ? (
          <div className="text-danger p-5 text-center">Lỗi tải dữ liệu. Hoặc API chưa được hỗ trợ.</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Khách hàng</th>
                <th>Sản phẩm</th>
                <th>Đánh giá</th>
                <th>Nội dung</th>
                <th>Ngày tạo</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredReviews.map((review) => (
                <tr key={review._id}>
                  <td style={{ fontWeight: 500 }}>
                    {review.userId?.name || review.name || 'Khách hàng'}
                    <br />
                    <span style={{ fontSize: '0.8rem', color: 'var(--admin-text-sub)', fontWeight: 'normal' }}>
                      {review.userId?.email || review.email}
                    </span>
                  </td>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      {review.productObj?.img && (
                        <img 
                          src={review.productObj.img} 
                          alt="product" 
                          style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #e2e8f0' }} 
                        />
                      )}
                      <span 
                        style={{ fontWeight: 500, display: 'inline-block', maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} 
                        title={review.productObj?.title || review.productObj?.name}
                      >
                        {review.productObj?.title || review.productObj?.name || 'Sản phẩm'}
                      </span>
                    </div>
                  </td>
                  <td>
                    <Rating readonly size={16} initialValue={review.rating || 0} />
                  </td>
                  <td style={{ maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {review.comment}
                  </td>
                  <td style={{ color: 'var(--admin-text-sub)', fontSize: '0.9rem' }}>
                    {dayjs(review.createdAt || review.date).format('DD/MM/YYYY')}
                  </td>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <Link 
                        href={`/product-details/${review.productObj?._id}`} 
                        target="_blank"
                        className="admin-btn d-inline-flex align-items-center justify-content-center" 
                        style={{ padding: '0.4rem', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', border: 'none', borderRadius: '4px', textDecoration: 'none' }} 
                        title="Xem trên Cửa hàng"
                      >
                        <Eye size={16} />
                      </Link>
                      <button 
                        onClick={() => {
                          setSelectedReview(review);
                          setReplyText(review.reply || '');
                        }} 
                        className="admin-btn" 
                        style={{ padding: '0.4rem', background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', border: 'none', borderRadius: '4px' }} 
                        title="Xem & Phản hồi"
                      >
                        <MessageSquare size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(review._id)} 
                        className="admin-btn" 
                        style={{ padding: '0.4rem', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--admin-danger)', border: 'none', borderRadius: '4px' }} 
                        title="Xóa"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredReviews.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center p-4 text-muted">Không tìm thấy đánh giá nào.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Details & Reply Modal */}
      {selectedReview && (
        <div 
          className="admin-modal-overlay d-flex align-items-center justify-content-center" 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(8px)',
            zIndex: 9999,
            padding: '1rem',
            animation: 'fadeIn 0.2s ease-out'
          }}
          onClick={() => setSelectedReview(null)}
        >
          <div 
            className="admin-modal-card bg-white rounded-3 shadow-lg" 
            style={{
              width: '100%',
              maxWidth: '600px',
              maxHeight: '90vh',
              overflowY: 'auto',
              border: '1px solid rgba(226, 232, 240, 0.8)',
              animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
              display: 'flex',
              flexDirection: 'column'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="d-flex align-items-center justify-content-between p-4 border-bottom" style={{ backgroundColor: '#f8fafc' }}>
              <h5 className="mb-0 font-weight-bold" style={{ color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MessageSquare size={20} className="text-primary" />
                Chi tiết & Phản hồi Đánh giá
              </h5>
              <button 
                onClick={() => setSelectedReview(null)} 
                style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: '0.2rem' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Content Body */}
            <div className="p-4" style={{ overflowY: 'auto', flex: 1 }}>
              {/* Product Info */}
              <div className="mb-4 p-3 rounded animate-fade" style={{ backgroundColor: '#f1f5f9', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                {selectedReview.productObj?.img && (
                  <img 
                    src={selectedReview.productObj.img} 
                    alt="product" 
                    style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #e2e8f0' }} 
                  />
                )}
                <div>
                  <span className="text-muted d-block" style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Sản phẩm</span>
                  <h6 className="mb-0 font-weight-bold" style={{ color: '#1e293b' }}>
                    {selectedReview.productObj?.title || selectedReview.productObj?.name}
                  </h6>
                </div>
              </div>

              {/* Customer Info */}
              <div className="row mb-4">
                <div className="col-sm-6 mb-3 mb-sm-0">
                  <span className="text-muted d-block mb-1" style={{ fontSize: '0.8rem' }}>Khách hàng</span>
                  <strong style={{ color: '#1e293b' }}>{selectedReview.userId?.name || selectedReview.name || 'Khách hàng'}</strong>
                  <span className="d-block text-muted" style={{ fontSize: '0.85rem' }}>
                    {selectedReview.userId?.email || selectedReview.email || 'Chưa cung cấp email'}
                  </span>
                </div>
                <div className="col-sm-6">
                  <span className="text-muted d-block mb-1" style={{ fontSize: '0.8rem' }}>Ngày gửi</span>
                  <strong style={{ color: '#1e293b' }}>
                    {dayjs(selectedReview.createdAt || selectedReview.date).format('DD/MM/YYYY HH:mm')}
                  </strong>
                </div>
              </div>

              {/* Rating and Comment */}
              <div className="mb-4 pb-4 border-bottom">
                <span className="text-muted d-block mb-1" style={{ fontSize: '0.8rem' }}>Điểm đánh giá & Nội dung</span>
                <div className="mb-2">
                  <Rating readonly size={18} initialValue={selectedReview.rating || 0} />
                </div>
                <div className="p-3 rounded border" style={{ backgroundColor: '#fafafa', fontStyle: 'italic', color: '#475569', fontSize: '0.95rem' }}>
                  "{selectedReview.comment}"
                </div>
              </div>

              {/* Reply Section */}
              <div>
                <h6 className="font-weight-bold mb-3" style={{ color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  Phản hồi từ Cửa hàng
                </h6>
                <textarea
                  className="form-control mb-3"
                  rows="4"
                  placeholder="Nhập nội dung phản hồi của cửa hàng..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  style={{
                    borderRadius: '8px',
                    borderColor: '#cbd5e1',
                    fontSize: '0.95rem',
                    padding: '0.75rem',
                    resize: 'none'
                  }}
                  disabled={isSubmittingReply}
                />
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-top d-flex gap-2 justify-content-end" style={{ backgroundColor: '#f8fafc' }}>
              <button 
                onClick={() => setSelectedReview(null)} 
                className="btn btn-outline-secondary" 
                style={{ borderRadius: '6px', padding: '0.5rem 1.25rem', fontSize: '0.9rem' }}
                disabled={isSubmittingReply}
              >
                Hủy bỏ
              </button>
              <button 
                onClick={handleSendReply} 
                className="btn btn-primary d-flex align-items-center gap-2" 
                style={{ borderRadius: '6px', padding: '0.5rem 1.5rem', fontSize: '0.9rem', backgroundColor: 'var(--tp-theme-primary)', borderColor: 'var(--tp-theme-primary)' }}
                disabled={isSubmittingReply}
              >
                {isSubmittingReply ? (
                  <>Đang gửi...</>
                ) : (
                  <>
                    <Send size={16} />
                    Gửi phản hồi
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminReviews;
