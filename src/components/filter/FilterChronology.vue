<template>
    <h3>Chronology</h3>
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
            const dreams = await this.cfGetDremByDate();
            this.dreams = dreams.data;
        }
    },
    components: { FilterList }
}
</script>

<style>

</style>