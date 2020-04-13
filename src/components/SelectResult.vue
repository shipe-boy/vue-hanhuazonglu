<template>
	<div class="result">
		<div class="search-type">
			<div :class="['s-type', {'active': selectTypeIndex == 0}]" @click="toggleSelectType(0)">简单检索</div>
			<div :class="['s-type', {'active': selectTypeIndex == 1}]" @click="toggleSelectType(1)">高级检索</div>
		</div>
		<div class="content">
			<!-- 高级检索 -->
			<div v-show="selectTypeIndex == 1" class="search-input">
				<div class="s-title">
					<div class="s-book"></div>请输入检索条件
				</div>
				<div class="s-screen" v-for="(item, index) in searchInput" :key="index">
					<div class="s-add">
						<div class="add" @click="toggleCondition('add')"></div>
						<div v-show="!(index == 0)" class="reduce" @click="toggleCondition('reduce', index)"></div>
					</div>
					<div class="s-select">
						<!--  @change="newSelect(index)" -->
						<select v-model="selectCondition[index].title">
							<option v-for="(item1, index1) in item.selectOption" :key="index1">{{item1}}</option>
						</select>
					</div>
					<div class="s-input">
						<input v-model="selectCondition[index].input" type="text" placeholder="请输入关键字" />
					</div>
					<div class="s-select">
						<select v-model="selectCondition[index].isOr">
							<option v-for="(item2, index2) in item.selectOption1" :key="index2">{{item2}}</option>
						</select>
					</div>
				</div>
				<div class="s-btn">
					<button class="bg-red" @click="search(false)">检索</button>
					<button @click="clearSelected">清除</button>
				</div>
			</div>
			
			<!-- 简单检索 -->
			<div v-show="selectTypeIndex == 0" class="search-simple">
				<div class="input-wrap">
					<input v-model="simpleSearch" type="text" placeholder="请输入关键字"  @keydown.enter="search(true)"/>
					<button @click="search(true)">检索</button>
				</div>
			</div>

			<!-- 结果 -->
			<div class="search-result">
				<div class="r-title">
					<div class="r-book"></div>检索结果
				</div>
				<div class="r-choose">
					<div class="r-page-num">
						<span>每页记录数：</span>
						<span :class="['page-num', {'active': selectPageNum == index}]" v-for="(item, index) in pageNumber" :key="index" @click="togglePageNum(item, index)">{{item}}</span>
						<span>共有 <span class="r-total">{{total}}</span> 条记录 </span>
					</div>
					<div class="r-output">
						<span @click="outExcel(true)">导出全部</span>
						
						<!-- <download-excel
						      class = "export-excel-wrapper"
						      :data = "json_data1"
						      :fields = "json_fields"
						      name = "汉画全部.xls">
						      <span @click="isChecked(true)">导出全部</span>
						</download-excel> -->
						<download-excel
						      class = "export-excel-wrapper"
						      :data = "json_data"
						      :fields = "json_fields"
						      name = "汉画部分结果.xls">
						      <span @click="outExcel(false)">导出选中结果</span>
						</download-excel>
						<!-- <span @click="outExcel(false)">导出选中结果</span> -->
					</div>
				</div>
				<!-- 结果表格 -->
				<div class="r-table">
					<el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange" @row-click="toDetails">
						<el-table-column type="selection" width="45"></el-table-column>
						<el-table-column prop="date" label="序号" width="60">
						</el-table-column>
						<el-table-column prop="Code" label="编号" width="160" show-overflow-tooltip>
						</el-table-column>
						<el-table-column prop="Dynasty" label="时代" width="80" show-overflow-tooltip>
						</el-table-column>
						<el-table-column prop="ImageResume" label="画面简述">
						</el-table-column>
						<el-table-column prop="ExcavateDate" label="出土时间" width="80">
						</el-table-column>
						<el-table-column prop="ExcavatePlace" label="出土地点" width="100">
						</el-table-column>
					</el-table>
				</div>
				<!-- 分页 -->
				<div class="r-pagination">
					页次:&nbsp;&nbsp; <span>{{page}}/{{maxPage}}</span>
					<div class="r-paging">
						<span @click="handlePage('start')">首页</span> &nbsp;&nbsp; | &nbsp;&nbsp;
						<span @click="handlePage(-1)">上一页</span> &nbsp;&nbsp; | &nbsp;&nbsp;
						<span @click="handlePage(1)">下一页</span> &nbsp;&nbsp; | &nbsp;&nbsp;
						<span @click="handlePage('end')">末页</span>
					</div>
				</div>
			</div>
		</div>
		<el-dialog
		  title="温馨提示"
		  :visible.sync="dialogVisible"
		  width="30%">
		  <span>您确定要全部导出么？</span>
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="dialogVisible = false">取 消</el-button>
		    <download-excel
		          class = "export-excel-wrapper"
		          :data = "json_data1"
		          :fields = "json_fields"
		          name = "汉画全部.xls">
		          <span @click="isChecked(true)">导出全部</span>
		    </download-excel>
		  </span>
		</el-dialog>
	</div>
