const setUserInfo = $http =>
    $http.defaults.headers.common['Authorization'] = 'Bearer ' + getUserInfo().token;


const getUserInfo = () => {
    let userInfo = sessionStorage.getItem('userInfo') ? JSON.parse(sessionStorage.getItem('userInfo')) : {}
    return userInfo
}


module.exports = {
    setUserInfo,
    getUserInfo
}