<template>
    <div class="particles__container" 
        :id="id"
    >
    </div>
</template>

<script>

export default {
    mounted() {
        this.$nextTick(() => {
            this.initParticleJS(this.count);
        });
    },
    props: {
        id: {
            type: String,
            required: true,
        },
        count: {
            type: Number,
            required: true,
        }
    },
    methods: {
        initParticleJS(count = 0) {
            particlesJS(this.id, {
                particles: {
                    number: {
                        value: count,
                        density: {
                            enable: false,
                        },
                    },
                    color: {
                        value: "#ffffff",
                    },
                    shape: {
                        type: "circle",
                    },
                    size: {
                        value: 4,
                        random: true,
                        anim: {
                            enable: true,
                            speed: 1,
                            size_min: 1,
                            sync: false,
                        },
                    },
                    line_linked: {
                        enable: false,
                    },
                    move: {
                        enable: true,
                        speed: 0.5,
                        random: true,
                        straight: false,
                        out_mode: "bounce",
                        bounce: false,
                    },
                },
                interactivity: {
                    detect_on: "canvas",
                    events: {
                        onhover: {
                            enable: false,
                        },
                        onclick: {
                            enable: false,
                        },
                        resize: true,
                    },
                },
            });
        },
    },
};
</script>

<style lang="scss" scoped>

.particles__container {
    width: 100%;
    height: 100%;
}
</style>
