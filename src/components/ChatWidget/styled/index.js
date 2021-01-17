import React, { useRef, useState, useEffect } from "react";
import styled, { css, keyframes } from "styled-components";
import tokens from "../tokens";
import icons from "../../../icons";
import day from "../../../utils/day";

const fadeIn = keyframes`
  from {
    transform: scale(.85);
    opacity: 0;
  }

  to: {
    transform: scale(1);
    opacity: 1;
  }
`;

const flash = keyframes`
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1);
    opacity: 0.7;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }

  
`;

export const FadeIn = styled.div`
  // opacity: 0;
  animation: ${fadeIn} 0.2s linear;
`;

export const Flash = styled.div`
  // opacity: 0;
  animation: ${flash} 1s linear infinite;
`;

export const CollapsedChatContainer = styled.div`
  z-index: 99999;
  position: fixed;
  bottom: ${tokens.padding["sp+3"]};
  right: ${tokens.padding["sp+3"]};
`;

export const Container = styled.div`
  z-index: 99999;
  // desktop
  @media only screen and (min-width: 600px) {
    position: fixed;
    // size
    width: 400px;
    height: calc(100vh - 32px);

    // margins
    top: ${tokens.padding["sp+2"]};
    bottom: ${tokens.padding["sp+2"]};
    right: ${tokens.padding["sp+2"]};

    border-radius: ${tokens.radius["ra+1"]};
  }
  // mobile
  @media only screen and (max-width: 600px) {
    position: absolute;
    width: calc(100vw - 4px);
    // height: calc(${window.innerHeight}px - 4px);
    height: calc(100% - 4px);
    top: 0px;
    left: 0px;
    margin: 2px;
    border-radius: ${tokens.radius["ra+1"]};
  }

  // display
  display: flex;
  flex-direction: column;
  align-items: center;

  // color
  background: ${(props) => tokens.palette[props.palette]};
  box-shadow: 0px 0px 12px 6px rgba(0, 0, 0, 0.4);
`;

Container.defaultProps = { palette: "dark" };

export const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
`;

export const Separator = styled.div`
  width: 100%;
  box-sizing: border-box;
  padding: ${(props) => tokens.padding[props.spacing]};
  border-bottom: ${(props) => tokens.border[props.border]} solid
    ${(props) => tokens.palette[props.palette]};
  border-radius: ${tokens.radius["ra+4"]};
`;
Separator.defaultProps = { spacing: "sp+0", border: "bo+0", palette: "white" };

export const TopBar = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-left: ${tokens.padding["sp+3"]};
  padding-right: ${tokens.padding["sp+3"]};
  padding-top: ${tokens.padding["sp+2"]};
  padding-bottom: ${tokens.padding["sp+2"]};

  position: static;
  box-sizing: border-box;
  width: 100%;
  left: 0px;
  top: 0px;
`;

export const BottomBar = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${tokens.padding["sp+2"]};

  position: static;
  box-sizing: border-box;
  width: 100%;
  left: 0px;
  bottom: 0px;
`;

export const Button = styled.button`
  display: block;
  // background color
  background: ${(props) =>
    !props.clear ? tokens.palette[props.palette] : tokens.palette["none"]};

  // border
  border: ${(props) => tokens.border[props.border]} solid
    ${(props) => tokens.palette[props.palette]};

  // radius
  border-radius: ${(props) => tokens.radius[props.radius]};

  // spacing
  padding: ${(props) => tokens.padding[props.padding]};
  margin: ${(props) => tokens.margin[props.margin]};

  // animation
  transition: all 0.2s;

  // hover
  &:hover {
    background: ${(props) =>
      !props.clear
        ? tokens.palette[props.hoverpalette]
        : tokens.palette["none"]};
    border: ${(props) => tokens.border[props.border]} solid
      ${(props) =>
        !props.clear
          ? tokens.palette[props.hoverpalette]
          : tokens.palette["none"]};

    & > svg > * {
      ${(props) =>
        props.clear
          ? css`
              fill: ${(props) => tokens.palette[props.hoverpalette]};
            `
          : ""}
    }
  }
  &:active {
    background: ${(props) =>
      !props.clear
        ? tokens.palette[props.activepalette]
        : tokens.palette["none"]};
    border: ${(props) => tokens.border[props.border]} solid
      ${(props) =>
        !props.clear
          ? tokens.palette[props.activepalette]
          : tokens.palette["none"]};

    & > svg > * {
      ${(props) =>
        props.clear
          ? css`
              fill: ${(props) => tokens.palette[props.activepalette]};
            `
          : ""}
    }
  }

  // cursor

  cursor: ${(props) => (!props.onClick ? "default" : "pointer")};
