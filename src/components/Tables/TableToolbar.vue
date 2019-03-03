<template>
  <div class="TableToolbar">
    <!-- <el-button-group v-if="showPageNav">
      <el-button type="primary" icon="el-icon-arrow-left">上一页</el-button>
      <el-button type="primary">
        下一页
        <i class="el-icon-arrow-right el-icon--right"/>
      </el-button>
    </el-button-group>
    <el-button-group>
      <el-button type="primary" icon="el-icon-edit"/>
      <el-button type="primary" icon="el-icon-share"/>
      <el-button type="primary" icon="el-icon-delete"/>
    </el-button-group>-->
    <el-input
      v-if="showSearch"
      :value="value"
      class="search"
      size="mimi"
      placeholder="输入关键字搜索"
      prefix-icon="el-icon-search"
      @input="$emit('input', $event)"
    />
    <el-button-group class="toolButtonGroup">
      <el-button
        v-if="showRefresh"
        size="mimi"
        icon="el-icon-refresh"
        title="刷新"
        @click="$emit('refresh',$event)"
      />
      <el-button
        v-if="showExport"
        size="mimi"
        icon="el-icon-download"
        title="保存为excel"
        @click="exportExcel"
      />
    </el-button-group>
  </div>
</template>

<script>
import XLSX from 'xlsx'
export default {
  name: 'TableToolbar',
  props: {
    showSearch: {
      type: Boolean,
      default: false
    },
    showPageNav: {
      type: Boolean,
      default: false
    },
    showRefresh: {
      type: Boolean,
      default: false
    },
    showExport: {
      type: Boolean,
      default: false
    },
    searchText: {
      type: String,
      default: ''
    },
    value: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      text: ''
    }
  },
  computed: {
    // getSearchText() {
    //   this.$emit('search-text', this.searchText)
    //   console.log(this.searchText)
    //   return this.searchText
    // }
  },
  methods: {
    // searchTextChanged(e) {
    //   this.$emit('input', e.searchText)
    // },
    exportExcel() {
      var data = [
        { 'name': 'John', 'city': 'Seattle' },
        { 'name': 'Mike', 'city': 'Los Angeles' },
        { 'name': 'Zach', 'city': 'New York' }
      ]

      /* 创建worksheet */
      var ws = XLSX.utils.json_to_sheet(data)

      /* 新建空workbook，然后加入worksheet */
      var wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, 'People')

      /* 生成xlsx文件 */
      XLSX.writeFile(wb, 'sheetjs.xlsx')
    }
  }
}
</script>
<style scoped>
.TableToolbar {
  margin: 0%;
  padding-left: 10px;
  padding-right: 10px;
}
.search {
  float: right;
  width: 200px;
}
.toolButtonGroup {
  float: right;
}
</style>
