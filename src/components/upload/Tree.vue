<template>
  <section id="tree">
    <el-input placeholder="输入关键字进行过滤" v-model="filterText"></el-input>
    <el-tree
      class="filter-tree"
      :data="treedata"
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
          <el-button v-show="!isadd" type="text" @click="() => showcut()">{{iscut|cutWord}}</el-button>
        </span>
        <span v-if="data.id == 0">
          <!-- 添加一级的输入框，默认隐藏 -->
          <el-input placeholder="请输入内容" ref="addInput" v-show="isadd" v-model="addInput"></el-input>
          <!-- 输入框的确认按钮 -->
          <el-button
            class="success"
            v-show="isadd"
            type="text"
            icon="el-icon-circle-check"
            @click="() => add()"
          ></el-button>
          <!-- 用来显示输入框 -->
          <el-button
            v-show="!isadd"
            type="text"
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
            icon="el-icon-remove-outline"
            @click="() => cut(node,data)"
          ></el-button>
          <el-button
            type="text"
            :icon="data.islock?'el-icon-lock':'el-icon-unlock'"
            @click="() => lock(node,data)"
            :class="data.islock|locked"
          ></el-button>
          <el-button type="text" icon="el-icon-edit" @click="() => edit(node,data)"></el-button>
        </span>
      </span>
    </el-tree>
  </section>
</template>

<script>
// 所有修改都提交至父组件，因为其他组件也需要树形结构的值，需要抛出来
// 原来做法是直接在组件内抛出，但在后台传参查询的时候发生一定的问题
export default {
  props: {
    treedata: {
      type: Array
    },
    defaultProps: Object
  },
  // 过滤筛选
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    },
    // 父组件的数据改变时，修改属性列表
    treedata: {
      handler(val) {
        this.hasChange(val[0].children);
      },
      // 对象内部变化时监听
      deep: true
    }
  },

  filters: {
    cutWord(value) {
      return value ? "取消" : "删除";
    },
    locked(value) {
      return value ? "error" : "success";
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
    // 切换删除按钮
    showcut() {
      this.iscut = !this.iscut;
    },
    // 增加按钮
    add() {
      if (this.addInput) {
        let maxId = 0;
        for (let i of this.treedata[0].children) {
          maxId = maxId < i.id ? i.id : maxId;
        }

        // 入库操作
        let params = {
          typename: this.addInput,
          orderId: ++maxId
        };
        this.$http_token.post("/user/addImgType", params).then(res => {
          // 往父组件推送
          this.$emit("changeTreedata", res);
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
          let result = res;
          if (result.data == "未清空") {
            this.$message({
              showClose: true,
              message: "该相册下依然有图片，请清空相册再做删除操作",
              type: "warning"
            });
            return;
          }
          this.$emit("changeTreedata", res);
        });
    },

    edit(node, data) {
      let dom = this.$refs[data.label];
      dom.setAttribute("contenteditable", true);
      dom.focus();
    },

    // 是否设为私有相册，（这个应该不需要传值，直接返回，判断是否成功即可）
    lock(node, data) {
      let id = data.z_id;
      this.$http_token
        .put("/user/islock", {
          id,
          islock: !data.islock
        })
        .then(res => {
          let result = res;
          if (result.data == "success") {
            data.islock = !data.islock;
            this.$message({
              showClose: true,
              message: "成功改变设置",
              type: "success"
            });
          }
        });
    },

    // 每次重新渲染时的操作
    hasChange(newChild) {
      if (newChild) {
        let that = this;
        // 绑定修改事件
        this.$nextTick(() => {
          for (let v of newChild) {
            let dom = this.$refs[v.label];
            dom.addEventListener("blur", function() {
              this.setAttribute("contenteditable", false);
              if (this.innerText != v.label) {
                // 这里操作修改部分
                that.$http_token
                  .put("/user/updateImgType", {
                    id: v.z_id,
                    typename: this.innerText
                  })
                  .then(res => {
                    // 这里需要写入成功或者失败
                    that.$emit("changeTreedata", res);
                  });
              }
            });
          }
          // 如果是第一次进入watch，那么就让tree全选（放在ceated和mounted都不行，因为列表是异步的）
          if (this.firstWatch) {
            this.firstWatch = false;
            this.$refs.tree.setChecked(0, true, true);
            this.checkedKeys = this.treedata.map(v=>v.z_id)
          } else {
            this.$refs.tree.setCheckedKeys(this.checkedKeys);
          }
        });
      }
    },
    // 获取选中的节点
    selectType(data, node) {
      let { checkedKeys } = node;
      this.checkedKeys = checkedKeys;
      this.$emit("hasCheck", checkedKeys);
    }
  },

  data() {
    return {
      filterText: "", // 树形过滤
      addInput: "", // 增加树形数据
      isadd: false, //切换是否显示输入框
      iscut: false, //展示删除框
      checkedKeys: [],
      firstWatch: true
    };
  },

  mounted() {
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
  padding: 5px 10px;
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
    .el-button{
      padding-top: 0px;
      padding-bottom: 0px;
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