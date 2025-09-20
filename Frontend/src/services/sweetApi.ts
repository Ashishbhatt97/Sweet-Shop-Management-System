import { ApiResponse } from "@/types/apiResponse";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

interface Sweet {
  id: string;
  name: string;
  price: number;
  quantity: number;
  category: string;
  image?: string;
}

interface AddSweetRequest {
  name: string;
  price: number;
  category: string;
  quantity: number;
}

const baseUrl = import.meta.env.VITE_API_URL;

export const sweetsApi = createApi({
  reducerPath: "sweetsApi",
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Sweets"],
  endpoints: (builder) => ({
    getSweets: builder.query<ApiResponse<Sweet[]>, void>({
      query: () => "/sweets",
      providesTags: ["Sweets"],
    }),
    addSweet: builder.mutation<ApiResponse<Sweet>, AddSweetRequest>({
      query: (newSweet) => ({
        url: "/sweets",
        method: "POST",
        body: newSweet,
      }),
      invalidatesTags: ["Sweets"],
    }),
    getFilteredSweets: builder.query<
      ApiResponse<Sweet[]>,
      {
        search?: string;
        category?: string;
        minPrice?: number;
        maxPrice?: number;
      }
    >({
      query: (filters) => ({
        url: "/sweets/search",
        params: filters,
      }),
      providesTags: ["Sweets"],
    }),
    restockSweet: builder.mutation<
      ApiResponse<Sweet>,
      { id: string; quantity: number }
    >({
      query: (updatedSweet) => ({
        url: `/sweets/${updatedSweet.id}`,
        method: "PUT",
        body: updatedSweet,
      }),
      invalidatesTags: ["Sweets"],
    }),
    updateSweet: builder.mutation<ApiResponse<Sweet>, Sweet>({
      query: (updatedSweet) => ({
        url: `/sweets/${updatedSweet.id}`,
        method: "PUT",
        body: updatedSweet,
      }),
      invalidatesTags: ["Sweets"],
    }),
    deleteSweet: builder.mutation<void, string>({
      query: (id) => ({
        url: `/sweets/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Sweets"],
    }),
    purchaseSweet: builder.mutation<
      ApiResponse<Sweet>,
      { id: string; quantity: number }
    >({
      query: ({ id, quantity }) => ({
        url: `/sweets/${id}/purchase`,
        method: "POST",
        body: { quantity },
      }),
      invalidatesTags: ["Sweets"],
    }),
  }),
});

export const {
  useGetSweetsQuery,
  useAddSweetMutation,
  useUpdateSweetMutation,
  useRestockSweetMutation,
  useDeleteSweetMutation,
  usePurchaseSweetMutation,
  useGetFilteredSweetsQuery,
} = sweetsApi;
