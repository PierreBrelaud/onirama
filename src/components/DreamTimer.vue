<template>
  <div class="dreamTimer">
    <div class="dreamTimer__circle">
      <svg class="dreamTimer__circle__empty" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000">
        <circle r="400" fill="none" cx="500" cy="500" stroke="white" stroke-width="50"/>
      </svg>
    </div>
    <div class="dreamTimer__circle">
      <svg class="dreamTimer__circle__fill" ref="svgCircle" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000">
        <circle r="400"  ref="circleFill" fill="none" cx="500" cy="500" stroke="white" stroke-width="50"/>
      </svg>
    </div>
    <div class="dreamTimer__container">
      <div class="dreamTimer__container__title">
        Visualisation disponible dans
      </div>
      <div class="dreamTimer__container__timer">
        {{diffDate}}
      </div>
    </div>
  </div>
</template>

<script>
import gsap from 'gsap'
import DrawSVGPlugin from '@/utils/DrawSVGPlugin'

export default {
  props: {
    startDay: {
      type: String,
      required: true,
    },
    endDay: {
      type: String,
      required: true,
    },
    startDate: {
      type: String,
      required: true,
    },
    endDate: {
      type: String,
      required: true,
    }
  },
  data() {
    return {
      diffDate: '00:00:00',
      circleFill: null,
      secondLeft: null,
      maxSecond: null,
      counterInterval: null
    }
  },
  methods: {
    timeDiffCalc(dateFuture, dateNow) {
      function z(n){return (n<10?'0':'') + n;}
      let diffInMilliSeconds = Math.abs(dateFuture - dateNow) / 1000;

      // calculate days
      let days = Math.floor(diffInMilliSeconds / 86400);
      diffInMilliSeconds -= days * 86400;

      // calculate hours
      let hours = Math.floor(diffInMilliSeconds / 3600) % 24;
      diffInMilliSeconds -= hours * 3600;
      // calculate minutes
      let minutes = Math.floor(diffInMilliSeconds / 60) % 60;
      diffInMilliSeconds -= minutes * 60;

      let seconds = diffInMilliSeconds

      return days  + ':' + z(hours) + ':' + z(minutes) + ':' + z(seconds);
    },
    dhmsToSeconds(s) {
      let b = s.split(':');
      return b[0]*86400 + b[1]*3600 + b[2]*60 + (+b[3] || 0);
    },
    counterAnimation() {
      this.$data.counterInterval = setInterval(this.intervalAnimation, 1000)
    },
    intervalAnimation() {

      let days        = Math.floor( this.$data.maxSecond/24/60/60);
      let hoursLeft   = Math.floor(( this.$data.maxSecond) - (days*86400));
      let hours       = Math.floor(hoursLeft/3600);
      let minutesLeft = Math.floor((hoursLeft) - (hours*3600));
      let minutes     = Math.floor(minutesLeft/60);
      let remainingSeconds =  this.$data.maxSecond % 60
      function pad(n) {
        return (n < 10 ? "0" + n : n);
      }
      this.$data.diffDate = pad(hours) + ":" + pad(minutes) + ":" + pad(remainingSeconds)
      if ( this.$data.secondLeft !== 0) {
        this.$data.maxSecond--
        this.$data.secondLeft--;
        let progressValue =  (100 * this.$data.secondLeft) / this.$data.maxSecond
        gsap.to(this.$data.circleFill, {
          drawSVG: 100 - Math.round(progressValue)+"%",
          duration: 1.5,
        })

      } else {
        clearInterval(this.$data.counterInterval)
      }
    }
  },
  mounted() {

    gsap.registerPlugin(DrawSVGPlugin)
    this.$data.circleFill = this.$refs.circleFill
    let svgCircle = this.$refs.svgCircle

    gsap.set(svgCircle, {rotation:-90, transformOrigin:"center center"})
    gsap.set(this.$data.circleFill, {drawSVG: "0%"})

    let dateNow = new Date();
    let stringCurrentDate =
        dateNow.getFullYear() + '-'
        + (dateNow.getMonth()+1)+ '-'
        + dateNow.getDate()+ ' '
        + dateNow.getHours() + ':'
        + dateNow.getMinutes() + ':'
        + dateNow.getSeconds()

    let timeStart = new Date(this.$props.startDay+ ' ' + this.$props.startDate)
    let timeEnd = new Date(this.$props.endDay+ ' ' + this.$props.endDate)
    let currentDate = new Date(stringCurrentDate)

    console.log(timeEnd - currentDate)
    if(Math.sign(currentDate - timeEnd) < 0) {
      let diffDateStart = this.timeDiffCalc(timeStart, timeEnd)
      let diffDateFromNow =  this.timeDiffCalc(currentDate, timeEnd)
      this.$data.diffDate =  '00:00:00'

      let crossProduct = (100 * this.dhmsToSeconds(diffDateFromNow))/ this.dhmsToSeconds(diffDateStart)

      gsap.to(this.$data.circleFill, {
        drawSVG: 100 - Math.round(crossProduct)+"%",
        duration: 1.5,
      })

      this.$data.secondLeft = this.dhmsToSeconds(diffDateFromNow)
      this.$data.maxSecond = this.dhmsToSeconds(diffDateStart)

      this.counterAnimation()

    } else {
      this.$data.diffDate = '00:00:00'
      gsap.set(this.$data.circleFill, {drawSVG: "100%"})
    }

  }
}
</script>

<style lang="scss" scoped>

.dreamTimer {
  padding: 3rem;
  width: 15rem;
  height: 15rem;
  position: relative;
  margin: auto;

  background-color: black;

  &__circle {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);

    &__fill {
      width: 25rem;
      circle {
        stroke-dasharray: 0, 999999px;
      }
    }
    &__empty {
      width: 25rem;
      circle {
        stroke-opacity: 0.5;

      }
    }
  }

  &__container {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    text-align: center;
    &__title {
      font-size: 1.8rem;
      color: #ffffff;
    }
    &__timer {
      font-size: 4rem;
      color: #ffffff;
    }
  }
}
</style>