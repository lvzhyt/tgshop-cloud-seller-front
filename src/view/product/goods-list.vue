<template>
    <div>
      <Card>
        <p slot="title">商品列表</p>
        <p slot="extra">
          <label class="right10">批量编辑</label>
          <i-switch v-model="batchEditEnable" @on-change="handleBatchEditEnableChange" ></i-switch>
        </p>
        <div>
          <Form ref="searchForm" :label-width="60" inline>
            <FormItem label="货号">
              <Input type="text" placeholder="货号"/>
            </FormItem>
<!--            <FormItem label=""></FormItem>-->
            <FormItem>
              <Button type="primary" shape="circle" icon="ios-search">搜索</Button>
            </FormItem>
          </Form>
        </div>
        <div v-if="!batchEditEnable" class="inline-buttons">
          <Button >新建</Button>
          <Button :disabled="!currentRow" @click="handleRouterClick('goods_spec')">规格</Button>
          <Button :disabled="!currentRow" @click="handleRouterClick('goods_detail')">详情</Button>
          <Button :disabled="!currentRow" @click="handleRouterClick('goods_price')">价格</Button>
          <Button :disabled="!currentRow" @click="handleRouterClick('goods_inventory')">库存</Button>
          <Button :disabled="!currentRow" @click="handleRouterClick('goods_show')">上架</Button>
        </div>
        <div v-if="batchEditEnable" class="inline-buttons">
          <Button @click="handleBatchEditClick(5)">上架</Button>
          <Button @click="handleBatchEditClick(6)">下架</Button>
          <Button @click="handleBatchDeleteGoodsClick" type="error">删除</Button>
        </div>
        <Table ref="goodsTable" class="top5" v-if="!batchEditEnable"
               :columns="goodsListViewColumns"
               :data="goodsListData"
               highlight-row
               @on-current-change="handleGoodsCurrentChange"
        >
          <template slot-scope="{ row, index }" slot="action">
            <Button type="primary" size="small" style="margin-right: 5px" @click="handleGoodsStatusClick(row,index)">{{statusOperateTitle(row.goodsStatus)}}</Button>
            <Poptip
              confirm
              title="确定要删除?"
              @on-ok="handleDeleteGoodsClick(row,index)"
              @on-cancel="handleCancelClick">
              <Button type="error" size="small" >删除</Button>
            </Poptip>
          </template>
        </Table>
        <Table ref="batchGoodsTable" class="top5"  v-if="batchEditEnable" :columns="goodsListEditColumns" :data="goodsListData">
        </Table>
        <Page class="top5" :total="Number(pager.total)" :current="pager.pageNum" :page-size="pager.pageSize"
              @on-change="handlePageChange"
              @on-page-size-change="handlePageSizeChange"
              show-elevator show-sizer />
      </Card>
    </div>
</template>

