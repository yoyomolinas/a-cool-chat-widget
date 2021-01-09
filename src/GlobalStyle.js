import styled, { createGlobalStyle } from "styled-components";

export default createGlobalStyle`
    // default font face
    @font-face {
        font-family: "Quicksand";
        src: url("https://fonts.googleapis.com/css2?family=Quicksand:wght@500;700&display=swap");
    }

    // remove button outline
    button {
        outline: 0;
    }

    input {
        outline: none;
    }
  
`;
