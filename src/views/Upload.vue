<template>
  <el-container>
    <el-aside>
      <Tree @setTreeList="getTreeList"></Tree>
    </el-aside>
    <el-container>
      <el-main>
        <Statistics>
          <!-- 将treeList传入照片选择区域 -->
          <UploadChoose :treeList="treeList"></UploadChoose>
        </Statistics>
        <div>图片墙</div>
      </el-main>
    </el-container>
  </el-container>
</template>


<script>
import Tree from "@/components/upload/Tree.vue";
import Statistics from "@/components/upload/Statistics.vue";
import UploadChoose from "@/components/upload/UploadChoose.vue";

export default {
  components: {
    Tree,
    Statistics,
    UploadChoose
  },

  data() {
    return {
      treeList: []
    };
  },

  methods: {
    getTreeList(result) {
      this.treeList = result;
    }
  }
};
</script>