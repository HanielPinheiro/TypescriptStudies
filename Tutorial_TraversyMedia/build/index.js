"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let ids = [];
console.log(ids);
let anything = [1, true, 'Hello'];
let person = [1, 'Brad', true];
let asd = [
    [1, 'asd'],
];
let pid = 1;
pid = 'asd';
for (let i = 0; i < 10; i++) {
    let j = i + 15;
    let m = j + 2;
    ids.push(m);
}
console.log(ids);
let cid = 1;
let customId = cid;
let customerId = cid;
const example_1 = require("./src/example");
console.log((0, example_1.greet)('Haniel'));
console.log((0, example_1.addNum)(1, '2'));
console.log((0, example_1.addNum)(1, 2));
var Coisas;
(function (Coisas) {
    Coisas[Coisas["A"] = 1] = "A";
    Coisas[Coisas["B"] = 2] = "B";
})(Coisas || (Coisas = {}));
;
console.log(Coisas.A);
const user = { id: 1, name: 'haniel', coisa: Coisas.A };
console.log(user);
const user1 = { id: 1, name: 'John' };
const add = (x, y) => x + y;
const sub = (x, y) => x - y;
class Person {
    constructor(id, name) {
        this.id = id, this.name = name;
    }
    register() {
        console.log('asd');
    }
}
class Person2 {
    constructor(id, name) {
        this.id = id, this.name = name;
    }
    register() {
        return 'asd';
    }
}
const brad = new Person(1, 'asd');
const mike = new Person2(1, 'asd');
console.log(brad.register());
console.log(mike.register());
class Employee extends Person {
    constructor(id, name, position) {
        super(id, name);
        this.position = position;
    }
    register() {
        return 'asd';
    }
}
function getArray(items) {
    return new Array().concat(items);
}
function gerArrayTyped(items) {
    return new Array().concat(items);
}
let anyArray = getArray(['a', 'b', 'c', 'd']);
anyArray.push(1);
let stringArray = gerArrayTyped(['a', 'b', 'c', 'd']);
stringArray.push(1);
//# sourceMappingURL=index.js.map