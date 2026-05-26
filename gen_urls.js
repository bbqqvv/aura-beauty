const fs = require('fs');
const zlib = require('zlib');

const diagrams = [
  {
    name: 'database_uml.png',
    text: `@startuml
skinparam class {
    BackgroundColor White
    ArrowColor #2F4F4F
    BorderColor #2F4F4F
}
title Sơ đồ lớp cơ sở dữ liệu (Database Class Diagram) - Shofy E-commerce

class User {
  +_id: ObjectId
  +name: String
  +email: String {unique}
  +password: String
  +role: "user" | "admin"
  +contactNumber: String
  +shippingAddress: String
  +imageURL: String
  +phone: String
  +address: String
  +bio: String
  +status: "active" | "inactive" | "blocked"
  +reviews: ObjectId[] [ref: Reviews]
  +confirmationToken: String
  +confirmationTokenExpires: Date
  +createdAt: Date
  +updatedAt: Date
}

class Product {
  +_id: ObjectId
  +sku: String
  +img: String
  +title: String
  +slug: String
  +unit: String
  +imageURLs: ImageURLColor[]
  +parent: String
  +children: String
  +price: Number
  +discount: Number
  +quantity: Number
  +brand: BrandRefObject
  +category: CategoryRefObject
  +status: "in-stock" | "out-of-stock" | "discontinued"
  +reviews: ObjectId[] [ref: Reviews]
  +productType: String
  +description: String
  +videoId: String
  +tags: String[]
  +sizes: String[]
  +offerDate: OfferDateObject
  +featured: Boolean
  +sellCount: Number
  +createdAt: Date
  +updatedAt: Date
}

class Category {
  +_id: ObjectId
  +img: String
  +parent: String {unique}
  +slug: String {unique}
  +children: String[]
  +productType: String
  +description: String
  +products: ObjectId[] [ref: Products]
  +status: "Show" | "Hide"
  +createdAt: Date
  +updatedAt: Date
}

class Brand {
  +_id: ObjectId
  +logo: String
  +name: String {unique}
  +slug: String {unique}
  +description: String
  +email: String
  +website: String
  +location: String
  +status: "active" | "inactive"
  +products: ObjectId[] [ref: Products]
  +createdAt: Date
  +updatedAt: Date
}

class Reviews {
  +_id: ObjectId
  +userId: ObjectId [ref: User]
  +productId: ObjectId [ref: Products]
  +rating: Number (1..5)
  +comment: String
  +reply: String
  +createdAt: Date
  +updatedAt: Date
}

class Coupon {
  +_id: ObjectId
  +title: String
  +logo: String
  +couponCode: String
  +startTime: Date
  +endTime: Date
  +discountPercentage: Number
  +minimumAmount: Number
  +productType: String
  +status: "active" | "inactive"
  +createdAt: Date
  +updatedAt: Date
}

class Order {
  +_id: ObjectId
  +user: ObjectId [ref: User]
  +cart: CartItem[]
  +name: String
  +address: String
  +email: String
  +contact: String
  +city: String
  +country: String
  +zipCode: String
  +subTotal: Number
  +shippingCost: Number
  +discount: Number
  +totalAmount: Number
  +shippingOption: String
  +paymentMethod: String
  +orderNote: String
  +invoice: Number {unique}
  +status: "pending" | "processing" | "delivered" | "cancel"
  +createdAt: Date
  +updatedAt: Date
}

class CartItem {
  +productId: ObjectId [ref: Products]
  +title: String
  +price: Number
  +orderQuantity: Number
  +color: String
  +size: String
}

User "1" --> "0..*" Order : "đặt"
User "1" --> "0..*" Reviews : "viết"
Product "1" --> "0..*" Reviews : "nhận đánh giá"
Category "1" --> "0..*" Product : "phân loại"
Brand "1" --> "0..*" Product : "thuộc thương hiệu"
Order "1" *-- "1..*" CartItem : "chứa"
CartItem "0..*" --> "1" Product : "tham chiếu"
Order ..> Coupon : "áp dụng giảm giá từ"
@enduml`
  },
  {
    name: 'apply_coupon_sequence.png',
    text: `@startuml
autonumber
skinparam sequenceMessageAlign center
skinparam responseMessageBelowArrow true

actor "Khách hàng" as Customer
boundary "Giao diện Checkout" as UI
control "Coupon API (Redux)" as Redux
control "Coupon Controller" as Backend
database "Database (MongoDB)" as DB

Customer -> UI: Nhập mã giảm giá & click "Áp dụng"
activate UI
UI -> Redux: Gửi yêu cầu áp dụng mã (code, tổng tiền)
activate Redux
Redux -> Backend: HTTP POST /api/coupon/use-coupon { code, orderAmount }
activate Backend

Backend -> DB: Tìm kiếm mã (couponCode = code)
activate DB
DB --> Backend: Trả về thông tin mã giảm giá (Coupon Object)
deactivate DB

alt Không tìm thấy mã hoặc mã không ở trạng thái hoạt động
    Backend --> Redux: HTTP 400 { success: false, message: "Mã giảm giá không tồn tại hoặc đã bị khóa" }
else Mã hợp lệ trong DB
    Backend -> Backend: Kiểm tra điều kiện áp dụng:\n1. Thời hạn: startTime <= Hiện tại <= endTime\n2. Giá trị đơn tối thiểu: orderAmount >= minimumAmount
    alt Không thỏa mãn điều kiện
        Backend --> Redux: HTTP 400 { success: false, message: "Đơn hàng chưa đủ giá trị tối thiểu hoặc mã hết hạn" }
    else Thỏa mãn tất cả điều kiện
        Backend -> Backend: Tính toán số tiền giảm chiết khấu
        Backend --> Redux: HTTP 200 { success: true, discountPercentage, discountAmount }
    end
end
deactivate Backend

Redux -> UI: Cập nhật trạng thái Redux (lưu tiền giảm & cự khấu trừ)
deactivate Redux

UI -> UI: Tự động cập nhật tổng tiền thanh toán hiển thị
UI --> Customer: Hiển thị giá trị mới giảm trừ & thông báo thành công
deactivate UI
@enduml`
  },
  {
    name: 'submit_review_sequence.png',
    text: `@startuml
autonumber
skinparam sequenceMessageAlign center
skinparam responseMessageBelowArrow true

actor "Khách hàng" as Customer
boundary "Giao diện Chi tiết Sản phẩm" as UI
control "Review API (Redux)" as Redux
control "Review Controller" as Backend
database "Database (MongoDB)" as DB

Customer -> UI: Chọn số sao (1-5), viết nhận xét & bấm "Gửi đánh giá"
activate UI
UI -> Redux: Gửi yêu cầu thêm đánh giá (rating, comment, productId)
activate Redux
Redux -> Backend: HTTP POST /api/review/add { rating, comment, productId }
activate Backend

Backend -> Backend: Xác thực quyền hạn (đã đăng nhập) & tính hợp lệ dữ liệu

alt Chưa đăng nhập hoặc dữ liệu thiếu
    Backend --> Redux: HTTP 401/400 { success: false, message: "Yêu cầu đăng nhập hoặc điền đầy đủ thông tin" }
else Dữ liệu hợp lệ
    Backend -> DB: Lưu đánh giá mới vào collection Reviews (ReviewModel.create)
    activate DB
    DB --> Backend: Trả về dữ liệu Review đã lưu thành công
    deactivate DB
    
    Backend -> DB: Cập nhật mảng reviews của Product tương ứng (Product.findByIdAndUpdate)
    activate DB
    DB --> Backend: Trả về trạng thái cập nhật thành công
    deactivate DB
    
    Backend --> Redux: HTTP 201 { success: true, message: "Gửi đánh giá thành công" }
end
deactivate Backend

Redux -> UI: Dispatch action cập nhật danh sách đánh giá trong component
deactivate Redux

UI -> UI: Render lại giao diện hiển thị đánh giá mới nhất & điểm trung bình mới
UI --> Customer: Hiển thị thông báo gửi đánh giá thành công (Toast message)
deactivate UI
@enduml`
  }
];

