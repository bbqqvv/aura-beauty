import React from "react";
import useSearchFormSubmit from "@/hooks/use-search-form-submit";

const SearchBar = ({ isSearchOpen, setIsSearchOpen }) => {
  const { setSearchText, setCategory, handleSubmit, searchText } =
    useSearchFormSubmit();

  // selectHandle
  const handleCategory = (value) => {
    setCategory(value);
  };

  const categories = ["electronics", "fashion", "beauty", "jewelry"];
  return (
    <>
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
                <form onSubmit={handleSubmit}>
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
                  <div className="tp-search-category">
                    <span>Tìm kiếm theo: </span>
                    {categories.map((c, i) => (
                      <a
                        key={i}
                        onClick={() => handleCategory(c)}
                        className="cursor-pointer"
                      >
                        {c === "electronics" ? "điện tử" : c === "fashion" ? "thời trang" : c === "beauty" ? "sắc đẹp" : c === "jewelry" ? "trang sức" : c}
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
