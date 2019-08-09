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
        icon="el-icon-plus"
        @click="handleCreate"
      >{{ $t('table.add') }}</el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="handleUpdate(row)"
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
        icon="el-icon-location"
        @click="handleMaodi(row)"
      >{{ $t('table.maodi') }}</el-button>
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
      <el-table-column :label="$t('table.cexpectedDate')" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.cexpectedDate | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.shipName')" width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.shipName }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.supplier')" width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.supplier }}</span>
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
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="70px"
        style="width: 400px; margin-left:50px;"
      >
        <el-row>
          <el-col span="12">
            <el-form-item :label="$t('table.shipName')" prop="shipName">
              <el-select v-model="temp.shipName" filterable placeholder="Please select">
                <el-option v-for="item in shipNameOptions" :key="item" :label="item" :value="item" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col span="12">
            <el-form-item :label="$t('table.shipTime')" prop="shipTime">
              <el-input v-model="temp.shipTime" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="dialogStatus==='create'">
          <el-col span="12">
            <el-form-item :label="$t('table.coalName')">
              <el-select
                v-model="coalNames"
                filterable
                multiple="true"
                multiple-limit="2"
                placeholder="Please select"
              >
                <el-option v-for="item in coalNameOptions" :key="item" :label="item" :value="item" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col span="12">
            <el-form-item :label="$t('table.scoalSum')">
              <el-input v-model="scoalSumFirst" />
            </el-form-item>
          </el-col>
          <el-col span="12">
            <el-form-item v-if="coalNames.length>1">
              <el-input v-model="scoalSumSecond" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row v-else>
          <el-col span="12">
            <el-form-item :label="$t('table.coalName')" prop="coalName">
              <el-select v-model="temp.coalName" filterable placeholder="Please select">
                <el-option v-for="item in coalNameOptions" :key="item" :label="item" :value="item" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col span="12">
            <el-form-item :label="$t('table.scoalSum')" prop="scoalSum">
              <el-input v-model="temp.scoalSum" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col span="12">
            <el-form-item :label="$t('table.supplier')" prop="supplier">
              <el-select v-model="temp.supplier" filterable placeholder="Please select">
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
            <el-form-item :label="$t('table.cexpectedDate')" prop="cexpectedDate">
              <el-date-picker
                v-model="temp.cexpectedDate"
                type="datetime"
                placeholder="Please pick a date"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col span="12">
            <el-form-item :label="$t('table.importcoal')" prop="importcoal">
              <el-checkbox v-model="temp.importcoal" />
            </el-form-item>
          </el-col>
          <el-col span="12">
            <el-form-item :label="$t('table.stock')" prop="stock">
              <el-checkbox v-model="temp.stock" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{ $t('table.cancel') }}</el-button>
        <el-button
          type="primary"
          @click="dialogStatus==='create'?createData():updateData()"
        >{{ $t('table.confirm') }}</el-button>
      </div>
    </el-dialog>

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
              <el-select v-model="tempMaodi.coalName" filterable placeholder="Please select">
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
              <el-select v-model="tempKaobo.coalName" filterable placeholder="Please select">
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
  createShipLists,
  updateShipList,
  getSameShipList,
  changeAbroadToMaodi,
  changeToKaobo,
  deleteShipList,
  getShipNameList,
  getCoalNameList,
  getSupplierNameList
} from '@/api/shipList'
import waves from '@/directive/waves' // Waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

// arr to obj ,such as { CN : "China", US : "USA" }

