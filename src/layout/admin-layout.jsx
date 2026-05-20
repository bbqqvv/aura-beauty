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
  Tag,
  ClipboardList,
  FileText,
  Star,
  MapPin
} from 'lucide-react';

export const adminSearchEvent = typeof window !== 'undefined' ? new EventTarget() : null;

const AdminLayout = ({ children, title }) => {
  const router = useRouter();
  const { user } = useSelector((state) => state.auth);
  const [searchTerm, setSearchTerm] = React.useState('');
  const dispatch = useDispatch();

  React.useEffect(() => {
    if (adminSearchEvent) {
      adminSearchEvent.dispatchEvent(new CustomEvent('search', { detail: searchTerm }));
    }
  }, [searchTerm]);

  React.useEffect(() => {
    if (user) {
      const isAdmin = user.role?.toLowerCase() === 'admin';
      if (!isAdmin) {
        router.push('/');
      }
    } else {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('redirect_path', router.asPath);
      }
      router.push('/login');
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

  const navGroups = [
    {
      title: 'Hệ thống',
      items: [
        { title: 'Tổng quan', link: '/admin/dashboard', icon: <LayoutDashboard size={20} /> },
      ]
    },
    {
      title: 'Bán hàng',
      items: [
        { title: 'Đơn hàng', link: '/admin/orders', icon: <ClipboardList size={20} /> },
        { title: 'Khách hàng', link: '/admin/users', icon: <Users size={20} /> },
      ]
    },
    {
      title: 'Sản phẩm',
      items: [
        { title: 'Sản phẩm', link: '/admin/products', icon: <ShoppingBag size={20} /> },
        { title: 'Danh mục', link: '/admin/categories', icon: <FolderTree size={20} /> },
        { title: 'Thương hiệu', link: '/admin/brands', icon: <Tag size={20} /> },
        { title: 'Kho hàng', link: '/admin/inventory', icon: <Package size={20} /> },
      ]
    },
    {
      title: 'Nội dung',
      items: [
        { title: 'Khuyến mãi', link: '/admin/coupons', icon: <Ticket size={20} /> },
        { title: 'Bài viết (Blog)', link: '/admin/blogs', icon: <FileText size={20} /> },
        { title: 'Đánh giá', link: '/admin/reviews', icon: <Star size={20} /> },
        { title: 'Cửa hàng', link: '/admin/stores', icon: <MapPin size={20} /> },
      ]
    }
  ];

  return (
    <div className="admin-layout">
      <style jsx global>{`
        .admin-nav-item {
          border-left: none !important;
          border-radius: 8px;
          margin: 0.15rem 0.75rem;
          padding: 0.6rem 1rem !important;
          font-weight: 500;
          transition: all 0.2s ease;
        }
        .admin-nav-item:hover {
          background: #f8fafc !important;
          color: var(--admin-accent) !important;
          transform: translateX(4px);
        }
        .admin-nav-item.active {
          background: rgba(9, 137, 255, 0.1) !important;
          color: var(--admin-accent) !important;
        }
        .admin-nav-item.active .admin-nav-icon {
          color: var(--admin-accent);
        }
        /* Ẩn scrollbar xấu xí của thanh điều hướng */
        .admin-nav::-webkit-scrollbar {
          width: 0px;
          background: transparent;
        }
        .admin-nav {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
      `}</style>
      <aside className="admin-sidebar" style={{ borderRight: '1px solid #f1f5f9', boxShadow: '2px 0 10px rgba(0,0,0,0.02)' }}>
        <div className="admin-logo" style={{ marginBottom: '2rem', marginTop: '0.5rem' }}>
          <Link href="/">
            <Image src={logo} alt="logo" width={120} />
          </Link>
        </div>
        <nav className="admin-nav" style={{ overflowY: 'auto' }}>
          {navGroups.map((group, idx) => (
            <div key={idx} style={{ marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 0.5rem 1.25rem' }}>
                {group.title}
              </div>
              {group.items.map((item) => (
                <Link 
                  key={item.link} 
                  href={item.link}
                  className={`admin-nav-item ${router.pathname === item.link ? 'active' : ''}`}
                >
                  <span className="admin-nav-icon" style={{ opacity: router.pathname === item.link ? 1 : 0.7 }}>{item.icon}</span> 
                  <span className="admin-nav-text">{item.title}</span>
                </Link>
              ))}
            </div>
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
        <header className="admin-header" style={{ padding: '0.75rem 2rem' }}>
          <div>
            <h1 className="admin-page-title" style={{ margin: 0, fontSize: '1.25rem', letterSpacing: '-0.02em', color: 'var(--admin-text-main)' }}>{title}</h1>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div className="admin-search" style={{ position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={`Tìm kiếm trong ${title}...`} 
                style={{ 
                  padding: '0 1rem 0 2.75rem', 
                  fontSize: '0.85rem',
                  height: '40px',
                  borderRadius: '20px', 
                  border: '1px solid var(--admin-border)', 
                  background: '#f8fafc',
                  outline: 'none',
                  width: '300px',
                  transition: 'all 0.3s ease',
                  color: 'var(--admin-text-main)'
                }}
                onFocus={(e) => {
                  e.target.style.background = '#ffffff';
                  e.target.style.borderColor = 'var(--admin-accent)';
                  e.target.style.boxShadow = '0 0 0 4px rgba(9, 137, 255, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.background = '#f8fafc';
                  e.target.style.borderColor = 'var(--admin-border)';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <button 
                style={{ background: '#f8fafc', border: '1px solid var(--admin-border)', color: 'var(--admin-text-sub)', cursor: 'pointer', position: 'relative', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s ease' }} 
                onMouseOver={e => { e.currentTarget.style.background = '#f1f5f9'; e.currentTarget.style.color = 'var(--admin-accent)'; }} 
                onMouseOut={e => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.color = 'var(--admin-text-sub)'; }}
              >
                <Bell size={18} />
                <span style={{ position: 'absolute', top: 8, right: 8, background: 'var(--admin-danger)', border: '2px solid #fff', width: 10, height: 10, borderRadius: '50%' }}></span>
              </button>
              
              <div style={{ height: '24px', width: '1px', background: 'var(--admin-border)', margin: '0 0.25rem' }}></div>
              
              <div className="admin-user-info" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', padding: '0.35rem 0.5rem 0.35rem 1rem', borderRadius: '30px', transition: 'background 0.2s', border: '1px solid transparent' }} onMouseOver={e => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.borderColor = 'var(--admin-border)'; }} onMouseOut={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'transparent'; }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                  <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--admin-text-main)', lineHeight: '1.2' }}>Quản trị viên</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--admin-text-sub)' }}>Admin Aura</span>
                </div>
                <img src="https://i.ibb.co/wpjNftS/user-2.jpg" alt="Admin" style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #fff', boxShadow: '0 2px 6px rgba(0,0,0,0.08)' }} />
              </div>
            </div>
          </div>
        </header>
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
