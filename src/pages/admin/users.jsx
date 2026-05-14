import React, { useState, useEffect } from 'react';
import AdminLayout, { adminSearchEvent } from '@/layout/admin-layout';
import SEO from '@/components/seo';
import { Edit, Trash2, Plus, Mail, Phone, X, Save } from 'lucide-react';
import { useGetAllUsersQuery, useDeleteUserMutation, useUpdateUserMutation, useAddUserMutation } from '@/redux/features/userApi';
import Loader from '@/components/loader/loader';
import dayjs from 'dayjs';
import InfiniteScroll from 'react-infinite-scroll-component';

const AdminUsers = () => {
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

  const { data: response, isLoading, isError, refetch } = useGetAllUsersQuery({
    page,
    limit: 15,
    searchTerm: searchTerm
  });
  
  useEffect(() => {
    if (response?.data) {
      setItems(prev => {
        // Prevent duplicate appending if the response page is 1
        if (page === 1) return response.data;
        
        // Otherwise append, but filter out duplicates by _id just in case
        const currentIds = new Set(prev.map(p => p._id));
        const newItems = response.data.filter(p => !currentIds.has(p._id));
        return [...prev, ...newItems];
      });
      
      // Calculate hasMore correctly
      setHasMore(response.data.length === 15);
    }
  }, [response, page]);

  const fetchMoreData = () => {
    setPage(prev => prev + 1);
  };

  const filteredUsers = items;

  const [deleteUser] = useDeleteUserMutation();
  const [updateUser] = useUpdateUserMutation();
  const [addUser] = useAddUserMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', role: 'user', password: '' });

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa người dùng này?")) {
      try {
        await deleteUser(id).unwrap();
        refetch();
      } catch (err) {
        alert("Lỗi khi xóa người dùng");
      }
    }
  };

  const openAddModal = () => {
    setIsEditMode(false);
    setFormData({ name: '', email: '', phone: '', role: 'user', password: '' });
    setSelectedUserId(null);
    setIsModalOpen(true);
  };

  const openEditModal = (user) => {
    setIsEditMode(true);
    setSelectedUserId(user._id);
    setFormData({ name: user.name || '', email: user.email || '', phone: user.phone || '', role: user.role || 'user', password: '' });
    setIsModalOpen(true);
  };

  const handleModalSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditMode) {
        const updateData = { ...formData };
        if (!updateData.password) delete updateData.password;
        await updateUser({ id: selectedUserId, ...updateData }).unwrap();
      } else {
        await addUser(formData).unwrap();
      }
      setIsModalOpen(false);
      refetch();
    } catch (err) {
      alert("Thao tác thất bại. Email có thể đã tồn tại.");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <AdminLayout title="Quản lý Khách hàng">
      <SEO pageTitle="Quản lý Người dùng" />

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem' }}>
        <button onClick={openAddModal} className="admin-btn admin-btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Plus size={18} /> Thêm Người dùng Mới
        </button>
      </div>

      <div className="admin-content-card glass-panel" style={{ padding: 0, overflow: 'hidden' }}>
        <InfiniteScroll
          dataLength={filteredUsers.length}
          next={fetchMoreData}
          hasMore={hasMore}
          loader={<div className="text-center p-3"><Loader loading={true} /></div>}
          endMessage={<div className="text-center p-3 text-muted">Đã hiển thị toàn bộ khách hàng</div>}
          scrollThreshold={0.9}
        >
          <table className="admin-table">
            <thead>
              <tr>
                <th>Người dùng</th>
                <th>Liên hệ</th>
                <th>Vai trò</th>
                <th>Ngày tham gia</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user._id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--admin-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: 'var(--admin-text-sub)' }}>
                        {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                      </div>
                      <div>
                        <div style={{ fontWeight: 500 }}>{user.name}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--admin-text-sub)' }}>ID: #{user._id.slice(-6).toUpperCase()}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--admin-text-sub)', fontSize: '0.85rem' }}>
                        <Mail size={14} /> {user.email}
                      </div>
                      {user.phone && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--admin-text-sub)', fontSize: '0.85rem' }}>
                          <Phone size={14} /> {user.phone}
                        </div>
                      )}
                    </div>
                  </td>
                  <td style={{ textTransform: 'capitalize' }}>{user.role === 'admin' ? 'Quản trị viên' : 'Người dùng'}</td>
                  <td style={{ color: 'var(--admin-text-sub)' }}>{dayjs(user.createdAt).format('MMM DD, YYYY')}</td>
                  <td>
                    <span className={`admin-badge ${user.status === 'active' ? 'admin-badge-success' : 'admin-badge-danger'}`} style={{ textTransform: 'capitalize' }}>
                      {user.status === 'active' ? 'Hoạt động' : 'Đã khóa'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button onClick={() => openEditModal(user)} className="admin-btn" style={{ padding: '0.4rem', background: 'rgba(9, 137, 255, 0.1)', color: 'var(--admin-accent)' }} title="Chỉnh sửa">
                        <Edit size={16} />
                      </button>
                      <button onClick={() => handleDelete(user._id)} className="admin-btn" style={{ padding: '0.4rem', background: 'rgba(253, 75, 107, 0.1)', color: 'var(--admin-danger)' }} title="Xóa">
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

      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div className="glass-panel" style={{ background: '#fff', padding: '2rem', width: '100%', maxWidth: '500px', borderRadius: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--admin-border)', paddingBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>{isEditMode ? 'Chỉnh sửa Người dùng' : 'Thêm mới Người dùng'}</h3>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--admin-text-sub)' }}><X size={24} /></button>
            </div>
            <form onSubmit={handleModalSubmit}>
              <div className="admin-form-group">
                <label>Họ và tên</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required className="admin-input-premium" placeholder="VD: Nguyễn Văn A" />
              </div>
              <div className="admin-form-group">
                <label>Địa chỉ Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required className="admin-input-premium" placeholder="VD: a@example.com" disabled={isEditMode} style={{ background: isEditMode ? '#f1f5f9' : '#f8fafc' }} />
              </div>
              <div className="admin-form-group">
                <label>Số điện thoại</label>
                <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="admin-input-premium" placeholder="VD: 0987654321" />
              </div>
              {!isEditMode && (
                <div className="admin-form-group">
                  <label>Mật khẩu</label>
                  <input type="password" name="password" value={formData.password} onChange={handleChange} className="admin-input-premium" placeholder="Bỏ trống để dùng mặc định (123456)" />
                </div>
              )}
              <div className="admin-form-group" style={{ marginBottom: '2rem' }}>
                <label>Vai trò</label>
                <select name="role" value={formData.role} onChange={handleChange} className="admin-input-premium">
                  <option value="user">Người dùng</option>
                  <option value="admin">Quản trị viên</option>
                </select>
              </div>
              <button type="submit" className="admin-btn admin-btn-primary" style={{ width: '100%', padding: '0.75rem', fontSize: '1rem', borderRadius: '8px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
                <Save size={18} /> {isEditMode ? 'Cập nhật Người dùng' : 'Tạo Người dùng'}
              </button>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminUsers;
