## SOLID Principles

- They were introduced by Robert C. Martin in his 2000 paper “Design Principles and Design Patterns” to help developers write software that is easy to understand, modify, and extend.

The SOLID acronym stands for:

- Single Responsibility Principle (SRP)
- Open-Closed Principle (OCP)
- Liskov Substitution Principle (LSP)
- Interface Segregation Principle (ISP)
- Dependency Inversion Principle (DIP)

- Applying SOLID principles can lead to code that is more modular, maintainable, and extensible, and it can make it easier for developers to work collaboratively on a codebase.

**Single Responsibility Principle (SRP)**

- The Single Responsibility Principle (SRP) states that a class **should have only one reason to change**, or in other words, it should have only one responsibility. This means that a class should have only one job to do, and it should do it well.
- If a Class has many responsibilities, it increases the possibility of bugs because making changes to one of its responsibilities, could affect the other ones without you knowing.

**Open-Closed Principle (OCP)**

- Classes should be open for extension, but closed for modification
- The Open-Closed Principle (OCP) states that software entities (classes, modules, functions, and so on) should be open for extension but closed for modification. This means that the behavior of a software entity can be extended without modifying its source code.
- The OCP is essential because it promotes software extensibility and maintainability. By allowing software entities to be extended without modification, developers can add new functionality without the risk of breaking existing code. This results in code that is easier to maintain, extend, and reuse.

**Liskov Substitution Principle (LSP)**

![image](https://github.com/venkatdas/Interview_preparation/assets/43024084/de6c2ea4-4a88-4456-898b-8728a319ddaa)

- If S is a subtype of T, then objects of type T in a program may be replaced with objects of type S without altering any of the desirable properties of that program.
- When a child Class cannot perform the same actions as its parent Class, this can cause bugs.

- If you have a Class and create another Class from it, it becomes a parent and the new Class becomes a child. The child Class should be able to do everything the parent Class can do. This process is called Inheritance.

- The child Class should be able to process the same requests and deliver the same result as the parent Class or it could deliver a result that is of the same type.

- The picture shows that the parent Class delivers Coffee(it could be any type of coffee). It is acceptable for the child Class to deliver Cappucino because it is a specific type of Coffee, but it is NOT acceptable to deliver Water.

- If the child Class doesn’t meet these requirements, it means the child Class is changed completely and violates this principle.

**Interface Segregation Principle (ISP)**

- Clients should not be forced to depend on methods that they do not use.
- The Interface Segregation Principle (ISP) focuses on designing interfaces that are specific to their client's needs. It states that no client should be forced to depend on methods it does not use.
- The Interface Segregation Principle (ISP) focuses on designing interfaces that are specific to their client's needs. It states that no client should be forced to depend on methods it does not use.

**Dependency Inversion Principle (DIP)**

- High-level modules should not depend on low-level modules. Both should depend on the abstraction.

- Abstractions should not depend on details. Details should depend on abstractions.

- Firstly, let’s define the terms used here more simply

- High-level Module(or Class): Class that executes an action with a tool.

- Low-level Module (or Class): The tool that is needed to execute the action

- Abstraction: Represents an interface that connects the two Classes.

- Details: How the tool works

- This principle says a Class should not be fused with the tool it uses to execute an action. Rather, it should be fused to the interface that will allow the tool to connect to the Class.

- It also says that both the Class and the interface should not know how the tool works. However, the tool needs to meet the specification of the interface.

---

- In React SOLID principles as follows

**Single Responsibility Principle**

- Each component should have a single responsibility.

- A React component should do one thing well, whether it is - - - rendering UI, managing state, or handling logic.

```js
// BAD: Violates SRP
function Dashboard() {
  const [data, setData] = React.useState([]);

  React.useEffect(() => {
    fetch("/api/data")
      .then((response) => response.json())
      .then((data) => setData(data));
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>
      {data.map((item) => (
        <p key={item.id}>{item.name}</p>
      ))}
    </div>
  );
}

// GOOD: Follows SRP
function Dashboard() {
  const data = useDataFetch("/api/data");

  return (
    <div>
      <h1>Dashboard</h1>
      {data.map((item) => (
        <p key={item.id}>{item.name}</p>
      ))}
    </div>
  );
}
// custom hook to fetch any api url
function useDataFetch(url) {
  const [data, setData] = React.useState([]);

  React.useEffect(() => {
    fetch(url)
      .then((response) => response.json())
      .then((data) => setData(data));
  }, [url]);

  return data;
}
```

**O - Open/Closed Principle (OCP)**

- Components should be open for extension but closed for modification.

- Instead of modifying components directly, use props or higher-order components (HOCs) to extend functionality.

```js
// BAD: Violates OCP
function Button({ type }) {
  if (type === "primary") {
    return (
      <button style={{ color: "white", backgroundColor: "blue" }}>
        Primary
      </button>
    );
  } else if (type === "secondary") {
    return (
      <button style={{ color: "black", backgroundColor: "gray" }}>
        Secondary
      </button>
    );
  }
}

// GOOD: Follows OCP
function Button({ style, children }) {
  return <button style={style}>{children}</button>;
}

// Extend functionality via props
const primaryStyle = { color: "white", backgroundColor: "blue" };
const secondaryStyle = { color: "black", backgroundColor: "gray" };

// Usage
<Button style={primaryStyle}>Primary</Button>;
<Button style={secondaryStyle}>Secondary</Button>;
```

**L - Liskov Substitution Principle (LSP)**

- Components or objects should be replaceable with their subtypes without altering the behavior.

- In React, this often means creating reusable components that can be used interchangeably.

```js
// BAD: Violates LSP
function Image({ type }) {
  if (type === "profile") {
    return <img src="/profile.jpg" alt="Profile" />;
  } else if (type === "banner") {
    return <img src="/banner.jpg" alt="Banner" />;
  }
}

// GOOD: Follows LSP
function Image({ src, alt }) {
  return <img src={src} alt={alt} />;
}

// Usage
<Image src="/profile.jpg" alt="Profile" />;
<Image src="/banner.jpg" alt="Banner" />;
```

**I - Interface Segregation Principle (ISP)**

- Components should not be forced to depend on props they do not use.

- React components should only accept the props they actually need, avoiding large or bloated prop interfaces.

```js
// BAD: Violates ISP
function UserCard({ user, showEmail, showAddress }) {
  return (
    <div>
      <h2>{user.name}</h2>
      {showEmail && <p>{user.email}</p>}
      {showAddress && <p>{user.address}</p>}
    </div>
  );
}

// GOOD: Follows ISP
function UserCard({ name }) {
  return <h2>{name}</h2>;
}

function UserEmail({ email }) {
  return <p>{email}</p>;
}

function UserAddress({ address }) {
  return <p>{address}</p>;
}

// Usage
<UserCard name="John Doe" />;
<UserEmail email="john.doe@example.com" />;
<UserAddress address="123 Street Name" />;
```

**D - Dependency Inversion Principle (DIP)**

- High-level components should not depend on low-level details. Both should depend on abstractions.

- In React, you can achieve this by using context or dependency injection patterns.


```js
