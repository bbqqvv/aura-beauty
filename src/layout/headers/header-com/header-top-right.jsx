import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { userLoggedOut } from "@/redux/features/auth/authSlice";



// setting
function ProfileSetting({active,handleActive}) {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();
  // handle logout
  const handleLogout = () => {
    dispatch(userLoggedOut());
    router.push('/')
  }
  return (
    <div className="tp-header-top-menu-item tp-header-setting">
      <span
        onClick={() => handleActive('setting')}
        className="tp-header-setting-toggle"
        id="tp-header-setting-toggle"
      >
        Cài đặt
      </span>
      <ul className={active === 'setting' ? "tp-setting-list-open" : ""}>
        <li>
          <Link href="/profile">Hồ sơ của tôi</Link>
        </li>
        <li>
          <Link href="/wishlist">Yêu thích</Link>
        </li>
        <li>
          <Link href="/cart">Giỏ hàng</Link>
        </li>
        <li>
          {!user?.name &&<Link href="/login" className="cursor-pointer">Đăng nhập</Link>}
          {user?.name &&<a onClick={handleLogout} className="cursor-pointer">Đăng xuất</a>}
        </li>
      </ul>
    </div>
  );
}

const HeaderTopRight = () => {
  const [active, setIsActive] = useState('');
  // handle active
  const handleActive = (type) => {
    if(type === active){
      setIsActive('')
    }
    else {
      setIsActive(type)
    }
  }
  return (
    <div className="tp-header-top-menu d-flex align-items-center justify-content-end">
      <ProfileSetting active={active} handleActive={handleActive} />
    </div>
  );
};

export default HeaderTopRight;
