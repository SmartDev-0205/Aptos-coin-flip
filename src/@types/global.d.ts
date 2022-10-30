declare module '*.jpg'
declare interface Window {
  aptos: any
  martian: any
}
declare interface AptosInterface {
  play: any;
  handleConnect: any;
  handleDisconnect: any;
  address: string | null;
  isConnected: boolean;
}
