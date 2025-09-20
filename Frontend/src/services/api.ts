import {
  createApi,
  fetchBaseQuery,
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { ApiResponse } from "@/types/apiResponse";
import { RootState } from "@/store/store";
import { IUser } from "@/types/user.types";
import { setTokens, resetTokens } from "../store/reducers/authReducer";

const baseUrl = import.meta.env.VITE_API_URL;

const baseQuery = fetchBaseQuery({
  baseUrl,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.accessToken;
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    const refreshToken = (api.getState() as RootState).auth.refreshToken;

    if (refreshToken) {
      const refreshResult = await baseQuery(
        {
          url: "/auth/refresh",
          method: "POST",
          body: { refreshToken },
        },
        api,
        extraOptions
      );

      if (refreshResult.data) {
        const { accessToken, refreshToken: newRefreshToken } = (
          refreshResult.data as ApiResponse<{
            accessToken: string;
            refreshToken: string;
          }>
        ).data;

        api.dispatch(setTokens({ accessToken, refreshToken: newRefreshToken }));

        result = await baseQuery(args, api, extraOptions);
      } else {
        api.dispatch(resetTokens());
      }
    } else {
      api.dispatch(resetTokens());
    }
  }

  return result;
};

export const api = createApi({
  reducerPath: "api",
  tagTypes: ["User", "Sweets"],
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    me: builder.query<ApiResponse<IUser>, void>({
      query: () => ({
        url: `/auth/me`,
        method: "GET",
      }),
      providesTags: ["User"],
    }),
    login: builder.mutation<
      ApiResponse<IUser & { accessToken: string; refreshToken: string }>,
      { email: string; password: string }
    >({
      query: (body) => ({
        url: `/auth/login`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["User"],
    }),
    register: builder.mutation<
      ApiResponse<IUser>,
      Omit<IUser, "id" | "active" | "role" | "refreshToken">
    >({
      query: (body) => ({
        url: `/auth/register`,
        method: "POST",
        body,
      }),
    }),
    updateUser: builder.mutation<ApiResponse<IUser>, IUser>({
      query: (body) => ({
        url: `/auth/${body.id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["User"],
    }),
    refresh: builder.mutation<
      ApiResponse<{ accessToken: string; refreshToken: string }>,
      { refreshToken: string }
    >({
      query: (body) => ({
        url: "/auth/refresh",
        method: "POST",
        body,
      }),
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: `/auth/logout`,
        method: "POST",
      }),
      onQueryStarted: async (_, { dispatch }) => {
        dispatch(resetTokens());
      },
    }),
  }),
});

export const {
  useMeQuery,
  useLoginMutation,
  useLogoutMutation,
  useRegisterMutation,
  useUpdateUserMutation,
  useRefreshMutation,
} = api;
