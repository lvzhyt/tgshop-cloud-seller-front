export const getGoodsStatusName = function (status) {
  // 商品状态,1: 未发布，2：待审核，3：审核驳回，4：待上架，5：在售，6：已下架，7：锁定， 8： 申请解锁
  let statusName = ''
  switch (status) {
    case 1:{
      statusName = '未发布'
      break
    }case 2:{
      statusName = '待审核'
      break
    }case 3:{
      statusName = '审核驳回'
      break
    }case 4:{
      statusName = '待上架'
      break
    }case 5:{
      statusName = '在售'
      break
    }case 6:{
      statusName = '已下架'
      break
    }case 7:{
      statusName = '锁定'
      break
    }case 8:{
      statusName = '申请解锁'
      break
    }default:{
      statusName = ''
    }
  }
  return statusName
}
// 获取商品开启编辑状态
export const getGoodsEditable = function (status) {
  //    商品状态,1: 未发布，2：待审核，3：审核驳回，4：待上架，5：在售，6：已下架，7：锁定， 8： 申请解锁
  let editable = status === 2 ||
    status === 3 ||
    status === 4 ||
    status === 6
  return editable;
}
