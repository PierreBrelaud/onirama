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
                        <!-- title -->
                        <div v-if="type === 'search'" v-html="formatHighlightedText(dream._source.title, 'title')" class="content__header__title">
                        </div>
                        <div v-else class="content__header__title">
                            {{ formatText(dream._source.title, 'title') }}
                        </div>
                        <!-- date -->
                        <div class="content__header__date">
                            {{ displayTimestamp(dream._source.date)}}
                        </div>
                    </div>
                    <!-- text -->
                    <p v-if="type === 'search'" class="content__text" v-html="formatHighlightedText(dream._source.text, 'text')">
                    </p>
                    <p v-else class="content__text">
                        {{ formatText(dream._source.text, 'text') }}
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
    mounted() {
        this.$nextTick(() => {
            window.addEventListener('resize', this.onResize);
        })
    },

    beforeUnmount() { 
        window.removeEventListener('resize', this.onResize); 
    },
    data() {
        return {
            windowWidth: window.innerWidth,
            highlightClass: {
                common: 'background-color: #A9BBCE;border-radius: 3px;',
                title: 'padding: .2rem 0;',
                text: "font-family:'Bellota Text', cursive;font-weight: 400;font-size: 1.6rem;padding: .05rem 0;"
            }
        }
    },
    methods: {
        onResize() {
            this.windowWidth = window.innerWidth;
        },
        formatText(value, type) {
            const count = this.getMaxCharToDisplay(type);
            const length = value.length;
            if(count <= length) {
                return value.substring(0, count - 3) + '...';
            }
            else {
                return value.substring(0, count);
            }
        },
        formatHighlightedText(value, type) {
            const count = this.getMaxCharToDisplay(type)
            return this.getHighlightedText(value, count, type);
        },
        getSubEmotion(emotionId, subEmotionId) {
            return getSubEmotion(emotionId, subEmotionId)
        },
        getMaxCharToDisplay(type) {
            const DIVIDERS = { title: 17, text: 5 }
            const divider = DIVIDERS[type];

            const count = Math.round(this.windowWidth / divider);
            return count;
        },
        getHighlightedText(str, count, type) {
            const search = this.searchValue.toLowerCase();
            //not search value
            if(!search) return;

            const strLength = str.length;
            const length = search.length;
            const start = str.toLowerCase().indexOf(search);
            const end = start + length;
            let res;
            const spanStart = `<span style="${this.highlightClass.common + this.highlightClass[type]}">`;
            const spanEnd = "</span>";

            //nothing found return
            if( start < 0) {
                res = (strLength <= count) ? str.substring(0, count) : str.substring(0, count - 3) + '...' ;
            }
            else {
                if(strLength <= count) {
                    res = str.substring(0, start) + spanStart + str.substring(start, end) + spanEnd + str.substring(end);
                }
                else {
                    //mot au début
                    if(end <= count) {
                        res = str.substring(0, start) + spanStart + str.substring(start, end) + spanEnd + str.substring(end, count - 3) + '...';
                    }
                    //mot à la fin
                    else {
                        //suffisament de caractères
                        if(start + count <= strLength) {
                            res = spanStart + str.substring(start, end) + spanEnd + str.substring(end, start + count - 3) + '...';
                        }
                        //pas assez de caractères
                        else {
                            res = '...' + str.substring(start - (start + count - strLength), start) +  spanStart + str.substring(start, end) + spanEnd + str.substring(end, start + count);
                        }
                    }
                }
            }
            return res;
        },
        displayTimestamp,
    },
    props: {
        type: {
            type: String,
            default: 'default',
        },
        searchValue: {
            type: String,
            required: false,
        },
        data: {
            type: Object,
            required: true,
        }
    },
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
                        margin-bottom: .5rem;
                        font-family: $F-canela;
                        font-weight: $FW-light;
                        font-size: 2rem;

                        &--highlighted {
                            font-family: $F-bellota;
                            font-weight: $FW-normal;
                            font-size: 1.6rem;
                            color: red!important;
                        }

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
                width: 1.5px;
                opacity: .5;
                height: calc(100% - 2rem);
                background: $C-light;
                margin: 1rem auto 0 auto;
            }
        }
    }
}
</style>