import React, { useState } from 'react';
import Image from 'next/image';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useGetAllProductsQuery } from '@/redux/features/productApi';
// internal
import Menus from './header-com/menus';
import logo from '@assets/img/logo/logo.png';
import useSticky from '@/hooks/use-sticky';
import useCartInfo from '@/hooks/use-cart-info';
import { openCartMini } from '@/redux/features/cartSlice';
import HeaderTopRight from './header-com/header-top-right';
import CartMiniSidebar from '@/components/common/cart-mini-sidebar';
import { CartTwo, Compare, Facebook, Menu, PhoneTwo, Wishlist, Search } from '@/svg';
import useSearchFormSubmit from '@/hooks/use-search-form-submit';
import OffCanvas from '@/components/common/off-canvas';

const HeaderTwo = ({ style_2 = false }) => {
  const { wishlist } = useSelector((state) => state.wishlist);
  const [isOffCanvasOpen, setIsCanvasOpen] = useState(false);
  const { setSearchText, handleSubmit, searchText } = useSearchFormSubmit();
  const { quantity } = useCartInfo();
  const { sticky } = useSticky();
  const dispatch = useDispatch();
  const router = useRouter();

  const { data: productsData, isLoading: isSearchLoading, isError: isSearchError } = useGetAllProductsQuery();
  const allProducts = productsData?.data || [];
  const searchResults = searchText.trim()
    ? allProducts.filter(prd => prd.title?.toLowerCase().includes(searchText.toLowerCase())).slice(0, 5)
    : [];

  const handleProductClick = (id) => {
    setSearchText("");
    router.push(`/product-details/${id}`);
  };
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        .tp-search-item {
          cursor: pointer;
          border-bottom: 1px solid rgba(0, 0, 0, 0.04);
          padding: 8px 10px;
          border-radius: 8px;
          background-color: transparent;
          transition: all 0.2s ease-in-out !important;
        }
        .tp-search-item:hover {
          background-color: #f7f5f2 !important;
          transform: translateX(4px);
        }
        .tp-search-item:last-child {
          border-bottom: none;
        }
        .text-truncate-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;  
          overflow: hidden;
        }
        .tp-search-results-dropdown::-webkit-scrollbar {
          width: 6px;
        }
        .tp-search-results-dropdown::-webkit-scrollbar-track {
          background: transparent;
        }
        .tp-search-results-dropdown::-webkit-scrollbar-thumb {
          background-color: rgba(0, 0, 0, 0.15);
          border-radius: 10px;
        }
      `}} />
      <header>
        <div className={`tp-header-area tp-header-style-${style_2 ? 'primary' : 'darkRed'} tp-header-height`}>
          <div className="tp-header-top-2 p-relative z-index-11 tp-header-top-border d-none d-md-block">
            <div className="container">
              <div className="row align-items-center">
                <div className="col-md-6">
                  <div className="tp-header-info d-flex align-items-center">
                    <div className="tp-header-info-item">
                      <a href="#">
                        <span>
                          <Facebook />
                        </span> 7.5tr Người theo dõi
                      </a>
                    </div>
                    <div className="tp-header-info-item">
                      <a href="tel:402-763-282-46">
                        <span>
                          <PhoneTwo />
                        </span> +(966) 595 035 008
                      </a>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="tp-header-top-right tp-header-top-black d-flex align-items-center justify-content-end">
                    <HeaderTopRight />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div id="header-sticky" className={`tp-header-bottom-2 tp-header-sticky ${sticky ? 'header-sticky' : ''}`}>
            <div className="container">
              <div className="tp-mega-menu-wrapper p-relative">
                <div className="row align-items-center">
                  <div className="col-xl-2 col-lg-5 col-md-5 col-sm-4 col-6">
                    <div className="logo">
                      <Link href="/">
                        <Image src={logo} alt="logo" priority />
                      </Link>
                    </div>
                  </div>
                  <div className="col-xl-6 d-none d-xl-block">
                    <div className="main-menu menu-style-2">
                      <nav className="tp-main-menu-content">
                        <Menus />
                      </nav>
                    </div>
                  </div>
                  <div className="col-xl-4 col-lg-7 col-md-7 col-sm-8 col-6">
                    <div className="tp-header-bottom-right d-flex align-items-center justify-content-end pl-30">
                      <div className="tp-header-search-2 d-none d-sm-block" style={{ position: 'relative' }}>
                        <form onSubmit={handleSubmit}>
                          <input
                            onChange={(e) => setSearchText(e.target.value)}
                            value={searchText}
                            type="text"
                            placeholder="Tìm kiếm sản phẩm..." />
                          <button type="submit">
                            <Search />
                          </button>
                        </form>

                        {/* Real-time search results dropdown */}
                        {searchText.trim() && (
                          <div className="tp-search-results-dropdown" style={{
                            position: 'absolute',
                            top: '100%',
                            left: '0',
                            width: '100%',
                            background: '#ffffff',
                            borderRadius: '12px',
                            boxShadow: '0 15px 35px rgba(0, 0, 0, 0.1)',
                            zIndex: 999,
                            marginTop: '10px',
                            padding: '15px',
                            border: '1px solid rgba(0, 0, 0, 0.05)',
                            maxHeight: '380px',
                            overflowY: 'auto'
                          }}>
                            {isSearchLoading && (
                              <div className="text-center py-3 text-muted">
                                <div className="spinner-border spinner-border-sm text-primary me-2" role="status" style={{ color: '#825a2c' }}></div>
                                <span>Đang tìm kiếm...</span>
                              </div>
                            )}
                            
                            {!isSearchLoading && isSearchError && (
                              <div className="text-center py-3 text-danger">Đã xảy ra lỗi khi tải sản phẩm.</div>
                            )}
                            
                            {!isSearchLoading && !isSearchError && searchResults.length === 0 && (
                              <div className="text-center py-3 text-muted">Không tìm thấy sản phẩm nào phù hợp.</div>
                            )}
                            
                            {!isSearchLoading && !isSearchError && searchResults.length > 0 && (
                              <div className="d-flex flex-column gap-2">
                                {searchResults.map((product) => {
                                  const { _id, img, title, price, discount } = product;
                                  const discountedPrice = discount > 0 ? price - (price * discount) / 100 : price;
                                  
                                  return (
                                    <div
                                      key={_id}
                                      onClick={() => handleProductClick(_id)}
                                      className="d-flex align-items-center gap-3 tp-search-item"
                                    >
                                      <div className="flex-shrink-0" style={{ width: '40px', height: '40px', position: 'relative' }}>
                                        <img
                                          src={img}
                                          alt={title}
                                          style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover',
                                            borderRadius: '6px'
                                          }}
                                        />
                                      </div>
                                      <div className="flex-grow-1 text-start">
                                        <h4 style={{
                                          fontSize: '13px',
                                          fontWeight: '500',
                                          color: '#1a1a1a',
                                          margin: '0 0 2px 0',
                                          lineHeight: '1.3'
                                        }} className="text-truncate-2">
                                          {title}
                                        </h4>
                                        <div className="d-flex align-items-center gap-2">
                                          <span style={{ fontSize: '13px', fontWeight: '600', color: '#825a2c' }}>
                                            ${discountedPrice.toFixed(2)}
                                          </span>
                                          {discount > 0 && (
                                            <span style={{ fontSize: '11px', textDecoration: 'line-through', color: '#a0a0a0' }}>
                                              ${price.toFixed(2)}
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="tp-header-action d-flex align-items-center ml-30">
                        <div className="tp-header-action-item d-none d-lg-block">
                          <Link href="/compare" className="tp-header-action-btn">
                            <Compare />
                          </Link>
                        </div>
                        <div className="tp-header-action-item d-none d-lg-block">
                          <Link href="/wishlist" className="tp-header-action-btn">
                            <Wishlist />
                            <span className="tp-header-action-badge">{wishlist.length}</span>
                          </Link>
                        </div>
                        <div className="tp-header-action-item">
                          <button onClick={() => dispatch(openCartMini())} className="tp-header-action-btn cartmini-open-btn" >
                            <CartTwo />
                            <span className="tp-header-action-badge">{quantity}</span>
                          </button>
                        </div>
                        <div className="tp-header-action-item tp-header-hamburger mr-20 d-xl-none">
                          <button onClick={() => setIsCanvasOpen(true)} type="button" className="tp-offcanvas-open-btn">
                            <Menu />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* cart mini sidebar start */}
      <CartMiniSidebar />
      {/* cart mini sidebar end */}

      {/* off canvas start */}
      <OffCanvas isOffCanvasOpen={isOffCanvasOpen} setIsCanvasOpen={setIsCanvasOpen} categoryType="fashion" />
      {/* off canvas end */}
    </>
  );
};

export default HeaderTwo;
