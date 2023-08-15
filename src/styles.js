import styled from 'styled-components';

export const Container = styled.div`
  margin-top: 1em;
  height: 90vh;
  overflow: scroll;
  padding: 0.9em;
`;

export const Messages = styled.div`
  padding: 0.5em;
  border: 1px solid #8f8f8f;
`;

export const Contacts = styled.div`
  margin-top: 1em;
  padding: 0.5em;
  height: 45vh;
  overflow: auto;
  border: 1px solid #8f8f8f;
`;

export const MessageBox = styled.div`
  background-color: #1089ff;
  padding: 0.5em;
  border: 1px solid #042342;
  margin: 1em 0;
  border-radius: 5px;

  &:hover {
    background-color: #57a5f3;
  }
`;

export const ContactBox = styled.div`
  display: flex;
  justify-content: start;
  align-items: center;
  border: 1px solid #8f8f8f;
  margin: 0.5em;
  border-radius: 5px;

  img {
    height: 96px;
    width: 96px;
    margin-right: 1em;
  }

  &:hover {
    border: 1px solid #696868;
    background-color: #e6e6e6;
  }
`;

export const ContactInfo = styled.div`
  margin-top: 1em;
  border: 1px solid #8f8f8f;
  padding: 0.5em;
`;

export const Fields = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  row-gap: 1em;
`;

export const FooterButtons = styled.div`
  margin-top: 1em;
  display: flex;
  flex-direction: row;
  padding: 1em;

  button {
    border: 1px solid rgb(143, 143, 143);
    margin: 0.2em;
    border-radius: 20px;
    padding: 0.5em;
  }

  button:hover {
    background-color: #e0e0e0;
  }
`;
