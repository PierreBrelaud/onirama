<template>
	<div class="nebula__filter">
        <div class="nebula__filter__back" v-if="step !== 0 && step !== null" @click="onBackClicked">
			<img src="@/assets/images/icons/right_arrow.png" alt="">
		</div>
		<!-- nebula emotions -->
		<div class="nebula" v-if="step === 0">
			<div
				class="nebula__container"
				v-for="emotion in emotionsData"
				:key="emotion.id"
			>
				<div class="nebula__container__particles">
					<particles
						:id="'nebula__particles-' + emotion.id"
						:count="getParticlesCount(emotion.count, 4)"
					/>
				</div>
				<div
					class="nebula__container__infos"
					@click="onEmotionClicked(emotion.id)"
				>
					<h2 
                        :style="getParticlesFont('title', emotion.count, 4)"
                    >
                        {{ emotion.display }}
                    </h2>
					<p
                        :style="getParticlesFont('subTitle', emotion.count, 4)"
                    >   
                        {{ emotion.count }}
                    </p>
				</div>
			</div>
		</div>
		<!-- nebula sub emotions -->
		
		<div class="nebula" v-if="step === 1">
			<div
				class="nebula__container"
				v-for="subEmotion in subEmotionsData"
				:key="subEmotion.id"
			>
				<div class="nebula__container__particles">
					<particles
						:id="'nebula__particles-' + subEmotion.id + '-' + subEmotion.id"
						:count="getParticlesCount(subEmotion.count, 4)"
					/>
				</div>
				<div
					class="nebula__container__infos"
					@click="onSubEmotionClicked(subEmotion.id)"
				>
					<h2 
                        :style="getParticlesFont('title', subEmotion.count, 4)"
                    >
                        {{ subEmotion.display }}
                    </h2>
					<p
                        :style="getParticlesFont('subTitle', subEmotion.count, 4)"
                    >   
                        {{ subEmotion.count }}
                    </p>
				</div>
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
import Particles from "@/components/filter/FilterNebulaParticles.vue";

export default {
	methods: {
        getParticlesFont(type, currentCount, totalCount) {
            const [min, max] = (type === 'title') ? [1.4, 3] : [1, 2];
			//case no data
			if (currentCount === 0) return `font-size:${min}rem;`;
            const percent = (currentCount * 100) / totalCount; 
			const count = (percent * (max - min) / 100) + min * (percent/100 + 1);
            return `font-size:${count}rem;`;
        },
		getParticlesCount(currentCount, totalCount) {
			//case no data
			if (currentCount === 0) return 0;
			const [min, max] = [3, 50];
            const percent = (currentCount * 100) / totalCount; 
			const count = (percent * (max - min) / 100) + min;
			return Math.round(count);
		},
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
			this.tempStep -= 1;
		},
		onEmotionClicked(emotionId) {
			this.setStoreData({
				step: 1,
				emotionId: emotionId,
				subEmotionId: null,
			});
			this.tempStep = 1;
		},
		onSubEmotionClicked(subEmotionId) {
			this.setStoreData({
				step: 2,
				emotionId: this.getEmotionId(),
				subEmotionId: subEmotionId,
			});
			this.tempStep = 2;
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
			this.emotionsData = emotions.data;
		},
		async getSubEmotionsCount() {
			const emotionId = this.getEmotionId();
			const subEmotions = await this.cfGetSubEmotionsCount({
				userId: this.getUserId(),
				subEmotions: getAllSubEmotions(emotionId),
				emotionId: emotionId,
			});
			this.subEmotionsData = subEmotions.data;
		},
		async getDreams() {
			const dreams = await this.cfGetDreams({
				userId: this.getUserId(),
				emotionId: this.getEmotionId(),
				subEmotionId: this.getSubEmotionId(),
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
		this.tempStep = 0;
	},
	data() {
		return {
			cfGetEmotionsCount: functions.httpsCallable("emotionCount"),
			cfGetSubEmotionsCount: functions.httpsCallable("subEmotionCount"),
			cfGetDreams: functions.httpsCallable("getDreamByEmotion"),
			step: null,
			tempStep: null,
			emotionsData: null,
			subEmotionsData: null,
			dreamsData: null,
		};
	},
	watch: {
		subEmotionsData: function(val) {
		},
		tempStep: function (val) {
			this.setState(val);
		},
	},
	components: { FilterList, Particles },
};
</script>

<style lang="scss" scoped>

.nebula__filter {

	&__back {
		z-index: 2;
		cursor: pointer;
		position: fixed;
		height: 3rem;
		top: 0.5rem;
		left: 0.5rem;
	}
}
.nebula {
	background: $C-extradark;
	background: linear-gradient(
		180deg,
		#122131 0%,
		#102130 10%,
		#0f202f 20%,
		#0d202f 30%,
		#0c202e 40%,
		#0a202d 50%,
		#091f2c 60%,
		#081f2b 70%,
		#071f2a 80%,
		#061e29 90%,
		#051e28 100%
	);
	display: flex;
	align-items: stretch;
	flex-direction: column;
	justify-content: space-between;
	align-items: left;

	&__container {
		position: relative;
		height: 50vw;
		width: 50vw;
		flex-shrink: 0;

		&:nth-child(odd):not(:first-child) {
			margin-top: -25vw;
		}

		&:nth-child(even) {
            border: none;
			align-self: flex-end;
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
			text-align: center;
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
		}
	}
}
</style>
