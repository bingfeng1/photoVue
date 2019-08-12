<template>
  <!-- 登录界面 -->
  <article>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>用户登录</span>
      </div>
      <el-form :model="form" status-icon :rules="rules" ref="form" label-width="50px">
        <el-form-item label="账号" prop="account">
          <el-input v-model="form.account"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="form.pass" :show-password="true" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm('form')">提交</el-button>
          <el-button @click="resetForm('form')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </article>
</template>

<script>
export default {
  data() {
    // 验证条件判断
    var checkAccount = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("账号不能为空"));
      } else {
        callback();
      }
    };
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.ruleForm.checkPass !== "") {
          this.$refs.ruleForm.validateField("checkPass");
        }
        callback();
      }
    };
    return {
      form: {
        pass: "",
        account: ""
      },
      rules: {
        pass: [{ validator: validatePass, trigger: "blur" }],
        account: [{ validator: checkAccount, trigger: "blur" }]
      }
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // 数据库中验证，暂时不用数据库
          this.$http
            .post("/login", this.form)
            .then(res => {
              const result = res.data;
              if (result.imageBase64) {
                let userInfo = {
                  account : this.form.account,
                  base64 : result.imageBase64,
                  type : result.imageType,
                  nickname : result.nickname
                }
                window.sessionStorage.setItem(
                  "userInfo",
                  JSON.stringify(userInfo)
                );
                this.$message({
                  message: "登陆成功",
                  type: "success"
                });
                this.$router.push("/");
              } else {
                this.$message.error("账号或者密码错误");
              }
            })
            .catch(err => {
              throw new Error("验证用户登录信息出错，错误原因：" + err);
            });
        } else {
          // console.log('error submit!!');
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
};
</script>