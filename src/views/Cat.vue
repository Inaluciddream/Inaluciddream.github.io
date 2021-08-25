<template>
    <div>
        <el-button @click="click" ref="button">
            click a += 1
        </el-button>
        <h1>a = {{a}}</h1>
        <h1>b = a + 1 = {{b}}</h1>
        <h1>c = b + 1 = {{c}}</h1>
    </div>
</template>

<script>
import { ref, computed } from 'vue'
// import { useRoute } from 'vue-router'
export default {
    setup () {
        const a = ref(0)
        let b = computed(() => a.value + 1)
        let c = computed(() => b.value + 1)
        const click = () => {
            a.value += 1
        }
        return {
            a,
            b,
            c,
            click
        }
    }
}
</script>

<style lang="scss" scoped>

</style>