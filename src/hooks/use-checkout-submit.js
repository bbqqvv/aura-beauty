import * as dayjs from "dayjs";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
//internal import
import useCartInfo from "./use-cart-info";
import { set_shipping } from "@/redux/features/order/orderSlice";
import { set_coupon } from "@/redux/features/coupon/couponSlice";
import { notifyError, notifySuccess } from "@/utils/toast";
import {useCreatePaymentIntentMutation,useSaveOrderMutation} from "@/redux/features/order/orderApi";
import { useGetOfferCouponsQuery } from "@/redux/features/coupon/couponApi";

const useCheckoutSubmit = () => {
  // offerCoupons
  const { data: offerCoupons, isError, isLoading } = useGetOfferCouponsQuery();
  // addOrder
  const [saveOrder, {}] = useSaveOrderMutation();
  // createPaymentIntent
  const [createPaymentIntent, {}] = useCreatePaymentIntentMutation();
  // cart_products
  const { cart_products } = useSelector((state) => state.cart);
  // user
  const { user } = useSelector((state) => state.auth);
  // shipping_info
  const { shipping_info } = useSelector((state) => state.order);
  // total amount
  const { total, setTotal } = useCartInfo();
  // couponInfo
  const [couponInfo, setCouponInfo] = useState({});
  //cartTotal
  const [cartTotal, setCartTotal] = useState("");
  // minimumAmount
  const [minimumAmount, setMinimumAmount] = useState(0);
  // shippingCost
  const [shippingCost, setShippingCost] = useState(0);
  // discountAmount
  const [discountAmount, setDiscountAmount] = useState(0);
  // discountPercentage
  const [discountPercentage, setDiscountPercentage] = useState(0);
  // discountProductType
  const [discountProductType, setDiscountProductType] = useState("");
  // isCheckoutSubmit
  const [isCheckoutSubmit, setIsCheckoutSubmit] = useState(false);
  // cardError
  const [cardError, setCardError] = useState("");
  // clientSecret
  const [clientSecret, setClientSecret] = useState("");
  // showCard
  const [showCard, setShowCard] = useState(false);
  // coupon apply message
  const [couponApplyMsg,setCouponApplyMsg] = useState("");

  const dispatch = useDispatch();
  const router = useRouter();
  const {register,handleSubmit,setValue,formState: { errors }} = useForm();

  let couponRef = useRef("");

  useEffect(() => {
    if (localStorage.getItem("couponInfo")) {
      const data = localStorage.getItem("couponInfo");
      const coupon = JSON.parse(data);
      setCouponInfo(coupon);
      setDiscountPercentage(coupon.discountPercentage);
      setMinimumAmount(coupon.minimumAmount);
      setDiscountProductType(coupon.productType);
    }
  }, []);

  useEffect(() => {
    if (minimumAmount - discountAmount > total || cart_products.length === 0) {
      setDiscountPercentage(0);
      localStorage.removeItem("couponInfo");
    }
  }, [minimumAmount, total, discountAmount, cart_products]);

  //calculate total and discount value
  useEffect(() => {
    let discountProductTotal = 0;
    
    if (discountPercentage > 0) {
      if (discountProductType === "all") {
        // Coupon applies to all products in the cart
        discountProductTotal = cart_products?.reduce(
          (preValue, currentValue) => preValue + currentValue.price * currentValue.orderQuantity,
          0
        ) || 0;
      } else if (couponInfo?.productIds && couponInfo.productIds.length > 0) {
        // Coupon applies ONLY to specific products in the list
        const targetIds = new Set(couponInfo.productIds);
        const result = cart_products?.filter((p) => targetIds.has(p._id));
        discountProductTotal = result?.reduce(
          (preValue, currentValue) => preValue + currentValue.price * currentValue.orderQuantity,
          0
        ) || 0;
      } else {
        // Coupon applies to a specific productType (default)
        const result = cart_products?.filter((p) => p.productType === discountProductType);
        discountProductTotal = result?.reduce(
          (preValue, currentValue) => preValue + currentValue.price * currentValue.orderQuantity,
          0
        ) || 0;
      }
    }

    let totalValue = "";
    let subTotal = Number((total + shippingCost).toFixed(2));
    let discountTotal = Number(
      discountProductTotal * (discountPercentage / 100)
    );
    totalValue = Number(subTotal - discountTotal);
    setDiscountAmount(discountTotal);
    setCartTotal(totalValue);
  }, [
    total,
    shippingCost,
    discountPercentage,
    cart_products,
    discountProductType,
    couponInfo,
  ]);

  // create payment intent
  useEffect(() => {
    if (cartTotal) {
      createPaymentIntent({
        price: parseInt(cartTotal),
      })
        .then((data) => {
          setClientSecret(data?.data?.clientSecret);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [createPaymentIntent, cartTotal]);

  // handleCouponCode
  const handleCouponCode = (e) => {
    e.preventDefault();

    if (!couponRef.current?.value) {
      notifyError("Please Input a Coupon Code!");
      return;
    }
    if (isLoading) {
      return <h3>Loading...</h3>;
    }
    if (isError) {
      return notifyError("Something went wrong");
    }
    const result = offerCoupons?.filter(
      (coupon) => coupon.couponCode === couponRef.current?.value
    );

    if (result.length < 1) {
      notifyError("Please Input a Valid Coupon!");
      return;
    }

    if (dayjs().isAfter(dayjs(result[0]?.endTime))) {
      notifyError("This coupon is not valid!");
      return;
    }

    if (result[0]?.limit > 0 && result[0]?.usageCount >= result[0]?.limit) {
      notifyError("Mã giảm giá này đã hết lượt sử dụng!");
      return;
    }

    if (total < result[0]?.minimumAmount) {
      notifyError(
        `Minimum ${result[0].minimumAmount} USD required for Apply this coupon!`
      );
      return;
    } else {
      let applyMsg = `Mã ${result[0].title} đã được áp dụng!`;
      if (result[0].productType === "all") {
        applyMsg = `Mã ${result[0].title} giảm giá cho tất cả sản phẩm!`;
      } else if (result[0].productIds && result[0].productIds.length > 0) {
        applyMsg = `Mã ${result[0].title} giảm giá cho các sản phẩm được chỉ định!`;
      } else {
        applyMsg = `Mã ${result[0].title} giảm giá cho sản phẩm nhóm ${result[0].productType}!`;
      }
      setCouponApplyMsg(applyMsg);
      setMinimumAmount(result[0]?.minimumAmount);
      setDiscountProductType(result[0].productType);
      setDiscountPercentage(result[0].discountPercentage);
      setCouponInfo(result[0]);
      localStorage.setItem("couponInfo", JSON.stringify(result[0]));
      dispatch(set_coupon(result[0]));
      setTimeout(() => {
        couponRef.current.value = "";
        setCouponApplyMsg("");
      }, 5000);
    }
  };

  // handleShippingCost
  const handleShippingCost = (value) => {
    setShippingCost(value);
  };

  //set values
  useEffect(() => {
    setValue("firstName", shipping_info.firstName);
    setValue("lastName", shipping_info.lastName);
    setValue("country", shipping_info.country);
    setValue("address", shipping_info.address);
    setValue("city", shipping_info.city);
    setValue("zipCode", shipping_info.zipCode);
    setValue("contactNo", shipping_info.contactNo);
    setValue("email", shipping_info.email);
    setValue("orderNote", shipping_info.orderNote);
  }, [user, setValue, shipping_info, router]);

  // submitHandler
  const submitHandler = async (data) => {
    dispatch(set_shipping(data));
    setIsCheckoutSubmit(true);

    let orderInfo = {
      name: `${data.firstName} ${data.lastName}`,
      address: data.address,
      contact: data.contactNo,
      email: data.email,
      city: data.city,
      country: data.country,
      zipCode: data.zipCode,
      shippingOption: data.shippingOption,
      status: "Pending",
      cart: cart_products,
      paymentMethod: data.payment,
      subTotal: total,
      shippingCost: shippingCost,
      discount: discountAmount,
      totalAmount: cartTotal,
      orderNote:data.orderNote,
      user: `${user?._id}`,
      couponCode: couponInfo?.couponCode || "",
    };

    saveOrder({
      ...orderInfo
    }).then(res => {
      if(res?.error){
        notifyError("Có lỗi xảy ra khi đặt hàng!");
        setIsCheckoutSubmit(false)
      }
      else {
        localStorage.removeItem("cart_products")
        localStorage.removeItem("couponInfo");
        setIsCheckoutSubmit(false)
        notifySuccess("Đơn hàng của bạn đã được xác nhận!");
        router.push(`/order/${res.data?.order?._id}`);
      }
    })
  };

  return {
    handleCouponCode,
    couponRef,
    handleShippingCost,
    discountAmount,
    total,
    shippingCost,
    discountPercentage,
    discountProductType,
    isCheckoutSubmit,
    setTotal,
    register,
    errors,
    cardError,
    submitHandler,
    handleSubmit,
    clientSecret,
    setClientSecret,
    cartTotal,
    isCheckoutSubmit,
    couponApplyMsg,
    showCard,
    setShowCard,
  };
};

export default useCheckoutSubmit;
