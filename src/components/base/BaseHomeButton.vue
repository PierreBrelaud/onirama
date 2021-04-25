<template>
    <div 
        class="home__button" 
        @click="action"
    >
        <div class="home__button__icon">
            {{ icon }}
        </div>
    </div>
</template>

<script>
export default {
    props: {
        action: {
            type: Function,
            required: true,
        },
        icon: {
            type: String,
            required: true,
        }
    }
}
</script>

<style lang="scss" scoped>

.home__button {
    cursor: pointer;
    display: flex;
    width: 30px;
    height: 30px;
    margin: 10px;
    border-radius: 50%;
    background: lightgrey;
    position: relative;

    &__icon {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
}
</style>