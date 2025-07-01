export function greet(name: string): string {
  return `Hello, ${name}!`;
}

//Conclusão, overload em Typescript adiciona complexidade, evitar!
// 👉 Overload signatures
export function addNum(x: number, y: number): number;
export function addNum(x: number, y: string): string;

// 👉 Implementation signature (must be compatible with all above)
export function addNum(x: number, y: number | string): number | string {
  //Best Practice in TypeScript: Type Guard
  if (typeof y === 'string') {
    return x + y;
  } else {
    return x + y;
  }
}

// Equivalente a?
// export function addNum(x: number, y: string): string {
//   return x + y;
// }

// export function addNum2(x: number, y: number): number {
//   return x + y;
// }


