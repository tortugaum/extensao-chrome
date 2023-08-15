import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import './content.css';
import {
  Container,
  Messages,
  Contacts,
  MessageBox,
  ContactBox,
  ContactInfo,
  Fields,
  FooterButtons,
} from './styles';
import ApiService from './services/apiService';

function Main() {
  const [messages, setMessages] = useState([]);
  const [contacts, setContacts] = useState();
  const [selectedContact, setSelectedContact] = useState();
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const [isSelecting, setIsSelecting] = useState(false);

  const getMessages = () => {
    const msg = [
      {
        message: 'Olá, no momento estou indisponível, deixe seu recado!',
      },
      {
        message: 'Seja bem vindo, essa é a extensão da inovação, o que deseja?',
      },
      {
        message:
          'A equipe da inovação é composta por desenvolvedores feras, eles são os responsáveis pelo portal aster.gruposps.com.br',
      },
    ];

    setMessages(msg);
  };

  const getContacts = () => {
    setTimeout(() => {
      const contactDivs = document.querySelectorAll('[role="listitem"]');

      const contactContainers = [];
      const contactObjects = [];

      contactDivs.forEach((contact) => {
        contactContainers.push(
          contact.querySelector('[data-testid="cell-frame-container"]') ||
            contact.querySelector('[data-testid="message-yourself-row"]')
        );
      });

      contactContainers.forEach((contact) => {
        if (!contact) return;
        const image = contact
          .querySelector('._1AHcd')
          .getElementsByTagName('img')[0]?.src;

        const name = contact
          .querySelector('._8nE1Y')
          .querySelector('[data-testid="cell-frame-title"]')
          .getElementsByTagName('span')[0]?.title;

        contactObjects.push({
          image,
          name,
          contact,
        });
      });

      setContacts(contactObjects);
    }, 5000);
  };

  const sendMessage = (message) => {
    const mainEl = document.querySelector('#main');
    if (!mainEl) {
      alert('Não há conversa aberta');
      return;
    }
    const textareaEl = mainEl.querySelector('div[contenteditable="true"]');

    if (!textareaEl) {
      alert('Não há conversa aberta');
      return;
    }

    textareaEl.focus();
    document.execCommand('insertText', false, message);
    textareaEl.dispatchEvent(new Event('change', { bubbles: true }));

    setTimeout(() => {
      (
        mainEl.querySelector('[data-testid="send"]') ||
        mainEl.querySelector('[data-icon="send"]')
      ).click();
    }, 100);
  };

  const validateOpenConversation = () => {
    const mainEl = document.querySelector('#main');
    if (!mainEl) {
      return false;
    }
    const textareaEl = mainEl.querySelector('div[contenteditable="true"]');

    if (!textareaEl) {
      return false;
    }

    return true;
  };
  const searchForNumber = () => {
    if (!validateOpenConversation()) {
      alert('Não há conversa aberta');
      return;
    }

    const chatArea = document.querySelector(
      '[data-testid="conversation-panel-body"]'
    );

    const elements = Array.from(
      chatArea.querySelectorAll(`[data-id*="true_"]`)
    );

    elements.find((element) => {
      const attributeValue = element.getAttribute('data-id');

      const regex = /true_(\d+)@/;
      const match = attributeValue.match(regex);

      if (match) {
        // match[0] é o valor completo (por exemplo, 'true_551298874708@abcde')
        // match[1] é o valor numérico entre 'true_' e '@' (por exemplo, '551298874708')
        const numericValue = match[1];

        if (selectedContact)
          setSelectedContact({ ...selectedContact, phoneNumber: numericValue });
        return true;
      }
    });
  };

  const closeCheckboxes = () => {
    document.querySelectorAll('#check-msg').forEach((e) => {
      e.remove();
    });
  };

  const createCheckboxes = () => {
    const msgNodeList = document.querySelectorAll(
      '[data-testid="msg-container"]'
    );

    if (!msgNodeList) return;

    msgNodeList.forEach((node) => {
      const cbContainer = document.createElement('div');
      ReactDOM.render(
        <input type='checkbox' id='check-msg' name='check-msg' />,
        cbContainer
      );
      node.prepend(cbContainer);
    });
  };

  const handleCheckbox = () => {
    if (!validateOpenConversation()) {
      alert('Não há conversa aberta');
      return;
    }
    console.log(isSelecting);
    if (isSelecting) {
      closeCheckboxes();
      setIsSelecting(!isSelecting);
    }

    createCheckboxes();

    setIsSelecting(true);
  };

  const getCheckedBoxes = (cbName) => {
    var checkboxes = document.getElementsByName(cbName);
    var checkboxesChecked = [];

    for (var i = 0; i < checkboxes.length; i++) {
      if (checkboxes[i].checked) {
        checkboxesChecked.push(checkboxes[i]);
      }
    }

    return checkboxesChecked.length > 0 ? checkboxesChecked : null;
  };

  const treatSelectedMessages = () => {};

  const sendSelectedMessages = async () => {
    const selectedMessages = getCheckedBoxes('check-msg');

    const selectedMessagesText = [];

    selectedMessages.forEach((msg) => {
      if (!msg.parentElement.parentElement) return;

      if (!msg.parentElement.parentElement.innerText) return;

      const msgParent = msg.parentElement.parentElement;

      selectedMessagesText.push({
        message: msg.parentElement.parentElement.innerText,
        contact: msgParent.querySelector('._1BOF7._2AOIt').querySelector('span')
          .ariaLabel,
      });
    });

    console.log(selectedMessagesText);
    ApiService.sendMessages(selectedMessagesText);
  };

  const setConversationsOnClick = () => {
    const conversations = document.querySelectorAll('[role="listitem"]');

    conversations.forEach((conversation) => {
      conversation.addEventListener('click', (e) => {
        setIsSelecting(false);
      });
    });
  };

  useEffect(() => {
    setTimeout(() => {
      getMessages();
      getContacts();
      setIsPageLoaded(!isPageLoaded);
      setConversationsOnClick();
    }, 1000);
  }, []);

  return (
    !!isPageLoaded && (
      <div className={'my-extension'}>
        <h1>Extensão Innovation</h1>

        <Container>
          <Messages>
            {messages.map((msg) => {
              if (!msg) return;
              return (
                <MessageBox
                  onClick={() => {
                    sendMessage(msg.message);
                  }}
                >
                  {msg.message}
                </MessageBox>
              );
            })}
          </Messages>
          {!!contacts && (
            <Contacts>
              {contacts.map((contact) => {
                if (!contact) return;

                return (
                  <ContactBox
                    onClick={() => {
                      setSelectedContact(contact);
                      setTimeout(() => {
                        searchForNumber();
                      }, 500);
                    }}
                  >
                    <img src={contact.image} />
                    <h3>{contact.name}</h3>
                  </ContactBox>
                );
              })}
            </Contacts>
          )}
          {!!selectedContact && (
            <ContactInfo>
              <ContactBox>
                <img src={selectedContact.image} />
                <h3>{selectedContact.name}</h3>
              </ContactBox>
              <Fields>
                <label>Telefone: </label>
                <input type='text' value={selectedContact.phoneNumber}></input>
                <label>Nome Completo: </label>
                <input type='text' value={selectedContact.name}></input>
                <label>Idade: </label>
                <input type='number'></input>
                <button onClick={searchForNumber}>Preencher Número</button>
              </Fields>
            </ContactInfo>
          )}
          <FooterButtons>
            <button type='button' onClick={handleCheckbox}>
              {isSelecting ? 'Cancelar Selação' : 'Selecionar Mensagens'}
            </button>
            <button
              type='button'
              onClick={sendSelectedMessages}
              disabled={!isSelecting}
            >
              Enviar Mensagens
            </button>
          </FooterButtons>
        </Container>
      </div>
    )
  );
}

const app = document.createElement('div');
app.id = 'my-extension-root';
const interval = setInterval(async () => {
  const wpp = document.querySelector('#app');
  if (!wpp) return;

  const mainDiv = wpp.children[0];

  if (!mainDiv) return;

  if (mainDiv) {
    setTimeout(() => {
      clearInterval(interval);
      mainDiv.style.display = 'flex';
      mainDiv.appendChild(app);
      ReactDOM.render(<Main />, app);
    }, 1000);
  }
}, 5000);
