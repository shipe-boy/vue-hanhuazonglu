<template>
	<div class="select-type">
		<div class="title">汉画类别</div>
		<div class="type" ref="typeList0">
			<div class="type-title">
				<el-checkbox label="时代" v-model="checkList0.length > 0" @click.native="select(0)"></el-checkbox>
				<div class="down-icon" @click="showDown(0)"></div>
			</div>
			<div class="type-list">
				<el-checkbox-group v-model="checkList0" @change="handleCheckChange">
					<el-checkbox v-for="(val, key, index) in typesList['时代']" :label="key" :key="index"><span class="name el1">{{key}}</span>
						({{val}})</el-checkbox>
				</el-checkbox-group>
			</div>
		</div>
		<div class="type" ref="typeList1">
			<div class="type-title">
				<el-checkbox label="收藏地点" v-model="checkList1.length > 0" @click.native="select(1)"></el-checkbox>
				<div class="down-icon" @click="showDown(1)"></div>
			</div>
			<div class="type-list">
				<el-checkbox-group v-model="checkList1" @change="handleCheckChange">
					<el-checkbox v-for="(val, key, index) in typesList['收藏地点']" :label="key" :key="index"><span class="name el1">{{key}}</span>
						({{val}})</el-checkbox>
				</el-checkbox-group>
			</div>
		</div>
		<div class="type" ref="typeList2">
			<div class="type-title">
				<el-checkbox label="出土时间" v-model="checkList2.length > 0" @click.native="select(2)"></el-checkbox>
				<div class="down-icon" @click="showDown(2)"></div>
			</div>
			<div class="type-list">
				<el-checkbox-group v-model="checkList2" @change="handleCheckChange">
					<el-checkbox v-for="(val, key, index) in typesList['出土时间']" :label="key" :key="index"><span class="name el1">{{key}}年</span>
						({{val}})</el-checkbox>
				</el-checkbox-group>
			</div>
		</div>
	</div>
</template>

