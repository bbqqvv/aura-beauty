import React, { useState, useEffect } from 'react';
import AdminLayout, { adminSearchEvent } from '@/layout/admin-layout';
import SEO from '@/components/seo';
import { Edit, Trash2, Plus, X, Save, MapPin, Phone, Clock } from 'lucide-react';
import { useGetAllStoresQuery, useDeleteStoreMutation, useAddStoreMutation, useUpdateStoreMutation } from '@/redux/features/storeApi';
import Loader from '@/components/loader/loader';

const AdminStores = () => {
  const { data: stores, isLoading, isError, refetch } = useGetAllStoresQuery();
  const [deleteStore] = useDeleteStoreMutation();
  const [addStore] = useAddStoreMutation();
  const [updateStore] = useUpdateStoreMutation();

  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const handler = (e) => setSearchTerm(e.detail);
    if (adminSearchEvent) {
      adminSearchEvent.addEventListener('search', handler);
      return () => adminSearchEvent.removeEventListener('search', handler);
    }
  }, []);

  const filteredStores = stores?.result?.filter(store =>
    store.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    store.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    store.regionLabel?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStore, setEditingStore] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    region: 'hcm',
    regionLabel: 'TP. Hồ Chí Minh',
    address: '',
    phone: '',
    hours: '08:30 - 22:00 (Hàng ngày)',
    mapUrl: '',
    features: [],
    status: 'active'
  });



  const regionLabels = {
    hcm: 'TP. Hồ Chí Minh',
    hanoi: 'Hà Nội',
    danang: 'Đà Nẵng'
  };

  const handleRegionChange = (e) => {
    const reg = e.target.value;
    setFormData(prev => ({
      ...prev,
      region: reg,
      regionLabel: regionLabels[reg] || reg
    }));
  };



  const handleOpenModal = (store = null) => {
    if (store) {
      setEditingStore(store);
      setFormData({
        name: store.name || '',
        region: store.region || 'hcm',
        regionLabel: store.regionLabel || 'TP. Hồ Chí Minh',
        address: store.address || '',
        phone: store.phone || '',
        hours: store.hours || '08:30 - 22:00 (Hàng ngày)',
        mapUrl: store.mapUrl || '',
        features: store.features || [],
        status: store.status || 'active'
      });
    } else {
      setEditingStore(null);
      setFormData({
        name: '',
        region: 'hcm',
        regionLabel: 'TP. Hồ Chí Minh',
        address: '',
        phone: '',
        hours: '08:30 - 22:00 (Hàng ngày)',
        mapUrl: '',
        features: [],
        status: 'active'
      });
    }

    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingStore(null);
  };

  const handleSave = async () => {
    if (!formData.name) return alert("Vui lòng nhập tên chi nhánh");
    if (!formData.address) return alert("Vui lòng nhập địa chỉ chi nhánh");
    if (!formData.phone) return alert("Vui lòng nhập số điện thoại");
    if (!formData.mapUrl) return alert("Vui lòng nhập link chỉ đường bản đồ");

    try {
      if (editingStore) {
        await updateStore({ id: editingStore._id, data: formData }).unwrap();
      } else {
        await addStore(formData).unwrap();
      }
      refetch();
      handleCloseModal();
    } catch (err) {
      console.error(err);
      alert(err?.data?.message || "Đã xảy ra lỗi");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa chi nhánh này?")) {
      try {
        await deleteStore(id).unwrap();
        refetch();
      } catch (err) {
        console.error('Lỗi khi xóa chi nhánh', err);
      }
    }
  };

  const handleAutoFill = () => {
    const randomNum = Math.floor(Math.random() * 100);
    const sampleStores = [
      {
        name: `Aura Beauty Quận 3 - Chi nhánh ${randomNum}`,
        region: 'hcm',
        regionLabel: 'TP. Hồ Chí Minh',
        address: `${randomNum} Cao Thắng, Phường 3, Quận 3, TP. Hồ Chí Minh`,
        phone: '028.3999.8888',
        hours: '08:30 - 22:00 (Hàng ngày)',
        mapUrl: 'https://maps.google.com/?q=Cao+Thắng+Quận+3+TP+Hồ+Chí+Minh',
        features: ['Tư vấn soi da', 'Spa chăm sóc da', 'Ưu đãi VIP'],
        status: 'active'
      },
      {
        name: `Aura Flagship Tây Hồ - Chi nhánh ${randomNum}`,
        region: 'hanoi',
        regionLabel: 'Hà Nội',
        address: `${randomNum} Xuân Diệu, Phường Quảng An, Quận Tây Hồ, Hà Nội`,
        phone: '024.3888.2222',
        hours: '09:00 - 22:00 (Hàng ngày)',
        mapUrl: 'https://maps.google.com/?q=Xuân+Diệu+Tây+Hồ+Hà+Nội',
        features: ['Mặt tiền hồ tây', 'Chỗ đậu xe hơi', 'Đầy đủ mẫu thử'],
        status: 'active'
      }
    ];
    
    const randomSample = sampleStores[Math.floor(Math.random() * sampleStores.length)];
    setFormData(randomSample);
  };

  return (
    <AdminLayout title="Quản lý Hệ thống Cửa hàng">
      <SEO pageTitle="Quản lý Hệ thống Cửa hàng" />

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem' }}>
        <button onClick={() => handleOpenModal()} className="admin-btn admin-btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Plus size={18} /> Thêm Cửa hàng Mới
        </button>
      </div>

      <div className="admin-content-card glass-panel">
        {isLoading ? (
          <div className="d-flex justify-content-center p-5">
            <Loader loading={isLoading} />
          </div>
        ) : isError ? (
          <div className="text-danger p-5 text-center">Lỗi tải dữ liệu cửa hàng.</div>
        ) : filteredStores.length === 0 ? (
          <div className="text-center p-5" style={{ color: 'var(--admin-text-sub)' }}>
            Không tìm thấy cửa hàng nào phù hợp.
          </div>
        ) : (
          <div style={{ overflowX: 'auto', width: '100%', WebkitOverflowScrolling: 'touch', borderRadius: '8px', border: '1px solid var(--admin-border)' }}>
            <table className="admin-table" style={{ width: '100%', minWidth: '1000px', tableLayout: 'fixed', margin: 0 }}>
              <colgroup>
                <col style={{ width: '240px' }} />
                <col style={{ width: '160px' }} />
                <col style={{ width: '420px' }} />
                <col style={{ width: '140px' }} />
                <col style={{ width: '120px' }} />
              </colgroup>
              <thead>
                <tr>
                  <th style={{ textAlign: 'left', padding: '1.2rem 1rem', fontWeight: 600, color: 'var(--admin-text-sub)' }}>Chi nhánh</th>
                  <th style={{ textAlign: 'center', padding: '1.2rem 1rem', fontWeight: 600, color: 'var(--admin-text-sub)' }}>Khu vực</th>
                  <th style={{ textAlign: 'left', padding: '1.2rem 1rem', fontWeight: 600, color: 'var(--admin-text-sub)' }}>Thông tin liên hệ & Địa chỉ</th>
                  <th style={{ textAlign: 'center', padding: '1.2rem 1rem', fontWeight: 600, color: 'var(--admin-text-sub)' }}>Trạng thái</th>
                  <th style={{ textAlign: 'center', padding: '1.2rem 1rem', fontWeight: 600, color: 'var(--admin-text-sub)' }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredStores.map((store) => (
                  <tr key={store._id} style={{ transition: 'background-color 0.2s' }}>
                    <td style={{ fontWeight: 600, color: 'var(--admin-text-main)', fontSize: '0.95rem', verticalAlign: 'middle', whiteSpace: 'normal', overflowWrap: 'break-word', lineHeight: '1.4', padding: '1.2rem 1rem' }}>
                      {store.name}
                    </td>
                    <td style={{ verticalAlign: 'middle', textAlign: 'center', padding: '1.2rem 1rem' }}>
                      <span style={{
                        fontSize: '11px',
                        fontWeight: '700',
                        textTransform: 'uppercase',
                        color: '#825a2c',
                        background: 'rgba(130, 90, 44, 0.08)',
                        padding: '5px 12px',
                        borderRadius: '30px',
                        display: 'inline-block',
                        whiteSpace: 'nowrap',
                        letterSpacing: '0.5px'
                      }}>
                        {store.regionLabel}
                      </span>
                    </td>
                    <td style={{ verticalAlign: 'middle', padding: '1.2rem 1rem' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                          <MapPin size={15} style={{ color: '#825a2c', flexShrink: 0, marginTop: '2px' }} />
                          <span style={{ color: 'var(--admin-text-main)', lineHeight: '1.4', whiteSpace: 'normal', overflowWrap: 'break-word' }}>{store.address}</span>
                        </div>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <Phone size={15} style={{ color: '#825a2c', flexShrink: 0 }} />
                          <span style={{ color: 'var(--admin-text-main)', fontWeight: '500' }}>{store.phone}</span>
                        </div>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <Clock size={15} style={{ color: 'var(--admin-text-sub)', flexShrink: 0 }} />
                          <span style={{ color: 'var(--admin-text-sub)' }}>{store.hours}</span>
                        </div>
                      </div>
                    </td>
                    <td style={{ verticalAlign: 'middle', textAlign: 'center', padding: '1.2rem 1rem' }}>
                      <span className={`admin-badge ${store.status?.toLowerCase() === 'inactive' ? 'admin-badge-danger' : 'admin-badge-success'}`} style={{
                        whiteSpace: 'nowrap',
                        borderRadius: '6px',
                        padding: '5px 12px',
                        fontSize: '11px',
                        fontWeight: '600',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        {store.status?.toLowerCase() === 'inactive' ? 'Tạm ẩn' : 'Hoạt động'}
                      </span>
                    </td>
                    <td style={{ verticalAlign: 'middle', textAlign: 'center', padding: '1.2rem 1rem' }}>
                      <div style={{ display: 'inline-flex', gap: '0.6rem', justifyContent: 'center' }}>
                        <button onClick={() => handleOpenModal(store)} className="admin-btn" style={{
                          padding: '8px',
                          background: 'rgba(130, 90, 44, 0.08)',
                          color: '#825a2c',
                          borderRadius: '6px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'all 0.2s',
                          cursor: 'pointer'
                        }} title="Chỉnh sửa">
                          <Edit size={16} />
                        </button>
                        <button onClick={() => handleDelete(store._id)} className="admin-btn" style={{
                          padding: '8px',
                          background: 'rgba(253, 75, 107, 0.08)',
                          color: 'var(--admin-danger)',
                          borderRadius: '6px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'all 0.2s',
                          cursor: 'pointer'
                        }} title="Xóa">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      }</div>

      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div className="glass-panel" style={{ background: '#fff', padding: '2rem', borderRadius: '12px', width: '100%', maxWidth: '600px', position: 'relative', maxHeight: '90vh', overflowY: 'auto' }}>
            <button onClick={handleCloseModal} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--admin-text-sub)' }}>
              <X size={24} />
            </button>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 600 }}>
                {editingStore ? 'Chỉnh sửa Cửa hàng' : 'Thêm mới Cửa hàng'}
              </h3>
              {!editingStore && (
                <button
                  type="button"
                  onClick={handleAutoFill}
                  className="admin-btn"
                  style={{ background: '#f59e0b', color: 'white', padding: '0.4rem 0.8rem', fontSize: '0.85rem', marginRight: '2rem' }}
                >
                  Auto Fill
                </button>
              )}
            </div>

            <div className="admin-form-group">
              <label>Tên cửa hàng / chi nhánh</label>
              <input
                type="text"
                className="admin-input-premium"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Aura Flagship Store Quận 1"
              />
            </div>

            <div className="row">
              <div className="col-md-6">
                <div className="admin-form-group">
                  <label>Khu vực thành phố</label>
                  <select
                    className="admin-input-premium"
                    value={formData.region}
                    onChange={handleRegionChange}
                  >
                    <option value="hcm">TP. Hồ Chí Minh</option>
                    <option value="hanoi">Hà Nội</option>
                    <option value="danang">Đà Nẵng</option>
                  </select>
                </div>
              </div>
              <div className="col-md-6">
                <div className="admin-form-group">
                  <label>Nhãn khu vực hiển thị</label>
                  <input
                    type="text"
                    className="admin-input-premium"
                    value={formData.regionLabel}
                    onChange={(e) => setFormData({ ...formData, regionLabel: e.target.value })}
                    placeholder="e.g. TP. Hồ Chí Minh"
                  />
                </div>
              </div>
            </div>

            <div className="admin-form-group">
              <label>Địa chỉ chi nhánh</label>
              <input
                type="text"
                className="admin-input-premium"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="e.g. 88 Đồng Khởi, Phường Bến Nghé, Quận 1"
              />
            </div>

            <div className="row">
              <div className="col-md-6">
                <div className="admin-form-group">
                  <label>Số điện thoại liên hệ</label>
                  <input
                    type="text"
                    className="admin-input-premium"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="e.g. 028.3822.8888"
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="admin-form-group">
                  <label>Giờ hoạt động</label>
                  <input
                    type="text"
                    className="admin-input-premium"
                    value={formData.hours}
                    onChange={(e) => setFormData({ ...formData, hours: e.target.value })}
                    placeholder="e.g. 08:30 - 22:00 (Hàng ngày)"
                  />
                </div>
              </div>
            </div>

            <div className="admin-form-group">
              <label>Đường dẫn Google Maps (mapUrl)</label>
              <input
                type="text"
                className="admin-input-premium"
                value={formData.mapUrl}
                onChange={(e) => setFormData({ ...formData, mapUrl: e.target.value })}
                placeholder="e.g. https://maps.google.com/?q=88+Đồng+Khởi"
              />
            </div>



            <div className="admin-form-group">
              <label>Trạng thái hiển thị</label>
              <select
                className="admin-input-premium"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="active">Hoạt động</option>
                <option value="inactive">Tạm ẩn</option>
              </select>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
              <button onClick={handleCloseModal} className="admin-btn" style={{ background: '#f1f5f9', color: '#475569' }}>Hủy</button>
              <button onClick={handleSave} className="admin-btn admin-btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Save size={18} /> Lưu Cửa hàng
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminStores;
