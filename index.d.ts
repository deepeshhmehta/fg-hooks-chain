type multipleHooks = (req: any, res: any, ...multipleHooks: Function) => boolean
type oneHook = (req: any, res: any) => boolean