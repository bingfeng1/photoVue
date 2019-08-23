<template>
  <el-tooltip class="item" effect="light" content="收藏" placement="bottom">
    <i :class="img.collected|isconllect" @click="collect"></i>
  </el-tooltip>
</template>

<script>
export default {
  props: {
    img: Object
  },

  filters: {
    isconllect(val) {
      return val ? "el-icon-star-on" : "el-icon-star-off";
    }
  },
  methods: {
    // 收藏
    collect() {
      // 首先判断是否已登录
      if (this.$store.state.userInfo.token) {
        // 这里还需要预先提取，是否已经收藏过了
        let isconllect = this.img.collected;
        this.$http_token
          .put("/user/updatecollect", {
            isconllect,
            picid: this.img.id
          })
          .then(res => {
            let result = res.data;
            if (result.affectedRows == 1) {
              this.img.collected = !isconllect;
            }
          });
      } else {
        // 跳转至登录页面
        this.$router.push("/login");
      }
    }
  }
};
</script>