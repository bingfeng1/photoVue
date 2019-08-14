<template>
  <section>
    <el-row>
      <el-col :span="24" style="textAlign:left">
        <span>上传的相册：</span>
        <el-select v-model="value" placeholder="请选择">
          <el-option v-for="item in type" :key="item.id" :label="item.typename" :value="item.id"></el-option>
        </el-select>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-upload
          action
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :auto-upload="false"
          multiple
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible" append-to-body>
          <img width="100%" :src="dialogImageUrl" alt />
        </el-dialog>
      </el-col>
    </el-row>
  </section>
</template>

<script>
export default {
  props: {
    treeList: Array
  },
  computed: {
    type() {
      return this.treeList;
    }
  },
  data() {
    return {
      value: "",
      dialogImageUrl: "",
      dialogVisible: false
    };
  },
  methods: {
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    }
  }
};
</script>