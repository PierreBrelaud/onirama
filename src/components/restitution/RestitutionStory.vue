<template>
    <div class="story">
        <!-- title -->
        <input 
            v-model="storeData.title" 
            type="text" 
            class="story__title story__item" 
            placeholder="Nouveau rêve"
        />
        <!-- date -->
        <input 
            v-model="storeData.date"
            type="date" 
            class="story__date story__item"
        />
        <!-- text -->
        <textarea 
            v-model="storeData.text"
            class="story__text story__item" 
            placeholder="Récit de votre rêve"
        ></textarea>
    </div>
</template>

<script>
export default {
    watch: {
        storeData: {
            handler(value) {
                this.$store.commit('restitution/setData', value)
            },
            deep: true
        }
    },
    computed: {
        storeData() {
            return this.$store.getters['restitution/data']
        }
    }
}
</script>

<style lang="scss" scoped>
.story {
    width: 85%;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    height: 100%;

    &__item {
        margin-bottom: 2rem;
        outline: none;
        border: none;
        border-bottom: solid thin lightgrey;
        padding: 0.5rem 0;
    }

    &__title {
        font-weight: $FW-bold;
        font-size: 2.5rem;
    }

    &__date {
        font-style: italic;
        font-size: 1.2rem;
        width: 10rem;
    }

    &__text {
        font-style: italic;
        resize: none;
        flex-grow: 1;
        font-size: 1.4rem;
        line-height: 2rem;
    }
}
</style>