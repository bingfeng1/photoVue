<template>
  <el-container id="upload">
    <el-header height="none">
      <!-- 个人信息与统计，上传按钮 -->
      <Statistics>
        <template #right>
          <!-- 上传按钮 -->
          <ToUpload :treeList="treeList" @finally="getImgList"></ToUpload>
        </template>
      </Statistics>
    </el-header>
    <el-container>
      <el-aside>
        <Tree
          :treedata="treedata"
          :defaultProps="defaultProps"
          @hasCheck="getCheckKeys"
          @changeTreedata="dealTreeList"
        ></Tree>
      </el-aside>
      <el-main style="padding:0px">
        <!-- 个人的图片列表 -->
        <ImgList :imgListResult="imgListResult" v-loading="loading">
          <template #bottom="{img}">
            <ImgBotton :img="img" @delete="deletePic"></ImgBotton>
          </template>
        </ImgList>
      </el-main>
    </el-container>
  </el-container>
</template>


<script>
import Tree from "@/components/upload/Tree.vue";
import Statistics from "@/components/upload/Statistics.vue";
import ToUpload from "@/components/upload/ToUpload.vue";
import ImgList from "@/components/common/ImgList.vue";
import ImgBotton from "@/components/upload/ImgBotton.vue";

export default {
  components: {
    Tree,
    Statistics,
    ToUpload,
    ImgList,
    ImgBotton
  },

  data() {
    return {
      treeList: [],
      imgListResult: [],
      loading: true,
      // 树形结构的内容
      treedata: [
        {
          id: 0,
          label: "全部",
          z_id: 0,
          children: []
        }
      ],
      defaultProps: {
        children: "children",
        label: "label"
      },
      checkTreeNode: []
    };
  },

  methods: {
    // 响应树形列表返回给他的子组件
    getTreeList() {
      // 进入时，根据存放的token获取用户信息
      this.$http_token.get("/user/imgType").then(res => {
        this.dealTreeList(res);
        // 这里是初始化进入，所以再绑定一下已选择的项
        this.checkTreeNode = this.treedata[0].children.map(v => v.z_id);
        this.getImgList();
      });
    },
    dealTreeList(res) {
      let result = res.data;
      this.treedata[0].children = [];
      for (let v of result) {
        const newChild = {
          id: v.orderId,
          label: v.typename,
          z_id: v.id,
          islock: v.islock
        };
        this.treedata[0].children.push(newChild);
      }
      this.treeList = result;
    },
    getCheckKeys(keys) {
      if (!keys.length) {
        keys = [0];
      }
      this.checkTreeNode = keys;
      this.getImgList();
    },
    // 获取自身的图片列表
    getImgList() {
      this.$http_token
        .get("/user/selfImg", {
          params: { checkedKeys: this.checkTreeNode }
        })
        .then(res => {
          let result = res.data;
          this.imgListResult = result;
          this.loading = false;
        });
    },
    deletePic(id) {
      this.imgListResult = this.imgListResult.filter(v => {
        return v.id !== id;
      });
    }
  },
  mounted() {
    this.getTreeList();
  }
};
</script>