<template>
  <el-button-group>
    <el-button v-if="isLogin" type="text">
      <el-dropdown @command="handleCommand" trigger="click">
        <span class="el-dropdown-link">
          {{userInfo.nickname}}
          <i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-avatar :size="60" :src="userInfo.base64"></el-avatar>
          <el-dropdown-item command="self">个人中心</el-dropdown-item>
          <el-dropdown-item command="collect">收藏</el-dropdown-item>
          <el-dropdown-item command="upload">上传作品</el-dropdown-item>
          <el-dropdown-item divided command="unlogin">注销</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </el-button>
    <el-button v-else>
      <router-link to="/login" tag="a">登录</router-link>/
      <router-link to="/signUp" tag="a">注册</router-link>
    </el-button>
    <!-- <el-button type="primary">注册</el-button> -->
  </el-button-group>
</template>

<script>
const map = new Map();
map.set("unlogin", function(vm) {
  window.sessionStorage.removeItem("userInfo");
  vm.$message({
    message: "注销成功",
    type: "success"
  });
  vm.isLogin = false;
}).set('upload',function(vm){
  vm.$router.push('/upload')
})
export default {
  data() {
    return {
      isLogin: false,
      userInfo: {}
    };
  },
  mounted() {
    this.isLogin = this.checkLogin();
  },
  methods: {
    checkLogin() {
      let userInfo = JSON.parse(window.sessionStorage.getItem("userInfo"));
      // 如果有用户信息
      if (userInfo) {
        let { account, nickname, base64, type } = userInfo;
        this.$set(this.userInfo, "account", account);
        this.$set(this.userInfo, "nickname", nickname);
        this.$set(
          this.userInfo,
          "base64",
          "data:" + type + ";base64," + base64
        );
      }
      return !!userInfo;
    },
    handleCommand(key) {
      map.get(key)(this);
    }
  }
};
</script>

<style lang="scss" scoped>
.el-button {
  padding: 5px 10px;
}
.el-avatar {
  margin: 0px auto;
  display: inherit;
}

.el-dropdown-link{
  color:white;
}
</style>
