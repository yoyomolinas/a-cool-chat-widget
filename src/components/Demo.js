import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-flow: column wrap;
  align-items: center;
  // border: 2px solid red; // debug
`;

const Title = styled.h1`
  // bold text with inter font
  font-family: Inter;
  font-weight: 600;
`;
const Text = styled.p`
  // bold text with inter font
  font-family: Inter;
  font-weight: 400;
`;

const Separator = styled.div`
  width: 100%;
  padding: 10px;
  box-sizing: border-box;
  // border: 2px solid red; // debug
`;

export default () => {
  return (
    <Container>
      <Title>Example Website</Title>
      <Text>Hello world. This my example chat widget app.</Text>
      <Separator />
      <Separator />
      <img src="https://lh3.googleusercontent.com/proxy/D4HxYx7UDOzSogrTPB1DWvHtUfQYqD8ZbStMwWcY4a94hDxzc8_Fkmj7BqQRi61J_hjE8zNMoyODa4XCf6s8BmXCwyo1aob7uW-0qZ2xrn5l1kre" />
      <img src="https://lh3.googleusercontent.com/proxy/D4HxYx7UDOzSogrTPB1DWvHtUfQYqD8ZbStMwWcY4a94hDxzc8_Fkmj7BqQRi61J_hjE8zNMoyODa4XCf6s8BmXCwyo1aob7uW-0qZ2xrn5l1kre" />
      <img src="https://lh3.googleusercontent.com/proxy/D4HxYx7UDOzSogrTPB1DWvHtUfQYqD8ZbStMwWcY4a94hDxzc8_Fkmj7BqQRi61J_hjE8zNMoyODa4XCf6s8BmXCwyo1aob7uW-0qZ2xrn5l1kre" />
      <img src="https://lh3.googleusercontent.com/proxy/D4HxYx7UDOzSogrTPB1DWvHtUfQYqD8ZbStMwWcY4a94hDxzc8_Fkmj7BqQRi61J_hjE8zNMoyODa4XCf6s8BmXCwyo1aob7uW-0qZ2xrn5l1kre" />
    </Container>
  );
};
