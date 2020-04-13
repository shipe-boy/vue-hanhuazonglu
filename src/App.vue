<template>
  <div id="app">
		<header-nav></header-nav>
    <router-view/>
		<footer-nav></footer-nav>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
	/*初始化  */
	body, h1, h2, h3, h4, h5, h6, hr, p, blockquote, dl, dt, dd, ul, ol, li, pre, form, fieldset, legend, button, input, textarea, th, td { margin:0; padding:0; }
	body, button, input, select, textarea { font:12px/1.5tahoma, arial, \5b8b\4f53; }
	h1, h2, h3, h4, h5, h6{ font-size:100%; }
	address, cite, dfn, em, var { font-style:normal; }
	code, kbd, pre, samp { font-family:couriernew, courier, monospace; }
	small{ font-size:12px; }
	ul, ol { list-style:none; }
	a { text-decoration:none; }
	sup { vertical-align:text-top; }
	sub{ vertical-align:text-bottom; }
	legend { color:#000; }
	fieldset, img { border:0; }
	button, input, select, textarea { font-size:100%; }
	table { border-collapse:collapse; border-spacing:0; }
	
	body{
	  background: #f8f5f2;
	}
	
	/* 登录 */
	.login .el-form-item__label{
		line-height: 45px;
	}
	.login .el-form-item__content{
		width: 380px;
		height: 45px;
		margin-left: 100px !important;
	}
	.login .el-checkbox__input.is-checked+.el-checkbox__label{
		color: #805b3d !important;
	}
	.login .el-checkbox__input.is-checked .el-checkbox__inner, .el-checkbox__input.is-indeterminate .el-checkbox__inner{
		    background-color: #805b3d !important;
		    border-color: #805b3d !important;
	}
	.login .el-checkbox__input.is-focus .el-checkbox__inner{
		border-color: #805b3d !important;
	}
	.login .el-button--primary{
		width: 160px;
		height: 45px;
		margin-left: 110px;
		background-color: #c10315 !important;
		border-radius: 3px;
		border-color: #c10315 !important;
		font-family: MicrosoftYaHei;
		font-size: 16px;
	}
	/* 注册 */
	.register .el-select{
		width: 180px;
	}
	.register .el-select:nth-child(1){
		margin-right: 12px;
	}
	.register .el-form-item:nth-last-child(3){
		margin-bottom: 5px;
	}
	.register .el-button--primary{
		width: 160px;
		height: 45px;
		background-color: #c10315 !important;
		border-color: #c10315 !important;
		border-radius: 3px;
		font-family: MicrosoftYaHei;
		font-size: 16px;
		margin-left: 110px;
	}
	
	
	.el-input__inner{
		height: 45px;
		outline: none;
		border-radius: 3px;
		border: solid 1px #e8e4df !important;
		background-color: #f8f5f2 !important;
	}
	.el-select .el-input.is-focus .el-input__inner,
	.el-select .el-input__inner:focus,
	.el-input.is-active .el-input__inner, .el-input__inner:focus{
		border-color: #e8e4df !important;
	}
	.el-checkbox__input.is-checked .el-checkbox__inner, .el-checkbox__input.is-indeterminate .el-checkbox__inner{
		    background-color: #805b3d !important ;
		    border-color: #805b3d !important;
	}
	.el-checkbox__input.is-checked+.el-checkbox__label{
		color: #805b3d !important;
	}
	.el-checkbox__input.is-focus .el-checkbox__inner{
		border-color: #805b3d !important;
	}
	.el-checkbox__inner:hover{
		border-color: #805b3d !important;
	}
	.el-checkbox__inner:focus{
		border-color: #805b3d !important;
		outline: none;
	}
	
	
	/* 表格 */
	.search-result .r-table .el-table__footer-wrapper, .search-result .r-table .el-table__header-wrapper{
		height: 48px;
		
	}
	.search-result .r-table .el-table__header-wrapper th, .search-result .r-table .el-table__header-wrapper tr{
		background-color: #aa9c94 !important;
		font-family: MicrosoftYaHei;
		font-size: 14px;
		color: #ffffff !important;
	}
	.search-result .el-table th, .search-result .el-table tr,.search-result .el-table td{
		text-align: center;
	}
	.el-table__body-wrapper .el-table__row{
		height: 105px;
	}
	.el-table_1_column_5{
		text-align: left !important;
	}
	.el-table__body-wrapper .el-table__row:nth-child(2n){
		background-color: #f8f5f2 !important;
	}
	.search-result .el-table__row td:nth-child(5){
		text-align: left!important;
	}
	.el-table .cell{
		overflow:hidden;
		text-overflow:ellipsis;
		display:-webkit-box;
		-webkit-box-orient:vertical;
		-webkit-line-clamp:3;
	}
	.search-result .el-table th, .search-result .el-table tr, .search-result .el-table td{
		cursor: pointer;
	}
	
	/* 省略号 */
	.el1{
	  overflow: hidden;
	  text-overflow:ellipsis;
	  white-space:nowrap;
	}
</style>
