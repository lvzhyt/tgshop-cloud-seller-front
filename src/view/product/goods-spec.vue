<template>
    <div>
      <div>
        <Steps :current="1">
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
                商品货号：<Input icon="ios-search"
                            v-model="goods.goodsSn"
                            placeholder="搜索商品货号"
                            @on-enter="handleSearchGoods"
                            @on-click="handleSearchGoods"
                            style="width: 300px"/>
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
      </div>
      <!--  待发布商品才可以编辑，下架的商品需点击编辑到待发布状态才可以编辑    -->
      <div  v-if="goods.goodsStatus===1">
        <div class="top5">
          <!-- 商品规格 -->
          <div v-if="goods.specOpen===1">
            <Card title="颜色">
              <Input icon="md-add" :disabled="goods.goodsId===''" v-model="goodsAddSpecAttrInputVal" placeholder="增加商品颜色规格" @on-enter="handleAddGoodsSpecAttr" @on-click="handleAddGoodsSpecAttr" style="width:300px" />
              <Table border editable :columns="columnsSpec" :data="goodsColorSpecAttrData" class="top5"></Table>
            </Card>
          </div>
          <!-- 商品尺码 -->
          <div v-if="goods.specSizeOpen===1">
            <Card title="尺码">
              <Input icon="md-add" v-model="goodsAddSizeAttrInputVal" placeholder="增加商品尺码" @on-enter="handleAddGoodsSizeAttr" @on-click="handleAddGoodsSpecAttr" style="width:300px" />
              <Table border :columns="columnsSize" :data="goodsSizeSpecAttrData" class="top5"></Table>
            </Card>
          </div>
        </div>
        <!-- SKU -->
        <div v-if="goods.specSizeOpen===1" class="top5">
          <div>
            <Card title="SKU规格">
              <RadioGroup v-model="skuColorSelectedVal" type="button" @on-change="handleSkuColorRadioGroupChange">
                <Radio :label="item.valueId" v-for="item in goodsColorSpecAttrData" :key="item.tid" >{{item.attrValueName}}</Radio>
              </RadioGroup>
            </Card>
          </div>
          <div>
            <Card title="SKU尺码">
              <div style="border-bottom: 1px solid #e9e9e9;padding-bottom:6px;margin-bottom:6px;">
                <Checkbox
                  :indeterminate="skuSizeIndeterminate"
                  :value="skuSizeCheckAll"
                  :disabled="skuColorSelectedVal===''"
                  @click.prevent.native="handleSkuSizeCheckAll">全选</Checkbox>
              </div>
              <CheckboxGroup v-model="skuSizeCheckAllGroup" @on-change="checkSkuSizeAllGroupChange">
                <Checkbox :label="item.valueId" v-for="item in goodsSizeSpecAttrData" :key="item.tId" :disabled="skuColorSelectedVal===''">
                  {{item.attrValueName}}
                </Checkbox>
              </CheckboxGroup>
            </Card>
  <!--          <Button type="primary" @click="handleApplySkuAttrAndSize">应用</Button>-->
          </div>
        </div>
      </div>
      <div class="top5">
        <Card title="">
          <p slot="title">
            <Icon type="ios-film-outline"></Icon>
            SKU列表
          </p>
          <!--            <Button type="default" slot="extra" @click="handleSaveSkuList">-->
          <!--              <Icon type="ios-loop-strong"></Icon>-->
          <!--              保 存-->
          <!--            </Button>-->
          <tables ref="skuListTable" border editable  :columns="columnsSkuList" v-model="skuListTableData"
                  @on-delete="handleSkuDelete"
                  @on-save-edit="handleSaveSku"></tables>
        </Card>
      </div>
      <div class="top5">
        <Button type="primary" @click="handleGoodsSpecNext">下一步</Button>
      </div>
    </div>
</template>

