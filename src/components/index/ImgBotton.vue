<template>
  <div class="iconGroup">
    <div>{{img.originalname}}</div>

    <el-tooltip class="item" effect="light" content="下载" placement="bottom">
      <i class="el-icon-star-off" @click="collect"></i>
    </el-tooltip>

    <el-tooltip class="item" effect="light" content="下载" placement="bottom">
      <i class="el-icon-download" @click="download"></i>
    </el-tooltip>

  </div>
</template>

<script>
export default {
  props: ["img"],
  data() {
    return {
      showUpdate: false
    };
  },
  methods: {
    // 收藏
    collect(){
      // 首先判断是否已登录
      if(this.$store.state.userInfo.token){
        // 这里还需要预先提取，是否已经收藏过了
      }else{
        // 跳转至登录页面
        this.$router.push('/login')
      }
    },

    // 下载
    download() {
      this.$http
        .get("/image/downloads", {
          params: this.img,
          responseType: "blob"
        })
        .then(res => {
          let data = res.data;
          // 直接使用Blob就行了
          let url = window.URL.createObjectURL(new Blob([data]));
          let link = document.createElement("a");
          link.style.display = "none";
          link.href = url;
          link.setAttribute("download", `${this.img.originalname}.${this.img.ext}`);

          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        })
    }
  }
};
</script>

<style lang="scss">
.iconGroup {
  min-height: 3rem;
  i {
    margin: 4px 10px;
    cursor: pointer;
    &:hover {
      color: #409eff;
    }
  }
}
</style>