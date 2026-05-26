const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const https = require('https');

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
  +role: String (user/admin)
  +contactNumber: String
  +shippingAddress: String
  +imageURL: String
  +phone: String
  +address: String
  +bio: String
  +status: String (active/inactive/blocked)
  +reviews: ObjectId[]
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
  +imageURLs: Object[]
  +parent: String
  +children: String
  +price: Number
  +discount: Number
  +quantity: Number
  +brand: BrandRefObject
  +category: CategoryRefObject
  +status: String (in-stock/out-of-stock/discontinued)
  +reviews: ObjectId[]
  +productType: String
  +description: String
  +videoId: String
  +tags: String[]
  +sizes: String[]
  +offerDate: Object
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
  +status: String (Show/Hide)
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
  +status: String (active/inactive)
  +products: ObjectId[] [ref: Products]
  +createdAt: Date
  +updatedAt: Date
}

class Reviews {
  +_id: ObjectId
  +userId: ObjectId
  +productId: ObjectId
  +rating: Number
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
  +status: String (active/inactive)
  +createdAt: Date
  +updatedAt: Date
}

class Order {
  +_id: ObjectId
  +user: ObjectId
  +cart: Object[]
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
  +status: String (pending/processing/delivered/cancel)
  +createdAt: Date
  +updatedAt: Date
}

class CartItem {
  +productId: ObjectId
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
skinparam sequenceMessageAlign center
skinparam responseMessageBelowArrow true

actor "Khách hàng" as Customer
participant "Giao diện Checkout\\n(React)" as UI
participant "Server API\\n(Express)" as Backend
database "Database\\n(MongoDB)" as DB

Customer -> UI: Nhập mã giảm giá\\nvà nhấn "Áp dụng"
activate UI

UI -> Backend: Gửi mã giảm giá\\nkèm giá trị đơn\\n(POST /api/coupon/use-coupon)
activate Backend

Backend -> DB: Tìm kiếm mã giảm giá\\ntrong collection Coupons
activate DB
DB --> Backend: Trả về thông tin mã
deactivate DB

alt Xác thực thành công & Đủ điều kiện đơn hàng
    Backend -> Backend: Tính số tiền giảm giá\\nvà áp dụng chiết khấu
    Backend --> UI: HTTP 200 OK
    
    UI --> Customer: Hiển thị thông báo\\n"Áp dụng thành công"
    UI -> UI: Tự động cập nhật tổng tiền\\nthanh toán hiển thị
    
else Lỗi hoặc không đủ điều kiện đơn tối thiểu
    Backend --> UI: HTTP 400 (Lỗi)
    UI --> Customer: Hiển thị thông báo Lỗi
end
deactivate Backend
deactivate UI
@enduml`
  },
  {
    name: 'submit_review_sequence.png',
    text: `@startuml
skinparam sequenceMessageAlign center
skinparam responseMessageBelowArrow true

actor "Khách hàng" as Customer
participant "Giao diện Chi tiết\\nSản phẩm (React)" as UI
participant "Server API\\n(Express)" as Backend
database "Database\\n(MongoDB)" as DB

Customer -> UI: Chọn số sao, viết bình luận\\nvà nhấn "Gửi đánh giá"
activate UI

UI -> Backend: Gửi dữ liệu nhận xét kèm JWT\\n(POST /api/review/add)
activate Backend

Backend -> Backend: Xác thực JWT & Quyền\\nngười dùng

alt Xác thực thành công
    Backend -> DB: Thêm mới Document vào\\ncollection Reviews
    activate DB
    DB --> Backend: Trả về kết quả thành công
    deactivate DB
    
    Backend -> DB: Cập nhật mảng reviews của\\nProduct tương ứng
    activate DB
    DB --> Backend: Trả về kết quả thành công
    deactivate DB
    
    Backend --> UI: HTTP 201 Created
    
    UI --> Customer: Hiển thị thông báo "Gửi\\nđánh giá thành công"
    
    UI -> Backend: Tự động gọi API lấy lại\\ndanh sách đánh giá (GET)
    Backend -> DB: Truy vấn danh sách mới
    activate DB
    DB --> Backend: Trả về danh sách
    deactivate DB
    Backend --> UI: Dữ liệu JSON danh sách
    
    UI -> UI: Cập nhật lại giao diện\\ndanh sách đánh giá & số sao TB

else Lỗi xác thực hoặc thiếu dữ liệu
    Backend --> UI: HTTP 401/400 (Lỗi)
    UI --> Customer: Hiển thị thông báo Lỗi
end
deactivate Backend
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

// 1. Generate URLs and print immediately
const urls = [];
diagrams.forEach(d => {
  const buffer = Buffer.from(d.text, 'utf8');
  const deflated = zlib.deflateRawSync(buffer);
  const encoded = encode64(deflated);
  d.url = `https://www.plantuml.com/plantuml/png/${encoded}`;
  urls.push(`${d.name}:\n${d.url}\n`);
});

// Write links to urls.txt
const urlsPath = path.join(__dirname, 'urls.txt');
fs.writeFileSync(urlsPath, urls.join('\n'), 'utf8');
console.log('--------------------------------------------------');
console.log('ĐÃ TẠO ĐƯỜNG DẪN TRỰC TIẾP (Xem và tải qua trình duyệt):');
console.log(`Đã ghi các đường dẫn vào file: ${urlsPath}\n`);
diagrams.forEach(d => {
  console.log(`- ${d.name}: \n  ${d.url}\n`);
});
console.log('--------------------------------------------------');

// 2. Download files asynchronously
function downloadDiagram(diagram) {
  return new Promise((resolve) => {
    const outputPath = path.join(__dirname, diagram.name);
    console.log(`Đang tải file: ${diagram.name} ...`);

    https.get(diagram.url, (response) => {
      if (response.statusCode !== 200) {
        console.error(`Lỗi khi tải ${diagram.name}: HTTP ${response.statusCode}`);
        resolve(); // resolve to continue other files
        return;
      }
      
      // Only create the file stream after ensuring status code is 200
      const file = fs.createWriteStream(outputPath);
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log(`Tải thành công: ${diagram.name}`);
        resolve();
      });
    }).on('error', (err) => {
      console.error(`Lỗi kết nối khi tải ${diagram.name}:`, err.message);
      resolve();
    });
  });
}

async function renderAll() {
  console.log('Bắt đầu quá trình tải ảnh...');
  for (const diagram of diagrams) {
    await downloadDiagram(diagram);
  }
  console.log('Hoàn tất kiểm tra tải ảnh!');
}

renderAll();
