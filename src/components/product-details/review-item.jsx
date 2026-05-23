import dayjs from "dayjs";
import Image from "next/image";
import React from "react";
import { Rating } from "react-simple-star-rating";

const ReviewItem = ({ review }) => {
  const { comment, createdAt, rating, userId, reply } = review || {};
  return (
    <div className="tp-product-details-review-avater d-flex align-items-start">
      <div className="tp-product-details-review-avater-thumb">
        {!userId?.imageURL && <h5 className="review-name">{userId?.name[0]}</h5>}
        <a href="#">
          {userId?.imageURL && <Image src={userId?.imageURL} alt="user img" width={60} height={60} />}
        </a>
      </div>
      <div className="tp-product-details-review-avater-content">
        <div className="tp-product-details-review-avater-rating d-flex align-items-center">
          <Rating allowFraction size={16} initialValue={rating} readonly={true} />
        </div>
        <h3 className="tp-product-details-review-avater-title">{userId?.name}</h3>
        <span className="tp-product-details-review-avater-meta">
          {dayjs(createdAt).format("MMMM D, YYYY")}
        </span>

        <div className="tp-product-details-review-avater-comment">
          <p>
            {comment}
          </p>
        </div>

        {reply && (
          <div className="tp-product-details-review-avater-reply ms-4 mt-3 p-3 bg-light rounded" style={{ borderLeft: '3px solid var(--tp-theme-primary)' }}>
            <h5 className="review-name-reply mb-1" style={{ fontSize: '0.9rem', fontWeight: 'bold', color: 'var(--tp-theme-primary)' }}>
              Phản hồi từ Aura Shop:
            </h5>
            <p className="mb-0" style={{ fontSize: '0.875rem', color: '#555' }}>{reply}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewItem;
