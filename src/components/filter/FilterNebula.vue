<template>
    <div class="nebula__filter">
        <!-- <button @click="clear">clear</button>
        <div v-if="step !== 0" @click="onBackClicked">BACK</div>
        <div>
            <p>step - {{ step }}</p>
        </div> -->
        <!-- nebula emotions -->
        <div class="nebula" v-if="step === 0">
            <div class="nebula__container" v-for="emotion in emotionsData" :key="emotion.id">
                <!-- {{emotion}} -->
                <div class="nebula__container__particles">
                    <particles 
                        :id="'nebula__particles-' + emotion.id"
                        :count='3'
                    />
                </div>
                <div 
                    class="nebula__container__infos"
                    @click="onEmotionClicked(emotion.id)"
                >
                    <h2>{{ emotion.display }}</h2>
                    <p>{{ emotion.count }}</p>
                </div>
            </div>
        </div>
        <!-- nebula sub emotions -->
        <div v-if="step === 1">
            <div v-for="emotion in subEmotionsData" :key="emotion.id">
                <p @click="onSubEmotionClicked(emotion.typeId, emotion.id)">
                    {{ emotion.display }} - {{ emotion.count }}
                </p>
            </div>
        </div>
        <!-- list -->
        <filter-list v-if="step === 2 && dreamsData" :data="dreamsData" />
    </div>
</template>

<script>
import { getAllEmotions, getAllSubEmotions } from "@/utils/surveyData";
import { functions } from "@/firebase";
import FilterList from "@/components/filter/FilterList.vue";
import Particles from '@/components/filter/FilterNebulaParticles.vue';

export default {
    methods: {
        onBackClicked() {
            if (this.step === 1) {
                this.setStoreData({
                    step: 0,
                    emotionId: null,
                    subEmotionId: null,
                });
            }
            if (this.step === 2) {
                this.setStoreData({
                    step: 1,
                    emotionId: this.getEmotionId(),
                    subEmotionId: null,
                });
            }
            this.step -= 1;
        },
        onEmotionClicked(emotionId) {
            this.setStoreData({
                step: 1,
                emotionId: emotionId,
                subEmotionId: null,
            });
            this.step = 1;
        },
        onSubEmotionClicked(emotionId, subEmotionId) {
            this.setStoreData({
                step: 2,
                emotionId: emotionId,
                subEmotionId: subEmotionId,
            });
            this.step = 2;
        },
        async setState(step) {
            if (step === 0) {
                await this.setEmotionStep();
            }
            if (step === 1) {
                await this.setSubEmotionStep();
            }
            if (step === 2) {
                await this.setDreamStep();
            }
            this.step = step;
        },
        async setEmotionStep() {
            //if no data fetch
            if (!this.emotionsData) {
                await this.fetchData("emotion");
            }
        },
        async setSubEmotionStep() {
            await this.fetchData("subEmotion");
        },
        async setDreamStep() {
            await this.fetchData("dream");
        },
        async fetchData(type) {
            //init loader
            // this.$store.dispatch('loader/pending');

            switch (type) {
                case "emotion":
                    await this.getEmotionsCount();
                    break;
                case "subEmotion":
                    await this.getSubEmotionsCount();
                    break;
                case "dream":
                    await this.getDreams();
                    break;
                default:
                    break;
            }
            //close loader
            // this.$store.dispatch('loader/done');
        },
        async getEmotionsCount() {
            const emotions = await this.cfGetEmotionsCount({
                userId: this.getUserId(),
                emotions: getAllEmotions(),
            });
            console.log(emotions)
            this.emotionsData = emotions.data;
        },
        async getSubEmotionsCount() {
            const subEmotions = await this.cfGetSubEmotionsCount({
                userId: this.getUserId(),
                emotions: getAllSubEmotions(this.getEmotionId()),
                typeId: this.getEmotionId(),
            });
            this.subEmotionsData = subEmotions.data;
        },
        async getDreams() {
            const dreams = await this.cfGetDreams({
                userId: this.getUserId(),
                valueId: this.getSubEmotionId(),
                typeId: this.getEmotionId(),
            });
            this.dreamsData = dreams.data;
        },
        clear() {
            this.$store.commit("filter/clearNebula");
        },
        getEmotionId() {
            return this.$store.getters["filter/nebulaData"].emotionId;
        },
        getSubEmotionId() {
            return this.$store.getters["filter/nebulaData"].subEmotionId;
        },
        setStoreData(data) {
            this.$store.commit("filter/setNebulaData", data);
        },
        getUserId() {
            return this.$store.getters["auth/user"].data.uid;
        },
    },
    beforeMount() {
        this.setState(this.$store.getters["filter/nebulaData"].step);
        // this.step = 0;
    },
    data() {
        return {
            cfGetEmotionsCount: functions.httpsCallable("emotionTypeCount"),
            cfGetSubEmotionsCount: functions.httpsCallable("emotionValueCount"),
            cfGetDreams: functions.httpsCallable("getDreamByEmotion"),
            step: null,
            emotionsData: null,
            // testData: [
            //     {
            //         id: 0,
            //         value: "fear",
            //         display: "Peur",
            //         count: 5,
            //     },
            //     {
            //         id: 1,
            //         value: "anger",
            //         display: "Colère",
            //         count: 6,
            //     },
            //     {
            //         id: 2,
            //         value: "surprise",
            //         display: "Surprise",
            //         count: 4,
            //     },
            //     {
            //         id: 3,
            //         value: "disgust",
            //         display: "Dégout",
            //         count: 6,
            //     },
            //     {
            //         id: 4,
            //         value: "sadness",
            //         display: "Tristesse",
            //         count: 5,
            //     },
            //     {
            //         id: 5,
            //         value: "joy",
            //         display: "Joie",
            //         count: 4,
            //     },
            // ],
            subEmotionsData: null,
            dreamsData: null,
        };
    },
    watch: {
        step: function (val) {
            this.setState(val);
        },
    },
    components: { FilterList, Particles },
};
</script>

<style lang="scss" scoped>

.nebula {
    background: $C-extradark;
    background: linear-gradient(180deg, #122131 0%,#102130 10%,#0f202f 20%,#0d202f 30%,#0c202e 40%,#0a202d 50%,#091f2c 60%,#081f2b 70%,#071f2a 80%,#061e29 90%,#051e28 100%);
    display: flex;
    align-items: stretch;
    flex-direction: column;
    justify-content: space-between;
    align-items: left;

    &__container {
        position: relative;
        height: 50vw;
        width: 50vw;
        // border: solid thin blue;
        flex-shrink: 0;

        &:nth-child(odd):not(:first-child) {
            margin-top: -25vw;
        }
        
        &:nth-child(even) {
            align-self: flex-end;
            // border: solid thin green;
            margin-top: -25vw;
            margin-right: 0;
        }

        &__particles {
            position: absolute;
            width: 70%;
            height: 70%;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
        }

        &__infos {
            // border: solid thin orange;
            text-align: center;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
        }
    }
}
</style>


