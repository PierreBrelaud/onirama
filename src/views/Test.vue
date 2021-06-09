<template>
  <DreamTimer v-if="isLoadedData" :timeStamp="timeData" />
</template>

<script>
import DreamTimer from '@/components/DreamTimer.vue'
import { db } from '@/firebase/index.js';

export default {
  data() {
    return {
      timeData: null,
      isLoadedData: false,
    }
  },
    beforeCreate() {
      db.collection('test').doc('test').get().then((res) => {
        this.timeData = res.data().timestamp.toDate();
        this.isLoadedData = true
      }).catch((err) => console.log(err))
    },
    methods: {
        success(data) {
            console.log(data)
        },
        error(error) {
            console.log(error.message)
        }
    },
    components: {
      DreamTimer,
    },
}
</script>

<style lang="scss" scoped>

</style>