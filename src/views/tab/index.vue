<template>
  <div class="tab-container">
    <el-tabs
      v-model="activeName"
      style="margin-top:15px;"
      type="border-card"
      @tab-click="handleClick"
    >
      <el-tab-pane :key="'first'" label="离港船只" name="first">
        <child1 v-if="isChildUpdate1" />
      </el-tab-pane>
      <el-tab-pane :key="'second'" label="锚地船只" name="second">
        <child2 v-if="isChildUpdate2" />
      </el-tab-pane>
      <el-tab-pane :key="'third'" label="靠泊船只" name="third">
        <child3 v-if="isChildUpdate3" />
      </el-tab-pane>
      <el-tab-pane :key="'fourth'" label="船运历史" name="fourth">
        <child4 v-if="isChildUpdate4" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import departure from './components/departure'
import anchorage from './components/anchorage'
import berth from './components/berth'
import history from './components/history'

export default {
  name: 'Tab',
  components: {
    child1: departure,
    child2: anchorage,
    child3: berth,
    child4: history
  },
  data() {
    return {
      activeName: 'first',
      isChildUpdate1: true,
      isChildUpdate2: false,
      isChildUpdate3: false,
      isChildUpdate4: false
    }
  },
  mounted() {},
  methods: {
    handleClick(tab) {
      if (tab.name === 'first') {
        this.isChildUpdate1 = true
        this.isChildUpdate2 = false
        this.isChildUpdate3 = false
        this.isChildUpdate4 = false
      } else if (tab.name === 'second') {
        this.isChildUpdate1 = false
        this.isChildUpdate2 = true
        this.isChildUpdate3 = false
        this.isChildUpdate4 = false
      } else if (tab.name === 'third') {
        this.isChildUpdate1 = false
        this.isChildUpdate2 = false
        this.isChildUpdate3 = true
        this.isChildUpdate4 = false
      } else if (tab.name === 'fourth') {
        this.isChildUpdate1 = false
        this.isChildUpdate2 = false
        this.isChildUpdate3 = false
        this.isChildUpdate4 = true
      }
    }
  }
}
</script>

<style scoped>
.tab-container {
  margin: 30px;
}
</style>
