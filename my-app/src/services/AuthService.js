// src/services/AuthService.js

module.exports = {
    // Retrieves the user from session storage as an object
    getUser: function () {
        const user = sessionStorage.getItem('user');
        if (user === 'undefined' || !user) {
            return null;
        } else {
            return JSON.parse(user);
        }
    },
    // Retrieves the token from session storage
    getToken: function() {
        return sessionStorage.getItem('token');
    },
    // Saves both the user and their respective token to session storage
    setUserSession: function (user,token){
        sessionStorage.setItem('user', JSON.stringify(user));
        sessionStorage.setItem('token', token);
        console.log(sessionStorage);
    },
    // Clears session storage
    resetUserSession: function(){
        sessionStorage.removeItem('user');
        sessionStorage.removeItem('token');
    }


}