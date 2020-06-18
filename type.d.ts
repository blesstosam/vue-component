declare interface AjaxResponse<T = any> {
  code: number;
  data: T;
  msg: string;
}