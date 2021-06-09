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
            <div
                ref="text"
                contenteditable="true" 
                @input="updateTextValue"
                class="story__content__text story__item">
            </div>
        </div>
    </div>
</template>

<script>
export default {
    beforeMount() {
        const today = new Date()
        const localDateString = today.toLocaleString().substring(0, 10)
        const todayFormattedDate = 
            localDateString.substring(6, 10) + '-' + 
            localDateString.substring(3, 5) + '-' + 
            localDateString.substring(0, 2)

        this.storeData.date = todayFormattedDate;
    },
    mounted() {
        this.$refs.text.innerText = this.storeData.text;
    },
    methods: {
        updateTextValue(ev) {
            this.storeData.text = ev.target.innerText;
        }
    },
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

        &__text, &__text > div {
            color: $C-black;
            font-family: $F-bellota;
            font-weight: $FW-thin;
            font-size: 1.9rem;
        }

        &__text {
            resize: none;
            line-height: 2rem;
            width: 85%;
            height: 100%;
            margin: auto;
            display: block;
            border: none;
            border-radius: 0;
            background-color: $C-wheat;
            padding: 0rem .5rem 2rem 0;
            box-sizing: border-box;
            outline: none;
            line-height: 3rem;
            background-size: 1px 3rem;
            background-repeat: repeat;
            background-position: 0 2.1rem;  
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1 3rem'%3E%3Crect id='background' height='0' width='1' y='0' x='0' fill='none'/%3E %3Cline id='underline' y2='1' x2='0' y1='1' x1='1' opacity='0.1' stroke='%23001733' fill='none'/%3E %3C/svg%3E");
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