`;

Button.defaultProps = {
  palette: "none",
  hoverpalette: "grey",
  activepalette: "lightgrey",
  radius: "ra+1",
  padding: "sp+1",
  margin: "sp+0",
  border: "bo+0",
};

export const Icon = (props) => {
  const { name } = props;
  if (!(name in icons)) {
    throw "Specified icon not in icons.";
  }

  let palette = props.palette;
  if (!palette) palette = "lightgrey";

  let scale = props.scale;
  if (!scale) scale = "sc+0";
  const Svg = icons[name];
  return (
    <Svg
      style={{
        width: tokens.iconscale[props.scale],
        height: tokens.iconscale[props.scale],
        fill: tokens.palette[props.palette],
      }}
    />
  );
};

export const Text = styled.text`
  font-family: ${(props) => tokens.font[props.font]};
  font-style: normal;
  font-weight: ${(props) => tokens.fontweight[props.weight]};
  font-size: ${(props) => tokens.fontsize[props.size]};
  line-height: ${(props) => tokens.fontlineheight[props.size]};
  color: ${(props) => tokens.palette[props.palette]};
  text-align: ${(props) => props.align};
`;

Text.defaultProps = {
  font: "regular",
  size: "small",
  weight: "regular",
  palette: "white",
  align: "left",
};

export const StyledTextInput = styled.input`
  width: 100%;
  background: ${(props) => tokens.palette.darkgrey};
  border-radius: ${tokens.radius["ra+1"]};
  border: 0px;
  padding: ${tokens.padding["sp+2"]};
  box-sizing: border-box;

  // placeholder
  ::-webkit-input-placeholder {
    font-style: normal;
    font-family: ${(props) => tokens.font[props.font]};
    font-weight: ${(props) => tokens.fontweight[props.weight]};
    font-size: ${(props) => tokens.fontsize[props.size]};
    line-height: ${(props) => tokens.fontlineheight[props.size]};
    color: ${tokens.palette.grey};
  }

  &:focus {
    box-shadow: 0 0 0 2px ${tokens.palette.grey} inset;
  }

  transition: box-shadow 0.2s;

  // text input
  font-style: normal;
  font-family: ${(props) => tokens.font[props.font]};
  font-weight: ${(props) => tokens.fontweight[props.weight]};
  font-size: ${(props) => tokens.fontsize[props.size]};
  line-height: ${(props) => tokens.fontlineheight[props.size]};
  color: ${tokens.palette.white};
`;

StyledTextInput.defaultProps = {
  font: "regular",
  size: "small",
  weight: "regular",
};
const InputContainer = styled.div`
  position: relative;
  width: 100%;
`;
const InputAction = styled(Button)`
  position: absolute;
  // z-index: 99999999;
  right: 0px;
  bottom: 4px;
  opacity: ${(props) => (props.visible ? 1 : 0)};
`;

InputAction.defaultProps = { visible: false };

export const TextInput = (props) => {
  const { onSubmit = (value) => {}, action } = props;

  return (
    <InputContainer>
      <StyledTextInput
        {...props}
        onKeyUp={(event) => {
          if (event.key === "Enter" && event.target.value !== "") {
            onSubmit(event.target.value);
          }
        }}
      />
      {action && (
        <InputAction
          clear
          title={action.title}
          hoverpalette={action.palette}
          activepalette={action.onClick ? action.activepalette : action.palette}
          visible={props.value.length < 30}
          onClick={action.onClick}
        >
          <Icon name={action.icon} palette={action.palette} />
        </InputAction>
      )}
    </InputContainer>
  );
};
export const WelcomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  padding-left: ${tokens.padding["sp+3"]};
  padding-right: ${tokens.padding["sp+3"]};
`;

const GridSelectContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
  width: 100%;

  background: ${(props) => tokens.palette[props.palette]};
  border-radius: ${tokens.radius["ra+1"]};
`;

GridSelectContainer.defaultProps = { palette: "darkgrey" };

const ImageGrid = styled.div`
  display: flex;
  flex-flow: row wrap;
  align-items: flex-start;
  width: 100%;
  margin: ${tokens.margin["sp+1"]};
