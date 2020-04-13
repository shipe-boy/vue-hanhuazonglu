<template>
	<div class="login">
		<div class="title">
			<span class="t-title">修改密码</span>
			<span class="t-more" style="cursor: pointer;" @click="back">返回</span>
		</div>
		<div class="content">
			<el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
				<el-form-item label="手机号码" prop="phone">
					<el-input type="text" v-model="ruleForm.phone" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="验证码" prop="code">
					<el-input type="text" v-model="ruleForm.code" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="新密码" prop="newPwd">
					<el-input type="password" v-model="ruleForm.newPwd" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="确认新密码" prop="checkPwd">
					<el-input type="password" v-model="ruleForm.checkPwd" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="submitForm('ruleForm')">确认修改</el-button>
				</el-form-item>
			</el-form>
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			var checkPhone = (rule, value, callback) => {
				if (!value.trim()) {
					return callback(new Error('手机号不能为空'));
				}
				var reg = /^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/g;
				if (reg.test(value.trim())) {
					callback();
				} else {
					callback(new Error('请输入正确的手机号'));
				}
			};
			var validatePass = (rule, value, callback) => {
				if (value.trim() === '') {
					callback(new Error('请输入密码'));
				} else {
					callback();
				}
			};
			var validatePass2 = (rule, value, callback) => {
				if (value.trim() === '') {
					callback(new Error('请再次输入密码'));
				} else if (value !== this.ruleForm.newPwd) {
					callback(new Error('两次输入密码不一致!'));
				} else {
					callback();
				}
			};
			var checkCode = (rule, value, callback) => {
				if (value.trim() === '') {
					callback(new Error('请输入验证码'));
				} else {
					callback();
				}
			}
			return {
				ruleForm: { //修改密码
					phone: '',
					code: '',
					newPwd: '',
					checkPwd: ''
				},
				rules: {
					phone: [{
						validator: checkPhone,
						required: true,
						trigger: 'blur'
					}],
					code: [{
						validator: checkCode,
						required: true,
						required: true
					}],
					newPwd: [{
						validator: validatePass,
						required: true,
						trigger: 'blur'
					}],
					checkPwd: [{
						validator: validatePass2,
						required: true,
						trigger: 'blur'
					}]
				},
			}
		},
		methods: {
			submitForm(formName) {
				this.$refs[formName].validate((valid) => {
					if (valid) {
						this.getChangePwd()

					} else {
						alert('error submit!!');
						return false;
					}
				});
			},
			getChangePwd() {
				let data = {
					Device: "device",
					RememberLogin: 2
				};
				data.UserID = this.ruleForm.phone;
				data.Password = sha512(this.ruleForm.newPwd);
				data.AuthCode = this.ruleForm.code;
				data.EMail = this.$route.query.email;
				data.AuthCodeReceiver = data.EMail;
				// data.EMail
				// console.log(data)
				this.$.post('/api/User/ResetMyPassword', data)
					.then((res) => {
						if (res.statusText === "OK") {
							this.getLogin()
						}
					})
					.catch((err) => {
						alert('验证码不正确！')
						console.log(err)
					})
			},
			back() {
				this.$router.push({
					path: '/login'
				})
			},
			getLogin() {
				let data = {
					Device: "device",
					RememberLogin: 2
				};
				// console.log(sha512(this.ruleForm.pass))
				// RememberLogin 记住登录状态(1 不记住（无session，仅仅使用一次），2 不记住（当前session下有效，关闭浏览器即失效），3 记住（使用Cookie，使用Web.Config中Cookie有效期），4 使用Cookie，记住（永久Cookie）)
				data.RememberLogin = 2
				data.UserID = this.ruleForm.phone;
				data.Password = sha512(this.ruleForm.newPwd);
				this.$.post('/api/User/Login', data)
					.then((res) => {
						if (res.statusText === "OK") {
							this.checkedLogin()
						}
					})
					.catch((err) => {
						alert('用户名或密码错误！')
					})
			},
			checkedLogin() {
				this.$.post('/api/User/GetMyInfo')
					.then((res) => {
						// console.log(res, JSON.parse(res.data))
						let name = JSON.parse(res.data).Name
						this.$store.commit('userName', name)
						
						this.$router.go(-1)
					})
					.catch((err) => {
						alert('用户名或密码错误！')
					})
			}
		},
		beforeRouteLeave(to, from, next){
			if(this.$store.state.username && (to.path == '/login' || to.path == '/register')){
				next('/')
			}else{
				next()
			}
			
		}
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	.login {
		box-sizing: border-box;
		width: 1200px;
		min-height: 600px;
		padding: 5px;
		margin: auto;
		background-color: #fff;
	}

	.login .title {
		box-sizing: border-box;
		height: 65px;
		width: 100%;
		padding: 0 20px 0 30px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-bottom: 1px solid #e8e4df;
	}

	.login .title .t-title {
		font-family: MicrosoftYaHei;
		font-size: 18px;
		color: #805b3d;
	}
	.login .content {
		width: 480px;
		margin: auto;
		margin-top: 45px;
	}
</style>
