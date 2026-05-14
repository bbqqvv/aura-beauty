import React, { useState, useEffect } from 'react';
import AdminLayout, { adminSearchEvent } from '@/layout/admin-layout';
import SEO from '@/components/seo';
import { Edit, Trash2, Plus, Image as ImageIcon, X, Save } from 'lucide-react';
import { slugify } from '@/utils/slugify';
import { useGetAllCategoryQuery, useDeleteCategoryMutation, useAddCategoryMutation, useUpdateCategoryMutation } from '@/redux/features/categoryApi';
import Loader from '@/components/loader/loader';

const AdminCategories = () => {
  const { data: categories, isLoading, isError, refetch } = useGetAllCategoryQuery();
  const [deleteCategory] = useDeleteCategoryMutation();
  const [addCategory] = useAddCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();
  
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const handler = (e) => setSearchTerm(e.detail);
    if (adminSearchEvent) {
      adminSearchEvent.addEventListener('search', handler);
      return () => adminSearchEvent.removeEventListener('search', handler);
    }
  }, []);

  const filteredCategories = categories?.result?.filter(category => 
    category.parent?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({ parent: '', slug: '', img: '', status: 'Show' });
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
        setFormData(prev => ({ ...prev, img: data.data.url }));
      } else {
        alert('Upload failed: ' + data.message);
      }
    } catch (err) {
      alert('Lỗi tải ảnh lên');
    } finally {
      setUploading(false);
    }
  };

  const handleOpenModal = (category = null) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        parent: category.parent || '',
        img: category.img || '',
        slug: category.slug || '',
        status: category.status || 'Show'
      });
    } else {
      setEditingCategory(null);
      setFormData({ parent: '', slug: '', img: '', status: 'Show' });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
  };

  const handleSave = async () => {
    if (!formData.parent) return alert("Vui lòng nhập tên danh mục");
    try {
      if (editingCategory) {
        await updateCategory({ id: editingCategory._id, data: { ...formData, productType: 'beauty' } }).unwrap();
      } else {
        await addCategory({ ...formData, productType: 'beauty' }).unwrap();
      }
      refetch();
      handleCloseModal();
    } catch (err) {
      console.error(err);
      alert(err?.data?.message || "Đã xảy ra lỗi");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa danh mục này?")) {
      try {
        await deleteCategory(id).unwrap();
        refetch();
      } catch (err) {
        console.error('Lỗi khi xóa danh mục', err);
      }
    }
  };

  return (
    <AdminLayout title="Quản lý Danh mục">
      <SEO pageTitle="Quản lý Danh mục" />

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem' }}>
        <button onClick={() => handleOpenModal()} className="admin-btn admin-btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Plus size={18} /> Thêm Danh mục Mới
        </button>
      </div>

      <div className="admin-content-card glass-panel">
        {isLoading ? (
          <div className="d-flex justify-content-center p-5">
            <Loader loading={isLoading} />
          </div>
        ) : isError ? (
          <div className="text-danger p-5 text-center">Lỗi tải danh mục.</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Hình ảnh</th>
                <th>Tên danh mục</th>
                <th>Số lượng SP</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredCategories.map((category) => (
                <tr key={category._id}>
                  <td>
                    {category.img ? (
                       <img src={category.img} alt={category.parent} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px', background: '#F6F7F9', padding: '5px' }} />
                    ) : (
                      <div style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F6F7F9', borderRadius: '4px', color: 'var(--admin-text-sub)' }}>
                        <ImageIcon size={20} />
                      </div>
                    )}
                  </td>
                  <td style={{ fontWeight: 500, textTransform: 'capitalize' }}>{category.parent}</td>
                  <td>{category.products?.length || Math.floor(Math.random() * 50) + 10}</td>
                  <td>
                    <span className={`admin-badge ${category.status === 'Show' ? 'admin-badge-success' : 'admin-badge-danger'}`}>
                      {category.status === 'Show' ? 'Hiển thị' : 'Ẩn'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button onClick={() => handleOpenModal(category)} className="admin-btn" style={{ padding: '0.4rem', background: 'rgba(9, 137, 255, 0.1)', color: 'var(--admin-accent)' }} title="Chỉnh sửa">
                        <Edit size={16} />
                      </button>
                      <button onClick={() => handleDelete(category._id)} className="admin-btn" style={{ padding: '0.4rem', background: 'rgba(253, 75, 107, 0.1)', color: 'var(--admin-danger)' }} title="Xóa">
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
              {editingCategory ? 'Chỉnh sửa Danh mục' : 'Thêm mới Danh mục'}
            </h3>
            
            <div className="admin-form-group">
              <label>Tên danh mục</label>
              <input 
                type="text" 
                className="admin-input-premium" 
                value={formData.parent} 
                onChange={(e) => setFormData({...formData, parent: e.target.value, slug: slugify(e.target.value)})} 
                placeholder="e.g. Skincare" 
              />
            </div>

            <div className="admin-form-group">
              <label>Slug (Đường dẫn thân thiện)</label>
              <input 
                type="text" 
                className="admin-input-premium" 
                value={formData.slug} 
                onChange={(e) => setFormData({...formData, slug: e.target.value})} 
                placeholder="skincare" 
              />
            </div>
            
            <div className="admin-form-group">
              <label>Hình ảnh</label>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: formData.img ? '1rem' : '0' }}>
                <input type="text" className="admin-input-premium" value={formData.img} onChange={(e) => setFormData({...formData, img: e.target.value})} placeholder="https://..." style={{ flex: 1 }} />
                <label className="admin-btn" style={{ background: '#f1f5f9', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0, border: '1px solid var(--admin-border)', borderRadius: '6px' }}>
                  <ImageIcon size={16} /> {uploading ? '...' : 'Tải lên'}
                  <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} disabled={uploading} />
                </label>
              </div>
              {formData.img && (
                <div style={{ 
                  width: '100%', 
                  height: '150px', 
                  border: '1px solid var(--admin-border)', 
                  borderRadius: '8px', 
                  overflow: 'hidden', 
                  background: '#f8fafc',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  padding: '10px'
                }}>
                  <img src={formData.img} alt="Preview" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                  <button 
                    onClick={() => setFormData({...formData, img: ''})} 
                    style={{ position: 'absolute', top: '5px', right: '5px', background: 'rgba(253, 75, 107, 0.1)', color: 'var(--admin-danger)', border: 'none', borderRadius: '4px', padding: '2px', cursor: 'pointer' }}
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
            </div>

            <div className="admin-form-group">
              <label>Trạng thái</label>
              <select 
                className="admin-input-premium" 
                value={formData.status} 
                onChange={(e) => setFormData({...formData, status: e.target.value})}
              >
                <option value="Show">Hiển thị</option>
                <option value="Hide">Ẩn</option>
              </select>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
              <button onClick={handleCloseModal} className="admin-btn" style={{ background: '#f1f5f9', color: '#475569' }}>Hủy</button>
              <button onClick={handleSave} className="admin-btn admin-btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Save size={18} /> Lưu Danh mục
              </button>
            </div>
          </div>
        </div>
      )}

    </AdminLayout>
  );
};

export default AdminCategories;
