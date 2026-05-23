import dayjs from "dayjs";
import Link from "next/link";
import React from "react";

const MyOrders = ({ orderData }) => {
  const order_items = orderData?.orders;
  return (
    <div className="profile__ticket table-responsive">
      {!order_items ||
        (order_items?.length === 0 && (
          <div
            style={{ height: "210px" }}
            className="d-flex align-items-center justify-content-center"
          >
            <div className="text-center">
              <i
                style={{ fontSize: "30px" }}
                className="fa-solid fa-cart-circle-xmark"
              ></i>
              <p>You Have no order Yet!</p>
            </div>
          </div>
        ))}
      {order_items && order_items?.length > 0 && (
        <table className="table">
          <thead>
            <tr>
              <th scope="col">Order Id</th>
              <th scope="col">Order Time</th>
              <th scope="col">Status</th>
              <th scope="col">View</th>
            </tr>
          </thead>
          <tbody>
            {order_items.map((item, i) => (
              <tr key={i}>
                <th scope="row">#{item._id.substring(20, 25)}</th>
                <td data-info="title">
                  {dayjs(item.createdAt).format("MMMM D, YYYY")}
                </td>
                <td
                  data-info={`status ${item.status?.toLowerCase() === "pending" ? "pending" : ""}  ${item.status?.toLowerCase() === "processing" ? "hold" : ""}  ${item.status?.toLowerCase() === "delivered" ? "done" : ""}`}
                  className={`status ${item.status?.toLowerCase() === "pending" ? "pending" : ""} ${item.status?.toLowerCase() === "processing" ? "hold" : ""}  ${item.status?.toLowerCase() === "delivered" ? "done" : ""}`}
                >
                  {item.status}
                </td>
                <td>
                  <div className="d-flex align-items-center gap-2">
                    <Link href={`/order/${item._id}`} className="tp-logout-btn" style={{ padding: '6px 12px', fontSize: '13px', whiteSpace: 'nowrap' }}>
                      Invoice
                    </Link>
                    {item.status?.toLowerCase() === "delivered" && (
                      <Link href={`/order/${item._id}?review=true`} className="tp-btn tp-btn-black" style={{ padding: '6px 14px', fontSize: '13px', backgroundColor: 'var(--tp-theme-primary)', borderColor: 'var(--tp-theme-primary)', color: '#fff', whiteSpace: 'nowrap' }}>
                        Đánh giá
                      </Link>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MyOrders;
