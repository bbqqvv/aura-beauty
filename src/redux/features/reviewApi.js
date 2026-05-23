import { apiSlice } from "../api/apiSlice";

export const reviewApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    addReview: builder.mutation({
      query: (data) => ({
        url: "/api/review/add",
        method: "POST",
        body: data,
      }),
      invalidatesTags: (result, error, arg) => ["Products",{ type: "Product", id: arg.productId }],
    }),
    getAllReviews: builder.query({
      query: () => `/api/review/all`,
      providesTags: ["Reviews"],
    }),
    deleteReview: builder.mutation({
      query: (id) => ({
        url: `/api/review/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Reviews", "Products"],
    }),
    replyReview: builder.mutation({
      query: ({ id, reply }) => ({
        url: `/api/review/reply/${id}`,
        method: "PUT",
        body: { reply },
      }),
      invalidatesTags: ["Reviews", "Products"],
    }),
  }),
});

export const {useAddReviewMutation, useGetAllReviewsQuery, useDeleteReviewMutation, useReplyReviewMutation} = reviewApi;
