type OneHook = (req: any, res: any) => boolean;
type LastOnResponseHook = (req: any, res: any, stream: any) => void;
type OnRequestHooks = (
  req: any,
  res: any,
  ...multipleHooks: OneHook[]
) => boolean;
type OnResponseHooks = (
  req: any,
  res: any,
  stream: any,
  last: LastOnResponseHook,
  ...multipleHooks: OneHook[]
) => void;
class FgMultipleHooks {
  onRequestHooks: OnRequestHooks;
  onResponseHooks: OnResponseHooks;
}
const fgMultipleHooks = new FgMultipleHooks();
export = fgMultipleHooks;
