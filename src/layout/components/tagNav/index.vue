<template>
    <div id="tags-view-container" class="tags-view-container" ref="tagsNav">
        <scroll-pane ref="scrollPane" class="tags-view-wrapper" @scroll="handleScroll" :tags="itemRefs">
            <router-link v-for="tag in visitedViews" :ref="setItemRef" :key="tag.path" :class="isActive(tag)?'active':''" :to="{ path: tag.path, query: tag.query, fullPath: tag.fullPath }" tag="span" class="tags-view-item" @click.middle.native="!isAffix(tag)?closeSelectedTag(tag):''" @contextmenu.prevent.native="openMenu(tag,$event)">
                {{ tag.title }}
                <span v-if="!isAffix(tag)" class="el-icon-close" @click.prevent.stop="closeSelectedTag(tag)" />
            </router-link>
        </scroll-pane>
        <ul v-show="visible" :style="{left:left+'px',top:top+'px'}" class="contextmenu">
            <li @click="refreshSelectedTag(selectedTag)">Refresh</li>
            <li v-if="!isAffix(selectedTag)" @click="closeSelectedTag(selectedTag)">Close</li>
            <li @click="closeOthersTags">Close Others</li>
            <li @click="closeAllTags(selectedTag)">Close All</li>
        </ul>
    </div>
</template>

<script>
import ScrollPane from './ScrollPane'
import path from 'path'
import { ref, computed, watch, nextTick, onMounted, onBeforeUpdate, reactive } from 'vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
export default {
    components: { ScrollPane },
    setup() {
        const store = useStore()
        const route = useRoute()
        const router = useRouter()
        const visible = ref(false), top = ref(0), left = ref(0), selectedTag = reactive({})
        const affixTags = ref([])
        const tagsNav = ref(null)
        // const routes = computed(() => store.state.permission.routes)
        const moveToCurrentTag = async () => {
            const tagsValue = itemRefs.value
            await nextTick()
            for (const tag of tagsValue) {
                if (!tag) {
                    break
                }
                if (tag.to.path === route.path) {
                    scrollPane.value.moveToTarget(tag)
                    // when query is different then update
                    if (tag.to.fullPath !== route.fullPath) {
                        store.dispatch('tagNav/updateVisitedView', route)
                    }
                    break
                }
            }
                
                
        }
        const scrollPane = ref(null)
        const itemRefs = ref([])
        const setItemRef = el => {
            itemRefs.value.push(el)
        }
        onBeforeUpdate(() => {
            itemRefs.value = []
        })
        const addTags = () => {
            const { name } = route
            if (name) {
                store.dispatch('tagNav/addView', route)
            }
        }
        
        watch(route, () => {
            addTags()
            moveToCurrentTag()
        })
        watch(visible, (newvalue) => {
            if (newvalue) {
                document.body.addEventListener('click', closeMenu)
            } else {
                document.body.removeEventListener('click', closeMenu)
            }
        })
        const isActive = (currentRoute) => currentRoute.path === route.path
        const isAffix = (tag) => tag.meta && tag.meta.affix
        const filterAffixTags = (routes, basePath = '/') => {
            let tags = []
            routes.forEach(route => {
                if (route.meta && route.meta.affix) {
                    const tagPath = path.resolve(basePath, route.path)
                    tags.push({
                        fullPath: tagPath,
                        path: tagPath,
                        name: route.name,
                        meta: { ...route.meta }
                    })
                }
                if (route.children) {
                    const tempTags = filterAffixTags(route.children, route.path)
                    if (tempTags.length >= 1) {
                        tags = [...tags, ...tempTags]
                    }
                }
            })
            return tags
        }
        const initTags = (routes) => {
            affixTags.value = filterAffixTags(routes)
            for (const tag of affixTags.value) {
                // Must have tag name
                console.log(tag)
                if (tag.name) {
                    store.dispatch('tagNav/addVisitedView', tag)
                }
            }
        }
        const refreshSelectedTag = (view) => {
            store.dispatch('tagNav/delCachedView', view).then(() => {
                const { fullPath } = view
                nextTick(() => {
                    router.replace({
                        path: '/redirect' + fullPath
                    })
                })
            })
        }
        const toLastView = (visitedViews, view) => {
            const latestView = visitedViews.slice(-1)[0]
            console.log(latestView, view, 'closeLast')
            if (latestView) {
                router.push(latestView.fullPath)
            } else {
                // now the default is to redirect to the home page if there is no tags-view,
                // you can adjust it according to your needs.
                if (view.name === 'Dashboard') {
                    // to reload home page
                    router.replace({ path: '/redirect' + view.fullPath })
                } else {
                    console.log(view.fullPath)
                    router.replace(view.fullPath)
                }
            }
        }
        const closeSelectedTag = (view) => {
            store.dispatch('tagNav/delView', view).then(({ visitedViews }) => {
                console.log(view, visitedViews)
                if (isActive(view)) {
                    toLastView(visitedViews, view)
                }
            })
        }
        const closeOthersTags = () => {
            router.push(selectedTag)
            store.dispatch('tagNav/delOthersViews', selectedTag).then(() => {
                moveToCurrentTag()
            })
        }
        const closeAllTags = (view) => {
            store.dispatch('tagNav/delAllViews').then(({ visitedViews }) => {
                if (affixTags.value.some(tag => tag.path === view.path)) {
                    return
                }
                toLastView(visitedViews, view)
            })
        }
        const openMenu = (tag, e) => {
            const menuMinWidth = 105
            const offsetLeft = tagsNav.value.getBoundingClientRect().left // container margin left
            const offsetWidth = tagsNav.value.offsetWidth // container width
            const maxLeft = offsetWidth - menuMinWidth // left boundary
            const leftValue = e.clientX - offsetLeft + 15 // 15: margin right

            if (left > maxLeft) {
                left.value = maxLeft
            } else {
                left.value = leftValue
            }

            top.value = e.clientY
            visible = true
            selectedTag = tag
        }
        const closeMenu = () => visible.value = false
        const handleScroll = () => closeMenu()
        onMounted(() => {
            initTags(store.state.permission.routes)
            addTags()
        })
        return {
            visible,
            top,
            left,
            selectedTag,
            itemRefs,
            setItemRef,
            affixTags,
            visitedViews: computed(() => store.state.tagNav.visitedViews),
            addTags,
            moveToCurrentTag,
            isActive,
            isAffix,
            filterAffixTags,
            initTags,
            refreshSelectedTag,
            toLastView,
            closeSelectedTag,
            closeOthersTags,
            closeAllTags,
            openMenu,
            closeMenu,
            handleScroll,
            scrollPane,
            tagsNav
        }
    }
}
</script>

