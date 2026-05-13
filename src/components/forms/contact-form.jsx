import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useRouter } from "next/router";
// internal
import { CloseEye, OpenEye } from "@/svg";
import ErrorMsg from "../common/error-msg";
import { notifyError, notifySuccess } from "@/utils/toast";

// schema
const schema = Yup.object().shape({
  name: Yup.string().required().label("Name"),
  email: Yup.string().required().email().label("Email"),
  subject: Yup.string().required().label("Subject"),
  message: Yup.string().required().label("Subject"),
  remember: Yup.bool()
    .oneOf([true], "You must agree to the terms and conditions to proceed.")
    .label("Terms and Conditions"),
});

const ContactForm = () => {

    // react hook form
    const {register,handleSubmit,formState: { errors },reset} = useForm({
      resolver: yupResolver(schema),
    });
    // on submit
    const onSubmit = (data) => {
      if(data){
        notifySuccess('Tin nhắn đã được gửi thành công!');
      }

      reset();
    };

  return (
    <form onSubmit={handleSubmit(onSubmit)} id="contact-form">
      <div className="tp-contact-input-wrapper">
        <div className="tp-contact-input-box">
          <div className="tp-contact-input">
            <input {...register("name", { required: `Vui lòng nhập Họ tên!` })} name="name" id="name" type="text" placeholder="Họ và tên" />
          </div>
          <div className="tp-contact-input-title">
            <label htmlFor="name">Họ và tên</label>
          </div>
          <ErrorMsg msg={errors.name?.message} />
        </div>
        <div className="tp-contact-input-box">
          <div className="tp-contact-input">
            <input {...register("email", { required: `Vui lòng nhập Email!` })} name="email" id="email" type="email" placeholder="email@example.com" />
          </div>
          <div className="tp-contact-input-title">
            <label htmlFor="email">Địa chỉ Email</label>
          </div>
          <ErrorMsg msg={errors.email?.message} />
        </div>
        <div className="tp-contact-input-box">
          <div className="tp-contact-input">
            <input {...register("subject", { required: `Vui lòng nhập Chủ đề!` })} name="subject" id="subject" type="text" placeholder="Chủ đề của bạn" />
          </div>
          <div className="tp-contact-input-title">
            <label htmlFor="subject">Chủ đề</label>
          </div>
          <ErrorMsg msg={errors.subject?.message} />
        </div>
        <div className="tp-contact-input-box">
          <div className="tp-contact-input">
            <textarea {...register("message", { required: `Vui lòng nhập Tin nhắn!` })} id="message" name="message" placeholder="Nhập tin nhắn của bạn tại đây..."/>
          </div>
          <div className="tp-contact-input-title">
            <label htmlFor="message">Tin nhắn của bạn</label>
          </div>
          <ErrorMsg msg={errors.message?.message} />
        </div>
      </div>
      <div className="tp-contact-suggetions mb-20">
        <div className="tp-contact-remeber">
          <input  {...register("remember", {required: `Vui lòng đồng ý với điều khoản!`})} name="remember" id="remember" type="checkbox" />
          <label htmlFor="remember">Lưu tên, email và trang web của tôi trong trình duyệt này cho lần gửi tiếp theo.</label>
          <ErrorMsg msg={errors.remember?.message} />
        </div>
      </div>
      <div className="tp-contact-btn">
        <button type="submit">Gửi tin nhắn</button>
      </div>
    </form>
  );
};

export default ContactForm;