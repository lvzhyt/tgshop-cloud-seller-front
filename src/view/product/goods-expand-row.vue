<template>
    <div>
      <Table  :columns="columnsSkuList" :data="skuListData"></Table>
    </div>
</template>

<script>
    export default {
      name: 'goods-expand-row',
      props:{
        goods:Object
      },
      data() {
        return {
          columnsSkuList:[
            {
              minWidth:80,
              title: '商品编号',
              key: 'skuNo'
            },
            {
              title: '颜色',
              key: 'colorAttrValName'
            },
            {
              width: 80,
              title: '尺码',
              key: 'sizeAttrValName'
            },
            {
              title: '售价',
              key: 'salePrice'
            },
            {
              title: '库存',
              key: 'inventoryNum'
            },
            {
              width: 70,
              title: '状态',
              key: 'skuStatus',
              render: (h, params) => {
                return h('div', [
                  h('span', params.row.skuStatus===1?'开启':'关闭')
                ]);
              }
            }
          ],
          skuListData:[],
          rowsDemo:[
            {
              colorAttrValName: '14寸 红色(赠送打气筒+车篮）',
              costPrice: 0,
              goodsId: '579685623607201793',
              inventoryNum: 0,
              itemSize: null,
              leftNum: 0,
              lockNum: 0,
              marketPrice: 0,
              pictureDescription: null,
              pictureMain: null,
              plusPrice: 0,
              plusPriceOpen: 0,
              salePrice: 0,
              sizeAttrValName: null,
              skuId: '579685876012027904',
              skuNo: '579685876012027905',
              skuStatus: 1,
              specFacePictures: null,
              superVipPrice: 0,
              superVipPriceOpen: 0,
              templateId: '0',
              volume: 0,
              weight: 0
            }
          ]
        }
      },
      methods:{
        resetColumnsSkuList(){
          this.columnsSkuList = []
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
            key: 'skuNo'
          }
          let arrTmpSpec = {
            title: '规格',
            key: 'colorAttrValName'
          }
          let arrTmpColor = {
            title: '颜色',
            key: 'colorAttrValName'
          }
          let arrTmpSize = {
            width: 80,
            title: '尺码',
            key: 'sizeAttrValName'
          }

          let arrTmpSalePrice = {
            title: '售价',
            key: 'salePrice'
          }
          let arrTmpInventory = {
            title: '库存',
            key: 'inventoryNum'
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
          this.columnsSkuList.push(arrTmpSalePrice)
          this.columnsSkuList.push(arrTmpInventory)
          this.columnsSkuList.push(arrTmpSkuStatus)
        },
        initData(){
          if(this.goods){
            if(this.goods.skuList){
              this.skuListData = this.goods.skuList
            }
            this.resetColumnsSkuList()
          }else{

          }
        }
      },
      mounted() {
        this.initData()
      }
    }
</script>

<style scoped>
  .expand-row{
    margin-bottom: 16px;
  }
  .expand-col{

  }
  .expand-key{

  }
  .expand-value{

  }
</style>
