<template>
	<div class="index">
		<a class="logo"></a>
		<div class="search-wrap">
			<input class="search" type="text" v-model="search" placeholder="请输入关键字" @keydown.enter="query"/>
			<button class="primary" @click="query">检索</button>
		</div>
		<div class="hot-wrap">
			<span class="hot">热门搜索</span>
			<ul class="hot-search">
				<li v-for="(item, index) in hotSearch" :key="index">
					<router-link :to="{path: '/searching', query: {query: item.ID}}">
						{{item.ID}}
					</router-link>
				</li>
			</ul>
		</div>
	</div>
</template>

<script>
	
	export default {
		name: "Index",
		data() {
			return {
				search: '',
				hotSearch: []
			}
		},
		methods: {
			query(){
				if(!this.search.trim())return
				this.$router.push({
					path:'/searching',
					query:{
						query: this.search
					}
				})
			},
			getHotSearch(){
				let data = {
					Action: "SearchBlurEnabled",
					Resource: "SenseKey",
					PageControl: {
						PageSize: 5,
						PageIndex: 1,
						OrderBy: "DisplayIndex DESC, PubDate DESC, ID DESC"
					}
				}
				this.$.post('/api/Table/TableAction', data)
					.then((res) => {
						// console.log(JSON.parse(res.data).Rows)
						this.hotSearch = JSON.parse(res.data).Rows
					})
					.catch((err) => {
						console.log(err)
					})
			}
		},
		mounted(){
			this.getHotSearch()
			
			/* 
			   // 注意只有执行过查询（后数据返回，相关的查询词才会被记住）
			         var json = {
			             Action: "SearchInput",
			             Resource: "SenseKey",
			             PageControl: { PageSize: 10, PageIndex: 1, OrderBy: "" },
			             DataJSONString: JSON.stringify({ID: '兽纹'})
			         };
			 */
		}
	}
</script>

<style scoped>
	
	.index{
		width: 100%;
		height: calc(100vh - 100px - 152px);
		display: flex;
		justify-content: flex-start;
		flex-direction: column;
		align-items: center;
	}
	.index .logo{
		display: block;
		width: 1200px;
		height: 120px;
		margin-bottom: 88px;
		margin-top: 150px;
		background: url(../../static/images/index-logo.png) no-repeat center/contain;
	}
	.index .search-wrap{
		width: 745px;
	}
	.index .search-wrap .search{
		box-sizing: border-box;
		width: 600px;
		height: 45px;
		padding: 10px 20px;
		margin-right: 20px;
		font-family: MicrosoftYaHei;
		font-size: 14px;
		color: #999999;
		background-color: #FFFFFF;
		border-radius: 3px;
		outline: none;
		border: none;
	}
	.index .search-wrap .primary{
		box-sizing: border-box;
		width: 120px;
		height: 45px;
		background-color: #c10315;
		border-radius: 3px;
		line-height: 45px;
		text-align: center;
		color: #FFFFFF;
		border: none;
		font-family: MicrosoftYaHei;
		font-size: 14px;
		outline: none;
		cursor: pointer;
	}
	.index .hot-wrap{
		width: 730px;
		margin-top: 20px;
		display: flex;
		justify-content: flex-start;
		align-items: center;
	}
	.index .hot-wrap .hot{
		margin-right: 10px;
		font-family: MicrosoftYaHei;
		font-size: 14px;
		color: #666666;
	}
	.index .hot-wrap .hot-search{
		display: flex;
		justify-content: flex-start;
		align-items: center;
		font-family: MicrosoftYaHei;
		font-size: 14px;
	}
	.index .hot-wrap .hot-search>li{
		margin: 3px;
	}
	.index .hot-wrap .hot-search>li:hover a{
		color: #c10315;
	}
	.index .hot-wrap .hot-search>li>a{
		color: #333333;
	}
	@media screen and (max-width:1366px){
		.index{
			height: 600px;
		}
	}
</style>
