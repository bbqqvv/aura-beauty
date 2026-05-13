import React, { useState, useContext } from 'react';
import AdminLayout, { AdminSearchContext } from '@/layout/admin-layout';
import SEO from '@/components/seo';
import { Edit, Trash2, Plus, Image as ImageIcon, X, Save } from 'lucide-react';
import { useGetAllBrandsQuery, useDeleteBrandMutation, useAddBrandMutation, useUpdateBrandMutation } from '@/redux/features/brandApi';
import Loader from '@/components/loader/loader';

const Adminbrands = () => {
  const { data: brands, isLoading, isError, refetch } = useGetAllBrandsQuery();
  const [deleteBrand] = useDeleteBrandMutation();
  const [addBrand] = useAddBrandMutation();
  const [updateBrand] = useUpdateBrandMutation();
  
  const searchTerm = useContext(AdminSearchContext);

  const filteredbrands = brands?.result?.filter(Brand => 
    Brand.name?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState(null);
  const [formData, setFormData] = useState({ name: '', logo: '', status: 'active' });
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const formPayload = new FormData();
    formPayload.append('image', file);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:7000'}/api/cloudinary/add-logo`, {
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

  const handleOpenModal = (Brand = null) => {
    if (Brand) {
      setEditingBrand(Brand);
      setFormData({
        name: Brand.name || '',
        logo: Brand.logo || '',
        status: Brand.status || 'active'
      });
    } else {
      setEditingBrand(null);
      setFormData({ name: '', logo: '', status: 'active' });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingBrand(null);
  };

  const handleSave = async () => {
    if (!formData.name) return alert("Vui lòng nhập tên thương hiệu");
    try {
      if (editingBrand) {
        await updateBrand({ id: editingBrand._id, data: formData }).unwrap();
      } else {
        await addBrand(formData).unwrap();
      }
      refetch();
      handleCloseModal();
    } catch (err) {
      console.error(err);
      alert(err?.data?.message || "Đã xảy ra lỗi");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa Thương hiệu này?")) {
      try {
        await deleteBrand(id).unwrap();
        refetch();
      } catch (err) {
        console.error('Lỗi khi xóa Thương hiệu', err);
      }
    }
  };

  return (
    <AdminLayout title="Quản lý Thương hiệu">
      <SEO pageTitle="Quản lý Thương hiệu" />

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem' }}>
        <button onClick={() => handleOpenModal()} className="admin-btn admin-btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Plus size={18} /> Thêm Thương hiệu Mới
        </button>
      </div>

      <div className="admin-content-card glass-panel">
        {isLoading ? (
          <div className="d-flex justify-content-center p-5">
            <Loader loading={isLoading} />
          </div>
        ) : isError ? (
          <div className="text-danger p-5 text-center">Lỗi tải thương hiệu.</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Hình ảnh</th>
                <th>Tên thương hiệu</th>
                <th>Số lượng SP</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredbrands.map((Brand) => (
                <tr key={Brand._id}>
                  <td>
                    {Brand.logo ? (
                       <img src={Brand.logo} alt={Brand.name} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px', background: '#F6F7F9', padding: '5px' }} />
                    ) : (
                      <div style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F6F7F9', borderRadius: '4px', color: 'var(--admin-text-sub)' }}>
                        <ImageIcon size={20} />
                      </div>
                    )}
                  </td>
                  <td style={{ fontWeight: 500, textTransform: 'capitalize' }}>{Brand.name}</td>
                  <td>{Brand.products?.length || 0}</td>
                  <td>
                    <span className={`admin-badge ${Brand.status === 'active' ? 'admin-badge-success' : 'admin-badge-danger'}`}>
                      {Brand.status === 'active' ? 'Hoạt động' : 'Tạm ẩn'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button onClick={() => handleOpenModal(Brand)} className="admin-btn" style={{ padding: '0.4rem', background: 'rgba(9, 137, 255, 0.1)', color: 'var(--admin-accent)' }} title="Chỉnh sửa">
                        <Edit size={16} />
                      </button>
                      <button onClick={() => handleDelete(Brand._id)} className="admin-btn" style={{ padding: '0.4rem', background: 'rgba(253, 75, 107, 0.1)', color: 'var(--admin-danger)' }} title="Xóa">
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
          <div className="glass-panel" style={{ background: '#fff', padding: '2rem', borderRadius: '12px', width: '100%', maxWidth: '500px', position: 'relative' }}>
            <button onClick={handleCloseModal} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--admin-text-sub)' }}>
              <X size={24} />
            </button>
            <h3 style={{ marginBottom: '1.5rem', fontSize: '1.5rem', fontWeight: 600 }}>
              {editingBrand ? 'Chỉnh sửa Thương hiệu' : 'Thêm mới Thương hiệu'}
            </h3>
            
            <div className="admin-form-group">
              <label>Tên thương hiệu</label>
              <input 
                type="text" 
                className="admin-input-premium" 
                value={formData.name} 
                onChange={(e) => setFormData({...formData, name: e.target.value})} 
                placeholder="e.g. L'Oreal" 
              />
            </div>
            
            <div className="admin-form-group">
              <label>Hình ảnh</label>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <input type="text" className="admin-input-premium" value={formData.logo} onChange={(e) => setFormData({...formData, logo: e.target.value})} placeholder="https://..." style={{ flex: 1 }} />
                <label className="admin-btn" style={{ background: '#f1f5f9', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0, border: '1px solid var(--admin-border)', borderRadius: '6px' }}>
                  <ImageIcon size={16} /> {uploading ? '...' : 'Tải lên'}
                  <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} disabled={uploading} />
                </label>
              </div>
            </div>

            <div className="admin-form-group">
              <label>Trạng thái</label>
              <select 
                className="admin-input-premium" 
                value={formData.status} 
                onChange={(e) => setFormData({...formData, status: e.target.value})}
              >
                <option value="active">Hoạt động</option>
                <option value="inactive">Tạm ẩn</option>
              </select>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
              <button onClick={handleCloseModal} className="admin-btn" style={{ background: '#f1f5f9', color: '#475569' }}>Hủy</button>
              <button onClick={handleSave} className="admin-btn admin-btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Save size={18} /> Lưu Thương hiệu
              </button>
            </div>
          </div>
        </div>
      )}

    </AdminLayout>
  );
};

export default Adminbrands;
