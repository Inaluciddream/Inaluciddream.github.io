<template>
    <div :class="{'has-logo':showLogo}">
        <logo v-if="showLogo" :collapse="isCollapse" />
        <el-scrollbar wrap-class="scrollbar-wrapper">
            <el-menu :default-active="activeMenu" :collapse="isCollapse" :background-color="variables.menuBg" :text-color="variables.menuText" :unique-opened="false" :active-text-color="variables.menuActiveText" :collapse-transition="false" mode="vertical">
                <sidebar-item v-for="route in permissionRroutes" :key="route.path" :item="route" :base-path="route.path" />
            </el-menu>
        </el-scrollbar>
    </div>
</template>

<script>
import Logo from './Logo'
import SidebarItem from './SidebarItem'
import variablesCss from '@/assets/css/variables.scss'
import { computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
export default {
    components: { SidebarItem, Logo },
    setup() {
        const store = useStore()
        const route = useRoute()
        const permissionRroutes = computed(() => store.getters.permission_routes)
        const sidebar = computed(() => store.getters.sidebar)
        const activeMenu = computed(() => {
            const { meta, path } = route
            // if set path, the sidebar will highlight the path you set
            if (meta.activeMenu) {
                return meta.activeMenu
            }
            return path
        })
        const showLogo = computed(() => store.state.settings.sidebarLogo)
        const variables = computed(() => variablesCss)
        const isCollapse = computed(() => !store.getters.sidebar.opened)
        console.log(isCollapse)
        watch(isCollapse, val => console.log(val))
        onMounted(() => console.log(permissionRroutes))
        return {
            permissionRroutes,
            sidebar,
            activeMenu,
            showLogo,
            variables,
            isCollapse
        }
    }
}
</script>
