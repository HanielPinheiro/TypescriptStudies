/**
 * Conclusões
 * Evitar gambiarras SEMPRE
 * Evitar repetição de códigos - abstrair pra classe ou função genérica
 * Retornar void sempre
 * Evitar overload de métodos (é apenas um atalho, a lógica vai ficar poluída) - Preferir Funções genéricas bem trabalhadas
 * Usar Enum, Interfaces e Types sempre que possível
 * Types são  vastos e podem ser complexos, cuidado com coisas elaboradas demais
 * MUITO CUIDADO COM THIS EM CLASSES (JAVASCRIPT E HORRÍVEL COM CLASSES, FOCAR AO MÁXIMO EM COISAS SIMPLES E EM FUNÇÕES)
 * Usar Unknowm no lugar de Any
 * Aproveitar boas coisas do javascript como 'swim' in Animal e var instanceOf Animal
 * typeof 'string' === var é horrível, deveria ser typeof Enum.String === var e a constante ficar num enum
 * 
 * USAR NAMESPACES SEMPRE E COM PRECISÃO
 * USAR IMPORT E EXPORT CORRETAMENTE!
 * 
 * Next vs Vite
 * Next.JS tem tudo dentro, ótimo pra página leve e bem otimizada, mas é pesado pra desenvolvimento, leva 2 a 3 minutos pra buildar em projeto grande.
 * Vite é mais rápido no build, mas precisa de diversas libs adicionais, como axios (API Call), vite ssr (Server Side), dentre outras.
 * 
 */

/**
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
// class Employee extends Person implements PersonInterface {
//     position: string;
//     id!: number;
//     /*
//     Class 'Employee' incorrectly extends base class 'Person'.
//     Property 'id' is private in type 'Person' but not in type 'Employee'.ts(2415)
//     */
//     constructor(id: number, name: string, position: string) {
//         super(id, name); // usa o construtor da classe herdada (Person)
//         this.position = position;
//     }

//     public register(): string {
//         return 'asd';
//     }
// }


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
// stringArray.push(1); //Argument of type 'number' is not assignable to parameter of type 'string'.ts(2345)

/*-------------------------- LENDO A DOCUMENTACAO -----------------------------*/
interface Circle {
    kind: "circle";
    radius: number;
}

interface Square {
    kind: "square";
    sideLength: number;
}

interface Triangle {
    kind: "triangle";
    sideLength: number;
}
/*
 * Differences Between Type Aliases and Interfaces
 * Type aliases and interfaces are very similar, and in many cases you can choose between them freely.
 * Almost all features of an interface are available in type, the key distinction is that a type cannot
 * be re-opened to add new properties vs an interface which is always extendable.
 */
type Shape = Circle | Square | Triangle;

type Shape2 = Circle | Square;

function getArea1(shape: Shape2) {
    switch (shape.kind) {
        case "circle":
            return Math.PI * shape.radius ** 2;
        case "square":
            return shape.sideLength ** 2;
        default:
            const _exhaustiveCheck: never = shape; // TypeScript will use a never type to represent a state which shouldn’t exist
            return _exhaustiveCheck;
    }
}

function getArea(shape: Shape) {
    switch (shape.kind) {
        case "circle":
            return Math.PI * shape.radius ** 2;
        case "square":
            return shape.sideLength ** 2;
        // default:
        //     const _exhaustiveCheck: never = shape;
        //     // Type 'Triangle' is not assignable to type 'never'.
        //     return _exhaustiveCheck;
    }
}

/**
 * Sometimes you will have information about the type of a value that TypeScript can’t know about.
 * if you’re using document.getElementById, TypeScript only knows that this will return some kind of HTMLElement
 * you can use a type assertion to specify a more specific type:
 * 
 * Reminder: Because type assertions are removed at compile-time, there is no runtime checking associated with a type assertion.
 * THERE WON’T BE AN EXCEPTION OR NULL GENERATED IF THE TYPE ASSERTION IS WRONG
*/
const myCanvas = document.getElementById("main_canvas") as HTMLCanvasElement;
//const a = expr as any as T; // in case of problems with the assertion expr as T

/** Equivalente ao DELEGATE---------
 * Callback functions (funções passadas como argumentos)
 * Higher-order functions (funções que recebem outras funções como parâmetro)
 */

