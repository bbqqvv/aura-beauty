import React from "react";
import Link from "next/link";
// internal
import ErrorMsg from "../common/error-msg";
import { ArrowRightSm, ArrowRightSmTwo } from "@/svg";
import { useGetProductTypeCategoryQuery } from "@/redux/features/categoryApi";
import { HomeThreeCategoryLoader } from "../loader";
import { useRouter } from "next/router";
const BeautyCategory = () => {
  const router = useRouter();
  const {
    data: categories,
    isLoading,
    isError,
  } = useGetProductTypeCategoryQuery("beauty");

  // handle category route
  const handleCategoryRoute = (title) => {
    router.push(
      `/shop?category=${title
        .toLowerCase()
        .replace("&", "")
        .split(" ")
        .join("-")}`
    );
  };
  // decide what to render
  let content = null;

  if (isLoading) {
    content = <HomeThreeCategoryLoader loading={isLoading}/>;
  }
  if (!isLoading && isError) {
    content = <ErrorMsg msg="Đã có lỗi xảy ra" />;
  }
  if (!isLoading && !isError && categories?.result?.length === 0) {
    content = <ErrorMsg msg="Không tìm thấy danh mục nào!" />;
  }
  if (!isLoading && !isError && categories?.result?.length > 0) {
    const category_items = categories.result.slice(0, 4); // Chỉ hiển thị 4 danh mục (1 hàng)
    content = category_items.map((item) => (
      <div key={item._id} className="col-lg-3 col-sm-6">
        <div className="tp-category-item-3 p-relative black-bg text-center z-index-1 fix mb-30">
          <div
            className="tp-category-thumb-3 include-bg"
            style={{ backgroundImage: `url(${item.img})` }}
          ></div>
          <div className="tp-category-content-3 transition-3">
            <h3 className="tp-category-title-3">
              <a
                className="cursor-pointer"
                onClick={() => handleCategoryRoute(item.parent)}
              >
                {item.parent}
              </a>
            </h3>
            <span className="tp-categroy-ammount-3">
              {item.products.length} Sản phẩm
            </span>
            <div className="tp-category-btn-3">
              <a
                onClick={() => handleCategoryRoute(item.parent)}
                className="cursor-pointer tp-link-btn tp-link-btn-2"
              >
                Xem ngay
                <ArrowRightSm />
              </a>
            </div>
          </div>
        </div>
      </div>
    ));
  }
  return (
    <>
      <section className="tp-category-area pt-95">
        <div className="container">
          <div className="row align-items-end">
            <div className="col-lg-6 col-md-8">
              <div className="tp-section-title-wrapper-3 mb-45">
                <span className="tp-section-title-pre-3">
                  Bộ sưu tập sản phẩm
                </span>
                <h3 className="tp-section-title-3">Khám phá sản phẩm của chúng tôi</h3>
              </div>
            </div>
            <div className="col-lg-6 col-md-4">
              <div className="tp-category-more-3 text-md-end mb-55">
                <Link href="/shop" className="tp-btn">
                  Xem tất cả sản phẩm <ArrowRightSmTwo />
                </Link>
              </div>
            </div>
          </div>
          <div className="row">{content}</div>
        </div>
      </section>
    </>
  );
};

export default BeautyCategory;
