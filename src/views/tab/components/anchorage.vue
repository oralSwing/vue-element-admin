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
        @click="handleMaodi(row)"
      >{{ $t('table.edit') }}</el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-delete"
        @click="open(row)"
      >{{ $t('table.delete') }}</el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-d-arrow-left"
        @click="goBack(row)"
      >{{ $t('table.back') }}</el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-location-outline"
        @click="handleKaobo(row)"
      >{{ $t('table.kaobo') }}</el-button>
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
      <el-table-column :label="$t('table.supplier')" width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.supplier }}</span>
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
      <el-table-column :label="$t('table.arrivalTime')" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.arrivalTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="$t('table.ashoreTime')" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.ashoreTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
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

    <el-dialog :visible.sync="dialogMaodiVisible" title="锚地信息处理">
      <el-form
        ref="maodiForm"
        :rules="rules"
        :model="tempMaodi"
        label-position="left"
        label-width="70px"
        style="width: 400px; margin-left:50px;"
      >
        <el-row>
          <el-col span="12">
            <el-form-item :label="$t('table.coalName')" prop="coalName">
              <el-select v-model="tempMaodi.coalName" placeholder="Please select">
                <el-option v-for="item in coalNameOptions" :key="item" :label="item" :value="item" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col span="12">
            <el-form-item :label="$t('table.scoalSum')" prop="scoalSum">
              <el-input v-model="tempMaodi.scoalSum" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col span="15">
            <el-form-item :label="$t('table.arrivalTime')" prop="arrivalTime">
              <el-date-picker
                v-model="tempMaodi.arrivalTime"
                type="datetime"
                placeholder="Please pick a date"
              />
            </el-form-item>
          </el-col>
          <el-col span="15">
            <el-form-item :label="$t('table.ashoreTime')" prop="ashoreTime">
              <el-date-picker
                v-model="tempMaodi.ashoreTime"
                type="datetime"
                placeholder="Please pick a date"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col span="12">
            <el-form-item :label="$t('table.supplier')" prop="supplier">
              <el-select v-model="tempMaodi.supplier" placeholder="Please select">
                <el-option
                  v-for="item in supplierNameOptions"
                  :key="item"
                  :label="item"
                  :value="item"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col span="12">
            <el-form-item :label="$t('table.importcoal')" prop="importcoal">
              <el-checkbox v-model="tempMaodi.importcoal" />
            </el-form-item>
          </el-col>
          <el-col span="12">
            <el-form-item :label="$t('table.stock')" prop="stock">
              <el-checkbox v-model="tempMaodi.stock" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col span="12">
            <el-form-item :label="$t('table.shipTime')" prop="shipTime">
              <el-input v-model="tempMaodi.shipTime" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogMaodiVisible = false">{{ $t('table.cancel') }}</el-button>
        <el-button type="primary" @click="updateToMaodi">{{ $t('table.confirm') }}</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="dialogKaoboVisible" title="靠泊信息处理">
      <el-form
        ref="kaoboForm"
        :rules="rules"
        :model="tempKaobo"
        label-position="left"
        label-width="70px"
        style="width: 400px; margin-left:50px;"
      >
        <el-row>
          <el-col span="12">
            <el-form-item :label="$t('table.coalName')" prop="coalName">
              <el-select v-model="tempKaobo.coalName" placeholder="Please select">
                <el-option v-for="item in coalNameOptions" :key="item" :label="item" :value="item" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col span="12">
            <el-form-item :label="$t('table.scoalSum')" prop="scoalSum">
              <el-input v-model="tempKaobo.scoalSum" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col span="12">
            <el-form-item :label="$t('table.coalQuantity')" prop="coalQuantity">
              <el-input v-model="tempKaobo.coalQuantity" />
            </el-form-item>
          </el-col>
          <el-col span="12">
            <el-form-item :label="$t('table.kplace')" prop="kplace">
              <el-select v-model="tempKaobo.kplace" placeholder="Please select">
                <el-option v-for="item in kplaceOptions" :key="item" :label="item" :value="item" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col span="15">
            <el-form-item :label="$t('table.ashoreTime')" prop="ashoreTime">
              <el-date-picker
                v-model="tempKaobo.ashoreTime"
                type="datetime"
                placeholder="Please pick a date"
              />
            </el-form-item>
          </el-col>
          <el-col span="15">
            <el-form-item :label="$t('table.disbortTime')" prop="disbortTime">
              <el-date-picker
                v-model="tempKaobo.disbortTime"
                type="datetime"
                placeholder="Please pick a date"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col span="12">
            <el-form-item :label="$t('table.binNumber')" prop="binNumber">
              <el-select
                v-model="tempKaobo.binNumber"
                placeholder="Please select"
                @change="selectCountry"
              >
                <el-option
                  v-for="(item,index) in compony"
                  :key="item.name"
                  :label="item.name"
                  :value="index+3"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col span="12">
            <el-form-item :label="$t('table.cabin')" prop="cabin">
              <el-select v-model="tempKaobo.cabin" multiple placeholder="Please select">
                <el-option v-for="item in cabin" :key="item" :label="item" :value="item" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogKaoboVisible = false">{{ $t('table.cancel') }}</el-button>
        <el-button type="primary" @click="updateToKaobo">{{ $t('table.confirm') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  searchList,
  updateShipList,
  getSameShipList,
  changeToKaobo,
  backStatus,
  deleteShipList,
  getCoalNameList,
  getSupplierNameList
} from '@/api/shipList'
import waves from '@/directive/waves' // Waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'AnchorageTable',
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
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
        status: '1',
        word: '',
        orderBy: 'id'
      },
      sameQuery: {
        shipName: '',
        shipTime: '',
        status: 0
      },
      word: '',
      sortOptions: [
        { label: 'ID Ascending', key: 'id' },
        { label: 'ID Descending', key: 'id desc' }
      ],
      statusOptions: ['published', 'draft', 'deleted'],
      coalNameOptions: null,
      supplierNameOptions: null,
      kplaceOptions: ['2号'],
      row: {},
      selected: [],
      binNumber: '',
      cabin: [],
      compony: [
        {
          name: '3',
          childrens: ['1', '2', '3']
        },
        {
          name: '4',
          childrens: ['1', '2', '3', '4']
        },
        {
          name: '5',
          childrens: ['1', '2', '3', '4', '5']
        },
        {
          name: '6',
          childrens: ['1', '2', '3', '4', '5', '6']
        },
        {
          name: '7',
          childrens: ['1', '2', '3', '4', '5', '6', '7']
        },
        {
          name: '8',
          childrens: ['1', '2', '3', '4', '5', '6', '7', '8']
        }
      ],
      tempMaodi: {
        id: undefined,
        shipName: '',
        scoalSum: '',
        arrivalTime: new Date(),
        ashoreTime: new Date(),
        supplier: '',
        importcoal: false,
        stock: false,
        shipTime: ''
      },
      tempBack: {
        id: undefined,
        shipName: '',
        shipTime: '',
        status: 0
      },
      tempKaobo: {
        id: undefined,
        coalName: '',
        scoalSum: '',
        coalQuantity: '',
        kplace: '',
        ashoreTime: new Date(),
        disbortTime: new Date(),
        binNumber: '',
        cabin: [],
        status: 2
      },

      dialogFormVisible: false,
      dialogMaodiVisible: false,
      dialogKaoboVisible: false,
      dialogStatus: '',
      radio: '',
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
      if (new_v === '') {
        this.listQuery.word = ''
      } else {
        this.listQuery.word = new_v
      }

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

    selectCountry(value) {
      this.cabin = this.compony[value - 3].childrens
      this.binNumber = this.cabin[0]
      this.tempKaobo.cabin = []
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
    getTemplateRow(index, row) {
      // 获取选中数据
      this.row = row
      this.sameQuery.shipName = row.shipName
      this.sameQuery.shipTime = row.shipTime
      this.sameQuery.status = row.status
      // /获取相同船名船次的船运
      getSameShipList(this.sameQuery).then(response => {
        this.selected = response.data
      })
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

    handleMaodi(row) {
      if (row.id === null) {
        this.$message({
          type: 'info',
          message: '请选择一条记录'
        })
        return
      }
      this.tempMaodi = Object.assign({}, row) // copy obj
      this.dialogMaodiVisible = true
      this.$nextTick(() => {
        this.$refs['maodiForm'].clearValidate()
      })
    },

    handleKaobo(row) {
      if (row.id === null) {
        this.$message({
          type: 'info',
          message: '请选择一条记录'
        })
        return
      }
      this.tempKaobo = Object.assign({}, row) // copy obj
      this.dialogKaoboVisible = true
      this.row = row
      this.$nextTick(() => {
        this.$refs['kaoboForm'].clearValidate()
      })
    },

    updateToMaodi() {
      this.$refs['maodiForm'].validate(valid => {
        if (valid) {
          updateShipList(this.tempMaodi).then(() => {
            for (const v of this.list) {
              if (v.id === this.tempMaodi.id) {
                const index = this.list.indexOf(v)
                this.list.splice(index, 1, this.tempMaodi)
                break
              }
            }
            this.dialogMaodiVisible = false
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

    updateToKaobo() {
      this.$refs['kaoboForm'].validate(valid => {
        if (valid) {
          const arr = this.tempKaobo.cabin
          const str = arr.map(item => item).join(',')
          this.tempKaobo.cabin = str
          this.tempKaobo.status = 2
          changeToKaobo(this.tempKaobo).then(() => {
            this.getList()
          })
          this.dialogKaoboVisible = false
          this.$notify({
            title: '成功',
            message: '锚地转靠泊成功',
            type: 'success',
            duration: 2000
          })
        }
      })
    },
    open(row) {
      const id = row.id
      if (id === null) {
        this.$message({
          type: 'info',
          message: '请选择一条记录'
        })
        return
      }

      this.$confirm('此操作将永久删除该船运, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteShipList(id).then(response => {
            if (response.data.success === true) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
            }
          })

          const index = this.list.indexOf(row)
          this.list.splice(index, 1)
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },

    goBack(row) {
      if (row.id === null) {
        this.$message({
          type: 'info',
          message: '请选择一条记录'
        })
        return
      }
      this.tempBack = Object.assign({}, row)
      this.tempBack.status = 0
      this.$confirm('此操作将锚地撤回为离港, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          backStatus(this.tempBack).then(response => {
            if (response.data.success === true) {
              this.$message({
                type: 'success',
                message: '撤回成功!'
              })
            }
          })
          this.getList()
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消撤回'
          })
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

