import React from "react";
import ErrorMsg from "../common/error-msg";
import { useSelector } from "react-redux";

const CheckoutBillingArea = ({ register, errors }) => {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="tp-checkout-bill-area">
      <h3 className="tp-checkout-bill-title">Thông tin thanh toán</h3>

      <div className="tp-checkout-bill-form">
        <div className="tp-checkout-bill-inner">
          <div className="row">
            <div className="col-md-6">
              <div className="tp-checkout-input">
                <label>
                  Tên <span>*</span>
                </label>
                <input
                  {...register("firstName", {
                    required: `Vui lòng nhập tên!`,
                  })}
                  name="firstName"
                  id="firstName"
                  type="text"
                  placeholder="Tên"
                  defaultValue={user?.firstName}
                />
                <ErrorMsg msg={errors?.firstName?.message} />
              </div>
            </div>
            <div className="col-md-6">
              <div className="tp-checkout-input">
                <label>
                  Họ <span>*</span>
                </label>
                <input
                  {...register("lastName", {
                    required: `Vui lòng nhập họ!`,
                  })}
                  name="lastName"
                  id="lastName"
                  type="text"
                  placeholder="Họ"
                />
                <ErrorMsg msg={errors?.lastName?.message} />
              </div>
            </div>
            <div className="col-md-12">
              <div className="tp-checkout-input">
                <label>
                  Quốc gia <span>*</span>
                </label>
                <input
                  {...register("country", { required: `Vui lòng nhập quốc gia!` })}
                  name="country"
                  id="country"
                  type="text"
                  placeholder="Việt Nam"
                />
                <ErrorMsg msg={errors?.lastName?.message} />
              </div>
            </div>
            <div className="col-md-12">
              <div className="tp-checkout-input">
                <label>Địa chỉ</label>
                <input
                  {...register("address", { required: `Vui lòng nhập địa chỉ!` })}
                  name="address"
                  id="address"
                  type="text"
                  placeholder="Số nhà, tên đường"
                />
                <ErrorMsg msg={errors?.address?.message} />
              </div>
            </div>
            <div className="col-md-6">
              <div className="tp-checkout-input">
                <label>Tỉnh / Thành phố</label>
                <input
                  {...register("city", { required: `Vui lòng nhập thành phố!` })}
                  name="city"
                  id="city"
                  type="text"
                  placeholder="Tỉnh / Thành phố"
                />
                 <ErrorMsg msg={errors?.city?.message} />
              </div>
            </div>
            <div className="col-md-6">
              <div className="tp-checkout-input">
                <label>Mã bưu điện</label>
                <input
                  {...register("zipCode", { required: `Vui lòng nhập mã bưu điện!` })}
                  name="zipCode"
                  id="zipCode"
                  type="text"
                  placeholder="Mã bưu điện"
                />
                <ErrorMsg msg={errors?.zipCode?.message} />
              </div>
            </div>
            <div className="col-md-12">
              <div className="tp-checkout-input">
                <label>
                  Số điện thoại <span>*</span>
                </label>
                <input
                  {...register("contactNo", {
                    required: `Vui lòng nhập số điện thoại!`,
                  })}
                  name="contactNo"
                  id="contactNo"
                  type="text"
                  placeholder="Số điện thoại"
                />
                <ErrorMsg msg={errors?.contactNo?.message} />
              </div>
            </div>
            <div className="col-md-12">
              <div className="tp-checkout-input">
                <label>
                  Địa chỉ Email <span>*</span>
                </label>
                <input
                  {...register("email", { required: `Vui lòng nhập email!` })}
                  name="email"
                  id="email"
                  type="email"
                  placeholder="Email"
                  defaultValue={user?.email}
                />
                <ErrorMsg msg={errors?.email?.message} />
              </div>
            </div>
            <div className="col-md-12">
              <div className="tp-checkout-input">
                <label>Ghi chú đơn hàng (tùy chọn)</label>
                <textarea
                  {...register("orderNote", { required: false })}
                  name="orderNote"
                  id="orderNote"
                  placeholder="Ghi chú về đơn hàng của bạn, ví dụ: ghi chú đặc biệt khi giao hàng."
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutBillingArea;
