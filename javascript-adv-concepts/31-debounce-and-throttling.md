## Debounce and throttling

- Debouncing and throttling are both used to enhance the website performance by limiting the number of times the events are triggered. Debouncing and throttling are not provided by JavaScript.
- They’re just concepts that can be implemented using the setTimeout web API.
- These techniques are particularly useful in handling repetitive events such as scrolling, resizing, keypress, or mouse movements in web development, allowing for better performance and user experience.


 ### Debouncing
- **Definition**: Debouncing is a technique where you delay the execution of a function until after a certain amount of time has passed.
- No matter how many times the user fires the event, the connected function will only run once the user stops firing the event, according to the Debouncing approach. 
- Essentially, it ensures that a function does not get called again until a certain amount of time has passed without it being called.

- Let’s take an example. You have opened an e-commerce website to search for laptop bags.

- If debounce is not applied you can see in the below image the number of calls is made on every keystroke.

![image](https://github.com/venkatdas/Interview_prep/assets/43024084/9653d263-816f-4852-ae73-f1f358869249)

- After implementing debounce, we have significantly reduced the number of calls. Now calls are made only when the user types again after the specified time.
- The function will be executed only when the time taken by the user to type again is equal to the delay that we have provided.

![image](https://github.com/venkatdas/Interview_prep/assets/43024084/8b2a97f9-b664-43d2-986a-7cde80ff1988)

___________________________


### Throttling:

- **Definition**:
- Throttling is a similar technique to debouncing, but instead of delaying the execution of a function, it limits the rate at which a function.
- Throttling is a technique in which, no matter how many times the user fires the event, the attached function will be executed only once in a given time interval. 

- Throttling is also used to rate-limit the function call.
- Throttling will fire the function call only once in 1000ms(the limit which we have provided), no matter how many times the user fires the function call.

![image](https://github.com/venkatdas/Interview_prep/assets/43024084/4a91590b-c454-45c7-8314-0b6fe8754aff)
 




