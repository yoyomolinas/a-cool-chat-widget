import GlobalStyle from "./GlobalStyle";

import ChatWidget from "./components/ChatWidget";

import PubNub from "pubnub";
import { PubNubProvider } from "pubnub-react";

import { v4 as uuid } from "uuid";

import config from "./Config";

import Cookie from "js-cookie";

const setup = () => {
  let userId = Cookie.get("id");
  if (!userId) {
    userId = uuid();
  }
  Cookie.set("id", userId, { expires: 7 });

  const pubnub = new PubNub({
    publishKey: config.pubnub.publishKey,
    subscribeKey: config.pubnub.subscribeKey,
    uuid: userId,
    heartbeatInterval: 5,
    presenceTimeout: 20,
  });

  return { pubnub, userId };
};

const { userId, pubnub } = setup();

export default () => {
  const iconcolor = document
    .getElementById(config.elementId)
    .getAttribute("$iconcolor");

  const channel = document
    .getElementById(config.elementId)
    .getAttribute("$channel");

  return (
    <PubNubProvider client={pubnub}>
      <GlobalStyle />
      <ChatWidget
        userId={userId}
        icon={config.icon}
        iconcolor={iconcolor}
        channel={channel}
      />
    </PubNubProvider>
  );
};
