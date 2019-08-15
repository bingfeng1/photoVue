<template>
  <section>
    <!-- 第一个为头像 -->
    <el-avatar :size="100" :src="userInfo.base64"></el-avatar>
    <!-- 第二个为上传图片的频次（图表） -->
    <div>表格</div>
    <!-- 第三个为上传按钮 -->
    <el-button @click="showUpload = true">上传</el-button>

    <el-dialog title="上传图片" :visible.sync="showUpload" width="80%">
      <section id="upload">
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
        <el-button type="primary" @click="toUpload">上 传</el-button>
      </span>
    </el-dialog>
  </section>
</template>

<script>
export default {
  data() {
    return {
      userInfo: {},
      showUpload: false,
      value: "",
      dialogImageUrl: "",
      dialogVisible: false,
      fileList: []
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
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    getFileList(file, fileList) {
      this.fileList = fileList;
    },
    toUpload() {
      let formdata = new FormData();
      for (let v of this.files) {
        formdata.append("file", v);
      }
      this.$http
        .post("/user/upload", formdata, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        })
        .then(res => {
          let result = res.data;
          if (result == "success") {
            for (let v of this.fileList) {
              v.status = "success";
            }
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
              });
          }, 1000);
        });
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
  #upload {
    display: block;
    .select {
      text-align: left;
    }
    .el-col {
      padding: 10px;
    }
  }
}
</style>