import React,{useState} from "react";
import Link from "next/link";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { Rating } from "react-simple-star-rating";
import * as Yup from "yup";
// internal
import ErrorMsg from "../common/error-msg";
import { useAddReviewMutation } from "@/redux/features/reviewApi";
import { useGetUserOrdersQuery } from "@/redux/features/order/orderApi";
import { notifyError, notifySuccess } from "@/utils/toast";

// schema
const schema = Yup.object().shape({
  name: Yup.string().required().label("Name"),
  email: Yup.string().required().email().label("Email"),
  comment: Yup.string().required().label("Comment"),
});

const ReviewForm = ({product_id, onSuccess}) => {
  const { user } = useSelector((state) => state.auth);
  const [rating, setRating] = useState(0);
  const [addReview, {}] = useAddReviewMutation();
  const { data: userOrders, isLoading } = useGetUserOrdersQuery(undefined, { skip: !user });

  const hasPurchased = userOrders?.some(order => 
    order.cart?.some(item => item._id === product_id)
  );

  // Catch Rating value
  const handleRating = (rate) => {
    setRating(rate)
  }

   // react hook form
   const {register,handleSubmit,formState: { errors },reset} = useForm({
    resolver: yupResolver(schema),
  });
  // on submit
  const onSubmit = (data) => {
    if(!user){
      notifyError("Vui lòng đăng nhập trước");
      return;
    }
    else {
      addReview({
        userId: user?._id,
        productId: product_id,
        rating: rating,
        comment: data.comment,
      }).then((result) => {
        if (result?.error) {
          notifyError(result?.error?.data?.message || "Có lỗi xảy ra");
        } else {
          notifySuccess(result?.data?.message || "Thành công");
          if (onSuccess) {
            onSuccess();
          }
        }
      });
    }
    reset();
  };

  if (!user) {
    return (
      <div className="text-center p-4 bg-light rounded-3 border" style={{ marginTop: '20px' }}>
        <p className="mb-3 text-muted">Vui lòng đăng nhập để đánh giá sản phẩm này.</p>
        <Link href="/login" className="tp-btn tp-btn-border" style={{ padding: '8px 24px', fontSize: '0.9rem', display: 'inline-block', textDecoration: 'none' }}>
          Đăng nhập ngay
        </Link>
      </div>
    );
  }

  if (isLoading) {
    return <div className="text-center p-4 text-muted">Đang xác thực thông tin mua hàng...</div>;
  }

  if (!hasPurchased) {
    return (
      <div className="p-4 bg-light rounded-3 border text-center animate-fade" style={{ marginTop: '20px' }}>
        <p className="mb-0 text-muted" style={{ fontWeight: 500 }}>
          🔒 Chỉ những khách hàng đã mua sản phẩm này mới có thể viết đánh giá.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="tp-product-details-review-form-rating d-flex align-items-center">
        <p>Đánh giá của bạn :</p>
        <div className="tp-product-details-review-form-rating-icon d-flex align-items-center">
          <Rating onClick={handleRating} allowFraction size={16} initialValue={rating} />
        </div>
      </div>
      <div className="tp-product-details-review-input-wrapper">
        <div className="tp-product-details-review-input-box">
          <div className="tp-product-details-review-input">
            <textarea
            {...register("comment", { required: `Vui lòng nhập bình luận!` })}
              id="comment"
              name="comment"
              placeholder="Viết đánh giá của bạn tại đây..."
            />
          </div>
          <div className="tp-product-details-review-input-title">
            <label htmlFor="msg">Đánh giá của bạn</label>
          </div>
          <ErrorMsg msg={errors.name?.comment} />
        </div>
        <div className="tp-product-details-review-input-box">
          <div className="tp-product-details-review-input">
            <input
            {...register("name", { required: `Vui lòng nhập tên!` })}
              name="name"
              id="name"
              type="text"
              placeholder="Họ và tên"
            />
          </div>
          <div className="tp-product-details-review-input-title">
            <label htmlFor="name">Tên của bạn</label>
          </div>
          <ErrorMsg msg={errors.name?.name} />
        </div>
        <div className="tp-product-details-review-input-box">
          <div className="tp-product-details-review-input">
            <input
            {...register("email", { required: `Vui lòng nhập email!` })}
              name="email"
              id="email"
              type="email"
              placeholder="email@example.com"
            />
          </div>
          <div className="tp-product-details-review-input-title">
            <label htmlFor="email">Email của bạn</label>
          </div>
          <ErrorMsg msg={errors.name?.email} />
        </div>
      </div>
      <div className="tp-product-details-review-btn-wrapper">
        <button type="submit" className="tp-product-details-review-btn">Gửi</button>
      </div>
    </form>
  );
};

export default ReviewForm;
