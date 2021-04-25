<template>
    <div class="loader">
        <div class="loader__icon">
            icon
        </div>
        <h1 class="loader__title">
            Onirama
        </h1>
    </div>
</template>

<script>
export default {

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
    background: black;
    color: white;
}
</style>