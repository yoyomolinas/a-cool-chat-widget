import React, { useState, useRef, useEffect, Fragment } from "react";

import {
  Flash,
  FadeIn,
  BottomBar,
  ChatContainer,
  ChatContainerChild,
  TextMessage,
  Icon,
  Text,
  TextInput,
  Separator,
  Row,
} from "./styled";

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
  }, [chatWidget.messages]);

  return (
    <>
      <Separator palette="darkgrey" border="bo+1" />
      <ChatContainer ref={listRef}>
        <ChatContainerChild>
          <Separator spacing="sp+1" />
          {chatWidget.messages.map((m, i) => {
            let onlybody = false;
            let noseparator = false;
            if (i > 0) {
              onlybody =
                chatWidget.messages[i - 1].sender.name === m.sender.name;
            }
            if (i < chatWidget.messages.length - 1) {
              noseparator =
                chatWidget.messages[i + 1].sender.name === m.sender.name;
            }
            return (
              <Fragment key={`message-${i}`}>
                <FadeIn>
                  <TextMessage message={m} onlybody={onlybody}></TextMessage>
                  {!noseparator && <Separator spacing="sp+1" />}
                </FadeIn>
              </Fragment>
            );
          })}
        </ChatContainerChild>
      </ChatContainer>

      <Separator palette="darkgrey" border="bo+1" />

      <BottomBar>
        <TextInput
          placeholder="type and enter"
          value={chatWidget.message}
          onChange={(event) => {
            chatWidget.setMessage(event.target.value);
            // send typing signal if not in whoIsTypingList
            if (event.target.value === "") chatWidget.sendTypingSignal(false);
            else if (
              !chatWidget.whoIsTyping.current.includes(chatWidget.userId)
            )
              chatWidget.sendTypingSignal(true);
          }}
          onSubmit={(val) => {
            // publish message
            chatWidget.sendMessage({
              message: {
                type: "text",
                sender: {
                  id: chatWidget.userId,
                  name: chatWidget.username,
                  image: chatWidget.avatar,
                },
                text: val,
                createdAt: new Date(),
              },
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
          {chatWidget.personTyping && (
            <FadeIn>
              <Text
                font="regular"
                size="extrasmall"
                palette="grey"
                align="center"
              >
                <Flash>{chatWidget.personTyping} is typing...</Flash>
              </Text>
            </FadeIn>
          )}
          {!chatWidget.personTyping && (
            <FadeIn>
              <Text size="extrasmall"> made with &nbsp; </Text>
              <Icon name="heart" scale="sc-1" />
              <Text size="extrasmall">&nbsp; by motelciler</Text>
            </FadeIn>
          )}
        </Row>
        <Separator spacing="sp+1" />
      </BottomBar>
    </>
  );
};

export default Chat;