</template>

<script>
	import connect from './bus'
	// 全部组合查询可用字段
	var _AllSearchName =
	{
	    Code: { title: '编号' },
	    Dynasty: {title: '时代' },
	    CollectNumber: {title: '原收藏号' },
	    ExcavatePlace: {title: '出土征集地', saveSense: true },
	    SearchTime: {title: '出土征集时间', noEasy: true },  // 必须能转数字
	    StoneSize: {title: '原石尺寸' },
	    ImageSize: {title: '画面尺寸' },
	    Texture: {title: '质地' },
	    StoneCondition: {title: '原石情况' },
	    Relation: {title: '组合关系' },
	    ImageResume: { title: '画面简述', saveSense: true },
	    RecAndDoc: { title: '著录与文献', saveSense: true },
	    CollectUnit: { title: '收藏单位', saveSense: true },
	    Cemetery: { title: '所属墓群', saveSense: true }
	};
	export default {
		data() {
			return {
				searchInput: [{
						selectOption: ["关键字",'编号', '时代', '原收藏号', '出土征集地', '出土征集时间', '原石尺寸', '画面尺寸', '质地', '原石情况', '组合关系', '画面简述', '著录与文献', '收藏单位','所属墓群'],
						selectOption1: ['与', '或']
					}
				],
				AllSearchName: ['编号', '时代', '原收藏号', '出土征集地', '出土征集时间', '原石尺寸', '画面尺寸', '质地', '原石情况', '组合关系', '画面简述', '著录与文献', '收藏单位','所属墓群' ],
				selectCondition: [	//v-model
					{
						title: '关键字',
						input: '',
						isOr: '与'
					}
				],
				simpleSearch: '', //简单检索
				oldSearch: '',
				pageNumber: ['10', '20', '30'],
				selectPageNum: 0,
				total: 0,
				// 表格
				tableData: [],
				pageSelect: [],	//当前页选择的导出结果
				multipleSelection: [],	//部分导出
				allArr: [],	//全部导出
				json_data: [],
				json_data1: [],
				json_fields: {
					"序号": "date",    
					"编号": "Code", 
					"时代": "Dynasty",
					"画面简述": "ImageResume",
					"出土时间": "ExcavateDate",
					"出土地点": "ExcavatePlace"
				},
				dialogVisible: false
			}
		},
		computed: {
			page(){	//当前页
				return this.$route.query.page || 1
			},
			maxPage(){
				return Math.ceil(this.total / this.pageNumber[this.selectPageNum])
			},
			selectedSearhName(){	//可以选择的搜索名字
				let arr = ["关键字"]	//未选择的数组
				let selected = []	//已选择过的数组
				this.selectCondition.forEach((item) => {
					selected.push(item.title)
				})
				this.AllSearchName.forEach((item) => {
					if(selected.indexOf(item) === -1){
						arr.push(item)
					}	
				})
				// console.log(arr)
				return arr
			},
			selectTypeIndex(){
				let search = this.$route.query;
				return search.type || 0
			}
		},
		methods: {
			toggleSelectType(index){
				let page = this.$route.query.page;
				let query = {};
				if(page && page != 1){
					query.page = 1
				}
				let search = this.$route.query;
				query.type = index
				this.$router.push({
					path: this.$route.path,
					query: query
				})
				this.tableData = [];
				this.multipleSelection = []
			},
			togglePageNum(num, index){
				this.selectPageNum = index
				let isSimple = this.selectTypeIndex == 0 ? true : false;
				this.getSearch(isSimple)
			},
			// newSelect(index) {
			// 	this.selected.splice(index, 1, this.searchInput[index].selectOption[0])
			// },
			clearSelected(){	//清空按钮
				this.searchInput = [{
						selectOption: ["关键字",'编号', '时代', '原收藏号', '出土征集地', '出土征集时间', '原石尺寸', '画面尺寸', '质地', '原石情况', '组合关系', '画面简述', '著录与文献', '收藏单位','所属墓群'],
						selectOption1: ['与', '或']
					}
				];
				this.selectCondition = [	
					{
						title: '关键字',
						input: '',
						isOr: '与'
					}
				];
			},
			toggleCondition(type, index){
				if(type === 'add'){	//加条件
					if(this.selectedSearhName.length <= 1)return
					let obj = {	//v-model
						title: this.selectedSearhName[0],
						input: '',
						isOr: '与'
					};
					let obj1 = {	//下拉框选项
						selectOption: this.selectedSearhName,
						selectOption1: ['与', '或']
					}
					
					this.selectCondition.push(obj)
					this.searchInput.push(obj1)
				}else{	//减条件
				// console.log(index)
					this.selectCondition.splice(index,1)
					this.searchInput.splice(index,1)
					// this.selectCondition.pop()
					// this.searchInput.pop()
				}
			},
			handlePage(pages){
				let page = "";
				// let search = this.$route.query.query;
				if(pages === 'start'){
					page = 1
				}else if(pages === 'end'){
					page = this.maxPage
				}else if(pages == 1){
					if(this.page >= this.maxPage)return
					page = parseInt(this.page) + 1
				}else{
					if(this.page == 1)return
					page = this.page - 1
				}
				if(page){
					let query = this.$route.query;
					let obj = {}
					for(let k in query){
						if(k !== 'from'){
							obj[k] = query[k]
						}
					}
					obj.page = page
					this.$router.push({
						path:  this.$route.path,
						query:obj
					})
					
					//添加当页选中的
					let selectedArr = this.multipleSelection.concat(this.pageSelect)
					let arr = selectedArr.sort((a,b) => {
						return a.date - b.date
					})
					this.multipleSelection = [];
					if(this.multipleSelection.length == 0){
						this.multipleSelection.push(arr[0])
					} 
					for(let i = 1; i < arr.length; i++){
						if(arr[i].date != arr[i-1].date){	//去重
							this.multipleSelection.push(arr[i])
						}
					}
					
					let isSimple = this.selectTypeIndex == 0 ? true : false;
					this.getSearch(isSimple)
				}
				
			},
			handleSelectionChange(val) {
				// console.log(val)
				this.pageSelect = val;
				// this.multipleSelection = val
				// console.log(this.multipleSelection)
			},
			toDetails(row, column, event){
				let query = this.$route.query
				let arr = {}
				for(let k in query){
					arr[k] = query[k]
				}
				arr.from = 's';
				let isLogin = !!this.$store.state.username;
				if(isLogin){
					this.$router.push({
						path: '/details/'+ row.ID,
						query:arr
					})
				}else{
					this.$router.push({
						path: '/login',
					})
				}
				
			},
			// 处理请求参数，加条件
			AddCondition(condition, field, searchKey, isOr) {
			    if (!field || !searchKey) return;
			    condition[field] = { val: searchKey, isOr: isOr ? '2' : '1' };
			    return condition;
			},
			// 简单查询和复杂查询
			getSearch(isSimple){
				var json = {
				    Action: "SearchBlurCustomer",
				    Resource: "Relic",
				    PageControl: { PageSize: this.pageNumber[this.selectPageNum], PageIndex: this.page, OrderBy: "" }
				};
				var condition = {};
				if(isSimple){	//简单检索
					// 加条件（把所有可用的条件都加上）
					for (let key in _AllSearchName) {
						if (_AllSearchName[key].noEasy) continue;
						this.AddCondition(condition, key, this.simpleSearch, true);
					}
				}else{	//复杂检索
					// 根据实际情况添加条件（只要修改这里即可，别的不必修改，字段名称只能在_AllSearchName变量中）
					// var condition = {};
					for (let key in _AllSearchName) {
						for(let i = 0, len = this.selectCondition.length; i< len; i++){
							if(this.selectCondition[i].title === '关键字') continue
							if (_AllSearchName[key].title === this.selectCondition[i].title){
								this.AddCondition(condition, key, this.selectCondition[i].input, this.selectCondition[i].isOr==="与"? false: true);
							}
						}
					}
				}
				// 统一处理条件
				var fields = [];
				for (var f in condition) {
				    fields.push(f + condition[f].isOr);
				    condition[f] = condition[f].val;
				    if (!json['SenseKey'] && _AllSearchName[f].saveSense) json['SenseKey'] = condition[f];
				}
				condition['BatchIDsJSON'] = fields.join(',');
				json['DataJSONString'] = JSON.stringify(condition);
				// console.log(json)
				this.json = json;
				this.$.post('/api/Table/TableAction', json)
					.then((res) => {
						// console.log(JSON.parse(res.data))
						this.tableData = JSON.parse(res.data).Rows
						this.tableData.forEach((item, index) =>{
							item.date = this.pageNumber[this.selectPageNum] * (this.page - 1) + index + 1
						})
						this.total = JSON.parse(res.data).PagingInfo.AllRecordCount;
					})
					.catch((err) => {
						console.log(err)
					})
			},
			// 简单检索和高级检索按钮点击
			search(isSimple){
				let query = {}
				if(isSimple){
					if(this.simpleSearch === '') return
					
					if(this.oldSearch != this.simpleSearch){
						this.multipleSelection = [];
						this.pageSelect = [];
						// console.log("清楚")
						this.oldSearch = this.simpleSearch
					}
					query.query = this.simpleSearch
					query.type = 0;
				}else{
					// console.log(this.selectCondition)
					this.multipleSelection = [];
					this.pageSelect = [];
					let obj = {}
					for(let i = 0, len = this.selectCondition.length; i < len; i++){
						let item = this.selectCondition[i]
						if(item.title !== "关键字"){
							obj['k'+i] = item.title+'+'+item.input+'+'+item.isOr
						}
						if(item.title == "时代" || item.title == "收藏单位" || item.title == "出土征集时间"){
							
						}
					}
					// console.log(obj)
					query = obj
					query.type = 1
					this.$nextTick(()=> {
						connect.$emit('chooseSide')
					})
					
				}
				query.page = 1;
				this.$router.push({
					path: this.$route.path,
					query: query
				})
				this.getSearch(isSimple)
			},
			outExcel(isAll){//导出表格
				if(!this.$store.state.username){
					alert('请登录')
					return
				}
				if(isAll){
					this.allArr = [];
					this.json_data1 = [];
					let data = {}
					for(let k in this.json){
						data[k] = this.json[k]
					}
					data.PageControl = { PageSize: 0, PageIndex: 1, OrderBy: "" };
					this.$.post('/api/Table/TableAction', data)
					.then( async res => {
						let resArr = JSON.parse(res.data).Rows;
						resArr.forEach((item, index) =>{
							item.date = 1 + index;
						})
						this.json_data1 = resArr;
						this.dialogVisible = true
					})
					.catch(err => {
						console.log(err)
					})
				}else{
					//添加当页选中的
					let selectedArr = this.multipleSelection.concat(this.pageSelect)
					let arr = selectedArr.sort((a,b) => {
						return a.date - b.date
					})
					this.multipleSelection = [];
					if(this.multipleSelection.length == 0){
						this.multipleSelection.push(arr[0])
					} 
					for(let i = 1; i < arr.length; i++){
						if(arr[i].date != arr[i-1].date){
							this.multipleSelection.push(arr[i])
						}
					}
					
					console.log(this.multipleSelection)
					this.json_data = this.multipleSelection
					// console.log(this.json_data)
				}
			},
			isChecked(){
				// console.log(this.json_data1)
				this.dialogVisible = false;
			}
		},
		mounted() {
			let search = this.$route.query;
			if(search.query){
				this.simpleSearch = search.query;
				this.search(true)
			}else if(search.k0 || search.k1){
				this.clearSelected()
				for(let k in search){
					if(k !== 'type' && k !== 'page'){
						let obj = {};
						let arr = search[k].split('+');
						obj.title = arr[0]
						obj.input = arr[1]
						obj.isOr = arr[2]
						let obj1 = {	//下拉框选项
							selectOption: this.selectedSearhName,
							selectOption1: ['与', '或']
						}
						this.selectCondition.push(obj)
						this.searchInput.push(obj1)
					}
				}
				this.search()
			}
			
			connect.$on('changeSide',()=>{
				let search = this.$route.query;
				this.clearSelected()
				for(let k in search){
					if(k !== 'type' && k !== 'page'){
						let obj = {};
						let arr = search[k].split('+');
						obj.title = arr[0]
						obj.input = arr[1]
						obj.isOr = arr[2]
						let obj1 = {	//下拉框选项
							selectOption: this.selectedSearhName,
							selectOption1: ['与', '或']
						}
						// console.log(obj, obj1)
						this.selectCondition.push(obj)
						this.searchInput.push(obj1)
					}
				}
				this.getSearch(false)
			})
		}
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	.result {
		width: 928px;
	}

	.search-type {
		display: flex;
		justify-content: flex-start;
		align-items: center;
	}

	.search-type .s-type {
		width: 140px;
		height: 40px;
		line-height: 40px;
		text-align: center;
		background-color: #aa9c94;
		border-radius: 7px 7px 0px 0px;
		font-family: MicrosoftYaHei;
		font-size: 16px;
		color: #ffffff;
		cursor: pointer;
	}

	.search-type .s-type:nth-child(1) {
		margin-right: 20px;
	}

	.search-type .s-type.active {
		background-color: #8c613d;
	}

	.content {
		padding: 20px;
		border-top: 3px solid #8c613d;
		background-color: #ffffff;
	}

	.content .search-input {
		overflow: hidden;
		/* width: 810px; */
		border-bottom: 1px dashed #e8e4df;
	}

	.content .search-input .s-title {
		width: 100%;
		height: 30px;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		font-family: MicrosoftYaHei;
		font-size: 18px;
		color: #805b3d;
	}

	.content .search-input .s-title .s-book {
		width: 21px;
		height: 21px;
		margin-right: 10px;
		background: url(../../static/images/search.png) no-repeat center;
	}

	.s-screen {
		width: 720px;
		display: flex;
		align-items: center;
		justify-content: flex-start;
		margin: 25px auto 0;
	}

	.s-screen .s-add {
		width: 60px;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.s-screen .s-add>div {
		position: relative;
		width: 15px;
		height: 15px;
		cursor: pointer;
	}

	.s-screen .s-add .add:before {
		content: '';
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 15px;
		height: 3px;
		background-color: #aa9c94;
	}

	.s-screen .s-add .add:after {
		content: '';
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 3px;
		height: 15px;
		background-color: #aa9c94;
	}

	.s-screen .s-add .reduce:after {
		content: '';
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 15px;
		height: 3px;
		background-color: #aa9c94;
	}

	.s-select {
		width: 100px;
		height: 35px;
		margin-left: 30px;
	}

	.s-select>select {
		box-sizing: border-box;
		display: block;
		height: 100%;
		width: 100%;
		padding: 5px;
		border: solid 1px #e8e4df;
		outline: none;
	}

	.s-input {
		width: 460px;
		height: 35px;
		margin-left: 10px;
	}

	.s-input>input {
		box-sizing: border-box;
		display: block;
		height: 100%;
		width: 100%;
		padding: 5px 20px;
		border: solid 1px #e8e4df;
		background-color: #fffdfd;
		outline: none;
		font-family: MicrosoftYaHei;
		font-size: 14px;
		color: #999999;
	}

	.s-btn {
		width: 100%;
		text-align: center;
		font-family: MicrosoftYaHei;
		font-size: 14px;
		color: #c10315;
		margin: 25px 0 20px;
	}

	.s-btn button {
		box-sizing: border-box;
		width: 120px;
		height: 45px;
		line-height: 45px;
		border-radius: 3px;
		border: solid 1px #c10315;
		background-color: #FFFFFF;
		color: #c10315;
		cursor: pointer;
		outline: none;
	}

	.s-btn button.bg-red {
		background-color: #c10315;
		color: #FFFFFF;
		margin-right: 20px;
	}
	.search-result{
		margin-top: 25px;
	}
	.search-result .r-title{
		height: 21px;
		width: 100%;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		font-family: MicrosoftYaHei;
		font-size: 18px;
		color: #805b3d;
	}
	.search-result .r-title .r-book{
		width: 21px;
		height: 21px;
		margin-right: 10px;
		background: url(../../static/images/book1.png) no-repeat center;
	}
	.search-result .r-choose{
		box-sizing: border-box;
		height: 26px;
		padding-left: 10px;
		width: 100%;
		margin-top: 45px;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.search-result .r-choose .r-page-num{
		height: 21px;
		display: flex;
		justify-content: flex-start;
		align-items: center;
	}
	.search-result .r-choose .r-page-num > span{
		display: inline-block;
		height: 100%;
		font-family: MicrosoftYaHei;
		font-size: 14px;
		color: #666666;
	}
	.search-result .r-choose .r-page-num > span:nth-child(1){
		margin-right: 8px;
	}
	.search-result .r-choose .r-page-num > span:last-child{
		margin-left: 15px;
	}
	.search-result .r-choose .r-page-num .page-num{
		width: 37px;
		height: 21px;
		color: #666666;
		border-radius: 10px;
		text-align: center;
		margin: 0 5px;
		cursor: pointer;
	}
	.search-result .r-choose .r-page-num .page-num:hover,
	.search-result .r-choose .r-page-num .page-num.active{
		background-color: #c10315;
		color: #FFFFFF;
	}
	.search-result .r-choose .r-page-num .r-total{
		color: #c10315;
	}
	.search-result .r-choose .r-output>div{
		display: inline-block;
	}
	.search-result .r-choose .r-output span{
		display: inline-block;
		height: 26px;
		box-sizing: border-box;
		background-color: #ffffff;
		border-radius: 13px;
		border: solid 1px #8b603d;
		font-family: MicrosoftYaHei;
		color: #8b603d;
		font-size: 14px;
		line-height: 26px;
		padding: 0 8px;
		cursor: pointer;
		margin: 0 3px;
	}
	.search-result .r-choose .r-output span:hover{
		color: #FFFFFF;
		background-color: #8b603d;
	}
	.search-result .r-table{
		box-sizing: border-box;
		margin-top: 15px;
	}
	.r-pagination{
		width: 100%;
		height: 20px;
		margin-top: 25px;
		display: flex;
		justify-content: flex-end;
		align-items: center;
		font-size: 14px;
		font-family: MicrosoftYaHei;
		color: #666666;
	}
	.r-pagination>span{
		margin-right: 50px;
		color: #c10315;
	}
	.r-pagination .r-paging{
		display: flex;
		justify-content: flex-start;
		align-items: center;
	}
	.r-pagination .r-paging>span{
		display: inline-block;
		height: 100%;
		cursor: pointer;
	}
	.r-pagination .r-paging>span:hover{
		text-decoration: underline;
		color: #c10315;
	}
	.search-simple{
		border-bottom: 1px dashed #e8e4df;
	}
	.search-simple .input-wrap{
		margin: 30px 0 20px;
		text-align: center;
	}
	.search-simple .input-wrap input{
		width: 490px;
		height: 45px;
		box-sizing: border-box;
		padding: 10px 0px 10px 20px;
		outline: none;
		background-color: #fffdfd;
		border: solid 1px #e8e4df;
		font-family: MicrosoftYaHei;
		font-size: 14px;
		color: #999999;
	}
	.search-simple .input-wrap button{
		width: 120px;
		height: 45px;
		background-color: #c10315;
		border-radius: 3px;
		font-family: MicrosoftYaHei;
		font-size: 14px;
		color: #ffffff;
		cursor: pointer;
		border: none;
		outline: none;
	}
	.el-dialog__footer div{
		display: inline-block;
		width: 98px;
		height: 40px;
		line-height: 40px;
		vertical-align: middle;
		white-space: nowrap;
		cursor: pointer;
		background: #FFF;
		border: 1px solid #DCDFE6;
		color: #606266;
		text-align: center;
		box-sizing: border-box;
		outline: 0;
		margin: 0;
		transition: .1s;
		font-weight: 500;
		font-size: 14px;
		border-radius: 4px;
	}
	.el-button:focus, .el-button:hover,.el-dialog__footer div:hover{
		color: #805b3d;
		border-color: #e8e4df;
		background-color: #f8f5f2;
	}
	.el-dialog__footer div span{
		display: inline-block;
		height: 100%;
		width: 100%;
	}
</style>
