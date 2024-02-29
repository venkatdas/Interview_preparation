
### JRE (Javascript Runtime Enviroment)

![image](https://github.com/venkatdas/Interview_prep/assets/43024084/be9366c0-ed48-4b89-9989-d74491e5a045)

- Js Engine is not a machine .. it's piece of code that written into lowlevel language


![image](https://github.com/venkatdas/Interview_prep/assets/43024084/07492d8e-b0ba-4cd6-a1b3-04a74131ea82)


![image](https://github.com/venkatdas/Interview_prep/assets/43024084/8e0030ee-f0d8-4026-bb44-263b3a5717f9)


![image](https://github.com/venkatdas/Interview_prep/assets/43024084/822ed057-28f1-4b1d-b8b2-6abd8439b509)



![image](https://github.com/venkatdas/Interview_prep/assets/43024084/3a3758e4-29ab-463c-8ffc-0d314fb7e849)


- JavaScript combines both compilation and interpretation. This is called Just-in-Time compilation.
- This method compiles the entire code into machine code all at once and executes it.

- our JS code is broken into tokens (ex: parser is one of the token we can refer to)
- And these tokens are formed into Abstract Syntax Tree (AST). For more details explore website: https://astexplorer.net
- And from AST, the code will go through the Interpreter and it spits out into Bytecode (which is able to be interpreted by Javascript engine)

- JavaScript is primarily interpreted, but modern JavaScript engines, like V8 used in Google Chrome, incorporate JIT compilation techniques to improve performance by translating JavaScript code into optimized machine code just before it’s executed.
- This combination of interpretation and JIT compilation makes JavaScript a versatile and high-performance language for web applications.
