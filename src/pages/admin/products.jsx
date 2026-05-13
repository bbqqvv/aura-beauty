import React, { useContext } from 'react';
import Link from 'next/link';
import AdminLayout, { AdminSearchContext } from '@/layout/admin-layout';
import SEO from '@/components/seo';
import { useGetAllProductsQuery, useDeleteProductMutation } from '@/redux/features/productApi';
import Loader from '@/components/loader/loader';
import { Edit, Trash2, Plus } from 'lucide-react';

const AdminProducts = () => {
  const { data: products, isLoading, isError, refetch } = useGetAllProductsQuery();
  const [deleteProduct] = useDeleteProductMutation();
  const searchTerm = useContext(AdminSearchContext);

  const filteredProducts = products?.data?.filter(p => 
    p.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này không?")) {
      try {
        await deleteProduct(id).unwrap();
        refetch();
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

      <div className="admin-content-card glass-panel">
        {isLoading ? (
          <div className="d-flex justify-content-center p-5">
            <Loader loading={isLoading} />
          </div>
        ) : isError ? (
          <div className="text-danger p-5 text-center">Lỗi tải danh sách sản phẩm.</div>
        ) : (
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
                    <span className={`admin-badge ${product.quantity > 0 ? 'admin-badge-success' : 'admin-badge-danger'}`}>
                      {product.quantity > 0 ? `Còn ${product.quantity} sp` : 'Hết hàng'}
                    </span>
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
        )}
      </div>

    </AdminLayout>
  );
};

export default AdminProducts;
