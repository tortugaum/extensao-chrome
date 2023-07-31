const interval = setInterval(() => {
  const app = document.querySelector('#app');
  const mainDiv = app.children[0];
  const mainContent = mainDiv.querySelector('.two._1jJ70');

  if (mainContent && mainDiv) {
    clearInterval(interval);
    placeSideDiv(mainDiv);
    const contacts = listContacts();
    console.log(contacts);

    fetch(chrome.runtime.getURL('/index.html'))
      .then((response) => response.text())
      .then((data) => {
        document.getElementById('inno').innerHTML = data;
        let mensagens = [...document.querySelectorAll('.mensagem-rapida')];
        mensagens = mensagens.map((msg) => {
          msg.onclick = function () {
            sendMessage(msg.textContent);
          };
        });

        contacts.forEach((contact) => {
          const contactDiv = document.createElement('div');
          contactDiv.classList.add('contato-container');
          const contactImg = document.createElement('img');
          contactImg.src =
            contact.image ||
            'https://cdn-icons-png.flaticon.com/512/2815/2815428.png';
          const contactName = document.createElement('span');
          contactName.innerText = contact.name;

          contactDiv.appendChild(contactImg);
          contactDiv.appendChild(contactName);
          const listaContatos = document.querySelector('.lista-contatos');
          listaContatos.appendChild(contactDiv);
        });
      })
      .catch((err) => {
        console.log('Ops, ocorreu um erro ', err);
      });
  }
}, 1000);

const placeSideDiv = (div) => {
  div.style.display = 'flex';

  const sideDiv = document.createElement('div');

  // sideDiv.innerHTML = '<h1>Innovation</h1><b>Teste de extensão</b>';
  sideDiv.setAttribute('id', 'inno');

  div.appendChild(sideDiv);
};

const listContacts = () => {
  const contactDivs = document.querySelectorAll('[role="listitem"]');

  const contactContainers = [];

  const contactObjects = [];

  contactDivs.forEach((contact) => {
    contactContainers.push(
      contact.querySelector('[data-testid="cell-frame-container"]')
    );
  });

  contactContainers.forEach((contact) => {
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
    });
  });

  return contactObjects;
};

const sendMessage = (message) => {
  const mainEl = document.querySelector('#main');
  const textareaEl = mainEl.querySelector('div[contenteditable="true"]');

  if (!textareaEl) {
    throw new Error('There is no opened conversation');
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
