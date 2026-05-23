import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { Rating } from "react-simple-star-rating";
import dayjs from "dayjs";
// internal
import { add_cart_product } from "@/redux/features/cartSlice";
import { remove_compare_product } from "@/redux/features/compareSlice";

const CompareArea = () => {
  const { compareItems } = useSelector((state) => state.compare);
  const dispatch = useDispatch();

  // handle add product
  const handleAddProduct = (prd) => {
    dispatch(add_cart_product(prd));
  };
  // handle add product
  const handleRemoveComparePrd = (prd) => {
    dispatch(remove_compare_product(prd));
  };

  return (
    <>
      <section className="tp-compare-area pb-120">
        <div className="container">
          <div className="row">
            <div className="col-xl-12">
              {compareItems.length === 0 && (
                <div className="text-center pt-50">
                  <h3>Không tìm thấy sản phẩm nào trong danh sách so sánh</h3>
                  <Link href="/shop" className="tp-cart-checkout-btn mt-20">
                    Tiếp tục mua sắm
                  </Link>
                </div>
              )}
              {compareItems.length > 0 && (
                <div className="tp-compare-table table-responsive text-center">
                  <table className="table">
                    <tbody>
                      <tr>
                        <th>Sản phẩm</th>
                        {compareItems.map(item => (
                          <td key={item._id} className="">
                            <div className="tp-compare-thumb">
                              <Image
                                src={item.img}
                                alt="compare"
                                width={205}
                                height={176}
                                style={{ objectFit: 'cover', borderRadius: '8px' }}
                              />
                              <h4 className="tp-compare-product-title">
                                <Link href={`/product-details/${item._id}`}>
                                  {item.title}
                                </Link>
                              </h4>
                            </div>
                          </td>
                        ))}
                      </tr>
                      {/* Description */}
                      <tr>
                        <th>Mô tả</th>
                        {compareItems.map(item => (
                          <td key={item._id}>
                            <div className="tp-compare-desc text-start" style={{ maxWdith: '250px', margin: '0 auto', fontSize: '14px', lineHeight: '1.5' }}>
                              <p>
                                {item.description 
                                  ? item.description.replace(/<[^>]*>?/gm, '').substring(0, 100) + '...'
                                  : 'Chưa có mô tả chi tiết cho sản phẩm này.'}
                              </p>
                            </div>
                          </td>
                        ))}
                      </tr>
                      {/* Category */}
                      <tr>
                        <th>Danh mục</th>
                        {compareItems.map(item => (
                          <td key={item._id}>
                            <div className="tp-compare-category" style={{ fontSize: '14px', fontWeight: '500', color: '#666' }}>
                              <span>{item.category?.name || 'Chưa phân loại'}</span>
                            </div>
                          </td>
                        ))}
                      </tr>
                      {/* Status */}
                      <tr>
                        <th>Trạng thái</th>
                        {compareItems.map(item => (
                          <td key={item._id}>
                            <div className="tp-compare-status">
                              <span className={`badge ${item.status === 'in-stock' ? 'bg-success' : 'bg-danger'}`} style={{ fontSize: '12px', padding: '6px 12px', borderRadius: '4px' }}>
                                {item.status === 'in-stock' ? 'Còn hàng' : 'Hết hàng'}
                              </span>
                            </div>
                          </td>
                        ))}
                      </tr>
                      {/* Price */}
                      <tr>
                        <th>Giá bán</th>
                        {compareItems.map(item => {
                          const isOfferActive = item.discount > 0 && (!item.offerDate?.endDate || dayjs().isBefore(dayjs(item.offerDate.endDate)));
                          const discountedPrice = isOfferActive ? item.price - (item.price * item.discount) / 100 : item.price;
                          return (
                            <td key={item._id}>
                              <div className="tp-compare-price">
                                {isOfferActive ? (
                                  <div className="d-flex flex-column align-items-center gap-1">
                                    <span style={{ fontSize: '13px', textDecoration: 'line-through', color: '#a0a0a0', fontWeight: 'normal' }}>
                                      ${item.price.toFixed(2)}
                                    </span>
                                    <span style={{ fontSize: '16px', fontWeight: '600', color: '#825a2c' }}>
                                      ${discountedPrice.toFixed(2)}
                                    </span>
                                  </div>
                                ) : (
                                  <span style={{ fontSize: '16px', fontWeight: '600', color: '#825a2c' }}>
                                    ${item.price.toFixed(2)}
                                  </span>
                                )}
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                      {/* Rating */}
                      <tr>
                        <th>Đánh giá</th>
                        {compareItems.map(item => (
                          <td key={item._id}>
                            <div className="tp-compare-rating">
                              <Rating
                                allowFraction
                                size={16}
                                initialValue={item.reviews.length > 0 ? item.reviews.reduce((acc, review) => acc + review.rating, 0) / item.reviews.length : 0}
                                readonly={true}
                              />
                            </div>
                          </td>
                        ))}
                      </tr>
                      {/* Add to cart*/}
                      <tr>
                        <th>Giỏ hàng</th>
                        {compareItems.map(item => (
                          <td key={item._id}>
                            <div className="tp-compare-add-to-cart">
                              <button onClick={() => handleAddProduct(item)} type="button" className="tp-btn">
                                Thêm vào giỏ
                              </button>
                            </div>
                          </td>
                        ))}
                      </tr>
                      {/* Remove */}
                      <tr>
                        <th>Xóa khỏi danh sách</th>
                        {compareItems.map(item => (
                          <td key={item._id}>
                            <div className="tp-compare-remove">
                              <button onClick={()=>handleRemoveComparePrd({title:item.title,id:item._id })}>
                                <i className="fal fa-trash-alt"></i>
                              </button>
                            </div>
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default CompareArea;
