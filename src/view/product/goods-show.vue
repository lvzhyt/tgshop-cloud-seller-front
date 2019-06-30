<template>
  <div>
    <div>
      <Steps :current="4">
        <Step title="新增商品" content="创建SPU的基本信息"></Step>
        <Step title="设置SKU"  content="设置商品的SKU"></Step>
        <Step title="设置详情" content="设置商品图片等信息"></Step>
        <Step title="设置价格" content="设置SKU的价格"></Step>
        <Step title="设置库存" content="设置SKU的库存"></Step>
        <Step title="商品上架" content="商品上架"></Step>
      </Steps>
    </div>
    <Divider />
    <div>
      <Card>
        <p slot="title">
          <Icon type="ios-film-outline"></Icon>
          商品信息
        </p>
        <p slot="extra" >
          <Poptip
            confirm
            placement="top-end"
            title='确定将商品转为"待发布"状态进行编辑?'
            @on-ok="handleStatusChangeClick(1)"
            ok-text="是"
            cancel-text="否"
            v-if="goodsEditable">
            <a shape="circle">启用编辑</a>
            <Tooltip content='"待发布"商品才可以编辑.' placement="top-end">
              <Icon type="ios-help-circle-outline" size="18" />
            </Tooltip>
          </Poptip>
          <Poptip
            confirm
            placement="top-end"
            title='确定将商品下架?'
            @on-ok="handleStatusChangeClick(6)"
            ok-text="是"
            cancel-text="否"
            v-if="goods.goodsStatus===5">
            <a >下架</a>
          </Poptip>
          <Poptip
            confirm
            title='确定申请解除锁定?'
            @on-ok="handleStatusChangeClick(8)"
            ok-text="是"
            cancel-text="否"
            v-if="goods.goodsStatus===7">
            <a >申请解锁</a>
          </Poptip>
        </p>
        <CellGroup>
          <Cell>
            商品货号：<Input icon="ios-search" v-model="goods.goodsSn" placeholder="搜索商品货号" @on-enter="handleSearchGoods" @on-click="handleSearchGoods"  style="width: 300px"/>
          </Cell>
          <Cell class="top5">
            商品名称：{{goods.goodsName}}
          </Cell>
          <Cell class="top5">
            商品状态：{{goodsStatusName}}
          </Cell>
        </CellGroup>
      </Card>
    </div>
    <!--   SKU列表   -->
    <div class="top5">
      <Table  ref="skuListTable" border searchable search-place="top"
              :columns="columnsSkuList"
              :data="skuListTableData"
              @on-row-dblclick="handleSkuTabDbClick">
      </Table>
    </div>
    <div class="top5">
      <div v-if="goods.goodsStatus===1">
        <div v-if="goodsShowDisabled" class="error-msg">{{goodsShowValidMessage}}</div>
        <Button type="primary" :disabled="goodsShowDisabled" @click="handleSubmitGoodsClick">提交审核</Button>
      </div>
      <div v-if="goods.goodsStatus===4||goods.goodsStatus===6">
        <Button type="primary" @click="handleStatusChangeClick(5)">上架</Button>
      </div>

    </div>
  </div>
</template>

