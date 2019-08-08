<template>
  <el-button-group>
    <el-button type="text">
      <span v-if="isLogin">用户123</span>
      <router-link v-else to="/login">登录</router-link>
    </el-button>
    <!-- <el-button type="primary">注册</el-button> -->
  </el-button-group>
</template>

<script>
export default {
  data() {
    return {
      isLogin: false
    };
  },
  mounted() {
    this.isLogin = this.checkLogin();
  },
  methods: {
    checkLogin() {
      let userInfo = JSON.parse(window.sessionStorage.getItem("userInfo"));
      return userInfo ? userInfo.sessionId : false;
    }
  }
};
</script>


<style lang="scss" scoped>
.el-button {
  color: white;
  text-decoration: underline;
}
</style>
