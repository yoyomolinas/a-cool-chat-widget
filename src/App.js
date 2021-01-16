import GlobalStyle from "./GlobalStyle";

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
  const iconcolor = document
    .getElementById(config.elementId)
    .getAttribute("$iconcolor");

  const channel = document
    .getElementById(config.elementId)
    .getAttribute("$channel");

  console.log(channel);

  return (
    <PubNubProvider client={pubnub}>
      <GlobalStyle />
      <ChatWidget icon={config.icon} iconcolor={iconcolor} channel={channel} />
    </PubNubProvider>
  );
};