<script>
  import { getSkuDetailListByGoodsIdApi, getSkuListByGoodsIdApi } from '../../api/skuApi'
  import {
    applyForGoodsShowApi,
    getGoodsByIdApi,
    getGoodsBySnApi,
    updateGoodsStatusApi,
    validateGoodsShowApi
  } from '../../api/goodsApi'
  import { getGoodsEditable, getGoodsStatusName } from './goods-util'

  export default {
    name: 'goods-show',
    data () {
      return {
        goods: {
          goodsId:'',
          goodsName:'',
          goodsSn:'',
          goodsStatus:0,
          specOpen:1,
          specSizeOpen:0
        },
        goodsShowDisabled:true,
        goodsShowValidMessage:'',
        columnsSkuList:[
          {
            type: 'selection',
            width: 60,
            align: 'center',
            searchable:false
          },
          {
            title: '封面图',
            key: 'specFacePictures'
          },
          {
            title: '商品编号',
            key: 'skuNo'
          },
          {
            title: '颜色',
            key: 'colorAttrValName'
          },
          {
            title: '尺码',
            key: 'sizeAttrValName'
          },
          {
            title: '主图',
            key: 'pictureMain'
          },
          {
            title: '详情图',
            key: 'pictureDescription'
          },

          {
            title: '状态',
            key: 'skuStatus'
          }
        ],
        skuListTableDataDemo:[
          {
            areaId: '0',
            attrValueJson: '[{"attrValueId":"572563651391787008","attributeId":"1","attributeName":"颜色","attributeValue":"蓝色"},{"attrValueId":"572563651391787008","attributeId":"1","attributeName":"颜色","attributeValue":"蓝色"}]',
            colorAttrValId: '572563651391787008',
            colorAttrValName: '蓝色',
            createTime: '2019-05-08 01:25:05',
            creator: '568045142133575680',
            goodsId: '571738504774684673',
            isDel: 0,
            itemSize: null,
            modifier: '568045142133575680',
            modifyTime: '2019-05-08 01:25:17',
            pictureDescription: null,
            pictureMain: null,
            sellerId: '568045142133575680',
            sizeAttrValId: '572566659001356288',
            sizeAttrValName: 'XXL',
            skuGoodsName: '华为 HUAWEI P30 Pro 超感光徕卡四摄10倍混合变焦麒麟980芯片屏内指纹 8GB+128GB亮黑色全网通版双4G手机',
            skuId: '575614139226001408',
            skuNo: '575614139226001409',
            skuStatus: 1,
            skuType: 1,
            specFacePictures: 'http://tgshop.oss-cn-shanghai.aliyuncs.com/16a2aa15721/20190507/571738504774684673/16a92850cb1.jpg',
            storeId: '568125933538643968',
            templateId: '0',
            version: 0,
            volume: 0,
            weight: 0
          }
        ],
        skuListTableData:[]
      }
    },
    computed:{
      goodsEditable() {
        return getGoodsEditable(this.goods.goodsStatus)
      },
      goodsStatusName(){
        return getGoodsStatusName(this.goods.goodsStatus)
      }
    },
    methods: {
      handleSearchGoods(){
        if(this.goods.goodsSn){
          this.loadGoodsBySn(this.goods.goodsSn)
        }
      },
      loadGoods (goodsId){
        if(goodsId){
          getGoodsByIdApi(goodsId).then(res => {
            res = res.data
            if(res.result===1){
              this.resetGoodsData(res.data)
            }
          })
        }
      },
      loadGoodsBySn(goodsSn){
        if(goodsSn){
          getGoodsBySnApi(goodsSn).then(res => {
            res = res.data
            if(res.result===1){
              this.resetGoodsData(res.data)
            }else {
              this.$Message.error(res.message)
            }
          })
        }
      },
      resetGoodsData(data){
        this.goods=data
        this.resetColumnsSkuList()
        this.refreshGoodsShowDisabled()
        this.refreshSkuPriceList()
      },
      // 刷新sku列表
      refreshSkuPriceList(selectedSkuIds){
        let goodsId = this.goods.goodsId
        getSkuDetailListByGoodsIdApi(goodsId)
          .then(res => {
            res = res.data
            if(res.result===1){
              this.skuListTableData = res.data
              console.log('skuListTableData', this.skuListTableData)
              if(selectedSkuIds){
                for (let i = 0; i < selectedSkuIds.length; i++) {
                  let skuId = selectedSkuIds[i]
                  for (let j = 0; j < this.skuListTableData.length; j++) {
                    if(skuId===this.skuListTableData[j].skuId){
                      this.skuListTableData[j]._checked = true
                      break
                    }
                  }
                }
              }
            }
          })
      },
      // 重设SKU table列 根据商品属性级数
      resetColumnsSkuList(){
        this.columnsSkuList = []
        let arrTmpIndex = {
          type: 'selection',
          width: 60,
          align: 'center',
          key:'selection'
        }
        let arrTmpImage = {
          width: 80,
          title: '封面图',
          key: 'specFacePictures',
          render: (h, params) => {
            return h('div', [
              h('img', {
                attrs: {
                  src: params.row.specFacePictures
                },
                style: {
                  width: '50px',
                  height: '50px',
                  display:params.row.specFacePictures?'inline':'none'
                }
              })
            ]);
          }
        }
        let arrTmpSkuNo = {
          minWidth:80,
          title: '商品编号',
          key: 'skuNo',

          sortable: true
        }
        let arrTmpSpec = {
          title: '规格',
          key: 'colorAttrValName',
          sortable: true
        }
        let arrTmpColor = {
          title: '颜色',
          key: 'colorAttrValName',
          sortable: true
        }
        let arrTmpSize = {
          width: 80,
          title: '尺码',
          key: 'sizeAttrValName',
          sortable: true
        }
        let arrTmpPictureMain = {
          // width: '300px',
          title: '主图',
          key: 'pictureMain',
          render: (h, params) => {
            if(params.row.pictureMain){
              let pics = params.row.pictureMain.split(',')
              return h('div', pics.map(item => {
                return h('img', {
                  attrs: {
                    src: item
                  },
                  style: {
                    width: '50px',
                    height: '50px'
                  }
                })
              }));
            }else{
              return h('div',[])
            }
          }
        }
        let arrTmpSalePrice = {
          title: '售价',
          key: 'salePrice',
          sortable: true
        }
        let arrTmpInventory = {
          title: '库存',
          key: 'inventoryNum',
          sortable: true
        }

        let arrTmpItemSize = {
          width: 100,
          title: '大小',
          key: 'itemSize'
        }
        let arrTmpSkuStatus = {
          width: 70,
          title: '状态',
          key: 'skuStatus',
          render: (h, params) => {
            return h('div', [
              h('span', params.row.skuStatus===1?'开启':'关闭')
            ]);
          }
        }
        // this.columnsSkuList.push(arrTmpIndex)
        this.columnsSkuList.push(arrTmpImage)
        this.columnsSkuList.push(arrTmpSkuNo)
        if(this.goods.specOpen===1){
          if(this.goods.specSizeOpen===1){
            this.columnsSkuList.push(arrTmpColor)
            this.columnsSkuList.push(arrTmpSize)
          }else{
            this.columnsSkuList.push(arrTmpSpec)
          }
        }
        this.columnsSkuList.push(arrTmpPictureMain)
        this.columnsSkuList.push(arrTmpSalePrice)
        this.columnsSkuList.push(arrTmpInventory)
        this.columnsSkuList.push(arrTmpSkuStatus)
      },
      // 刷新sku列表
      refreshSkuList(selectedSkuIds){
        let goodsId = this.goods.goodsId
        getSkuListByGoodsIdApi(goodsId)
          .then(res => {
            res = res.data
            if(res.result===1){
              this.skuListTableData = res.data
              if(selectedSkuIds){
                for (let i = 0; i < selectedSkuIds.length; i++) {
                  let skuId = selectedSkuIds[i]
                  for (let j = 0; j < this.skuListTableData.length; j++) {
                    if(skuId===this.skuListTableData[j].skuId){
                      this.skuListTableData[j]._checked = true
                      break
                    }
                  }
                }
              }
            }
          })
      },
      refreshGoodsShowDisabled(){
        if(this.goods.goodsStatus!==1){
          this.goodsShowDisabled = true
          return false
        }
        // 检查是否符合上架/待审核标准
        validateGoodsShowApi(this.goods.goodsId)
          .then(resp => {
            let res = resp.data
            if(res.result){
              let valid = res.data.valid
              this.goodsShowDisabled = !valid
              this.goodsShowValidMessage = res.data.errors
            }else{
              this.goodsShowValidMessage = 'valid error'
            }
          })
      },
      handleSubmitGoodsClick(){
        applyForGoodsShowApi(this.goods.goodsId)
          .then(resp => {
            let res = resp.data
            if(res.result){
              this.$Message.success(res.successMessage)
              this.loadGoods(this.goods.goodsId)
            }else{
              this.$Message.error(res.errorMessage)
            }
          })
      },
      handleStatusChangeClick(status){
        let data = {
          goodsId: this.goods.goodsId,
          goodsStatus: status
        }
        updateGoodsStatusApi(data)
          .then(resp => {
            let res = resp.data
            if(res.result){
              this.goods = res.data.goods
              this.$Message.success(res.successMessage)
            }else {
              this.$Message.error(res.errorMessage)
            }
          })
      },
      handleSkuTabDbClick(data, index){
        console.log('handleSkuTabDbClick', data, index)
        console.log(this.$refs.skuListTable)
        debugger
      },
      initData(){
        // this.facePicUploadFileList = this.$refs.facePicUpload.fileList;
        let goodsId=this.$route.params.goodsId
        if(goodsId){
          this.loadGoods(goodsId)
        }
      }
    },
    mounted () {
      this.initData()
    }
  }
</script>

<style scoped>
  .error-msg{
    color: #d96754;
    margin-top: 10px;
    margin-bottom: 10px;
  }
</style>
