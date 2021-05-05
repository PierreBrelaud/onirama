<template>
	<div class="labeling">
		<div class="labeling__infos">
			<div class="labeling__infos__title">{{ $store.getters['restitution/data'].title }}</div>
			<div class="labeling__infos__date">{{ $store.getters['restitution/data'].date }}</div>
		</div>
		<div class="labeling__display">
			<span
				v-for="word in textLabeled"
				:key="word"
				class="labeling__display__word"
				:class="`labeling__display__word--${word.label}`"
				@click="labelize(word)"
			>
				{{ word.value }}
			</span>
		</div>
        &nbsp;
		<div v-if="!isLabeling" class="labeling__actions">
			<div class="action">
				<div
					class="action__button action__button--action"
					@click="currentLabel = 'action'"
                    :class="{'action__button--active': currentLabel === 'action'}"
				></div>
				<div class="action__label">Action</div>
			</div>
			<div class="action">
				<div
					class="action__button action__button--person"
					@click="currentLabel = 'person'"
                    :class="{'action__button--active': currentLabel === 'person'}"
				></div>
				<div class="action__label">Personne</div>
			</div>
			<div class="action">
				<div
					class="action__button action__button--place"
					@click="currentLabel = 'place'"
                    :class="{'action__button--active': currentLabel === 'place'}"
				></div>
				<div class="action__label">Lieu</div>
			</div>
			<div class="action">
				<div
					class="action__button action__button--place"
					@click="currentLabel = 'emotion'"
                    :class="{'action__button--active': currentLabel === 'emotion'}"
				></div>
				<div class="action__label">Emotion</div>
            </div>
			<div class="action">
				<div
					class="action__button action__button--default"
					@click="currentLabel = 'default'"
                    :class="{'action__button--active': currentLabel === 'default'}"
				></div>
			</div>
		</div>
	</div>
</template>

<script>
import { mapGetters } from "vuex"

export default {
	beforeMount() {
		this.$store.dispatch('labeling/init')
		this.helper = this['labeling/instance']
		this.helper.text = this.initialText
	},
	data() {
		return {
			currentLabel: null,
			isLabeling: false,
			helper: null,
		}
	},
	methods: {
		labelize(data) {
			if(data.canBeLabeled && this.currentLabel !== null) {
				this.helper.labelWord(data, this.currentLabel)
				this.$forceUpdate()
			}
		},
		labelingWords() {
			this.isLabelingWords = !this.isLabelingWords
		},
		labeling(type) {
			this.isLabelingActive = true
			this.labelingType = type
		},
		validateLabeling() {
			this.isLabelingActive = false
		},
	},
	computed: {
		...mapGetters(["labeling/instance"]),
		textLabeled() {
			return this.helper.textLabeled
		},
		initialText: {
			get() {
				return this.$store.getters["restitution/data"].text
			}
		}
	}
}
</script>

<style lang="scss" scoped>
.labeling {
    position: relative;
	width: 85%;
    height: 100%;
	margin: auto;

	&__infos {
		margin-bottom: 2rem;
		&__title {
			font-weight: $FW-bold;
			font-size: 2.5rem;
		}
		&__date {
			font-style: italic;
			font-size: 1.2rem;
		}
	}

	&__display {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
        margin-bottom: 9rem;

		&__word {
			font-style: italic;
			font-size: 1.4rem;
			line-height: 2rem;
			margin-top: 0.2rem;
			margin-right: 0.4rem;

			&--special {
				margin-left: -0.4rem;
			}
		}
	}
	&__actions {
		display: flex;
		flex-direction: row;
        justify-content: space-between;
        align-items: center;
        box-sizing: border-box;
        position: fixed;
        background: rgb(236, 235, 235);
        width: 100%;
        bottom: 15%;
        padding: 0 2rem;
        left: 0;
        height: 8rem;
        
		.action {
            display: flex;
            flex-direction: column;
            align-items: center;
			&__button {
				width: 3rem;
				height: 3rem;
				border-radius: 50%;
                margin-bottom: .6rem;
			}
		}
	}

    &__display {
        &__word {
            &--action {
                background-color: #000000;
                color: white;
            }
            &--person {
                background-color: #616161;
                color: white;
            }
            &--place {
                background-color: #b3b3b3;
            }
            &--emotion {
                background-color: #e0e0e0;
            }
        }
    }

    &__actions {
        .action {
            &__button {
                position: relative;
                cursor: pointer;
                &--action {
                    background-color: #000000;
                    color: white;
                }
                &--person {
                    background-color: #616161;
                    color: white;
                }
                &--place {
                    background-color: #b3b3b3;
                }
                &--emotion {
                    background-color: #e0e0e0;
                }
                &--default {
                    border: solid thin black;
                    &::after {
                        content: '';
                        width: 100%;
                        height: 1px;
                        background-color: black;
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%) rotate(45deg);
                    }
                }
                &--active {
                    &::before {
                        content: '';
                        width: calc(100% + 1rem);
                        height: calc(100% + 1rem);
                        position: absolute;
                        z-index: -1;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                        border-radius: 50%;
                        background: rgba(0, 0, 0, 0.2);
                    }
                }
            }
        }
    }
}
</style>