function printToConsole(s: string) {
    console.log(s);
}
function runDelegate(fn: (stringValue: string) => void) {
    fn("Hello, World");
}
runDelegate(printToConsole);

async function fetchData(url: string): Promise<string> {
    const response = await fetch(url);
    return JSON.stringify(await response.text());
}
async function doubleNumber(n: number): Promise<number> {
    return n * 2;
}

//generics are all about relating two or more values with the same type!
async function runGenericAsyncDelegate<T, R>(asyncFn: (input: T) => Promise<R>, input: T): Promise<R> {
    console.log(`Iniciando operação com:`, input);
    const start = Date.now();

    try {
        const result = await asyncFn(input);
        const duration = Date.now() - start;
        console.log(`Operação concluída em ${duration}ms`);
        return result;
    } catch (error) {
        console.error(`Operação falhou após ${Date.now() - start}ms`);
        throw error;
    }
}

runGenericAsyncDelegate(doubleNumber, 21).then(console.log);
runGenericAsyncDelegate(fetchData, "http://my_api_url.com").then(console.log);

/**
 * JavaScript has an operator for determining if an object or its prototype chain has a property with a name: the in operator.
 *  TypeScript takes this into account as a way to narrow down potential types.
 */
type Fish = { swim: () => void };
type Bird = { fly: () => void };

function move(animal: Fish | Bird) {
    if ("swim" in animal) {
        return animal.swim();
    }

    return animal.fly();
}

/**
 * JavaScript has an operator for checking whether or not a value is an “instance” of another value.
 * As you might have guessed, instanceof is also a type guard, and TypeScript narrows in branches guarded by instanceofs.
 */

function logValue(x: Date | string) {
    if (x instanceof Date) {
        console.log(x.toUTCString());//(parameter) x: Date
    } else {
        console.log(x.toUpperCase());// (parameter) x: string
    }
}
/**
 * JavaScript functions can also be invoked with the new operator. 
 * TypeScript refers to these as constructors because they usually create a new object.
 * You can write a construct signature by adding the new keyword in front of a call signature:
 */
type SomeObject = {};
type SomeConstructor = {
    new(s: string): SomeObject;
};
function fn(ctor: SomeConstructor) {
    return new ctor("hello");
}

/**
 * Callbacks with optional
 * Rule: When writing a function type for a callback, never write an optional parameter unless 
 * you intend to call the function without passing that argument
 */
function myForEach(arr: any[], callback: (arg: any, index?: number) => void) {
    for (let i = 0; i < arr.length; i++) {
        callback(arr[i]);         // I don't feel like providing the index today
    }
}

// 👉 Overload signatures - 
// In typescript overloads are not good like c#/java, so use generics can be more elegant and cleaner
function addNum(x: number, y: number): number;
function addNum(x: number, y: string): string;
//in typescript oveloads are shortcuts that evokes the main function that will do the logic,
//the both functions above are shortcuts to the function below
function addNum(x: number, y: number | string): number | string {
    //Type Guard
    if (typeof y === 'string') {
        return x + y;
    } else {
        return x + y;
    }
}

/**
 * Other Types to Know About
 * 1- EXPLICIT VOID RETURN WHEN RETURN NOTHING BECAUSE NOTHING IN JS IS UNDEFINED
 *      In JavaScript, a function that doesn’t return any value will implicitly return the value undefined.
 *      void and undefined are not the same thing in TypeScript
 * 2 - TS has object and Object. ALWAYS USE object!!!
 * 3 - The unknown type represents any value. This is similar to the any type,
 *     but is safer because it’s not legal to do anything with an unknown value
 * 4 - never 
 *      represents values which are never observed. 
 *      In a return type, this means that the function throws an exception or terminates execution of the program.
 * 5 - Function - NOT USE IT, RETURN ANY IS DANGEROUS!
 *      The global type Function describes properties like bind, call, apply, and others present on all function values in JavaScript.
 *      It also has the special property that values of type Function can always be called; these calls return any
 */

/**
 * A rest parameter appears after all other parameters, and uses the ... syntax:
 */
function multiply(n: number, ...m: number[]) {
    return m.map((x) => n * x);
}
const a = multiply(10, 1, 2, 3, 4); // 'a' gets value [10, 20, 30, 40]
//in general, TypeScript does not assume that arrays are immutable
//The best fix for this situation depends a bit on your code, but in general a const
const args = [8, 5] as const;

/**
 * Parameter Destructuring
 */
