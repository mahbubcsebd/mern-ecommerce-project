import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:8080/api',
    credentials: 'include', // Correct spelling
  }),
  tagTypes: ['FAQ'], // Define a tag type for cache invalidation
  endpoints: (builder) => ({
    // Fetch FAQs with optional category filter
    getFaqs: builder.query({
      query: ({ category, isActive }) => {
        const params = new URLSearchParams();
        if (category && category !== 'all') params.append('category', category);
        if (isActive !== undefined) params.append('isActive', isActive);
        return `/faqs?${params.toString()}`;
      },
      providesTags: ['FAQ'],
    }),

    // Fetch a single FAQ by ID
    getFaq: builder.query({
      query: (faqId) => `/faqs/${faqId}`,
    }),

    // Create a new FAQ
    createFAQ: builder.mutation({
      query: (body) => ({
        url: '/faqs',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['FAQ'], // Invalidate the FAQ list cache after creation
    }),

    // Update an existing FAQ
    updateFAQ: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/faqs/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['FAQ'], // Invalidate the FAQ list cache after update
    }),

    // Delete an FAQ
    deleteFAQ: builder.mutation({
      query: (id) => ({
        url: `/faqs/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['FAQ'], // Invalidate the FAQ list cache after deletion
    }),

    // Reorder FAQs
    reorderFAQs: builder.mutation({
      query: (orderedIds) => ({
        url: '/faqs/reorder',
        method: 'POST',
        body: { orderedIds },
      }),
      invalidatesTags: ['FAQ'], // Invalidate the FAQ list cache after reordering
    }),
  }),
});

export const {
  useGetFaqsQuery,
  useGetFaqQuery,
  useCreateFAQMutation,
  useUpdateFAQMutation,
  useDeleteFAQMutation,
  useReorderFAQsMutation, // Export the new mutation
} = apiSlice;
