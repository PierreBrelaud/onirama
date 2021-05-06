<template>
	<div class="survey__wrapper">
		<div class="survey">
			<div class="survey__title">
				{{ survey.title }}
			</div>
			<div class="survey__list">
				<div
					v-for="data in survey.data"
					:key="data.id"
					class="survey__list__block"
				>
                    <!-- radio buttons -->
                    <div v-if="data.type === 'radio'" class="block block__radio">
                        <div class="block__radio__title block__title">
                            {{ data.title }}
                        </div>
                        <div class="block__radio__items">
                            <div class="radio" v-for="radio in data.items" :key="radio.value">
                                <input 
                                    class="radio__input" type="radio" 
                                    v-model="storeData[data.id]" 
                                    :name="data.id"
                                    :value="radio.value"
                                >
                                <div class="radio__label">{{ radio.label }}</div>
                            </div>
                        </div>
                    </div>
                    <!-- checkbox -->
                    <div v-if="data.type === 'checkbox'" class="block__checkbox">
                        <div class="block__checkbox__title block__title">
                            {{ data.title }}
                        </div>

                        <label class="block__checkbox__switch">
                            <input 
                                type="checkbox"
                                v-model="storeData[data.id]"
                            >
                            <span></span>
                        </label>
                    </div>
                    <!-- select -->
                    <div v-if="data.type === 'select'" class="block__select">
                        <div class="block__select__title block__title">
                            {{ data.title }}
                        </div>
                        <select class="block__select__input" v-model="storeData[data.id]">
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
		survey: {
			type: Object,
			required: true,
		},
	},
    computed: {
        storeData() {
            return this.$store.getters['restitution/data']
        }
    }
};
</script>

<style lang="scss" scoped>

.survey__wrapper {
	min-height: 100%;
	background: #f1f2f6;
	width: 100%;
}

.block__select {
    display: flex;
    flex-direction: row;
    align-items: center;

    &__input {
        margin-left: auto;
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
                color: grey;
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
            background-color: #E5E5EA;
            -webkit-transition: .4s;
            transition: .4s;
            border-radius: 2.2rem;

            &:before {
                position: absolute;
                content: "";
                height: 2.6rem;
                width: 2.6rem;
                left: .2rem;
                bottom: .2rem;
                background-color: white;
                -webkit-transition: .4s;
                transition: .4s;
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
    
    &__title {
        font-size: 1.6rem;
        font-weight: $FW-bold;
    }

    &__list {
        display: flex;
        flex-direction: column;
        margin-top: 1rem;

        &__block {
            width: 100%;
            background: white;
            border-radius: .8rem;
            margin: .7rem 0;
            padding: 1.6rem;
            box-sizing: border-box;

            .block {
                &__title {
                    font-size: 1.5rem;
                }
            }
        }
    }
}
</style>
