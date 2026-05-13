import React from 'react';
import { useTimer } from 'react-timer-hook';
import { ArrowRightSmTwo } from '@/svg';
import collection_thumb from '@assets/img/product/collection/collection-1.jpg';
import collection_thumb_2 from '@assets/img/product/collection/collection-2.jpg';
import Timer from '../common/timer';
import Link from 'next/link';

const BeautyOfferBanner = () => {
  const expiryTimestamp = new Date('2023-8-16');
  const { seconds, minutes, hours, days } = useTimer({expiryTimestamp});
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
              <div className="col-xl-3 col-lg-4 col-md-5">
                  <div className="tp-collection-offer-wrapper mt-20">
                    <p>Khám phá bộ sưu tập làm đẹp của chúng tôi <span>Giảm giá thêm 75%</span> cho bạn...</p>
                  </div>
              </div>
              <div className="col-xl-3 col-lg-4 col-md-5">
                  <div className="tp-collection-countdown d-flex align-items-center justify-content-center justify-content-md-start ml-20 mt-20">
                    <div className="tp-product-countdown" data-countdown data-date="Sep 30 2024 20:20:22">
                        <div className="tp-product-countdown-inner">
                          <ul>
                              <li><span>{days}</span> Ngày</li>
                              <li><span>{hours}</span> Giờ</li>
                              <li><span>{minutes}</span> Phút</li>
                          </ul>
                          {/* <Timer expiryTimestamp={time} /> */}
                        </div>
                    </div>
                    <div className="tp-product-countdown has-second" data-countdown data-date="Sep 30 2024 20:20:22">
                        <div className="tp-product-countdown-inner">
                          <ul>
                              <li><span suppressHydrationWarning>{seconds}</span> Giây</li>
                          </ul>
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