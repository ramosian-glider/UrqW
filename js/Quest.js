/**
 * @author narmiel
 */


/**
 * @param {string} text тело игры
 *
 * @constructor
 */
function Quest(text) {

    /**
     * @type {Object}
     */
    this.labels = {};

    /**
     * @type {Object}
     */
    this.useLabels = {};

    /**
     * @type {Object}
     */
    this.items = {};

    /**
     * @type {Object}
     */
    this.vars = {};

    /**
     * @type {string}
     */
    this.quest = text.replace(/\/\*[^.]*\*\//g,'').replace(/^[\n\r]+|[\n\r]+$/g,'').split(/[\n\r]+/);

    /**
     * @type {number}
     */
    this.position = 0;

    this.currentLoc = '';
    this.previousLoc = '';

    /**
     * @param {String} label
     */
    this.getLabel = function(label) {
        label = label.toLowerCase();

        if (this.labels[label] !== undefined) {
            return this.labels[label];
        } else {
            return false;
        }
    };

    /**
     * следующая строка
     */
    this.next = function() {
        var line = this.get(++this.position);

        if (!line) {
            return false;
        }

        // вырезать комментарий
        if (line.indexOf(';') != -1) {
            line = line.substring(0, line.indexOf(';'));
        }

        return line.replace(/\t/g, ' ');
    };

    /**
     * строка по номеру
     */
    this.get = function(i) {
        if (this.quest[i] != undefined) {
            return this.quest[i];
        } else  {
            return false;
        }
    };

    /**
     * прыгнуть на метку
     *
     * @param {string} label
     * @param {bool} incrCount
     */
    this.to = function(label, incrCount) {
        label = label.toString();

/*
        if (incrCount === true) {
*/
            this.setVar('count_' + label, this.getVar('count_' + label) + 1);
/*
        }
*/

        if (this.labels[label.toLowerCase()] !== undefined) {
            this.position = this.labels[label.toLowerCase()] ;
            return true;
        } else {
            return false;
        }
    };

    /**
     * инициализация
     */
    this.init = function() {
        /**
         * Собираем метки
         */
        for (var i = 0; i < this.quest.length; i++) {
            var str = this.get(i);

            if (str.substr(0, 1) == ':') {
                if ((this.currentLoc.length == 0) && (this.previousLoc.length == 0)) {
                    this.currentLoc = str.substr(1).toLowerCase().trim();
                    this.previousLoc = str.substr(1).toLowerCase().trim();
                }

                if (str.substr(0, 5) == ':use_') {
                    this.useLabels[str.substr(1).toLowerCase().trim()] = i;
                } else {
                    this.labels[str.substr(1).toLowerCase().trim()] = i;
                }
            }
        }
    };

    /**
     * @param name
     * @param {int} count
     */
    this.addItem = function(name, count) {
        return this.setItem(name, this.getItem(name) + parseInt(count));
    };

    /**
     * @param name
     * @param {int} count
     */
    this.removeItem = function(name, count) {
        return this.setItem(name, this.getItem(name) - parseInt(count));
    };

    /**
     *
     * @param name
     * @param {int} count
     */
    this.setItem = function (name, count) {
        count = parseInt(count);

        if (count <= 0) {
            delete this.items[name];
            this.setVar(name, 0);
        } else {
            this.items[name] = count;
            this.setVar(name, count);
        }
    };

    /**
     *
     * @param name
     * @return {int}
     */
    this.getItem = function (name) {
        return (this.items[name] == undefined) ? 0 : this.items[name];
    };

    /**
     * @param {String} variable
     * @param {*} value
     */
    this.setVar = function(variable, value) {
        variable = variable.trim();

        if (variable.substr(0, 4) == 'inv_') {
            variable = variable.substr(4);

            this.setItem(variable, value);
        } else {
            this.vars[variable.toLowerCase()] = value;
        }
    };

    /**
     * @param variable
     * @returns {*}
     */
    this.getVar = function(variable) {
        variable = variable.toLowerCase();

        if (variable.substr(0, 4) == 'inv_') {
            variable = variable.substr(4);
        }

        if (variable == 'rnd') {
            return Math.random().toFixed(2);
        } else if (variable.substr(0, 3) == 'rnd') {
            return Math.floor(Math.random() * parseInt(variable.substr(3))) + 1;
        }

        if (this.vars[variable] != undefined) {
            return this.vars[variable];
        }

        return 0;
    };

    /**
     * удаление переменных
     */
    this.perkill = function() {
        var me = this;
        me.vars = {};

        $.each(me.items, function(index, value) {
            me.setVar(index, parseInt(value));
        });
    };

    /**
     * удаление предметов
     * @param {String} item
     */
    this.invkill = function(item) {
        var me = this;

        if (item != null) {
            me.setItem(item, 0);
        } else {
            $.each(me.items, function(index, value) {
                me.setItem(index, 0);
            });
        }
    };
}

