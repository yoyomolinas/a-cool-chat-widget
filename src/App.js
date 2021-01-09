import GlobalStyle from "./GlobalStyle";
import Demo from "./components/Demo";
import ChatWidget from "./components/ChatWidget";

import PubNub from "pubnub";
import { PubNubProvider } from "pubnub-react";

import { v4 as uuid } from "uuid";

import config from "./Config";

const pubnub = new PubNub({
  publishKey: config.pubnub.publishKey,
  subscribeKey: config.pubnub.subscribeKey,
  uuid: uuid(),
});

export default () => {
  return (
    <PubNubProvider client={pubnub}>
      <GlobalStyle />
      <ChatWidget
        icon={config.icon}
        iconcolor={config.iconcolor}
        channel={config.pubnub.channel}
      />
    </PubNubProvider>
  );
};
