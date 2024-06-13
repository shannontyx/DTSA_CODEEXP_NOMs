import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseUrl = 'http://10.51.32.211:3000/';

export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({ baseUrl }),
    endpoints: (builder) => ({
      // Payments
      createPaymentIntent: builder.mutation({
        query: (data) => ({
          url: 'payments/intent',
          method: 'POST',
          body: data,
        }),
      }),
    }),
  });
  
  export const {
    useCreatePaymentIntentMutation
  } = apiSlice;