<template>
  <div>
    <!-- 第三个为上传按钮 -->
    <el-button @click="showUpload = true">上传</el-button>

    <el-dialog title="上传图片" :visible.sync="showUpload" width="80%">
      <section id="upload" v-loading="loading">
        <el-row class="select">
          <el-col :span="24">
            <span>上传的相册：</span>
            <el-select v-model="value" placeholder="请选择">
              <el-option
                v-for="item in type"
                :key="item.id"
                :label="item.typename"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-upload
              action
              list-type="picture-card"
              :on-preview="handlePictureCardPreview"
              :auto-upload="false"
              multiple
              :on-remove="getFileList"
              :on-change="getFileList"
              :limit="9"
              ref="imgList"
            >
              <i class="el-icon-plus"></i>
            </el-upload>
            <el-dialog :visible.sync="dialogVisible" append-to-body>
              <img style="maxWidth:80vw;" width="100%" :src="dialogImageUrl" alt />
            </el-dialog>
          </el-col>
        </el-row>
      </section>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showUpload = false">取 消</el-button>
        <el-button type="primary" @click="toUpload" ref="toUpload">上 传</el-button>
      </span>
    </el-dialog>
  </div>
</template>



<script>
export default {
  data() {
    return {
      showUpload: false,
      value: "",
      dialogImageUrl: "",
      dialogVisible: false,
      fileList: [],
      loading: false
    };
  },
  props: {
    treeList: Array
  },
  computed: {
    type() {
      return this.treeList;
    },
    files() {
      return this.fileList.map(file => {
        return file.raw;
      });
    }
  },
  methods: {
    // 图片大图
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    getFileList(file, fileList) {
      this.fileList = fileList;
    },
    // 上传的部分判断（还缺很多，比如限制9张等）
    toUpload() {
      if (this.files.length == 0) {
        this.$message({
          type: "error",
          message: "请先选择图片"
        });
        return;
      }
      this.loading = true;
      let formdata = new FormData();
      for (let v of this.files) {
        formdata.append("file", v);
      }
      // 先禁止表单按钮，防止重复提交
      this.$refs.toUpload.$el.disabled = true;
      this.$http_token
        .post("/user/upload", formdata, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        })
        .then(res => {
          let result = res.data;

          this.loading = false;
          if (result == "success") {
            for (let v of this.fileList) {
              v.status = "success";
            }
            this.fileList = [];
          }
          setTimeout(() => {
            this.$refs.imgList.clearFiles();
            this.$confirm("需要继续上传吗", "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "success"
            })
              .then(() => {
                this.$message({
                  type: "success",
                  message: "请继续选择需要上传的文件"
                });
              })
              .catch(() => {
                this.showUpload = false;
              })
              .finally(() => {
                this.$refs.toUpload.$el.disabled = false;
                this.$emit("finally");
              });
          }, 1000);
        });
    }
  }
};
</script>

<style lang="scss" scoped>
#upload {
  display: block;
  .select {
    text-align: left;
  }
  .el-col {
    padding: 10px;
  }
}
</style>