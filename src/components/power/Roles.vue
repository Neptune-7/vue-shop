<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb>
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="addDialogVisible = true">添加角色</el-button>
        </el-col>
      </el-row>

      <!-- 角色列表 -->
      <el-table :data="tableData" border size="20">
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row :class="['bdbottom', i1 === 0 ? 'bdtop':'','vcenter']" v-for="(item1, i1) in scope.row.children" :key="item1.id">
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag closable>{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级和三级权限 -->
              <el-col :span="19">
                <!-- 通过for循环 嵌套渲染二级权限 -->
                <el-row :class="[i2 === 0 ? '':'bdtop','vcenter']" v-for="(item2, i2) in item1.children" :key="item2.id">
                  <el-col :span="6">
                    <el-tag type="success" closable>{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 渲染三级权限 -->
                  <el-col :span="18">
                    <el-tag type="warning" :class="[i3 === 0 ? 'bdtop':'']" v-for="(item3, i3) in item2.children" :key="item3.id" closable @close="removeRightById(scope.row,item3.id)">
                      {{item3.authName}}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" icon="el-icon-edit" @click="showEditDialog(scope.row.id)">编辑
            </el-button>
            <el-button type="danger" size="small" icon="el-icon-delete" @click="removeUserById(scope.row.id)">删除
            </el-button>
            <el-button type="success" size="small" icon="el-icon-s-check" @click="showSetRightDialog(scope.row)">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加角色对话框 -->
    <el-dialog title="添加角色" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
      <!-- 内容主体 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="80px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRoles">确 认</el-button>
      </span>
    </el-dialog>

    <!-- 编辑角色对话框 -->
    <el-dialog title="修改角色" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
      <!-- 内容主体 -->
      <el-form label-width="80px" ref="editFormRef" :rules="editFormRules" :model="editForm">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editForm.roleName" disabled></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <!-- 页脚 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRolesInfo">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配权限对话框 -->
    <el-dialog title="分配权限" :visible.sync="setRightDialogVisible" width="50%" @close="setRightDialogClosed">
      <!-- 内容主体 树形控件 -->
      <el-tree :data="rightsList" :props="treeRightsProps" show-checkbox node-key="id" default-expand-all :default-checked-keys="defKeys" ref="treeRightsRef"></el-tree>
      <!-- 页脚 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 角色数据
      tableData: [],

      // 添加的角色数据
      addForm: {
        roleName: '',
        roleDesc: ''
      },

      // 查询到的角色数据
      editForm: {},

      // 控制添加角色对话框的显示与隐藏
      addDialogVisible: false,

      // 控制编辑角色对话框的显示与隐藏
      editDialogVisible: false,

      // 添加表单验证规则对象
      addFormRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          {
            min: 3,
            max: 10,
            message: '角色名长度在3-10个 ',
            trigger: 'blur'
          }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' }
        ]
      },

      // 修改表单验证规则对象
      editFormRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          {
            min: 3,
            max: 10,
            message: '角色名长度在3-10个 ',
            trigger: 'blur'
          }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' }
        ]
      },

      // 控制分配权限对话框的显示与隐藏
      setRightDialogVisible: false,

      // 所有权限的数据
      rightsList: [],

      // 树形控件的属性绑定
      treeRightsProps: {
        label: 'authName',
        children: 'children'
      },

      // 默认选中的节点id值数组
      defKeys: [],

      // 当前即将分配权限的角色id
      roleId: ''
    }
  },
  created () {
    this.getRolesData()
  },
  methods: {
    // 获取角色权限数据
    async getRolesData () {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) return this.$notify({ title: '获取角色列表失败', message: res.meta.msg })
      console.log(res)
      this.tableData = res.data
    },

    // 点击按钮添加新角色
    addRoles () {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        // 发起添加用户请求
        const { data: res } = await this.$http.post('roles', this.addForm)
        if (res.meta.status !== 201) return this.$notify.error({ title: '添加角色失败!', message: '请重新登录后再试' })
        this.$notify.success({ title: '添加角色成功!' })
        this.addDialogVisible = false
        this.getRolesData()
      })
    },

    // 编辑角色信息事件
    editRolesInfo () {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        // 发起修改用户信息请求
        const { data: res } = await this.$http.put('roles/' + this.editForm.roleId, this.editForm)
        if (res.meta.status !== 200) return this.$notify.error({ title: '修改角色失败!', message: '请重新登录后再试' })
        this.$notify.success({ title: '修改角色成功!' })
        this.editDialogVisible = false
        this.getRolesData()
      })
    },

    // 监听添加用户对话框的关闭事件
    addDialogClosed () {
      this.$refs.addFormRef.resetFields()
    },

    // 展示编辑用户对话框
    async showEditDialog (id) {
      this.editDialogVisible = true
      const { data: res } = await this.$http.get('roles/' + id)
      console.log(res)
      if (res.meta.status !== 200) return this.$notify.error({ title: '查询角色信息失败!', message: '请重新登录后再试' })
      this.editForm = res.data
    },

    // 监听修改用户对话框的关闭事件
    editDialogClosed () {
      this.$refs.editFormRef.resetFields()
    },

    // 根据id删除角色
    async removeUserById (id) {
      // 询问用户是否删除数据
      const confirmResult = await this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
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
      const { data: res } = await this.$http.delete('roles/' + id)
      console.log(res)
      if (res.meta.status !== 200) return this.$notify.error({ title: '删除失败', message: '请重新登录后再试' })
      this.$notify.success({ title: '删除成功' })
      this.getRolesData()
    },

    // 根据ID删除对应的权限
    async removeRightById (role, rightId) {
      // 弹窗提示用户是否删除
      const confirmResult = await this.$confirm('此操作将删除该角色所拥有的权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)

      if (confirmResult !== 'confirm') {
        return this.$notify.info({ title: '取消删除操作' })
      }
      const { data: res } = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
      console.log(res)
      if (res.meta.status !== 200) return this.$notify.error({ title: '删除失败', message: '请重新登录后再试' })
      this.$notify.success({ title: '删除成功' })
      role.children = res.data
    },

    // 展示分配权限的对话框
    async showSetRightDialog (role) {
      this.roleId = role.id
      // 获取所有权限的数据
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) return this.$notify({ title: '获取权限数据失败', message: 'res.meta.msg' })

      // 获取到的权限数据保存到 data中
      this.rightsList = res.data

      // 递归获取三级节点的id
      this.getLeafKeys(role, this.defKeys)
      console.log(this.defKeys)
      this.setRightDialogVisible = true
    },

    // 通过递归的形式,获取角色下所有的三级权限的id,并保存到 defKeys 数组中
    getLeafKeys (node, arr) {
      // 如果当前 node 节点不包含 children 属性，则是三级节点
      if (!node.children) {
        return arr.push(node.id)
      }

      node.children.forEach(item => this.getLeafKeys(item, arr))
    },

    // 监听分配权限对话框关闭事件
    setRightDialogClosed () {
      this.defKeys = []
    },

    // 为角色分配权限
    async allotRights () {
      const keys = [
        ...this.$refs.treeRightsRef.getCheckedKeys(),
        ...this.$refs.treeRightsRef.getHalfCheckedKeys()
      ]
      const idStr = keys.join(',')
      console.log(idStr)

      const { data: res } = await this.$http.post(`roles/${this.roleId}/rights`, { rids: idStr })
      if (res.meta.status !== 200) return this.$notify.error({ title: '分配权限失败!', message: '请重新登录后再试' })
      this.$notify.success({ title: '分配权限成功!' })
      this.getRolesData()
      this.setRightDialogVisible = false
    }
  }
}
</script>

<style lang="less" scoped>
.el-table {
  margin-top: 15px !important;
}

.el-tag {
  margin: 7px;
}

.bdtop {
  border-top: 1px solid #eee;
}

.bdbottom {
  border-bottom: 1px solid #eee;
}

.vcenter {
  display: flex;
  align-items: center;
}
</style>
