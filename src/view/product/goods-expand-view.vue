<template>
    <div>
      <div v-for="(row, index) in rows" :key="index">
        <Row class="expand-row">
          <Col span="8">
            <span class="expand-key">sku: </span>
            <span class="expand-value">{{ row.skuNo }}</span>
          </Col>
          <Col span="8" v-if="row.colorAttrValName">
            <span class="expand-key">颜色: </span>
            <span class="expand-value">{{ row.colorAttrValName }}</span>
          </Col>
          <Col span="8" v-if="row.sizeAttrValName">
            <span class="expand-key">尺码: </span>
            <span class="expand-value">{{ row.sizeAttrValName }}</span>
          </Col>
        </Row>
        <Row class="expand-row">
          <Col span="8">
            <span class="expand-key">销售价格: </span>
            <span class="expand-value">{{ row.salePrice }}</span>
          </Col>
          <Col span="8" v-if="plusPriceOpen">
            <span class="expand-key">plus价格: </span>
            <span class="expand-value">{{ row.plusPrice }}</span>
          </Col>
          <Col span="8" v-if="superVipPriceOpen">
            <span class="expand-key">SVip价格: </span>
            <span class="expand-value">{{ row.superVipPrice }}</span>
          </Col>
        </Row>
        <Row>
          <Col span="8">
            <span class="expand-key">库存: </span>
            <span class="expand-value">{{ row.inventoryNum }}</span>
          </Col>
          <Col span="8">
            <span class="expand-key">状态: </span>
            <span class="expand-value">{{ row.skuStatusInfo }}</span>
          </Col>
        </Row>
      </div>
    </div>
</template>

<script>
  export default {
    name: 'goods-expand-view',
    props: {
      rows: []
    },
    data (){
      return {
        rowDemo: {
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
          skuStatusInfo: '',
          specFacePictures: 'http://tgshop.oss-cn-shanghai.aliyuncs.com/16a2aa15721/20190508/571738504774684673/16a950b9d19.jpg',
          superVipPrice: 0,
          superVipPriceOpen: 0,
          inventoryNum: 10
        }
      }
    }
  }
</script>

<style scoped>
  .expand-row{
    margin-bottom: 16px;
  }
</style>
