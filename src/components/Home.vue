<template>
  <el-container class="home-container">
    <!-- 侧边栏 -->
    <el-aside :width="isCollapse ? '65px':'210px'">
      <el-menu :default-active="activePath" class="el-menu-vertica" background-color="#304156" text-color="#bfcbd9" active-text-color="#409eff" :collapse="isCollapse" :collapse-transition="false" router>
        <!-- 一级菜单 -->
        <el-submenu class="sidebar-container" :index="item.id+''" v-for="item in menuList" :key="item.id">
          <!-- 一级菜单模板区 -->
          <template slot="title">
            <!-- 图标 -->
            <i :class="icons[item.id]"></i>
            <!-- 文本 -->
            <span>{{item.authName}}</span>
          </template>

          <!-- 二级菜单 -->
          <el-menu-item :index="'/'+subItem.path" v-for="subItem in item.children" :key="subItem.id" @click="saveNavState('/'+subItem.path)">
            <template>
              <!-- 图标 -->
              <i class="el-icon-s-operation"></i>
              <!-- 文本 -->
              <span>{{subItem.authName}}</span>
            </template>
          </el-menu-item>
        </el-submenu>
      </el-menu>
    </el-aside>
    <!-- 页面主体 -->
    <el-container>
      <!-- 头部 -->
      <el-header>
        <div>
          <!-- 列表展开缩放按钮 -->
          <div class="hamburger-container" @click="hamburger" style="padding: 0px 15px;">
            <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="64" height="64" :class="isActive ? 'is_active':''" class="hamburger">
              <path d="M408 442h480c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8H408c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8zm-8 204c0 4.4 3.6 8 8 8h480c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8H408c-4.4 0-8 3.6-8 8v56zm504-486H120c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm0 632H120c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zM142.4 642.1L298.7 519a8.84 8.84 0 0 0 0-13.9L142.4 381.9c-5.8-4.6-14.4-.5-14.4 6.9v246.3a8.9 8.9 0 0 0 14.4 7z"></path>
            </svg>
          </div>
        </div>
        <!-- <el-button @click="logout" type="primary" plain>退出</el-button> -->
        <el-dropdown trigger="click">
          <span class="el-dropdown-link">
            <el-avatar class="avatarBox" fit="cover" shape="square" :size="40" :src=squareUrl></el-avatar>
            <i class="el-icon-caret-bottom"></i>
          </span>
          <el-dropdown-menu class="my-dropdown-menu" slot="dropdown">
            <el-dropdown-item>个人中心</el-dropdown-item>
            <el-dropdown-item><span @click="home">首页</span></el-dropdown-item>
            <el-dropdown-item divided><span @click="logout">退出登录</span></el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-header>
      <!-- 右侧内容主体 -->
      <el-main style="background-color:#f0f2f5">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  created () {
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  data () {
    return {
      squareUrl: require('@/assets/avatar.jpeg'),
      isActive: true,
      isCollapse: false,
      menuList: [],
      icons: {
        '125': 'el-icon-user',
        '103': 'el-icon-lock',
        '101': 'el-icon-shopping-bag-1',
        '102': 'el-icon-document',
        '145': 'el-icon-data-line'
      },
      activePath: ''
    }
  },
  methods: {
    // 首页点击事件
    home () {
      this.$router.push('/welcome')
    },
    // 退出登录
    logout () {
      window.sessionStorage.clear()
      this.$router.push('/login')
      this.$message.success('退出成功')
    },
    // 菜单折叠与展开
    hamburger (event) {
      this.isActive = !this.isActive
      this.isCollapse = !this.isCollapse
    },
    // 获取左侧菜单项
    async getMenuList () {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menuList = res.data
    },
    // 保持连接激活状态
    saveNavState (activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    }
  }
}
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
}
.el-aside {
  background-color: rgb(48, 65, 86); //#304156
}
.el-menu {
  font-weight: 500;
}
.el-header {
  padding: 0 30px 0 0 !important;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.2);
}

.hamburger {
  display: inline-block;
  vertical-align: middle;
  width: 20px;
  height: 20px;
}
.hamburger-container {
  line-height: 46px;
  height: 100%;
  float: left;
  cursor: pointer;
  -webkit-transition: background 0.3s;
  transition: background 0.3s;
  -webkit-tap-highlight-color: transparent;
}
.is_active {
  -webkit-transform: rotate(180deg);
  transform: rotate(180deg);
}
.avatarBox {
  cursor: pointer;
  margin-top: 10px;
  box-shadow: 2px 2px 8px #ccc;
}
.my-dropdown-menu {
  text-align: center;
  width: 99px;
  line-height: 30px;
  padding: 5px 0;
  font-size: 14px;
}
// .logout::before {
//   content: '';
//   display: block;
//   height: 3px;
//   margin: 5px -20px;
//   border-top: 1px solid #e6ebf5;
//   background-color: #fff;
// }
.el-icon-caret-bottom {
  margin-left: 10px;
  cursor: pointer;
}
</style>
