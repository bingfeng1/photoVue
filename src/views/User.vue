<template>
  <el-container id="upload">
    <el-aside>
      <el-row>
        <el-col :span="24" id="menu">
          <router-link to="/">
            <Logo></Logo>
          </router-link>
          <el-card>
            <el-menu
              class="el-menu-vertical-demo"
              style="textAlign:left"
              active-text-color="#303133"
            >
              <router-link to="/">
                <el-menu-item index="/index">
                  <i class="el-icon-menu"></i>
                  <span slot="title">个人中心</span>
                </el-menu-item>
              </router-link>
              <router-link to="/user/collect">
                <el-menu-item index="collect">
                  <i class="el-icon-document"></i>
                  <span slot="title">收藏</span>
                </el-menu-item>
              </router-link>
              <router-link to="/user/upload">
                <el-menu-item index="upload">
                  <i class="el-icon-setting"></i>
                  <span slot="title">上传作品</span>
                </el-menu-item>
              </router-link>
            </el-menu>
          </el-card>
        </el-col>
      </el-row>
    </el-aside>
    <el-container>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import Logo from "@/components/common/Logo.vue";
export default {
  components: {
    Logo
  },
  methods: {}
};
</script>

<style lang="scss" scopes>
#menu {
  margin-top: 2.5rem;
  padding: 0px 10px;
  .el-card {
    margin-top: 2.5rem;
    .el-menu-item {
      border-bottom: 1px solid rgba(131, 131, 131, 0.418);
    }
  }
  // 覆盖elementui的样式
  .router-link-active.router-link-exact-active {
    li.el-menu-item {
      color: #409eff !important;
    }
  }
}
.el-menu-vertical-demo {
  border-right: none;
}
a:-webkit-any-link {
  text-decoration: none;
}
</style>