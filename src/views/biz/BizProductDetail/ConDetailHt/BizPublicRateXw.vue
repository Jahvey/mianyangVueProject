<!--小微合同利率类型 -->
<template>
  <el-container>
    <el-main>
      <legend>利率信息</legend>

      <div id="tableloanrate"
           columns="4">

        <el-row :gutter="20"
                class="form">
          <el-form el-form
                   label-width="200px"
                   :model="loanrate"
                   size="medium"
                   :rules="rules"
                   ref="loanrate"
                   label-position="right"
                   :disabled="disBizPublicRateXwCycle">
            <el-col :span="12">
              <el-form-item label="利率类型:"
                            prop="rateType"
                            class="special-input">
                <el-input v-model="loanrate.rateType"
                          @change="onselectType"></el-input>

              </el-form-item>
            </el-col>

            <el-col :span="12"
                    v-show="isFloatWay">
              <el-form-item label="浮动方式:"
                            prop="floatWay"
                            class="special-input"
                            :disabled="disFloatWay">
                <el-input v-model="loanrate.floatWay"
                          @change="countRate()"></el-input>

              </el-form-item>
            </el-col>
            <el-col :span="12"
                    v-show="isRateFloatProportion">
              <el-form-item label="浮动比例(%):"
                            prop="rateFloatProportionq"
                            class="special-input"
                            :disabled="disRateFloatProportion">
                <el-input v-model="loanrate.rateFloatProportion"
                          @blur="countRate(1)"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="申请利率(%):"
                            prop="yearRate"
                            class="special-input">
                <el-input v-model="loanrate.yearRate"
                          @blur="countRate2"></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="利率调整方式:"
                            prop="irUpdateFrequency"
                            class="special-input">
                <el-select v-model="loanrate.irUpdateFrequency"
                           style="width:100%"
                           :disabled="disIrUpdateFrequency">
                  <el-option v-for="(value,key) in irUpdateFrequency"
                             :key="key"
                             :label="value"
                             :value="key"></el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="结息周期:"
                            prop="interestCollectType"
                            class="special-input">
                <el-select v-model="loanrate.interestCollectType"
                           style="width:100%">
                  <el-option v-for="(value,key) in interestCollectType"
                             :key="key"
                             :label="value"
                             :value="key"></el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="节假日顺延标志:"
                            prop="holidayFlg"
                            class="special-input">
                <el-select v-model="loanrate.holidayFlg"
                           style="width:100%"
                           @change="conChangeHoliday">
                  <el-option v-for="(value,key) in holidayFlg"
                             :key="key"
                             :label="value"
                             :value="key"></el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="12"
                    v-show="isHolidayIntFlg">
              <el-form-item label="节假日利息处理方式:"
                            prop="holidayIntFlg"
                            class="special-input">
                <el-select v-model="loanrate.holidayIntFlg"
                           style="width:100%"
                           :disabled="disHolidayIntFlg">
                  <el-option v-for="(value,key) in holidayIntFlg"
                             :key="key"
                             :label="value"
                             :value="key"></el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="12"
                    v-show="true">
              <el-form-item label="宽限期方式:"
                            prop="gracePeriodType"
                            class="special-input">
                <el-select v-model="loanrate.gracePeriodType"
                           style="width:100%"
                           :disabled="disGracePeriodType">
                  <el-option v-for="(value,key) in gracePeriodType"
                             :key="key"
                             :label="value"
                             :value="key"></el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="12"
                    v-show="isGracePeriodDay">
              <el-form-item label="宽限期天数:"
                            prop="gracePeriodDay"
                            class="special-input"
                            :disabled="disGracePeriodDay">

                <el-input-number v-model="loanrate.gracePeriodDay"
                                 controls-position="right"
                                 :step="1"
                                 :min="1"
                                 :max="10"
                                 style="width:100%"></el-input-number>

              </el-form-item>
            </el-col>

            <el-col :span="12"
                    v-show="isGraceCountIntFlag">
              <el-form-item label="宽限期利息处理方式:"
                            prop="graceCountIntFlag"
                            class="special-input">
                <el-select v-model="loanrate.graceCountIntFlag"
                           style="width:100%"
                           :disabled="disGraceCountIntFlag">
                  <el-option v-for="(value,key) in graceCountIntFlag"
                             :key="key"
                             :label="value"
                             :value="key"></el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="逾期罚息率(%):"
                            prop="overdueRateUpProportion"
                            class="special-input">

                <el-input-number v-model="loanrate.overdueRateUpProportion"
                                 controls-position="right"
                                 :precision="2"
                                 :step="1"
                                 :min="30"
                                 :max="50"
                                 style="width:100%"></el-input-number>
              </el-form-item>
            </el-col>

            <!--两个表单的隐藏域-->
            <el-col :span="12"
                    v-show="false">
              <el-form-item label="loanrateId:"
                            prop="loanrateId"
                            class="special-input">
                <el-input v-model="loanrate.loanrateId"></el-input>

              </el-form-item>
            </el-col>

            <el-col :span="12"
                    v-show="false">
              <el-form-item label="floatType:"
                            prop="floatType"
                            class="special-input">
                <el-select v-model="loanrate.floatType"
                           style="width:100%">
                  <el-option v-for="(value,key) in floatType"
                             :key="key"
                             :label="value"
                             :value="key"></el-option>
                </el-select>

              </el-form-item>
            </el-col>
          </el-form>
        </el-row>

      </div>

    </el-main>

  </el-container>
