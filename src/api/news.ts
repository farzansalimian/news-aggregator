import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { ReducersName } from '@/store/constants'

export const newsApi = createApi({
  reducerPath: ReducersName.News,
  baseQuery: fetchBaseQuery({ baseUrl: '' }),
  endpoints: () => ({}),
})

export const { endpoints } = newsApi
