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



