<template>
  <el-dropdown @command="handleCommand">
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
</template>


<script>
const map = new Map();
map
  .set("unlogin", function(vm) {
    window.sessionStorage.removeItem("userInfo");
    vm.$store.dispatch("clearUserInfo")
    vm.$http_token.defaults.headers.common["Authorization"] = ""
    vm.$message({
      message: "注销成功",
      type: "success"
    });
  })
  .set("upload", function(vm) {
    vm.$router.push("/upload");
  });
export default {
  props: {
    userInfo: Object
  },
  methods: {
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

.el-dropdown-link {
  color: white;
}
</style>
