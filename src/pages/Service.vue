<template>
	<div class="service">
		<div class="title">
			<span class="title-icon"></span>
			<span class="t-title">客户服务</span>
		</div>
		<div class="content" v-html="htmlStr">
			<!-- <div class="item">
				<div class="c-title">数据库详询 <span class="line"></span></div>
				<p>联系人：莫朝福</p>
				<p>联系电话：0773-212 0735</p>
				<p>电子邮箱：mcf@bbtpress.com</p>
				<p>所在部门：融合发展中心</p>
				<p>联系地址：广西桂林七星区五里店路9号出版大厦</p>
			</div>
			<div class="item">
				<div class="c-title">纸质图书详询 <span class="line"></span></div>
				<p>联系人：罗凯之</p>
				<p>联系电话：0773-228 2388</p>
				<p>电子邮箱：lkz@bbtpress.com</p>
				<p>所在部门：图书发行中心</p>
				<p>联系地址：广西桂林七星区五里店路9号出版大厦</p>
			</div> -->
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				htmlStr: ''
			}
		},
		methods:{
			getData(){
				let data = {
					Action: "SearchBlurEnabled",
					Resource: "CommonInfo",
					DataJSONString: JSON.stringify({ 'CommonInfoType': 1 }),
					PageControl: {
						PageSize: 0,
						PageIndex: 1,
						OrderBy: "DisplayIndex DESC, PubDate DESC, ID DESC"
					}
				}
				this.$.post('/api/Table/TableAction', data)
					.then((res) => {
						// console.log(JSON.parse(res.data))
						let dataArr = JSON.parse(res.data).Rows;
						for(let i = 0; i < dataArr.length; i++){
							if(dataArr[i].Name === "客户服务"){
								this.htmlStr = dataArr[i].Content
								break;
							}
						}
					})
					.catch((err) => {
						console.log(err)
					})
			}
		},
		mounted(){
			this.getData()
		}
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	.service {
		box-sizing: border-box;
		padding: 5px;
		width: 1200px;
		margin: 0 auto;
		background-color: #FFFFFF;
	}

	.service .title {
		box-sizing: border-box;
		height: 65px;
		width: 100%;
		padding: 0 20px 0 30px;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		border-bottom: 1px solid #e8e4df;
	}

	.service .title .t-title {
		font-family: MicrosoftYaHei;
		font-size: 18px;
		color: #805b3d;
	}

	.service .title-icon {
		display: inline-block;
		width: 21px;
		height: 21px;
		margin-right: 10px;
		background: url(../../static/images/users.png) no-repeat center;
	}
	.content{
		width: 100%;
		height: calc(100vh - 100px - 152px);
		display: flex;
		justify-content: space-around;
		align-items: flex-start;
	}
	/deep/.content .item{
		margin-top: 55px;
		width: 340px;
		height: 179px;
		font-family: MicrosoftYaHei;
		font-size: 14px;
		color: #666666;
	}
	/deep/.content .item .c-title{
		position: relative;
		margin-bottom: 20px;
		font-family: MicrosoftYaHei-Bold;
		font-size: 16px;
		color: #906440;
	}
	/deep/.content .item .c-title .line{
		position: absolute;
		left: 10px;
		bottom: -5px;
		width: 50px;
		height: 2px;
		background-color: #ddb7a3;
	}
	/deep/.content .item>p{
		margin-left: 37px;
	}
</style>
