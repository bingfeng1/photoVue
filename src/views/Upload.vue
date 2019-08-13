<template>
  <el-container>
    <el-aside>
        <Tree>

        </Tree>
    </el-aside>
    <el-container>
      <el-header>上传按钮/可拖拽上传</el-header>
      <el-main>图片墙</el-main>
    </el-container>
  </el-container>
</template>


<script>
import Tree from '@/components/upload/Tree.vue'
export default {
    components:{
        Tree
    }
}
</script>