import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { userLoggedOut } from '@/redux/features/auth/authSlice';
import Image from 'next/image';
import logo from '@assets/img/logo/logo.svg';

import { 
  LayoutDashboard, 
  ShoppingBag, 
  FolderTree, 
  Package, 
  Users, 
  Ticket,
  LogOut,
  Bell,
  Search,
  Tag
} from 'lucide-react';

export const AdminSearchContext = React.createContext('');

const AdminLayout = ({ children, title }) => {
  const router = useRouter();
  const { user } = useSelector((state) => state.auth);
  const [searchTerm, setSearchTerm] = React.useState('');
  const dispatch = useDispatch();

  React.useEffect(() => {
    if (user) {
      const isAdmin = user.role?.toLowerCase() === 'admin';
      if (!isAdmin) {
        router.push('/');
      }
    } else {
      router.push('/login?redirect=' + router.asPath);
    }
  }, [user, router]);

  const isAdmin = user?.role?.toLowerCase() === 'admin';

  if (!user || !isAdmin) {
    return null;
  }

  const handleLogout = () => {
    dispatch(userLoggedOut());
    router.push('/login');
  }

  const navItems = [
    { title: 'Tổng quan', link: '/admin/dashboard', icon: <LayoutDashboard size={20} /> },
    { title: 'Sản phẩm', link: '/admin/products', icon: <ShoppingBag size={20} /> },
    { title: 'Thương hiệu', link: '/admin/brands', icon: <Tag size={20} /> },
    { title: 'Danh mục', link: '/admin/categories', icon: <FolderTree size={20} /> },
    { title: 'Kho hàng', link: '/admin/inventory', icon: <Package size={20} /> },
    { title: 'Đơn hàng', link: '/admin/orders', icon: <Package size={20} /> },
    { title: 'Khách hàng', link: '/admin/users', icon: <Users size={20} /> },
    { title: 'Khuyến mãi', link: '/admin/coupons', icon: <Ticket size={20} /> },
  ];

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-logo">
          <Link href="/">
            <Image src={logo} alt="logo" width={120} />
          </Link>
        </div>
        <nav className="admin-nav">
          {navItems.map((item) => (
            <Link 
              key={item.link} 
              href={item.link}
              className={`admin-nav-item ${router.pathname === item.link ? 'active' : ''}`}
            >
              <span className="admin-nav-icon">{item.icon}</span> 
              <span className="admin-nav-text">{item.title}</span>
            </Link>
          ))}
        </nav>
        <div className="admin-nav-footer" style={{ padding: '0 2rem' }}>
          <button 
            onClick={handleLogout}
            className="admin-btn admin-btn-danger" 
            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
          >
            <LogOut size={18} /> <span className="admin-nav-text">Đăng xuất</span>
          </button>
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <h1 className="admin-page-title">{title}</h1>
            <div className="admin-search" style={{ position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--admin-text-sub)' }} />
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm kiếm..." 
                style={{ 
                  padding: '0 0.8rem 0 2rem', 
                  fontSize: '0.8rem',
                  height: '30px',
                  borderRadius: '4px', 
                  border: '1px solid var(--admin-border)', 
                  background: 'var(--admin-bg)',
                  outline: 'none',
                  width: '100%',
                  maxWidth: '160px'
                }} 
              />
            </div>
          </div>
          <div className="admin-header-right" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ color: 'var(--admin-text-sub)', cursor: 'pointer', position: 'relative' }}>
              <Bell size={22} />
              <span style={{ position: 'absolute', top: -2, right: -2, background: 'var(--admin-danger)', width: 8, height: 8, borderRadius: '50%' }}></span>
            </div>
            <div className="admin-user-info" style={{ borderLeft: '1px solid var(--admin-border)', paddingLeft: '1.5rem' }}>
              <span style={{ fontWeight: 500 }}>Quản trị viên</span>
              <img src="https://i.ibb.co/wpjNftS/user-2.jpg" alt="Admin" style={{ width: '30px', height: '30px', borderRadius: '50%', marginLeft: '0.8rem' }} />
            </div>
          </div>
        </header>
        <AdminSearchContext.Provider value={searchTerm}>
          {children}
        </AdminSearchContext.Provider>
      </main>
    </div>
  );
};

export default AdminLayout;
