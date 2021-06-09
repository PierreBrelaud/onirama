<template>
	<div class="survey__wrapper">
		<div class="survey">
			<!-- header -->
			<div class="survey__header">
				<h1>{{ title }}</h1>
				<restitution-bullet :count="5" :active="count" />
			</div>
			<div class="survey__list">
				<div
					v-for="data in survey.data"
					:key="data.id"
					class="survey__list__block"
				>
					<!-- radio buttons -->
					<div
						v-if="data.type === 'radio'"
						class="block block__radio"
					>
						<h2 class="block__radio__title block__title">
							{{ data.title }}
						</h2>
						<div class="block__radio__items">
							<div
								class="radio"
								v-for="radio in data.items"
								:key="radio.value"
							>
								<label class="radio__container">
									<input
										class="radio__container__input"
										type="radio"
										v-model="storeData[data.id]"
										:name="data.id"
										:value="radio.value"
									/>
									<span
										class="radio__container__checkmark"
									></span>
								</label>
								<label class="radio__label">
									{{ radio.label }}
								</label>
							</div>
						</div>
					</div>
					<!-- checkbox -->
					<div
						v-if="data.type === 'checkbox'"
						class="block__checkbox"
					>
						<div class="block__checkbox__title block__title">
							{{ data.title }}
						</div>

						<label class="block__checkbox__switch">
							<input
								type="checkbox"
								v-model="storeData[data.id]"
							/>
							<span></span>
						</label>
					</div>
					<!-- select -->
					<div v-if="data.type === 'select'" class="block__select">
						<div class="block__select__title block__title">
							{{ data.title }}
						</div>
						<select
							class="block__select__input"
							v-model="storeData[data.id]"
						>
							<option
								v-for="option in data.items"
								:key="option.value"
								:value="option.value"
							>
								{{ option.label }}
							</option>
						</select>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import RestitutionBullet from "@/components/restitution/RestitutionBullet.vue";

export default {
	watch: {
		storeData: {
			handler(value) {
				this.$store.commit('restitution/setData', value)
			},
			deep: true
		}
	},
	props: {
		title: {
			type: String,
			required: true,
		},
		count: {
			type: Number,
			required: true,
		},
		survey: {
			type: Object,
			required: true,
		},
	},
	computed: {
		storeData() {
			return this.$store.getters['restitution/data']
		}
	},	
	components: { RestitutionBullet }
};
</script>

<style lang="scss" scoped>
.radio__container {
	display: flex;
    justify-content: center;
    align-items: center;
	position: relative;
	cursor: pointer;
    height: 2.5rem;
    width: 2.5rem;
    margin: 0 auto .7rem auto;
    background: $C-dark;
    border: solid thin $C-light;
    border-radius: 50%;

	&__input {
		position: absolute;
		opacity: 0;
		cursor: pointer;

        &:checked ~ .radio__container__checkmark {
            background-color: $C-white;
			-webkit-box-shadow: 0px 0px 10px 0px $C-white; 
			box-shadow: 0px 0px 10px 0px $C-white;

            &:after {
                display: block;
            }
        }
	}

    &__checkmark {
        height: 2rem;
        width: 2rem;
        border-radius: 50%;

        &:after {
            content: "";
            position: absolute;
            display: none;
        }
    }
}

.survey__wrapper {
	min-height: 100%;
	width: 100%;
}

.block__select {
	display: flex;
	flex-direction: row;
	align-items: center;

	&__input {
        cursor: pointer;
        margin-left: auto;
        border: none;
        font-size: 1.4rem;
        color: gray;
        padding-right: 2rem;
        -moz-appearance: none;
        -webkit-appearance: none;
        appearance: none;
        background: transparent;
        background-image: url("data:image/svg+xml;utf8,<svg fill='gray' height='24' viewBox='0 0 24 24' width='24' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/><path d='M0 0h24v24H0z' fill='none'/></svg>");
        background-repeat: no-repeat;
        background-position-x: 100%;
        background-position-y: -.2rem;
	}
}

.block__radio {
	&__title {
		margin-bottom: 1.2rem;
	}

	&__items {
		display: flex;
		flex-direction: row;
		align-items: flex-start;

		.radio {
			flex: 1 1 0;
			text-align: center;
			&__input {
				margin: auto;
			}

			&__label {
				color: $C-extralight;
			}
		}
	}
}

.block__checkbox {
	display: flex;
	flex-direction: row;
	align-items: center;

	&__switch {
		margin-left: auto;
		position: relative;
		display: inline-block;
		width: 5rem;
		height: 3rem;

		input:checked + span {
			background-color: #888888;
		}

		input:checked + span:before {
			-webkit-transform: translateX(2rem);
			-ms-transform: translateX(2rem);
			transform: translateX(2rem);
		}

		input {
			opacity: 0;
			width: 0;
			height: 0;
		}

		span {
			position: absolute;
			cursor: pointer;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			background-color: #e5e5ea;
			-webkit-transition: 0.4s;
			transition: 0.4s;
			border-radius: 2.2rem;

			&:before {
				position: absolute;
				content: "";
				height: 2.6rem;
				width: 2.6rem;
				left: 0.2rem;
				bottom: 0.2rem;
				background-color: white;
				-webkit-transition: 0.4s;
				transition: 0.4s;
				border-radius: 50%;
			}
		}
	}
}

.survey {
	width: 90%;
	margin: auto;
	height: 100%;
	padding-top: 2rem;
	box-sizing: border-box;

	&__header {
		h1 {
			text-align: center;
			width: 80%;
			margin: auto;
			font-size: 3rem;
		}

		p {
			width: 55%;
			margin: -1rem auto 2rem auto;
			text-align: center;
			font-size: 1.4rem;
			color: $C-extralight;
		}
	}

	&__list {
		display: flex;
		flex-direction: column;
		margin-top: 1rem;

		&__block {
			width: 100%;
			background: $C-dark;
			border-radius: 0.8rem;
			margin: 0.7rem 0;
			padding: 1.6rem;
			box-sizing: border-box;

			.block {
				&__title {
					font-size: 1.9rem;
				}
			}
		}
	}
}
</style>
