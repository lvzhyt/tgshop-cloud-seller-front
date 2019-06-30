import config from '@/config'
const baseUrl = process.env.NODE_ENV === 'development' ? config.baseUrl.dev : config.baseUrl.pro
export const goodsUrl = {
  //
  addGoodsUrl: '/api-product/goods/addGoods',
  // 校验货号唯一
  validGoodsSnUrl: '/api/product/goods/validGoodsSn',
  // 校验满足上架要求
  validateGoodsShowUrl: '/api-product/goods/validateGoodsShow',
  // 获取商品 规格值列表 颜色 尺码 规格
  getGoodsById: '/api-product/goods/getGoodsById',
  // 通过货号查询商品
  getGoodsBySn: '/api-product/goods/getGoodsBySn',
  // 获取商品属性
  getGoodsAttrsUrl: '/api-product/goods/getGoodsAttrs',

  // 获取商品列表 商品分页列表
  getGoodsPageListUrl: '/api/product/goods/skuList',
  // 获取商品SKU列表
  getGoodsSkuListUrl: '/api-product/goods/getGoodsSkuList',
  // 获取商品规格列表
  getGoodsAttrList: '/api/product/goods/specAttrs',
  // 添加规格
  addGoodsSpecAttr: '/api-product/goods/addSpecAttr',
  // 规格值排序
  sortGoodsSpecAttr: '/api/product/goods/specAttr/sort',
  // 获取规格SKU属性列表
  getSkuListBySpecId: '/api/product/goods/getSkuListBySpecId',
  // 删除商品规格
  deleteGoodsSpecAttr:'/api/product/goods/specAttr/del',
  // 更新商品状态
  updateGoodsStatusUrl: '/api-product/goods/updateGoodsStatus',
  // 批量更新商品 上架 下架
  batchUpdateGoodsStatusUrl: '/api-product/goods/batchUpdateGoodsStatus',
  // 批量删除商品
  batchDeleteGoodsUrl: '/api-product/goods/batchDeleteGoods',
  // 商品上架审核
  applyForGoodsShowUrl: '/api-product/goods/applyForGoodsShow',
  //  查找商品  查找商品分页列表
  findGoodsPageListUrl: '/api-product/goods/findSellerGoodsPageList',
  // 上传商品图片
  uploadGoodsUrl: baseUrl+'/api-product/goods/uploadProductPicture'
}
