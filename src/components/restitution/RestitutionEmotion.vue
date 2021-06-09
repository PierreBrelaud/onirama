<template>
	<div class="container">
		<div class="container__header">
			<h1>Dans mon rêve je me suis senti</h1>
			<restitution-bullet :count="5" :active="2" />
			<p>Qu'elles étaient les 3 émotions principales de votre rêve ?</p>
		</div>
		<div
			class="container__list"
			:class="{ completed: !checkEmotionsAvailable() }"
		>
			<!-- emotions -->
			<div
				v-for="emotion in data"
				:key="emotion.id"
				:data-emotionId="emotion.id"
				:ref="setEmotionsRef"
				class="container__list__emotion emotion"
			>
				<h2 
                    @click.stop="onEmotionClicked" 
                    class="emotion__title"
                    :class="{'emotion__title--active' : isEmotionActive(emotion.id)}">
					{{ emotion.display }}
				</h2>
				<div class="emotion__data">
					<!-- sub emotions -->
					<div
						v-for="subemotion in emotion.data"
						:key="subemotion.id"
						class="emotion__data__subemotion subemotion"
					>
						<span
							class="subemotion__item"
							:class="{
								'subemotion__item--active': isSubEmotionActive(
									emotion.id,
									subemotion.id
								),
							}"
							@click="
								onSubEmotionClicked(emotion.id, subemotion.id)
							"
						>
							{{ subemotion.display }}
						</span>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { dreamEmotions } from "@/utils/surveyData.js";
import RestitutionBullet from "@/components/restitution/RestitutionBullet.vue";

export default {
	beforeMount() {
		this.emotionsRef = [];
	},
	mounted() {
		//init visible emotions with store data
		this.emotionsRef.forEach((el) => {
			const emotionId = el.getAttribute("data-emotionId");
            if(this.isEmotionActive(parseInt(emotionId))) {
                el.classList.add('expand')
            }
		});
	},
	data() {
		return {
			data: dreamEmotions,
			emotionsRef: [],
			mounted: false,
		};
	},
	watch: {
		storeData: {
			handler(value) {
				this.$store.commit("restitution/setData", value);
			},
			deep: true,
		},
	},
	computed: {
		storeData() {
			return this.$store.getters["restitution/data"];
		},
	},
	methods: {
		setEmotionsRef(el) {
			if (el) {
				this.emotionsRef.push(el);
			}
		},
		onEmotionClicked(ev) {
			ev.currentTarget.parentNode.classList.toggle("expand");
		},
		onSubEmotionClicked(emotionId, subEmotionId) {
			//no space available
			if (!this.checkEmotionsAvailable()) {
				if (this.isSubEmotionActive(emotionId, subEmotionId)) {
					this.removeSubEmotion(emotionId, subEmotionId);
				} else return;
			} else {
				if (this.isSubEmotionActive(emotionId, subEmotionId)) {
					this.removeSubEmotion(emotionId, subEmotionId);
				} else {
					this.addSubEmotion(emotionId, subEmotionId);
				}
			}
		},
		removeSubEmotion(emotionId, subEmotionId) {
			const index = this.getIndexBySubEmotion(emotionId, subEmotionId);
			this.storeData.emotions[index] = {};
		},
		addSubEmotion(emotionId, subEmotionId) {
			const index = this.getFirstAvailableIndex();
			this.storeData.emotions[index] = {
				emotionId: emotionId,
				subEmotionId: subEmotionId,
			};
		},
		checkEmotionsAvailable() {
			return this.storeData.emotions.some((e) => this.isEmptyObject(e));
		},
		getFirstAvailableIndex() {
			return this.storeData.emotions.findIndex(this.isEmptyObject);
		},
		isEmptyObject(obj) {
			return Object.keys(obj).length === 0 && obj.constructor === Object;
		},
		getIndexBySubEmotion(emotionId, subEmotionId) {
			return this.storeData.emotions.findIndex(
				(e) =>
					e.emotionId === emotionId && e.subEmotionId === subEmotionId
			);
		},
		isSubEmotionActive(emotionId, subEmotionId) {
			return this.storeData.emotions.some(
				(e) =>
					e.emotionId === emotionId && e.subEmotionId === subEmotionId
			);
		},
		isEmotionActive(emotionId) {
			return this.storeData.emotions.some((e) => e.emotionId === emotionId);
		},
	},
	components: { RestitutionBullet },
};
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

    //emotion expand
	.emotion.expand {
		.emotion__title {
			padding: 1rem 0 1rem 0;
			text-shadow: #fff 0px 0 4px;
			color: $C-white;
		}

		.emotion__data {
			height: 5rem;
			opacity: 1;
            pointer-events: auto;
		}
	}

	//all emotions selected
	.container__list.completed {
		.subemotion__item {
			color: rgba($color: $C-light, $alpha: 0.5);
		}
	}

	.emotion {
		&__title {
			transition: all 0.2s;
			margin-bottom: 0rem;
			color: $C-light;
            &--active {
                text-shadow: #fff 0px 0 4px;
                color: $C-white;
            }
		}

		&__data {
			transition: all 0.2s;
			height: 0rem;
			opacity: 0;
			display: flex;
			justify-content: space-around;
			align-items: center;
            pointer-events: none;
		}
	}

	.subemotion {
		font-family: $F-bellota;
		font-size: 1.4rem;

		&__item {
			transition: all 0.1s;
            color: $C-white;
            padding: 5px 10px;
            border-radius: 30px;
			&--active {
                background: $C-white;
				color: $C-black!important;
                -webkit-box-shadow: 0px 0px 5px 0px $C-white; 
                box-shadow: 0px 0px 5px 0px $C-white;
			}
		}
	}
}
</style>
