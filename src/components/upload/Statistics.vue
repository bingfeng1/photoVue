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
              action="http://localhost:3000/user/upload"
              list-type="picture-card"
              :on-preview="handlePictureCardPreview"
              :auto-upload="false"
              multiple
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
      dialogVisible: false
    };
  },
  props: {
    treeList: Array
  },
  computed: {
    type() {
      return this.treeList;
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
    toUpload() {
      this.$refs.imgList.submit();
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