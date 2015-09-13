declare function require(name:string);
const $ = require('jquery');
const _ = require('underscore');

class App {
    private name = 'Test App';

    /**
     * Devuelve el nombre de la app
     * @returns {string}
     */
    public getName():string {
        return this.name + ' ' + $.fn.jquery;
    }
}

var app = new App();
console.log(app.getName());
