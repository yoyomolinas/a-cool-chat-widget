import styled, { createGlobalStyle } from "styled-components";

export default createGlobalStyle`
    // default font face
    // @import url("https://fonts.googleapis.com/css2?family=Bodoni+Moda:wght@500;700&display=swap");
    // font-family: 'Bodoni Moda' serif;
    
    @import url("https://fonts.googleapis.com/css2?family=Quicksand:wght@500;700&display=swap");
    font-family: 'Quicksand' serif;

    // remove button outline
    button {
        outline: 0;
    }

    input {
        outline: none;
    }
  
`;
