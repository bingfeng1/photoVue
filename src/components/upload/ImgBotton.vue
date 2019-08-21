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

    <a :download="name" :href="url" hidden :ref="img.id"></a>
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
      url: "",
      name: ""
    };
  },
  methods: {
    deletePic(img) {
      this.$http_token
        .delete("/user/deleteImg", {
          params: img
        })
        .then(res => {
          let result = res.data;
          if (result == "success") {
            this.imgListResult = this.imgListResult.filter(v => {
              return v.id !== img.id;
            });
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
      this.name = this.img.originalname;
      this.$http
        .get("/image/downloads", {
          params: this.img,
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
            this.$refs[this.img.id].click();
          });
        })
        .catch({});
    }
  }
};
</script>