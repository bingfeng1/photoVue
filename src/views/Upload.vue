<template>
  <el-container>
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
          <ImgList :imgList="imgList" :span="8" height="300px" maxWidth="900px" @error="getError"></ImgList>
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
      imgList: []
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
        result = result.map(v => {
          return `${this.$http.defaults.baseURL}/${v.filename}`;
        });
        this.imgList = result;
      });
    },
    // 如果获取图片列表发生错误
    getError(err){
      alert(err)
    }
  },
  mounted() {
    this.getImgList();
  },
};
</script>