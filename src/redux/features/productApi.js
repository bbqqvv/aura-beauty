import { apiSlice } from "../api/apiSlice";

export const productApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getAllProducts: builder.query({
      query: () => `/api/product/all`,
      providesTags:['Products']
    }),
    getProductType: builder.query({
      query: ({ type, query }) => `/api/product/${type}?${query}`,
      providesTags:['ProductType']
    }),
    getOfferProducts: builder.query({
      query: (type) => `/api/product/offer?type=${type}`,
      providesTags:['OfferProducts']
    }),
    getPopularProductByType: builder.query({
      query: (type) => `/api/product/popular/${type}`,
      providesTags:['PopularProducts']
    }),
    getTopRatedProducts: builder.query({
      query: () => `/api/product/top-rated`,
      providesTags:['TopRatedProducts']
    }),
    // get single product
    getProduct: builder.query({
      query: (id) => `/api/product/single-product/${id}`,
      providesTags: (result, error, arg) => [{ type: "Product", id: arg }],
      invalidatesTags: (result, error, arg) => [
        { type: "RelatedProducts", id:arg },
      ],
    }),
    // get related products
    getRelatedProducts: builder.query({
      query: (id) => `/api/product/related-product/${id}`,
      providesTags: (result, error, arg) => [
        { type: "RelatedProducts", id: arg },
      ],
    }),
    // delete product
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/api/product/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Products', 'ProductType', 'TopRatedProducts', 'OfferProducts'],
    }),
    // add product
    addProduct: builder.mutation({
      query: (data) => ({
        url: `/api/product/add`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Products', 'ProductType'],
    }),
    // update product
    updateProduct: builder.mutation({
      query: ({ id, data }) => ({
        url: `/api/product/edit-product/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Products', 'ProductType', 'Product', 'RelatedProducts'],
    }),
  }),
});

export const {
  useGetAllProductsQuery,
  useGetProductTypeQuery,
  useGetOfferProductsQuery,
  useGetPopularProductByTypeQuery,
  useGetTopRatedProductsQuery,
  useGetProductQuery,
  useGetRelatedProductsQuery,
  useDeleteProductMutation,
  useAddProductMutation,
  useUpdateProductMutation,
} = productApi;
