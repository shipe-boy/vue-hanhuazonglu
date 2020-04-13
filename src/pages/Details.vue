<template>
	<div class="details">
		<div class="d-title">
			<div class="t-wrap">
				<div class="t-book"></div> 汉画详细
			</div>
			<div class="t-page">
				<a href="javascript:;" @click="back">返回目录</a> &nbsp; | &nbsp;
				<a href="javascript:;" @click="changeDetails(-1)">上一汉画</a> &nbsp; | &nbsp;
				<a href="javascript:;" @click="changeDetails(1)">下一汉画</a>
			</div>
		</div>
		<div class="content">
			<div class="item" v-for="(item, index) in itemList" :key="index">
				<div class="item-title">{{item.name}}</div>
				<div class="item-desc">{{item.content || "--"}}</div>
			</div>
		</div>
		<div class="banner">
			<!-- swiper1 -->
			<swiper :options="swiperOptionTop" class="gallery-top" ref="swiperTop">
				<swiper-slide class="slide-1" v-for="(item, index) in itemImgList" :key="index">
					<img :src="item.ImagePath" :alt="item.Image"/>
				</swiper-slide>
				<div class="swiper-button-next swiper-button-white" slot="button-next">
					<img src="../../static/images/next.svg" />
				</div>
				<div class="swiper-button-prev swiper-button-white" slot="button-prev">
					<img src="../../static/images/prev.svg" />
				</div>
			</swiper>
			<!-- swiper2 Thumbs -->
			<swiper :options="swiperOptionThumbs" class="gallery-thumbs" ref="swiperThumbs">
				<swiper-slide class="slide-1" v-for="(item, index) in itemImgList" :key="index">
					<img :src="item.ImagePath" :alt="item.Image"/>
				</swiper-slide>
			</swiper>

		</div>
		<!-- 下载 -->
		<a class="download" :href="downLoadSrc" :download="downLoadName">下载原图</a>
	</div>
</template>

