import { useState, useEffect } from "react";
// internal
import BlogSidebar from "./blog-sidebar";
import Pagination from "@/ui/Pagination";
import BlogItem from "./blog-item";
import { useGetAllBlogsQuery } from "@/redux/features/blogApi";

const BlogPostboxArea = () => {
  const { data: blogsData, isLoading } = useGetAllBlogsQuery();
  const blog_items = blogsData?.result || [];
  
  const [filteredRows, setFilteredRows] = useState([]);
  const [currPage, setCurrPage] = useState(1);
  const [pageStart, setPageStart] = useState(0);
  const [countOfPage, setCountOfPage] = useState(4);

  useEffect(() => {
    if (blog_items.length > 0) {
      setFilteredRows(blog_items);
    }
  }, [blog_items]);

  const paginatedData = (items, startPage, pageCount) => {
    setFilteredRows(items);
    setPageStart(startPage);
    setCountOfPage(pageCount);
  };

  if (isLoading) return <div className="text-center pt-100 pb-100">Đang tải bài viết...</div>;

  return (
    <>
      <section className="tp-postbox-area pt-120 pb-120">
        <div className="container">
          <div className="row">
            <div className="col-xl-9 col-lg-8">
              <div className="tp-postbox-wrapper pr-50">
                {filteredRows.slice(pageStart, pageStart + countOfPage).map((item) => (
                  <BlogItem key={item.id} item={item} />
                ))}
                <div className="tp-blog-pagination mt-50">
                  <div className="tp-pagination">
                    <Pagination
                      items={blog_items}
                      countOfPage={4}
                      paginatedData={paginatedData}
                      currPage={currPage}
                      setCurrPage={setCurrPage}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-lg-4">
              <BlogSidebar />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default BlogPostboxArea;
