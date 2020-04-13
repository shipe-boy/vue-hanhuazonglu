<template>
	<div class="header">
		<div :class="['nav-wrap', {'active': showBg}]">
			<div class="content">
				<a v-show="!showBg" class="logo" href="/"></a>
				<div class="login">
					<template v-if="uaseName">
						<span>{{uaseName}}</span>
						<span @click="loginOut">退出</span>
					</template>
					<template v-if="!uaseName">
						<a href="javascript:;" @click="toLogin">登录</a>
						<!-- <router-link to="/login">登录</router-link> -->
						<router-link to="/register">注册</router-link>
					</template>

				</div>
				<ul :class="['nav', {'active': showBg}]">
					<li v-for="(item, index) in navList" :key="index">
						<router-link :class="{'active': activeIndex == index}" :to="item.url">
							<span>{{item.name}}</span>
						</router-link>
					</li>
				</ul>
			</div>
		</div>
		<div v-show="!showBg" class="line"></div>
	</div>
</template>

<script>
	import common from './bus.js'
	export default {
		data() {
			return {
				navList: [{
						name: '首页',
						url: '/'
					},
					{
						name: '检索列表',
						url: '/searching'
					},
					{
						name: '汉画图库',
						url: '/gallery'
					},
					{
						name: '汉画简介',
						url: '/aboutme'
					},
					{
						name: '客户服务',
						url: '/service'
					}
				],
				// activeIndex: 2,
				showBg: true,
				once: true
			}
		},
		computed: {
			uaseName() {
				// console.log(this.$store.state.username)
				return this.$store.state.username;
			},
			activeIndex() {
				let path = this.$route.path.split('/')[1];
				let i = this.navList.findIndex((item) => {
					return '/' + path === item.url
				})
				return i
			}
		},
		watch: {
			$route() {
				if (this.$route.path === '/') {
					document.body.style = "background: url(../../static/images/index-bg.png) no-repeat center/cover;"
					this.showBg = true
				} else {
					document.body.style = "background: #f8f5f2;"
					this.showBg = false
				}
			}
		},
		methods: {
				checkedLogin() {
					this.$.post('/api/User/GetMyInfo')
						.then((res) => {
							// console.log(res, JSON.parse(res.data))
							let name = JSON.parse(res.data).Name
							this.$store.commit('userName', name)
						})
						.catch((err) => {
							// console.log(err)
						})
				},
				loginOut(){
					this.$.post('api/User/Logout')
						.then((res) => {
							// console.log(res, JSON.parse(res.data))
							this.$store.commit('userName', '')
							if(this.$route.path.indexOf('details') != -1){
								this.$router.push({
									path: '/'
								})
							}
							
						})
						.catch((err) => {
							console.log(err)
						})
				},
				toLogin(){
					common.$emit('update')
					this.$router.push({
						path: '/login'
					})
				}
			

		},
		mounted() {
			this.checkedLogin()
		}
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	.header {
		width: 100%;
		height: 152px;
	}

	.nav-wrap {
		height: 147px;
		background-image: url(../../static/images/header_bg.png);
		background-repeat: no-repeat;
		background-position: center;
		background-size: cover;
	}

	.nav-wrap.active {
		background-image: none;
	}

	.nav-wrap .content {
		box-sizing: border-box;
		width: 1200px;
		height: 100%;
		padding: 0 30px 0 40px;
		margin: auto;
	}

	.content .logo {
		display: inline-block;
		width: 428px;
		height: 45px;
		margin-top: 49px;
		margin-bottom: 12px;
		background: url(../../static/images/logo.png) no-repeat center;
	}

	.content .login {
		float: right;
		margin-top: 20px;
		font-family: MicrosoftYaHei;
		font-size: 14px;
	}

	.content .login>a {
		color: #8c613d;
		cursor: pointer;
	}
	.content .login>span:nth-child(2){
		color: #8c613d;
		cursor: pointer;
	}

	.content .login>a:nth-child(1) {
		margin-right: 30px;
	}

	.content .nav {
		float: right;
		width: 100%;
		display: flex;
		justify-content: flex-end;
		align-items: center;
	}

	.content .nav.active {
		width: auto;
		margin-top: 10px;
		margin-right: 38px;
	}

	.content .nav li {}

	.content .nav li>a {
		display: block;
		padding: 8px 20px;
		font-family: MicrosoftYaHei;
		font-size: 18px;
		color: #333333;
	}

	.content .nav li>a>span {
		position: relative;
		display: block;
		width: 100%;
		height: 100%;
	}

	.content .nav li>a.active>span:after {
		content: '';
		position: absolute;
		left: 0;
		bottom: -10px;
		width: 100%;
		height: 5px;
		background-color: #c10315;
	}

	.content .nav li:hover>a>span:after {
		content: '';
		position: absolute;
		left: 0;
		bottom: -10px;
		width: 100%;
		height: 5px;
		background-color: #c10315;
	}

	.line {
		height: 5px;
		background-color: #aa9c94;
	}
</style>
