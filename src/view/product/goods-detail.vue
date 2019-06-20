<template>
    <div>
      <div>
        <Steps :current="2">
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
            <p slot="extra">
              <Poptip
                confirm
                title='确定将商品转为"待发布"状态进行编辑?'
                @on-ok="handleStatusChangeClick(1)"
                ok-text="是"
                cancel-text="否"
                v-if="goodsEditable">
                <a shape="circle">启用编辑</a>
              </Poptip>
              <Poptip
                confirm
                title='确定将商品下架?'
                @on-ok="handleStatusChangeClick(6)"
                ok-text="是"
                cancel-text="否"
                v-if="goodsEditable">
                <a shape="circle">下架</a>
              </Poptip>
              <Poptip
                confirm
                title='确定申请解除锁定?'
                @on-ok="handleStatusChangeClick(8)"
                ok-text="是"
                cancel-text="否"
                v-if="goods.goodsStatus===7">
                <a shape="circle">申请解锁</a>
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
      <!--      商品状态,1: 未发布，2：待审核，3：审核驳回，4：待上架，5：在售，6：已下架，7：锁定， 8： 申请解锁-->
      <div  v-show="goods.goodsStatus===1">
        <div class="top5">
          <Card>
            <p slot="title">
              <Icon type="ios-film-outline"></Icon>
              封面图
            </p>
            <a href="#" slot="extra" @click.prevent="handleApplyFacePicture">
              <Icon type="ios-loop-strong"></Icon>
              应用
            </a>
            <div>
              <div class="demo-upload-list" v-for="item in facePicUploadList" :key="item.name">
                <template v-if="item.status === 'finished'">
                  <img :src="item.url">
                  <div class="demo-upload-list-cover">
                    <Icon type="ios-eye-outline" @click.native="handleView(item)"></Icon>
                    <Icon type="ios-trash-outline" @click.native="handleRemoveFacePic(item)"></Icon>
                  </div>
                </template>
                <template v-else>
                  <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
                </template>
              </div>
              <Upload
                ref="facePicUpload"
                :show-upload-list="false"
                :default-file-list="defaultList"
                :on-success="handleSuccess"
                :format="['jpg','jpeg','png']"
                :max-size="20480"
                :on-format-error="handleFormatError"
                :on-exceeded-size="handleMaxSize"
                :before-upload="handleBeforeUploadFacePic"
                type="drag"
                :headers="uploadHeaders"
                :data="picUploadData"
                :action="uploadGoodsUrl"
                style="display: inline-block;width:58px;"
                v-show="facePicUploadList.length<1">
                <div style="width: 58px;height:58px;line-height: 58px;" >
                  <Icon type="ios-camera" size="20"></Icon>
                </div>
              </Upload>
            </div>
          </Card>
          <Modal title="View Image" v-model="visible">
            <img :src="imageUrl" v-if="visible" style="width: 100%">
          </Modal>
        </div>
        <div class="top5">
          <Card>
            <p slot="title">
              <Icon type="ios-film-outline"></Icon>
              主图
            </p>
            <a href="#" slot="extra" @click.prevent="handleApplyMainPicture">
              <Icon type="ios-loop-strong"></Icon>
              应用
            </a>
            <div>
              <div class="demo-upload-list" v-for="item in mainPicUploadList" :key="item.name">
                <template v-if="item.status === 'finished'">
                  <img :src="item.url">
                  <div class="demo-upload-list-cover">
                    <Icon type="ios-eye-outline" @click.native="handleView(item)"></Icon>
                    <Icon type="ios-trash-outline" @click.native="handleRemoveMainPic(item)"></Icon>
                  </div>
                </template>
                <template v-else>
                  <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
                </template>
              </div>
              <Upload
                ref="mainPicUpload"
                :show-upload-list="false"
                :default-file-list="defaultList"
                :on-success="handleSuccess"
                :format="['jpg','jpeg','png']"
                :max-size="20480"
                :on-format-error="handleFormatError"
                :on-exceeded-size="handleMaxSize"
                :before-upload="handleBeforeUploadMainPic"
                multiple
                type="drag"
                :headers="uploadHeaders"
                :data="picUploadData"
                :action="uploadGoodsUrl"
                style="display: inline-block;width:58px;"
                v-show="mainPicUploadList.length<5">
                <div style="width: 58px;height:58px;line-height: 58px;" >
                  <Icon type="ios-camera" size="20"></Icon>
                </div>
              </Upload>
            </div>
          </Card>
        </div>
        <div class="top5">
          <Card>
            <p slot="title">
              <Icon type="ios-film-outline"></Icon>
              详情图
            </p>
            <a href="#" slot="extra" @click.prevent="handleApplyDetailPicture">
              <Icon type="ios-loop-strong"></Icon>
              应用
            </a>
            <div>
              <div class="demo-upload-list" v-for="item in detailPicUploadList" :key="item.name">
                <template v-if="item.status === 'finished'">
                  <img :src="item.url">
                  <div class="demo-upload-list-cover">
                    <Icon type="ios-eye-outline" @click.native="handleView(item)"></Icon>
                    <Icon type="ios-trash-outline" @click.native="handleRemoveDetailPic(item)"></Icon>
                  </div>
                </template>
                <template v-else>
                  <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
                </template>
              </div>
              <Upload
                ref="detailPicUpload"
                :show-upload-list="false"
                :default-file-list="defaultList"
                :on-success="handleSuccess"
                :format="['jpg','jpeg','png']"
                :max-size="20480"
                :on-format-error="handleFormatError"
                :on-exceeded-size="handleMaxSize"
                :before-upload="handleBeforeUploadDetailPic"
                multiple
                type="drag"
                :headers="uploadHeaders"
                :data="picUploadData"
                :action="uploadGoodsUrl"
                style="display: inline-block;width:58px;"
                v-show="detailPicUploadList.length<5">
                <div style="width: 58px;height:58px;line-height: 58px;" >
                  <Icon type="ios-camera" size="20"></Icon>
                </div>
              </Upload>
            </div>
          </Card>
        </div>
        <div class="top5">
          <Card>
            <p slot="title">
              <Icon type="ios-film-outline"></Icon>
              其他
            </p>
            <a href="#" slot="extra" @click.prevent="handleApplySkuFormItem">
              <Icon type="ios-loop-strong"></Icon>
              应用
            </a>
            <div>
              <Form :model="skuFormItem" :label-width="80">
                <FormItem label="运费">
                  <Select v-model="skuFormItem.templateId" clearable >
                    <Option v-for="item in shipFeeArr" value="item.id" :key="item.id">{{item.name}}</Option>
                  </Select>
                </FormItem>
                <FormItem label="体积">
                  <InputNumber v-model="skuFormItem.volume" :precision="2" :min="0"></InputNumber>
                </FormItem>
                <FormItem label="重量">
                  <InputNumber v-model="skuFormItem.weight" :precision="2" :min="0"></InputNumber>
                </FormItem>
                <FormItem label="尺寸">
                  <Input type="text" v-model="skuFormItem.itemSize" placeholder="商品长宽高尺寸" :maxlength="200"></Input>
                </FormItem>
              </Form>
            </div>
          </Card>
        </div>
      </div>
      <div class="top5">
        <Button type="primary" @click="handleNextClick">下一步</Button>
      </div>
    </div>
