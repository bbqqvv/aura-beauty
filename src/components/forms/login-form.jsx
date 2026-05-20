import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useRouter } from 'next/router';
import Link from 'next/link';
// internal
import { CloseEye, OpenEye } from '@/svg';
import ErrorMsg from '../common/error-msg';
import { useLoginUserMutation } from '@/redux/features/auth/authApi';
import { notifyError, notifySuccess } from '@/utils/toast';


// schema
const schema = Yup.object().shape({
  email: Yup.string().required().email().label("Email"),
  password: Yup.string().required().min(6).label("Password"),
});
const LoginForm = ({ redirectUrl }) => {
  const [showPass, setShowPass] = useState(false);
  const [loginUser, { }] = useLoginUserMutation();
  const router = useRouter();
  const { redirect } = router.query;
  // react hook form
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });
  // onSubmit
  const onSubmit = (data) => {
    loginUser({
      email: data.email,
      password: data.password,
    })
      .then((data) => {
        if (data?.data) {
          notifySuccess("Đăng nhập thành công");
          const userRole = data?.data?.data?.user?.role?.toLowerCase() || data?.data?.user?.role?.toLowerCase();
          const storedRedirect = typeof window !== 'undefined' ? sessionStorage.getItem('redirect_path') : null;
          
          if (typeof window !== 'undefined') {
            sessionStorage.removeItem('redirect_path');
          }
          
          if (userRole === 'admin') {
            router.push('/admin/dashboard');
          } else {
            router.push(redirectUrl || storedRedirect || redirect || "/");
          }
        }
        else {
          notifyError(data?.error?.data?.error || "Đăng nhập thất bại")
        }
      })
    reset();
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="tp-login-input-wrapper">
        <div className="tp-login-input-box">
          <div className="tp-login-input">
            <input {...register("email", { required: `Vui lòng nhập Email!` })} name="email" id="email" type="email" placeholder="email@example.com" />
          </div>
          <div className="tp-login-input-title">
            <label htmlFor="email">Địa chỉ Email</label>
          </div>
          <ErrorMsg msg={errors.email?.message} />
        </div>
        <div className="tp-login-input-box">
          <div className="p-relative">
            <div className="tp-login-input">
              <input
                {...register("password", { required: `Vui lòng nhập mật khẩu!` })}
                id="password"
                type={showPass ? "text" : "password"}
                placeholder="Tối thiểu 6 ký tự"
              />
            </div>
            <div className="tp-login-input-eye" id="password-show-toggle">
              <span className="open-eye" onClick={() => setShowPass(!showPass)}>
                {showPass ? <CloseEye /> : <OpenEye />}
              </span>
            </div>
            <div className="tp-login-input-title">
              <label htmlFor="password">Mật khẩu</label>
            </div>
          </div>
          <ErrorMsg msg={errors.password?.message}/>
        </div>
      </div>
      <div className="tp-login-suggetions d-sm-flex align-items-center justify-content-between mb-20">
        <div className="tp-login-remeber">
          <input id="remeber" type="checkbox" />
          <label htmlFor="remeber">Ghi nhớ tôi</label>
        </div>
        <div className="tp-login-forgot">
          <Link href="/forgot">Quên mật khẩu?</Link>
        </div>
      </div>
      <div className="tp-login-bottom">
        <button type='submit' className="tp-login-btn w-100">Đăng nhập</button>
      </div>
    </form>
  );
};

export default LoginForm;