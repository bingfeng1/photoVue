<template>
  <el-container>
    <el-aside>
      <Tree @setTreeList="getTreeList"></Tree>
    </el-aside>
    <el-container>
      <el-main>
        <Statistics>
          <template #right>
            <ToUpload :treeList="treeList"></ToUpload>
          </template>
        </Statistics>
        <div>图片墙</div>
      </el-main>
    </el-container>
  </el-container>
</template>


<script>
import Tree from "@/components/upload/Tree.vue";
import Statistics from "@/components/upload/Statistics.vue";
import ToUpload from "@/components/upload/ToUpload.vue";


export default {
  components: {
    Tree,
    Statistics,
    ToUpload
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