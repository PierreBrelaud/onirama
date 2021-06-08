<template>
    <div class="container">
        <div class="container__header">
            <h1>Dans mon rêve je me suis senti</h1>
            <restitution-bullet :count="5" :active="2"/>
            <p>Qu'elles étaient les 3 émotions principales de votre rêve ?</p>
        </div>
        <div class="container__list">
            <!-- emotions -->
            <div 
                class="container__list__emotion emotion"
                :class="{
                    'completed' : !checkEmotionsAvailable(), //check if 3 emotions are selected
                    'active': onMountedCheckEmotion(emotion.id)
                }"
                v-for="emotion in data" :key="emotion.id"
            >
               <h2 
                @click.stop="onEmotionClicked"
                class="emotion__title"
                >
                    {{emotion.display}}
                </h2>
               <div class="emotion__data">
                   <!-- sub emotions -->
                   <div
                    v-for="subemotion in emotion.data" :key="subemotion.id"
                    class="emotion__data__subemotion subemotion">
                        <span 
                            class="subemotion__item"
                            :class="{
                                'subemotion__item--active' : isSubEmotionActive(emotion.id, subemotion.id)
                            }"
                            @click="onSubEmotionClicked(ev, emotion.id, subemotion.id)">
                            {{ subemotion.display }}
                        </span>
                   </div>
               </div>
            </div>
        </div>
    </div>
</template>

<script>
import { dreamEmotions } from '@/utils/surveyData.js'
import RestitutionBullet from '@/components/restitution/RestitutionBullet.vue'

export default {
    data() {
        return {
            data: dreamEmotions,
            emotions: [
                {emotionId: 0, subEmotionId: 2},
                {emotionId: 1, subEmotionId: 0},
                {emotionId: 2, subEmotionId: 0}
            ]
        }
    },
    methods: {
        onMountedCheckEmotion(emotionId) {
            return this.emotions.some(e => e.emotionId === emotionId);
        },
        onSubEmotionClicked(ev, emotionId, subEmotionId) {
            console.log(emotionId, subEmotionId)
        },
        onEmotionClicked(ev) {
            ev.currentTarget.parentNode.classList.toggle('active')
        },
        checkEmotionsAvailable() {
            return this.emotions.some(e => this.isEmptyObject(e));
        },
        isEmptyObject(obj) {
            return Object.keys(obj).length === 0 && obj.constructor === Object;
        },
        isSubEmotionActive(emotionId, subEmotionId) {
            return this.emotions.some(e => e.emotionId === emotionId && e.subEmotionId === subEmotionId);
        }
    },
    props: {
        typeId: {
            type: Number,
            required: true,
        }
    },
    components: { RestitutionBullet }
}
</script>

<style lang="scss" scoped>
.container {
    &__header {
        h1 {
            text-align: center;
            width: 60%;
            margin: auto;
            font-size: 3rem;
        }

        p {
            width: 55%;
            margin: -1rem auto 2rem auto;
            text-align: center;
            font-size: 1.4rem;
            color: $C-light;
        }
    }

    &__list {

        &__emotion {
            border-top: solid $C-dark 1px;
            padding: 2rem 0;
            text-align: center;
            cursor: pointer;
        }
    }


    //emotion active
    .emotion.active {
        
        .emotion__title {
            text-shadow: #FFF 0px 0 4px;
            color: $C-white;
        }

        .emotion__data {
            height: 5rem;
            opacity: 1;
        }
    }

    //all emotions selected
    .emotion.completed {
        .subemotion__item {
            color: rgba($color: $C-light, $alpha: .5);
        }
    }
    
    .emotion {

        &__title {
            transition: all .2s;
            margin-bottom: 0rem;
            color: $C-light;
        }

        &__data {
            transition: all .2s;
            height: 0;
            opacity: 0;
            display: flex;
            justify-content: space-around;
            align-items: center;
        }
    }

    .subemotion {
        font-family: $F-bellota;
        font-size: 1.4rem;

        &__item {
            &--active {
                color: red!important;
            }
        }
    }
}
</style>