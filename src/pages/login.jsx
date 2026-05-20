import React from 'react';
import SEO from '@/components/seo';
import HeaderTwo from '@/layout/headers/header-2';
import Footer from '@/layout/footers/footer';
import Wrapper from '@/layout/wrapper';
import CommonBreadcrumb from '@/components/breadcrumb/common-breadcrumb';
import LoginArea from '@/components/login-register/login-area';

import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

const LoginPage = () => {
  const { user } = useSelector((state) => state.auth);
  const router = useRouter();
  const { redirect } = router.query;

  useEffect(() => {
    if (user) {
      const storedRedirect = typeof window !== 'undefined' ? sessionStorage.getItem('redirect_path') : null;
      if (storedRedirect) {
        if (typeof window !== 'undefined') {
          sessionStorage.removeItem('redirect_path');
        }
        router.push(storedRedirect);
      } else {
        router.push(redirect || '/');
      }
    }
  }, [user, router, redirect]);

  if (user) return null;

  return (
    <Wrapper>
      <SEO pageTitle="Đăng nhập" />
      <HeaderTwo style_2={true} />
      <CommonBreadcrumb title="Đăng nhập" subtitle="Đăng nhập" center={true} />
      <LoginArea/>
      <Footer primary_style={true} />
    </Wrapper>
  );
};

export default LoginPage;