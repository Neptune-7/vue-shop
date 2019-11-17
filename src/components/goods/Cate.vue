<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 内容主体 -->
    <el-card>
      <el-row>
        <el-col :span="7">
          <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
        </el-col>
      </el-row>

      <!-- 表格 -->
      <tree-table :data="cateList" show-index index-text="#" :columns="columns" :expand-type="false" :selection-type="false">
        <!-- 是否有效 -->
        <template slot="isok" slot-scope="scope">
          <i class="el-icon-success" v-if="scope.row.cat_deleted == false" style="color:lightgreen;font-size:18px"></i>
          <i class="el-icon-error" v-else style="color:red;font-size:18px"></i>
        </template>
        <!-- 排序 -->
        <template slot="order" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level==0">一级</el-tag>
          <el-tag type="success" v-else-if="scope.row.cat_level==1">二级</el-tag>
          <el-tag type="warning" v-else>三级</el-tag>
        </template>
        <!-- 操作 -->
        <template slot="opt" slot-scope="scope">
          <el-button type="primary" size="mini" icon="el-icon-edit" @click="showEditDialog(scope.row.cat_id)">编辑</el-button>
          <el-button type="danger" size="mini" icon="el-icon-delete" @click="removeCateById(scope.row.cat_id)">删除</el-button>
        </template>
      </tree-table>

      <!-- 分页 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pagenum" :page-sizes="[3, 5, 10, 15]" :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </el-card>

    <!-- 添加分类对话框 -->
    <el-dialog title="添加分类" :visible.sync="addCateDialogVisible" width="50%" @close="addCataDialogClosed">
      <!-- 添加分类表单 -->
      <el-form :model="addCateForm" :rules="addCateFormRules" ref="addCateFormRef" label-width="100px">
        <el-form-item label="分类名称：" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类：">
          <!-- options 用来指定数据源 -->
          <!-- props 指定配置对象 -->
          <!-- xxsx -->
          <el-cascader expand-trigger="hover" v-model="selectedKeys" :props="cascaderProps" :options="parentCateList" @change="parentCateChanged" clearable checkStrictly style="width:100%"></el-cascader>
        </el-form-item>
      </el-form>

      <span slot="footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">立 即 创 建</el-button>
      </span>
    </el-dialog>

    <!-- 编辑分类对话框 -->
    <el-dialog title="修改分类" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
      <!-- 内容主体 -->
      <el-form label-width="80px" ref="editFormRef" :rules="editFormRules" :model="editForm">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="editForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <!-- 页脚 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCateInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data () {
    return {
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      // 商品分类的数据列表
      cateList: [],
      // 总数据条数
      total: 0,
      columns: [{
        label: '分类名称',
        prop: 'cat_name'
      }, {
        label: '是否有效',
        // 将当前列定义为模板列
        type: 'template',
        // 当前列使用模板名称
        template: 'isok'
      }, {
        label: '排序',
        // 将当前列定义为模板列
        type: 'template',
        // 当前列使用模板名称
        template: 'order'
      }, {
        label: '操作',
        // 将当前列定义为模板列
        type: 'template',
        // 当前列使用模板名称
        template: 'opt'
      }],
      // 控制添加分类对话框的显示与隐藏
      addCateDialogVisible: false,
      // 添加分类的表单数据对象
      addCateForm: {
        // 将要添加的分类名称
        cat_name: '',
        // 父级分类id
        cat_pid: 0,
        // 分类层级 默认为一级分类
        cat_level: 0
      },
      // 添加分类表单的验证规则对象
      addCateFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      // 父级分类列表
      parentCateList: [],
      // 指定级联选择器的配置对象
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        checkStrictly: true
      },
      // 选中的父级分类的id数组
      selectedKeys: [],
      // 控制编辑分类对话框的显示与隐藏
      editDialogVisible: false,
      // 编辑分类表单的验证规则对象
      editFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      editForm: {
        // 将要修改的分类名称
        cat_name: '',
        // 父级分类id
        cat_pid: 0,
        // 分类层级 默认为一级分类
        cat_level: 0
      }
    }
  },
  created () {
    this.getCateList()
  },
  methods: {
    async getCateList () {
      const { data: res } = await this.$http.get('categories', { params: this.queryInfo })
      if (res.meta.status !== 200) return this.$notify.error({ title: '获取商品分类数据失败', message: '请重新登录后再试' })
      console.log(res)
      // 将数据列表赋值给cateList
      this.cateList = res.data.result
      this.total = res.data.total
    },
    // 监听 pagesize 改变
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getCateList()
    },
    // 监听 pagenum 的改变
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getCateList()
    },
    // 展示添加分类对话框
    showAddCateDialog () {
      this.getParentCateList()
      this.addCateDialogVisible = true
    },
    // 获取父级分类的数据列表
    async getParentCateList () {
      const { data: res } = await this.$http.get('categories', { params: { type: 2 } })
      if (res.meta.status !== 200) return this.$notify.error({ title: '获取父级分类数据失败', message: '请重新登录后再试!' })
      this.parentCateList = res.data
    },
    // 选择项发生变化触发
    parentCateChanged () {
      console.log(this.selectedKeys)
      // 如果selectedKeys数组中的length大于零 则选中了父级分类
      // 反之 则说明没有选中任何父级分类
      if (this.selectedKeys.length > 0) {
        // 父级分类的id
        this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
        // 为当前等级赋值
        this.addCateForm.cat_level = this.selectedKeys.length
      } else {
        // 父级分类的id
        this.addCateForm.cat_pid = 0
        // 为当前等级赋值
        this.addCateForm.cat_level = 0
      }
    },
    // 添加新的分类
    addCate () {
      console.log(this.addCateForm)
      this.$refs.addCateFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('categories', this.addCateForm)
        if (res.meta.status !== 201) this.$notify.error({ title: '添加分类失败', message: '请重新登录后再试!' })
        this.$notify.success({ title: '添加分类成功!' })
        this.getCateList()
        this.addCateDialogVisible = false
      })
    },
    // 监听添加分类对话框关闭事件 重置表单数据
    addCataDialogClosed () {
      this.$refs.addCateFormRef.resetFields()
      this.selectedKeys = []
      this.addCateForm.cat_pid = 0
      this.addCateForm.cat_level = 0
    },
    // 展示编辑分类对话框
    async showEditDialog (id) {
      this.editDialogVisible = true
      console.log(id)
      const { data: res } = await this.$http.get('categories/' + id)
      if (res.meta.status !== 200) return this.$notify.error({ title: '查询分类信息失败!', message: '请重新登录后再试' })
      this.editForm = res.data
      console.log(this.editForm)
    },
    // 监听修改分类对话框的关闭事件
    editDialogClosed () {
      this.$refs.editFormRef.resetFields()
    },
    // 编辑分类信息事件
    editCateInfo () {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        // 发起修改用户信息请求
        const { data: res } = await this.$http.put('categories/' + this.editForm.cat_id, this.editForm)
        if (res.meta.status !== 200) return this.$notify.error({ title: '修改角色失败!', message: '请重新登录后再试' })
        this.$notify.success({ title: '修改角色成功!' })
        this.editDialogVisible = false
        this.getCateList()
      })
    },
    // 根据id删除分类
    async removeCateById (id) {
      // 询问用户是否删除数据
      const confirmResult = await this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      // 如果用户确认删除, 则返回值为字符串 confirm
      // 如果用户取消了删除,则返回值为字符串 cancel
      // console.log(confirmResult)
      // 如果confirmResult != 'cacle' 则说明用户取消删除
      if (confirmResult !== 'confirm') {
        return this.$notify.info({ title: '取消删除操作' })
      }
      const { data: res } = await this.$http.delete('categories/' + id)
      if (res.meta.status !== 200) return this.$notify.error({ title: '删除失败', message: '请重新登录后再试' })
      this.$notify.success({ title: '删除成功' })
      this.getCateList()
    }
  }
}

</script>
<style lang="less" scoped>
.el-row {
  margin-bottom: 15px;
}
</style>
