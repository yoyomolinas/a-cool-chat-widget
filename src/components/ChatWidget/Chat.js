import React, { useRef, useEffect, useState, Fragment } from "react";
import { usePubNub } from "pubnub-react";
import {
  TopBar,
  BottomBar,
  ChatContainer,
  TextMessage,
  Button,
  Icon,
  Text,
  TextInput,
  Separator,
  Row,
} from "./styled";
import tokens from "./tokens";
import { useChatWidget } from "./index";

const Chat = (props) => {
  const chatWidget = useChatWidget();

  const listRef = useRef(null);
  const scrollToEnd = (el = listRef.current) => {
    if (el) {
      setTimeout(() => {
        el.scrollTop = el.scrollHeight + 100;
      }, 200);
    }
  };

  useEffect(() => {
    scrollToEnd();
  }, []);

  return (
    <>
      <Separator palette="darkgrey" border="bo+1" />
      <ChatContainer ref={listRef}>
        <Separator spacing="sp+2" />
        {chatWidget.messages.map((m, i) => {
          let onlybody = false;
          let noseparator = false;
          if (i > 0) {
            onlybody = chatWidget.messages[i - 1].sender.name === m.sender.name;
          }
          if (i < chatWidget.messages.length - 1) {
            noseparator =
              chatWidget.messages[i + 1].sender.name === m.sender.name;
          }
          return (
            <Fragment key={`message-${i}`}>
              <TextMessage message={m} onlybody={onlybody}></TextMessage>
              {!noseparator && <Separator spacing="sp+2" />}
            </Fragment>
          );
        })}
      </ChatContainer>
      <Separator palette="darkgrey" border="bo+1" />

      <BottomBar>
        <TextInput
          placeholder="type and enter"
          value={chatWidget.message}
          onChange={(event) => {
            chatWidget.setMessage(event.target.value);
          }}
          onSubmit={(val) => {
            // publish message
            chatWidget.sendMessage({
              type: "text",
              sender: {
                name: chatWidget.username,
                image: chatWidget.avatar,
              },
              text: val,
              createdAt: new Date(),
            });
          }}
          action={{
            icon: "donate",
            title: "donate",
            palette: "white",
            activepalette: "grey",
            onClick: (e) => {
              console.log("Donate!");
            },
          }}
        />
        <Separator spacing="sp+1" />
        <Row>
          <Text size="extrasmall"> jlksjda made with &nbsp; </Text>

          <Icon name="heart" scale="sc-1" />

          <Text size="extrasmall">&nbsp; by motelciler</Text>
        </Row>
      </BottomBar>
    </>
  );
};

export default Chat;
