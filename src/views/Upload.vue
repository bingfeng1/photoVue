<template>
  <el-container>
    <el-aside>
      <Tree @setTreeList="getTreeList"></Tree>
    </el-aside>
    <el-container>
      <el-main>
        <Statistics :treeList="treeList">
        </Statistics>
        <div>图片墙</div>
      </el-main>
    </el-container>
  </el-container>
</template>


<script>
import Tree from "@/components/upload/Tree.vue";
import Statistics from "@/components/upload/Statistics.vue";

export default {
  components: {
    Tree,
    Statistics
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