import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import AdminLayout, { adminSearchEvent } from '@/layout/admin-layout';
import SEO from '@/components/seo';
import { useGetAllProductsQuery, useDeleteProductMutation } from '@/redux/features/productApi';
import Loader from '@/components/loader/loader';
import { Edit, Trash2, Plus, AlertCircle } from 'lucide-react';
import InfiniteScroll from 'react-infinite-scroll-component';

const AdminProducts = () => {
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const handler = (e) => setSearchTerm(e.detail);
    if (adminSearchEvent) {
      adminSearchEvent.addEventListener('search', handler);
      return () => adminSearchEvent.removeEventListener('search', handler);
    }
  }, []);

  useEffect(() => {
    setPage(1);
    setItems([]);
    setHasMore(true);
  }, [searchTerm]);

  const { data, isLoading, isError, refetch } = useGetAllProductsQuery({ 
    page, 
    limit: 15, 
    searchTerm: searchTerm 
  });
  const [deleteProduct] = useDeleteProductMutation();

  useEffect(() => {
    if (data?.data) {
      setItems(prev => {
        if (page === 1) return data.data;
        const currentIds = new Set(prev.map(p => p._id));
        const newItems = data.data.filter(p => !currentIds.has(p._id));
        return [...prev, ...newItems];
      });
      setHasMore(data.data.length === 15);
    }
  }, [data, page]);

  const fetchMoreData = () => {
    setPage(prev => prev + 1);
  };

  const filteredProducts = items;

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này không?")) {
      try {
        await deleteProduct(id).unwrap();
        setItems(prev => prev.filter(p => p._id !== id));
      } catch (err) {
        console.error('Lỗi khi xóa sản phẩm', err);
      }
    }
  };

  return (
    <AdminLayout title="Quản lý Sản phẩm">
      <SEO pageTitle="Quản lý Sản phẩm" />
      
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem' }}>
        <Link href="/admin/add-product" className="admin-btn admin-btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
          <Plus size={18} /> Thêm Sản Phẩm Mới
        </Link>
      </div>

      <div className="admin-content-card glass-panel" style={{ padding: 0, overflow: 'hidden' }}>
        <InfiniteScroll
          dataLength={filteredProducts.length}
          next={fetchMoreData}
          hasMore={hasMore}
          loader={<div className="text-center p-3"><Loader loading={true} /></div>}
          endMessage={<div className="text-center p-3 text-muted">Đã hiển thị toàn bộ sản phẩm</div>}
          scrollThreshold={0.9}
        >
          <table className="admin-table">
            <thead>
              <tr>
                <th>Hình ảnh</th>
                <th>Tên sản phẩm</th>
                <th>Danh mục</th>
                <th>Giá</th>
                <th>Tồn kho</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product._id}>
                  <td>
                    <img src={product.img} alt={product.title} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                  </td>
                  <td style={{ fontWeight: 500 }}>{product.title}</td>
                  <td style={{ color: 'var(--admin-text-sub)' }}>{product.category?.name}</td>
                  <td>${product.price}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span className={`admin-badge ${product.quantity > 0 ? (product.quantity < 5 ? 'admin-badge-warning' : 'admin-badge-success') : 'admin-badge-danger'}`}>
                        {product.quantity > 0 ? `${product.quantity} sp` : 'Hết hàng'}
                      </span>
                      {product.quantity > 0 && product.quantity < 5 && <AlertCircle size={14} color="var(--admin-warning)" title="Sắp hết hàng" />}
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <Link href={`/admin/edit-product/${product._id}`} className="admin-btn" style={{ padding: '0.4rem', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--admin-accent)', display: 'inline-flex' }} title="Chỉnh sửa">
                        <Edit size={16} />
                      </Link>
                      <button onClick={() => handleDelete(product._id)} className="admin-btn" style={{ padding: '0.4rem', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--admin-danger)' }} title="Xóa">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </InfiniteScroll>
      </div>

    </AdminLayout>
  );
};

export default AdminProducts;
