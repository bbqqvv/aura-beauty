import { useEffect } from 'react';
import { useRouter } from 'next/router';

const AdminLogin = () => {
  const router = useRouter();
  useEffect(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('redirect_path', '/admin/dashboard');
    }
    router.push('/login');
  }, [router]);

  return null;
};

export default AdminLogin;
