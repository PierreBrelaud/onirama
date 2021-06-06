<template>
	<div class="search">
		<input
			class="search__input"
			type="text"
			placeholder="Recherche"
			v-model="searchValue"
			@input="onSearchChanged"
		/>
		<filter-list 
			v-if="dreams" 
			:data="dreams" 
			:type="'search'"
			:searchValue="searchValue"
		/>
	</div>
</template>

<script>
import { functions } from "@/firebase";
import FilterList from "@/components/filter/FilterList.vue";

export default {
	data() {
		return {
			cfSearchDream: functions.httpsCallable("searchDream"),
			dreams: null,
			searchValue: null,
			abordController: null,
		};
	},
	methods: {
		async onSearchChanged() {
            //empty search case
            if(!this.searchValue) {
                this.dreams = null;
                return;
            }
            //handle to quick input changed
            const tempValue = this.searchValue;
            await this.sleep(100)
            if(this.searchValue !== tempValue) return;

            //cancel previous request if exist
			if (this.abortController) {
				this.abortController.abort();
				this.abortController = null;
				return;
			}
            //init abortController 
			this.abortController = new AbortController();

            //call async function
			try {
				const result = await this.searchDreams(
					this.abortController.signal
				);
                this.dreams = result;
			}
            finally {
				this.abortController = null;
			}
		},
		async searchDreams(abortSignal) {
			return new Promise(async (resolve, reject) => {
                //handle abord
				if (abortSignal.aborted) {
					return reject();
				}
                //get & resolve dreams
				const dreams = await this.getDreams();
				resolve(dreams);

                //abord listener
				abortSignal.addEventListener("abort", () => {
					reject();
				});
			});
		},
		async getDreams() {
			const dreams = await this.cfSearchDream({
				userId: this.$store.getters["auth/user"].data.uid,
				searchValue: this.searchValue,
			});
			return dreams.data;
		},
        sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        },
	},
	components: { FilterList },
};
</script>

<style lang="scss" scoped>
	.search {
		&__input {
			display:block;
			width: 75%;
			margin: 0 auto 3rem auto;
			background: $C-extradark;
			border: none;
			border-bottom: solid thin $C-dark;
			padding: 1rem;
			text-align: center;
			color: $C-white;
			font-family: $F-bellota;
			font-weight: $FW-normal;
			font-size: 15pt;

			&::placeholder {
				color: $C-light;
				font-family: $F-bellota;
				font-size: 15pt;
				font-style: italic;
				font-weight: $FW-thin;
			}
		}
	}
</style>
