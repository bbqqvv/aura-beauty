import React from "react";
import { useRouter } from "next/router";
import useSearchFormSubmit from "@/hooks/use-search-form-submit";
import { useGetAllProductsQuery } from "@/redux/features/productApi";

const SearchBar = ({ isSearchOpen, setIsSearchOpen }) => {
  const router = useRouter();
  const { setSearchText, handleSubmit, searchText } = useSearchFormSubmit();
  const { data: productsData, isLoading, isError } = useGetAllProductsQuery();

  const categories = [
    { name: "Premium Skincare", label: "Chăm sóc da", slug: "premium-skincare" },
    { name: "Makeup", label: "Trang điểm", slug: "makeup" },
    { name: "Haircare", label: "Chăm sóc tóc", slug: "haircare" },
    { name: "Fragrance", label: "Nước hoa", slug: "fragrance" }
  ];

  const handleCategoryClick = (slug) => {
    setIsSearchOpen(false);
    router.push(`/shop?category=${slug}`);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleSubmit(e);
    setIsSearchOpen(false);
  };

  const handleProductClick = (id) => {
    setIsSearchOpen(false);
    setSearchText("");
    router.push(`/product-details/${id}`);
  };

  const allProducts = productsData?.data || [];
  const searchResults = searchText.trim()
    ? allProducts.filter(prd => prd.title?.toLowerCase().includes(searchText.toLowerCase())).slice(0, 5)
    : [];

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        .tp-search-item {
          cursor: pointer;
          border-bottom: 1px solid rgba(0, 0, 0, 0.04);
          padding: 8px 10px;
          border-radius: 8px;
          background-color: transparent;
          transition: all 0.2s ease-in-out !important;
        }
        .tp-search-item:hover {
          background-color: #f7f5f2 !important;
          transform: translateX(4px);
        }
        .tp-search-item:last-child {
          border-bottom: none;
        }
        .text-truncate-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;  
          overflow: hidden;
        }
        .tp-search-results-dropdown::-webkit-scrollbar {
          width: 6px;
        }
        .tp-search-results-dropdown::-webkit-scrollbar-track {
          background: transparent;
        }
        .tp-search-results-dropdown::-webkit-scrollbar-thumb {
          background-color: rgba(0, 0, 0, 0.15);
          border-radius: 10px;
        }
      `}} />
      <section
        className={`tp-search-area tp-search-style-brown ${
          isSearchOpen ? "opened" : ""
        }`}
      >
        <div className="container">
          <div className="row">
            <div className="col-xl-12">
              <div className="tp-search-form">
                <div
                  onClick={() => setIsSearchOpen(false)}
                  className="tp-search-close text-center mb-20"
                >
                  <button className="tp-search-close-btn tp-search-close-btn"></button>
                </div>
                <form onSubmit={handleFormSubmit}>
                  <div style={{ position: "relative" }}>
                    <div className="tp-search-input mb-10">
                      <input
                        onChange={(e) => setSearchText(e.target.value)}
                        value={searchText}
                        type="text"
                        placeholder="Tìm kiếm sản phẩm..."
                      />
                      <button type="submit">
                        <i className="flaticon-search-1"></i>
                      </button>
                    </div>

                    {/* Real-time search results dropdown */}
                    {searchText.trim() && (
                      <div className="tp-search-results-dropdown" style={{
                        position: 'absolute',
                        top: '100%',
                        left: '0',
                        width: '100%',
                        background: '#ffffff',
                        borderRadius: '12px',
                        boxShadow: '0 15px 35px rgba(0, 0, 0, 0.1)',
                        zIndex: 999,
                        marginTop: '10px',
                        padding: '15px',
                        border: '1px solid rgba(0, 0, 0, 0.05)',
                        maxHeight: '380px',
                        overflowY: 'auto'
                      }}>
                        {isLoading && (
                          <div className="text-center py-3 text-muted">
                            <div className="spinner-border spinner-border-sm text-primary me-2" role="status" style={{ color: '#825a2c' }}></div>
                            <span>Đang tìm kiếm...</span>
                          </div>
                        )}
                        
                        {!isLoading && isError && (
                          <div className="text-center py-3 text-danger">Đã xảy ra lỗi khi tải sản phẩm.</div>
                        )}
                        
                        {!isLoading && !isError && searchResults.length === 0 && (
                          <div className="text-center py-3 text-muted">Không tìm thấy sản phẩm nào phù hợp.</div>
                        )}
                        
                        {!isLoading && !isError && searchResults.length > 0 && (
                          <div className="d-flex flex-column gap-2">
                            {searchResults.map((product) => {
                              const { _id, img, title, price, discount } = product;
                              const discountedPrice = discount > 0 ? price - (price * discount) / 100 : price;
                              
                              return (
                                <div
                                  key={_id}
                                  onClick={() => handleProductClick(_id)}
                                  className="d-flex align-items-center gap-3 tp-search-item"
                                >
                                  <div className="flex-shrink-0" style={{ width: '50px', height: '50px', position: 'relative' }}>
                                    <img
                                      src={img}
                                      alt={title}
                                      style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                        borderRadius: '8px'
                                      }}
                                    />
                                  </div>
                                  <div className="flex-grow-1 text-start">
                                    <h4 style={{
                                      fontSize: '14px',
                                      fontWeight: '500',
                                      color: '#1a1a1a',
                                      margin: '0 0 4px 0',
                                      lineHeight: '1.4'
                                    }} className="text-truncate-2">
                                      {title}
                                    </h4>
                                    <div className="d-flex align-items-center gap-2">
                                      <span style={{ fontSize: '14px', fontWeight: '600', color: '#825a2c' }}>
                                        ${discountedPrice.toFixed(2)}
                                      </span>
                                      {discount > 0 && (
                                        <span style={{ fontSize: '12px', textDecoration: 'line-through', color: '#a0a0a0' }}>
                                          ${price.toFixed(2)}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                  <div className="flex-shrink-0">
                                    <i className="flaticon-right-arrow text-muted" style={{ fontSize: '12px' }}></i>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="tp-search-category">
                    <span>Tìm kiếm theo: </span>
                    {categories.map((c, i) => (
                      <a
                        key={i}
                        onClick={() => handleCategoryClick(c.slug)}
                        className="cursor-pointer"
                      >
                        {c.label}
                        {i < categories.length - 1 && ", "}
                      </a>
                    ))}
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* body overlay */}
      <div
        onClick={() => setIsSearchOpen(false)}
        className={`body-overlay ${isSearchOpen ? "opened" : ""}`}
      ></div>
    </>
  );
};

export default SearchBar;
