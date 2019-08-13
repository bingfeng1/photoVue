<template>
  <article>
    <el-input placeholder="输入关键字进行过滤" v-model="filterText"></el-input>
    <el-tree
      class="filter-tree"
      :data="data"
      show-checkbox
      :props="defaultProps"
      default-expand-all
      :filter-node-method="filterNode"
      :expand-on-click-node="false"
      ref="tree"
    >
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <span>{{ node.label }}</span>
        <span v-if="data.id == 0">
          <el-input
            size="mini"
            placeholder="请输入内容"
            ref="addInput"
            v-show="isadd"
            v-model="addInput"
          ></el-input>
          <el-button
            class="success"
            v-show="isadd"
            type="text"
            size="mini"
            icon="el-icon-circle-check"
            @click="() => add()"
          ></el-button>
          <el-button
            v-show="!isadd"
            type="text"
            size="mini"
            icon="el-icon-circle-plus-outline"
            @click="() => showInput()"
          ></el-button>
          <el-button
            v-show="!isadd"
            type="text"
            size="mini"
            icon="el-icon-remove-outline"
            @click="() => cut()"
          ></el-button>
        </span>
      </span>
    </el-tree>
  </article>
</template>

<script>
export default {
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    }
  },

  methods: {
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    // 点击显示输入框
    showInput() {
      this.isadd = true;
      this.$nextTick(() => {
        this.$refs.addInput.focus();
      });
    },
    add() {
      if (this.addInput) {
        let data = this.data[0];
        let maxId = 0;
        for (let i of this.data[0].children) {
          maxId = maxId < i.id ? i.id : maxId;
        }

        // 入库操作
        let params = {
          account: this.$store.state.userInfo.account,
          typename: this.addInput,
          orderId: ++maxId
        };
        this.$http.post("/user/addImgType", params).then(res => {
          this.makeTreeList(res);
          //   这里还需要判断，是否已存在这个标签，目前暂无此功能
          this.isadd = false;
          this.addInput = "";
          this.$message({
            showClose: true,
            message: "添加目录成功",
            type: "success"
          });
        });
      } else {
        this.$message({
          showClose: true,
          message: "请输入内容",
          type: "warning"
        });
      }
    },

    cut() {
      let childNodes = this.$refs.tree.getCheckedNodes();
      for (let i in childNodes) {
        let id = childNodes[i].id;
        if (id == -1) {
          break;
        }
        this.$http
          .delete("/user/deleteImgType", {
            params: {
              orderId: id
            },
            data: {
              account: this.$store.state.userInfo.account
            }
          })
          .then(res => {
            this.makeTreeList(res);
          });
      }
    },

    makeTreeList(res) {
      let result = res.data;
      this.data[0].children.length = 0;
      for (let v of result) {
        const newChild = { id: v.orderId, label: v.typename };
        this.data[0].children.push(newChild);
      }
    }
  },

  data() {
    return {
      filterText: "", // 树形过滤
      addInput: "", // 增加树形数据
      isadd: false, //切换是否显示输入框
      // 树形结构的内容
      data: [
        {
          id: 0,
          label: "全部",
          children: []
        }
      ],
      defaultProps: {
        children: "children",
        label: "label"
      }
    };
  },

  // 进入时，根据存放的account获取用户信息
  mounted() {
    this.$http
      .get("/user/imgType", {
        params: {
          account: this.$store.state.userInfo.account
        }
      })
      .then(res => {
        this.makeTreeList(res);
      });
  }
};
</script>

<style lang="scss" scoped>
article {
  display: block;
  height: 90vh;
  padding: 5vh 10px;
  .el-input {
    width: 100%;
  }
  .el-tree {
    margin-top: 20px;
  }
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding: 0 8px;
    .el-input {
      width: 150px;
      margin-right: 10px;
    }
    .success {
      color: #67c23a;
    }
  }
}
</style>