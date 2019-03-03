<template>
  <div>
    <coal-consumption-table
      :table-data="tableData"
      :columns="columns"
      :loading="loading"
      :show-refresh="true"
      :show-export="true"
      :show-search="true"
      :url="'http://yq/threejs/service.asmx/GetCoalConsumption?year=2019&month=2'"
      height="100%"
      width="100%"
    />
  </div>
</template>

<script>
import CoalConsumptionTable from '@/components/Tables/CoalConsumptionTable'
// import axios from 'axios'
export default {
  components: { CoalConsumptionTable },
  data() {
    return {
      columns: [{
        type: 'selection',
        width: 50,
        formatter: function() {
          return true
        }
      },
      {
        prop: 'recorddate',
        label: '日期',
        formatter: function(row, column, prop) {
          const date = window.vm.$options.moment(prop).format('MM-DD')
          return date
        }
      }, {
        prop: 'dailygenerate',
        label: '日发电量'
      }, {
        prop: 'electricused',
        label: '厂用电量'
      }, {
        label: '厂用电率',
        formatter(row) {
          return row.electricused / row.dailygenerate * 100
        }
      }, {
        prop: 'standardcoal',
        label: '标煤用量'
      }, {
        prop: 'bunkervolume',
        label: '煤仓增量'
      }, {
        prop: 'avgload',
        label: '日均负荷'
      }, {
        prop: 'dailyqnetar',
        label: '日均热值'
      }, {
        prop: 'consumptionrate',
        label: '发电煤耗'
      }, {
        label: '供电煤耗',
        formatter(row) {
          return row.id
        }
      }],
      // tableData: [{
      //   date: '2016-05-02',
      //   name: '王一虎',
      //   gender: '男',
      //   address: '上海市普陀区金沙江路 1518 弄'
      // }, {
      //   date: '2017-05-04',
      //   name: '王二虎',
      //   gender: '男',
      //   address: '上海市普陀区金沙江路 1517 弄'
      // }, {
      //   date: '2018-05-01',
      //   name: '王三虎',
      //   gender: '男',
      //   address: '上海市普陀区金沙江路 1519 弄'
      // }, {
      //   date: '2019-05-03',
      //   gender: '男',
      //   name: '王小虎',
      //   address: '上海市普陀区金沙江路 1516 弄'
      // }],
      tableData: [],
      search: '',
      loading: true
    }
  },
  beforeMount() {
    // axios.get('http://yq/threejs/service.asmx/GetCoalConsumption?year=2019&month=2')
    //   .then(res => {
    //     console.log(JSON.parse(res.request.responseXML.childNodes[0].innerHTML))
    //     this.tableData = JSON.parse(res.request.responseXML.childNodes[0].innerHTML)[0]
    //     this.loading = false
    //   }).catch(error => {
    //     console.log(error.response)
    //     this.loading = false
    //   })
  },
  methods: {
    handleEdit(index, row) {
      console.log(index, row)
    },
    handleDelete(index, row) {
      console.log(index, row)
    }
  }
}
</script>
