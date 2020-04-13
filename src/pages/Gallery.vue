<template>
	<div class="gallery">
		<select-type></select-type>
		<picture-flow></picture-flow>
	</div>
</template>

<script>
	import SelectType from '../components/SelectType.vue'
	import PictureFlow from '../components/PictureFlow.vue'
	export default {
		data() {
			return {

			}
		},
		components: {
			SelectType,
			PictureFlow
		}
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	.gallery{
		    width: 1200px;
		    margin: 20px auto 40px;
		    display: flex;
		    justify-content: space-between;
		    align-items: flex-start;
	}
</style>