`;

const ImageInGrid = styled.img`
  width: 48px;
  height: auto;

  &:hover {
    opacity: 0.7;
  }

  // border: ${(props) => tokens.border[props.border]} solid
  //   ${(props) => tokens.palette[props.palette]};
  border-radius: ${tokens.radius["ra+1"]};

  cursor: pointer;

  transition: all 0.2s;
`;

const ImageInGridContainer = styled.div`
  display: flex;
  flex-flow: column;
  align-items: center;

  margin: ${tokens.margin["sp+1"]};
  box-shadow: 0 0 0 ${(props) => tokens.border[props.border]}
    ${(props) => tokens.palette[props.palette]};
  border-radius: ${tokens.radius["ra+1"]};

  transition: all 0.2s;
`;

ImageInGridContainer.defaultProps = {
  palette: "green",
  border: "bo+0",
};
export const GridSelectImage = (props) => {
  const { onSelect, action, images = [], value = "" } = props;
  const [selected, setSelected] = useState(
    images.findIndex((e) => e === value)
  );

  return (
    <GridSelectContainer>
      <ImageGrid>
        {images.map((image, i) => (
          <ImageInGridContainer
            key={`grod-image-select-${i}`}
            palette="green"
            border={selected === i ? "bo+2" : "bo+0"}
          >
            <ImageInGrid
              src={image}
              onClick={(e) => {
                setSelected(i);
                onSelect(image);
              }}
            />
          </ImageInGridContainer>
        ))}
      </ImageGrid>
      {action && (
        <Button
          clear
          hoverpalette={action.palette}
          activepalette={action.onClick ? action.activepalette : action.palette}
          onClick={action.onClick}
        >
          <Icon name={action.icon} palette={action.palette} />
        </Button>
      )}
    </GridSelectContainer>
  );
};

export const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: flex-start;
  align-items: center;
  box-sizing: border-box;
  padding-left: ${tokens.padding["sp+3"]};
  padding-right: ${tokens.padding["sp+3"]};

  position: static;
  width: 100%;
  height: 100%;

  overflow-y: scroll;

  // border: 2px solid red;
`;

export const ChatContainerChild = styled.div`
  width: 100%;
`;

const MessageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  position: static;
  width: 100%;

  // border: 2px solid red;
`;
const MessageSenderContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const MessageSenderName = styled(Text)`
  margin-left: ${tokens.padding["sp+2"]};
`;

MessageSenderName.defaultProps = {
  font: "regular",
  size: "small",
  weight: "bold",
  palette: "white",
};

const MessageSenderImage = styled.img`
  width: 32px;
  height: auto;
  border-radius: ${tokens.radius["ra+1"]};
`;

const MessageBodyContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  justify-content: space-between;

  width: 100%;
`;

const MessageText = styled(Text)`
  width: 100%;
  word-break: break-word;
`;

MessageText.defaultProps = {
  font: "regular",
  size: "small",
  weight: "regular",
  palette: "white",
};

const MessageTime = styled(Text)`
  opacity: 50%;
`;

MessageTime.defaultProps = {
  font: "regular",
  size: "extrasmall",
  weight: "bold",
  palette: "white",
};

const MessageImage = styled.div``;

const getDateTime = (date) => {
  const today = new Date();
  let format;

  // If date is today only display hour and minute
  if (day.format(today, "DD MM YYYY") == day.format(date, "DD MM YYYY")) {
    format = "HH:mm";
  } else if (day.year(today) == day.year(date)) {
    format = "DD MMM HH:mm";
  } else {
    format = "DD MMM YYYY HH:mm";
  }

  return day.format(date, format);
};

export const TextMessage = (props) => {
  const { message, onlybody = false } = props;
  const { sender, text, createdAt } = message;
  const time = getDateTime(createdAt);
  return (
    <MessageContainer>
      {!onlybody && (
        <MessageSenderContainer>
          <MessageSenderImage src={sender.image} />
          <MessageSenderName>{sender.name}</MessageSenderName>
        </MessageSenderContainer>
      )}
      <Separator spacing="sp+0.5" />
      <MessageBodyContainer>
        <MessageText>{text}</MessageText>
        <MessageTime>{time}</MessageTime>
      </MessageBodyContainer>
    </MessageContainer>
  );
};

export const ImageMessage = (props) => {
  const { sender, text, image, onlybody } = props;
};
