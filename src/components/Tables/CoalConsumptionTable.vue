<template>
  <div class="coalConsumptionTable">
    <table-toolbar
      :show-search="showSearch"
      v-model="search"
      :show-export="showExport"
      :show-refresh="showRefresh"
      @refresh="refresh"
    />
    <el-table v-loading="loading" :columns="columns" :data="filteredTableData" style="width: 100%">
      <!-- <el-table-column type="selection" width="55"/>
      <el-table-column label="Date" prop="date"/>
      <el-table-column label="Name" prop="name"/>
      <el-table-column label="性别" prop="gender"/>-->
      <el-table-column
        v-for="column in columns"
        :label="column.label"
        :prop="column.prop"
        :type="column.type"
        :width="column.width"
        :key="column.prop"
        :formatter="column.formatter"
      />
      <!-- <el-table-column align="right">
        <template slot="header" slot-scope="scope">
          <el-input v-model="search" size="mini" placeholder="输入关键字搜索"/>
        </template>
      <template slot-scope="scope">
        <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">Edit</el-button>
        <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">Delete</el-button>
      </template>
      </el-table-column>-->
    </el-table>
  </div>
</template>

<script>
import axios from 'axios'
import TableToolbar from '@/components/Tables/TableToolbar'
export default {
  name: 'CoalConsumptionTable',
  components: { TableToolbar },
  props: {
    // search: {
    //   type: String,
    //   default: ''
    // },
    // tableData: {
    //   type: Array,
    //   default() {
    //     return []
    //   }
    // },
    columns: {
      type: Array,
      default() {
        return []
      }
    },
    showSearch: {
      type: Boolean,
      default: false
    },
    showExport: {
      type: Boolean,
      default: false
    },
    showRefresh: {
      type: Boolean,
      default: false
    },
    // loading: {
    //   type: Boolean,
    //   default: false
    // },
    url: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      search: '',
      tableData: [],
      loading: false
    }
  },
  computed: {
    filteredTableData() {
      return this.tableData.filter(
        data =>
          !this.search ||
          // data.name.toLowerCase().includes(this.search.toLowerCase()) ||
          data.recorddate.includes(this.search))
    }
  },
  beforeMount() {
    this.getData()
  },
  methods: {
    handleEdit(index, row) {
      console.log(this.search)
    },
    handleDelete(index, row) {
      console.log(index, row)
    },
    refresh() {
      this.getData()
    },
    getData() {
      this.loading = true
      axios.get(this.url)
        .then(res => {
          this.tableData = JSON.parse(res.request.responseXML.childNodes[0].innerHTML)[0]
          this.loading = false
        }).catch(error => {
          console.log(error.response)
          this.loading = false
        })
    }
  }
}
</script>