export default {
  name: 'DepartureTable',
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
        status: '0',
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
      shipNameOptions: null,
      coalNameOptions: null,
      supplierNameOptions: null,
      radio: '',
      kplaceOptions: ['2号'],
      row: {},
      selected: [],
      shipLists: [],
      temp: {
        id: undefined,
        shipName: '',
        shipTime: '',
        coalName: '',
        scoalSum: '',
        supplier: '',
        cexpectedDate: new Date(),
        importcoal: '',
        stock: ''
      },
      tempSecond: {
        id: undefined,
        shipName: '',
        shipTime: '',
        coalName: '',
        scoalSum: '',
        supplier: '',
        cexpectedDate: new Date(),
        importcoal: '',
        stock: ''
      },
      coalNames: [],
      scoalSumFirst: '',
      scoalSumSecond: '',
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
        coalName: '',
        scoalSum: '',
        arrivalTime: new Date(),
        ashoreTime: new Date(),
        status: 1
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
      dialogCreateVisisble: false,
      dialogMaodiVisible: false,
      dialogKaoboVisible: false,
      dialogStatus: '',
      textMap: {
        update: '离港信息编辑',
        create: '离港信息添加'
      },

      rules: {
        //         shipTime: [
        //           { required: true, message: "船次不能为空", trigger: "blur" }
        //         ],
        //         scoalSum:[
        //  {required: true,message:"运单煤量不能为空",trigger:"blur"}
        //       ],
        //         cexpectedDate: [
        //           {
        //             type: "date",
        //             required: true,
        //             message: " 预到港时间不能为空",
        //             trigger: "blur"
        //           }
        //         ]
      },
      downloadLoading: false
    }
  },
  watch: {
    word: function(new_v, old_v) {
      if (new_v === '') {
        this.listQuery.status = '0'
        this.listQuery.word = ''
      } else {
        this.listQuery.status = '0'
        this.listQuery.word = new_v
      }

      this.getList()
    }
  },
  created() {
    this.getList()
    this.getShipNames()
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
    resetTemp() {
      this.temp = {
        id: undefined,
        shipName: '',
        shipTime: '',
        coalName: [],
        scoalSum: '',
        scoalSumFirst: '',
        scoalSumSecond: '',
        supplier: '',
        cexpectedDate: new Date(),
        importcoal: false,
        stock: false
      }
    },
    getShipNames() {
      getShipNameList().then(response => {
        this.shipNameOptions = response.data
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
      console.log(this.selected)
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          const str = this.coalNames[0]
          const str2 = this.coalNames[1]
          this.temp.coalName = str
          this.temp.scoalSum = this.scoalSumFirst
          this.shipLists.push(this.temp)

          if (str2 != null) {
            this.tempSecond.shipName = this.temp.shipName
            this.tempSecond.shipTime = this.temp.shipTime
            this.tempSecond.supplier = this.temp.supplier
            this.tempSecond.cexpectedDate = this.temp.cexpectedDate
            this.tempSecond.importcoal = this.temp.importcoal
            this.tempSecond.stock = this.temp.stock
            this.tempSecond.coalName = str2
            this.tempSecond.scoalSum = this.scoalSumSecond
            this.shipLists.push(this.tempSecond)
          }
          createShipLists(this.shipLists).then(() => {
            this.list.unshift(this.temp)
            this.list.unshift(this.tempSecond)
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
          })
          //  const str=this.temp.coalName[0]
          //  this.temp.coalName=str
          //  this.temp.scoalSum=this.temp.scoalSumFirst
          //   createShipList(this.temp).then(() => {
          //     this.list.unshift(this.temp);
          //     this.dialogFormVisible = false;
          //     this.$notify({
          //       title: "成功",
          //       message: "创建成功",
          //       type: "success",
          //       duration: 2000
          //     });
          //   });
        }
      })
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
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleMaodi(row) {
      if (row.id == null) {
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
      if (row.id == null) {
        this.$message({
          type: 'info',
          message: '请选择一条记录'
        })
        return
      }
      this.tempKaobo = Object.assign({}, row) // copy objs
      this.dialogKaoboVisible = true
      this.row = row
      this.$nextTick(() => {
        this.$refs['kaoboForm'].clearValidate()
      })
    },

    updateData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          updateShipList(this.temp).then(() => {
            for (const v of this.list) {
              if (v.id === this.temp.id) {
                const index = this.list.indexOf(v)
                this.list.splice(index, 1, this.temp)
                break
              }
            }
            this.dialogFormVisible = false
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

    updateToMaodi() {
      this.$refs['maodiForm'].validate(valid => {
        if (valid) {
          this.tempMaodi.status = 1
          changeAbroadToMaodi(this.tempMaodi).then(() => {
            this.getList()

            this.dialogMaodiVisible = false
            this.$notify({
              title: '成功',
              message: '离港转锚地成功',
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
          this.tempKaobo.status = 2

          const arr = this.tempKaobo.cabin
          const str = arr.map(item => item).join(',')
          this.tempKaobo.cabin = str
          changeToKaobo(this.tempKaobo).then(() => {
            this.getList()
          })
          this.dialogKaoboVisible = false
          this.$notify({
            title: '成功',
            message: '离港转靠泊成功',
            type: 'success',
            duration: 2000
          })
        }
      })
    },

    open(row) {
      if (row.id == null) {
        this.$message({
          type: 'info',
          message: '请选择一条记录'
        })
        return
      }
      const id = row.id
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

    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['timestamp', 'title', 'type', 'importance', 'status']
        const filterVal = ['timestamp', 'title', 'type', 'importance', 'status']
        const data = this.formatJson(filterVal, this.list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'table-list'
        })
        this.downloadLoading = false
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

