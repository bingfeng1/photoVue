<template>
  <el-button-group>
    <el-button v-if="isLogin" type="text">
      <slot :userInfo="userInfo"></slot>
    </el-button>
    <el-button type="text" v-else>
      <router-link to="/login" tag="a">登录</router-link>/
      <router-link to="/signUp" tag="a">注册</router-link>
    </el-button>
    <!-- <el-button type="primary">注册</el-button> -->
  </el-button-group>
</template>

<script>
export default {
  data() {
    return {
      userInfo: {}
    };
  },
  computed: {
    isLogin(){
      return this.checkLogin()
    }
  },
  methods: {
    checkLogin() {
      let userInfo = JSON.parse(window.sessionStorage.getItem("userInfo"));
      // 如果有用户信息
      if (userInfo) {
        let { nickname, base64, type } = userInfo;
        this.$set(this.userInfo, "nickname", nickname);
        this.$set(
          this.userInfo,
          "base64",
          "data:" + type + ";base64," + base64
        );
      }
      return !!this.$store.state.userInfo.token;
    }
  }
};
</script>