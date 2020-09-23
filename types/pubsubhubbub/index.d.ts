// Type definitions for PubSubHubBub library
// Project: <insert github link>
// Definitions by: Alexander Nou <https://github.com/crazfluff>
// TypeScript Version: 3.9.7

declare module "pubsubhubbub" {
  function createServer(
    options: PubSubHubBub.PubSubHubBubOptions
  ): PubSubHubBub;

  class PubSubHubBub {
    constructor(options: PubSubHubBubOptions);
    setSubscription(
      mode: string,
      topic: string,
      hub: string,
      callbackUrl?: string | any,
      callback?: any
    ): void;
    unsubscribe(
      topic: string,
      hub: string,
      callbackUrl?: string | any,
      callback?: any
    ): void;
    subscribe(
      topic: string,
      hub: string,
      callbackUrl?: string | any,
      callback?: any
    ): void;
    listen(args: any): void;
    listener(): any;
    on(event: string, callback: PubSubHubBub.ListenerCallback): void;
  }

  namespace PubSubHubBub {
    interface PubSubHubBubOptions {
      callbackUrl: string;
      headers?: string[];
      secret?: string;
      leaseSeconds?: number;
      maxContentSize?: number;
      username?: string;
      password?: string;
      sendImmediately?: number;
    }

    type ListenerCallback = (data: int) => void;
  }

  export default {
    PubSubHubBub,
    createServer,
  };
}
