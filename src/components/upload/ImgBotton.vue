<template>
  <div class="iconGroup">
    <div>{{img.originalname}}</div>
    <el-tooltip class="item" effect="light" content="重命名" placement="bottom">
      <i class="el-icon-edit" @click="showDialog"></i>
    </el-tooltip>

    <el-tooltip class="item" effect="light" content="删除图片" placement="bottom">
      <i class="el-icon-delete" @click="deletePic"></i>
    </el-tooltip>

    <el-tooltip class="item" effect="light" content="下载" placement="bottom">
      <i class="el-icon-download" @click="download"></i>
    </el-tooltip>

    <el-dialog :visible.sync="showUpdate">
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="重命名">
          <el-input v-model="form.originalname"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showUpdate = false">取 消</el-button>
        <el-button type="primary" @click="rename">确 定</el-button>
      </span>
    </el-dialog>
    <!-- <a :download="name" :href="url" hidden :ref="img.id"></a> -->
  </div>
</template>

<script>
export default {
  props: ["img"],
  data() {
    return {
      showUpdate: false,
      form: {
        id: "",
        originalname: ""
      },
      // url: "",
      // name: ""
    };
  },
  methods: {
    deletePic() {
      this.$http_token
        .delete("/user/deleteImg", {
          params: this.img
        })
        .then(res => {
          let result = res.data;
          if (result == "success") {
            this.$emit("delete", this.img.id);
          }
        });
    },
    showDialog() {
      this.showUpdate = true;
      this.form.originalname = this.img.originalname;
      this.form.id = this.img.id;
    },
    rename() {
      // 这里操作修改部分
      this.$http_token.put("/user/updateImgName", this.form).then(res => {
        // 这里需要写入成功或者失败
        let result = res.data;
        if (result.affectedRows == 1) {
          this.img.originalname = this.form.originalname;
          this.showUpdate = false;
        } else {
          alert("修改失败或者修改数量过多");
        }
      });
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
      
      // 下面两种方法，下载大文件的时候出现问题，我这里是下载7.8M的图片，失败
      // let imgsrc = this.img.url;
      // let name = this.img.originalname
      // let image = new Image();
      // // 解决跨域 Canvas 污染问题
      // image.setAttribute("crossOrigin", "anonymous");
      // image.onload = function() {
      //   let canvas = document.createElement("canvas");
      //   canvas.width = image.width;
      //   canvas.height = image.height;
      //   let context = canvas.getContext("2d");
      //   context.drawImage(image, 0, 0, image.width, image.height);
      //   let url = canvas.toDataURL("image/png"); //得到图片的base64编码数据
      //   let a = document.createElement("a"); // 生成一个a元素
      //   let event = new MouseEvent("click"); // 创建一个单击事件
      //   a.download = name || "photo"; // 设置图片名称
      //   a.href = url; // 将生成的URL设置为a.href属性
      //   a.dispatchEvent(event); // 触发a的单击事件
      // };
      // image.src = imgsrc;

      // 这是第二种方法
      // this.name = this.img.originalname;
      // this.$http
      //   .get("/image/downloads", {
      //     params: this.img,
      //     responseType: "arraybuffer"
      //   })
      //   .then(res => {
      //     //将从后台获取的图片流进行转换
      //     return (
      //       "data:image/png;base64," +
      //       btoa(
      //         new Uint8Array(res.data).reduce(
      //           (data, byte) => data + String.fromCharCode(byte),
      //           ""
      //         )
      //       )
      //     );
      //   })
      //   .then(data => {
      //     //接收转换后的Base64图片
      //     this.url = data;
      //     this.$nextTick(() => {
      //       this.$refs[this.img.id].click();
      //     });
      //   })
      //   .catch(err=>{
      //     console.log(err)
      //   });
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