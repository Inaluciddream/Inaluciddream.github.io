<template>
    <component :is="type" v-bind="linkProps(to)">
        <slot />
    </component>
</template>

<script>
import { isExternal } from '@/utils/validate'
import { computed } from 'vue'
export default {
    props: {
        to: {
            type: String,
            required: true
        }
    },
    setup(props) {
        const isExternalValue = computed(() => isExternal(props.to))
        const type = computed(() => isExternalValue.value ? 'a' : 'router-link')
        const linkProps = (to) => isExternalValue.value ?  {
            href: to,
            target: '_blank',
            rel: 'noopener'
        } : {
            to: to
        }
        return {
            isExternalValue,
            type,
            linkProps
        }
    }
}
</script>
