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
                <div>{{img.originalname}}</div>
                <el-tooltip class="item" effect="light" content="重命名" placement="bottom">
                  <i class="el-icon-edit" @click="rename(img)"></i>
                </el-tooltip>

                <el-tooltip class="item" effect="light" content="删除图片" placement="bottom">
                  <i class="el-icon-delete" @click="deletePic(img)"></i>
                </el-tooltip>
              </div>
            </template>
          </ImgList>
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
      loading: true
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
  },
  mounted() {
    this.getImgList();
  }
};
</script>

<style lang="scss">
.iconGroup {
  i {
    margin: 2px 10px;
    cursor: pointer;
    &:hover {
      color: #409eff;
    }
  }
}
</style>