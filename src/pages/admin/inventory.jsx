import React, { useState, useEffect } from 'react';
import AdminLayout, { adminSearchEvent } from '@/layout/admin-layout';
import SEO from '@/components/seo';
import { useGetAllProductsQuery, useUpdateProductMutation } from '@/redux/features/productApi';
import Loader from '@/components/loader/loader';
import { AlertCircle, ArrowUpRight, Package, Save, CheckCircle, X } from 'lucide-react';
import { notifySuccess, notifyError } from '@/utils/toast';

const AdminInventory = () => {
  const { data: products, isLoading, isError, refetch } = useGetAllProductsQuery(undefined, { refetchOnMountOrArgChange: true });
  const [updateProduct] = useUpdateProductMutation();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const handler = (e) => setSearchTerm(e.detail);
    if (adminSearchEvent) {
      adminSearchEvent.addEventListener('search', handler);
      return () => adminSearchEvent.removeEventListener('search', handler);
    }
  }, []);

  const [editingId, setEditingId] = useState(null);
  const [addedQuantity, setAddedQuantity] = useState(0);

  const filteredProducts = products?.data?.filter(p => 
    p.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.sku?.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a, b) => a.quantity - b.quantity) || [];

  const handleUpdateStock = async (product) => {
    const added = Number(addedQuantity);
    if (isNaN(added) || added < 0) {
      notifyError("Vui lòng nhập số lượng hợp lệ (>= 0)");
      return;
    }

    try {
      await updateProduct({ 
        id: product._id, 
        data: { ...product, quantity: product.quantity + added } 
      }).unwrap();
      notifySuccess(`Đã nhập thêm ${added} sản phẩm vào kho!`);
      setEditingId(null);
      setAddedQuantity(0);
      refetch();
    } catch (err) {
      notifyError("Cập nhật thất bại");
    }
  };

  const getStockStatus = (qty) => {
    if (qty === 0) return { label: 'Hết hàng', class: 'admin-badge-danger', icon: <AlertCircle size={14} /> };
    if (qty < 5) return { label: 'Sắp hết', class: 'admin-badge-warning', icon: <AlertCircle size={14} /> };
    return { label: 'Ổn định', class: 'admin-badge-success', icon: <CheckCircle size={14} /> };
  };

  return (
    <AdminLayout title="Quản lý Kho mỹ phẩm">
      <SEO pageTitle="Quản lý Kho" />

      <div className="admin-stats-grid">
        <div className="admin-stat-card glass-panel">
          <div className="admin-stat-label">Sản phẩm sắp hết hàng</div>
          <div className="admin-stat-value" style={{ color: 'var(--admin-warning)' }}>
            {products?.data?.filter(p => p.quantity > 0 && p.quantity < 5).length || 0}
          </div>
        </div>
        <div className="admin-stat-card glass-panel">
          <div className="admin-stat-label">Sản phẩm hết hàng</div>
          <div className="admin-stat-value" style={{ color: 'var(--admin-danger)' }}>
            {products?.data?.filter(p => p.quantity === 0).length || 0}
          </div>
        </div>
        <div className="admin-stat-card glass-panel">
          <div className="admin-stat-label">Tổng giá trị tồn kho</div>
          <div className="admin-stat-value">
            ${products?.data?.reduce((acc, p) => acc + (p.price * p.quantity), 0).toLocaleString() || 0}
          </div>
        </div>
      </div>

      <div className="admin-content-card glass-panel">
        <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Tình trạng tồn kho</h3>
        </div>

        {isLoading ? (
          <div className="d-flex justify-content-center p-5"><Loader loading={isLoading} /></div>
        ) : isError ? (
          <div className="text-danger p-5 text-center">Lỗi tải dữ liệu kho.</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Sản phẩm</th>
                <th>SKU</th>
                <th>Giá bán</th>
                <th>Hiện có</th>
                <th>Nhập thêm</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => {
                const status = getStockStatus(product.quantity);
                const isEditing = editingId === product._id;
                return (
                  <tr key={product._id} style={{ background: isEditing ? 'rgba(9, 137, 255, 0.02)' : 'transparent' }}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <img src={product.img} alt="" style={{ width: '35px', height: '35px', borderRadius: '4px', objectFit: 'cover' }} />
                        <span style={{ fontWeight: 500, fontSize: '0.9rem' }}>{product.title}</span>
                      </div>
                    </td>
                    <td style={{ fontSize: '0.85rem', color: 'var(--admin-text-sub)' }}>{product.sku || 'N/A'}</td>
                    <td>${product.price}</td>
                    <td style={{ fontWeight: 600 }}>
                      {product.quantity}
                      {isEditing && (
                        <span style={{ color: 'var(--admin-success)', marginLeft: '0.5rem', fontSize: '0.8rem' }}>
                           → {product.quantity + (Number(addedQuantity) || 0)}
                        </span>
                      )}
                    </td>
                    <td>
                      {isEditing ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                          <span style={{ color: 'var(--admin-success)', fontWeight: 'bold' }}>+</span>
                          <input 
                            type="number" 
                            min="0"
                            value={addedQuantity} 
                            onChange={(e) => setAddedQuantity(e.target.value)}
                            style={{ width: '60px', padding: '0.2rem 0.4rem', borderRadius: '4px', border: '1px solid var(--admin-success)', outline: 'none' }}
                            autoFocus
                          />
                        </div>
                      ) : (
                        <span style={{ color: 'var(--admin-text-sub)' }}>—</span>
                      )}
                    </td>
                    <td>
                      <span className={`admin-badge ${status.class}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                        {status.icon} {status.label}
                      </span>
                    </td>
                    <td>
                      {isEditing ? (
                        <div style={{ display: 'flex', gap: '0.4rem' }}>
                          <button onClick={() => handleUpdateStock(product)} className="admin-btn" style={{ padding: '0.4rem', background: 'var(--admin-success)', color: 'white' }} title="Xác nhận nhập kho">
                            <Save size={16} />
                          </button>
                          <button onClick={() => setEditingId(null)} className="admin-btn" style={{ padding: '0.4rem', background: 'var(--admin-text-sub)', color: 'white' }}>
                            <X size={16} />
                          </button>
                        </div>
                      ) : (
                        <button 
                          onClick={() => { setEditingId(product._id); setAddedQuantity(0); }} 
                          className="admin-btn" 
                          style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', background: 'rgba(9, 137, 255, 0.1)', color: 'var(--admin-accent)', fontWeight: 500 }}
                        >
                          Nhập thêm
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminInventory;
