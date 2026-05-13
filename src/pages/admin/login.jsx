import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import SEO from '@/components/seo';
import logo from '@assets/img/logo/logo.svg';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // Simple mock logic for now, in a real app this would call the admin/login API
    setTimeout(() => {
      if (email === 'admin@gmail.com' && password === '123456') {
        router.push('/admin/dashboard');
      } else {
        alert('Invalid credentials');
        setLoading(false);
      }
    }, 1000);
  };

  return (
    <div className="admin-login-page" style={{ 
      background: 'var(--admin-bg)', 
      height: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      fontFamily: 'Outfit, sans-serif'
    }}>
      <SEO pageTitle="Admin Login" />
      <div className="glass-panel" style={{ 
        width: '440px', 
        padding: '3.5rem', 
        borderRadius: '1.5rem',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
        textAlign: 'center',
        background: '#ffffff'
      }}>
        <div className="admin-logo" style={{ justifyContent: 'center', padding: 0, marginBottom: '2rem' }}>
          <Image src={logo} alt="logo" width={140} />
        </div>
        <h2 style={{ color: 'var(--admin-text-main)', marginBottom: '0.5rem', fontSize: '1.5rem' }}>Welcome Back</h2>
        <p style={{ color: 'var(--admin-text-sub)', marginBottom: '2rem' }}>Please enter your credentials</p>
        
        <form onSubmit={handleSubmit} style={{ textAlign: 'left' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', color: 'var(--admin-text-sub)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Email Address</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@gmail.com"
              style={{ 
                width: '100%', 
                padding: '0.75rem 1rem', 
                borderRadius: '0.5rem', 
                background: '#F6F7F9', 
                border: '1px solid var(--admin-border)', 
                color: 'var(--admin-text-main)',
                outline: 'none'
              }} 
            />
          </div>
          <div style={{ marginBottom: '2rem' }}>
            <label style={{ display: 'block', color: 'var(--admin-text-sub)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{ 
                width: '100%', 
                padding: '0.75rem 1rem', 
                borderRadius: '0.5rem', 
                background: '#F6F7F9', 
                border: '1px solid var(--admin-border)', 
                color: 'var(--admin-text-main)',
                outline: 'none'
              }} 
            />
          </div>
          <button 
            type="submit" 
            className="admin-btn admin-btn-primary" 
            style={{ width: '100%', padding: '0.75rem', fontSize: '1rem' }}
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
