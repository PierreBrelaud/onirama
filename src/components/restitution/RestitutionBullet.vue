<template>
    <div class="list">
        <div 
            class="list__item" :class="{'list__item--active' : index <= active}" 
            v-for="index in count" :key="index">
        </div>
    </div>
</template>

<script>
export default {
    props: {
        count: {
            type: Number,
            required: true,
        },
        active: {
            type: Number,
            required: true,
        }
    }
}
</script>

<style lang="scss" scoped>

.list {
    display: flex;
    justify-content: center;
    margin: 1rem 0 2rem 0;

    &__item {
        width: 4px;
        height: 4px;
        border-radius: 50%;
        margin: 0 1px;
        border: solid thin $C-white;

        &--active {
            background-color: $C-white;
        }
    }
}

</style>