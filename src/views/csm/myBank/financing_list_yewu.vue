<template>
  <csc-single-table 
  :pageDef="pageDef" 
  :entity="entity" 
  @findOne="findOne"
  :disableQueryForm="disableQueryForm" 
  :disableRowButtons="disableRowButtons"            
   @pageQuery="doPageQuery"
   >
  </csc-single-table>
</template>

<script>
  // 账户信息
  import CscSingleTable from '@/components/CscSingleTable/CscSingleTable' // 引入的这个是子组件，需要把父组件的值传递给子组件修改子组件
  import { getfinancingListYW } from '@/api/csm'// 正常往后台发送异步请求的类
 

  export default {
    name: 'financing_list_yewu',
    data: function() {
      return {
        disableQueryForm: true, // 父组件给的新的值，隐藏form表单按钮
        disableRowButtons: true, // 隐藏tab表单按钮
        listLoading: false,
        entity: {// 这个就相当于一个form表单，在这里定义之后可以直接在上面去使用 entity.属性名
          // data: [
          //   {
          //     approvalNum: 'xxx0000000',
          //     bizType: '紧急事件',
          //     creditAmt: '0',
          //     availableAmt: '0',
          //     startDate: '2017-09-23',
          //     endDate: '2017-12-12',
          //     orgNum: '007',
          //     userNum:'000999'

          //   }
          // ]
        },

        pageDef: {
          // 查询条件定义
          queryDef: {},

          tabDef: {
            isSelect: false, // 是否可以多选
            isIndex: true, // 是否有序号

            // 表格字段定义
            tabCols: [
       
              { label: '合同编号', prop: 'contractNum', isSort: true },
              { label: '业务品种', prop: 'productType', isSort: true },
              { label: '币种', prop: 'currencyCd', isSort: true },
              { label: '合同金额', prop: 'contractAmt', isSort: true },
              { label: '合同已用金额', prop: 'conYuE', isSort: true },
              { label: '合同起期', prop: 'beginDate', isSort: true },
              { label: '合同止期', prop: 'endDate', isSort: true },
              { label: '保证金余额', prop: 'bzjje', isSort: true },
              { label: '逾期天数', prop: 'yqts', isSort: true },
              { label: '逾期本金', prop: 'jjyqbj', isSort: true },
              { label: '逾期利息', prop: 'arrearItr', isSort: true },
              { label: '分类', prop: 'clsResult', isSort: true },
     

              { label: '经办机构', prop: 'orgNum', isSort: true },
              { label: '经办人', prop: 'userNum', isSort: true }

            ]
          },
          buttons: [
            { label: '查看', funcName: 'findOne' }
          ]
        }
      }
    },

    components: { CscSingleTable }, // 引入的子组件

    methods: {
      doPageQuery(listQuery) {
        getfinancingListYW(listQuery).then(response => {
          this.entity = response.data
          this.$store.dispatch('setListLoading', false)

     
        }).catch((error) => {
    
          console.log(error)
        })
      },


      findOne() { // 重置表单就是直接清空表单里面的数据
        console.log('查询')
      }
    },

    mounted() {

     this.doPageQuery() 
  
    }

  }
</script>
