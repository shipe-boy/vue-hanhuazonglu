<template>
  <div class="footer">
   <p class="top"><span class="mar-r">Copyright1986-2017 广西师范大学出版社 版权所有</span>桂ICP备12003475号-1 新出网证（桂）字002号  <a href="http://www.beian.miit.gov.cn/">公安机关备案号：45030202000033号</a></p>
	 <p class="bottom">地址：广西桂林市中华路22号   电话：0773-2808798</p>
  </div>
</template>

<script>
export default {
  data () {
    return {
      
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	.footer{
		width: 100%;
		height: 100px;
		background-color: #5f5f5f;
		font-family: MicrosoftYaHei;
		font-size: 14px;
		color: #fff;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
	}
	.footer>p{
		padding: 3px 0;
	}
	.mar-r{
		margin-right: 40px;
	}
	.top a{
		color: #fff;
	}
	.top a:hover{
		text-decoration: underline;
	}
</style>
