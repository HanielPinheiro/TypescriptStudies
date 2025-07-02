type Pizza = { name: string, price: number };

const menu: Pizza[] = [
    { name: 'Margherita', price: 8 },
    { name: 'Pepperoni', price: 10 },
    { name: 'Hawaiian', price: 10 },
    { name: 'Veggue', price: 9 },
];
function addNewPizza(coisa: Pizza) {
    menu.push(coisa);
}

let cashInRegister = 100;
let nextOrderId = 1;

enum Status { Requested = 0, Canceled = 1, Completed = 2 };

type Order = { id: number, pizza: Pizza, status: Status }
const orderQueue: Order[] = [];

function placeOrder(pizzaName: string) {
    const selectedPizza = menu.find(pizzaObj => pizzaObj.name === pizzaName);
    if (!selectedPizza) throw new Error("Invalid pizza name, please try again");

    const newOrder: Order = { id: nextOrderId++, pizza: selectedPizza, status: Status.Requested };
    orderQueue.push(newOrder);
    cashInRegister += selectedPizza.price;

    return newOrder;
}

function completeOrder(orderId: number) {
    let order = orderQueue.find(order => order.id === orderId);
    if (!order) throw new Error("Invalid order id, please try again");

    order.status = Status.Completed;

    return order;
}

type User = { name: string, age: number };
type UpdatedUser = Partial<User>; // can return a any attribute or propertie of a object with value = null

let user: User = { name: "A", age: 1 };
let user2: UpdatedUser = { age: 2 };
user2 = user;
user = user2;

//In some cases the composition will be destroyed like this function a(asd:Partial<User>):User{ let a = {id:1, ...asd} return a;}
//To solve we can use a lot of specific types already existents in typescript
//One of them is Omit type
//function a(asd:Omit<User, "id">):User{ let a = {id:1, ...asd} return a;} -> works because im omitting the 'id' and writing 'id' inside function