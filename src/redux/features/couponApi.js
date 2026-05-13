import { apiSlice } from "../api/apiSlice";

export const couponApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getAllCoupons: builder.query({
      query: () => `/api/coupon`,
      providesTags: ['Coupons']
    }),
    addCoupon: builder.mutation({
      query: (data) => ({
        url: `/api/coupon/add`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Coupons'],
    }),
    updateCoupon: builder.mutation({
      query: ({ id, data }) => ({
        url: `/api/coupon/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Coupons'],
    }),
    deleteCoupon: builder.mutation({
      query: (id) => ({
        url: `/api/coupon/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Coupons'],
    }),
  }),
});

export const {
  useGetAllCouponsQuery,
  useAddCouponMutation,
  useUpdateCouponMutation,
  useDeleteCouponMutation,
} = couponApi;
