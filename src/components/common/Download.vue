<template>
  <el-tooltip class="item" effect="light" content="下载" placement="bottom">
    <i class="el-icon-download" @click="download"></i>
  </el-tooltip>
</template>

<script>
export default {
  props:{
    img:Object
  },
  methods: {
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
