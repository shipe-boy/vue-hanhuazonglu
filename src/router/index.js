import Vue from 'vue'
import Router from 'vue-router'

const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

const Index = () => import('../pages/Index')	//首页
const Login = () => import('../pages/Login')	//登录
const Register = () => import('../pages/Register')	//注册
const Gallery = () => import('../pages/Gallery')	//汉画图库
const Searching = () => import('../pages/Searching') //检索列表 
const AboutMe = () => import('../pages/AboutMe')	//关于我们
const Service = () => import('../pages/Service') 		//客服服务
const Details = () => import('../pages/Details')	//详情页
const EmailsCode = () => import('../pages/ChangePwd')	//修改密码页


Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'Index',
      component: Index
    },
	{
		path: '/login',
		name: 'Login',
		component: Login
	},
	{
		path: '/register',
		name: 'Register',
		component: Register
	},
	{
		path: '/gallery',
		name: 'Gallery',
		component: Gallery
	},
	{
		path: '/searching',
		name: 'Searching',
		component: Searching
	},
	{
		path: '/aboutme',
		name: 'AboutMe',
		component: AboutMe
	},
	{
		path: '/service',
		name: 'Service',
		component: Service
	},
	{
		path: '/details/:id',
		name: 'Details',
		component: Details
	},
	{
		path: '/emailsCode',
		name: 'EmailsCode',
		component: EmailsCode,
		// beforeEnter: (to, from, next) => {
		// 	if(from.path !== '/login'){
		// 		next('/')
		// 	}
		// 	next()
		// }
	}
  ]
})


router.onError((error) => {
	const pattern = /Loading chunk (\d)+ failed/g;
	const isChunkLoadFailed = error.message.match(pattern);
	const targetPath = router.history.pending.fullPath;
	if (isChunkLoadFailed) {
		router.replace(targetPath);
	}
});


export default router
