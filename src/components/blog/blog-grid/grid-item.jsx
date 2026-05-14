import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRightLong, Comment, Date } from "@/svg";
// internal

const GridItem = ({ blog,style_2=false }) => {
  const {_id: id, img, date, comments, author, title, desc } = blog || {};
  return (
    <>
      <div className={`tp-blog-grid-item ${style_2?'tp-blog-grid-style2':''} p-relative mb-30`}>
        <div className="tp-blog-grid-thumb fix mb-30">
          <Link href={`/blog-details/${id}`}>
            <img src={img} alt="blog img" style={{width:'100%',height:'100%'}} />
          </Link>
        </div>
        <div className="tp-blog-grid-content">
          <div className="tp-blog-grid-meta">
            <span>
              <span>
                <Date/>
              </span>
              {" "}{new globalThis.Date(date).toLocaleDateString("en-US", {year: "numeric", month: "long", day: "numeric"})}
            </span>
            <span>
              <span>
                <Comment/>
              </span>
              {" "} Comments ({comments})
            </span>
          </div>
          <h3 className="tp-blog-grid-title">
            <Link href={`/blog-details/${id}`}>{title}</Link>
          </h3>
          <div dangerouslySetInnerHTML={{__html: desc}} />

          <div className="tp-blog-grid-btn">
            <Link href={`/blog-details/${id}`} className="tp-link-btn-3">
              Read More{" "}
              <span>
                <ArrowRightLong />
              </span>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default GridItem;