<script>
	import connect from './bus'
	// 全部组合查询可用字段
	var _AllSearchName = {
		Code: {
			title: '编号'
		},
		Dynasty: {
			title: '时代'
		},
		CollectNumber: {
			title: '原收藏号'
		},
		ExcavatePlace: {
			title: '出土征集地',
			saveSense: true
		},
		SearchTime: {
			title: '出土征集时间',
			noEasy: true
		}, // 必须能转数字
		StoneSize: {
			title: '原石尺寸'
		},
		ImageSize: {
			title: '画面尺寸'
		},
		Texture: {
			title: '质地'
		},
		StoneCondition: {
			title: '原石情况'
		},
		Relation: {
			title: '组合关系'
		},
		ImageResume: {
			title: '画面简述',
			saveSense: true
		},
		RecAndDoc: {
			title: '著录与文献',
			saveSense: true
		},
		CollectUnit: {
			title: '收藏单位',
			saveSense: true
		},
		Cemetery: {
			title: '所属墓群',
			saveSense: true
		}
	};
	export default {
		data() {
			return {
				type: [
					[],
					[],
					[]
				],
				num: 0,
				typesList: {
					'时代': {},
					'出土时间': {},
					'收藏地点': {}
				}
			}
		},
		computed: {
			checkList0: {
				set(value) {
					if (value.length > 1) {
						this.type.splice(0, 1, [value[value.length - 1]])
					} else {
						this.type.splice(0, 1, value)
					}
					return this.type[0]
				},
				get() {
					return this.type[0]
				}
			},
			checkList1: {
				set(value) {
					if (value.length > 1) {
						this.type.splice(1, 1, [value[value.length - 1]])
					} else {
						this.type.splice(1, 1, value)
					}
					return this.type[1]
				},
				get() {
					return this.type[1]
				}
			},
			checkList2: {
				set(value) {
					if (value.length > 1) {
						this.type.splice(2, 1, [value[value.length - 1]])
					} else {
						this.type.splice(2, 1, value)
					}
					return this.type[2]
				},
				get() {
					return this.type[2]
				}
			}
		},
		watch: {
			$route() {
				let path = this.$route.path;
				if (path.indexOf('/searching') > -1) {
					this.getType()
				}
			}
		},
		methods: {
			select(index) { //标题的选中与不选中状态
				this.num++
				let flag = !!this.type[index][0];
				if (this.num % 2 === 0) {
					let dom = this.$refs['typeList' + index];
					if (flag) {
						this.type.splice(index, 1, [])
						dom.classList.remove('active')
						flag = false;
					} else {
						this.type.splice(index, 1, ['复选框 B'])
						dom.classList.add('active')
						flag = true
					}
				}
			},
			showDown(index, flag) {
				let dom = this.$refs['typeList' + index];
				if (dom && dom.classList) {
					if(flag){
						dom.classList.add('active')
					}else{
						dom.classList.toggle('active')
					}
					
				}

			},
			gallerySlid(){
				let query = this.$route.query;
				if (this.$route.query.Dynasty){
					this.checkList0.push(this.$route.query.Dynasty)
					this.showDown(0, true)
				}
				if (this.$route.query.CollectUnit){
					this.checkList1.push(this.$route.query.CollectUnit)
					this.showDown(1, true)
				} 
				if (this.$route.query.SearchTime){
					this.checkList2.push(this.$route.query.SearchTime)
					this.showDown(2, true)
				}
			},
			handleCheckChange(value) { //选择变化
				let path = this.$route.path;
				if (path.indexOf('/gallery') > -1) { //图库
					let obj = {};
					//Dynasty  年代， CollectUnit 搜藏地，  SearchTime  时间。
					if (this.checkList0.length > 0) {
						obj.Dynasty = this.checkList0[0]
					}
					if (this.checkList1.length > 0) {
						obj.CollectUnit = this.checkList1[0]
					}
					if (this.checkList2.length > 0) {
						obj.SearchTime = this.checkList2[0]
					}
				
					this.$router.push({
						path: '/gallery',
						query: obj
					})
					connect.$emit('gallery')
				} else { //搜索
					let obj = {
						page: 1,
						type: 1
					};
					if (this.checkList0.length > 0) {
						obj.k0 = '时代+' + this.checkList0[0] + '+与'
					}
					if (this.checkList1.length > 0) {
						obj.k1 = '收藏单位+' + this.checkList1[0] + '+与'
					}
					if (this.checkList2.length > 0) {
						obj.k2 = '出土征集时间+' + this.checkList2[0] + '+与'
					}
					// console.log(this.checkList2, this.checkList1, this.checkList0)
					this.$router.push({
						path: '/searching',
						query: obj
					})
					connect.$emit('changeSide')
					this.getType()
				}
				
			},
			AddCondition(condition, field, searchKey, isOr) {
				if (!field || !searchKey) return;
				condition[field] = {
					val: searchKey,
					isOr: isOr ? '2' : '1'
				};
				return condition;
			},
			getType() {
				let data = {
					Action: "SearchBlurCustomerGroup",
					Resource: "Relic"
				}
				// 根据实际情况添加条件（只要修改这里即可，别的不必修改，字段名称只能在_AllSearchName变量中）
				var condition = {};
				let isSimple = this.$route.query.type == 1 ? false : true;
				if (isSimple) { //简单检索
					// 加条件（把所有可用的条件都加上）
					for (let key in _AllSearchName) {
						if (_AllSearchName[key].noEasy) continue;
						this.AddCondition(condition, key, this.simpleSearch, true);
					}
				} else { //复杂检索
					// 根据实际情况添加条件（只要修改这里即可，别的不必修改，字段名称只能在_AllSearchName变量中）
					let selectCondition = [];
					let query = this.$route.query;
					// console.log(query)
					for (let k in query) {
						if (k != 'page' && k != 'type') {
							// console.log(k, k != 'page')
							let arr = query[k].split('+');
							selectCondition.push({
								title: arr[0],
								input: arr[1],
								isOr: arr[2]
							})
						}
					}
					for (let key in _AllSearchName) {
						for (let i = 0, len = selectCondition.length; i < len; i++) {
							if (selectCondition[i].title === '关键字') continue
							if (_AllSearchName[key].title === selectCondition[i].title) {
								this.AddCondition(condition, key, selectCondition[i].input, selectCondition[i].isOr === "与" ? false : true);
							}
						}
					}
				}

				// 统一处理条件
				var fields = [];
				for (var f in condition) {
					fields.push(f + condition[f].isOr);
					condition[f] = condition[f].val;
					if (!data['SenseKey'] && _AllSearchName[f].saveSense) data['SenseKey'] = condition[f];
				}
				condition['BatchIDsJSON'] = fields.join(',');
				data['DataJSONString'] = JSON.stringify(condition);
				// console.log(data)
				this.$.post('/api/Table/TableAction', data)
					.then((res) => {
						// console.log(JSON.parse(res.data).Rows)
						let resArr = JSON.parse(res.data).Rows;
						this.typesList = {
							'时代': {},
							'出土时间': {},
							'收藏地点': {}
						}
						resArr.forEach((item) => {
							this.typesList[item.Code][item.Remarks] = item.DisplayIndex;

						})
						// console.log(this.typesList)
					})
					.catch((err) => {
						console.log(err)
					})
			}
		},
		mounted() {
			this.getType()
			this.gallerySlid()
			connect.$on('chooseSide', () => {
				this.checkList0 = []
				this.checkList1 = []
				this.checkList2 = []
				let query = this.$route.query;
				for (let k in query) {
					if (k != 'page' && k != 'type') {
						let arr = query[k].split('+')
						if (arr[0] == '时代') {
							this.checkList0.push(arr[1])
							this.showDown(0)
						}
						if (arr[0] == '收藏单位') {
							this.checkList1.push(arr[1])
							this.showDown(1)
						}
						if (arr[0] == '出土征集时间') {
							this.checkList2.push(arr[1])
							this.showDown(2)
						}
					}

				}

			})
		}
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	.select-type {
		box-sizing: border-box;
		width: 250px;
		height: auto;
		border-radius: 7px 7px 0px 0px;
		overflow: hidden;
		border: solid 1px #e8e4df;
	}

	.select-type .title {
		box-sizing: border-box;
		width: 100%;
		height: 40px;
		padding: 12px 30px;
		line-height: 1;
		background-color: #8c613d;
		font-family: MicrosoftYaHei;
		font-size: 16px;
		color: #ffffff;
	}

	.type-title {
		box-sizing: border-box;
		width: 100%;
		height: 53px;
		padding: 0 10px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		background-color: #FFFFFF;
	}

	.type-title .down-icon {
		position: relative;
		width: 16px;
		height: 16px;
		cursor: pointer;
	}

	.type-title .down-icon:before {
		content: '';
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 10px;
		height: 2px;
		background-color: #8c613d;
	}

	.type .type-title .down-icon:after {
		content: '';
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 2px;
		height: 10px;
		background-color: #8c613d;
	}

	.type.active .type-title .down-icon:after {
		display: none;
	}

	.type-list {
		overflow: hidden;
		width: 100%;
		height: 0px;
		max-height: 500px;
		overflow-y: auto;
		transition: 5s;
	}

	.type.active .type-list {
		height: auto;
	}

	.type-list .el-checkbox {
		display: block;
		padding: 0 10px;
		height: 50px;
		line-height: 50px;
		background-color: #f8f5f2;
	}

	.el-checkbox__label {
		font-family: MicrosoftYaHei;
		font-size: 14px;
		color: #666666;
	}

	.el-checkbox__label span.name {
		display: inline-block;
		max-width: 180px;
		vertical-align: middle;
	}



	/* 滚动条 */
	.type-list::-webkit-scrollbar {
		/*滚动条整体样式*/
		width: 8px;
		/*高宽分别对应横竖滚动条的尺寸*/
		height: 4px;
		scrollbar-arrow-color: red;

	}

	.type-list::-webkit-scrollbar-thumb {
		/*滚动条里面小方块*/
		border-radius: 5px;
		-webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
		background: rgba(0, 0, 0, 0.1);
		scrollbar-arrow-color: red;
	}

	.type-list::-webkit-scrollbar-track {
		/*滚动条里面轨道*/
		/* -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2); */
		border-radius: 0;
		background: transparent;
	}
</style>
