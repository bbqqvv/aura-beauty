import React, { useState } from "react";
import CouponLoader from "../loader/coupon-loader";
import ErrorMsg from "../common/error-msg";
import OfferCouponItem from "./OfferCouponItem";
import { useGetOfferCouponsQuery } from "@/redux/features/coupon/couponApi";


const OfferCouponArea = () => {
  const [copiedCode, setCopiedCode] = useState("");
  const [copied, setCopied] = useState(false);

  const handleCopied = (code) => {
    setCopiedCode(code);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 3000);
  };

  const { data: offerCoupons, isError, isLoading } = useGetOfferCouponsQuery();
  // decide what to render
  let content = null;

  if (isLoading) {
    content = <CouponLoader loading={isLoading} />;
  }

  if (!isLoading && isError) {
    content = <ErrorMsg msg="Đã xảy ra lỗi khi tải danh sách mã giảm giá!" />;
  }

  if (!isLoading && !isError) {
    const activeCoupons = (offerCoupons || []).filter(
      (coupon) => coupon.status === "active" && new Date(coupon.endTime) > new Date()
    );

    if (activeCoupons.length === 0) {
      content = <ErrorMsg msg="Hiện tại không có mã giảm giá nào hoạt động!" />;
    } else {
      const couponItems = activeCoupons.slice(0, 2);
      content = couponItems.map((coupon) => (
        <div key={coupon._id} className="col-xl-6">
          <OfferCouponItem
            coupon={coupon}
            handleCopied={handleCopied}
            copied={copied}
            copiedCode={copiedCode}
          />
        </div>
      ));
    }
  }

  return (
    <>
      <div className="tp-coupon-area pb-120">
        <div className="container">
          <div className="row">{content}</div>
        </div>
      </div>
    </>
  );
};

export default OfferCouponArea;
