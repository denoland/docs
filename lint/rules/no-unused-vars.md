const a = 0;
console.log(a);

const b = 0;
function foo() {
  const b = 1;
  console.log(b);
}
foo();
console.log(b);

let c = 2;
c = 3;
console.log(c);

function d() {
  d();
}
d();

export function e(x: number): number {
  return x + 42;
}

export const f = "exported variable";
