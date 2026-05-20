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
    single_link: true,
    title: 'Sản phẩm',
    link: '/shop',
  },
  {
    id: 3,
    single_link: true,
    title: 'Cửa hàng',
    link: '/our-stores',
  },
  {
    id: 4,
    single_link: true,
    title: 'Mã giảm giá',
    link: '/coupon',
  },
  {
    id: 5,
    single_link: true,
    title: 'Blog',
    link: '/blog',
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
    single_link: true,
    title: 'Sản phẩm',
    link: '/shop',
  },
  {
    id: 3,
    single_link: true,
    title: 'Cửa hàng',
    link: '/our-stores',
  },
  {
    id: 4,
    single_link: true,
    title: 'Mã giảm giá',
    link: '/coupon',
  },
  {
    id: 5,
    single_link: true,
    title: 'Blog',
    link: '/blog',
  },
  {
    id: 6,
    single_link: true,
    title: 'Liên hệ',
    link: '/contact',
  },
]