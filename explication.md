```js
const user = {
  id: 1,
  name: "Jean",
  animals: [{
    id: 2,
    type: "chien",
    age: 4
  }]
}
```
Table User => name: string, animalsId: interger[], id: interger|auing|prykey
Table Animal => type: string, age: interger, id: interger|auing|prykey

en back
mysql stp donne user 1 => 
```js
{
  id: 1,
  name: "Jean",
  animalsId: [2]
}
```
le programme boucle dans animalsId et fait
  mysql stp donne animal 2 => 
  ```js
  {
    id: 2,
    type: "chien",
    age: 4
  }
  ```

apres on fait en sorte d'avoir au final => 
```js
{
  id: 1,
  name: "Jean",
  animals: [{
    id: 2,
    type: "chien",
    age: 4
  }]
}
```