</template>
<script>
import enums from '@/utils/enums'// 格式化的枚举
import { getBizTerm, getBasicrate } from '@/api/csm'

export default {
  name: 'BizPublicRateXw',

  props: {
    paramsConTree: {// 接受从conTree这个页面传递过来的参数

    }

  },
  created() {
    const params = this.paramsConTree
    console.log('params ' + JSON.stringify(params))
    this.productType = this.paramsConTree.productType
    this.amountDetailId = this.paramsConTree.amountDetailId
    this.contractId = this.paramsConTree.contractId
    this.yearrate = this.paramsConTree.yearrate
    this.rateFloatProportion = this.paramsConTree.rateFloatProportion
  },
  data() {
    return {
      // 整个页面是否禁用选项
      disBizPublicRateXwCycle: false,
      // 必须要添加的属性值，从上个页面传过来的
      rateFloatProportion: '',
      baseRate: '',
      bizTerm: '',
      productType: '',
      amountDetailId: '',
      contractId: '',
      yearrate: '',

      // 相关的disable选项
      disHolidayIntFlg: false,
      disIrUpdateFrequency: false,
      disFloatWay: false,
      disRateFloatProportion: false,
      disGracePeriodDay: false,
      disGraceCountIntFlag: false,

      // 相关的v-show 选项
      isHolidayIntFlg: true,
      isDealRate: true,
      isFloatWay: true,
      isRateFloatProportion: true,
      isGracePeriodDay: true,
      isGraceCountIntFlag: true,

      // enums 枚举类型相关
      floatType: enums.floatTypeCd,
      holidayIntFlg: enums.holidayIntFlg, // 是否追加罚息
      holidayFlg: enums.YesOrNoCd, // 节假日顺延标志
      irUpdateFrequency: enums.irUpdateFrequency, // 利率调整方式 XD_SXCD1148
      floatWay: enums.floatWay, // 浮动方式 XD_SXCD1147
      rateType: enums.rateType, // 利率类型 XD_SXCD1016
      loanrate: {
        // 表单的整个数据
      },

      rules: {
        rateType: [
          { required: true, message: '请选择利率类型', trigger: 'blur' }
        ],
        floatWay: [
          { required: true, message: '请选择浮动方式', trigger: 'blur' }
        ],
        rateFloatProportion: [
          { required: true, message: '请输入浮动比例', trigger: 'blur' }
        ],
        yearRate: [
          { required: true, message: '请输入利率', trigger: 'blur' }
        ],
        irUpdateFrequency: [
          { required: true, message: '请选择利率调整方式', trigger: 'blur' }
        ],
        interestCollectType: [
          { required: true, message: '请选择结息周期', trigger: 'blur' }
        ],
        holidayFlg: [
          { required: true, message: '请选择节假日顺延标志', trigger: 'blur' }
        ],
        holidayIntFlg: [
          { required: true, message: '请选择节假日利息处理方式', trigger: 'blur' }
        ],
        gracePeriodType: [
          { required: true, message: '请选择宽限期方式', trigger: 'blur' }
        ],
        gracePeriodDay: [
          { required: true, message: '请输入宽限期天数', trigger: 'blur' }
        ],
        graceCountIntFlag: [
          { required: true, message: '请输入宽限期利息处理方式', trigger: 'blur' }
        ],
        overdueRateUpProportion: [
          { required: true, message: '请输入逾期罚息率', trigger: 'blur' }
        ]

      }

    }
  },
  methods: {
    // 在主页面初始化时也调用此方法，要做特别处理
    // 利率类型触发事件
    onselectType() {
      var reateType = this.loanrate.rateType
      console.log('[onselectType]reateType' + reateType)
      if (reateType == '2') { // 浮动利率
        // 隐藏固定利率
        this.dealRate('fixed', 'hide')
        // 显示浮动利率
        this.dealRate('float', 'show')
        // 利率调整方式--浮动时不能选不调整

        // nui.get("loanrate.irUpdateFrequency").setData(getDictData('XD_SXCD1148', 'str', '01,02,03,04,06'));
        if (this.loanrate.irUpdateFrequency) {
          if (this.loanrate.irUpdateFrequency == '05') {
            this.loanrate.irUpdateFrequency = ''
          }
        }
      } else if (reateType == '1') { // 固定利率
        // 显示固定利率
        this.dealRate('fixed', 'show')
        // 隐藏浮动利率
        this.dealRate('float', 'hide')
        // 利率调整方式--固定时只能选不调整
        this.disIrUpdateFrequency = true

        // nui.get("loanrate.irUpdateFrequency").setData(getDictData('XD_SXCD1148', 'str', '05'));
        this.loanrate.irUpdateFrequency = '05'
      } else { // 非反显
        this.loanrate.irUpdateFrequency = ''
        this.disIrUpdateFrequency = true

        this.dealRate('fixed', 'hide')
        this.dealRate('float', 'hide')
      }
      // 刷新table
    },

    // 隐藏、显示利率
    dealRate(rateType, dealType) {
      console.log('[dealRate]rateType ' + rateType + ', dealRate ' + dealType)
      if (rateType == 'fixed') { // 固定
        // eslint-disable-next-line no-empty
        if (dealType == 'hide') {

          // eslint-disable-next-line no-empty
        } else if (dealType == 'show') {

        }
      } else if (rateType == 'float') { // 浮动
        if (dealType == 'hide') {
          this.loanrate.floatWay = ''
          this.loanrate.rateFloatProportion = ''
          this.isFloatWay = false
          this.isRateFloatProportion = false
        } else if (dealType == 'show') {
          this.isFloatWay = true
          this.isRateFloatProportion = true
        }
      }
      // 刷新table
    },
    // 节假日顺延标志选否，节假日利息处理方式为空且不可选；
    // 节假日顺延标志选择“是”，则“节假日利息处理方式默认为追加罚息，不可修改
    conChangeHoliday() {
      var holidayFlag = this.loanrate.holidayFlg
      console.log('[conChangeHoliday]holidayFlag ' + holidayFlag)
      if (holidayFlag == '1') {
        this.isHolidayIntFlg = true
        this.loanrate.holidayIntFlg = '1'
        this.disHolidayIntFlg = true
      } else { // 不顺延或者为空
        this.isHolidayIntFlg = false
        this.loanrate.holidayIntFlg = ''
      }
      // 刷新table
    },

    /* 宽限期--
      宽限期方式选择“无宽限期”，则“宽限期利息处理方式”不展示；
      宽限期方式选择“宽限至月底/按日计算”，则“宽限期利息处理方式”默认为追加罚息，不可修改 */
    onselectGrace() {
      var graceType = this.loanrate.gracePeriodType
      console.log('[onselectGrace]graceType ' + graceType)
      if (graceType == '2') { // 按日
        this.isGracePeriodDay = true
        this.isGraceCountIntFlag = true

        // 默认追加罚息不可修改
        this.loanrate.graceCountIntFlag = '1'
        this.disGraceCountIntFlag = true
      } else if (graceType == '1') { // 宽限至月底
        // $('#gracePeriodDay').css('display', 'none')
        // $('#kxqlxclfs').css('display', 'block')
        // nui.get('loanrate.gracePeriodDay').hide()
        // nui.get('loanrate.graceCountIntFlag').show()
        this.isGracePeriodDay = false
        this.isGraceCountIntFlag = true

        this.loanrate.gracePeriodDay = ''
        // 默认追加罚息不可修改
        this.loanrate.graceCountIntFlag = '1'
        this.disGraceCountIntFlag = true
      } else { // 无宽限期
        this.isGracePeriodDay = false
        this.isGraceCountIntFlag = false

        this.loanrate.gracePeriodDay = ''
        this.loanrate.graceCountIntFlag = ''
      }
      // 刷新table
    },
    onRateFloat() {
      console.log('[onRateFloat] rateFloatProportion ' + this.rateFloatProportion)
      debugger
      // 合同校验--浮动比例
      if (this.rateFloatProportion) {
        var oldFloatPro = this.rateFloatProportion
        var newFloatPro = this.loanrate.rateFloatProportion
        var floatWay = this.loanrate.floatWay
        if (floatWay == '1') { // 上浮
          if (parseFloat(newFloatPro) < parseFloat(oldFloatPro)) {
            alert('上浮时改动值不能小于审批浮动比例')
            this.loanrate.rateFloatProportion = ''
            return false
          }
        } else { // 下浮
          if (parseFloat(newFloatPro) > parseFloat(oldFloatPro)) {
            alert('下浮时改动值不能大于审批浮动比例')
            this.loanrate.rateFloatProportion = ''
            return false
          }
        }
      }
      // 刷新table
      return true
    },
    onYearrate(e) {
      console.log('[onYearrate]e is' + JSON.stringify(e))
      // 合同校验--固定利率
      if (this.yearrate) {
        var oldyearrate = this.yearrate
        var newyearrate = this.loanrate.yearRate
        if (parseFloat(newyearrate) < parseFloat(oldyearrate)) {
          alert('改动值不能小于审批利率')
          this.loanrate.yearRate = ''
          return false
        }
      }
      // 刷新table
      return true
    },

    // 计算基准利率
    countRate(v) {
      console.log('[countRate]v is' + JSON.stringify(v))
      var rateType = this.loanrate.rateType
      if (rateType == '1') {
        this.loanrate.floatWay = ''
        this.loanrate.rateFloatProportion = ''
        return
      }
      if (v == '1') {
        this.onRateFloat()
        var newFloatWay = this.loanrate.floatWay
        if (!newFloatWay) {
          this.loanrate.rateFloatProportion = ''
          alert('请先选择浮动方式!')
          return
        }
      }

      const items = {
        amountDetailId: this.amountDetailId,
        contractId: this.contractId

      }
      getBizTerm(items).then((response) => {
        const o = response.data
        console.log('[getBizTerm]o is ' + JSON.stringify(o))

        if (o && o.items && o.items[0]) {
          this.bizTerm = o.items[0].TERM_NUM
        }

        // 根据期限取基准利率
        var ratettype = '1'
        if (this.productType == '02005001' || this.productType == '02005003' || this.productType == '02005010') {
          ratettype = '2'
        }
        var json = { loanlength: this.bizTerm, rateType: ratettype }

        getBasicrate(json).then((response) => {
          const o = response.data
          console.log('[getBasicrate]o is ' + JSON.stringify(o))
          this.baseRate = o.basicrate
          this.countRate1()
        })
      })
    },

    // 计算利率
    countRate1() {
      var rateType = this.loanrate.rateType
      console.log('[countRate1]rateType' + rateType)
      if (rateType == '1') {
        this.onYearrate()
      }
      this.loanrate.yearRate = ''
      var floatWay = this.loanrate.floatWay
      var rateFloatProportion = this.loanrate.rateFloatProportion
      if (floatWay && this.baseRate) {
        if (rateFloatProportion) {
          if (floatWay == '1') { // 上浮
            this.loanrate.yearRate = ((parseFloat(this.baseRate) + parseFloat(this.baseRate) * parseFloat(rateFloatProportion) * 0.01).toFixed(6))
          } else { // 下浮
            this.loanrate.yearRate = ((parseFloat(this.baseRate) - parseFloat(this.baseRate) * parseFloat(rateFloatProportion) * 0.01).toFixed(6))
          }
        }
      }
    },

    // 计算浮动比例
    countRate2() {
      var rateType = this.loanrate.rateType
      console.log('[countRate2]rateType ' + rateType)
      if (rateType == '1') {
        this.loanrate.floatWay = ''
        this.loanrate.rateFloatProportion = ''
        return
      }
      var newYearRate = this.loanrate.yearRate// 执行利率
      var floatWay = this.loanrate.floatWay
      if (floatWay && this.baseRate) {
        if (newYearRate) {
          if (floatWay == '1') { // 上浮
            if (newYearRate < this.baseRate) {
              this.loanrate.yearRate = ''
              return alert('申请利率【' + newYearRate + '】小于基准利率【' + this.baseRate + '】请选择下浮！')
            }
            this.loanrate.rateFloatProportion = (((parseFloat(newYearRate) / parseFloat(this.baseRate) - 1) * 100).toFixed(6))
          } else { // 下浮
            if (newYearRate > this.baseRate) {
              this.loanrate.yearRate = ''
              return alert('申请利率【' + newYearRate + '】大于基准利率【' + this.baseRate + '】请选择上浮！')
            }
            this.loanrate.rateFloatProportion = (Math.abs(((parseFloat(newYearRate) / parseFloat(this.baseRate) - 1) * 100)).toFixed(6))
          }
        }
      } else {
        if (!floatWay) {
          this.loanrate.rateFloatProportion = ''
          alert('请先选择浮动方式!')
          return
        }
      }
    }

  }
}
</script>

<style scoped>
</style>
