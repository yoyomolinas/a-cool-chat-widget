import React, { useEffect, useState } from "react";
import {
  TopBar,
  WelcomeContainer,
  TextInput,
  GridSelectImage,
  Button,
  Icon,
  Text,
  Separator,
} from "./styled";
import tokens from "./tokens";

import { useChatWidget } from "./index";

const Settings = (props) => {
  const chatWidget = useChatWidget();
  const [username, setUsername] = useState(chatWidget.username);
  const [avatar, setAvatar] = useState(chatWidget.avatar);

  const [inputsValid, setInputsValid] = useState({
    username: chatWidget.isUsernameValid(username),
    avatar: true,
  });

  useEffect(() => {
    // Change this part by checking if current
    // username is valid
    if (chatWidget.isUsernameValid(username)) {
      setInputsValid((d) => {
        return { ...d, username: true };
      });
    } else {
      setInputsValid((d) => {
        return { ...d, username: false };
      });
    }
  }, [username]);

  return (
    <>
      <WelcomeContainer>
        <Text size="small" weight="bold">
          update a username and avatar.
        </Text>
        <Separator spacing="sp+1" />
        <TextInput
          placeholder="your username"
          value={username}
          onChange={(event) => {
            setUsername(event.target.value);
          }}
          onSubmit={(val) => {}}
          action={
            inputsValid.username
              ? {
                  icon: "check-circle",
                  palette: "green",
                }
              : {
                  icon: "circle",
                  palette: "white",
                }
          }
        />
        <Separator spacing="sp+1" />
        <GridSelectImage
          images={[
            "profiles/profiles-1.png",
            "profiles/profiles-2.png",
            "profiles/profiles-3.png",
            "profiles/profiles-4.png",
            "profiles/profiles-1.png",
            "profiles/profiles-2.png",
            "profiles/profiles-3.png",
            "profiles/profiles-4.png",
          ]}
          action={
            inputsValid.avatar
              ? {
                  icon: "check-circle",
                  palette: "green",
                }
              : {
                  icon: "circle",
                  palette: "white",
                }
          }
          value={avatar}
          onSelect={(url) => {
            setAvatar(url);
            setInputsValid((d) => {
              return { ...d, avatar: true };
            });
          }}
        />
        <Separator spacing="sp+1" />

        <Button
          style={{ width: "100%" }}
          padding="sp+2"
          palette={
            inputsValid.username && inputsValid.avatar ? "purple" : "grey"
          }
          hoverpalette={
            inputsValid.username && inputsValid.avatar ? "darkpurple" : "grey"
          }
          activepalette={
            inputsValid.username && inputsValid.avatar ? "darkerpurple" : "grey"
          }
          onClick={
            inputsValid.username && inputsValid.avatar
              ? (e) => {
                  chatWidget.setAvatar(avatar);
                  chatWidget.setUsername(username);
                  chatWidget.setScreen(tokens.screens.chat);
                }
              : null
          }
        >
          <Text size="small" weight="bold">
            save and return
          </Text>
        </Button>
      </WelcomeContainer>
    </>
  );
};

export default Settings;
