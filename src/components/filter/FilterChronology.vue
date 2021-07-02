<template>
    <filter-list 
        v-if="dreams"
        :data="dreams"
    />

</template>

<script>
import { functions } from '@/firebase';
import FilterList from '@/components/filter/FilterList.vue';
import DreamController from "@/firebase/db/DreamController";

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
            const userUid = this.$store.getters['auth/user'].data.uid;
            const dreams = [];
            
            DreamController.getDreamsForVisualisation(userUid, 
                (res) => {
                    res.docs.forEach(doc => {
                        dreams.push(doc.data());
                    })
                    this.dreams = dreams;
                    this.$store.dispatch('loader/done');
                },
                (err) => {
                    console.error(err);
                }
            )

            /*const dreams = await this.cfGetDremByDate({
				userId: this.$store.getters["auth/user"].data.uid
			});
            this.dreams = dreams.data;
            console.log(this.dreams);*/
        }
    },
    components: { FilterList }
}
</script>

<style>

</style>