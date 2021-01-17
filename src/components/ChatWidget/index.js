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
    userId,
    channel = "test-123",
    icon = "chat",
    iconcolor = "black",
  } = props;
  const [collapsed, setCollapsed] = useState(true);
  const [screen, setScreen] = useState(tokens.screens.welcome);
  const [username, setUsername] = useState("");
  const [avatar, setAvatar] = useState("");
  const [personTyping, setPersonTyping] = useState(null);
  const whoIsTyping = useRef([]);

  // pubnub
  const pubnub = usePubNub();
  const [channels, setChannels] = useState([channel]);
  const [messages, addMessage] = useState([]);
  const [message, setMessage] = useState("");
  const senders = useRef({}); // id->name

  const addSender = (sender) => {
    senders.current = { ...senders.current, [sender.id]: sender };
  };
  const handleMessage = (event) => {
    const msg = event.message;
    addMessage((messages) => [...messages, msg]);

    // add to senders
    addSender(msg.sender);
  };
  const handleSignal = (event) => {
    // return if typing user is unknown
    // console.log(`SIGNAL recieved! Current senders:`);
    // console.log(senders.current);
    if (!Object.keys(senders.current).includes(event.publisher)) return;
    const isTyping =
      event.message === "typing_on"
        ? true
        : event.message === "typing_off"
        ? false
        : null;

    const senderId = event.publisher;
    // console.log(`is typing ${isTyping} ${senderId}`);
    if (!isTyping) {
      // console.log("NOT TYPING SIGNAL RECIEVED");
      const i = whoIsTyping.current.indexOf(senderId);
      if (i > -1) {
        whoIsTyping.current.splice(i, 1);
      }
    } else if (isTyping) {
      const i = whoIsTyping.current.indexOf(senderId);
      if (i === -1) whoIsTyping.current = [...whoIsTyping.current, senderId];
    }

    // Set person typing
    if (whoIsTyping.current.length === 0) setPersonTyping(null);
    else {
      for (const id of whoIsTyping.current) {
        if (userId !== id) {
          setPersonTyping(senders.current[id].name);
          break;
        }
      }
    }
  };
  useEffect(() => {
    // fetch messages
    // start, end, count are optional

    pubnub.fetchMessages(
      {
        channels,
        end: 0,
        count: 100,
      },
      (status, response) => {
        if (!response) return;

        const storedMessages = response.channels[channel].map((e) => e.message);
        addMessage((messages) => [...storedMessages, ...messages]);
        // add senders
        for (const msg of storedMessages) {
          addSender(msg.sender);
        }
      }
    );

    pubnub.addListener({ message: handleMessage });
    pubnub.addListener({ signal: handleSignal });
    pubnub.subscribe({ channels });
  }, [pubnub, channels]);

  const sendMessage = (msg) => {
    if (msg) {
      pubnub.publish({ channel: channels[0], message: msg }).then(() => {
        sendTypingSignal(false);
        setMessage("");
        scrollToEnd();
      });
    }
  };

  const sendTypingSignal = (isTyping = true) => {
    pubnub.signal(
      {
        channel,
        message: isTyping ? "typing_on" : "typing_off",
      },
      (status, response) => {
        // handle status, response
      }
    );
  };
  // pubnub

  const isUsernameValid = (name) => {
    const i = messages.findIndex((m) => {
      return m.sender.name === name;
    });

    return name !== "" && (name === username || i === -1);
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
        userId,
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
        whoIsTyping,
        personTyping,
        sendTypingSignal,
        addSender,
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

          {screen === tokens.screens.chat && <Chat />}
          {screen === tokens.screens.welcome && <Welcome />}
          {screen === tokens.screens.settings && <Settings />}
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
