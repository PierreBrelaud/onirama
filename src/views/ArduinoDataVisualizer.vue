<template>
  <h1>ouoiuoiuoiuoiu</h1>
</template>

<script>
import ArduinoController from "@/firebase/db/ArduinoController";

export default {
  mounted() {
    ArduinoController.getDeviceData(
        '8FawTyOj5LMJ7fy4sUJiWOAW8cG3',
        (res) => {
          if (res.exists) {
            console.log("Document data:", res.data());
          } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
          }
        },
        (err) => {
          console.log(err)
        }
    )
  },
  methods: {

  },
  components: {
  },
}
</script>

<style lang="scss" scoped>
</style>