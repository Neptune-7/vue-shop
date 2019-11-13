<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb>
      <el-breadcrumb-item :to="{path:'/home'}">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色管理</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->

    <el-row>
      <el-col>
        <el-button type="primary">添加角色</el-button>
      </el-col>
    </el-row>

    <!-- 角色列表 -->
    <el-table :data="tableData">
      <el-table-column type="index"></el-table-column>
      <el-table-column label="角色名称" prop="roleName"></el-table-column>
      <el-table-column label='角色描述' prop="roleDesc"></el-table-column>
      <el-table-column label='操作'>
        <template>
          <el-button type="primary" size="small" icon="el-icon-edit">编辑</el-button>
          <el-button type="danger" size="small" icon="el-icon-delete">删除</el-button>
          <el-button type="success" size="small" icon="el-icon-s-check">分配权限</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data () {
    return {
      tableData: []
    }
  },
  created () {
    this.getTableData()
  },
  methods: {
    async getTableData () {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      console.log(res.data)
      this.tableData = res.data
    }
  }

}
</script>

<style lang="less" scoped>
.el-card {
  margin-top: 15px !important;
}
</style>
