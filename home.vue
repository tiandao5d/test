<template>
    <div>
        {{txt}},
        <box-tt></box-tt>
    </div>
</template>

<script>
import boxTt from './Box.vue';
export default {
    components: {
        'box-tt': boxTt
    },
    data() {
        return {
            txt: '你大爷的'
        }
    }
}
</script>
