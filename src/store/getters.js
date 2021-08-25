const getters = {
    sidebar: state => state.app.sidebar,
    size: state => state.app.size,
    device: state => state.app.device,
    visitedViews: state => state.tagNav.visitedViews,
    cachedViews: state => state.tagNav.cachedViews,
    introduction: state => state.user.introduction,
    permission_routes: state => state.permission.routes,
    errorLogs: state => state.errorLog.logs
}
export default getters
