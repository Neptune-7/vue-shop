<template>
  <div>
    <v-chart :force-fit="true" :height="height" :data="data" :scale="scale">
      <v-tooltip />
      <v-axis />
      <v-legend />
      <v-line position="month*temperature" color="city" />
      <v-point position="month*temperature" color="city" :size="4" :v-style="style" :shape="'circle'" />
    </v-chart>
  </div>
</template>

<script>
const DataSet = require('@antv/data-set')
window.dtb = []
const sourceData = [
  { name: '华东', type: 'line', stack: '总量', data: [2999, 3111, 4100, 3565, 3528, 6000] },
  { name: '华南', type: 'line', stack: '总量', data: [5090, 2500, 3400, 6000, 6400, 7800] },
  { name: '华北', type: 'line', stack: '总量', data: [6888, 4000, 8010, 12321, 13928, 12984] },
  { name: '西部', type: 'line', stack: '总量', data: [9991, 4130, 7777, 12903, 13098, 14028] },
  { name: '其他', type: 'line', stack: '总量', data: [15212, 5800, 10241, 14821, 15982, 14091] }
]
console.log(sourceData)
const datb = window.dtb
const dv = new DataSet.View().source(datb)
dv.transform({
  type: 'fold',
  // 过滤器
  fields: datb.series,
  key: 'name',
  value: 'temperature'
})
const data = dv.rows

const scale = [{
  dataKey: window.dtb.xAxis,
  min: 0,
  max: 1
}]

export default {
  data () {
    return {
      data,
      scale,
      height: 400,
      style: { stroke: '#fff', lineWidth: 1 }
    }
  },
  created () {
    this.getReportsData()
  },
  methods: {
    async getReportsData () {
      const { data: res } = await this.$http.get('/reports/type/1')
      window.dtb = res.data
      console.log(window.dtb)
    }
  }
}
</script>

<style lang="less" scoped>
</style>
