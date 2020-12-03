export function onRequestHook(req: any, res: any): boolean;
export function onRequestHooks(
  req: any,
  res: any,
  ...multipleHooks: typeof onRequestHook[]
): boolean;

export function onResponseHook(req: any, res: any, stream: any): void;
export function onResponseHooks(
  req: any,
  res: any,
  stream: any,
  useDefaultHook: boolean,
  ...multipleHooks: typeof onResponseHook[]
): void;

export const fgMultipleHooks: {
    onRequestHooks: typeof onRequestHooks;
    onResponseHooks: typeof onResponseHooks;
  };