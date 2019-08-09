<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        :placeholder="$t('table.title')"
        v-model="word"
        style="width: 200px;"
        class="filter-item"
      />
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="handleUpdate(row)"
      >{{ $t('table.edit') }}</el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :key="tableKey"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
    >
      <el-table-column label="选择" width="70" header-align="center" align="center">
        <template slot-scope="scope">
          <el-radio
            v-model="radio"
            :label="scope.$index"
            class="radio"
            @change.native="getTemplateRow(scope.$index,scope.row)"
          >&nbsp;</el-radio>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.status')" class-name="status-col" width="100">
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.dockedStatue | statusFilter"
          >{{ scope.row.dockedStatue |statusFilter }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('table.id')"
        prop="id"
        sortable="custom"
        align="center"
        width="65"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.shipName')" width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.shipName }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.shipTime')" width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.shipTime }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.coalName')" width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.coalName }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.supplier')" width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.supplier }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="$t('table.scoalSum')" width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.scoalSum }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="$t('table.coalQuantity')" width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.coalQuantity }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.ashoreTime')" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.ashoreTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.anchorsdays')" width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.anchorsdays| rounding }}</span>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />

    <el-dialog :visible.sync="dialogHistoryVisible" title="船运历史管理">
      <el-form
        ref="historyForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="70px"
        style="width: 400px; margin-left:50px;"
      >
        <el-row>
          <el-col span="12">
            <el-form-item :label="$t('table.coalName')" prop="coalName">
              <el-select v-model="temp.coalName" placeholder="Please select">
                <el-option v-for="item in coalNameOptions" :key="item" :label="item" :value="item" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col span="12">
            <el-form-item :label="$t('table.shipTime')" prop="shipTime">
              <el-input v-model="temp.shipTime" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col span="12">
            <el-form-item :label="$t('table.scoalSum')" prop="scoalSum">
              <el-input v-model="temp.scoalSum" />
            </el-form-item>
          </el-col>
          <el-col span="12">
            <el-form-item :label="$t('table.coalQuantity')" prop="coalQuantity">
              <el-input v-model="temp.coalQuantity" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col span="12">
            <el-form-item :label="$t('table.supplier')" prop="supplier">
              <el-select v-model="temp.supplier" placeholder="Please select">
                <el-option
                  v-for="item in supplierNameOptions"
                  :key="item"
                  :label="item"
                  :value="item"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col span="12">
            <el-form-item :label="$t('table.ashoreTime')" prop="shipTime">
              <el-date-picker
                v-model="temp.ashoreTime"
                type="datetime"
                placeholder="Please pick a date"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogHistoryVisible = false">{{ $t('table.cancel') }}</el-button>
        <el-button type="primary" @click="updateData">{{ $t('table.confirm') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  searchList,
  updateShipList,
  getCoalNameList,
  getSupplierNameList
} from '@/api/shipList'
import waves from '@/directive/waves' // Waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
export default {
  name: 'HistoryTable',
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      if (status === -1) {
        status = 2
      }
      const statusMap = {
        0: '离港',
        1: '待卸',
        2: '在卸',
        3: '卸完'
      }
      return statusMap[status]
    },
    rounding(value) {
      return value.toFixed(1)
    }
  },
  data() {
    return {
      ok: false,
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10,
        status: '',
        word: '',
        orderBy: 'id'
      },
      word: '',
      coalNameOptions: null,
      supplierNameOptions: null,
      showReviewer: false,
      radio: '',
      row: {},
      temp: {
        id: undefined,
        shipTime: '',
        coalName: '',
        scoalSum: '',
        coalQuantity: '',
        supplier: '',
        ahoreTime: new Date()
      },
      dialogHistoryVisible: false,
      // dialogPvVisible: false,
      // pvData: [],
      rules: {
        type: [
          { required: true, message: 'type is required', trigger: 'change' }
        ],
        timestamp: [
          {
            type: 'date',
            required: true,
            message: 'timestamp is required',
            trigger: 'change'
          }
        ],
        title: [
          { required: true, message: 'title is required', trigger: 'blur' }
        ]
      },
      downloadLoading: false
    }
  },
  watch: {
    word: function(new_v, old_v) {
      console.log('旧值:' + old_v + '=======>新值:' + new_v)
      if (new_v === '') {
        this.listQuery.word = ''
      } else {
        this.listQuery.word = new_v
      }
      console.log(this.listQuery)
      this.getList()
    }
  },
  created() {
    this.getList()

    this.getCoalNames()
    this.getSupplierNames()
  },
  methods: {
    getList() {
      this.listLoading = true
      searchList(this.listQuery).then(response => {
        this.list = response.data.list
        this.total = response.data.total

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: '操作成功',
        type: 'success'
      })
      row.status = status
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.orderBy = 'id asc'
      } else {
        this.listQuery.orderBy = 'id desc'
      }
      this.handleFilter()
    },

    getCoalNames() {
      getCoalNameList().then(response => {
        this.coalNameOptions = response.data
      })
    },
    getSupplierNames() {
      getSupplierNameList().then(response => {
        this.supplierNameOptions = response.data
      })
    },
    getTemplateRow(index, row) {
      // 获取选中数据
      this.row = row
    },
    handleUpdate(row) {
      if (row.id == null) {
        this.$message({
          type: 'info',
          message: '请选择一条记录'
        })
        return
      }
      this.temp = Object.assign({}, row) // copy obj

      this.dialogHistoryVisible = true
      this.$nextTick(() => {
        this.$refs['historyForm'].clearValidate()
      })
    },

    updateData() {
      this.$refs['historyForm'].validate(valid => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          console.log(tempData)
          // tempData.timestamp = +new Date(tempData.timestamp); // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          updateShipList(this.temp).then(() => {
            for (const v of this.list) {
              if (v.id === this.temp.id) {
                const index = this.list.indexOf(v)
                this.list.splice(index, 1, this.temp)
                break
              }
            }
            this.dialogHistoryVisible = false
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },

    formatJson(filterVal, jsonData) {
      return jsonData.map(v =>
        filterVal.map(j => {
          if (j === 'timestamp') {
            return parseTime(v[j])
          } else {
            return v[j]
          }
        })
      )
    }
  }
}
</script>