<script>
  import './goods.less'
  import goodsExpandRow from './goods-expand-row'
  import {
    applyForGoodsShowApi, batchDeleteGoodsApi, batchUpdateGoodsStatusApi,
    findGoodsPageListApi,
    getGoodsSkuDetailListByGoodsIdApi,
    updateGoodsStatusApi
  } from '../../api/goodsApi'
  export default {
    name: 'goods-list',
    components:{goodsExpandRow},
    data () {
      return {
        batchEditEnable: false,
        searchFormItem: {
          condition:{
            goodsSn: ''
          },
          pageNum: 1,
          pageSize: 10
        },
        pager: {
          pageNum: 1,
          pageSize: 10,
          total: 0,
          pages:0
        },
        goodsListViewColumns:[
          {
            type: 'expand',
            width: 50,
            render: (h, params) => {
              return h(goodsExpandRow, {
                props: {
                  goods: params.row
                }
              })
            }
          },
          {
            title: '货号',
            key: 'goodsSn',
            width:180
          },
          {
            title: '商品名称',
            key: 'goodsName',
            minWidth:300
          },
          {
            title: '品牌',
            key: 'brandName',
            minWidth:80,
            maxWidth:150
          },
          {
            title: '商品状态',
            key: 'goodsStatusInfo',
            width:90
          },
          {
            title: '创建时间',
            key: 'createTime',
            width:150
          },
          {
            title: '操作',
            slot: 'action',
            width:150
          }
        ],
        goodsListEditColumns:[
          {
            type: 'selection',
            width: 60,
            align: 'center'
          },
          {
            title: '货号',
            key: 'goodsSn',
            width:180
          },
          {
            title: '商品名称',
            key: 'goodsName',
            minWidth:300
          },
          {
            title: '品牌',
            key: 'brandName',
            minWidth:80,
            maxWidth:150
          },
          {
            title: '商品状态',
            key: 'goodsStatusInfo',
            width:90
          },
          {
            title: '创建时间',
            key: 'createTime',
            width:150
          }
        ],
        goodsListData:[],
        goodsListDataDemo:[
          {
            areaId: '0',
            brandId: '0',
            brandName: '其他',
            categoryId: '0',
            categoryName: '其他',
            createTime: '2019-05-19 04:51:58',
            creator: '568045142133575680',
            defaultSkuId: null,
            describeUrl: null,
            goodsId: '579652468846235649',
            goodsName: '汤姆福特（TOM FORD）TF口红唇膏黑金黑管唇膏3g ',
            goodsSn: 'SN579652468846235648',
            goodsStatus: 1,
            isDel: 0,
            itemAttributeJsonValue: null,
            itemSaleAttributeJsonValue: null,
            keywords: null,
            listingTime: null,
            modifier: null,
            modifyTime: null,
            offShowTime: null,
            productOrigin: null,
            sellerId: '568045142133575680',
            shopName: '糖果贝贝',
            skuList: Array(0),
            specOpen: 1,
            specSizeOpen: 0,
            storeId: '568125933538643968',
            version: 0
          }
        ],
        currentRow:''
      }
    },
    computed:{
      statusOperateTitle () {
        return function(status){
          let title = '查看'
          if(status===1){
            title = '申请'
          }else if(status===4){
            title='上架'
          }else if(status===5){
            title='下架'
          }else if(status===6){
            title='上架'
          }else if(status===7){
            title='解锁'
          }
          return title
        }
      }
    },
    methods:{
      handleBatchEditEnableChange(status){
        console.log('handleBatchEditEnableChange',status)
      },
      handleBatchEditClick(goodsStatus){
        let goodsIds = this.getSelectedIds()
        if(!goodsIds){
          return false
        }
        let data = {
          goodsIds,
          goodsStatus:goodsStatus
        }
        batchUpdateGoodsStatusApi(data)
          .then(response => {
            let res = response.data
            if(res.result){
              this.$Message.success(res.successMessage)
              this.findGoodsPageList()
            }else {
              this.$Message.error(res.errorMessage)
            }
          })
      },
      handleGoodsRowExpand(row,status){
        if(!row.loaded){
          let goodsId = row.goodsId
          getGoodsSkuDetailListByGoodsIdApi(goodsId)
            .then(response => {
              let res = response.data
              if(res.result){
                console.log(res.data)
                for (let i = 0; i < this.goodsListData.length; i++) {
                  if(this.goodsListData[i].goodsId===row.goodsId){
                    this.goodsListData[i].skuList = res.data
                    this.goodsListData[i].loaded = true
                  }
                }
              }
            })
        }
      },
      handleGoodsCurrentChange(currentRow,oldCurrentRow){
        this.currentRow = currentRow
      },
      handleRouterClick(routerName){
        if(this.currentRow){
          this.$router.push({
            name: routerName,
            params: {goodsId:this.currentRow.goodsId}
          })
        }
      },
      handleGoodsStatusClick(row,index){
        let status = row.goodsStatus
        let goodsId = row.goodsId
        console.log('handleDownGoodsClick')
        if(status===1){
          // 申请
          applyForGoodsShowApi(goodsId)
            .then(resp => {
              let res = resp.data
              if(res.result){
                this.$Message.success(res.successMessage)
                this.findGoodsPageList()
              }else{
                this.$Message.error(res.errorMessage)
              }
            })
        }else if(status===4){
          // 上架
          this.updateGoodsStatus(goodsId,5)
        }else if(status===5){
          // 下架
          this.updateGoodsStatus(goodsId,6)
        }else if(status===6){
          // 上架
          this.updateGoodsStatus(goodsId,5)
        }else if(status===7){
          // 解锁
          this.updateGoodsStatus(goodsId,8)
        }else{
          this.$router.push({
            name: 'goods_preview',
            params: {goodsId:goodsId}
          })
        }
      },
      getSelectedIds(){
        let ids =[]
        debugger
        if(this.$refs.batchGoodsTable){
          let selectArr = this.$refs.batchGoodsTable.getSelection()
          for (let i = 0; i < selectArr.length; i++) {
            ids.push(selectArr[i].goodsId)
          }
        }
        return ids;
      },
      updateGoodsStatus(goodsId,status){
        let data = {
          goodsId: goodsId,
          goodsStatus: status
        }
        updateGoodsStatusApi(data)
          .then(resp => {
            let res = resp.data
            if(res.result){
              this.findGoodsPageList()
              this.$Message.success(res.successMessage)
            }else {
              this.$Message.error(res.errorMessage)
            }
          })
      },
      handleCancelClick(row,index){
        console.log('handleCancelClick')
      },
      handleDeleteGoodsClick(row,index){
        console.log('handleDeleteGoodsClick')
        let goodsIds = [row.goodsId]
        let data = {
          goodsIds
        }
        batchDeleteGoodsApi(data)
          .then(response => {
            let res = response.data
            if(res.result){
              this.findGoodsPageList()
              this.$Message.success(res.successMessage)
            }else {
              this.$Message.error(res.errorMessage)
            }
          })
      },
      handleBatchDeleteGoodsClick(row,index){
        let goodsIds = this.getSelectedIds()
        if(!goodsIds){
          return false
        }
        let data = {
          goodsIds
        }
        batchDeleteGoodsApi(data)
          .then(response => {
            let res = response.data
            if(res.result){
              this.findGoodsPageList()
              this.$Message.success(res.successMessage)
            }else {
              this.$Message.error(res.errorMessage)
            }
          })
      },
      handlePageChange(pageNum){
        this.pager.pageNum = pageNum
        this.findGoodsPageList()
      },
      handlePageSizeChange(pageSize){
        this.pager.pageNum = 1
        this.pager.pageSize = pageSize
        this.findGoodsPageList()
      },
      findGoodsPageList(){
        this.searchFormItem.pageNum = this.pager.pageNum
        this.searchFormItem.pageSize = this.pager.pageSize
        findGoodsPageListApi(this.searchFormItem)
          .then(response => {
            let res = response.data
            if(res.result){
              this.pager = res.data.pager
              this.goodsListData = res.data.list
            }
          })
      },
      initData() {
        this.findGoodsPageList()
      }
    },
    mounted() {
      this.initData()
    }
  }
</script>

<style scoped>
  .inline-buttons button{
    margin-right: 5px;
  }
</style>