<script>
	import 'swiper/dist/css/swiper.css'
	import {
		swiper,
		swiperSlide
	} from 'vue-awesome-swiper'
	
	export default {
		data() {
			return {
				itemList: [{
						name: '编号',
						englishName: 'Code',
						content: ''
					},
					{
						name: '时代',
						englishName: 'Dynasty',
						content: ''
					},
					{
						name: '原收藏号',
						englishName: 'CollectNumber',
						content: ''
					},
					{
						name: '出土地点',
						englishName: 'ExcavatePlace',
						content: ''
					},
					{
						name: '出土时间',
						englishName: 'ExcavateDate',
						content: ''
					},
					{
						name: '原石尺寸',
						englishName: 'StoneSize',
						content: ''
					},
					{
						name: '质地',
						englishName: 'Texture',
						content: ''
					},
					{
						name: '原石情况',
						englishName: 'StoneCondition',
						content: ''
					},
					{
						name: '组合关系',
						englishName: 'Relation',
						content: ''
					},
					{
						name: '画面简述',
						englishName: 'ImageResume',
						content: ''
					},
					{
						name: '著录与文献',
						englishName: 'RecAndDoc',
						content: ''
					},
					{
						name: '收藏单位',
						englishName: 'CollectUnit',
						content: ''
					}
				],
				swiperOptionTop: {
					spaceBetween: 10,
					navigation: {
						nextEl: '.swiper-button-next',
						prevEl: '.swiper-button-prev'
					}
				},
				swiperOptionThumbs: {
					spaceBetween: 10,
					centeredSlides: true,
					slidesPerView: 'auto',
					touchRatio: 0.2,
					slideToClickedSlide: true
				},
				itemImgList: [],
				downLoadSrcIndex: 0
				// downLoadName: ''
			}
		},
		components: {
			swiper,
			swiperSlide
		},
		computed:{
			downLoadSrc(){
				if(this.itemImgList.length > 0){
					let src = this.itemImgList[this.downLoadSrcIndex].ImagePath.split('_thum.').join('.');
					// console.log(src)
					return src
				}
				
			},
			downLoadName(){
				if(this.itemImgList.length > 0){
					let name = this.itemImgList[this.downLoadSrcIndex].Image;
					// console.log(name)
					return name
				}
				
			}
		},
		methods:{
			back(){
				let to = this.$route.query.from === 's' ? 'searching' : 'gallery'
				let query = this.$route.query;
				let arr = {}
				for(let k in query){
					if(k !== 'from'){
						arr[k] = query[k]
					}
				}
				this.$router.push({
					path: '/'+ to,
					query:arr
				})
			},
			changeDetails(num){
				let id = parseInt(this.$route.params.id) + num;
				let query = this.$route.query;
				this.$router.push({
					path: '/details/'+ id,
					query
				})
				this.getData()
				this.getImg()
			},
			getData(){
				let id = this.$route.params.id;
				let data = {
					Action: "SearchID",
					Resource: "Relic",
					DataJSONString: JSON.stringify({ 'ID': id })
				}
				// console.log(data)
				this.$.post('/api/Table/TableAction', data)
					.then((res) => {
						// console.log(JSON.parse(res.data)[0])
						if(!JSON.parse(res.data)[0]){
							alert("没有更多了！")
						}
						let arr = JSON.parse(res.data)[0];
						for(let k in arr){
							this.itemList.forEach((item) => {
								if(item.englishName === k){
									item.content = arr[k]
								}
							})
						}
						// console.log(this.itemList) 
					})
					.catch((err) => {
						this.$router.push({
							path: '/login'
						})
						console.log(err)
					})
				
			},
			getImg(){
				let id = this.$route.params.id;
				let data = {
					Action: "SearchBlurEnabled",
					Resource: "Gallery",
					DataJSONString: JSON.stringify({ 'RelicID': id }),
					PageControl: {
						PageSize: 0,
						PageIndex: 1,
						OrderBy: "DisplayIndex DESC, PubDate DESC, ID DESC"
					}
				}
				this.$.post('/api/Table/TableAction', data)
					.then((res) => {
						// console.log(JSON.parse(res.data))
						let arr = JSON.parse(res.data).Rows;
						arr.forEach((item) => {
							item.ImagePath = item.ImagePath.split('.').join('_thum.')
						})
						this.itemImgList = arr;
					})
			},
			changeSrc(swiperTop){
				let self = this;
				swiperTop.on('slideChangeTransitionEnd', function() {
					self.downLoadSrcIndex = this.activeIndex
					
					// self.downLoadName = self.itemImgList[this.activeIndex].Image
					// console.log(self.downLoadSrc, self.downLoadName)
				})
			}
		},
		mounted() {
			this.getData()
			this.getImg()
			
			this.$nextTick(() => {
				const swiperTop = this.$refs.swiperTop.swiper
				const swiperThumbs = this.$refs.swiperThumbs.swiper
				swiperTop.controller.control = swiperThumbs
				swiperThumbs.controller.control = swiperTop
				this.changeSrc(swiperTop)
			})
			
		}
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	.details {
		box-sizing: border-box;
		padding: 5px;
		width: 1200px;
		margin: 0 auto;
		background-color: #FFFFFF;
	}

	.details .d-title {
		box-sizing: border-box;
		width: 100%;
		height: 65px;
		padding: 20px;
		border-bottom: 1px dashed #e8e4df;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.details .d-title .t-wrap {
		font-family: MicrosoftYaHei;
		font-size: 18px;
		color: #805b3d;
		display: flex;
		align-items: center;
		justify-content: flex-start;
	}

	.details .d-title .t-wrap .t-book {
		width: 20px;
		height: 20px;
		margin-right: 10px;
		background: url(../../static/images/book.png) no-repeat center;
	}

	.details .d-title .t-page>a {
		font-family: MicrosoftYaHei;
		font-size: 14px;
		color: #666666;
	}

	.details .d-title .t-page>a:hover {
		text-decoration: underline;
		font-size: 14px;
		color: #c10315;
	}

	.details .content {
		width: 1100px;
		margin: 20px auto 55px;
		border: 1px solid #e8e4df;
	}

	.content .item {
		width: 100%;
		display: flex;
		justify-content: flex-start;
		/* align-items: center; */
	}

	.content .item .item-title {
		box-sizing: border-box;
		width: 148px;
		padding: 15px 30px;
		background-color: #aa9c94;
		font-family: MicrosoftYaHei;
		font-size: 14px;
		color: #ffffff;
		display: flex;
		justify-content: flex-start;
		align-items: center;
	}

	.content .item .item-desc {
		box-sizing: border-box;
		width: 955px;
		padding: 14px 30px;
		font-family: MicrosoftYaHei;
		font-size: 14px;
		color: #333333;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		border-bottom: 1px solid #e8e4df;
	}

	.content .item:last-child .item-desc {
		border: none;
	}

	.banner {
		position: relative;
		width: 920px;
		height: 410px;
		margin: 0 auto 35px;
		background-color: #ffffff;
		border: solid 1px #e8e4df;
	}

	.gallery-top {
		height: 100% !important;
		width: 100%;
	}
	.gallery-top .swiper-slide img{
		max-width: 100%;
		max-height: 100%;
	}

	.gallery-thumbs {
		position: absolute;
		left: 0;
		bottom: 0;
		width: 100%;
		height: 70px !important;
		box-sizing: border-box;
		padding: 5px 0;
		background-color: rgba(0, 0, 0, 0.7);
	}

	.gallery-thumbs .swiper-slide {
		box-sizing: border-box;
		width: 140px;
		height: 100%;
		opacity: 0.4;
		cursor: pointer;
	}
	.gallery-thumbs .swiper-slide img{
		max-width: 100%;
		max-height: 100%;
	}

	.gallery-thumbs .swiper-slide-active {
		opacity: 1;
		border: 3px solid #c10315;
	}

	.gallery-top .swiper-slide {
		box-sizing: border-box;
		padding: 30px 75px;

	}

	.swiper-slide {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.download {
		display: block;
		width: 120px;
		height: 45px;
		line-height: 45px;
		text-align: center;
		background-color: #c10315;
		border-radius: 3px;
		margin: 0 auto 60px;
		font-family: MicrosoftYaHei;
		font-size: 14px;
		color: #ffffff;
	}
</style>
