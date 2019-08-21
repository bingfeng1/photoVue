<template>
  <el-container id="upload">
    <el-aside>
      <router-link to="/">
        <Logo></Logo>
      </router-link>
      <!-- 左侧树形列表 -->
      <Tree
        :treedata="treedata"
        :defaultProps="defaultProps"
        @hasCheck="getCheckKeys"
        @changeTreedata="dealTreeList"
      ></Tree>
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
              <ImgBotton :img="img"></ImgBotton>
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
import ImgBotton from "@/components/upload/ImgBotton.vue";
import Logo from "@/components/common/Logo.vue";

export default {
  components: {
    Tree,
    Statistics,
    ToUpload,
    ImgList,
    ImgBotton,
    Logo
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
        const newChild = { id: v.orderId, label: v.typename, z_id: v.id };
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
    }
  },
  mounted() {
    this.getTreeList();
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