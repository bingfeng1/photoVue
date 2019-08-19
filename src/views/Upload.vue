<template>
  <el-container id="upload">
    <el-aside>
      <!-- 左侧树形列表 -->
      <Tree @setTreeList="getTreeList"></Tree>
    </el-aside>
    <el-container>
      <el-main>
        <!-- 个人信息与统计，上传按钮 -->
        <Statistics>
          <template #right>
            <!-- 上传按钮 -->
            <ToUpload :treeList="treeList" @finally="getImgList"></ToUpload>
          </template>
        </Statistics>
        <!-- 个人的图片列表 -->
        <div>
          <ImgList :imgListResult="imgListResult" v-loading="loading">
            <template #bottom="{img}">
              <div class="iconGroup">
                <div :ref="img.id">{{img.originalname}}</div>
                <el-tooltip class="item" effect="light" content="重命名" placement="bottom">
                  <i class="el-icon-edit" @click="showDialog(img)"></i>
                </el-tooltip>

                <el-tooltip class="item" effect="light" content="删除图片" placement="bottom">
                  <i class="el-icon-delete" @click="deletePic(img)"></i>
                </el-tooltip>

                <el-tooltip class="item" effect="light" content="下载" placement="bottom">
                  <i class="el-icon-download" @click="download(img)"></i>
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
              </div>
            </template>
          </ImgList>

          <a :download="downloadName" :href="downloadUrl" hidden id="download"></a>
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>


<script>
import Tree from "@/components/upload/Tree.vue";
import Statistics from "@/components/upload/Statistics.vue";
import ToUpload from "@/components/upload/ToUpload.vue";
import ImgList from "@/components/common/ImgList.vue";

export default {
  components: {
    Tree,
    Statistics,
    ToUpload,
    ImgList
  },

  data() {
    return {
      treeList: [],
      imgListResult: [],
      loading: true,
      showUpdate: false,
      form: {
        id: "",
        originalname: ""
      },
      downloadUrl: "",
      downloadName:""
    };
  },

  methods: {
    // 响应树形列表返回给他的子组件
    getTreeList(result) {
      this.treeList = result;
    },
    // 获取自身的图片列表
    getImgList() {
      this.$http_token.get("/user/selfImg").then(res => {
        let result = res.data;
        this.imgListResult = result;
        this.loading = false;
      });
    },
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
    showDialog(img) {
      this.showUpdate = true;
      this.form.originalname = img.originalname;
      this.form.id = img.id;
    },
    rename() {
      // 这里操作修改部分
      this.$http_token.put("/user/updateImgName", this.form).then(res => {
        // 这里需要写入成功或者失败
        let result = res.data;
        if (result.affectedRows == 1) {
          this.$refs[this.form.id].innerText = this.form.originalname;
          this.showUpdate = false;
        } else {
          alert("修改失败或者修改数量过多");
        }
      });
    },
    // 下载
    download(img) {
      this.downloadName = img.originalname;
      this.$http
        .get("/image/downloads", {
          params: img
        }).then(res=>{
          return res
        })
        .then(res=> {
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
        .then(data=> {
          //接收转换后的Base64图片
          this.downloadUrl = data;
          this.$nextTick(()=>{
            document.getElementById('download').click()
          })
        })
        .catch({});
    }
  },
  mounted() {
    this.getImgList();
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