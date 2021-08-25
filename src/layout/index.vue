<template>
    <div :class="classObj" class="app-wrapper">
        <div v-if="device === 'mobile' && sidebar.opened" class="drawer-bg" @click="handleClickOutside" />
        <sidebar class="sidebar-container" />
        <div :class="{ hastagNav: needtagNav }" class="main-container">
            <div :class="{ 'fixed-header': fixedHeader }">
                <navbar />
                <tag-nav v-if="needtagNav" />
            </div>
            <app-main />
        </div>
    </div>
</template>

<script>
import { AppMain, Navbar, Sidebar, tagNav } from './components'
import ResizeMixin from './mixin/ResizeHandler'
import { useStore } from 'vuex'
import { useGetters } from '@/hooks/useMapper/useGetter'
import { ref, computed } from 'vue'
export default {
    name: 'Layout',
    components: {
        AppMain,
        Navbar,
        Sidebar,
        tagNav
    },
    mixins: [ResizeMixin],
    setup() {
        const store = useStore()
        const sidebar = computed(() => store.getters.sidebar)
        const device = computed(() => store.getters.device)
        const getters = useGetters({ mapper: ['needtagNav', 'fixedHeader'] })
        const classObj = computed(() => {
            return {
                hideSidebar: !sidebar.value.opened,
                openSidebar: sidebar.value.opened,
                withoutAnimation: sidebar.value.withoutAnimation,
                mobile: device.value === 'mobile'
            }
        })
        return {
            sidebar,
            device,
            ...getters,
            needtagNav: ref(true),
            fixedHeader: ref(true),
            classObj
        }
    },
    methods: {
        handleClickOutside() {
            this.$store.dispatch('app/closeSideBar', { withoutAnimation: false })
        }
    }
}
</script>

<style lang="scss" scoped>
  @import "../assets/css/mixin.scss";
  @import "../assets/css/variables.scss";

  .app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;

    &.mobile.openSidebar {
      position: fixed;
      top: 0;
    }
  }

  .drawer-bg {
    background: #000;
    opacity: 0.3;
    width: 100%;
    top: 0;
    height: 100%;
    position: absolute;
    z-index: 999;
  }

  .fixed-header {
    position: fixed;
    top: 0;
    right: 0;
    z-index: 9;
    width: calc(100% - #{$sideBarWidth});
    transition: width 0.28s;
  }

  .hideSidebar .fixed-header {
    width: calc(100% - 54px)
  }

  .mobile .fixed-header {
    width: 100%;
  }
</style>
