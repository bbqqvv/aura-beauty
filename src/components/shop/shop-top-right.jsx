import React from "react";
import { useDispatch } from "react-redux";
// internal
import { Filter } from "@/svg";
import NiceSelect from "@/ui/nice-select";
import {handleFilterSidebarOpen } from "@/redux/features/shop-filter-slice";

const ShopTopRight = ({selectHandleFilter, isSidebar}) => {
  const dispatch = useDispatch()
  return (
    <div className="tp-shop-top-right d-sm-flex align-items-center justify-content-xl-end">
      <div className="tp-shop-top-select">
        <NiceSelect
          options={[
            { value: "Default Sorting", text: "Sắp xếp mặc định" },
            { value: "Low to High", text: "Giá thấp đến cao" },
            { value: "High to Low", text: "Giá cao đến thấp" },
            { value: "New Added", text: "Mới nhất" },
            { value: "On Sale", text: "Đang giảm giá" },
          ]}
          defaultCurrent={0}
          onChange={selectHandleFilter}
          name="Sắp xếp mặc định"
        />
      </div>
      <div className={`tp-shop-top-filter ${isSidebar ? 'd-lg-none' : ''}`}>
        <button onClick={()=> dispatch(handleFilterSidebarOpen())} type="button" className="tp-filter-btn">
          <span>
            <Filter />
          </span>
          {" "}Lọc
        </button>
      </div>
    </div>
  );
};

export default ShopTopRight;
