import { useState } from "react";
import { useSelector } from "react-redux";
// internal
import useCartInfo from "@/hooks/use-cart-info";
import ErrorMsg from "../common/error-msg";

const CheckoutOrderArea = ({ checkoutData }) => {
  const {
    handleShippingCost,
    cartTotal = 0,
    stripe,
    isCheckoutSubmit,
    clientSecret,
    register,
    errors,
    showCard,
    setShowCard,
    shippingCost,
    discountAmount
  } = checkoutData;
  const { cart_products } = useSelector((state) => state.cart);
  const { total } = useCartInfo();
  return (
    <div className="tp-checkout-place white-bg">
      <h3 className="tp-checkout-place-title">Đơn hàng của bạn</h3>

      <div className="tp-order-info-list">
        <ul>
          {/*  header */}
          <li className="tp-order-info-list-header">
            <h4>Sản phẩm</h4>
            <h4>Tổng cộng</h4>
          </li>

          {/*  item list */}
          {cart_products.map((item) => (
            <li key={item._id} className="tp-order-info-list-desc">
              <p>
                {item.title} <span> x {item.orderQuantity}</span>
              </p>
              <span>${item.price.toFixed(2)}</span>
            </li>
          ))}

          {/*  shipping */}
          <li className="tp-order-info-list-shipping">
            <span>Vận chuyển</span>
            <div className="tp-order-info-list-shipping-item d-flex flex-column align-items-end">
              <span>
                <input
                  {...register(`shippingOption`, {
                    required: `Vui lòng chọn phương thức vận chuyển!`,
                  })}
                  id="flat_shipping"
                  type="radio"
                  name="shippingOption"
                />
                <label
                  onClick={() => handleShippingCost(60)}
                  htmlFor="flat_shipping"
                >
                  Giao hàng: Trong ngày Phí :<span>$60.00</span>
                </label>
                <ErrorMsg msg={errors?.shippingOption?.message} />
              </span>
              <span>
                <input
                  {...register(`shippingOption`, {
                    required: `Vui lòng chọn phương thức vận chuyển!`,
                  })}
                  id="flat_rate"
                  type="radio"
                  name="shippingOption"
                />
                <label
                  onClick={() => handleShippingCost(20)}
                  htmlFor="flat_rate"
                >
                  Giao hàng: 7 Ngày Phí: <span>$20.00</span>
                </label>
                <ErrorMsg msg={errors?.shippingOption?.message} />
              </span>
            </div>
          </li>

           {/*  subtotal */}
           <li className="tp-order-info-list-subtotal">
            <span>Tạm tính</span>
            <span>${total.toFixed(2)}</span>
          </li>

           {/*  shipping cost */}
           <li className="tp-order-info-list-subtotal">
            <span>Phí vận chuyển</span>
            <span>${shippingCost.toFixed(2)}</span>
          </li>

           {/* discount */}
           <li className="tp-order-info-list-subtotal">
            <span>Giảm giá</span>
            <span>${discountAmount.toFixed(2)}</span>
          </li>

          {/* total */}
          <li className="tp-order-info-list-total">
            <span>Tổng cộng</span>
            <span>${parseFloat(cartTotal).toFixed(2)}</span>
          </li>
        </ul>
      </div>
      <div className="tp-checkout-payment">
        <div className="tp-checkout-payment-item">
          <input
            {...register(`payment`, {
              required: `Vui lòng chọn phương thức thanh toán!`,
            })}
            onClick={() => setShowCard(true)}
            type="radio"
            id="vietqr"
            name="payment"
            value="VietQR"
          />
          <label htmlFor="vietqr">VietQR</label>
          {showCard && (
            <div className="direct-bank-transfer mt-2 p-3 border rounded text-center">
               <p className="mb-2" style={{ fontSize: '14px' }}>Quét mã VietQR dưới đây để thanh toán:</p>
               <img 
                 src={`https://img.vietqr.io/image/MB-123456789-compact2.png?amount=${cartTotal}&addInfo=AuraOrder&accountName=AURA%20BEAUTY`} 
                 alt="VietQR Code" 
                 style={{ maxWidth: '200px', margin: '10px auto' }} 
               />
               <div className="text-start mt-2" style={{ fontSize: '13px' }}>
                 <p className="mb-1"><strong>Ngân hàng:</strong> MB Bank</p>
                 <p className="mb-1"><strong>Số tài khoản:</strong> 123456789</p>
                 <p className="mb-1"><strong>Chủ tài khoản:</strong> AURA BEAUTY</p>
                 <p className="mb-0"><strong>Nội dung:</strong> AuraOrder</p>
               </div>
            </div>
          )}
          <ErrorMsg msg={errors?.payment?.message} />
        </div>

        <div className="tp-checkout-payment-item">
          <input
            {...register(`payment`, {
              required: `Vui lòng chọn phương thức thanh toán!`,
            })}
            onClick={() => setShowCard(false)}
            type="radio"
            id="cod"
            name="payment"
            value="COD"
          />
          <label htmlFor="cod">Thanh toán khi nhận hàng (COD)</label>
          <ErrorMsg msg={errors?.payment?.message} />
        </div>
      </div>

      <div className="tp-checkout-btn-wrapper">
        <button
          type="submit"
          disabled={isCheckoutSubmit}
          className="tp-checkout-btn w-100"
        >
          Đặt hàng
        </button>
      </div>
    </div>
  );
};

export default CheckoutOrderArea;
