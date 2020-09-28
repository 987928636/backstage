<template>
  <div class="home">
    <el-container class="home-container">
      <!-- 头部区域 -->
      <el-header>
        <div>
          <!-- 后台logo -->
          <img src="../assets/logo2.png" alt="" />
          <!-- 顶部标题 -->
          <span>量宝宝后台管理</span>
        </div>
        <el-button type="info" @click="logout"> 退出 </el-button>
      </el-header>
      <!-- 页面主体区域 -->
      <el-container>
        <!-- 侧边栏 -->
        <el-aside :width="isCollapse ? '64px' : '200px'" style="transition:all .2s linear">
          <!-- 伸缩侧边栏按钮 -->
          <div class="toggle-button" @click="toggleCollapse">|||</div>
          <!-- 侧边栏菜单 -->
          <el-menu
            background-color="#333744"
            text-color="#fff"
            active-text-color="#ffd04b"
            :collapse="isCollapse"
            :collapse-transition="false"
            unique-opened
            router
          >
            <!-- 一级菜单 -->
            <el-submenu
              :index="item.id + ''"
              v-for="item in menuList"
              :key="item.id"
            >
              <!-- 一级菜单模板 -->
              <template slot="title">
                <!-- 图标 -->
                <i :class="iconsObj[item.id]"></i>
                <!-- 文本 -->
                <span>{{ item.authName }}</span>
              </template>
              <!-- 二级子菜单 -->
              <el-menu-item
                :index=" '/' + subItem.path"
                v-for="subItem in item.children"
                :key="subItem.id"
              >
                <!-- 二级菜单模板 -->
                <template slot="title">
                  <!-- 图标 -->
                  <i class="el-icon-location"></i>
                  <!-- 文本 -->
                  <span>{{ subItem.authName }}</span>
                </template>
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <!-- 主体结构 -->
        <el-main>
           <!-- 路由占位符 -->
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //是否折叠
      isCollapse: false,

      //图标
      iconsObj: {
        0: "iconfont icon-user",
        1: "iconfont icon-tijikongjian",
        2: "iconfont icon-shangpin",
      },

      //左侧菜单数据
      menuList: [
        {
          authName: "用户管理",
          id: 0,
          path: "users",
          children: [{ authName: "用户列表", id: 10, path: "users" }],
        },
        {
          authName: "渠道管理",
          id: 1,
          path: "channel",
          children: [{ authName: "渠道列表", id: 11, path: "channel" }],
        },
        {
          authName: "数据管理",
          id: 2,
          path: "product",
          children: [{ authName: "数据列表", id: 21, path: "product" }],
        },
      ],
    };
  },

  methods: {
    //退出
    logout() {
      window.sessionStorage.clear();
      this.$router.push("/login");
    },

    //点击按钮   切换菜单的折叠与展开
    toggleCollapse() {
      this.isCollapse = !this.isCollapse;
      // console.log(1111);
    },
  },
};
</script>

<style lang="less" scoped>
.home,
.home-container {
  height: 100%;
}
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #fff;
  font-size: 20px;
  > div {
    display: flex;
    align-items: center;
  }
  img {
    width: 50px;
    height: 50px;
    margin-right: 10px;
    border-radius: 50%;
  }
}
.el-aside {
  background-color: #333744;
  .el-menu {
    border-right: none;
  }
}
.el-main {
  background-color: #eaedf1;
}
.iconfont {
  margin-right: 10px;
}
.toggle-button {
  background-color: #4a5064;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2rem;
  cursor: pointer;
}
</style>
