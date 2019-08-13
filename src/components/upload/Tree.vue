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
        <span>
          {{ node.label }}
        </span>
        <span v-show="data.id == 1">
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
        if (!data.children) {
          this.$set(data, "children", []);
        }
        let maxId = 0;
        for (let i of this.data[0].children) {
          maxId = maxId < i.id ? i.id : maxId;
        }
        const newChild = { id: maxId, label: this.addInput };
        data.children.push(newChild);
        //   这里还需要判断，是否已存在这个标签，目前暂无此功能
        this.isadd = false;
        this.addInput = "";
        this.$message({
          showClose: true,
          message: "添加目录成功",
          type: "success"
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
        const index = this.data[0].children.findIndex(d => d.id === id);
        this.data[0].children.splice(index, 1);
      }
    }
  },

  data() {
    return {
      filterText: "",
      addInput: "",
      isadd: false,
      data: [
        {
          id: 1,
          label: "全部"
        }
      ],
      defaultProps: {
        children: "children",
        label: "label"
      }
    };
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
  .el-tree{
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