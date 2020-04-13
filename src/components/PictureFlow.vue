<template>
	<keep-alive>
	<div class="picture">
		<div class="water-flow">
			<!-- <img v-for="(item, index) in imgList" :key="index" :src="item.url" /> -->
			<waterfall :col='3' :width="290" :gutterWidth="15" :data="imgList" @loadmore="loadMore" :isTransition="isTransition" :loadDistance="200" @finish="finishRender">
				<template>
					<div class="item" v-for="(item, index) in imgList" :key="index" @mouseenter="showInfo(item)" @click="toDetails(item)">
						<a href="javascript:;">
							<img :src="item.ImagePath" />
						</a>
						<div class="mask">
							<p><span>时代：{{item.Dynasty || "--"}}</span><span>尺寸：{{item.StoneSize || "--"}}</span></p>
							<p><span>出土时间：{{item.ExcavateDate || "--"}}</span><span>出土地：{{item.ExcavatePlace || "--"}}</span></p>
						</div>
					</div>
				</template>
			</waterfall>
		</div>
		<div class="load-more">
			<div v-show="loading">图库加载中……</div>
			<div v-show="isMore">没有更多数据了</div>
		</div>
	</div>
	</keep-alive>
</template>

<script>
	import common from './bus.js'
	export default {
		data() {
			return {
				imgList: [],
				busy: false, //false启用加载，true关闭加载
				loading: false,
				isTransition: false,
				isMore: false,
				pageSize: 30,	//一次加载数量
				page: 1,	//当前页码
			}
		},
		methods: {
			toDetails(item){
				let isLogin = !!this.$store.state.username;
				if(isLogin){
					this.$router.push({
						path: '/details/'+ item.RelicID,
						query: {
							from: 'g'
						}
					})
				}else{
					this.$router.push({
						path: '/login',
					})
				}
				
			},
			getMoreImg(flag) {
				this.loading = true;
				let data = {
					Action: "SearchBlurEnabled",
					Resource: "Gallery",
					PageControl: {
						PageSize: this.pageSize,
						PageIndex: this.page,
						// OrderBy: "DisplayIndex DESC, PubDate DESC, ID DESC",
						OrderBy: "DisplayIndex DESC, Image ASC"
					}
				}
				//条件
				if(this.handleCondition()){
					// console.log(this.handleCondition())
					data.DataJSONString= JSON.stringify(this.handleCondition())
				}
				// console.log(data)
				this.$.post('/api/Table/TableAction', data)
					.then((res) => {
						// console.log(JSON.parse(res.data))
						
						let arr = JSON.parse(res.data).Rows
						arr.forEach((item) => {
							item.ImagePath = item.ImagePath.split('.').join('_thum.')
						})
						if (flag) { //分页时  数据要累加
							this.imgList = this.imgList.concat(arr);
								if (arr.length < this.pageSize) {
									this.busy = true;
									this.isMore = true;
									this.loading = false;
								} else {
									this.busy = false;
								}
						} else {
							this.imgList = arr;
							// console.log(this.imgList)
							// console.log(this.imgList[5].Code,this.imgList[13].Code,this.imgList[24].Code)
						}
					})
					.catch((err) => {
						console.log(err)
					})
				
			},
			handleCondition(){
				let obj = {}
				//Dynasty  年代， CollectUnit 搜藏地，  SearchTime  时间。
				if(this.$route.query.Dynasty||this.$route.query.CollectUnit||this.$route.query.SearchTime){
					if (this.$route.query.Dynasty)  obj.Dynasty = this.$route.query.Dynasty
					if (this.$route.query.CollectUnit)  obj.CollectUnit = this.$route.query.CollectUnit
					if (this.$route.query.SearchTime)  obj.SearchTime = parseInt(this.$route.query.SearchTime)
					return obj;
				}else{
					return false
				}
			},
			loadMore() {
				if (this.busy) return
				this.busy = true;
				setTimeout(() => {
					this.isTransition = true
					this.page++;
					this.getMoreImg(true) //加载
				}, 100);
			},
			finishRender(){
				this.loading = false;
				let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
				let clientHeight = document.documentElement.clientHeight || document.body.clientHeight;
				let scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;

				if(scrollHeight > clientHeight && scrollTop + clientHeight === scrollHeight) {
				  if(!this.busy){
					  this.loadMore()
				  }
				}
			},
			showInfo(item){
				if(!this.$store.state.username)return
				if(!item.hasInfo){
					this.getRelicInfo(item.RelicID, item)
				}
			},
			getRelicInfo(id, item){
				let data = {
					Action: "SearchID",
					Resource: "Relic",
					DataJSONString: JSON.stringify({ 'ID': id })
				}
				this.$.post('api/Table/TableAction', data)
					.then(res => {
						let info = JSON.parse(res.data)[0]
						this.$set(item, 'hasInfo', true)
						this.$set(item, 'Dynasty', info.Dynasty)
						this.$set(item, 'ExcavateDate', info.ExcavateDate)
						this.$set(item, 'ExcavatePlace', info.ExcavatePlace)
						this.$set(item, 'StoneSize', info.StoneSize)
					})
					.catch(err => {
						console.log(err)
					})
				
			}
		},
		mounted(){
			this.getMoreImg()
			
			
			common.$on('gallery', () => {
				this.getMoreImg()
			})
		}

	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	.picture {
		overflow: hidden;
		width: 930px;
		background-color: #ffffff;
	}

	.water-flow {
		box-sizing: border-box;
		width: 100%;
		padding-left: 10px;
		overflow: hidden;
	}

	.picture .water-flow img {
		/* margin: 10px; */
		max-width: 290px;
		/* margin: 10px; */
		/* cursor: pointer; */
	}

	.picture .load-more {
		font-family: MicrosoftYaHei;
		font-size: 14px;
		color: #999999;
		padding: 10px 0;
		text-align: center;
	}
	.item{
		position: relative;
		margin-top: 20px;
	}
	.item .mask{
		display: none;
		box-sizing: border-box;
		position: absolute;
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;
		background-color: rgba(0,0,0,.6);
		color: #fff;
		font-size: 16px;
		/* display: flex; */
		align-items: flex-start;
		justify-content: center;
		flex-direction: column;
	}
	.item .mask>p{
		padding-left: 20px;
	}
	.item .mask>p>span{
		margin-right: 30px;
	}
	.item:hover .mask{
		display: flex;
	}
</style>
