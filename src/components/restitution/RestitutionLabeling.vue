<template>
	<div class="labeling">
		<div class="labeling__infos">
			<h1 class="labeling__infos__title">{{ $store.getters['restitution/data'].title }}</h1>
			<div class="labeling__infos__date">
				{{ formatDate($store.getters['restitution/data'].date) }}
			</div>
		</div>
		<div class="labeling__display">
			<div class="content">
				<span
					v-for="word in textLabeled"
					:key="word"
					class="content__word"
					:class="`content__word--${word.label}`"
					@click="labelize(word)"
				>
					{{ word.value }}
				</span>
			</div>
		</div>
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
					class="action__button action__button--emotion"
					@click="currentLabel = 'emotion'"
                    :class="{'action__button--active': currentLabel === 'emotion'}"
				></div>
				<div class="action__label">Emotion</div>
            </div>
			<div class="action">
				<div
					class="action__button action__button--color"
					@click="currentLabel = 'color'"
                    :class="{'action__button--active': currentLabel === 'color'}"
				></div>
				<div class="action__label">Couleur</div>
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
import { displayDate } from '@/utils/dateHelper.js'

export default {
	beforeMount() {
		this.$store.dispatch('labeling/init')
		this.helper = this['labeling/instance']
		this.helper.text = this.initialText
		//'Je marche sur une immense plage, style plage d’Hollywood. La mer est très loin. Je marche avec quelqu’un à ma gauche et une autre dame loin devant nous. Tout à coup la mer se trouve au niveau de nos jambes, elle vient par notre droite à vive allure ! Je dis à l’enfant « Tu vas voir, ce ciel noir annonce un raz-de-marée ».À notre gauche, le ciel de couleur gris foncé était comme tombé par terre. Puis  je me retrouve seul(e) dans un blockhaus. Je suis au milieu de « la mer en furie ! ! !'
	},
	data() {
		return {
			currentLabel: null,
			isLabeling: false,
			helper: null,
		}
	},
	methods: {
		formatDate(string) {
			const date = new Date(this.$store.getters['restitution/data'].date)
			return displayDate(date);
		},
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
	width: 100%;
    height: 100%;
	margin: auto;
	display: flex;
	flex-direction: column;
	box-sizing: border-box;

	&__infos {
		padding: 0 2rem 2rem 2rem;

		&__title {
			margin-bottom: 1rem;
		}
		&__date {
			font-family: $F-bellota;
			color: $C-light;
			font-size: 1.4rem;
		}
	}

	&__display {
		background: $C-wheat;
		padding: 3rem;
		box-sizing: border-box;
		overflow: auto;
		flex: 1;

		.content {
			background: $C-wheat;
			width: 100%;
			min-height: 100%;
			display: flex;
			flex-direction: row;
			flex-wrap: wrap;
			align-content: flex-start;
			box-sizing: border-box;
			background-size: 1px 3rem;
			background-repeat: repeat;
			background-position: 0 1.7rem;  
			background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1 3rem'%3E%3Crect id='background' height='0' width='1' y='0' x='0' fill='none'/%3E %3Cline id='underline' y2='1' x2='0' y1='1' x1='1' opacity='0.1' stroke='%23001733' fill='none'/%3E %3C/svg%3E");

			&__word {
				height: 1.9rem;
				margin-bottom: 1.1rem;
				margin-right: 0.4rem;
				color: $C-black;
				font-family: $F-bellota;
				font-weight: $FW-thin;
				font-size: 1.9rem;
	
				&--special {
					margin-left: -0.4rem;
				}
			}
		}
	}
	&__actions {
		display: flex;
		flex-direction: row;
        justify-content: space-between;
        align-items: center;
        box-sizing: border-box;
        background: $C-wheat;
		color: $C-black;
        width: 100%;
        padding: 1.4rem 2rem;
        left: 0;
        
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
			&__label {
				font-family: $F-bellota;
			}
		}
	}

    &__actions {
        .action {
            &__button {
                position: relative;
                cursor: pointer;

                &--action {
                    background-color: $C-action;
                }
                &--person {
                    background-color: $C-person;
                }
                &--place {
                    background-color: $C-place;
                }
                &--emotion {
                    background-color: $C-emotion;
                }
				&--color {
					background-color: $C-color;
				}
				
				&--active {
					&.action__button--color {
						&:before { border-color: $C-color; }	
					}
					&.action__button--action {
						&:before { border-color: $C-action; }	
					}
					&.action__button--person {
						&:before { border-color: $C-person; }	
					}
					&.action__button--place {
						&:before { border-color: $C-place; }	
					}
					&.action__button--emotion {
						&:before { border-color: $C-emotion; }	
					}
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
                        width: calc(100% + .5rem);
                        height: calc(100% + .5rem);
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                        border-radius: 50%;
						border: solid 2px;
                    }
                }
            }
        }
    }

    &__display {

		.content {

			position: relative;
			z-index: 0;

			&__word {
				position: relative;
				&:after {
					content: '';
					z-index: -1;
					position: absolute;
					top: 50%;
					left: 50%;
					width: 105%;
					height: 150%;
					transform: translate(-50%, -50%); 
					border-radius: 6px;
				}
				
				&--action {
					&:after {
						background-color: $C-action;
					}
				}
				&--person {
					&:after {
						background-color: $C-person;
					}
				}
				&--place {
					&:after {
						background-color: $C-place;
					}
				}
				&--emotion {
					&:after {
						background-color: $C-emotion;
					}
				}
				&--color {
					&:after {
						background-color: $C-color;
					}
				}
			}
		}
    }
}
</style>

// {
// 	current: 4, // index du rêve dans le tableau
// 	min: 0,
// 	max: 10,
// 	data: [
// 		{ id: aezarazer, type: 1, text: 'aezlrjhjkezhrkjzaher'...}
// 		{ id: aezarazer, type: 1, text: 'aezlrjhjkezhrkjzaher'...}
// 		{ id: aezarazer, type: 1, text: 'aezlrjhjkezhrkjzaher'...}
// 		{ id: aezarazer, type: 1, text: 'aezlrjhjkezhrkjzaher'...}
// 	]
// }