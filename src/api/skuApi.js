import { skuUrl } from './skuUrl'
import axios from '@/libs/api.request'

export const addSkuApi = (data) => {
  return axios.request({
    url: skuUrl.addSku,
    data,
    method:'post'
  })
}
export const updateSizeSkuListApi = (data) => {
  return axios.request({
    url: skuUrl.updateSizeSkuListUrl,
    data,
    method:'post'
  })
}

// 更新sku 状态
export const updateSkuStatusApi = (data) => {
  return axios.request({
    url: skuUrl.updateSkuStatusUrl,
    data,
    method:'post'
  })
}
// 更新商品编号 skuNo
export const updateSkuNoApi = (data) => {
  return axios.request({
    url: skuUrl.updateSkuNoUrl,
    data,
    method:'post'
  })
}
// 更新sku 图片
export const updateGoodsSkuPicApi = (data) => {
  return axios.request({
    url: skuUrl.updateGoodsSkuPicUrl,
    data,
    method:'post'
  })
}
// 更新sku信息
export const updateGoodsSkuInfoApi = (data) => {
  return axios.request({
    url: skuUrl.updateGoodsSkuInfoUrl,
    data,
    method:'post'
  })
}
// 更新sku库存
export const updateSkuInventoryApi = (data) => {
  return axios.request({
    url: skuUrl.updateSkuInventoryUrl,
    data,
    method:'post'
  })
}
// 更新sku价格
export const updateSkuPriceApi = (data) => {
  return axios.request({
    url: skuUrl.updateSkuPriceUrl,
    data,
    method:'post'
  })
}
// 获取商品sku列表
export const getSkuListByGoodsIdApi = (goodsId) => {
  return axios.request({
    url: skuUrl.getSkuListUrl,
    params:{
      goodsId
    },
    method:'get'
  })
}
// 获取商品sku库存列表
export const getSkuInventoryListByGoodsIdApi = (goodsId) => {
  return axios.request({
    url: skuUrl.getSkuInventoryListByGoodsIdUrl,
    params:{
      goodsId
    },
    method:'get'
  })
}
// 获取商品sku库存列表
export const getSkuPriceListByGoodsIdApi = (goodsId) => {
  return axios.request({
    url: skuUrl.getSkuPriceListByGoodsIdUrl,
    params:{
      goodsId
    },
    method:'get'
  })
}
// 获取商品sku详细信息列表
export const getSkuDetailListByGoodsIdApi = (goodsId) => {
  return axios.request({
    url: skuUrl.getSkuDetailListByGoodsIdUrl,
    params:{
      goodsId
    },
    method:'get'
  })
}
