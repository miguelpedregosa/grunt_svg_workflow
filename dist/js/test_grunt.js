var User = (function () {
    function User() {
    }
    /**
     *
     * @returns {string}
     */
    User.prototype.getName = function () {
        return this.name;
    };
    return User;
})();
