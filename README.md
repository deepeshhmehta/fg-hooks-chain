# Multiple Hooks for Fast-Gateway

## Thought
The other day I was consuming fast-gateway and I came across use-cases to support multiple hooks

## How to use?
* import this package in your fast-gateway application
* create hooks functions 
* in the config for fast-gateway in the Hooks section
```
import { multipleHooks } from 'fg-multiple-hooks';
hooks: {
    onRequest: async multipleHooks(req, res, hookFunction1, hookFunction2, ...),
    onResponse: ...
}
```

## Other Notes
* Each hookFunction should return a boolean, which if returned as true will abort the request
