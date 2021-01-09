import React, {
  useRef,
  useEffect,
  useState,
  createContext,
  useContext,
} from "react";
import {
  Container,
  CollapsedChatContainer,
  TopBar,
  Button,
  Icon,
  Text,
} from "./styled";
import Settings from "./Settings";
import Chat from "./Chat";
import Welcome from "./Welcome";
import { usePubNub } from "pubnub-react";
import tokens from "./tokens";

const Context = createContext();

export const ChatWidget = (props) => {
  const {
    channel = "awesome-channel",
    icon = "chat",
    iconcolor = "black",
  } = props;
  const [collapsed, setCollapsed] = useState(true);
  const [screen, setScreen] = useState(tokens.screens.welcome);
  const [username, setUsername] = useState("");
  const [avatar, setAvatar] = useState("");

  // pubnub
  const pubnub = usePubNub();
  const [channels, setChannels] = useState([channel]);
  const [messages, addMessage] = useState([]);
  const [message, setMessage] = useState("");
  const handleMessage = (event) => {
    const msg = event.message;
    addMessage((messages) => [...messages, msg]);
  };
  useEffect(() => {
    pubnub.addListener({ message: handleMessage });
    pubnub.subscribe({ channels });
  }, [pubnub, channels]);

  const sendMessage = (msg) => {
    if (msg) {
      pubnub.publish({ channel: channels[0], message: msg }).then(() => {
        setMessage("");
        scrollToEnd();
      });
    }
  };
  // pubnub

  const isUsernameValid = (name) => {
    const i = messages.findIndex((m) => {
      return m.sender.name === name;
    });

    return name !== "" && (name == username || i === -1);
  };

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
    <Context.Provider
      value={{
        username,
        setUsername,
        avatar,
        setAvatar,
        screen,
        setScreen,
        collapsed,
        setCollapsed,
        message,
        setMessage,
        messages,
        sendMessage,
        isUsernameValid,
      }}
    >
      {!collapsed && (
        <Container palette="dark">
          <TopBar>
            <Button
              title="get the hell outta here!"
              palette="none"
              hoverpalette="darkgrey"
              activepalette="grey"
              onClick={(e) => {
                setCollapsed(true);
              }}
            >
              <Icon name="runner" palette="white" />
            </Button>
            <Text size="small" weight="bold">
              welcome!
            </Text>
            <Button
              title="preferences"
              palette="none"
              hoverpalette="darkgrey"
              activepalette="grey"
              clear={screen === tokens.screens.welcome}
              onClick={
                screen !== tokens.screens.welcome
                  ? (e) => {
                      setScreen(tokens.screens.settings);
                    }
                  : null
              }
            >
              {screen !== tokens.screens.welcome && (
                <Icon name="gear" palette="white" />
              )}
            </Button>
          </TopBar>

          {screen === tokens.screens.chat && (
            <Chat
              username={username}
              avatar={avatar}
              setScreen={setScreen}
              setCollapsed={setCollapsed}
            />
          )}
          {screen === tokens.screens.welcome && (
            <Welcome
              setUsername={setUsername}
              setAvatar={setAvatar}
              setScreen={setScreen}
              setCollapsed={setCollapsed}
            />
          )}
          {screen === tokens.screens.settings && (
            <Settings
              username={username}
              avatar={avatar}
              setUsername={setUsername}
              setAvatar={setAvatar}
              setScreen={setScreen}
              setCollapsed={setCollapsed}
            />
          )}
        </Container>
      )}
      {collapsed && (
        <CollapsedChatContainer>
          <Button
            clear
            onClick={(e) => {
              setCollapsed(false);
            }}
          >
            <Icon name={icon} scale="sc+2" palette={iconcolor} />
          </Button>
        </CollapsedChatContainer>
      )}
    </Context.Provider>
  );
};

export const useChatWidget = () => {
  return useContext(Context);
};

export default ChatWidget;
