import React, { useEffect, useRef, useState, useMemo } from "react";
import ProductItem from "./product-item";
import ErrorMsg from "@/components/common/error-msg";
import { useGetProductTypeQuery } from "@/redux/features/productApi";
import { HomeThreePrdTwoLoader } from "@/components/loader";

const ProductAreaTwo = () => {
  const {
    data: products,
    isError,
    isLoading,
  } = useGetProductTypeQuery({ type: "beauty" });
  
  const activeRef = useRef(null);
  const marker = useRef(null);

  // Extract top categories dynamically based on actual products data
  const topCategories = useMemo(() => {
    if (!products?.data) return [];
    const categoryCounts = {};
    products.data.forEach((p) => {
      const catName = p.category?.name;
      if (catName) {
        categoryCounts[catName] = (categoryCounts[catName] || 0) + 1;
      }
    });
    // Sort categories by product count descending, and take the top 2
    return Object.keys(categoryCounts)
      .sort((a, b) => categoryCounts[b] - categoryCounts[a])
      .slice(0, 2);
  }, [products]);

  // Combine static tabs with dynamic categories
  const tabs = useMemo(() => {
    return ["Tất cả bộ sưu tập", "Xu hướng", ...topCategories];
  }, [topCategories]);

  const [activeTab, setActiveTab] = useState("Tất cả bộ sưu tập");

  // Ensure active tab is reset to a valid tab if the dynamic tabs list updates and current tab becomes invalid
  useEffect(() => {
    if (tabs.length > 0 && !tabs.includes(activeTab)) {
      setActiveTab(tabs[0]);
    }
  }, [tabs, activeTab]);

  // Helper to filter and sort products per tab dynamically
  const getTabProducts = (tabName, allProducts) => {
    if (!allProducts) return [];
    if (tabName === "Tất cả bộ sưu tập") {
      return allProducts;
    }
    if (tabName === "Xu hướng") {
      return allProducts
        .slice()
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    // Lọc theo danh mục động lấy từ database
    return allProducts.filter((p) => p.category?.name === tabName);
  };

  // handleActive
  const handleActive = (e, tab) => {
    setActiveTab(tab);
    if (e.target.classList.contains("active")) {
      marker.current.style.left = e.target.offsetLeft + "px";
      marker.current.style.width = e.target.offsetWidth + "px";
    }
  };

  useEffect(() => {
    if (
      activeTab &&
      activeRef.current &&
      activeRef.current.classList.contains("active")
    ) {
      marker.current.style.left = activeRef.current.offsetLeft + "px";
      marker.current.style.width = activeRef.current.offsetWidth + "px";
    }
  }, [activeTab, products, tabs]);

  // decide what to render
  let content = null;

  if (isLoading) {
    content = <HomeThreePrdTwoLoader loading={isLoading} />;
  }
  if (!isLoading && isError) {
    content = <ErrorMsg msg="Đã có lỗi xảy ra" />;
  }
  if (!isLoading && !isError && products?.data?.length === 0) {
    content = <ErrorMsg msg="Không tìm thấy sản phẩm nào!" />;
  }
  if (!isLoading && !isError && products?.data?.length > 0) {
    const current_product_items = getTabProducts(activeTab, products.data);

    content = (
      <>
        <div className="row align-items-end">
          <div className="col-xl-6 col-lg-6">
            <div className="tp-section-title-wrapper-3 mb-45 text-center text-lg-start">
              <span className="tp-section-title-pre-3">
                Sản phẩm bán chạy tuần này
              </span>
              <h3 className="tp-section-title-3">Tận hưởng chất lượng tốt nhất</h3>
            </div>
          </div>
          <div className="col-xl-6 col-lg-6">
            <div className="tp-product-tab-2 tp-product-tab-3  tp-tab mb-50 text-center">
              <div className="tp-product-tab-inner-3 d-flex align-items-center justify-content-center justify-content-lg-end">
                <nav>
                  <div
                    className="nav nav-tabs justify-content-center tp-product-tab tp-tab-menu p-relative"
                    id="nav-tab"
                    role="tablist"
                  >
                    {tabs.map((tab, i) => {
                      const count = getTabProducts(tab, products.data).length;
                      return (
                        <button
                          key={i}
                          ref={activeTab === tab ? activeRef : null}
                          onClick={(e) => handleActive(e, tab)}
                          className={`nav-link text-capitalize ${
                            activeTab === tab ? "active" : ""
                          }`}
                        >
                          {tab}
                          <span className="tp-product-tab-tooltip">
                            {count}
                          </span>
                        </button>
                      );
                    })}
                    <span
                      ref={marker}
                      id="productTabMarker"
                      className="tp-tab-line d-none d-sm-inline-block"
                    ></span>
                  </div>
                </nav>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          {current_product_items.map((prd) => (
            <div key={prd._id} className="col-lg-3 col-md-4 col-sm-6">
              <ProductItem product={prd} />
            </div>
          ))}
          {current_product_items.length === 0 && (
            <div className="col-12 text-center p-5 text-muted">
              Không có sản phẩm nào trong mục này.
            </div>
          )}
        </div>
      </>
    );
  }
  return (
    <>
      <section className="tp-best-area pb-60 pt-130">
        <div className="container">{content}</div>
      </section>
    </>
  );
};

export default ProductAreaTwo;
