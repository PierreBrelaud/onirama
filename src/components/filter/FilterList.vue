<template>
    <div class="list">
        <div 
            class="list__item"
            v-for="dream in data.hits.hits" :key="dream._id">
            <!-- left indicator -->
            <div class="list__item__indicator">
                <div class="circle"></div>
                <div class="line"></div>
            </div>
            <!-- content -->
            <div class="list__item__container">
                <div class="content">
                    <div class="content__header">
                        <div class="content__header__title">
                            {{ dream._source.title }}
                        </div>
                        <div class="content__header__date">
                            {{ displayTimestamp(dream._source.date) }}
                        </div>
                    </div>
                    <p class="content__text">
                        {{ dream._source.text }}
                    </p>
                </div>
                <!-- <ul>
                    <li 
                        v-for="(emotion, index) in dream._source.emotions"
                        :key="index">
                        {{ getSubEmotion(emotion.type, emotion.value).display }} &nbsp;
                    </li>
                </ul> -->
            </div>
        </div>
    </div>
</template>

<script>
import { getSubEmotion } from '@/utils/surveyData.js'
import { displayTimestamp } from '@/utils/dateHelper.js'

export default {
    data() {
        return {
        }
    },
    methods: {
        getSubEmotion(typeId, valueId) {
            return getSubEmotion(typeId, valueId)
        },
        displayTimestamp,
    },
    props: {
        data: {
            type: Object,
            required: true,
        }
    }
}
</script>

<style lang="scss" scoped>
.list {
    &__item {
        width: 100%;
        display: flex;
        margin-bottom: 20px;

        /*last item style*/
        &:last-child {
            .line {
                display: none;
            }
            .content {
                border-bottom: none;
            }
        }

        &__container {
            flex: 0 0 calc(100% - 5rem);

            .content {
                padding-right: 3rem;
                border-bottom: solid thin $C-light;

                &__header {
                    display: flex;
                    align-items: center;
                    &__title {
                        font-family: $F-canela;
                        font-weight: $FW-light;
                        font-size: 2rem;
                    }

                    &__date {
                        font-family: $F-canela;
                        font-weight: $FW-thin;
                        font-size: 1.4rem;
                        font-style: italic;
                        margin-left: auto;
                    }
                }   

                &__text {
                    margin: .5rem 0 2rem 0;
                }
            }
            
        }

        &__indicator {
            flex: 0 0 5rem;

            .circle {
                width: 1.8rem;
                height: 1.8rem;
                border-radius: 50%;
                margin: auto;
                background: $C-white;
                -webkit-box-shadow: 0px 0px 5px 0px $C-white; 
                box-shadow: 0px 0px 5px 0px $C-white;
            }
            .line {
                width: 1px;
                height: calc(100% - 2rem);
                background: $C-light;
                margin: 1rem auto 0 auto;
            }
        }
    }
}
</style>