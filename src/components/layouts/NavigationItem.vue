<template>
    <router-link :to="url">
        <div class="navigation__item">
            <div class="navigation__item__title">
                {{ name }}
            </div>
        </div>
    </router-link>
</template>

<script>
export default {
    props: {
        url: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        icon: {
            type: String,
            required: false,
        },
    },
};
</script>


<style lang="scss" scoped>

.navigation__item {
    padding: 3px;
    &.router-link-active {
        background: lightslategray;
    }

    &__title {
        color: white;
    }
}

</style>