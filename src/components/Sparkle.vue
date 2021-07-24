<template>
  <div class="sparkleWrapper" :style="appliedStyle">
    <svg :width="size" :height="size" viewBox="0 0 160 160" fill="none" class="sparkle">
      <path
        d="M80 0C80 0 84.2846 41.2925 101.496 58.504C118.707 75.7154 160 80 160 80C160 80 118.707 84.2846 101.496 101.496C84.2846 118.707 80 160 80 160C80 160 75.7154 118.707 58.504 101.496C41.2925 84.2846 0 80 0 80C0 80 41.2925 75.7154 58.504 58.504C75.7154 41.2925 80 0 80 0Z"
        :fill="color"
      />
    </svg>
  </div>
</template>

<script>


export default {
	name: "Sparkle",
	props: {
		size: Number,
		appliedStyle: Object,
		color: String
	},
	mounted () {
		window.setTimeout(() => {
			this.$destroy();
			this.$el.parentNode.removeChild(this.$el);
		}, 600);
	}
};
</script>

<style scoped>
    .sparkleWrapper{
        position: absolute;
        pointer-events: none;
        z-index: 2;
        animation: growAndShrink 600ms ease-in-out forwards;
    }
    .sparkleWrapper>svg.sparkle{
        animation: spin 600ms linear forwards;
    }
    @keyframes growAndShrink {
        0% {
            transform: scale(0);
        }
        50% {
            transform: scale(1);
        }
        100% {
            transform: scale(0);
        }
    }
    @keyframes spin {
        from {
            transform: rotate(0deg);
        }
        to {
            transform: rotate(180deg);
        }
    }
</style>