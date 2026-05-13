import React, { useState, useContext } from 'react';
import AdminLayout, { AdminSearchContext } from '@/layout/admin-layout';
import SEO from '@/components/seo';
import { Edit, Trash2, Plus, Percent, X, Save, Image as ImageIcon } from 'lucide-react';
import { useGetAllCouponsQuery, useDeleteCouponMutation, useAddCouponMutation, useUpdateCouponMutation } from '@/redux/features/couponApi';
import Loader from '@/components/loader/loader';
import dayjs from 'dayjs';

const AdminCoupons = () => {
  const { data: response, isLoading, isError, refetch } = useGetAllCouponsQuery();
  const [deleteCoupon] = useDeleteCouponMutation();
  const [addCoupon] = useAddCouponMutation();
  const [updateCoupon] = useUpdateCouponMutation();

  const searchTerm = useContext(AdminSearchContext);
  const coupons = response?.data || [];

  const filteredCoupons = coupons.filter(coupon => 
    coupon.couponCode?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  
  const initialForm = {
    title: '',
    logo: '',
    couponCode: '',
    discountPercentage: 0,
    minimumAmount: 0,
    endTime: dayjs().add(1, 'month').format('YYYY-MM-DDTHH:mm'),
    status: 'active'
  };

  const [formData, setFormData] = useState(initialForm);
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const formPayload = new FormData();
    formPayload.append('image', file);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:7000'}/api/cloudinary/add-img`, {
        method: 'POST',
        body: formPayload,
      });
      const data = await res.json();
      if (data.success) {
        setFormData(prev => ({ ...prev, logo: data.data.url }));
      } else {
        alert('Upload failed: ' + data.message);
      }
    } catch (err) {
      alert('Lỗi tải ảnh lên');
    } finally {
      setUploading(false);
    }
  };

  const handleOpenModal = (coupon = null) => {
    if (coupon) {
      setEditingCoupon(coupon);
      setFormData({
        title: coupon.title || '',
        logo: coupon.logo || '',
        couponCode: coupon.couponCode || '',
        discountPercentage: coupon.discountPercentage || 0,
        minimumAmount: coupon.minimumAmount || 0,
        endTime: dayjs(coupon.endTime).format('YYYY-MM-DDTHH:mm'),
        status: coupon.status || 'active'
      });
    } else {
      setEditingCoupon(null);
      setFormData(initialForm);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCoupon(null);
  };

  const handleSave = async () => {
    if (!formData.title || !formData.couponCode) return alert("Tiêu đề và Mã khuyến mãi không được bỏ trống");
    try {
      if (editingCoupon) {
        await updateCoupon({ id: editingCoupon._id, data: { ...formData, productType: 'beauty' } }).unwrap();
      } else {
        await addCoupon({ ...formData, productType: 'beauty' }).unwrap();
      }
      refetch();
      handleCloseModal();
    } catch (err) {
      console.error(err);
      alert(err?.data?.message || "Đã xảy ra lỗi");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa mã khuyến mãi này?")) {
      try {
        await deleteCoupon(id).unwrap();
        refetch();
      } catch (err) {
        console.error('Lỗi khi xóa', err);
      }
    }
  };

  return (
    <AdminLayout title="Quản lý Khuyến mãi">
      <SEO pageTitle="Quản lý Khuyến mãi" />

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem' }}>
        <button onClick={() => handleOpenModal()} className="admin-btn admin-btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Plus size={18} /> Thêm Khuyến mãi Mới
        </button>
      </div>

      <div className="admin-content-card glass-panel">
        {isLoading ? (
          <div className="d-flex justify-content-center p-5">
            <Loader loading={isLoading} />
          </div>
        ) : isError ? (
          <div className="text-danger p-5 text-center">Lỗi tải dữ liệu.</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Mã khuyến mãi</th>
                <th>Giảm giá</th>
                <th>Đơn tối thiểu</th>
                <th>Ngày hết hạn</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredCoupons.map((coupon) => (
                <tr key={coupon._id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
                      <div style={{ padding: '0.4rem', background: 'rgba(9, 137, 255, 0.1)', color: 'var(--admin-accent)', borderRadius: '4px' }}>
                        <Percent size={14} />
                      </div>
                      {coupon.couponCode}
                    </div>
                  </td>
                  <td style={{ fontWeight: 500 }}>{coupon.discountPercentage}%</td>
                  <td style={{ color: 'var(--admin-text-sub)' }}>${coupon.minimumAmount}</td>
                  <td style={{ color: 'var(--admin-text-sub)' }}>{dayjs(coupon.endTime).format('MMM DD, YYYY')}</td>
                  <td>
                    <span className={`admin-badge ${new Date() < new Date(coupon.endTime) ? 'admin-badge-success' : 'admin-badge-danger'}`}>
                      {new Date() < new Date(coupon.endTime) ? 'Hoạt động' : 'Hết hạn'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button onClick={() => handleOpenModal(coupon)} className="admin-btn" style={{ padding: '0.4rem', background: 'rgba(9, 137, 255, 0.1)', color: 'var(--admin-accent)' }} title="Chỉnh sửa">
                        <Edit size={16} />
                      </button>
                      <button onClick={() => handleDelete(coupon._id)} className="admin-btn" style={{ padding: '0.4rem', background: 'rgba(253, 75, 107, 0.1)', color: 'var(--admin-danger)' }} title="Xóa">
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

      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div className="glass-panel" style={{ background: '#fff', padding: '2rem', borderRadius: '12px', width: '100%', maxWidth: '600px', position: 'relative', maxHeight: '90vh', overflowY: 'auto' }}>
            <button onClick={handleCloseModal} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--admin-text-sub)' }}>
              <X size={24} />
            </button>
            <h3 style={{ marginBottom: '1.5rem', fontSize: '1.5rem', fontWeight: 600 }}>
              {editingCoupon ? 'Chỉnh sửa Khuyến mãi' : 'Thêm mới Khuyến mãi'}
            </h3>
            
            <div className="row">
              <div className="col-md-6">
                <div className="admin-form-group">
                  <label>Tiêu đề</label>
                  <input type="text" className="admin-input-premium" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} placeholder="VD: Khuyến mãi mùa hè" />
                </div>
              </div>
              <div className="col-md-6">
                <div className="admin-form-group">
                  <label>Mã khuyến mãi</label>
                  <input type="text" className="admin-input-premium" value={formData.couponCode} onChange={(e) => setFormData({...formData, couponCode: e.target.value})} placeholder="VD: SUMMER20" />
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <div className="admin-form-group">
                  <label>Phần trăm giảm (%)</label>
                  <input type="number" className="admin-input-premium" value={formData.discountPercentage} onChange={(e) => setFormData({...formData, discountPercentage: Number(e.target.value)})} />
                </div>
              </div>
              <div className="col-md-6">
                <div className="admin-form-group">
                  <label>Giá trị đơn tối thiểu ($)</label>
                  <input type="number" className="admin-input-premium" value={formData.minimumAmount} onChange={(e) => setFormData({...formData, minimumAmount: Number(e.target.value)})} />
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-12">
                <div className="admin-form-group">
                  <label>Ngày hết hạn</label>
                  <input type="datetime-local" className="admin-input-premium" value={formData.endTime} onChange={(e) => setFormData({...formData, endTime: e.target.value})} />
                </div>
              </div>
            </div>

            <div className="admin-form-group">
              <label>Logo</label>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <input type="text" className="admin-input-premium" value={formData.logo} onChange={(e) => setFormData({...formData, logo: e.target.value})} placeholder="https://..." style={{ flex: 1 }} />
                <label className="admin-btn" style={{ background: '#f1f5f9', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0, border: '1px solid var(--admin-border)', borderRadius: '6px' }}>
                  <ImageIcon size={16} /> {uploading ? '...' : 'Tải lên'}
                  <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} disabled={uploading} />
                </label>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
              <button onClick={handleCloseModal} className="admin-btn" style={{ background: '#f1f5f9', color: '#475569' }}>Hủy</button>
              <button onClick={handleSave} className="admin-btn admin-btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Save size={18} /> Lưu Khuyến mãi
              </button>
            </div>
          </div>
        </div>
      )}

    </AdminLayout>
  );
};

export default AdminCoupons;