type ABC = { a: number; b: number; c: number };
function sum({ a, b, c }: ABC) {
    console.log(a + b + c);
}

/**
 * Object Types
 * https://www.typescriptlang.org/cheatsheets/
 * In JavaScript, the fundamental way that we group and pass around data is through objects
 * In TypeScript, we represent those through object types.
 */
//v1 - verbose
function greet(person: { name: string; age: number }) {
    return "Hello " + person.name;
}

//v2 - interface
//readonly Properties - a property marked as readonly can’t be written to during type-checking
interface Home {
    //Using mapping modifiers, you can remove readonly attributes.
    readonly resident: { name: string; age: number };
}

function visitForBirthday(home: Home) {
    // We can read and update properties from 'home.resident'.
    console.log(`Happy birthday ${home.resident.name}!`);
    home.resident.age++;
}

// function evict(home: Home) {
//   // But we can't write to the 'resident' property itself on a 'Home'.
//   home.resident = { Cannot assign to 'resident' because it is a read-only property.
//     name: "Victor the Evictor",
//     age: 42,
//   };
// }

interface Personi {
    name: string;
    age?: number; // optional property
}
//Ovewrite property type
interface ESD extends Personi {
    name: any //typed as any, works, but can lead to accidents down the line. instead should use unknown
}
function griit2(person: Personi) {
    return "Hello " + person.name;
}
function griit3(person: ESD) {
    return "Hello " + person.name;
}
griit2({ name: "a" });
griit3({ name: 1, age: 100 }); //gambiarra, não pode ser number em ESD, porque bate de frente com string. O ideal é criar outra prop, ou string|number

//v3 - type alias
type Personis = {
    name: string;
    age: number;
};


function greet3(person: Personis) {
    return "Hello " + person.name;
}

//An intersection type is defined using the & operator.
interface Colorful {
    color: string;
}
interface Circle {
    radius: number;
}

type ColorfulCircle = Colorful & Circle;

/**
 * Interface Extension vs. Intersection
 * The principal difference between the two is how conflicts are handled, and that difference is typically
 * one of the main reasons why you’d pick one over the other between an interface and a type alias of an intersection type.
 * 
 * If interfaces are defined with the same name, TypeScript will attempt to merge them if the properties are compatible.
 * If the properties are not compatible (i.e., they have the same property name but different types), TypeScript will raise an error.
 * Error: incompatiple (name = string cant be name = number)
    interface Person {
        name: string;
    }
    interface Person {
        name: number;
    }
 * In the case of intersection types, properties with different types will be merged automatically.
 * When the type is used later, TypeScript will expect the property to satisfy both types simultaneously, which may produce unexpected results.
    interface Person1 {
    name: string;
    } 
    interface Person2 {
    name: number;
    }    
    type Staff = Person1 & Person2    
    declare const staffer: Staff;
    staffer.name; -> THIS WILL RETURN A NEVER, THAT MEANS NOTHING OR ERROR AND CAN END THE PROGRAM
 */

/**
 * EXEMPLO DE BOM USO DE TYPES
*/
type OrNull<Type> = Type | null;
type OneOrMany<Type> = Type | Type[];
type OneOrManyOrNull<Type> = OrNull<OneOrMany<Type>>;
type OneOrManyOrNullStrings = OneOrManyOrNull<string>;
/**
 * TypeScript’s type system is very powerful because it allows expressing types in terms of other types.
 * https://www.typescriptlang.org/docs/handbook/2/types-from-types.html
 * Generics - Types which take parameters
 * Keyof Type Operator - Using the keyof operator to create new types
 * Typeof Type Operator - Using the typeof operator to create new types
 * Indexed Access Types - Using Type['a'] syntax to access a subset of a type
 * Conditional Types - Types which act like if statements in the type system
 * Mapped Types - Creating types by mapping each property in an existing type
 * Template Literal Types - Mapped types which change properties via template literal strings
 */
//ReadonlyArrays =>  arrays that shouldn’t be changed


/**
 * Classes - Getters / Setters
 */
class C {
  _length = 0;
  get length() {
    return this._length;
  }
  set length(value) {
    this._length = value;
  }
}

class Base {
  greet() {
    console.log("Hello, world!");
  }
}
 
class Derived extends Base {
  greet(name?: string) {
    if (name === undefined) {
      super.greet();
    } else {
      console.log(`Hello, ${name.toUpperCase()}`);
    }
  }
}

