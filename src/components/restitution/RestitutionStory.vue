<template>
    <div class="story">
        <div class="story__header">
            <!-- title -->
            <input 
                v-model="storeData.title" 
                type="text" 
                class="input-sm story__header__title story__item" 
                placeholder="Nouveau rêve"
            />
            <!-- date -->
            <input 
                v-model="storeData.date"
                type="date" 
                placeholder="plop"
                class="input-sm story__header__date story__item"
            />
        </div>
        <!-- text -->
        <div class="story__content">
            <!-- <textarea 
                v-model="storeData.text"
                class="story__content__text story__item"
            ></textarea> -->
            <div contenteditable="true" id="paper"
                class="story__content__text story__item">
                I am trying to figure out how to add a border-bottom line for every row within a, however I am only able to get the very bottom row's border-bottom to do this.
            </div>
        </div>
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
    width: 100%;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    height: 100%;

    &__header {
        padding: 0 7.5%;

        &__title {
            width: 100%;
            text-align: left;
            margin-bottom: 2rem;
        }

        &__date {
            font-style: italic;
            font-size: 1.2rem;
            width: 10rem;
            margin-bottom: 2rem;
        }

        &__item {
            margin-bottom: 2rem;
            outline: none;
            border: none;
            border-bottom: solid thin lightgrey;
            padding: 0.5rem 0;
        }
    }

    &__content {
        padding-top: 2rem;
        flex-grow: 1;
        width: 100%;
        background-color: $C-wheat;

        &__text {
            resize: none;
            font-size: 1.4rem;
            line-height: 2rem;
            width: 85%;
            height: 100%;
            margin: auto;
            display: block;
            border: none;
            border-radius: 0;
            background-color: $C-wheat;
            color: $C-black;
            font-family: $F-bellota;
            font-weight: $FW-thin;
            font-size: 1.6rem;
            padding: 0rem .5rem 2rem 0;
            box-sizing: border-box;
            outline: none;
            background-size: 1px 2.2rem;
            line-height: 2.2rem;
            background-repeat: repeat;
            background-position: 0 0;  
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1 2.3rem'%3E%3Crect id='background' height='2.3rem' width='1' y='0' x='0' fill='none'/%3E %3Cline id='underline' y2='1rem' x2='0' y1='1rem' x1='1' stroke='%23001733' fill='none'/%3E %3C/svg%3E");
        }

        &__item {
            margin-bottom: 2rem;
            outline: none;
            border: none;
            border-bottom: solid thin lightgrey;
            padding: 0.5rem 0;
        }
    }
}
</style>