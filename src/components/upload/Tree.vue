<template>
  <section id="tree">
    <el-input placeholder="输入关键字进行过滤" v-model="filterText"></el-input>
    <el-tree
      class="filter-tree"
      :data="data"
      :props="defaultProps"
      default-expand-all
      :filter-node-method="filterNode"
      :expand-on-click-node="false"
      show-checkbox
      ref="tree"
      @check="selectType"
      node-key="z_id"
    >
      <!-- 自定义tree内部样式 -->
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <!-- 这里是span具体内容，左边那一列 -->
        <span :ref="data.label">{{ node.label }}</span>
        <!-- 如果是第一条（全部） -->
        <span v-show="data.id == 0">
          <!-- 用于删除使用 -->
          <el-button
            v-show="!isadd"
            type="text"
            size="mini"
            @click="() => showcut()"
          >{{iscut|cutWord}}</el-button>
        </span>
        <span v-if="data.id == 0">
          <!-- 添加一级的输入框，默认隐藏 -->
          <el-input
            size="mini"
            placeholder="请输入内容"
            ref="addInput"
            v-show="isadd"
            v-model="addInput"
          ></el-input>
          <!-- 输入框的确认按钮 -->
          <el-button
            class="success"
            v-show="isadd"
            type="text"
            size="mini"
            icon="el-icon-circle-check"
            @click="() => add()"
          ></el-button>
          <!-- 用来显示输入框 -->
          <el-button
            v-show="!isadd"
            type="text"
            size="mini"
            icon="el-icon-circle-plus-outline"
            @click="() => showInput()"
          ></el-button>
        </span>
        <!-- 每一个子列使用修改按钮 -->
        <span v-else>
          <el-button
            class="error"
            v-show="iscut"
            type="text"
            size="mini"
            icon="el-icon-remove-outline"
            @click="() => cut(node,data)"
          ></el-button>
          <el-button type="text" size="mini" icon="el-icon-edit" @click="() => edit(node,data)"></el-button>
        </span>
      </span>
    </el-tree>
  </section>
</template>

<script>
export default {
  // 过滤筛选
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    }
  },

  filters: {
    cutWord(value) {
      return value ? "取消" : "删除";
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
    showcut() {
      this.iscut = !this.iscut;
    },

    add() {
      if (this.addInput) {
        let maxId = 0;
        for (let i of this.data[0].children) {
          maxId = maxId < i.id ? i.id : maxId;
        }

        // 入库操作
        let params = {
          typename: this.addInput,
          orderId: ++maxId
        };
        this.$http_token.post("/user/addImgType", params).then(res => {
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

    cut(node, data) {
      let id = data.z_id;
      this.$http_token
        .delete("/user/deleteImgType", {
          params: {
            id
          }
        })
        .then(res => {
          this.makeTreeList(res);
        });
    },

    edit(node, data) {
      let dom = this.$refs[data.label];
      dom.setAttribute("contenteditable", true);
      dom.focus();
    },

    axiosEdit(newChild) {
      let that = this;
      // 绑定修改事件
      this.$nextTick(() => {
        let dom = this.$refs[newChild.label];
        dom.addEventListener("blur", function() {
          this.setAttribute("contenteditable", false);
          if (this.innerText != newChild.label) {
            // 这里操作修改部分
            that.$http_token
              .put("/user/updateImgType", {
                id: newChild.z_id,
                typename: this.innerText
              })
              .then(res => {
                // 这里需要写入成功或者失败
                that.makeTreeList(res);
              });
          }
        });
      });
    },

    // 通过返回的值，重新画tree
    makeTreeList(res) {
      let result = res.data;
      this.data[0].children = [];
      for (let v of result) {
        const newChild = { id: v.orderId, label: v.typename, z_id: v.id };
        this.data[0].children.push(newChild);
        this.axiosEdit(newChild);
      }
      // 把结果抛出来，其他地方使用
      this.$emit("setTreeList", result);
    },
    // 获取选中的节点
    selectType(data, node) {
      let { checkedKeys } = node;
      this.$emit("hasCheck",checkedKeys)
    }
  },

  data() {
    return {
      filterText: "", // 树形过滤
      addInput: "", // 增加树形数据
      isadd: false, //切换是否显示输入框
      iscut: false, //展示删除框
      // 树形结构的内容
      data: [
        {
          id: 0,
          label: "全部",
          z_id:0,
          children: []
        }
      ],
      defaultProps: {
        children: "children",
        label: "label"
      }
    };
  },

  mounted() {
    // 进入时，根据存放的token获取用户信息
    this.$http_token.get("/user/imgType").then(res => {
      this.makeTreeList(res);
      // 默认使用一次点击全选
      this.$nextTick(()=>{
        this.$refs.tree.setChecked(0,true,true)
      })
    });
    // 树形的input框如果取消焦点，默认缩回去
    this.$refs.tree.$el.addEventListener("mouseleave", () => {
      this.isadd = false;
    });
  }
};
</script>

<style lang="scss" scoped>
section {
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
      min-width: 150px;
      margin-right: 10px;
    }
    .success {
      color: #67c23a;
    }
    .error {
      color: #f56c6c;
    }
  }
}
</style>