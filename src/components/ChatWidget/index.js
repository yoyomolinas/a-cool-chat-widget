import React, {
  useRef,
  useEffect,
  useState,
  createContext,
  useContext,
} from "react";

import Cookie from "js-cookie";

import {
  Container,
  FadeIn,
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
  const { userId, channel = "test-123", iconcolor = "black" } = props;

  const [collapsed, setCollapsed] = useState(
    Cookie.get("collapsed") === "false" ? false : true
  );
  const [username, setUsername] = useState(Cookie.get("username") || ""); // TODO remave
  const [avatar, setAvatar] = useState(Cookie.get("avatar") || ""); // TODO remave
  const [screen, setScreen] = useState(
    username === "" || avatar === ""
      ? tokens.screens.welcome
      : tokens.screens.chat
  );

  const [personTyping, setPersonTyping] = useState(null);

  const whoIsTyping = useRef([]);
  const whoIsHere = useRef([]);

  // pubnub
  const pubnub = usePubNub();
  const [channels, setChannels] = useState([channel]);
  const [messages, addMessage] = useState([]);
  const [message, setMessage] = useState("");
  const [notification, setNotification] = useState(false);
  const [numOccupants, setNumOccupants] = useState(0);

  const handleMessage = (event) => {
    const msg = event.message;
    addMessage((messages) => [...messages, msg]);
    if (collapsed) setNotification(true);
  };
  const handleSignal = (event) => {
    // return if typing user is unknown
    if (!whoIsHere.current.map((o) => o.id).includes(event.publisher)) return;
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
          const typer = whoIsHere.current.find((e) => e.id === id);
          setPersonTyping(typer.username);
          break;
        }
      }
    }
  };
  const handlePresence = (event) => {
    // lets get to know the people here.
    pubnub
      .hereNow({
        channels: [channel],
        includeUUIDs: true,
        includeState: true,
      })
      .then((response) => {
        setNumOccupants(response.channels[channel].occupants.length);
        console.log(response.channels[channel].occupants.length);

        whoIsHere.current = response.channels[channel].occupants
          .map((o) => o.state)
          .filter((o) => o !== undefined);
      });
  };
  useEffect(() => {
    // fetch messages
    // start, end, count are optional

    pubnub.fetchMessages(
      {
        channels,
        end: 0,
        count: 10,
      },
      (status, response) => {
        if (!response) return;

        const storedMessages = response.channels[channel].map((e) => e.message);
        addMessage((messages) => [...storedMessages, ...messages]);
      }
    );

    pubnub.addListener({ message: handleMessage });
    pubnub.subscribe({ channels, withPresence: true });
    pubnub.addListener({ presence: handlePresence });
    handlePresence({}); // call once to initiate presence
    pubnub.addListener({ signal: handleSignal });
  }, [pubnub, channels]);

  const sendMessage = ({ message = {}, callback = () => {} }) => {
    if (message) {
      pubnub.publish({ channel: channels[0], message }).then(() => {
        sendTypingSignal(false);
        setMessage("");
        callback();
      });
    }
  };

  const sendTypingSignal = (isTyping = true) => {
    pubnub
      .signal({
        channel,
        message: isTyping ? "typing_on" : "typing_off",
      })
      .then((response) => {});
  };
  // pubnub

  const isUsernameValid = (name) => {
    const i = whoIsHere.current.findIndex((occupant) => {
      return occupant.name === name;
    });
    return name !== "" && (name === username || i === -1);
  };

  useEffect(() => {
    if (!collapsed) setNotification(false);
  }, [collapsed]);

  useEffect(() => {
    // things to do when settings change
    pubnub.setState({
      state: { username, id: userId, image: avatar, collapsed },
      channels: [channel],
    });

    // set cookie
    Cookie.set("username", username, { expires: 7 });
    Cookie.set("avatar", avatar, { expires: 7 });
    Cookie.set("collapsed", collapsed, { expires: 7 });
  }, [username, avatar, userId, collapsed]);

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

            <FadeIn>
              <Text size="small" weight="bold">
                {numOccupants > 1
                  ? `${numOccupants} people here!`
                  : numOccupants == 1
                  ? "only you here!"
                  : "welcome!"}
              </Text>
            </FadeIn>
            <Button
              title="preferences"
              palette="none"
              hoverpalette="darkgrey"
              activepalette="grey"
              clear={screen === tokens.screens.welcome}
              onClick={
                screen !== tokens.screens.welcome
                  ? (e) => {
                      let nextScreen = tokens.screens.settings;
                      if (screen === tokens.screens.settings)
                        nextScreen = tokens.screens.chat;
                      setScreen(nextScreen);
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
            {!notification && (
              <Icon name={"chat"} scale="sc+2" palette={iconcolor} />
            )}
            {notification && (
              <Icon name={"chat-notified"} scale="sc+2" palette={iconcolor} />
            )}
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
