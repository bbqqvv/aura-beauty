import React, { useState, useEffect } from 'react';
import AdminLayout, { adminSearchEvent } from '@/layout/admin-layout';
import SEO from '@/components/seo';
import { Eye, CheckCircle, Clock, Truck, X } from 'lucide-react';
import { useGetAllOrdersQuery, useUpdateOrderStatusMutation } from '@/redux/features/order/orderApi';
import Loader from '@/components/loader/loader';
import dayjs from 'dayjs';
import InfiniteScroll from 'react-infinite-scroll-component';

const AdminOrders = () => {
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

  const { data, isLoading, isError, refetch } = useGetAllOrdersQuery({ 
    page, 
    limit: 15, 
    searchTerm: searchTerm 
  });
  const [updateOrderStatus] = useUpdateOrderStatusMutation();

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

  const filteredOrders = items;

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const updateStatus = async (id, newStatus) => {
    try {
      await updateOrderStatus({ id, status: newStatus }).unwrap();
      setItems(prev => prev.map(o => o._id === id ? { ...o, status: newStatus } : o));
    } catch (err) {
      console.error('Lỗi khi cập nhật trạng thái', err);
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return <Clock size={16} />;
      case 'processing': return <Truck size={16} />;
      case 'delivered': return <CheckCircle size={16} />;
      default: return null;
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return 'var(--admin-warning)';
      case 'processing': return 'var(--admin-accent)';
      case 'delivered': return 'var(--admin-success)';
      default: return 'inherit';
    }
  };

  const getStatusBgColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return 'rgba(255, 179, 66, 0.1)';
      case 'processing': return 'rgba(9, 137, 255, 0.1)';
      case 'delivered': return 'rgba(49, 183, 87, 0.1)';
      default: return 'transparent';
    }
  };

  return (
    <AdminLayout title="Quản lý Đơn hàng">
      <SEO pageTitle="Quản lý Đơn hàng" />

      <div className="admin-content-card glass-panel" style={{ padding: 0, overflow: 'hidden' }}>
        <InfiniteScroll
          dataLength={filteredOrders.length}
          next={fetchMoreData}
          hasMore={hasMore}
          loader={<div className="text-center p-3"><Loader loading={true} /></div>}
          endMessage={<div className="text-center p-3 text-muted">Đã hiển thị toàn bộ đơn hàng</div>}
          scrollThreshold={0.9}
        >
          <table className="admin-table">
            <thead>
              <tr>
                <th>Mã Đơn</th>
                <th>Ngày đặt</th>
                <th>Khách hàng</th>
                <th>Sản phẩm</th>
                <th>Tổng tiền</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order._id}>
                  <td style={{ fontWeight: 500 }}>{order._id.slice(-6).toUpperCase()}</td>
                  <td style={{ color: 'var(--admin-text-sub)' }}>{dayjs(order.createdAt).format('MMM D, YYYY')}</td>
                  <td>{order.name}</td>
                  <td>{order.cart?.length || 0}</td>
                  <td style={{ fontWeight: 500 }}>${order.totalAmount}</td>
                  <td>
                    <span className="admin-badge" style={{ 
                      display: 'inline-flex', 
                      alignItems: 'center', 
                      gap: '0.25rem',
                      color: order.status?.toLowerCase() === 'cancel' ? 'var(--admin-danger)' : getStatusColor(order.status),
                      background: order.status?.toLowerCase() === 'cancel' ? 'rgba(253, 75, 107, 0.1)' : getStatusBgColor(order.status)
                    }}>
                      {order.status?.toLowerCase() === 'cancel' ? <X size={16} /> : getStatusIcon(order.status)} 
                      {order.status?.toLowerCase() === 'pending' ? 'Chờ xử lý' : 
                       order.status?.toLowerCase() === 'processing' ? 'Đang xử lý' : 
                       order.status?.toLowerCase() === 'delivered' ? 'Đã giao' : 
                       order.status?.toLowerCase() === 'cancel' ? 'Đã hủy' : order.status}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <button onClick={() => handleViewDetails(order)} className="admin-btn" style={{ padding: '0.4rem', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--admin-accent)' }} title="Xem chi tiết">
                        <Eye size={16} />
                      </button>
                      {order.status?.toLowerCase() === 'pending' && (
                        <>
                          <button onClick={() => updateStatus(order._id, 'processing')} className="admin-btn" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', background: 'var(--admin-accent)', color: 'white', borderRadius: '4px' }}>
                            Xử lý
                          </button>
                          <button onClick={() => window.confirm('Bạn có chắc muốn hủy đơn hàng này?') && updateStatus(order._id, 'cancel')} className="admin-btn" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', background: 'var(--admin-danger)', color: 'white', borderRadius: '4px' }}>
                            Hủy
                          </button>
                        </>
                      )}
                      {order.status?.toLowerCase() === 'processing' && (
                        <>
                          <button onClick={() => updateStatus(order._id, 'pending')} className="admin-btn" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', background: '#e2e8f0', color: '#475569', borderRadius: '4px' }} title="Quay lại Chờ xử lý">
                            Hoàn tác
                          </button>
                          <button onClick={() => updateStatus(order._id, 'delivered')} className="admin-btn" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', background: 'var(--admin-success)', color: 'white', borderRadius: '4px' }}>
                            Đã giao
                          </button>
                          <button onClick={() => window.confirm('Bạn có chắc muốn hủy đơn hàng này?') && updateStatus(order._id, 'cancel')} className="admin-btn" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', background: 'var(--admin-danger)', color: 'white', borderRadius: '4px' }}>
                            Hủy
                          </button>
                        </>
                      )}
                      {order.status?.toLowerCase() === 'delivered' && (
                        <button onClick={() => updateStatus(order._id, 'processing')} className="admin-btn" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', background: '#e2e8f0', color: '#475569', borderRadius: '4px' }} title="Quay lại Đang xử lý">
                          Hoàn tác
                        </button>
                      )}
                      {order.status?.toLowerCase() === 'cancel' && (
                        <button onClick={() => updateStatus(order._id, 'pending')} className="admin-btn" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', background: '#e2e8f0', color: '#475569', borderRadius: '4px' }} title="Khôi phục về Chờ xử lý">
                          Khôi phục
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </InfiniteScroll>
      </div>

      {isModalOpen && selectedOrder && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div className="glass-panel" style={{ background: '#fff', padding: '2rem', width: '100%', maxWidth: '700px', borderRadius: '12px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--admin-border)', paddingBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Chi tiết Đơn hàng: #{selectedOrder._id.slice(-6).toUpperCase()}</h3>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--admin-text-sub)' }}><X size={24} /></button>
            </div>
            
            {/* Cập nhật trạng thái đơn hàng */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between', 
              background: '#f8fafc', 
              padding: '1rem 1.5rem', 
              borderRadius: '8px', 
              marginBottom: '1.5rem',
              border: '1px solid var(--admin-border)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontWeight: 600, color: 'var(--admin-text-main)' }}>Trạng thái hiện tại:</span>
                <span className="admin-badge" style={{ 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  gap: '0.25rem',
                  color: selectedOrder.status?.toLowerCase() === 'cancel' ? 'var(--admin-danger)' : getStatusColor(selectedOrder.status),
                  background: selectedOrder.status?.toLowerCase() === 'cancel' ? 'rgba(253, 75, 107, 0.1)' : getStatusBgColor(selectedOrder.status),
                  fontSize: '0.8rem',
                  padding: '0.25rem 0.5rem'
                }}>
                  {selectedOrder.status?.toLowerCase() === 'cancel' ? <X size={14} /> : getStatusIcon(selectedOrder.status)} 
                  {selectedOrder.status?.toLowerCase() === 'pending' ? 'Chờ xử lý' : 
                   selectedOrder.status?.toLowerCase() === 'processing' ? 'Đang xử lý' : 
                   selectedOrder.status?.toLowerCase() === 'delivered' ? 'Đã giao' : 
                   selectedOrder.status?.toLowerCase() === 'cancel' ? 'Đã hủy' : selectedOrder.status}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--admin-text-sub)', fontWeight: 500 }}>Thay đổi trạng thái:</span>
                <select 
                  value={selectedOrder.status} 
                  onChange={async (e) => {
                    const newStatus = e.target.value;
                    await updateStatus(selectedOrder._id, newStatus);
                    setSelectedOrder(prev => ({ ...prev, status: newStatus }));
                  }}
                  style={{
                    padding: '0.4rem 1.5rem 0.4rem 0.75rem',
                    borderRadius: '6px',
                    border: '1px solid var(--admin-border)',
                    outline: 'none',
                    fontWeight: '500',
                    fontSize: '0.85rem',
                    color: 'var(--admin-text-main)',
                    backgroundColor: '#ffffff',
                    cursor: 'pointer'
                  }}
                >
                  <option value="pending">Chờ xử lý</option>
                  <option value="processing">Đang xử lý</option>
                  <option value="delivered">Đã giao</option>
                  <option value="cancel">Đã hủy</option>
                </select>
              </div>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
              <div>
                <h4 style={{ fontWeight: 600, marginBottom: '0.5rem', color: 'var(--admin-text-sub)', fontSize: '0.9rem' }}>Thông tin khách hàng</h4>
                <p><strong>Tên:</strong> {selectedOrder.name}</p>
                <p><strong>Email:</strong> {selectedOrder.email}</p>
                <p><strong>Điện thoại:</strong> {selectedOrder.contactNo}</p>
              </div>
              <div>
                <h4 style={{ fontWeight: 600, marginBottom: '0.5rem', color: 'var(--admin-text-sub)', fontSize: '0.9rem' }}>Địa chỉ giao hàng</h4>
                <p>{selectedOrder.address}</p>
                <p>{selectedOrder.city}, {selectedOrder.country}</p>
                <p>Mã bưu điện: {selectedOrder.zipCode}</p>
              </div>
            </div>

            <div>
              <h4 style={{ fontWeight: 600, marginBottom: '1rem', color: 'var(--admin-text-sub)', fontSize: '0.9rem' }}>Sản phẩm</h4>
              <div style={{ border: '1px solid var(--admin-border)', borderRadius: '8px', overflow: 'hidden' }}>
                <table className="admin-table" style={{ margin: 0 }}>
                  <thead style={{ background: '#f8fafc' }}>
                    <tr>
                      <th style={{ padding: '0.75rem 1rem' }}>Sản phẩm</th>
                      <th style={{ padding: '0.75rem 1rem' }}>Đơn giá</th>
                      <th style={{ padding: '0.75rem 1rem' }}>SL</th>
                      <th style={{ padding: '0.75rem 1rem' }}>Thành tiền</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrder.cart?.map((item, index) => (
                      <tr key={index}>
                        <td style={{ padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <img src={item.img} alt={item.title} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                          <span style={{ fontSize: '0.9rem' }}>{item.title}</span>
                        </td>
                        <td style={{ padding: '0.75rem 1rem' }}>${item.price}</td>
                        <td style={{ padding: '0.75rem 1rem' }}>{item.orderQuantity}</td>
                        <td style={{ padding: '0.75rem 1rem', fontWeight: 500 }}>${item.price * item.orderQuantity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
              <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '8px', minWidth: '250px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ color: 'var(--admin-text-sub)' }}>Tạm tính:</span>
                  <span style={{ fontWeight: 500 }}>${selectedOrder.totalAmount - (selectedOrder.shippingCost || 0)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid var(--admin-border)', paddingBottom: '1rem' }}>
                  <span style={{ color: 'var(--admin-text-sub)' }}>Phí giao hàng:</span>
                  <span style={{ fontWeight: 500 }}>${selectedOrder.shippingCost || 0}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem' }}>
                  <strong>Tổng cộng:</strong>
                  <strong style={{ color: 'var(--admin-accent)' }}>${selectedOrder.totalAmount}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminOrders;
