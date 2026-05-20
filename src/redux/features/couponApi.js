import { apiSlice } from "../api/apiSlice";

export const couponApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getAllCoupons: builder.query({
      query: () => `/api/coupon`,
      providesTags: ['Coupon']
    }),
    addCoupon: builder.mutation({
      query: (data) => ({
        url: `/api/coupon/add`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Coupon'],
    }),
    updateCoupon: builder.mutation({
      query: ({ id, data }) => ({
        url: `/api/coupon/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Coupon'],
    }),
    deleteCoupon: builder.mutation({
      query: (id) => ({
        url: `/api/coupon/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Coupon'],
    }),
  }),
});

export const {
  useGetAllCouponsQuery,
  useAddCouponMutation,
  useUpdateCouponMutation,
  useDeleteCouponMutation,
} = couponApi;
