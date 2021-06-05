<template>
    <div class="restitution appview">
        <div class="restitution__header">
            <div class="restitution__header__item" @click="leave">Abandonner</div> 
        </div>
        <div class="restitution__content">
            <restitution-story v-if="current === 1"/>
            <restitution-labeling v-if="current === 2"/>
            <restitution-survey v-if="current === 3" :survey="feelingData"/>
            <restitution-survey  v-if="current === 4" :survey="wakeUpData"/>
        </div>
        <div class="restitution__footer">
            <!-- previous button -->
            <button 
                class="restitution__footer__button restitution__footer__button--previous" 
                @click="previous" 
                v-if="current > 1"
            >
                Précédent
            </button>
            <!-- next button -->
            <button 
                class="restitution__footer__button restitution__footer__button--next" 
                @click="next" 
                v-if="current < elementsCount"
            >
                Suivant
            </button>
            <!-- end button -->
            <button 
                class="restitution__footer__button restitution__footer__button--end" 
                @click="end"  
                v-if="current >= elementsCount"
            >
                Terminer
            </button>  
        </div>
    </div>
</template>

<script>
import RestitutionLabeling from '@/components/restitution/RestitutionLabeling.vue'
import RestitutionSurvey from '@/components/restitution/RestitutionSurvey.vue'
import RestitutionStory from '@/components/restitution/RestitutionStory.vue'
import { feeling, wakeUp } from '@/utils/restitutionData.js'
import DreamController from '@/firebase/db/DreamController.js'

export default {
    data() {
        return {
            elementsCount: 4,
            current: 1,
            feelingData: feeling,
            wakeUpData: wakeUp
        }
    },
    methods: {
        leave() {
            this.$router.push('/')
        },
        previous() {
            this.current -= 1
        },
        next() {
            this.current += 1
        },
        end() {
            this.$store.dispatch('loader/pending')
            DreamController.addDream(this.$store.getters['restitution/data'], 
            (result) => {
                this.$store.dispatch('loader/done')
                this.$router.push('/generation_pending')
            }, 
            (error) => {
                this.$store.dispatch('loader/done')
            })
        }
    },
    components: { RestitutionLabeling, RestitutionSurvey, RestitutionStory }
}
</script>

<style lang="scss" scoped>
.restitution {
    overflow: hidden;

    &__header, &__content, &__footer {
        position: fixed;
        width: 100%;
    }

    &__header {
        z-index: 2;
        top: 0;
        height: 10%;
        display: flex;
        align-items: center;
        font-size: 1.2rem;

        &__item {
            cursor: pointer;
            font-weight: $FW-bold;
            margin-left: auto;
            margin-right: 1rem;
        }
    }
    &__content { 
        top: 10%;
        height: 75%;
        overflow-x: scroll;
    }
    &__footer {
        z-index: 2;
        bottom: 0;
        height: 15%;
        left: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        &__button {
            font-size: 1.4rem;
            background: none;
            margin: 0 1rem;
            width: 14rem;
            height: 4rem;
            cursor: pointer;

            &--previous {
                color: grey;
                border: none;
            }

            &--next, &--end {
                color: black;
                border: solid .3rem black;
            }
        }
    }
}
</style> 