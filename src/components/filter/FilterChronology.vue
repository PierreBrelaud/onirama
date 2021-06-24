<template>
    <filter-list 
        v-if="dreams"
        :data="dreams"
    />

</template>

<script>
import { functions } from '@/firebase';
import FilterList from '@/components/filter/FilterList.vue';

export default {
    beforeMount() {
        this.getDreams();
    },
    data() {
        return {
            cfGetDremByDate: functions.httpsCallable('getDreamByDate'),
            dreams: null,
        }
    },
    methods: {
        async getDreams() {
            this.$store.dispatch('loader/pending');
            const dreams = await this.cfGetDremByDate({
				userId: this.$store.getters["auth/user"].data.uid
			});
            this.dreams = dreams.data;
            console.log(this.dreams);
            this.$store.dispatch('loader/done');
        }
    },
    components: { FilterList }
}
</script>

<style>

</style>