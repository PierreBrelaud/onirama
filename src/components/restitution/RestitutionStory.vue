<template>
    <div class="story">
        <!-- title -->
        <input 
            v-model="title" 
            type="text" 
            class="story__title story__item" 
            placeholder="Nouveau rêve"
        />
        <!-- date -->
        <input 
            v-model="date"
            type="date" 
            class="story__date story__item"
        />
        <!-- text -->
        <textarea 
            v-model="text"
            class="story__text story__item" 
            placeholder="Récit de votre rêve"
        ></textarea>
    </div>
</template>

<script>
export default {
    computed: {
        title: {
            get () {
                return this.$store.getters['restitution/title']
            },
            set (value) {
                this.$store.commit('restitution/setTitle', value)
            }
        },
        date: {
            get () {
                return this.$store.getters['restitution/date']
            },
            set (value) {
                this.$store.commit('restitution/setDate', value)
            }
        },
        text: {
            get () {
                return this.$store.getters['restitution/text']
            },
            set (value) {
                this.$store.commit('restitution/setText', value)
            }
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