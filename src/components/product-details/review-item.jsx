import React, { useState } from "react";
import dayjs from "dayjs";
import Image from "next/image";
import { useSelector } from "react-redux";
import { Rating } from "react-simple-star-rating";
import { useUpdateReviewMutation } from "@/redux/features/reviewApi";
import { notifySuccess, notifyError } from "@/utils/toast";

const ReviewItem = ({ review }) => {
  const { _id, comment, createdAt, rating, userId, reply } = review || {};
  const { user } = useSelector((state) => state.auth);
  const [updateReview, { isLoading: isUpdating }] = useUpdateReviewMutation();

  // Edit states
  const [isEditing, setIsEditing] = useState(false);
  const [editRating, setEditRating] = useState(rating);
  const [editComment, setEditComment] = useState(comment);

  const isAuthor = user && (userId?._id || userId) === user?._id;
  const reviewAgeInHours = (new Date() - new Date(createdAt)) / (1000 * 60 * 60);
  const isEditable = isAuthor && reviewAgeInHours < 24;

  const handleRating = (rate) => {
    setEditRating(rate);
  };

  const handleUpdate = async () => {
    if (!editComment.trim()) {
      notifyError("Vui lòng nhập nội dung đánh giá!");
      return;
    }
    try {
      await updateReview({ id: _id, rating: editRating, comment: editComment }).unwrap();
      notifySuccess("Cập nhật đánh giá thành công!");
      setIsEditing(false);
    } catch (err) {
      notifyError("Không thể cập nhật đánh giá. Vui lòng thử lại.");
    }
  };

  return (
    <div className="tp-product-details-review-avater d-flex align-items-start mb-4">
      <div className="tp-product-details-review-avater-thumb">
        {!userId?.imageURL && <h5 className="review-name">{userId?.name[0]}</h5>}
        <a href="#">
          {userId?.imageURL && <Image src={userId?.imageURL} alt="user img" width={60} height={60} />}
        </a>
      </div>
      <div className="tp-product-details-review-avater-content flex-grow-1 w-100">
        {isEditing ? (
          <div className="edit-review-box p-3 bg-light rounded border">
            <h6 className="font-weight-bold mb-2 text-primary" style={{ fontSize: '0.9rem' }}>Chỉnh sửa đánh giá của bạn</h6>
            <div className="d-flex align-items-center mb-2">
              <span className="me-2 text-muted" style={{ fontSize: '0.85rem' }}>Số sao:</span>
              <Rating onClick={handleRating} allowFraction size={18} initialValue={editRating} />
            </div>
            <textarea
              className="form-control mb-2"
              rows="3"
              style={{ fontSize: '0.9rem', resize: 'none' }}
              value={editComment}
              onChange={(e) => setEditComment(e.target.value)}
              disabled={isUpdating}
            />
            <div className="d-flex gap-2 justify-content-end">
              <button 
                onClick={() => {
                  setIsEditing(false);
                  setEditRating(rating);
                  setEditComment(comment);
                }} 
                className="btn btn-sm btn-outline-secondary"
                disabled={isUpdating}
                style={{ fontSize: '0.8rem', padding: '0.25rem 0.75rem' }}
              >
                Hủy
              </button>
              <button 
                onClick={handleUpdate} 
                className="btn btn-sm btn-primary"
                disabled={isUpdating}
                style={{ fontSize: '0.8rem', padding: '0.25rem 1rem', backgroundColor: 'var(--tp-theme-primary)', borderColor: 'var(--tp-theme-primary)' }}
              >
                {isUpdating ? "Đang lưu..." : "Lưu"}
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="tp-product-details-review-avater-rating d-flex align-items-center">
              <Rating allowFraction size={16} initialValue={rating} readonly={true} />
            </div>
            <div className="d-flex align-items-center justify-content-between">
              <h3 className="tp-product-details-review-avater-title mb-0">{userId?.name}</h3>
              {isEditable && (
                <button 
                  onClick={() => setIsEditing(true)} 
                  className="btn btn-link p-0 text-decoration-none"
                  style={{ fontSize: '0.8rem', color: 'var(--tp-theme-primary)', fontWeight: 500 }}
                >
                  ✏️ Sửa đánh giá
                </button>
              )}
            </div>
            <span className="tp-product-details-review-avater-meta">
              {dayjs(createdAt).format("MMMM D, YYYY")}
              {isEditable && (
                <span className="ms-2 badge text-success" style={{ fontSize: '0.75rem', fontWeight: 'normal', backgroundColor: 'rgba(25, 135, 84, 0.1)', padding: '0.2rem 0.4rem', border: 'none' }}>
                  Có thể sửa trong 24h
                </span>
              )}
            </span>

            <div className="tp-product-details-review-avater-comment mt-2">
              <p>{comment}</p>
            </div>

            {reply && (
              <div className="tp-product-details-review-avater-reply ms-4 mt-3 p-3 bg-light rounded" style={{ borderLeft: '3px solid var(--tp-theme-primary)' }}>
                <h5 className="review-name-reply mb-1" style={{ fontSize: '0.9rem', fontWeight: 'bold', color: 'var(--tp-theme-primary)' }}>
                  Phản hồi từ Aura Shop:
                </h5>
                <p className="mb-0" style={{ fontSize: '0.875rem', color: '#555' }}>{reply}</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ReviewItem;
// End of ReviewItem
