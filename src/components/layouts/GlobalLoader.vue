<template>
    <div class="loader">
        <!-- <div class="loader__icon"></div> 
        <h1 class="loader__title">
            onirama
        </h1>-->
        <div class="loader__lottie"></div>
    </div>
</template>

<script>
import lottie from 'lottie-web'

export default {
    mounted(){
        lottie.loadAnimation({
            container: document.querySelector('.loader__lottie'),
            renderer: 'svg',
            loop: true,
            autoplay: true,
            path: '/onirama-loader.json'
        })
    }
}
</script>

<style lang="scss" scoped>
.loader {
    z-index: 3;
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba($color: #000000, $alpha: 0.5);
    color: white;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    &__icon {
        width: 5rem;
        height: 5rem;
        background: white;
        -webkit-mask: url('@/assets/images/icons/micro.svg') no-repeat center;
        mask: url('@/assets/images/icons/micro.svg') no-repeat center;
    }

    &__title {
        font-size: 4rem;
    }
    &__lottie {
        z-index:4;
        width: 20rem;
    }
}
</style>