<template>
    <div class="container" @click="click">
        <h2>Génération du rêve en cours revenir plus tard...</h2>
    </div>
</template>

<script>
export default {
    methods: {click() { this.$router.push('/generation_done')}}
}
</script>

<style lang="scss" scoped>
.container {
    cursor: pointer;
    position: absolute;
    top: 0;
    width: 100%;
    height: calc(100vh - 8rem);
    background: black;
    display: flex;
    justify-content: center;
    align-items: center;

    h2 {
        width: 80%;
        text-align: center;
        font-size: 2rem;
        color: white;
    }
}
</style>