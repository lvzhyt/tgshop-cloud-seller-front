<template>
  <div>
    <div>
      <Steps :current="3">
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
            title='确定将商品下架?'
            @on-ok="handleStatusChangeClick(6)"
            ok-text="是"
            cancel-text="否"
            v-if="goods.goodsStatus===5">
            <a >下架</a>
          </Poptip>
        </p>
        <CellGroup>
          <Cell title="GoodsSerial" >
            商品货号：<Input icon="ios-search" v-model="goods.goodsSn" placeholder="搜索商品货号" @on-enter="handleSearchGoods" @on-click="handleSearchGoods"  style="width: 300px"/>
          </Cell>
          <Cell title="GoodsName" >
            商品名称：{{goods.goodsName}}
          </Cell>
          <Cell title="GoodsStatus">
            商品状态：{{goodsStatusName}}
          </Cell>
        </CellGroup>
      </Card>
    </div>
    <!--   SKU列表   -->
    <div class="top5">
      <Card>
        <p slot="title">
          <Icon type="ios-film-outline"></Icon>
          商品列表
        </p>
        <div>
          <Table  ref="skuListTable" border searchable search-place="top"
                  :columns="columnsSkuList"
                  :data="skuListTableData"
                  @on-row-dblclick="handleSkuTabDbClick">
          </Table>
        </div>

      </Card>
    </div>
    <div class="top5" v-if="goods.goodsStatus!==5">
      <Card>
        <p slot="title">
          <Icon type="ios-film-outline"></Icon>
          设置商品价格
        </p>
        <div>
          <Form ref="skuPriceForm" :model = "skuPriceFormItem">
            <FormItem label="成本价" placeholder="成本价">
              <InputNumber v-model="skuPriceFormItem.costPrice" :precision="2" :min="0" :formatter="formatterNumber"></InputNumber>
            </FormItem>
            <FormItem label="市场价" placeholder="市场价">
              <InputNumber v-model="skuPriceFormItem.marketPrice" :precision="2" :min="0" :formatter="formatterNumber"></InputNumber>
            </FormItem>
            <FormItem label="销售价" placeholder="销售价">
              <InputNumber v-model="skuPriceFormItem.salePrice" :precision="2" :min="0" :formatter="formatterNumber"></InputNumber>
            </FormItem>
            <FormItem label="">
              <Checkbox v-model="skuPriceFormItem.plusPriceOpen" :true-value="1" :false-value="0">开启Plus价</Checkbox>
            </FormItem>
            <FormItem label="Plus价" placeholder="Plus价">
              <InputNumber v-model="skuPriceFormItem.plusPrice" :precision="2" :min="0" :disabled="!skuPriceFormItem.plusPriceOpen" :formatter="formatterNumber"></InputNumber>
            </FormItem>
            <FormItem >
              <Checkbox v-model="skuPriceFormItem.superVipPriceOpen" :true-value="1" :false-value="0">开启SVip价</Checkbox>
            </FormItem>
            <FormItem label="SVip价" placeholder="SVip价" >
              <InputNumber v-model="skuPriceFormItem.superVipPrice" :precision="2" :min="0" :disabled="!skuPriceFormItem.superVipPriceOpen" :formatter="formatterNumber"></InputNumber>
            </FormItem>
            <FormItem>
              <Button type="primary" @click="handleApplyPrice">应用</Button>
            </FormItem>
          </Form>
        </div>
      </Card>
    </div>
    <div class="top5">
      <Button type="primary" @click="handleNextClick">下一步</Button>
    </div>
  </div>
</template>

