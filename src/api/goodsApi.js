import {goodsUrl} from './apiUrl'
import axios from '@/libs/api.request'

export const validGoodsSnApi = (goodsSn) => {
  return axios.request({
    url: goodsUrl.validGoodsSnUrl,
      params:{
        goodsSn
      },
    method:'get'
  })
}
// 获取商品
export const getGoodsByIdApi = (goodsId) => {
  return axios.request({
    url: goodsUrl.getGoodsById,
    params:{
      goodsId
    },
    method:'get'
  })
}
// 获取商品
export const getGoodsBySnApi = (goodsSn) => {
  return axios.request({
    url: goodsUrl.getGoodsBySn,
    params:{
      goodsSn
    },
    method:'get'
  })
}
// 获取商品属性
export const getGoodsAttrsApi = (goodsId) => {
  return axios.request({
    url: goodsUrl.getGoodsAttrsUrl,
    params:{
      goodsId
    },
    method:'get'
  })
}
// 获取商品Sku列表
export const getGoodsSkuListApi = (goodsId) => {
  return axios.request({
    url: goodsUrl.getGoodsSkuListUrl,
    params:{
      goodsId
    },
    method:'get'
  })
}

// 保存商品
export const saveGoodsApi = (data) => {
  return axios.request({
    url: goodsUrl.addUrl,
    data,
    method:'post'
  })
}
// 添加规格值
export const addGoodsSpecAttrApi = (data) => {
  return axios.request({
    url: goodsUrl.addGoodsSpecAttr,
    data,
    method:'post'
  })
}

// 规格值排序
export const sortGoodsSpecAttrApi = (data) => {
  return axios.request({
    url: goodsUrl.sortGoodsSpecAttr,
    data,
    method:'post'
  })
}
// 获取规格SKU属性列表
export const getSkuListBySpecIdApi = (data) => {
  return axios.request({
    url: goodsUrl.sortGoodsSpecAttr,
    data,
    method:'post'
  })
}
// 删除商品规格值
export const deleteGoodsSpecAttrApi = (data) => {
  return axios.request({
    url: goodsUrl.sortGoodsSpecAttr,
    data,
    method:'post'
  })
}
// 检查商品是否满足 上架要求
export const validateGoodsShowApi = (goodsId) => {
  return axios.request({
    url: goodsUrl.validateGoodsShowUrl,
    params:{
      goodsId
    },
    method:'get'
  })
}
// 商品上架
export const applyForGoodsShowApi = (goodsId) => {
  return axios.request({
    url: goodsUrl.applyForGoodsShowUrl,
    params:{
      goodsId
    },
    method:'get'
  })
}

// 商品上架
export const updateGoodsStatusApi = (data) => {
  return axios.request({
    url: goodsUrl.updateGoodsStatusUrl,
    data,
    method:'post'
  })
}// 查找商品  查找商品分页列表
export const findGoodsPageListApi = (data) => {
  return axios.request({
    url: goodsUrl.findGoodsPageListUrl,
    data,
    method:'post'
  })
}
// 获取商品sku列表
export const getGoodsSkuDetailListByGoodsIdApi = (goodsId) => {
  return axios.request({
    url: goodsUrl.getGoodsSkuDetailListByGoodsIdUrl,
    params:{
      goodsId
    },
    method:'get'
  })
}
// 获取商品分页列表 商品分页列表
export const getGoodsPageListApi = (data) => {
  return axios.request({
    url: goodsUrl.getGoodsPageListUrl,
    data,
    method:'post'
  })
}
// 批量更新商品 上架 下架
export const batchUpdateGoodsStatusApi = (data) => {
  return axios.request({
    url: goodsUrl.batchUpdateGoodsStatusUrl,
    data,
    method:'post'
  })
}// 批量删除商品
export const batchDeleteGoodsApi = (data) => {
  return axios.request({
    url: goodsUrl.batchDeleteGoodsUrl,
    data,
    method:'post'
  })
}
