<template>
  <section>
    <!-- 第一个为头像 -->
    <el-avatar :size="100" :src="portrait"></el-avatar>
    <!-- 第二个为上传图片的频次（图表） -->
    <div>表格</div>
    <slot name="right"></slot>
  </section>
</template>

<script>
export default {
  data() {
    return {
      userInfo: {}
    };
  },
  
  computed: {
    portrait(){
      return `${this.$http.defaults.baseURL}/${this.userInfo.portrait}`
    }
  },
  methods: {
    getUserInfo() {
      let userInfo = JSON.parse(window.sessionStorage.getItem("userInfo"));
      // 如果有用户信息
      if (userInfo) {
        let { nickname, portrait } = userInfo;
        this.$set(this.userInfo, "nickname", nickname);
        this.$set(
          this.userInfo,
          "portrait",
          portrait
        );
      }
    },
  },
  mounted() {
    this.getUserInfo();
  }
};
</script>

<style lang="scss" scoped>
section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid;
  padding: 20px;
}
</style>