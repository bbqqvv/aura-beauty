import React from 'react';
import SEO from '@/components/seo';
import HeaderTwo from '@/layout/headers/header-2';
import Footer from '@/layout/footers/footer';
import Wrapper from '@/layout/wrapper';
import CartArea from '@/components/cart-wishlist/cart-area';
import CommonBreadcrumb from '@/components/breadcrumb/common-breadcrumb';

const CartPage = () => {
  return (
    <Wrapper>
      <SEO pageTitle="Giỏ hàng" />
      <HeaderTwo style_2={true} />
      <CommonBreadcrumb title="Giỏ hàng" subtitle="Giỏ hàng" />
      <CartArea/>
      <Footer primary_style={true} />
    </Wrapper>
  );
};

export default CartPage;