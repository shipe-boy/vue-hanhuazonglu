<template>
	<div class="about">
		<div class="title">
			<span class="title-icon"></span>
			<span class="t-title">汉画简介</span>
		</div>
		<div class="content" v-html="htmlStr">
			
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
						PageIndex: 0,
						OrderBy: "DisplayIndex DESC, PubDate DESC, ID DESC"
					}
				}
				this.$.post('/api/Table/TableAction', data)
					.then((res) => {
						// console.log(JSON.parse(res.data))
						let dataArr = JSON.parse(res.data).Rows;
						for(let i = 0; i < dataArr.length; i++){
							if(dataArr[i].Name === "汉画简介" || dataArr[i].Name === "汉化介绍"){
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
	.about {
		box-sizing: border-box;
		padding: 5px;
		width: 1200px;
		margin: 0 auto;
		background-color: #FFFFFF;
	}

	.about .title {
		box-sizing: border-box;
		height: 65px;
		width: 100%;
		padding: 0 20px 0 30px;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		border-bottom: 1px solid #e8e4df;
	}

	.about .title .t-title {
		font-family: MicrosoftYaHei;
		font-size: 18px;
		color: #805b3d;
	}

	.about .title-icon {
		display: inline-block;
		width: 21px;
		height: 21px;
		margin-right: 10px;
		background: url(../../static/images/users.png) no-repeat center;
	}
	.about .content{
		padding: 25px 24px 60px;
	}
	/deep/.about .content p{
		text-indent: 2rem;
		line-height: 1.6;
		margin: 10px 0;
	}
</style>
