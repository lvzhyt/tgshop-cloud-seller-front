import {categoriesUrl,brandUrl} from './categoriesUrl'
import axios from '@/libs/api.request'

export const searchBrandApi = (brandName) => {
  return axios.request({
    url: brandUrl.searchBrandUrl,
    params: {
      brandName
    },
    method:'get'
  })
}

export const searchCategoriesApi = (parentId) => {
  return axios.request({
    url: categoriesUrl.findListByParentIdUrl,
    params: {
      parentId
    },
    method:'get'
  })
}
