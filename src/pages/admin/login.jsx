import { useEffect } from 'react';
import { useRouter } from 'next/router';

const AdminLogin = () => {
  const router = useRouter();
  useEffect(() => {
    router.push('/login?redirect=/admin/dashboard');
  }, [router]);

  return null;
};

export default AdminLogin;
