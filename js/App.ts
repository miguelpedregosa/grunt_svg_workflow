class App {
    private name = 'Test App';

    /**
     * Devuelve el nombre de la app
     * @returns {string}
     */
    public getName():string {
        return this.name;
    }
}

var app = new App();
console.log(app.getName());
