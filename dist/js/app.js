var App = (function () {
    function App() {
        this.name = 'Test App';
    }
    /**
     * Devuelve el nombre de la app
     * @returns {string}
     */
    App.prototype.getName = function () {
        return this.name;
    };
    return App;
})();
var app = new App();
console.log(app.getName());