//not exist static classes in typescript

// Unnecessary "static" class
class MyStaticClass {
  static doSomething() {}
}
 
// Preferred (alternative 1)
function doSomething() {}
 
// Preferred (alternative 2)
const MyHelperObject = {
  dosomething() {},
};

//Gambiarras pra contornar coisas que deveriam ser normais mas não são pq JS é zuado

class MyClass {
  name = "MyClass";
  getName() {
    return this.name;
  }
}
const c = new MyClass();
const obj = {
  name: "obj",
  getName: c.getName,
};
 
// Prints "obj", not "MyClass"
console.log(obj.getName());

//Option 1:
class MyClass2 {
  name = "MyClass";
  getName = () => {
    return this.name;
  };
}
const c2 = new MyClass();
const g = c2.getName; //atribuiu lambda function
console.log(g()); // Prints "MyClass" instead of crashing -> invocou lambda

// option 2
class MyClass3 {
  name = "MyClass";
  getName(this: MyClass3) {
    return this.name;
  }
}
const c3 = new MyClass();
// OK
c3.getName(); //invocou função que não é lambda
 
// Error, would crash
const g3 = c.getName; //-> atribuiu função que não é lambda
console.log(g3());

//A melhor solução (opção 2) é usar um parâ metro na função pra referenciar a própria classe (GAMBIARRA MALUCAAA kkkk MDS)

/**
 * GO HORSE COM CLASSES E OOP kkkk mds pq javascript ainda existe?
 */
class Empty {}
 
function superSemSentido(x: Empty) {
  // can't do anything with 'x', so I won't
}
 
// All OK!
superSemSentido(window);
superSemSentido({});
superSemSentido(superSemSentido);

/**
 * MODULES => COISA ULTRA IMPORTANTE NO REACT!!!
 * import/export syntax. ES Modules was added to the JavaScript spec in 2015
 * any file containing a top-level import or export is considered a module
 * 
 * Variables, functions, classes, etc. declared in a module are not visible outside the module unless
 * they are explicitly exported using one of the export forms.
 * 
 * To consume a variable, function, class, interface, etc. exported from a 
 * different module, it has to be imported using one of the import forms. 
 * 
 * JavaScript specification declares that any JavaScript files without an import declaration, 
 * export, or top-level await should be considered a script and not a module. * 
 * export {}; will change the file to be a module exporting nothing
 * 
 * Modules in TypeScript:
 * There are three main things to consider when writing module-based code in TypeScript:
 *      Syntax: What syntax do I want to use to import and export things?
 *      Module Resolution: What is the relationship between module names (or paths) and files on disk?
 *      Module Output Target: What should my emitted JavaScript module look like?
 * A file can declare a main export via export default
 *      export default function helloWorld()
 * This is then imported via:
 *      import helloWorld from "./hello.js";
 * if u use export in variables, classes or functions you can import  only what u need
 *      import { pi, phi, absolute } from "./maths.js";
 * An import can be renamed using a format like import {old as new}:
 *      import { pi as π } from "./maths.js";
 *      import * as math from "./maths.js";
 *      import "./file" => not include any variable, the import does nothing, don't do it.
 *      import { createCatName, type Cat, type Dog } from "./animal.js"; => SHOULD SPECIFY TYPE WHEN IMPORT A TYPE
 * 
 * TypeScript has ES Module syntax which directly correlates to a CommonJS and AMD require.
 *      import fs = require("fs");
 *      const code = fs.readFileSync("hello.ts", "utf8");
 * 
 * in lib.js
 *      function absolute(num: number) {
            if (num < 0) return num * -1;
            return num;
        }
 
        module.exports = {
        pi: 3.14,
        squareTwo: 1.41,
        phi: 1.61,
        absolute,
        };
 * in use.js
        const maths = require("./maths");
                or
        const { squareTwo } = require("./maths");
 */

/**
 * USING NAMESPACE
 * 
 * namespace Validation {
        export interface StringValidator {
            isAcceptable(s: string): boolean;
        }
    }

    /// <reference path="Validation.ts" />
    namespace Validation {
        const lettersRegexp = /^[A-Za-z]+$/;
        export class LettersOnlyValidator implements StringValidator {
            isAcceptable(s: string) {
                return lettersRegexp.test(s);
            }
        }
    }
 */