function encode6bit(b) {
  if (b < 10) return String.fromCharCode(48 + b);
  b -= 10;
  if (b < 26) return String.fromCharCode(65 + b);
  b -= 26;
  if (b < 26) return String.fromCharCode(97 + b);
  b -= 26;
  if (b === 0) return '-';
  if (b === 1) return '_';
  return '?';
}

function append3bytes(b1, b2, b3) {
  let c1 = b1 >> 2;
  let c2 = ((b1 & 0x3) << 4) | (b2 >> 4);
  let c3 = ((b2 & 0xF) << 2) | (b3 >> 6);
  let c4 = b3 & 0x3F;
  return encode6bit(c1 & 0x3F) + encode6bit(c2 & 0x3F) + encode6bit(c3 & 0x3F) + encode6bit(c4 & 0x3F);
}

function encode64(data) {
  let r = "";
  for (let i = 0; i < data.length; i += 3) {
    if (i + 2 < data.length) {
      r += append3bytes(data[i], data[i + 1], data[i + 2]);
    } else if (i + 1 < data.length) {
      r += append3bytes(data[i], data[i + 1], 0);
    } else {
      r += append3bytes(data[i], 0, 0);
    }
  }
  return r;
}

let output = '';
diagrams.forEach(diagram => {
  const buffer = Buffer.from(diagram.text, 'utf8');
  const deflated = zlib.deflateRawSync(buffer);
  const encoded = encode64(deflated);
  const url = `https://www.plantuml.com/plantuml/png/${encoded}`;
  output += `${diagram.name}:\n${url}\n\n`;
});

fs.writeFileSync('urls.txt', output, 'utf8');
console.log('URLs written to urls.txt');
