/**
 * 
There are three main primitives in JavaScript and TypeScript.
    x 'boolean' - true or false values
    x 'number' - whole numbers and floating point values
    x 'string' - text values like "TypeScript Rocks"

There are also 2 less common primitives used in later versions of Javascript and TypeScript.
    x 'bigint' - whole numbers and floating point values, but allows larger negative and positive numbers than the number type.
    x 'symbol' - are used to create a globally unique identifier.

When creating a variable, there are two main ways TypeScript assigns a type:
    x Explicit - writing out the type -> let firstName: string = "Dylan";
    x Implicit - TypeScript will "guess" the type, based on the assigned value -> let firstName = "Dylan";
        Having TypeScript "guess" the type of a value is called infer.

TypeScript may not always properly infer what the type of a variable may be. In such cases, it will set the type to any which disables type checking.
        // Implicit any as JSON.parse doesn't know what type of data it returns so it can be "any" thing...
            const json = JSON.parse("55");
        // Most expect json to be an object, but it can be a string or a number like this example
            console.log(typeof json);
    This behavior can be disabled by enabling noImplicitAny as an option in a TypeScript's project tsconfig.json.
    That is a JSON config file for customizing how some of TypeScript behaves.


Exists lower-cased values, and the upper-case values. Upper-cases ones are for very specific circumstances. (boolean !== Boolean)

Works with Generics -> getArray<T>
 */

let ids: number[] = [];
console.log(ids);

let anything: any[] = [1, true, 'Hello'];
let person: [number, string, boolean] = [1, 'Brad', true];
let asd: [number, string][] = [ // tuple or dictionary
    [1, 'asd'],
]
let pid: string | number = 1;
pid = 'asd';

for (let i = 0; i < 10; i++) {
    let j = i + 15;
    let m = j + 2;
    ids.push(m);
}
console.log(ids);

let cid: any = 1;
let customId = <number>cid;
let customerId = cid as number;

import { greet, addNum } from './src/example';
console.log(greet('Haniel'));

console.log(addNum(1, '2'));
console.log(addNum(1, 2));

enum Coisas { A = 1, B = 2 };
console.log(Coisas.A);

type User = { id: number, name: string, coisa: Coisas };
const user: User = { id: 1, name: 'haniel', coisa: Coisas.A }
console.log(user);

interface UserInterface { readonly id: number, name: string, age?: number }

const user1: UserInterface = { id: 1, name: 'John' }

interface mathFunc { (x: number, y: number): number }
const add: mathFunc = (x: number, y: number): number => x + y;
const sub: mathFunc = (x: number, y: number): number => x - y;

class Person {
    private readonly id: number
    name: string
    constructor(id: number, name: string) {
        this.id = id, this.name = name
    }

    public register() {
        console.log('asd');
    }
}

interface PersonInterface { id: number, name: string, register(): string }
class Person2 implements PersonInterface {
    readonly id: number
    name: string
    constructor(id: number, name: string) {
        this.id = id, this.name = name
    }

    public register() {
        return 'asd';
    }
}
const brad = new Person(1, 'asd');
const mike = new Person2(1, 'asd');
console.log(brad.register());
console.log(mike.register());

/*
Problema clássico de Herança e Composição juntos
Typescript tem o conceito de que interface só trabalha com coisas 'públicas'
Variáveis e funções privadas não podem existir em uma interface, e sim em uma classe
*/
class Employee extends Person implements PersonInterface {
    position: string;
    id!: number;
    /*
    Class 'Employee' incorrectly extends base class 'Person'.
    Property 'id' is private in type 'Person' but not in type 'Employee'.ts(2415)
    */
    constructor(id: number, name: string, position: string) {
        super(id, name); // usa o construtor da classe herdada (Person)
        this.position = position;
    }

    public register(): string {
        return 'asd';
    }
}


function getArray(items: any[]): any[] {
    return new Array().concat(items);
    //clássico no javascript, concatena os dados do array items a um novo array e retorna o novo.

}

function gerArrayTyped<T>(items: T[]): T[] {
    return new Array().concat(items);
    //clássico no javascript, concatena os dados do array items a um novo array e retorna o novo.
}

let anyArray = getArray(['a', 'b', 'c', 'd']);
anyArray.push(1);

let stringArray = gerArrayTyped<string>(['a', 'b', 'c', 'd']);
stringArray.push(1); //Argument of type 'number' is not assignable to parameter of type 'string'.ts(2345)