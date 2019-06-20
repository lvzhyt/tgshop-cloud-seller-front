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
        <Card title="">
          <p slot="title">
            <Icon type="ios-film-outline"></Icon>
            库存
          </p>
          <div>
            <InputNumber v-model="inventoryNum" :min="0" :precision="0" style="width: 200px"></InputNumber>
            <Button type="primary" @click="handleApplyInventory">Apply</Button>
          </div>
          <div class="top5">
            <tables ref="skuListTable" border editable
                    :columns="columnsSkuList"
                    v-model="skuListTableData"
                    @on-save-edit="handleSaveSkuInventory"
                    @on-row-dblclick="handleSkuTabDbClick">
            </tables>
          </div>
        </Card>
      </div>
      <div class="top5">
        <Button type="primary" @click="handleNextClick">下一步</Button>
      </div>
    </div>
</template>

<script>
  import { getSkuInventoryListByGoodsIdApi, updateSkuInventoryApi } from '../../api/skuApi'
  import { getGoodsByIdApi, getGoodsBySnApi } from '../../api/goodsApi'
  import Tables from '../../components/tables/tables'
  import './goods.less'
  import { getGoodsStatusName } from './goods-util'

  export default {
    name: 'goods-inventory',
    components: { Tables },
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
            colorAttrValName: '黑色',
            goodsId: '571738504774684673',
            inventoryNum: 10,
            leftNum: 10,
            lockNum: 0,
            sizeAttrValName: 'S',
            skuId: '575821279328866304',
            skuNo: '575821279328866305',
            skuStatus: 1,
            specFacePictures: 'http://tgshop.oss-cn-shanghai.aliyuncs.com/16a2aa15721/20190508/571738504774684673/16a950b9d19.jpg'
          }
        ],
        skuListTableData:[],
        inventoryNum: null
      }
    },
    computed:{
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
            }
          })
        }
      },
      resetGoodsData(data){
        this.goods=data.goods
        this.resetColumnsSkuList()
        this.refreshSkuInventoryList()
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
        let arrTmpInventory = {
          title: '库存',
          key: 'inventoryNum',
          editable: true,
          sortable: true
        }

        let arrTmpLockNum = {
          width: 100,
          title: '锁定',
          key: 'lockNum'
        }
        let arrTmpLeftNum = {
          width: 100,
          title: '可用',
          key: 'leftNum'
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
        this.columnsSkuList.push(arrTmpInventory)
        this.columnsSkuList.push(arrTmpLockNum)
        this.columnsSkuList.push(arrTmpLeftNum)
        this.columnsSkuList.push(arrTmpSkuStatus)
      },
      // 刷新sku列表
      refreshSkuInventoryList(selectedSkuIds){
        let goodsId = this.goods.goodsId
        getSkuInventoryListByGoodsIdApi(goodsId)
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
      handleSaveSkuInventory(params){
        console.log('handleSaveSku', params)
        let skuIds = []
        skuIds.push(params.row.skuId)
        let data = {
          skuIds: skuIds,
          inventory: params.value
        }
        updateSkuInventoryApi(data)
          .then(res => {
            res = res.data
            if(res.result===1){
              this.refreshSkuInventoryList()
              this.$Message.success(res.successMessage)
            }else{
              // this.skuListTableData[index].skuNo = oldSkuNoVal
              this.$Message.error(res.errorMessage)
            }
          })
      },
      handleNextClick(){
        this.$router.push({
          name: 'goods_show',
          params: {goodsId: this.goods.goodsId}
        })
      },
      handleSkuTabDbClick(data, index){
        console.log('handleSkuTabDbClick', data, index)
        console.log(this.$refs.skuListTable)
        debugger
      },
      handleApplyInventory(){
        console.log('handleApplyInventory')
        if(!this.inventoryNum){
          return false
        }
        debugger
        let selectionArr = this.$refs.skuListTable.getSelection()
        if(!selectionArr.length){
          this.$Message.warning('请选择SKU')
          return false
        }
        let skuIds = []
        for (let i = 0; i < selectionArr.length; i++) {
          if(selectionArr[i].lockNum > this.inventoryNum){
            this.$Message.warning('设定库存必须大于锁定库存.')
            return false
          }
          skuIds.push(selectionArr[i].skuId)
        }
        let data = {
          skuIds: skuIds,
          inventory:this.inventoryNum
        }
        updateSkuInventoryApi(data)
          .then(res => {
            res = res.data
            if(res.result===1){
              this.refreshSkuInventoryList(skuIds)
              this.$Message.success(res.successMessage)
            }else{
              // this.skuListTableData[index].skuNo = oldSkuNoVal
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
