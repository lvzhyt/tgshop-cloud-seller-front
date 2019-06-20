<template>
  <div>
    <div >
      <Steps :current="0">
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
      <Form ref="goodsForm" :model="formGoods" :label-width="80" :rules="ruleValidate">
        <FormItem label="类目">
          <Cascader :data="categoriesList" :load-data="handleSearchCategoriesData" :filterable="true"></Cascader>
        </FormItem>
        <FormItem label="品牌">
          <Select v-model="formGoods.brandId"
                  filterable remote clearable
          :remote-method="handleSearchBrands"
          :loading="loadingBrand">
            <Option v-for="(option,index) in brandList"
                    :value="option.brandId" :key="index">
              {{option.brandName}}
            </Option>
          </Select>
        </FormItem>
        <FormItem label="商品名称" prop="goodsName"><Input v-model="formGoods.goodsName" ></Input></FormItem>
        <FormItem label="关键字"><Input v-model="formGoods.keywords"></Input></FormItem>
        <FormItem label="商品货号" prop="goodsSn">
          <Input v-model="formGoods.goodsSn" placeholder="空为自动编码"></Input></FormItem>
        <FormItem label="产地"><Input v-model="formGoods.productOrigin"></Input></FormItem>
        <FormItem label="一级属性">
          <Checkbox  v-model="specOpenBool">开启颜色/规格</Checkbox>
          <Tooltip content="SPU包含多个SKU.需开启一级属性" placement="top">
            <Icon type="ios-help-circle-outline" size="18" />
          </Tooltip>
        </FormItem>
        <FormItem label="二级属性">
          <Checkbox :disabled="!specOpenBool" v-model="specSizeOpenBool" >开启尺码</Checkbox>
          <Tooltip content="SKU由两级确定.如衣服+尺码. " placement="top">
            <Icon type="ios-help-circle-outline" size="18" />
          </Tooltip>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="handleGoodsAddNext('goodsForm')">下一步</Button>
<!--          <Button style="margin-left: 8px" @click="handleReset('goodsForm')">重置</Button>-->
        </FormItem>
      </Form>
    </div>
  </div>

</template>

<script>
  import {searchBrandApi, searchCategoriesApi} from '@/api/category.js'
  import {saveGoodsApi, validGoodsSnApi} from '@/api/goodsApi.js'
  import './goods.less'
  export default {
    name: 'GoodsAdd',
    components: { },
    data(){
      const validateGoodsSn = (rule, value, callback) => {
        if (!value) {
          return callback();
        }
        validGoodsSnApi(value).then(res => {
          if(res.data.result===1){
            if(res.data.data){
              return callback()
            }else {
              return callback(new Error('货号已存在'))
            }
          }else{
            return callback(new Error('唯一校验失败'))
          }
        })
        // 模拟异步验证效果
        // setTimeout(() => {
        //   if (!Number.isInteger(value)) {
        //     callback(new Error('Please enter a numeric value'));
        //   } else {
        //     if (value < 18) {
        //       callback(new Error('Must be over 18 years of age'));
        //     } else {
        //       callback();
        //     }
        //   }
        // }, 1000);
      };
      return {
        formGoods:{
          goodsId:null,
          goodsName:null,
          keywords:null,
          brandId:null,
          brandName:null,
          categoryId:null,
          categoryName:null,
          goodsSn:null,
          // 原产地
          productOrigin:null,
          // 开启规格
          specOpen:1,
          // 开启尺码
          specSizeOpen: 0
        },
        specOpenBool:true,
        specSizeOpenBool: false,
        brandList:[],
        loadingBrand:false,
      //  类目选择
        categoriesList:[],
        ruleValidate:{
          goodsName: [
            { required: true, message: '商品名称不能为空', trigger: 'blur' },
            { max: 200, message: '最大长度200', trigger: 'blur' }
          ],
          goodsSn: [
            { max:100, message:'最大长度100', trigger: 'change' },
            {validator: validateGoodsSn, trigger: 'blur'}
          ]
        }
      }
    },
    methods :{
      handleSearchBrands(query){
        if(query!==''){
          searchBrandApi(query).then(res => {
            const {result, data} = res.data
            if(result===1){
              this.brandList = data
            }
          })
        }else{
          this.brandList=[]
        }
      },
      handleSearchCategoriesData(item, callback){
        item.loading = true
        searchCategoriesApi(item.value)
          .then(res => {
            const {result, data} = res.data
            if(result===1){
              item.children = []
              for (let i = 0; i < data.length; i++) {
                let category = data[i]
                let itemChild
                if(category.hasLeaf === 1){
                  // 非叶子节点
                  itemChild = {
                    value: category.categoryId,
                    label: category.categoryName,
                    children:[],
                    loading: false
                  }
                }else {
                  itemChild = {
                    value: category.categoryId,
                    label: category.categoryName
                  }
                }
                item.children.push(itemChild)
              }
            }else {
              this.$Message.error(res.data.errorMessage)
            }
            item.loading = false
            callback()
          })
      },
      loadFirstLevCategories(){
        searchCategoriesApi('0')
          .then(res => {
            const {result, data} = res.data
            if(result===1){
              this.categoriesList = []
              for (let i = 0; i < data.length; i++) {
                let category = data[i]
                let item = {
                  value: category.categoryId,
                  label: category.categoryName,
                  children:[],
                  loading: false
                }
                this.categoriesList.push(item)
              }
            }else {
              this.$Message.error(res.data.errorMessage)
            }
          })
      },
      handleGoodsAddNext (name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.formGoods.specOpen = this.specOpenBool? 1 : 0
            this.formGoods.specSizeOpen = this.specOpenBool ? (this.specSizeOpenBool? 1:0) :0
            console.log(this.formGoods)
            saveGoodsApi(this.formGoods)
              .then(res => {
                let resData = res.data
                if(res.data.result===1){
                  let goodsId = resData.data
                  this.$router.push({
                    name: 'goods_spec',
                    params: {goodsId:goodsId}
                  })
                }
              })
          } else {
            this.$Message.error('Fail!');
          }
        })
      },
      handleReset (name) {
        this.$refs[name].resetFields();
      }
    },
    mounted () {
      this.loadFirstLevCategories()
    }
  }
</script>

<style scoped>

</style>
