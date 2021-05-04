<template>
    <h1>Labelisation</h1>
    <div class="labeling">
        <div class="labeling__display">
            <!-- <h1 class="labeling__display__title">plop</h1> -->
            <span
                v-for="word in textLabeled" :key="word"
                class="labeling__display__word" 
                :class="`labeling__display__word--${word.label}`"
                @click="labelize(word)"
            >
                {{word.value}}
            </span>
        </div>
        <div class="labeling__actions">
            <div v-if="!isLabeling">
                <button @click="currentLabel = 'action'">action</button>
                <button @click="currentLabel = 'person'">person</button>
                <button @click="currentLabel = 'place'">place</button>
            </div>
        </div>
        <div v-if="currentLabel"> {{ currentLabel }} </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
    beforeMount() {
        this.helper = this['labeling/instance']
        this.helper.text = this.initialtext
    },
    data() {
        return {
            currentLabel: null,
            isLabeling: false,
            helper: null,
        }
    },
    methods: {
        labelize(data) {
            if(data.canBeLabeled && this.currentLabel !== null) {
                this.helper.labelWord(data, this.currentLabel)
                this.$forceUpdate()
            }
        },
        labelingWords() {
            this.isLabelingWords = !this.isLabelingWords
        },
        labeling(type) {
            this.isLabelingActive = true
            this.labelingType = type
        },
        validateLabeling() {
            this.isLabelingActive = false
        }
    },
    computed: {
        ...mapGetters([
            'labeling/instance',
        ]),
        textLabeled() {
            return this.helper.textLabeled
        }
    },
    props: {
        initialtext: {
            type: String,
            required: true,
        }
    }
}
</script>


<style lang="scss" scoped>
.labeling {

    &__display {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;

        &__word {
            font-size: 1.5rem;
            margin-top: 0.2rem;
            margin-right: 0.2rem;

            &--default {
                border: solid thin lightgray;
            }

            &--special {
                margin-left: -0.2rem;
            }

            &--action {
                background: red;
            }
            &--person {
                background: blue;
            }
            &--place {
                background: green;
            }
        }

        &__toggle {
        }
    }
}
</style>