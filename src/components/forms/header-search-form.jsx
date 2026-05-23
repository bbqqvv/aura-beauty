import { useState } from "react";
import { useRouter } from "next/router";
// internal
import { Search } from "@/svg";
import NiceSelect from "@/ui/nice-select";
import useSearchFormSubmit from "@/hooks/use-search-form-submit";
import { useGetAllProductsQuery } from "@/redux/features/productApi";

const HeaderSearchForm = () => {
  const router = useRouter();
  const { setSearchText, setCategory, handleSubmit, searchText } = useSearchFormSubmit();
  const { data: productsData, isLoading, isError } = useGetAllProductsQuery();

  // selectHandle
  const selectCategoryHandle = (e) => {
    setCategory(e.value);
  };

  const handleProductClick = (id) => {
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
      <form onSubmit={handleSubmit} style={{ position: "relative" }}>
        <div className="tp-header-search-wrapper d-flex align-items-center">
          <div className="tp-header-search-box" style={{ position: "relative", flexGrow: 1 }}>
            <input
              onChange={(e) => setSearchText(e.target.value)}
              value={searchText}
              type="text"
              placeholder="Search for Products..."
            />
            
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
                          <div className="flex-shrink-0" style={{ width: '40px', height: '40px', position: 'relative' }}>
                            <img
                              src={img}
                              alt={title}
                              style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                borderRadius: '6px'
                              }}
                            />
                          </div>
                          <div className="flex-grow-1 text-start">
                            <h4 style={{
                              fontSize: '13px',
                              fontWeight: '500',
                              color: '#1a1a1a',
                              margin: '0 0 2px 0',
                              lineHeight: '1.3'
                            }} className="text-truncate-2">
                              {title}
                            </h4>
                            <div className="d-flex align-items-center gap-2">
                              <span style={{ fontSize: '13px', fontWeight: '600', color: '#825a2c' }}>
                                ${discountedPrice.toFixed(2)}
                              </span>
                              {discount > 0 && (
                                <span style={{ fontSize: '11px', textDecoration: 'line-through', color: '#a0a0a0' }}>
                                  ${price.toFixed(2)}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="tp-header-search-category">
            <NiceSelect
              options={[
                { value: "Select Category", text: "Select Category" },
                { value: "electronics", text: "electronics" },
                { value: "fashion", text: "fashion" },
                { value: "beauty", text: "beauty" },
                { value: "jewelry", text: "jewelry" },
              ]}
              defaultCurrent={0}
              onChange={selectCategoryHandle}
              name="Select Category"
            />
          </div>
          <div className="tp-header-search-btn">
            <button type="submit">
              <Search />
            </button>
          </div>
        </div>
      </form>
    </>
  );
};

export default HeaderSearchForm;
