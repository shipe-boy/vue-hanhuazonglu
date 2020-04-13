<template>
  <div class="searching">
	<select-type></select-type>
	<select-result></select-result>
  </div>
</template>

<script>
import SelectType from '../components/SelectType.vue'
import SelectResult from '../components/SelectResult.vue'
export default {
  data () {
    return {
      
    }
  },
  components: {
	  SelectType,
	  SelectResult
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	.searching{
		width: 1200px;
		min-height: calc(100vh - 100px - 152px - 60px);
		margin: 20px auto 40px;
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
	}
</style>
