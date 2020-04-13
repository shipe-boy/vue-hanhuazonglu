<template>
	<div class="login">
		<div class="title">
			<span class="t-title">{{ isSearchPwd ? "忘记密码" :'账号登录'}}</span>
			<span v-show="!isSearchPwd" class="t-more">没有账号，去<router-link to="/register">注册>></router-link></span>
			<span class="t-more" style="cursor: pointer;" v-show="isSearchPwd" @click="back">返回</span>
		</div>
		<div v-show="!isSearchPwd" class="content">
			<el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="80px" class="demo-ruleForm">
				<el-form-item label="手机号码" prop="phone">
					<el-input type="text" v-model="ruleForm.phone" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="密码" prop="pass">
					<el-input type="password" v-model="ruleForm.pass" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item>
					<el-checkbox v-model="isRemberPwd" label="下次自动登录" name="type"></el-checkbox>
					<span class="pwd" @click="searchPwd">忘记密码？</span>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="submitForm('ruleForm', false)">登&nbsp;&nbsp;&nbsp;&nbsp;录</el-button>
				</el-form-item>
			</el-form>
		</div>
		<div v-show="isSearchPwd" class="content">
			<el-form :model="ruleForm1" status-icon :rules="rules1" ref="ruleForm1" label-width="80px" class="demo-ruleForm">
				<el-form-item label="手机号码" prop="phone">
					<el-input type="text" v-model="ruleForm1.phone" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="电子邮箱" prop="email">
					<el-input type="text" v-model="ruleForm1.email" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" :disabled="timeLoading" @click="submitForm('ruleForm1', true)">发送邮件{{timing == 60 || timing <= 0 ? '' : '('+timing+')'}}</el-button>
				</el-form-item>
			</el-form>
		</div>
	</div>
</template>

<script>
	import common from '../components/bus.js'
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
			var checkEmail = (rule, value, callback) => {
				if (!value.trim()) {
					return callback(new Error('邮箱不能为空'));
				}
				var reg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/g;
				if (reg.test(value.trim())) {
					callback();
				} else {
					callback(new Error('请输入正确的邮箱'));
				}
			}
			return {
				ruleForm: { //登录
					phone: '',
					pass: ''
				},
				ruleForm1: { //找回密码
					phone: '',
					email: ''
				},
				rules: {
					phone: [{
						validator: checkPhone,
						trigger: 'blur'
					}],
					pass: [{
						validator: validatePass,
						trigger: 'blur'
					}]
				},
				rules1: {
					phone: [{
						validator: checkPhone,
						trigger: 'blur',
						required: true
					}],
					email: [{
						validator: checkEmail,
						trigger: 'blur',
						required: true
					}]
				},
				isRemberPwd: false,
				isSearchPwd: false,
				timeLoading: false,
				timing: 60
			}
		},
		methods: {
			submitForm(formName, isSearchPwd) {
				this.$refs[formName].validate((valid) => {
					if (valid) {
						if (isSearchPwd) { //找回密码
							if(this.timeLoading) return
							this.getCode()	//获取验证码
							this.timeLoading = true
							this.timer = setInterval(() => {
								
								this.timing -= 1
								if(this.timing <= 0){
									clearInterval(this.timer)
									this.timing = 60
									this.timeLoading = false
									this.timer = null;
								}
							}, 1000)
							
						} else { //登录
							this.getLogin()
						}

					} else {
						alert('error submit!!');
						return false;
					}
				});
			},
			getCode(){
				let data = {
					UserID: this.ruleForm1.phone,
					AuthCodeReceiver: this.ruleForm1.email
					// EMail: this.ruleForm1.email
				}
				this.$.post('/api/User/SendRecoverMyPasswordAuthCode',data)
					.then((res) => {
						//成功
						this.$router.push({
							path: '/emailsCode',
							query:{
								email: this.ruleForm1.email
							}
						})
						// console.log(res)
						
					})
					.catch((err) => {
						alert('发送邮件失败。请稍后！')
						clearInterval(this.timer)
						this.timing = 60
						this.timeLoading = false
						this.timer = null;
						console.log(err)
					})
			},
			searchPwd() {
				this.isSearchPwd = true
			},
			back() {
				this.isSearchPwd = false

			},
			getLogin() {
				let data = {
					Device: "device",
					RememberLogin: 2
				};
				// console.log(sha512(this.ruleForm.pass))
				// RememberLogin 记住登录状态(1 不记住（无session，仅仅使用一次），2 不记住（当前session下有效，关闭浏览器即失效），3 记住（使用Cookie，使用Web.Config中Cookie有效期），4 使用Cookie，记住（永久Cookie）)
				data.RememberLogin = this.isRemberPwd ? 3 : 2
				data.UserID = this.ruleForm.phone;
				data.Password = sha512(this.ruleForm.pass);
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
			},
			load(){
				if(this.isSearchPwd){
					this.isSearchPwd = false;
				}
			}
		},
		mounted() {
			common.$on('update', this.load)
		},
		beforeRouteLeave(to, from, next){
			if(this.$store.state.username && (to.path == '/register' || to.path == '/emailsCode')){
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
		height: calc(100vh - 100px - 152px);
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

	.login .title .t-more {
		font-family: MicrosoftYaHei;
		font-size: 14px;
		color: #805b3d;
	}

	.login .title .t-more>a {
		color: #c10315;
	}

	.login .content {
		width: 480px;
		margin: auto;
		margin-top: 45px;
	}

	.content .pwd {
		float: right;
		font-family: MicrosoftYaHei;
		font-size: 14px;
		color: #666666;
		cursor: pointer;
	}

	.content .pwd:hover {
		color: #805b3d;
	}
</style>
