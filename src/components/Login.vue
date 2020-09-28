<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像区域 -->
      <div class="avatar_box">
        <img src="../assets/logo2.png" alt="" />
      </div>
      <!-- 登录表单区域开始 -->
      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginFormRules"
        label-width="0px"
        class="login_form"
      >
        <!-- 用户名 -->
        <el-form-item prop="userName">
          <el-input
            v-model="loginForm.userName"
            prefix-icon="iconfont icon-user"
            clearable
          ></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            prefix-icon="iconfont icon-3702mima"
            type="password"
            show-password
            clearable
          ></el-input>
        </el-form-item>
        <!-- 按钮区域 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="success" @click="dialogFormVisible = true"
            >修改密码</el-button
          >
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 登录表单区域结束 -->

    <!-- 修改密码表单区域开始 -->
    <el-dialog title="修改密码" :visible.sync="dialogFormVisible">
      <el-form :model="changeForm" :rules="rules" ref="changeForm">
        <el-form-item
          label="用户名"
          :label-width="formLabelWidth"
          prop="userName"
        >
          <el-input
            v-model="changeForm.userName"
            autocomplete="off"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item
          label="旧密码"
          :label-width="formLabelWidth"
          prop="oldPwd"
        >
          <el-input
            v-model="changeForm.oldPwd"
            autocomplete="off"
            type="password"
            show-password
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item
          label="新密码"
          :label-width="formLabelWidth"
          prop="password"
        >
          <el-input
            v-model="changeForm.password"
            autocomplete="off"
            type="password"
            show-password
            clearable
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('changeForm')"
          >提 交</el-button
        >
      </div>
    </el-dialog>
    <!-- 修改密码表单区域结束 -->
  </div>
</template>

<script>
//引入md5加密
import md5 from "js-md5";
export default {
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入旧密码"));
      } else {
        if (this.changeForm.password !== "") {
          this.$refs.changeForm.validateField("password");
        }
        callback();
      }
    };

    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入新密码"));
      } else if (value == this.changeForm.oldPwd) {
        callback(new Error("新密码不能和旧密码一致!"));
      } else {
        callback();
      }
    };

    return {
      //这是登录表单的数据绑定对象
      loginForm: {
        userName: "admin",
        password: "hyy13459953101",
      },
      // 这是表单的验证规则对象
      loginFormRules: {
        // 验证用户名是否合法
        userName: [
          { required: true, message: "请输入登录名称", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur",
          },
        ],
        // 验证密码是否合法
        password: [
          { required: true, message: "请输入登录密码", trigger: "blur" },
          {
            min: 6,
            max: 15,
            message: "长度在 6 到 15 个字符",
            trigger: "blur",
          },
        ],
      },

      dialogFormVisible: false,
      //修改密码数据
      changeForm: {
        userName: "",
        oldPwd: "",
        password: "",
      },
      rules: {
        // 验证用户名是否合法
        userName: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur",
          },
        ],
        oldPwd: [{ required: true, validator: validatePass, trigger: "blur" }],
        password: [
          { required: true, validator: validatePass2, trigger: "blur" },
        ],
      },
      formLabelWidth: "120px",
    };
  },
  methods: {
    // 点击重置按钮，重置登录表单
    resetLoginForm() {
      console.log(this);
      this.$refs.loginFormRef.resetFields();
    },

    //点击登录按钮登录
    login() {
      let userInfo = this.loginForm;
      this.$refs.loginFormRef.validate((valid) => {
        //如果验证不通过，则不发起登录请求
        if (!valid) return;
        //验证通过，拷贝一份登录数据
        let info = Object.assign({}, userInfo);
        //对密码进行md5加密
        info.password = md5(info.password);
        this.axios({
          method: "POST",
          url: "/login",
          data: info,
        })
          .then((res) => {
            //请求成功
            if (res.data.code == 200) {
              console.log('登录返回的数据',res)
              this.$message.success("登录成功");
              //将登录成功之后的 token，保存到客户端的 sessionStorage 中
              window.sessionStorage.setItem("token", res.data.token);
              this.$router.push("/home");
            } else {
              this.$message.error("登录失败！");
            }
          })
          .catch((err) => {
            console.log("err", err);
          });
      });
    },

    //提交修改密码
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        //如果表单验证通过
        if (valid) {
          //请求登录,通过返回状态码确认是否存在当前账号
          let userInfo = {
            userName: this.changeForm.userName,
            password: this.changeForm.oldPwd,
          };
          //拷贝一份数据
          let info = Object.assign({}, userInfo);
          //对密码进行md5加密
          info.password = md5(info.password);
          this.axios({
            method: "POST",
            url: "/login",
            data: info,
          })
            .then((res) => {
              //请求成功
              if (res.data.code == 200) {
                // this.$message.success("当前账号可以修改密码");
                let changeInfo = this.changeForm;
                let info = Object.assign({}, changeInfo);
                //对密码进行md5加密
                info.oldPwd = md5(info.oldPwd);
                info.password = md5(info.password);
                console.log("修改密码", info);
                this.axios({
                  method: "POST",
                  url: "/sysUser/updatePwd",
                  data: info,
                })
                  .then((res) => {
                    //请求成功
                    if (res.data.code == 200) {
                      this.$message.success("修改密码成功");
                      this.dialogFormVisible = false
                    } else {
                      this.$message.error("修改密码失败！");
                    }
                  })
                  .catch((err) => {
                    console.log("err", err);
                  });
              } else {
                this.$message.error("账号或密码错误,修改失败");
              }
            })
            .catch((err) => {
              console.log("err", err);
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
.login_container {
  background-color: #2b4b6b;
  height: 100%;
}

.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);

  .avatar_box {
    height: 130px;
    width: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }
}

.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}

.btns {
  display: flex;
  justify-content: flex-end;
}
</style>