</template>

<script>
  import {goodsUrl} from '@/api/apiUrl'
  import {getGoodsByIdApi, getGoodsBySnApi} from '@/api/goodsApi.js'
  import {updateGoodsSkuPicApi} from '@/api/skuApi.js'
  import Tables from '_c/tables'
  import { getToken } from '../../libs/util'
  import { getSkuListByGoodsIdApi, updateGoodsSkuInfoApi } from '../../api/skuApi'
  import './goods.less'
  import { getGoodsEditable, getGoodsStatusName } from './goods-util'
  import { getGoodsSkuListApi, updateGoodsStatusApi } from '../../api/goodsApi'
  export default {
    name: 'GoodsDetail',
    components:{
      Tables
    },
    data () {
      return {
        uploadGoodsUrl:goodsUrl.uploadGoodsUrl,
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
        skuListTableData:[],
        // goods 返回数据结构
        goodsResultData:{
          goods:{},
          specAttrValList:[],
          sizeAttrValList:[],
          goodsSkuList:[]
        },
        // 上传图片参数
        picUploadData:{
          goodsId:'',
          type:1
        },
        uploadHeaders:{
          token: getToken()
        },
        // 封面图
        facePicUploadFileListDemo:[{
          pictureId:'',
          pictureName:'',
          pictureUrl:''
        }],
        facePicUploadFileList:[],
        imageVisible:false,
        defaultList: [],
        imageUrl: '',
        visible: false,
        facePicUploadList: [],
        mainPicUploadList:[],
        detailPicUploadList:[],
        // sku 其他属性
        skuFormItem: {
          templateId: '',
          volume: 0,
          weight: 0,
          itemSize: ''
        },
        shipFeeArr: [
          {
            id:'0',
            name:'包邮'
          },
          {
            id: '1',
            name: '满98包邮'
          },
          {
            id: '2',
            name: '同城运费'
          },{
            id: '3',
            name: '运费'
          }
        ],
        test:''
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
            }
          })
        }
      },
      resetGoodsData(data){
        this.goods=data.goods
        this.picUploadData.goodsId=this.goods.goodsId
        this.resetColumnsSkuList()
        this.refreshSkuList()
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
        let arrTmpMainImages = {
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
        let arrTmpDetailImages = {
          title: '详情图',
          key: 'pictureDescription',
          render: (h, params) => {
            if(params.row.pictureDescription){
              let pics = params.row.pictureDescription.split(',')
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
        let arrTmpWeight = {
          width: 80,
          title: '重量',
          key: 'weight'
        }
        let arrTmpVolume = {
          width: 80,
          title: '体积',
          key: 'volume'
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
        this.columnsSkuList.push(arrTmpMainImages)
        this.columnsSkuList.push(arrTmpDetailImages)
        this.columnsSkuList.push(arrTmpWeight)
        this.columnsSkuList.push(arrTmpVolume)
        this.columnsSkuList.push(arrTmpItemSize)
        this.columnsSkuList.push(arrTmpSkuStatus)
      },
      handleSelectAll (status) {
        this.$refs.skuListTable.selectAll(status);
      },
      // 应用封面图
      handleApplyFacePicture(){
        this.doApplyPictures(this.$refs.facePicUpload,1)
      },
      // 应用主图
      handleApplyMainPicture(){
        this.doApplyPictures(this.$refs.mainPicUpload,2)
      },
      // 应用详情图
      handleApplyDetailPicture(){
        this.doApplyPictures(this.$refs.detailPicUpload,3)
      },
      doApplyPictures(upload,type){
        if(!upload.fileList.length){
          this.$Message.warning('请上传图片')
          return false
        }
        let selectionArr = this.$refs.skuListTable.getSelection()
        if(!selectionArr.length){
          this.$Message.warning('请选择SKU')
          return false
        }
        let skuIds = []
        let picIds = []
        let picUrls = ''
        for (let i = 0; i < selectionArr.length; i++) {
          skuIds.push(selectionArr[i].skuId)
        }
        let fileList = upload.fileList;
        for (let i = 0; i < fileList.length; i++) {
          if(fileList[0].response.result===1){
            let picData = fileList[i].response.data[0]
            picIds.push(picData.pictureId)
            picUrls +=picData.pictureUrl
            if(i<fileList.length-1){
              picUrls +=','
            }
          }
        }

        let data = {
          goodsId: this.goods.goodsId,
          skuIds: skuIds,
          picIds: picIds,
          type: type
        }
        updateGoodsSkuPicApi(data)
          .then(resp => {
            let res = resp.data
            if(res.result){
              // for (let i = 0; i < skuIds.length; i++) {
              //   for (let j = 0; j < this.skuListTableData.length; j++) {
              //     if(skuIds[i]===this.skuListTableData[j].skuId){
              //       this.skuListTableData[j]._checked = true
              //       if(type===1){
              //         this.skuListTableData[j].specFacePictures = picUrls
              //       }else if(type===2){
              //         this.skuListTableData[j].pictureMain = picUrls
              //         debugger
              //       }else if(type===3){
              //         this.skuListTableData[j].pictureDescription = picUrls
              //       }
              //       break
              //     }
              //   }
              // }
              this.refreshSkuList(skuIds)
              this.$Message.success(res.successMessage)
            }else{
              this.$Message.error(res.errorMessage)
            }
          })
      },
      // 应用其他
      handleApplySkuFormItem(){
        console.log('handleApplySkuFormItem',this.skuFormItem)
        let selectionArr = this.$refs.skuListTable.getSelection()
        if(!selectionArr.length){
          this.$Message.warning('请选择SKU')
          return false
        }
        let skuIds = []
        for (let i = 0; i < selectionArr.length; i++) {
          skuIds.push(selectionArr[i].skuId)
        }
        let data = {
          goodsId: this.goods.goodsId,
          skuIds: skuIds,
          templateId: this.skuFormItem.templateId,
          volume: this.skuFormItem.volume,
          weight: this.skuFormItem.weight,
          itemSize: this.skuFormItem.itemSize
        }
        updateGoodsSkuInfoApi(data)
          .then(resp => {
            let res = resp.data
            if(res.result){
              this.refreshSkuList(skuIds)
              this.$Message.success(res.successMessage)
            }else{
              this.$Message.error(res.errorMessage)
            }
          })
      },
      handleSkuTabDbClick(data, index){
        console.log('handleSkuTabDbClick', data, index)
        console.log(this.$refs.skuListTable)
        debugger
      },
      // ####
      handleView (item) {
        this.imageUrl = item.url;
        this.visible = true;
      },
      handleRemoveFacePic (file) {
        const fileList = this.$refs.facePicUpload.fileList;
        this.$refs.facePicUpload.fileList.splice(fileList.indexOf(file), 1);
      },
      handleRemoveMainPic (file) {
        const fileList = this.$refs.mainPicUpload.fileList;
        this.$refs.mainPicUpload.fileList.splice(fileList.indexOf(file), 1);
      },
      handleRemoveDetailPic (file) {
        const fileList = this.$refs.detailPicUpload.fileList;
        this.$refs.detailPicUpload.fileList.splice(fileList.indexOf(file), 1);
      },
      handleSuccess (res, file) {
        if(res.result===1) {
          if(res.data){
            let data = res.data[0]
            file.url = data.pictureUrl
            file.name = data.pictureId;
          }
        }
      },
      handleFormatError (file) {
        this.$Notice.warning({
          title: 'The file format is incorrect',
          desc: 'File format of ' + file.name + ' is incorrect, please select jpg or png.'
        });
      },
      handleMaxSize (file) {
        this.$Notice.warning({
          title: 'Exceeding file size limit',
          desc: 'File  ' + file.name + ' is too large, no more than 2M.'
        });
      },
      handleBeforeUploadFacePic () {
        const check = this.facePicUploadList.length < 5
        if (!check) {
          this.$Notice.warning({
            title: 'Up to five pictures can be uploaded.'
          });
        }
        return check;
      },
      handleBeforeUploadMainPic () {
        const check = this.facePicUploadList.length < 5
        if (!check) {
          this.$Notice.warning({
            title: 'Up to five pictures can be uploaded.'
          });
        }
        return check;
      },
      handleBeforeUploadDetailPic () {
        const check = this.facePicUploadList.length < 5
        if (!check) {
          this.$Notice.warning({
            title: 'Up to five pictures can be uploaded.'
          });
        }
        return check;
      },
      // 刷新sku列表
      refreshSkuList2(selectedSkuIds){
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
      handleNextClick(){
        this.$router.push({
          name: 'goods_price',
          params: {goodsId: this.goods.goodsId}
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
      initData(){
        let goodsId=this.$route.params.goodsId
        if(goodsId){
          this.loadGoods(goodsId)
        }
      }
    },
    mounted () {
      this.facePicUploadList = this.$refs.facePicUpload.fileList;
      this.mainPicUploadList = this.$refs.mainPicUpload.fileList;
      this.detailPicUploadList = this.$refs.detailPicUpload.fileList;
      this.initData()
    }
  }
</script>

<style scoped>
  .demo-upload-list{
    display: inline-block;
    width: 60px;
    height: 60px;
    text-align: center;
    line-height: 60px;
    border: 1px solid transparent;
    border-radius: 4px;
    overflow: hidden;
    background: #fff;
    position: relative;
    box-shadow: 0 1px 1px rgba(0,0,0,.2);
    margin-right: 4px;
  }
  .demo-upload-list img{
    width: 100%;
    height: 100%;
  }
  .demo-upload-list-cover{
    display: none;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0,0,0,.6);
  }
  .demo-upload-list:hover .demo-upload-list-cover{
    display: block;
  }
  .demo-upload-list-cover i{
    color: #fff;
    font-size: 20px;
    cursor: pointer;
    margin: 0 2px;
  }
</style>
