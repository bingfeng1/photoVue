<template>
  <section>
    <!-- 第一个为头像 -->
    <el-avatar :size="100" :src="userInfo.base64"></el-avatar>
    <!-- 第二个为上传图片的频次（图表） -->
    <div>表格</div>
    <!-- 第三个为上传按钮 -->
    <el-button @click="showUpload = true">上传</el-button>

    <el-dialog title="上传图片" :visible.sync="showUpload" width="80%">
      <slot></slot>
    </el-dialog>
  </section>
</template>

<script>
export default {
  data() {
    return {
      userInfo: {},
      showUpload: false
    };
  },
  methods: {
    getUserInfo() {
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
    }
  },
  mounted() {
    this.getUserInfo();
  }
};
</script>

<style lang="scss" scoped>
section {
  margin: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid;
  padding: 20px;
}
</style>