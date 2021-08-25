<template>
    <div v-if="iconExternal" :style="styleExternalIcon" class="svg-external-icon svg-icon" v-on="$attrs" />
    <svg v-else :class="svgClass" aria-hidden="true" v-on="$attrs">
        <use :xlink:href="iconName" />
    </svg>
</template>

<script>
// doc: https://panjiachen.github.io/vue-element-admin-site/feature/component/svg-icon.html#usage
import { isExternal } from '@/utils/validate'
import { computed } from 'vue'
export default {
    name: 'SvgIcon',
    props: {
        iconClass: {
            type: String,
            required: true
        },
        className: {
            type: String,
            default: ''
        }
    },
    setup(props) {
        const iconExternal = computed(() => isExternal(props.iconClass))
        const iconName = computed(() => `#icon-${props.iconClass}`)
        const svgClass = computed(() => `svg-icon ${props.className}`)
        const styleExternalIcon = computed(() => {
            return {
                mask: `url(${props.iconClass}) no-repeat 50% 50%`,
                '-webkit-mask': `url(${props.iconClass}) no-repeat 50% 50%`
            }
        })
        return {
            iconExternal,
            iconName,
            svgClass,
            styleExternalIcon
        }
    }
}
</script>

<style scoped>
.svg-icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
.svg-external-icon {
  background-color: currentColor;
  mask-size: cover !important;
  display: inline-block;
}
</style>
