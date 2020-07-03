declare namespace fgMultipleHooks {
    type OneHook = (req: any, res: any) => boolean
}

declare function fgMultipleHooks(req: any, res: any, ...multipleHooks: Function[]): boolean

export = fgMultipleHooks;
