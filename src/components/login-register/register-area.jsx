import React from "react";
import Link from "next/link";
// internal
import LoginShapes from "./login-shapes";
import RegisterForm from "../forms/register-form";
import GoogleSignUp from "./google-sign-up";


const RegisterArea = () => {
  return (
    <>
      <section className="tp-login-area pb-140 p-relative z-index-1 fix">
        <LoginShapes />
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-xl-6 col-lg-8">
              <div className="tp-login-wrapper">
                <div className="tp-login-top text-center mb-30">
                  <h3 className="tp-login-title">Đăng ký Aura.</h3>
                  <p>
                    Đã có tài khoản?{" "}
                    <span>
                      <Link href="/login">Đăng nhập</Link>
                    </span>
                  </p>
                </div>
                <div className="tp-login-option">
                  <div className="tp-login-social mb-10 d-flex flex-wrap align-items-center justify-content-center">
                    <div className="tp-login-option-item has-google">
                      <GoogleSignUp/>
                    </div>
                  </div>
                  <div className="tp-login-mail text-center mb-40">
                    <p>
                      hoặc Đăng ký bằng <a href="#">Email</a>
                    </p>
                  </div>
                  {/* form start */}
                  <RegisterForm />
                  {/* form end */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default RegisterArea;
