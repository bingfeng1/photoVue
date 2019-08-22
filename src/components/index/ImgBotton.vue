<template>
  <div class="iconGroup">
    <div>{{img.originalname}}</div>

    <el-tooltip class="item" effect="light" content="收藏" placement="bottom">
      <i :class="img.collected|isconllect" @click="collect"></i>
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
        this.$http_token.put('/user/updatecollect',{
          isconllect,
          picid:this.img.id
        }).then(res=>{
          let result = res.data;
          if(result.affectedRows == 1){
            this.img.collected = !isconllect
          }
        })

      } else {
        // 跳转至登录页面
        this.$router.push("/login");
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
          link.setAttribute(
            "download",
            `${this.img.originalname}.${this.img.ext}`
          );

          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        });
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