export interface JSonRpcMessage {
  id: number;
  jsonrpc: string;
  method: string;
  params: any;
}

export interface JSonRpcResult {
  id: number;
  jsonrpc: string;
  result: any;
}
