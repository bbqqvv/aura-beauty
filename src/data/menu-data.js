import home_1 from '@assets/img/menu/menu-home-1.jpg';
import home_2 from '@assets/img/menu/menu-home-2.jpg';
import home_3 from '@assets/img/menu/menu-home-3.jpg';
import home_4 from '@assets/img/menu/menu-home-4.jpg';

const menu_data = [
  {
    id: 1,
    homes: true,
    title: 'Trang chủ',
    link: '/',
    home_pages: [
      {
        img: home_1,
        title: 'Điện tử',
        link: '/'
      },
      {
        img: home_2,
        title: 'Thời trang',
        link: '/home-2'
      },
      {
        img: home_3,
        title: 'Sắc đẹp',
        link: '/home-3'
      },
      {
        img: home_4,
        title: 'Trang sức',
        link: '/home-4'
      }
    ]
  },
  {
    id: 2,
    products: true,
    title: 'Sản phẩm',
    link: '/shop',
    product_pages: [
      {
        title: 'Trang cửa hàng',
        link: '/shop',
        mega_menus: [
          { title: 'Chỉ danh mục', link: '/shop-category' },
          { title: 'Cửa hàng có thanh bên', link: '/shop' },
          { title: 'Chi tiết sản phẩm', link: '/product-details' },
        ]
      },
      {
        title: 'Sản phẩm',
        link: '/product-details',
        mega_menus: [
          { title: 'Sản phẩm đơn giản', link: '/product-details' },
          { title: 'Có Video', link: '/product-details-video' },
          { title: 'Có đồng hồ đếm ngược', link: '/product-details-countdown' },
          { title: 'Biến thể màu sắc', link: '/product-details-swatches' },
        ]
      },
      {
        title: 'Thương mại điện tử',
        link: '/shop',
        mega_menus: [
          { title: 'Giỏ hàng', link: '/cart' },
          { title: 'So sánh', link: '/compare' },
          { title: 'Yêu thích', link: '/wishlist' },
          { title: 'Thanh toán', link: '/checkout' },
          { title: 'Tài khoản của tôi', link: '/profile' },
        ]
      },
      {
        title: 'Trang khác',
        link: '/shop',
        mega_menus: [
          { title: 'Đăng nhập', link: '/login' },
          { title: 'Đăng ký', link: '/register' },
          { title: 'Quên mật khẩu', link: '/forgot' },
          { title: 'Lỗi 404', link: '/404' },
        ]
      },
    ]
  },
  {
    id: 3,
    sub_menu: true,
    title: 'Cửa hàng',
    link: '/shop',
    sub_menus: [
      { title: 'Cửa hàng', link: '/shop' },
      { title: 'Thanh bên phải', link: '/shop-right-sidebar' },
      { title: 'Thanh bên ẩn', link: '/shop-hidden-sidebar' },
    ],
  },
  {
    id: 4,
    single_link: true,
    title: 'Mã giảm giá',
    link: '/coupon',
  },
  {
    id: 5,
    sub_menu: true,
    title: 'Blog',
    link: '/blog',
    sub_menus: [
      { title: 'Blog tiêu chuẩn', link: '/blog' },
      { title: 'Blog lưới', link: '/blog-grid' },
      { title: 'Blog danh sách', link: '/blog-list' },
      { title: 'Chi tiết blog', link: '/blog-details' },
      { title: 'Chi tiết blog rộng', link: '/blog-details-2' },
    ]
  },
  {
    id: 6,
    single_link: true,
    title: 'Liên hệ',
    link: '/contact',
  },
]

export default menu_data;

// mobile_menu
export const mobile_menu = [
  {
    id: 1,
    homes: true,
    title: 'Trang chủ',
    link: '/',
    home_pages: [
      {
        img: home_1,
        title: 'Điện tử',
        link: '/'
      },
      {
        img: home_2,
        title: 'Thời trang',
        link: '/home-2'
      },
      {
        img: home_3,
        title: 'Sắc đẹp',
        link: '/home-3'
      },
      {
        img: home_4,
        title: 'Trang sức',
        link: '/home-4'
      }
    ]
  },
  {
    id: 2,
    sub_menu: true,
    title: 'Sản phẩm',
    link: '/shop',
    sub_menus: [
      { title: 'Cửa hàng', link: '/shop' },
      { title: 'Thanh bên phải', link: '/shop-right-sidebar' },
      { title: 'Thanh bên ẩn', link: '/shop-hidden-sidebar' },
      { title: 'Chỉ danh mục', link: '/shop-category' },
      { title: 'Sản phẩm đơn giản', link: '/product-details' },
      { title: 'Có Video', link: '/product-details-video' },
      { title: 'Có đồng hồ đếm ngược', link: '/product-details-countdown' },
      { title: 'Biến thể màu sắc', link: '/product-details-swatches' },
    ],
  },
  {
    id: 3,
    sub_menu: true,
    title: 'Thương mại điện tử',
    link: '/cart',
    sub_menus: [
      { title: 'Giỏ hàng', link: '/cart' },
      { title: 'So sánh', link: '/compare' },
      { title: 'Yêu thích', link: '/wishlist' },
      { title: 'Thanh toán', link: '/checkout' },
      { title: 'Tài khoản của tôi', link: '/profile' },
    ],
  },
  {
    id: 4,
    sub_menu: true,
    title: 'Trang khác',
    link: '/login',
    sub_menus: [
      { title: 'Đăng nhập', link: '/login' },
      { title: 'Đăng ký', link: '/register' },
      { title: 'Quên mật khẩu', link: '/forgot' },
      { title: 'Lỗi 404', link: '/404' },
    ],
  },
  {
    id: 4,
    single_link: true,
    title: 'Mã giảm giá',
    link: '/coupon',
  },
  {
    id: 5,
    sub_menu: true,
    title: 'Blog',
    link: '/blog',
    sub_menus: [
      { title: 'Blog tiêu chuẩn', link: '/blog' },
      { title: 'Blog lưới', link: '/blog-grid' },
      { title: 'Blog danh sách', link: '/blog-list' },
      { title: 'Chi tiết blog', link: '/blog-details' },
      { title: 'Chi tiết blog rộng', link: '/blog-details-2' },
    ]
  },
  {
    id: 6,
    single_link: true,
    title: 'Liên hệ',
    link: '/contact',
  },
]