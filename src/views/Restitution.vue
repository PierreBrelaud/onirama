<template>
    <div class="restitution appview">
        <div class="restitution__header">
            <div class="restitution__header__item" @click="leave">Abandonner</div> 
        </div>
        <div class="restitution__content">
            <restitution-story v-if="current === 1"/>
            <restitution-labeling v-if="current === 2"/>
            <restitution-type 
                v-if="current === 3"
                @onDreamTypeClicked="onDreamTypeClicked"
            />
            <restitution-emotion v-if="current === 4" />
            <restitution-survey 
                v-if="current === 5" 
                :survey="memoryData"
                :title="'Le souvenir du rêve'"
                :count="3"
            />
            <restitution-survey  
                v-if="current === 6" 
                :survey="wakeUpData"
                :title="'Au réveil'"
                :count="4"
            />
        </div>
        <div 
            class="restitution__footer" 
            :class="{ 'restitution__footer--labeling' : current === 1 || current === 2}"
        >
            <!-- previous button -->
            <button 
                class="restitution__footer__button restitution__footer__button--previous" 
                :class="{
                    'restitution__footer__button--previousDark' : current > 2,
                    'restitution__footer__button--previousLight' : current > 2,
                }"
                @click="previous" 
                v-if="current > 1"
            >
                Précédent
            </button>
            <!-- next button -->
            <button 
                class="btn" 
                @click="next"
                v-if="current < elementsCount && current != 3"
            >
                Suivant
            </button>
            <!-- end button -->
            <button 
                class="btn restitution__footer__button" 
                @click="end"  
                v-if="current >= elementsCount"
            >
                Terminer
            </button>  
        </div>
    </div>
</template>

<script>
import RestitutionStory from '@/components/restitution/RestitutionStory.vue'
import RestitutionLabeling from '@/components/restitution/RestitutionLabeling.vue'
import RestitutionType from '@/components/restitution/RestitutionType.vue'
import RestitutionEmotion from '@/components/restitution/RestitutionEmotion.vue'
import RestitutionSurvey from '@/components/restitution/RestitutionSurvey.vue'
import { memory, wakeUp } from '@/utils/restitutionData.js'
import DreamController from '@/firebase/db/DreamController.js'
import { dateToFirestoreTimestamp } from '@/utils/dateHelper.js'

export default {
    data() {
        return {
            elementsCount: 6,
            current: 1,
            memoryData: memory,
            wakeUpData: wakeUp
        }
    },
    methods: {
        onDreamTypeClicked(id) {
            //store dream type
            let storeData = this.$store.getters['restitution/data'];
            storeData.type = id;
		    this.$store.commit('restitution/setData', storeData)
            //go to emotions
            this.current = 4;
        },
        leave() {
            this.$store.dispatch('labeling/destroy');
		    this.$store.commit('restitution/resetData')
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
            DreamController.addDream({
                publishDate: dateToFirestoreTimestamp(new Date()),
                isGenerated: false, 
                userId: this.$store.getters["auth/user"].data.uid,
                labelingData: this.$store.getters["labeling/instance"].getFinalData,
                ...this.$store.getters['restitution/data']
            }, 
            (result) => {
                this.$store.dispatch('loader/done')
                this.$router.push('/')
            }, 
            (error) => {
                this.$store.dispatch('loader/done')
            })
        }
    },
    components: { RestitutionStory, RestitutionLabeling, RestitutionType, RestitutionEmotion, RestitutionSurvey }
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
        top: 0;
        height: 8%;
        display: flex;
        align-items: center;
        font-size: 1.2rem;

        &__item {
            cursor: pointer;
            font-family: $F-bellota;
            font-weight: $FW-bold;
            font-size: 1.6rem;
            margin-left: auto;
            margin-right: 1rem;
        }
    }
    &__content { 
        top: 8%;
        height: calc(92% - 8rem);
        overflow-x: scroll;
    }
    &__footer {
        bottom: 0;
        height: 8rem;
        left: 0;
        display: flex;
        justify-content: center;
        align-items: center;

        &--labeling {
            background-color: $C-wheat;
        }

        &__button {
            margin: 0 1rem;
            width: 14rem;
            cursor: pointer;

            &--previous {
                background: none;
                color: $C-extradark;
                font-family: $F-bellota;
                font-weight: $FW-light;
                font-size: 1.8rem;
                border: none;
            }

            &--previousDark {
                color: $C-extradark;
            }

            &--previousLight {
                color: $C-white;
            }
        }
    }
}
</style> 