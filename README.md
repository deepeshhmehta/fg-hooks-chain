# Multiple Hooks for Fast-Gateway

## Thought
The other day I was consuming fast-gateway and I came across use-cases to support multiple hooks

## How to use?
* import this package in your fast-gateway application
* create hooks functions 
* in the config for fast-gateway in the Hooks section
```
import multipleHooks from 'fg-multiple-hooks';
hooks: {
    onRequest: (req, res) => multipleHooks(req, res, hook1, hook2), // you can add as many hooks as you please
    onResponse: ...
}
```

## Other Notes
* Each hookFunction should return a boolean, which if returned as true will abort the request
