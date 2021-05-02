<template>
    <h1>Labelisation</h1>
    <div class="labeling__display">
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
            <button @click="labeling('action')">action</button>
            <button @click="labeling('person')">person</button>
            <button @click="labeling('place')">place</button>
        </div>
    </div>
    <!-- {{ labeledText }} -->
    <!-- <div v-if="isLabeling" class="labeling">
        <span
            v-for="wordData in labeledText" :key="wordData"
            class="labeling__word" 
            :class="`labeling__word--${wordData.label}`"
            @click="label(wordData)"
        >
            {{wordData.value}}
        </span>
    </div>
    <div>
        <button v-if="isLabeling && !isLabelingActive" @click="labelingWords">Labeliser</button><br/><br/>
        <div v-if="isLabelingWords && !isLabelingActive">
            <button @click="labeling('action')">action</button>
            <button @click="labeling('person')">person</button>
            <button @click="labeling('place')">place</button>
        </div>
        <div v-if="isLabelingActive">
            {{ labelingType }}
            <button @click="validateLabeling">valider</button>
        </div>
    </div> -->
</template>

<script>

import LabelingHelper from '@/utils/labelingHelper.js'

export default {
    beforeMount() {
        this.labelingHelper.text = this.initialtext
        console.log(this.textLabeled)
    },
    data() {
        return {
            currentLabel: null,
            isLabeling: false,
        }
    },
    methods: {
        labelize(data) {
            if(this.currentLabel !== null) {
                console.log("ok", data)
            }
            // if(wordData.canBeLabeled && this.isLabelingActive) {
            //     this.labelingHelper.labelWord(wordData, this.labelingType)
            //     this.labeledText = this.labelingHelper.textLabeled
            //     this.$forceUpdate()
            // }
        },
        labelingWords() {
            this.isLabelingWords = !this.isLabelingWords
        },
        test() {
            this.isLabeling = !this.isLabeling

            if(this.isLabeling) {
                //set new text
                this.labelingHelper.text = this.textArea
                //get labeled text
                this.labeledText = this.labelingHelper.textLabeled
            }
            else {
                this.isLabelingActive = false
            }
        },
        // labelize(wordData) {
        //     if(wordData.canBeLabeled && this.isLabelingActive) {
        //         this.labelingHelper.labelWord(wordData, this.labelingType)
        //         this.labeledText = this.labelingHelper.textLabeled
        //         this.$forceUpdate()
        //     }
        // },
        labeling(type) {
            this.isLabelingActive = true
            this.labelingType = type
        },
        validateLabeling() {
            this.isLabelingActive = false
        }
    },
    computed: {
        labelingHelper() {
            return new LabelingHelper()
        },
        textLabeled() {
            return this.labelingHelper.textLabeled
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
    .labeling__display {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;

        &__word {
            font-size: 2em;
            margin-top: 0.2em;
            margin-right: 0.2em;

            &--default {
                border: solid thin lightgray;
            }

            &--special {
                margin-left: -0.2em;
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
</style>