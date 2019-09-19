<template>
	<div class="wrapper">
		<vHeader></vHeader>
		<leftNav></leftNav>
		<div class="content">
			 <transition name="fade" mode="out-in"><router-view></router-view></transition>
		</div>
	</div>
</template>

<script>
	import vHeader from './vHeader.vue'
	import leftNav from './leftNav.vue'

	export default {
		components: {
			vHeader , leftNav
		}
	}
</script>

<style>
	.content {
		    background: none repeat scroll 0 0 #f0f3f4;
		    position: absolute;
		    left: 200px;
		    right: 0;
		    top: 66px;
		    bottom: 0;
		    width: auto;
		    padding: 20px;
		    box-sizing: border-box;
		    overflow-y: scroll;
	}
</style>