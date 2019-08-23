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
            <ImgBotton :img="img">
              <div>{{img.originalname}}</div>
              <el-tooltip class="item" effect="light" content="重命名" placement="bottom">
                <i class="el-icon-edit" @click="showDialog(img)"></i>
              </el-tooltip>

              <el-tooltip class="item" effect="light" content="删除图片" placement="bottom">
                <i class="el-icon-delete" @click="deletePic(img)"></i>
              </el-tooltip>
              <Download :img="img"></Download>
            </ImgBotton>
          </template>
        </ImgList>
      </el-main>
    </el-container>
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
  </el-container>
</template>


<script>
import Tree from "@/components/upload/Tree.vue";
import Statistics from "@/components/upload/Statistics.vue";
import ToUpload from "@/components/upload/ToUpload.vue";
import ImgList from "@/components/common/ImgList.vue";
import ImgBotton from "@/components/common/ImgBotton.vue";
import Download from "@/components/common/Download.vue";

export default {
  components: {
    Tree,
    Statistics,
    ToUpload,
    ImgList,
    ImgBotton,
    Download
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
      checkTreeNode: [],
      showUpdate: false,
      form: {
        id: "",
        originalname: ""
      },
      renameImg: {}
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
      this.renameImg = img;
    },
    rename() {
      // 这里操作修改部分
      this.$http_token.put("/user/updateImgName", this.form).then(res => {
        // 这里需要写入成功或者失败
        let result = res.data;
        if (result.affectedRows == 1) {
          this.renameImg.originalname = this.form.originalname;
          this.showUpdate = false;
        } else {
          alert("修改失败或者修改数量过多");
        }
      });
    }
  },
  mounted() {
    this.getTreeList();
  }
};
</script>