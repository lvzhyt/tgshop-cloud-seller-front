<template>
  <div>
    <InputNumber
      :max="10000"
      :precision="2"
      v-model="value9"
      :formatter="formatterNumber"

    ></InputNumber>
    <InputNumber
      :max="100"
      v-model="value10"
      :formatter="value => `${value}%`"
      :parser="value => value.replace('%', '')"></InputNumber>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        value9: 1000,
        value10: 100
      }
    },
    methods:{
      formatterNumber(value){
        if(value.indexOf('.')!==-1){
          let arr = value.split('.')
          let val = arr[1]
          if(val){
            if(val==='00'){
              return arr[0]
            }else{
              if(val%10===0){
                let num = arr[0]+'.'+(val/10)
                return num
              }
            }
          }
        }
        return value
      },
      parser(value){
        return value
      }
    }
  }
</script>
