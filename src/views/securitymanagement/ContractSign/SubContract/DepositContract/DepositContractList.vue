<!--保证金合同List页面-->
<template>
  <div>
    <el-row v-loading.fullscreen.lock="isLoading">
      <p class="m-t-b-0">保证合同</p>
      <el-col :span="24">
        <csc-single-table
          :pageDef="pageDef"
          :entity="entity"
          :disableRowButtons="disableRowButtons"
          :disableQueryForm="disableQueryForm"
          :disableQueryButtons="disableQueryButtons"
          @add="add"
          @refresh="refresh"
          @edit="edit"
          @scan="scan"
          @delete="deletes"
          @pageQuery="doPageQuery"
        >
        </csc-single-table>
      </el-col>
    </el-row>
    <el-dialog
      class="dialog-style"
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      :width="dialogWidth"
      :fullscreen="fullScreen"
      v-if='dialogVisible'
      :before-close="handleGoodsDetailInfoClose"
      append-to-body>
      <!--动态组件-->
      <compoment v-bind:is="currentView" v-bind:info="deliverData" v-on:backFlag="getMsg"></compoment>
    </el-dialog>
  </div>
</template>

<script>
  import { getConGRTBZJList,saveGrtCon,delConGrtRel} from '@/api/contractsign'
  import guaranteeContractInfo from '../Common/GuaranteeContractInfo'
  import enums from "@/utils/enums"
    export default {
        name: "deposit-contract-list",
      components:{
        guaranteeContractInfo,
      },
      beforeMount(){
        this.deliverData.page='deposit';
      },
      props:{
        info:{
          type:Object,
        },
      },
      data(){
        return{
          dialogWidth:"60%",//弹出框的宽度
          entity: {},
          disableRowButtons:true,//显示查询删除按钮
          disableQueryForm:true,//禁止查询表单
          disableQueryButtons:true,//不显示刷新重置按钮
          deliverData:{},//传递的数据
          isLoading:false,
          pageDef: {
            queryDef: {
              columnNum:0, //一行几列
              queryCols: [
                {label: "账户名称", inputType: "input", modelName: "partyName"},
              ]
            },
            tabDef: {
              isSelect: false, //是否可以多选
              isIndex: false,  //是否有序号
              isCheckRadio:true,//是否单选
              //表格字段定义
              tabCols: [
                {label: "保证金协议编号", prop: "SUBCONTRACT_NUM",isFormat: true,enumType:'marginSortCd'},
                {label: "保证金所有权人", prop: "PARTY_NAME"},
                {label: "币种", prop: "BZ",isFormat: true,enumType:'currencyCd'},
                {label: "担保合同金额", prop: "BZJJE",},
              ]
            },
            buttons: [
              {label: "增加", funcName: "add", disabled: false},
              {label: "查看", funcName: "scan", disabled: false},
              {label: "编辑", funcName: "edit", disabled: false},
              {label: "删除", funcName: "delete", disabled: false},
              {label: "刷新", funcName: "refresh", disabled: false},
            ]
          },
          dialogVisible:false,//对话框
          fullScreen:false,//是否全屏
          currentView:"guaranteeContractInfo",
          dialogTitle:'选择',
        }
      },
      methods:{
        doPageQuery(listQuery){
          listQuery.contractId = this.info.contractId;
          listQuery.subcontractType = this.info.subcontractType;
          getConGRTBZJList(listQuery).then(response => {
            if(response.data.code == enums.stateCode.code.success){//返回数据成功
              var myEntity = {};
              myEntity.total=response.data.data.total;
              myEntity.data = response.data.data.list;
              this.entity = myEntity;
              this.$store.dispatch('setListLoading', false);
            } else{
              this.$message({
                message: '获取数据失败啦！',
                type: 'error'
              });
            }
          });
        },
        handleGoodsDetailInfoClose:function (done) {
          this.$confirm('确认关闭？')
            .then(_ => {
              done();
              this.refresh();
            })
            .catch(_ => {});
        },
        refresh(){
          var listQuery = {};
          listQuery.contractId = this.info.contractId;
          listQuery.subcontractType = this.info.subcontractType;
          listQuery.pageNum=1;
          listQuery.pageSize=10;
          this.$store.dispatch('setListLoading', true);
          this.doPageQuery(listQuery);
        },
        scan(row){
          if(row.length<=0){
            this.$message({
              message: '请选择要查看的数据!',
              type: 'error'
            });
            return;
          }
          this.currentView='guaranteeContractInfo';
          this.dialogTitle="担保合同信息";
          this.dialogWidth='100%';
          this.fullScreen = true;
          this.deliverData.isScan=true;
          this.deliverData.subcontractId = row.SUBCONTRACT_ID;//担保合同Id
          this.deliverData.conSubconId = row.CON_SUBCON_ID;//贷款合同与担保合同关系表id
          this.deliverData.subcontractType = this.info.subcontractType;
          this.deliverData.applyId = this.info.applyId;
          this.deliverData.conPartyId = this.info.conPartyId;
          this.deliverData.partyId = this.info.conPartyId;
          this.deliverData.contractId = this.info.contractId;
          this.dialogVisible=true;
        },
        edit(row){
          if(row.length<=0){
            this.$message({
              message: '请选择要修改的数据!',
              type: 'error'
            });
            return;
          }
          this.info.partyId=row.PARTY_ID;
          if(this.info.xgbz=='1'){
            if(row.IF_TOP_SUBCON!='1'){
              this.$message({
                message: '只能对最高额合同进行编辑！',
                type: 'error'
              });
              return;
            }
          } else{
            if(row.OPERATION_TYPE=='01'){
              this.$message({
                message: '引入合同不允许编辑！',
                type: 'error'
              });
              return;
            }
            this.currentView='guaranteeContractInfo';
            this.dialogTitle="担保合同信息";
            this.dialogWidth='100%';
            this.fullScreen = true;
            this.deliverData.isScan=false;
            this.deliverData.subcontractId = row.SUBCONTRACT_ID;//担保合同Id
            this.deliverData.conSubconId = row.CON_SUBCON_ID;//贷款合同与担保合同关系表id
            this.deliverData.subcontractType = this.info.subcontractType;
            this.deliverData.applyId = this.info.applyId;
            this.deliverData.conPartyId = this.info.conPartyId;
            this.deliverData.partyId = this.info.conPartyId;
            this.deliverData.contractId = this.info.contractId;
            this.dialogVisible=true;
          }
        },
        deletes(row){
          if(row.length<=0){
            this.$message({
              message: '请选择要删除的数据!',
              type: 'error'
            });
            return;
          }
          this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            center: true
          }).then(() => {
            var obj = {};
            obj.subcontractId = row.SUBCONTRACT_ID;
            obj.relationId = row.RELATION_ID;
            obj.conSubconId = row.CON_SUBCON_ID;
            obj.operationType = row.OPERATION_TYPE;
            obj.contractId = this.info.contractId;
            delConGrtRel(obj).then(response=>{
              if(response.data.code == enums.stateCode.code.success) {//返回数据成功
                this.$message({
                  message: '删除成功',
                  type: 'success'
                });
                this.refresh();
              }else{
                this.$message({
                  message: JSON.stringify(response.data),
                  type: 'error'
                });
              }
            });
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            })
          });
        },
        add(){//添加担保合同
          this.isLoading=true;
          var obj={};
          obj.subcontractType = this.info.subcontractType;
          obj.partyId = this.info.conPartyId;
          obj.conPartyId = this.info.conPartyId;
          obj.applyId = this.info.applyId;
          obj.contractId = this.info.contractId;
          obj.userNum = this.info.userNum;
          obj.orgNum = this.info.orgNum;

          saveGrtCon(obj).then(response=>{
            this.isLoading=false;
            if(response.data.code == enums.stateCode.code.success) {//返回数据成功
              this.currentView='guaranteeContractInfo';
              this.dialogTitle="担保合同信息";
              this.dialogWidth='100%';
              this.fullScreen = true;
              this.deliverData.isScan=false;
              this.deliverData.subcontractId = response.data.subcontractId;//担保合同Id
              this.deliverData.conSubconId = response.data.conSubconId;//贷款合同与担保合同关系表id
              this.deliverData.subcontractType = this.info.subcontractType;
              this.deliverData.contractType = this.info.contractType;
              this.deliverData.applyId = this.info.applyId;
              this.deliverData.conPartyId = this.info.conPartyId;
              this.deliverData.partyId = this.info.conPartyId;
              this.deliverData.contractId = this.info.contractId;
              this.dialogVisible=true;
            }else{
              this.$message({
                message: JSON.stringify(response.data),
                type: 'error'
              });
            }
          });
        },
        getMsg: function (obj) {
          if (obj.flag === 'ok') {
            this.dialogVisible = false;
            this.refresh();
          }
          if(obj.flag==='close'){
            this.dialogVisible = false;
          }
          if(obj.flag==='showDialog'){
            this.info.partyId=obj.partyId;
            this.info.subcontractType=obj.subcontractType;
            this.dialogVisible=false;
            this.refresh();
            saveGrtCon(this.info).then(response=>{
              if(response.data.code == enums.stateCode.code.success) {//返回数据成功
                this.currentView='guaranteeContractInfo';
                this.dialogTitle="担保合同信息";
                this.dialogWidth='100%';
                this.fullScreen = true;
                this.deliverData.isScan=false;
                this.deliverData.subcontractId = response.data.subcontractId;//担保合同Id
                this.deliverData.conSubconId = response.data.conSubconId;//贷款合同与担保合同关系表id
                this.deliverData.subcontractType = this.info.subcontractType;
                this.deliverData.applyId = this.info.applyId;
                this.deliverData.partyId = this.info.partyId;
                this.deliverData.contractId = this.info.contractId;
                this.dialogVisible=true;
              }else{
                this.$message({
                  message: JSON.stringify(response.data),
                  type: 'error'
                });
              }
            });
          }
        },
      },
    }
</script>

<style scoped>

</style>
