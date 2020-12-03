# Multiple Hooks for Fast-Gateway

## Thought
The other day I was consuming fast-gateway and I came across use-cases to support multiple hooks

## How to use?
* import this package in your fast-gateway application
* create hooks functions 
  * you can now import { onResponseHook } and use typeof onResponseHook to ensure strict typings
* in the config for fast-gateway in the Hooks section
```
import { fgMultipleHooks }  from 'fg-multiple-hooks'; // Typescript
const { fgMultipleHooks } = require('fg-multiple-hooks); // Javascript
hooks: {
    onRequest: (req, res) => fgMultipleHooks.onRequestHooks(req, res, hook1, hook2),
    onResponse: (req, res, stream) => fgMultipleHooks.onResponseHooks(req, res, stream, useDefaultHook, hook1, hook2)
}
```

## Other Notes
* use as many hooks as you please
### OnRequestHook
* Each hookFunction should return a boolean, which if returned as true will abort the request

### OnResponseHook
* Each hookFunction should return a boolean, which if returned as true will abort the request
* Each hookFunction is capable of handling manipulation of stream (response from service to gateway)
* you can pass a boolean to define if the chain of hooks should add the default hook, handling basic scenario(copied from 'fast-gateway'), at the end
