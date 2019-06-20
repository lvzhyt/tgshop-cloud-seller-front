import {brandUrl, categoryUrl} from './apiUrl'
import axios from '@/libs/api.request'

export const searchBrandApi = (brandName) => {
  return axios.request({
    url: brandUrl.search,
    params: {
      brandName
    },
    method:'get'
  })
}

export const searchCategoriesApi = (parentId) => {
  return axios.request({
    url: categoryUrl.search,
    params: {
      parentId
    },
    method:'get'
  })
}
