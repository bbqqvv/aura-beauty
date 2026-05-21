import React, { useState, useEffect } from 'react';
import AdminLayout, { adminSearchEvent } from '@/layout/admin-layout';
import SEO from '@/components/seo';
import { useGetAllBlogsQuery, useDeleteBlogMutation, useAddBlogMutation, useUpdateBlogMutation } from '@/redux/features/blogApi';
import Loader from '@/components/loader/loader';
import { Edit, Trash2, Plus, X, ImageIcon } from 'lucide-react';
import { notifySuccess, notifyError } from '@/utils/toast';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';
import dayjs from 'dayjs';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

const AdminBlogs = () => {
  const { data: blogs, isLoading, isError, refetch } = useGetAllBlogsQuery(undefined, { refetchOnMountOrArgChange: true });
  const [deleteBlog] = useDeleteBlogMutation();
  const [addBlog] = useAddBlogMutation();
  const [updateBlog] = useUpdateBlogMutation();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const handler = (e) => setSearchTerm(e.detail);
    if (adminSearchEvent) {
      adminSearchEvent.addEventListener('search', handler);
      return () => adminSearchEvent.removeEventListener('search', handler);
    }
  }, []);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    author: 'Admin',
    category: 'Beauty',
    tags: '',
    img: '',
    sm_desc: '',
    desc: '',
    status: 'active'
  });

  const filteredBlogs = blogs?.result?.filter(b => 
    b.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.author?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.category?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleOpenModal = (blog = null) => {
    if (blog) {
      setEditingBlog(blog);
      setFormData({
        title: blog.title || '',
        author: blog.author || 'Admin',
        category: blog.category || 'Beauty',
        tags: blog.tags?.join(', ') || '',
        img: blog.img || '',
        sm_desc: blog.sm_desc || '',
        desc: blog.desc || '',
        status: blog.status || 'active'
      });
    } else {
      setEditingBlog(null);
      setFormData({
        title: '',
        author: 'Admin',
        category: 'Beauty',
        tags: '',
        img: '',
        sm_desc: '',
        desc: '',
        status: 'active'
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingBlog(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const payload = {
        ...formData,
        tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean)
      };

      if (editingBlog) {
        await updateBlog({ id: editingBlog._id, data: payload }).unwrap();
        notifySuccess("Cập nhật bài viết thành công!");
      } else {
        await addBlog(payload).unwrap();
        notifySuccess("Thêm bài viết mới thành công!");
      }
      refetch();
      handleCloseModal();
    } catch (err) {
      notifyError("Có lỗi xảy ra, vui lòng thử lại!");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa bài viết này không?")) {
      try {
        await deleteBlog(id).unwrap();
        notifySuccess("Đã xóa bài viết!");
        refetch();
      } catch (err) {
        notifyError("Lỗi khi xóa bài viết");
      }
    }
  };

  return (
    <AdminLayout title="Quản lý Bài viết (Blog)">
      <SEO pageTitle="Quản lý Blog" />

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem' }}>
        <button onClick={() => handleOpenModal()} className="admin-btn admin-btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Plus size={18} /> Thêm Bài Viết Mới
        </button>
      </div>

      <div className="admin-content-card glass-panel" style={{ padding: 0, overflow: 'hidden' }}>
        {isLoading ? (
          <div className="d-flex justify-content-center p-5"><Loader loading={isLoading} /></div>
        ) : isError ? (
          <div className="text-danger p-5 text-center">Lỗi tải dữ liệu.</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Hình ảnh</th>
                <th>Tiêu đề</th>
                <th>Danh mục</th>
                <th>Tác giả</th>
                <th>Ngày tạo</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredBlogs.map((blog) => (
                <tr key={blog._id}>
                  <td>
                    <img src={blog.img || '/assets/img/blog/blog-1.jpg'} alt={blog.title} style={{ width: '60px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                  </td>
                  <td style={{ fontWeight: 500, maxWidth: '250px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={blog.title}>{blog.title}</td>
                  <td>{blog.category}</td>
                  <td>{blog.author}</td>
                  <td style={{ color: 'var(--admin-text-sub)', fontSize: '0.9rem' }}>{dayjs(blog.date || blog.createdAt).format('DD/MM/YYYY')}</td>
                  <td>
                    <span className={`admin-badge ${blog.status === 'active' ? 'admin-badge-success' : 'admin-badge-warning'}`}>
                      {blog.status === 'active' ? 'Hiển thị' : 'Ẩn'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button onClick={() => handleOpenModal(blog)} className="admin-btn" style={{ padding: '0.4rem', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--admin-accent)' }} title="Chỉnh sửa">
                        <Edit size={16} />
                      </button>
                      <button onClick={() => handleDelete(blog._id)} className="admin-btn" style={{ padding: '0.4rem', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--admin-danger)' }} title="Xóa">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredBlogs.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center p-4 text-muted">Không tìm thấy bài viết nào.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div className="glass-panel" style={{ background: '#fff', padding: '2rem', width: '100%', maxWidth: '800px', borderRadius: '12px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--admin-border)', paddingBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 600, margin: 0 }}>{editingBlog ? 'Chỉnh sửa Bài Viết' : 'Thêm Bài Viết Mới'}</h3>
                {!editingBlog && (
                  <button type="button" 
                    onClick={() => {
                      setFormData({
                        title: '10 Bí Quyết Chăm Sóc Da Hoàn Hảo Cho Mùa Hè',
                        author: 'Admin Aura',
                        category: 'Skincare',
                        tags: 'chăm sóc da, mùa hè, làm đẹp',
                        img: 'https://i.ibb.co/nkQK0Xr/beauty-category-4.jpg',
                        sm_desc: 'Mùa hè nắng nóng luôn là nỗi ám ảnh với làn da. Khám phá 10 bí quyết đơn giản giúp da luôn tươi sáng và rạng rỡ.',
                        desc: '<p>Chi tiết bài viết mẫu dành cho chức năng blog. Bạn có thể chèn ảnh, định dạng văn bản tại đây.</p>',
                        status: 'active'
                      });
                      notifySuccess('Đã điền dữ liệu mẫu!');
                    }} 
                    className="admin-btn" 
                    style={{ background: '#f59e0b', color: 'white', padding: '0.3rem 0.6rem', fontSize: '0.8rem', borderRadius: '4px' }}
                  >
                    Auto Fill Test Data
                  </button>
                )}
              </div>
              <button onClick={handleCloseModal} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--admin-text-sub)' }}><X size={24} /></button>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div className="admin-form-group">
                <label>Tiêu đề bài viết</label>
                <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="Nhập tiêu đề..." className="admin-input-premium" />
              </div>
              
              <div className="admin-form-group">
                <label>Tác giả</label>
                <input type="text" name="author" value={formData.author} onChange={handleChange} className="admin-input-premium" />
              </div>

              <div className="admin-form-group">
                <label>Danh mục</label>
                <input type="text" name="category" value={formData.category} onChange={handleChange} placeholder="VD: Skincare, Makeup..." className="admin-input-premium" />
              </div>

              <div className="admin-form-group">
                <label>Tags (Cách nhau bằng dấu phẩy)</label>
                <input type="text" name="tags" value={formData.tags} onChange={handleChange} placeholder="làm đẹp, review, ..." className="admin-input-premium" />
              </div>

              <div className="admin-form-group" style={{ gridColumn: '1 / -1' }}>
                <label>URL Hình ảnh (Thumbnail)</label>
                <input type="text" name="img" value={formData.img} onChange={handleChange} placeholder="VD: /assets/img/product/premium-cosmetic.png" className="admin-input-premium" />
                {formData.img && (
                  <div style={{ marginTop: '10px', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--admin-border)', width: 'fit-content' }}>
                    <img src={formData.img} alt="Preview" style={{ maxWidth: '200px', maxHeight: '120px', objectFit: 'cover', display: 'block' }} />
                  </div>
                )}
              </div>

              <div className="admin-form-group" style={{ gridColumn: '1 / -1' }}>
                <label>Mô tả ngắn (Hiển thị ngoài danh sách)</label>
                <textarea name="sm_desc" value={formData.sm_desc} onChange={handleChange} placeholder="Nhập tóm tắt bài viết..." className="admin-input-premium" style={{ minHeight: '80px', resize: 'vertical' }} />
              </div>

              <div className="admin-form-group" style={{ gridColumn: '1 / -1' }}>
                <label>Nội dung chi tiết</label>
                <div style={{ background: '#fff', paddingBottom: '40px' }}>
                  <ReactQuill theme="snow" value={formData.desc} onChange={(val) => setFormData({...formData, desc: val})} style={{ height: '200px' }} />
                </div>
              </div>

              <div className="admin-form-group">
                <label>Trạng thái</label>
                <select name="status" value={formData.status} onChange={handleChange} className="admin-input-premium">
                  <option value="active">Hiển thị</option>
                  <option value="inactive">Ẩn</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem', paddingTop: '1rem', borderTop: '1px solid var(--admin-border)' }}>
              <button onClick={handleCloseModal} className="admin-btn" style={{ padding: '0.6rem 1.5rem', background: '#f1f5f9', color: 'var(--admin-text)', borderRadius: '6px' }}>Hủy bỏ</button>
              <button onClick={handleSave} className="admin-btn admin-btn-primary" style={{ padding: '0.6rem 2rem', borderRadius: '6px' }}>
                Lưu bài viết
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminBlogs;
