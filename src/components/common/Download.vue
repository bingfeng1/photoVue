<template>
  <a :download="name" :href="url" hidden id="download"></a>
</template>

<script>
export default {
  data() {
    return {
      url: "",
      name: ""
    };
  },
  methods: {
    // 下载
    download(img) {
      this.name = img.originalname;
      this.$http
        .get("/image/downloads", {
          params: img,
          responseType: "arraybuffer"
        })
        .then(res => {
          //将从后台获取的图片流进行转换
          return (
            "data:image/png;base64," +
            btoa(
              new Uint8Array(res.data).reduce(
                (data, byte) => data + String.fromCharCode(byte),
                ""
              )
            )
          );
        })
        .then(data => {
          //接收转换后的Base64图片
          this.url = data;
          this.$nextTick(() => {
            document.getElementById("download").click();
          });
        })
        .catch({});
    }
  }
};
</script>
