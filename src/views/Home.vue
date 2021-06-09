<template>
    <div class="home appview">
        
    </div>
</template>

<script>
import BaseHomeButton from '@/components/base/BaseHomeButton.vue'

export default {
    components: {
        BaseHomeButton
    },
    methods: {
        btn1Clicked() {
            this.$store.dispatch('loader/pending')
            setTimeout(() => {
                this.$store.dispatch('loader/done')
            }, 2000);
            console.log('button 1 clicked')
        },
        btn2Clicked() {
            console.log('button 2 clicked')
        },
        btn3Clicked() {
            console.log('button 3 clicked')
        },
    }
}
</script>

<style lang="scss" scoped>
.home {
    background: url('@/assets/images/home.png') no-repeat center center fixed; 
    -webkit-background-size: cover;
    -moz-background-size: cover;
    -o-background-size: cover;
    background-size: cover;
    width: 100%;
}
.home__buttons {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}
</style>