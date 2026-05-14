import React from 'react';
import Link from 'next/link';
import AdminLayout from '@/layout/admin-layout';
import SEO from '@/components/seo';
import { 
  DollarSign, 
  ShoppingCart, 
  Users, 
  Package, 
  TrendingUp, 
  TrendingDown 
} from 'lucide-react';

const StatCard = ({ label, value, icon: Icon, trend }) => (
  <div className="admin-stat-card glass-panel">
    <div className="admin-stat-label">{label}</div>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div className="admin-stat-value">{value}</div>
      <div style={{ color: 'var(--admin-accent)', opacity: 0.8 }}><Icon size={28} /></div>
    </div>
    <div style={{ 
      fontSize: '0.8rem', 
      marginTop: '0.8rem', 
      display: 'flex', 
      alignItems: 'center', 
      gap: '0.25rem',
      color: trend > 0 ? 'var(--admin-success)' : 'var(--admin-danger)' 
    }}>
      {trend > 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />} 
      <span>{Math.abs(trend)}% so với tháng trước</span>
    </div>
  </div>
);

import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';

import { useGetDashboardStatsQuery } from '@/redux/features/dashboardApi';
import Loader from '@/components/loader/loader';

const COLORS = ['#0989FF', '#31B757', '#FFB342', '#FD4B6B'];

const Dashboard = () => {
  const { data, isLoading, isError } = useGetDashboardStatsQuery();

  if (isLoading) return <AdminLayout title="Tổng quan Dashboard"><div className="d-flex justify-content-center p-5" style={{marginTop: '100px'}}><Loader loading={isLoading} /></div></AdminLayout>;
  if (isError) return <AdminLayout title="Tổng quan Dashboard"><div className="text-danger p-5 text-center">Lỗi tải dữ liệu.</div></AdminLayout>;

  const stats = data?.data || {};
  const revenueData = stats.revenueData || [];
  const categoryData = stats.categoryData || [];
  const recentOrders = stats.recentOrders || [];

  return (
    <AdminLayout title="Tổng quan Dashboard">
      <SEO pageTitle="Dashboard Quản trị" />
      
      <div className="admin-stats-grid">
        <StatCard label="Tổng Doanh Thu" value={`$${stats.totalRevenue?.toLocaleString() || 0}`} icon={DollarSign} trend={12.5} />
        <StatCard label="Tổng Đơn Hàng" value={stats.totalOrders?.toLocaleString() || 0} icon={ShoppingCart} trend={8.2} />
        <StatCard label="Khách Hàng Hoạt Động" value={stats.activeCustomers?.toLocaleString() || 0} icon={Users} trend={-2.4} />
        <StatCard label="Sản Phẩm Đã Bán" value={stats.productsSold?.toLocaleString() || 0} icon={Package} trend={15.3} />
      </div>

      <div className="admin-charts-grid">
        <div className="admin-content-card glass-panel">
          <h3 style={{ marginBottom: '1.5rem', fontSize: '1.2rem', fontWeight: 600 }}>Tổng quan Doanh thu</h3>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#EAEBED" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--admin-text-sub)' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--admin-text-sub)' }} dx={-10} />
                <Tooltip cursor={{ fill: 'rgba(9, 137, 255, 0.05)' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                <Bar dataKey="revenue" fill="var(--admin-accent)" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="admin-content-card glass-panel">
          <h3 style={{ marginBottom: '1.5rem', fontSize: '1.2rem', fontWeight: 600 }}>Doanh số theo Danh mục</h3>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '0.85rem' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="admin-content-card glass-panel">
        <h3 style={{ marginBottom: '1.5rem' }}>Đơn hàng Gần đây</h3>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Mã đơn</th>
              <th>Khách hàng</th>
              <th>Trạng thái</th>
              <th>Tổng tiền</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {recentOrders.length === 0 && (
              <tr><td colSpan="5" className="text-center py-4">Không tìm thấy đơn hàng nào gần đây</td></tr>
            )}
            {recentOrders.map((order) => (
              <tr key={order._id}>
                <td>#{order._id?.slice(-6).toUpperCase()}</td>
                <td>{order.name || order.user?.name || 'Khách'}</td>
                <td>
                  <span className={`admin-badge ${order.status === 'delivered' ? 'admin-badge-success' : 'admin-badge-warning'}`}>
                    {order.status === 'pending' ? 'Chờ xử lý' : order.status === 'processing' ? 'Đang xử lý' : order.status === 'delivered' ? 'Đã giao' : order.status}
                  </span>
                </td>
                <td>${order.totalAmount?.toLocaleString() || 0}</td>
                <td>
                  <Link href="/admin/orders">
                    <button className="admin-btn admin-btn-primary" style={{ padding: '0.25rem 0.75rem', fontSize: '0.8rem' }}>
                      Chi tiết
                    </button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
