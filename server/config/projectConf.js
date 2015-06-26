module.exports = function(app) {
    app.set('noOauthCgi', [{
        url:'forlogin'
    },{
        url:'login'
    }]);
};