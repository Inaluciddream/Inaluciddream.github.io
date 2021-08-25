<template>
    <section class="app-main">
        <router-view v-slot="{ Component }" :key="key">
            <transition name="fade-transform" mode="out-in">
                <keep-alive>
                    <component :is="Component" />
                </keep-alive>
            </transition>
        </router-view>
    </section>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
export default {
    name: 'AppMain',
    setup() {
        const store = useStore()
        const route = useRoute()
        const key = computed(() => route.path)
        const cachedViews = computed(() => store.state.tagNav.cachedViews)
        return {
            key,
            cachedViews
        }
    }
}
</script>

<style lang="scss" scoped>
.app-main {
  /* 50= navbar  50  */
  min-height: calc(100vh - 50px);
  width: 100%;
  position: relative;
  overflow: hidden;
}

.fixed-header+.app-main {
  padding-top: 50px;
}

.hastagNav {
  .app-main {
    /* 84 = navbar + tags-view = 50 + 34 */
    min-height: calc(100vh - 84px);
  }

  .fixed-header+.app-main {
    padding-top: 84px;
  }
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}
</style>