<script>
  import {getGoodsByIdApi, getGoodsBySnApi, addGoodsSpecAttrApi} from '@/api/goodsApi.js'
  import {updateSizeSkuListApi, updateSkuStatusApi, updateSkuNoApi, getSkuListByGoodsIdApi} from '@/api/skuApi.js'
  import Tables from '_c/tables'
  import './goods.less'
  import { getGoodsAttrsApi, getGoodsSkuListApi, updateGoodsStatusApi } from '../../api/goodsApi'
  import { getGoodsEditable, getGoodsStatusName } from './goods-util'
  export default {
    name: 'goods-spec',
    components: {
      Tables
    },
    data (){
      return {
        goods: {
          goodsId:'',
          goodsName:'',
          goodsSn:'',
          goodsStatus:0,
          specOpen:1,
          specSizeOpen:0
        },
        goodsSnSearchDisable:false,
        goodsAddSpecAttrInputVal:'',
        goodsAddSizeAttrInputVal:'',
        columnsSpec:[
          {
            type: 'index',
            width: 60,
            align: 'center'
          },
          {
            title: '规格',
            key: 'attrValueName',
            editable: true
          },
          {
            title: 'Action',
            key: 'action',
            width: 150,
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'error',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.handleDelGoodsAttr(params.index)
                    }
                  }
                }, 'Delete')
              ]);
            }
          }
        ],
        columnsSize:[
          {
            type: 'index',
            width: 60,
            align: 'center'
          },
          {
            title: '尺码',
            key: 'attrValueName'
          },
          {
            title: 'Action',
            key: 'action',
            width: 150,
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'error',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.handleDelGoodsSize(params.index)
                    }
                  }
                }, 'Delete')
              ]);
            }
          }
        ],

        // 商品规格
        goodsColorSpecAttrDataDemo:[
          {
            tId: '1',
            attrId: '',
            attrName: '黑色',
            sortNumber: '',
            skuSizeAttrs: [
              {
                tId: '',
                attrId: '',
                valueId: '',
                attrName: '',
                attrValue: '',
                skuId: '',
                sortNumber: ''
              }
            ]
          },
          {
            tId: '2',
            attrId: '',
            attrName: '白色',
            sortNumber: '',
            skuSizeAttrs: [
              {
                tId: '',
                attrId: '',
                valueId: '',
                attrName: '',
                attrValue: '',
                skuId: '',
                sortNumber: ''
              }
            ]
          }
        ],
        goodsColorSpecAttrData:[],
        // 商品尺码
        goodsSizeSpecAttrDataDemo:[
          {
            tId: '1',
            attrId: '',
            valueId: '1',
            attrName: '',
            attrValueName: 'S',
            sortNumber: '',
            selected: false
          },
          {
            tId: '2',
            attrId: '',
            valueId: '2',
            attrName: '',
            attrValueName: 'L',
            sortNumber: '',
            selected: false
          },
          {
            tId: '3',
            attrId: '',
            valueId: '3',
            attrName: '',
            attrValueName: 'XL',
            sortNumber: '',
            selected: false
          }
        ],
        goodsSizeSpecAttrData:[],
        // sku 规格已选项
        skuColorSelectedVal:'',
        // 尺码全选 模糊选择
        skuSizeIndeterminate: false,
        // 尺码全选
        skuSizeCheckAll: false,
        // sku 尺码已选项
        skuSizeCheckAllGroup: [],
        // sku 列表
        columnsSkuList:[
          {
            type: 'index',
            width: 60,
            align: 'center'
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
            title: '状态',
            key: 'skuStatus'
          },
          {
            title: 'Action',
            key: 'action',
            width: 150,
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'error',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.handleDelGoodsSize(params.index)
                    }
                  }
                }, 'Delete')
              ]);
            }
          }
        ],
        skuListTableDataDemo:[
          {
            skuId:'1',
            goodsId:'1',
            goodsSpecName:'goodsSpecName',
            skuNo:'SN1123',
            attrId:'',
            valueId:'',
            attrName:'11',
            attrValue:'22',
            sortNumber:0
          }
        ],
        skuListTableData:[],
        // goods 返回数据结构
        goodsResultData:{
          goods:{},
          specAttrValList:[],
          sizeAttrValList:[],
          goodsSkuList:[]
        }
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
    methods:{
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
              let data = res.data
              this.resetGoodsData(data)
            }
          })
        }
      },
      resetGoodsData(data){
        this.goods=data
        this.resetColumnsSkuList()
        this.refreshGoodsAttr()
        this.refreshSkuList()
      },
      // 刷新商品属性
      refreshGoodsAttr(){
        getGoodsAttrsApi(this.goods.goodsId)
          .then(response => {
            let res = response.data
            if(res.result){
              this.goodsColorSpecAttrData = res.data.specAttrValList
              this.goodsSizeSpecAttrData = res.data.sizeAttrValList
            }
          })
      },
      // 刷新sku列表
      refreshSkuList(){
        getGoodsSkuListApi(this.goods.goodsId)
          .then(response => {
            let res = response.data
            if(res.result){
              this.skuListTableData = res.data
            }
          })
      },
      handleSearchGoods(){
        if(this.goods.goodsSn){
          this.loadGoodsBySn(this.goods.goodsSn)
        }
      },
      // 添加商品规格
      handleAddGoodsSpecAttr(){
        console.log('handleAddGoodsSpecAttr', this.goodsAddSpecAttrInputVal)
        if(!this.goodsAddSpecAttrInputVal){
          return false
        }
        this.goodsAddSpecAttrInputVal = this.goodsAddSpecAttrInputVal.replace(/^\s*|\s*$/g, '');
        for(let item in this.goodsColorSpecAttrData){
          if(this.goodsAddSpecAttrInputVal===item.attrName){
            this.$Message.error(this.goodsAddSpecAttrInputVal + ' 规格属性值已存在.')
            return false
          }
        }
        let data = {
          goodsId:this.goods.goodsId,
          attrValue: this.goodsAddSpecAttrInputVal,
          sortNum:this.goodsColorSpecAttrData.length,
          attrLevel: 1
        }
        addGoodsSpecAttrApi(data)
          .then(res => {
            res = res.data
            console.log(res)
            if(res.result===1){
              let item =res.data
              this.goodsColorSpecAttrData.push(item)
              this.goodsAddSpecAttrInputVal=''
              // 刷新sku列表
              this.getSkuListByGoodsId()
              this.$Message.success('操作成功')
            }else{
              this.$Message.error(res.errorMessage)
            }
          })
      },
      handleAddGoodsSizeAttr(){
        console.log('handleAddGoodsSieAttr', this.goodsAddSizeAttrInputVal)
        if(!this.goodsAddSizeAttrInputVal){
          return false
        }
        this.goodsAddSizeAttrInputVal = this.goodsAddSizeAttrInputVal.replace(/^\s*|\s*$/g, '');
        for(let item in this.goodsSizeSpecAttrData){
          if(this.goodsAddSizeAttrInputVal===item.attrName){
            this.$Message.error(this.goodsAddSizeAttrInputVal + ' 尺码属性值已存在.')
            return false
          }
        }
        let data = {
          goodsId:this.goods.goodsId,
          attrValue: this.goodsAddSizeAttrInputVal,
          sortNum:this.goodsSizeSpecAttrData.length,
          attrLevel: 2
        }
        addGoodsSpecAttrApi(data)
          .then(res => {
            res = res.data
            console.log(res)
            if(res.result===1){
              let item =res.data
              this.goodsSizeSpecAttrData.push(item)
              this.goodsAddSizeAttrInputVal=''
              this.$Message.success('操作成功')
            }else{
              this.$Message.error(res.errorMessage)
            }
          })
      },
      handleDelGoodsAttr(params, index){
        console.log('handleDelGoodsAttr', params, index)
      },
      handleDelGoodsSize(params, index){
        console.log('handleDelGoodsSize', params, index)
      },
      handleSaveSkuList(params, index){
        console.log('handleSaveSkuList', params, index)
      },
      handleSkuDelete(params, index){
        console.log('handleSkuDelete', params, index)
      },
      handleSaveSku(params){
        console.log('handleSaveSku', params)
        let oldSkuNoVal = params.row.skuNo
        let index = params.index
        let data = {
          skuId: params.row.skuId,
          skuNo: params.value
        }
        updateSkuNoApi(data)
          .then(res => {
            res = res.data
            if(res.result===1){
              this.$Message.success(res.successMessage)
            }else{
              this.skuListTableData[index].skuNo = oldSkuNoVal
              this.$Message.error(res.errorMessage)
            }
          })
      },
      handleSkuColorRadioGroupChange(valueId){
        console.log('handleSkuColorRadioGroupChange', valueId)
        // 两级属性 遍历sku列表 找到勾选的尺码
        this.skuSizeCheckAllGroup = []
        for(let i=0; i<this.skuListTableData.length; i++) {
          if(this.skuListTableData[i].colorAttrValId===valueId){
            this.skuSizeCheckAllGroup.push(this.skuListTableData[i].sizeAttrValId)
          }
        }
        // 全选框状态
        if(this.skuSizeCheckAllGroup.length===0){
          this.skuSizeIndeterminate = false
          this.skuSizeCheckAll = false
        }else if(this.skuSizeCheckAllGroup.length===this.goodsSizeSpecAttrData.length){
          this.skuSizeIndeterminate = false
          this.skuSizeCheckAll = true
        }else {
          this.skuSizeIndeterminate = true
          this.skuSizeCheckAll = false
        }
      },
      // 重设SKU table列 根据商品属性级数
      resetColumnsSkuList(){
        this.columnsSkuList.splice(0)
        let arrTmpIndex = {
          type: 'index',
          width: 60,
          align: 'center'
        }
        let arrTmpSkuNo = {
          title: '商品编号',
          key: 'skuNo',
          editable: true,
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
            title: '尺码',
            key: 'sizeAttrValName',
            sortable: true
          }
        let arrTmpSkuName = {
          title: '商品名称',
          key: 'skuGoodsName'
        }
        let arrTmpSkuStatus = {
          title: '状态',
          key: 'skuStatus',
          render: (h, params) => {
            return h('div', [
              h('span', params.row.skuStatus===1?'开启':'关闭')
            ]);
          }
        }
        let arrTmpAction = {
          title: '操作',
          key: 'action',
          width: 150,
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'info',
                  size: 'small'
                },
                on: {
                  click: () => {
                    this.handleOperatorGoodsSkuStatus(params.row)
                  }
                }
              }, params.row.skuStatus===1?'关闭':'开启')
            ]);
          }
        }
        this.columnsSkuList.push(arrTmpIndex)
        this.columnsSkuList.push(arrTmpSkuNo)
        if(this.goods.specOpen===1){
          if(this.goods.specSizeOpen===1){
            this.columnsSkuList.push(arrTmpColor)
            this.columnsSkuList.push(arrTmpSize)
          }else{
            this.columnsSkuList.push(arrTmpSpec)
          }
        }
        // this.columnsSkuList.push(arrTmpSkuName)
        this.columnsSkuList.push(arrTmpSkuStatus)
        if(this.goods.goodsStatus===1){
          this.columnsSkuList.push(arrTmpAction)
        }
      },
      handleApplySkuAttrAndSize(params){
        console.log('handleApplySkuAttrAndSize', params)
      },
      handleSkuSizeCheckAll (param) {
        console.log('handleSkuSizeCheckAll', param)
        if (this.skuSizeIndeterminate) {
          this.skuSizeCheckAll = false;
        } else {
          this.skuSizeCheckAll = !this.skuSizeCheckAll;
        }
        this.skuSizeIndeterminate = false;

        if (this.skuSizeCheckAll) {
          this.skuSizeCheckAllGroup = [];
          for(let i=0; i<this.goodsSizeSpecAttrData.length; i++){
            this.skuSizeCheckAllGroup.push(this.goodsSizeSpecAttrData[i].valueId)
          }
        } else {
          this.skuSizeCheckAllGroup = [];
        }
        // 增删sku
        this.updateSizeSkuList()
      },
      // 两级属性 更新sku列表
      updateSizeSkuList(){
        if(this.goods.specSizeOpen!==1){
          return false
        }
        let data = {
          goodsId:this.goods.goodsId,
          colorAttrValId:this.skuColorSelectedVal,
          sizeAttrValIds:this.skuSizeCheckAllGroup
        }
        updateSizeSkuListApi(data)
          .then(res => {
            res = res.data
            if(res.result===1){
              this.skuListTableData = res.data
              this.$Message.success(res.successMessage)
            }else{
              this.$Message.error(res.errorMessage)
            }
          })
      },
      // 刷新sku列表
      getSkuListByGoodsId(){
        let goodsId = this.goods.goodsId
        getSkuListByGoodsIdApi(goodsId)
          .then(res => {
            res = res.data
            if(res.result===1){
              this.skuListTableData = res.data
              this.$Message.success(res.successMessage)
            }else{
              this.$Message.error(res.errorMessage)
            }
          })
      },
      checkSkuSizeAllGroupChange (data) {
        console.log('checkSkuSizeAllGroupChange', data)
        if (data.length === this.goodsSizeSpecAttrData.length) {
          this.skuSizeIndeterminate = false;
          this.skuSizeCheckAll = true;
        } else if (data.length > 0) {
          this.skuSizeIndeterminate = true;
          this.skuSizeCheckAll = false;
        } else {
          this.skuSizeIndeterminate = false;
          this.skuSizeCheckAll = false;
        }
        // 增删sku
        this.updateSizeSkuList()
      },
      // 更新sku 状态
      handleOperatorGoodsSkuStatus(skuRow){
        let skuStatus = skuRow.skuStatus===1? 2 : 1;
        let data = {
          skuId: skuRow.skuId,
          skuStatus: skuStatus
        }
        updateSkuStatusApi(data)
          .then(res => {
            res = res.data
            if(res.result===1){
              skuRow.skuStatus = skuStatus
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
      handleGoodsSpecNext(){
        this.$router.push({
          name: 'goods_detail',
          params: {goodsId:this.goods.goodsId}
        })
      }
    },
    mounted () {
      let goodsId=this.$route.params.goodsId
      if(goodsId) {
        this.goodsSnSearchDisable = true
        this.loadGoods(goodsId)
      }
    }
  }
</script>

<style scoped>

</style>
