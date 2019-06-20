import config from '@/config'
const baseUrl = process.env.NODE_ENV === 'development' ? config.baseUrl.dev : config.baseUrl.pro

export const errorLogUrl = {
  errorLogUrl: '/api-seller/log/errorLog'
}

export const goodsUrl = {
    //
    addUrl: '/api/product/goods/add',
    // 校验货号唯一
    validGoodsSnUrl: '/api/product/goods/validGoodsSn',
    // 校验满足上架要求
    validateGoodsShowUrl: '/api/product/goods/validateGoodsShow',
    // 获取商品 规格值列表 颜色 尺码 规格
    getGoodsById: '/api/product/getGoodsById',
    getGoodsBySn: '/api/product/getGoodsBySn',
    // 获取商品属性
    getGoodsAttrsUrl: '/api/product/goods/goodsAttrs',

    // 获取商品列表 商品分页列表
    getGoodsPageListUrl: '/api/product/goods/skuList',
    // 获取商品SKU列表
    getGoodsSkuListUrl: '/api/product/goods/skuList',
    // 获取商品规格列表
    getGoodsAttrList: '/api/product/goods/specAttrs',
    // 添加规格
    addGoodsSpecAttr: '/api/product/goods/specAttr/add',
    // 规格值排序
    sortGoodsSpecAttr: '/api/product/goods/specAttr/sort',
    // 获取规格SKU属性列表
    getSkuListBySpecId: '/api/product/goods/getSkuListBySpecId',
    // 删除商品规格
    deleteGoodsSpecAttr:'/api/product/goods/specAttr/del',
    // 更新商品
    updateGoodsStatusUrl: '/api/product/goods/updateGoodsStatus',
    // 批量更新商品 上架 下架
   batchUpdateGoodsStatusUrl: '/api/product/goods/batchUpdateGoodsStatus',
   // 批量删除商品
    batchDeleteGoodsUrl: '/api/product/goods/batchDeleteGoods',
    // 商品上架审核
    applyForGoodsShowUrl: '/api/product/goods/applyForGoodsShow',
   //  查找商品  查找商品分页列表
    findGoodsPageListUrl: '/api/product/goods/list',
   //  获取商品sku详情列表
   getGoodsSkuDetailListByGoodsIdUrl: '/api/product/sku/skuDetailList',
    // 上传商品图片
    uploadGoodsUrl: baseUrl+'/api/seller/upload/product/picture'
}
export const skuUrl = {
  addSku: '/api/product/sku/add',
  // 二级属性 更新sku
  updateSizeSkuListUrl: '/api/product/sku/updateSizeSkuList',
  // 更新sku 状态
  updateSkuStatusUrl: '/api/product/sku/skuStatus/update',
  updateSku: '/api/product/sku/update',
  // 更新商品编号 skuNo
  updateSkuNoUrl: '/api/product/sku/skuNo/update',
  // 更新sku图片
  updateGoodsSkuPicUrl: '/api/product/sku/skuPic/update',
  // 更新sku信息
  updateGoodsSkuInfoUrl: '/api/product/sku/skuInfo/update',
  // 更新sku库存
  updateSkuInventoryUrl: '/api/product/sku/updateInventory',
  // 更新sku价格
  updateSkuPriceUrl: '/api/product/sku/updatePrice',
  // 获取sku列表
  getSkuListUrl: '/api/product/sku/listByGoodsId',
  // 获取sku库存列表
  getSkuInventoryListByGoodsIdUrl: '/api/product/sku/inventoryListByGoodsId',
  // 获取sku库存列表
  getSkuPriceListByGoodsIdUrl: '/api/product/sku/priceListByGoodsId',
  // 获取sku详细列表
  getSkuDetailListByGoodsIdUrl: '/api/product/sku/skuDetailList',
  // 更新sku图片
  updateSkuPicture: '/api/product/sku/picture/update',
  // 更新SKU价格
  updateSkuPrice: '/api/product/sku/price/update',
  // 更新sku库存
  updateSkuInventory: '/api/product/sku/inventory/update',
  nothing:''
}

export const brandUrl = {
  search: '/api/seller/brand/search'
}

export const categoryUrl = {
  search: '/api/seller/category/search'
}