<style lang="scss" scoped>
.tags-view-container {
  height: 34px;
  width: 100%;
  background: #fff;
  border-bottom: 1px solid #d8dce5;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, .12), 0 0 3px 0 rgba(0, 0, 0, .04);
  .tags-view-wrapper {
    .tags-view-item {
      display: inline-block;
      position: relative;
      cursor: pointer;
      height: 26px;
      line-height: 26px;
      border: 1px solid #d8dce5;
      color: #495060;
      background: #fff;
      padding: 0 8px;
      font-size: 12px;
      margin-left: 5px;
      margin-top: 4px;
      &:first-of-type {
        margin-left: 15px;
      }
      &:last-of-type {
        margin-right: 15px;
      }
      &.active {
        background-color: #42b983;
        color: #fff;
        border-color: #42b983;
        &::before {
          content: '';
          background: #fff;
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          position: relative;
          margin-right: 2px;
        }
      }
    }
  }
  .contextmenu {
    margin: 0;
    background: #fff;
    z-index: 3000;
    position: absolute;
    list-style-type: none;
    padding: 5px 0;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 400;
    color: #333;
    box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, .3);
    li {
      margin: 0;
      padding: 7px 16px;
      cursor: pointer;
      &:hover {
        background: #eee;
      }
    }
  }
}
</style>

<style lang="scss">
//reset element css of el-icon-close
.tags-view-wrapper {
  .tags-view-item {
    .el-icon-close {
      width: 16px;
      height: 16px;
      vertical-align: 2px;
      border-radius: 50%;
      text-align: center;
      transition: all .3s cubic-bezier(.645, .045, .355, 1);
      transform-origin: 100% 50%;
      &:before {
        transform: scale(.6);
        display: inline-block;
        vertical-align: -3px;
      }
      &:hover {
        background-color: #b4bccc;
        color: #fff;
      }
    }
  }
}
</style>
