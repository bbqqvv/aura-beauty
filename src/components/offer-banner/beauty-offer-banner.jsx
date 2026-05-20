import React, { useState, useEffect } from 'react';
import { useTimer } from 'react-timer-hook';
import { ArrowRightSmTwo } from '@/svg';
import collection_thumb from '@assets/img/product/collection/collection-1.jpg';
import collection_thumb_2 from '@assets/img/product/collection/collection-2.jpg';
import Timer from '../common/timer';
import Link from 'next/link';
import { useGetOfferCouponsQuery } from '@/redux/features/coupon/couponApi';

const BeautyOfferBanner = () => {
  const { data: couponsResponse, isLoading, isError } = useGetOfferCouponsQuery();
  const [targetDate, setTargetDate] = useState(null);

  const { seconds, minutes, hours, days, restart } = useTimer({
    expiryTimestamp: new Date(),
    autoStart: false,
  });

  const coupons = Array.isArray(couponsResponse) ? couponsResponse : (couponsResponse?.data || []);

  // Lọc coupon active thuộc loại beauty và chưa hết hạn
  const activeCoupon = coupons
    .filter(c => c.status === 'active' && c.productType === 'beauty' && new Date(c.endTime) > new Date())
    .sort((a, b) => b.discountPercentage - a.discountPercentage || new Date(b.createdAt) - new Date(a.createdAt))[0];

  useEffect(() => {
    if (activeCoupon) {
      const expiry = new Date(activeCoupon.endTime);
      setTargetDate(expiry);
      restart(expiry);
    } else {
      setTargetDate(null);
    }
  }, [couponsResponse]);

  // Nếu không có mã nào hoạt động, ẩn toàn bộ banner khỏi trang chủ
  if (isLoading || isError || !activeCoupon || !targetDate) {
    return null;
  }

  return (
    <>
      <section className="tp-collection-area pt-120">
        <div className="container">
            <div className="row gx-2 gy-2 gy-md-0">
              <div className="col-xl-7 col-md-6">
                  <div className="tp-collection-item tp-collection-height grey-bg p-relative z-index-1 fix">
                    <div className="tp-collection-thumb include-bg include-bg transition-3" 
                    style={{backgroundImage:`url(${collection_thumb.src})`}}></div>
                    <div className="tp-collection-content">
                        <span>Bộ sưu tập Mỹ phẩm</span>
                        <h3 className="tp-collection-title">
                          <Link href="/shop">Kem nền và <br/> cọ đánh phấn</Link>
                        </h3>
                        <div className="tp-collection-btn">
                          <Link href="/shop" className="tp-btn">
                              Khám phá ngay 
                              {" "}<ArrowRightSmTwo/>
                          </Link>
                        </div>
                    </div>
                  </div>
              </div>
              <div className="col-xl-5 col-md-6">
                  <div className="tp-collection-item tp-collection-height grey-bg p-relative z-index-1 fix">
                    <div className="tp-collection-thumb has-overlay include-bg transition-3" style={{backgroundImage:`url(${collection_thumb_2.src})`}} ></div>
                    <div className="tp-collection-content-1">
                        <h3 className="tp-collection-title-1">
                          <Link href="/shop">Thời trang <br/> & Làm đẹp</Link>
                        </h3>
                        <div className="tp-collection-btn-1">
                          <Link href="/shop" className="tp-link-btn-line">Mua ngay bộ sưu tập</Link>
                        </div>
                    </div>
                  </div>
              </div>
            </div>
            <div className="row justify-content-center">
              <div className="col-lg-10">
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: '#0F0F0F',
                  border: '1px solid #BD844C',
                  borderRadius: '0px',
                  padding: '1rem 2rem',
                  marginTop: '2rem',
                  flexWrap: 'wrap',
                  gap: '1.25rem',
                  width: '100%'
                }}>
                  {/* Column 1: Info (Icon + Title + Badge + Subtitle) */}
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '1rem',
                    flex: '1 1 auto',
                    minWidth: '280px'
                  }}>
                    {/* Decorative Shiny Brand Icon */}
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '0px',
                      background: 'rgba(189, 132, 76, 0.12)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#BD844C',
                      flexShrink: 0,
                      border: '1px solid rgba(189, 132, 76, 0.3)'
                    }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
                        <line x1="7" y1="7" x2="7.01" y2="7"></line>
                      </svg>
                    </div>

                    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#FFFFFF', letterSpacing: '-0.01em', fontFamily: "'Outfit', 'Inter', sans-serif" }}>
                        {activeCoupon.title}
                      </span>
                      <span suppressHydrationWarning style={{ 
                        color: '#FFFFFF', 
                        background: '#BD844C', 
                        padding: '2px 10px', 
                        borderRadius: '0px', 
                        fontSize: '0.8rem', 
                        fontWeight: 700,
                        border: 'none',
                        letterSpacing: '0.02em',
                        fontFamily: "'Outfit', 'Inter', sans-serif"
                      }}>
                        Giảm {activeCoupon.discountPercentage}%
                      </span>
                      <span style={{ fontSize: '0.95rem', color: '#A0A0A0', fontWeight: 500, fontFamily: "'Inter', sans-serif" }}>
                        cho bạn...
                      </span>
                    </div>
                  </div>

                  {/* Column 2: Action Button (Centered) */}
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    justifyContent: 'center',
                    flex: '1 1 auto',
                    minWidth: '180px'
                  }}>
                    <Link href="/coupon" style={{ textDecoration: 'none' }}>
                      <span style={{ 
                        fontSize: '0.85rem', 
                        color: '#000000', 
                        fontWeight: 700, 
                        display: 'inline-flex', 
                        alignItems: 'center', 
                        gap: '8px',
                        background: '#FFFFFF',
                        padding: '8px 18px',
                        borderRadius: '0px',
                        cursor: 'pointer',
                        letterSpacing: '0.01em',
                        fontFamily: "'Outfit', 'Inter', sans-serif"
                      }}
                      >
                        Thu thập mã ngay <ArrowRightSmTwo />
                      </span>
                    </Link>
                  </div>

                  {/* Column 3: Countdown Timer (Right-Aligned) */}
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '1rem', 
                    flexShrink: 0, 
                    flexWrap: 'wrap',
                    justifyContent: 'flex-end',
                    flex: '1 1 auto',
                    minWidth: '320px'
                  }}>
                    <span style={{ 
                      fontSize: '0.75rem', 
                      color: '#8C8276', 
                      fontWeight: 700, 
                      textTransform: 'uppercase', 
                      letterSpacing: '0.08em',
                      fontFamily: "'Outfit', 'Inter', sans-serif"
                    }}>
                      Kết thúc sau:
                    </span>
                    
                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                      {/* Days Box */}
                      <div style={{
                        width: '48px',
                        height: '52px',
                        borderRadius: '0px',
                        background: '#1F1F1F',
                        border: '1px solid #2C2C2E',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <span suppressHydrationWarning style={{ fontSize: '1.15rem', fontWeight: 700, color: '#FFFFFF', lineHeight: 1.1, fontFamily: "'Outfit', 'Inter', sans-serif" }}>
                          {days}
                        </span>
                        <span style={{ fontSize: '0.55rem', fontWeight: 600, color: '#8C8276', textTransform: 'uppercase', marginTop: '1px', letterSpacing: '0.02em', fontFamily: "'Inter', sans-serif" }}>
                          Ngày
                        </span>
                      </div>

                      <span style={{ color: 'rgba(189, 132, 76, 0.4)', fontWeight: 700, fontSize: '1rem' }}>:</span>

                      {/* Hours Box */}
                      <div style={{
                        width: '48px',
                        height: '52px',
                        borderRadius: '0px',
                        background: '#1F1F1F',
                        border: '1px solid #2C2C2E',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <span suppressHydrationWarning style={{ fontSize: '1.15rem', fontWeight: 700, color: '#FFFFFF', lineHeight: 1.1, fontFamily: "'Outfit', 'Inter', sans-serif" }}>
                          {hours}
                        </span>
                        <span style={{ fontSize: '0.55rem', fontWeight: 600, color: '#8C8276', textTransform: 'uppercase', marginTop: '1px', letterSpacing: '0.02em', fontFamily: "'Inter', sans-serif" }}>
                          Giờ
                        </span>
                      </div>

                      <span style={{ color: 'rgba(189, 132, 76, 0.4)', fontWeight: 700, fontSize: '1rem' }}>:</span>

                      {/* Minutes Box */}
                      <div style={{
                        width: '48px',
                        height: '52px',
                        borderRadius: '0px',
                        background: '#1F1F1F',
                        border: '1px solid #2C2C2E',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <span suppressHydrationWarning style={{ fontSize: '1.15rem', fontWeight: 700, color: '#FFFFFF', lineHeight: 1.1, fontFamily: "'Outfit', 'Inter', sans-serif" }}>
                          {minutes}
                        </span>
                        <span style={{ fontSize: '0.55rem', fontWeight: 600, color: '#8C8276', textTransform: 'uppercase', marginTop: '1px', letterSpacing: '0.02em', fontFamily: "'Inter', sans-serif" }}>
                          Phút
                        </span>
                      </div>

                      <span style={{ color: 'rgba(189, 132, 76, 0.4)', fontWeight: 700, fontSize: '1rem' }}>:</span>

                      {/* Seconds Box - Solid Gold Accent Box */}
                      <div style={{
                        width: '48px',
                        height: '52px',
                        borderRadius: '0px',
                        background: '#BD844C',
                        border: '1px solid #BD844C',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <span suppressHydrationWarning style={{ fontSize: '1.15rem', fontWeight: 700, color: '#FFFFFF', lineHeight: 1.1, fontFamily: "'Outfit', 'Inter', sans-serif" }}>
                          {seconds}
                        </span>
                        <span style={{ fontSize: '0.55rem', fontWeight: 600, color: 'rgba(255, 255, 255, 0.85)', textTransform: 'uppercase', marginTop: '1px', letterSpacing: '0.02em', fontFamily: "'Inter', sans-serif" }}>
                          Giây
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
        </div>
      </section> 
    </>
  );
};

export default BeautyOfferBanner;