<script>
  import { getSkuPriceListByGoodsIdApi, updateSkuPriceApi } from '../../api/skuApi'
  import { getGoodsByIdApi, getGoodsBySnApi, updateGoodsStatusApi } from '../../api/goodsApi'
  import {formatterNumber} from '../../libs/util'
  import './goods.less'
  import { getGoodsStatusName } from './goods-util'
  export default {
    name: 'goods-price',
    components: { },
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
            width: 160,
            title: '商品编号',
            key: 'skuNo'
          },
          {
            width: 160,
            title: '颜色',
            key: 'colorAttrValName'
          },
          {
            title: '尺码',
            key: 'sizeAttrValName'
          },
          {
            title: '状态',
            key: 'skuStatus'
          }
        ],
        skuListTableDataDemo:[
          {
            colorAttrValName: '黑色',
            costPrice: 0,
            goodsId: '571738504774684673',
            marketPrice: 0,
            plusPrice: 0,
            plusPriceOpen: 0,
            salePrice: 0,
            sizeAttrValName: 'S',
            skuId: '575821279328866304',
            skuNo: '575821279328866305',
            skuStatus: 1,
            specFacePictures: 'http://tgshop.oss-cn-shanghai.aliyuncs.com/16a2aa15721/20190508/571738504774684673/16a950b9d19.jpg',
            superVipPrice: 0,
            superVipPriceOpen: 0
          }
        ],
        skuListTableData:[],
        skuPriceFormItem: {
          skuIds:[],
          costPrice: 0,
          goodsId: '',
          marketPrice: 0,
          plusPrice: 0,
          plusPriceOpen: 0,
          salePrice: 0,
          skuId: '',
          skuNo: '',
          superVipPrice: 0,
          superVipPriceOpen: 0
        }
      }
    },
    computed:{
      goodsStatusName(){
        return getGoodsStatusName(this.goods.goodsStatus)
      }
    },
    methods: {
      formatterNumber,
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
            }
          })
        }
      },
      resetGoodsData(data){
        this.goods=data.goods
        this.resetColumnsSkuList()
        this.refreshSkuPriceList()
      },
      // 刷新sku列表
      refreshSkuPriceList(selectedSkuIds){
        let goodsId = this.goods.goodsId
        getSkuPriceListByGoodsIdApi(goodsId)
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
        this.columnsSkuList.splice(0)
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
          title: '商品编号',
          width: 160,
          key: 'skuNo',

          sortable: true
        }
        let arrTmpSpec = {
          minWidth: 160,
          title: '规格',
          key: 'colorAttrValName',
          sortable: true
        }
        let arrTmpColor = {
          minWidth: 100,
          title: '颜色',
          key: 'colorAttrValName',
          sortable: true
        }
        let arrTmpSize = {
          minWidth: 100,
          title: '尺码',
          key: 'sizeAttrValName',
          sortable: true
        }
        let arrTmpCostPrice = {
          minWidth: 100,
          title: '成本价',
          key: 'costPrice'
        }
        let arrTmpMarketPrice = {
          minWidth: 100,
          title: '市场价',
          key: 'marketPrice'
        }
        let arrTmpSalePrice = {
          minWidth: 100,
          title: '销售价',
          key: 'salePrice'
        }
        let arrTmpPlusPriceOpen = {
          width: 80,
          title: 'Plus',
          key: 'plusPriceOpen',
          render: (h, params) => {
            return h('div', [
              h('span', params.row.plusPriceOpen===1?'开启':'关闭')
            ]);
          }
        }
        let arrTmpPlusPrice = {
          minWidth: 100,
          title: 'Plus价',
          key: 'plusPrice'
        }
        let arrTmpSuperVipPriceOpen = {
          width: 80,
          title: 'SVip',
          key: 'superVipPriceOpen',
          render: (h, params) => {
            return h('div', [
              h('span', params.row.superVipPriceOpen===1?'开启':'关闭')
            ]);
          }
        }
        let arrTmpSuperVipPrice = {
          minWidth: 100,
          title: 'SVip价',
          key: 'superVipPrice'
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
        this.columnsSkuList.push(arrTmpIndex)
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
        this.columnsSkuList.push(arrTmpCostPrice)
        this.columnsSkuList.push(arrTmpMarketPrice)
        this.columnsSkuList.push(arrTmpSalePrice)
        this.columnsSkuList.push(arrTmpPlusPriceOpen)
        this.columnsSkuList.push(arrTmpPlusPrice)
        this.columnsSkuList.push(arrTmpSuperVipPriceOpen)
        this.columnsSkuList.push(arrTmpSuperVipPrice)
        this.columnsSkuList.push(arrTmpSkuStatus)
      },
      handleNextClick(){
        this.$router.push({
          name: 'goods_inventory',
          params: {goodsId: this.goods.goodsId}
        })
      },
      handleSkuTabDbClick(data, index){
        console.log('handleSkuTabDbClick')
        // this.skuListTableData[index]._checked = !this.skuListTableData[index]._checked
        // // 强制刷新表格
        // let skuStatus = this.skuListTableData[index].skuStatus
        // this.skuListTableData[index].skuStatus = -1
        // this.skuListTableData[index].skuStatus = skuStatus
        // form 赋值
        this.skuPriceFormItem.costPrice = data.costPrice
        this.skuPriceFormItem.marketPrice = data.marketPrice
        this.skuPriceFormItem.plusPrice = data.plusPrice
        this.skuPriceFormItem.plusPriceOpen = data.plusPriceOpen
        this.skuPriceFormItem.salePrice = data.salePrice
        this.skuPriceFormItem.skuId = data.skuId
        this.skuPriceFormItem.skuNo = data.skuNo
        this.skuPriceFormItem.superVipPrice = data.superVipPrice
        this.skuPriceFormItem.superVipPriceOpen = data.superVipPriceOpen
      },
      handleApplyPrice(){
        console.log('handleApplyPrice')
        let selectionArr = this.$refs.skuListTable.getSelection()
        if(!selectionArr.length){
          this.$Message.warning('请选择SKU')
          return false
        }
        let skuIds = []
        for (let i = 0; i < selectionArr.length; i++) {
          skuIds.push(selectionArr[i].skuId)
        }
        this.skuPriceFormItem.skuIds = skuIds
        updateSkuPriceApi(this.skuPriceFormItem)
          .then(resp => {
            let res = resp.data;
            console.log(res)
            if(res.result){
              this.refreshSkuPriceList()
              this.$Message.success(res.successMessage)
            }else {
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
              this.loadGoods(this.goods.goodsId)
              this.$Message.success(res.successMessage)
            }else {
              this.$Message.error(res.errorMessage)
            }
          })
      },
      initData(){
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

</style>
