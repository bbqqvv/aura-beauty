import React, { useState, useEffect } from 'react';
import AdminLayout, { adminSearchEvent } from '@/layout/admin-layout';
import SEO from '@/components/seo';
import { useGetAllProductsQuery } from '@/redux/features/productApi';
import { useDeleteReviewMutation } from '@/redux/features/reviewApi';
import Loader from '@/components/loader/loader';
import { Trash2 } from 'lucide-react';
import { notifySuccess, notifyError } from '@/utils/toast';
import dayjs from 'dayjs';
import { Rating } from 'react-simple-star-rating';

const AdminReviews = () => {
  const { data: productsData, isLoading, isError, refetch } = useGetAllProductsQuery({ limit: 1000 }, { refetchOnMountOrArgChange: true });
  const [deleteReview] = useDeleteReviewMutation();
  const [searchTerm, setSearchTerm] = useState('');
  const [localReviews, setLocalReviews] = useState([]);

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

  return (
    <AdminLayout title="Quản lý Đánh giá">
      <SEO pageTitle="Quản lý Đánh giá" />

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
                  <td style={{ maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={review.productObj?.title || review.productObj?.name}>
                    {review.productObj?.title || review.productObj?.name || 'Sản phẩm'}
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
                    <button onClick={() => handleDelete(review._id)} className="admin-btn" style={{ padding: '0.4rem', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--admin-danger)' }} title="Xóa">
                      <Trash2 size={16} />
                    </button>
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
    </AdminLayout>
  );
};

export default AdminReviews;
