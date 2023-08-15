(() => {
  const URL = 'http://localhost:3000/api/clients/';

  // Настройка селекта
  function customizeSelect(elem) {
    let choises = new Choices(elem, {
      searchEnabled: false,
      itemSelectText: '',
      shouldSort: false,
      allowHTML: true
    });
  };

  // Фиксация label в окне Новый клиент
  let inputsNew = document.querySelectorAll('.dialog__input');
  inputsNew.forEach((elem) => {
    elem.addEventListener('blur', () => {
      if (elem.value) {
        document.querySelector(`.label:has(.${elem.classList[elem.classList.length - 1]}) .label__descr`).classList.add('label__descr_filled');
      } else {
          document.querySelector(`.label:has(.${elem.classList[elem.classList.length - 1]}) .label__descr`).classList.remove('label__descr_filled');
        };
    });
  });


  // Добавление нуля к числу, месяцу, часу или минуте при отображении даты и времени
  function getDateWithZero(dateElem, num = false, month = false, hour = false, min = false) {
    let resultDateElem = '';
    if (num === true) {
      resultDateElem = (String(dateElem.getDate()).length === 1) ? `0${dateElem.getDate()}` : `${dateElem.getDate()}`;
    } else if (month === true) {
        resultDateElem = (String(dateElem.getMonth() + 1).length === 1) ? `0${dateElem.getMonth() + 1}` : `${dateElem.getMonth() + 1}`;
      } else if (hour === true) {
          resultDateElem = (String(dateElem.getHours()).length === 1) ? `0${dateElem.getHours()}` : `${dateElem.getHours()}`;
        } else if (min === true) {
            resultDateElem = (String(dateElem.getMinutes()).length === 1) ? `0${dateElem.getMinutes()}` : `${dateElem.getMinutes()}`;
          };
    return resultDateElem;
  };

  // Открытие диалоговых окон
  function openDialogAndLockScroll(dialogClass) {
    document.querySelector(`.${dialogClass}`).showModal();
    document.body.classList.add('scroll-lock');
    let inputs = document.querySelector(`.${dialogClass}`).querySelectorAll('.dialog__input');
    setTimeout(() => {
    inputs.forEach((elem) => {
      if (elem.value) {
        document.querySelector(`.label:has(.${elem.classList[elem.classList.length - 1]}) .label__descr`).classList.add('label__descr_filled');

      } else {
          document.querySelector(`.label:has(.${elem.classList[elem.classList.length - 1]}) .label__descr`).classList.remove('label__descr_filled');
        };
      });
    }, 0);
    // Закрытие по backdrop
    let dialogWindow = document.querySelector(`.${dialogClass}`);
    dialogWindow.onclick = ({currentTarget, target}) => {
      const dialogElement = currentTarget;
      const isClickedOnBackDrop = target === dialogElement;
      if (isClickedOnBackDrop) {
        smoothlyClossingDialog(dialogClass);
      };
    };
    // Закрытие по Отмена
    let cancelButton = dialogWindow.querySelector('.dialog__button_cancel');
    if (cancelButton) {
      cancelButton.onclick = () => {
        smoothlyClossingDialog(dialogClass);
      };
    };
    // Закрытие по Х
    let closeButton = dialogWindow.querySelector('.dialog__button_close');
    if (closeButton) {
      closeButton.onclick = () => {
        smoothlyClossingDialog(dialogClass);
      };
    };
  };

  // Плавное закрытие диалоговых окон
  function smoothlyClossingDialog(dialogClass) {
    let dialogWindow = document.querySelector(`.${dialogClass}`);
    if (dialogWindow) {
      // Закрытие
      dialogWindow.classList.add('clossing');
      setTimeout(() => {
        dialogWindow.classList.remove('clossing');
        dialogWindow.close();
        document.body.classList.remove('scroll-lock');
        // Удаление контактов в окне Изменение
        let contacts = document.querySelector(`.${dialogClass} .wrap-change__contacts`);
        if (contacts) {
          contacts.innerHTML = '';
        };
        document.querySelectorAll('.label__descr').forEach((elem) => {
          elem.classList.remove('label__descr_filled');
        });
        document.querySelector('.wrap-change__contacts').classList.remove('hidden');
        document.querySelector('.wrap-change__add-contact').classList.remove('hidden');
      }, 200);
    };
  };

  // Закрытие диалогового окна по нажатию ESC
  // (из-за нативного закрытия по ESC smoothlyClossingDialog() не срабатывает)

  // ЗАбить на это и закинуть закрытие по esc в функцию открытия

  function closeEsc() {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        // smoothlyClossingDialog();
        if (document.querySelector('.clients__dialog_change[open]') && !document.querySelector('.clients__dialog_delete[open]')) {
          document.body.classList.remove('scroll-lock');
          let contacts = document.querySelector(`.wrap-change__contacts`);
          if (contacts) {
            contacts.innerHTML = '';
          };
          document.querySelectorAll('.label__descr').forEach((elem) => {
            elem.classList.remove('label__descr_filled');
          });
          document.querySelector('.wrap-change__contacts').classList.remove('hidden');
          document.querySelector('.wrap-change__add-contact').classList.remove('hidden');
        } else if (!document.querySelector('.clients__dialog_change[open]') && document.querySelector('.clients__dialog_delete[open]')) {
            document.body.classList.remove('scroll-lock');
          };
      };
    });
  };
  closeEsc();

  function getClient(client = {}, {toChangeClient, toDeleteClient} = {}, arr = [], workArr = []) {
    let row = document.createElement('tr');
    let col1 = document.createElement('td');
    let col2 = document.createElement('td');
    let col3 = document.createElement('td');
    let wrapCol3 = document.createElement('div');
    let dateElemCol3 = document.createElement('div');
    let timeElemCol3 = document.createElement('div');
    let col4 = document.createElement('td');
    let wrapCol4 = document.createElement('div');
    let dateElemCol4 = document.createElement('div');
    let timeElemCol4 = document.createElement('div');
    let col5 = document.createElement('td');
    let wrapCol5 = document.createElement('div');
    let elementsArrCol5 = [];
    for (let i = 0; i < 10; i++) {
      elementsArrCol5[i] = document.createElement('button');
    };
    elementCollapseCol5 = document.createElement('button');
    let col6 = document.createElement('td');
    let wrapCol6 = document.createElement('div');
    let toChangeElemCol6 = document.createElement('button');
    let toDeleteElemCol6 = document.createElement('button');

    row.append(col1);
    row.append(col2);
    row.append(col3);
    col3.append(wrapCol3);
    wrapCol3.append(dateElemCol3);
    wrapCol3.append(timeElemCol3);
    row.append(col4);
    col4.append(wrapCol4);
    wrapCol4.append(dateElemCol4);
    wrapCol4.append(timeElemCol4);
    row.append(col5);
    col5.append(wrapCol5);
    if (client.contacts.length) {
      for (let i = 0; i < client.contacts.length; i++) {
        wrapCol5.append(elementsArrCol5[i]);
        elementsArrCol5[i].classList.add('table__elemCol5', 'btn-reset');
      };
    };
    row.append(col6);
    col6.append(wrapCol6);
    wrapCol6.append(toChangeElemCol6);
    wrapCol6.append(toDeleteElemCol6);

    row.classList.add('table__tr');
    col1.classList.add('table__td', 'table__td_id');
    col2.classList.add('table__td', 'table__td_fio');
    col3.classList.add('table__td', 'table__td_created');
    wrapCol3.classList.add('table__wrapCol3', 'flex');
    dateElemCol3.classList.add('table__dateElemCol3');
    timeElemCol3.classList.add('table__timeElemCol3');
    col4.classList.add('table__td', 'table__td_changed');
    wrapCol4.classList.add('table__wrapCol4', 'flex');
    dateElemCol4.classList.add('table__dateElemCol4');
    timeElemCol4.classList.add('table__timeElemCol4');
    col5.classList.add('table__td', 'table__td_contacts');
    wrapCol5.classList.add('table__wrapCol5', 'flex');
    col6.classList.add('table__td', 'table__td_does');
    wrapCol6.classList.add('table__wrapCol6', 'flex');
    toChangeElemCol6.classList.add('table__toChangeElemCol6', 'btn-reset');
    toDeleteElemCol6.classList.add('table__toDeleteElemCol6', 'btn-reset');

    // Столбец ID
    col1.textContent = client.id;

    // Столбец Ф.И.О.
    col2.textContent = `${client.surname} ${client.name} ${client.lastName}`;

    // Столбец Дата и время создания
    let dateСreated = new Date(client.createdAt);
    dateElemCol3.textContent = `${getDateWithZero(dateСreated, true, false, false, false)}.${getDateWithZero(dateСreated, false, true, false, false)}.${dateСreated.getFullYear()}`;
    timeElemCol3.textContent = `${getDateWithZero(dateСreated, false, false, true, false)}:${getDateWithZero(dateСreated, false, false, false, true)}`;

    // Столбец Дата и время изменения
    let dateChanged = new Date(client.updatedAt);
    dateElemCol4.textContent = `${getDateWithZero(dateChanged, true, false, false, false)}.${getDateWithZero(dateChanged, false, true, false, false)}.${dateChanged.getFullYear()}`;
    timeElemCol4.textContent = `${getDateWithZero(dateChanged, false, false, true, false)}:${getDateWithZero(dateChanged, false, false, false, true)}`;

    // Столбец контакты
    if (client.contacts.length) {
      for (let i = 0; i < client.contacts.length; i++) {
        switch (client.contacts[i]['type']) {
          case 'Телефон':
            elementsArrCol5[i].classList.add('table__elemCol5_tel');
            break;
          case 'VK':
            elementsArrCol5[i].classList.add('table__elemCol5_vk');
            break;
          case 'Facebook':
            elementsArrCol5[i].classList.add('table__elemCol5_fb');
            break;
          case 'Email':
            elementsArrCol5[i].classList.add('table__elemCol5_mail');
            break;
          default:
            elementsArrCol5[i].classList.add('table__elemCol5_other');
            break;
        };
        if ((i >= 4) && (client.contacts.length > 4)) {
          elementsArrCol5[i].classList.add('hidden');
        };
      };
      if (client.contacts.length > 4) {
        wrapCol5.append(elementCollapseCol5);
        elementCollapseCol5.classList.add('table__elemCol5', 'table__elemCol5_collapse', 'btn-reset');
        elementCollapseCol5.textContent = `+${client.contacts.length - 4}`
      };
    };

    // Столбец действия
    toChangeElemCol6.textContent = 'Изменить';
    toDeleteElemCol6.textContent = 'Удалить';

    // Методы
    function deleteClient() {
      openDialogAndLockScroll('clients__dialog_delete');
      let deleteButton = document.querySelector('.dialog__button_del');
      if (deleteButton) {
        deleteButton.onclick = () => {
          toDeleteClient(client);
          row.remove();
          let indexOfDeletedClient = workArr.findIndex(i => i.id === `${client.id}`);
          if (Number(indexOfDeletedClient) >= 0) {
            workArr.splice(indexOfDeletedClient, 1)
          };
          smoothlyClossingDialog('clients__dialog_delete');
          smoothlyClossingDialog('clients__dialog_change');
        };
      };
    };

    // Изменение
    toChangeElemCol6.addEventListener('click', () => {
      openDialogAndLockScroll('clients__dialog_change');
      // Рендер
      if (client.contacts.length === 0) {
        document.querySelector('.wrap-change__contacts').classList.add('hidden');
      };
      if (client.contacts.length === 10) {
        document.querySelector('.wrap-change__add-contact').classList.add('hidden');
      };
      let idInTitleDialog = document.querySelector('.dialog__id');
      let inputName = document.querySelector('.dialog__input-change_name');
      let inputSurname = document.querySelector('.dialog__input-change_surname');
      let inputLastName = document.querySelector('.dialog__input-change_lastName');
      idInTitleDialog.textContent = `ID: ${client.id}`;
      inputName.value = `${client.name}`;
      inputSurname.value = `${client.surname}`;
      inputLastName.value = `${client.lastName}`;
      if (client.contacts.length) {
        let clientsContacts = [];
        for (let i = 0; i < 10; i++) {
          clientsContacts[i] = document.createElement('div');
        };
        for (let i = 0; i < client.contacts.length; i++) {
          document.querySelector('.wrap-change__contacts').append(clientsContacts[i]);
          clientsContacts[i].classList.add('wrap-change__contact', 'contact', 'flex');
          let typeContact = document.createElement('select');
          let typesContact = [];
          for (let index = 0; index < 5; index++) {
            typesContact[index] = document.createElement('option');
          };
          let valueContact = document.createElement('input');
          let btnDelContact = document.createElement('button');
          clientsContacts[i].append(typeContact);
          for (let index = 0; index < 5; index++) {
            typeContact.append(typesContact[index]);
            typesContact[index].classList.add('contact__type-option');
            switch (index) {
              case 0:
                typesContact[index].setAttribute('value', 'Телефон');
                typesContact[index].textContent = 'Телефон';
                if (client.contacts[i]['type'] === 'Телефон') {
                  typesContact[index].setAttribute('selected', 'true');
                };
                break;
              case 1:
                typesContact[index].setAttribute('value', 'Доп.телефон');
                typesContact[index].textContent = 'Доп. телефон';
                if (client.contacts[i]['type'] === 'Доп.телефон') {
                  typesContact[index].setAttribute('selected', 'true');
                };
                break;
              case 2:
                typesContact[index].setAttribute('value', 'Email');
                typesContact[index].textContent = 'Email';
                if (client.contacts[i]['type'] === 'Email') {
                  typesContact[index].setAttribute('selected', 'true');
                };
                break;
              case 3:
                typesContact[index].setAttribute('value', 'VK');
                typesContact[index].textContent = 'VK';
                if (client.contacts[i]['type'] === 'VK') {
                  typesContact[index].setAttribute('selected', 'true');
                };
                break;
              case 4:
                typesContact[index].setAttribute('value', 'Facebook');
                typesContact[index].textContent = 'Facebook';
                if (client.contacts[i]['type'] === 'Facebook') {
                  typesContact[index].setAttribute('selected', 'true');
                };
                break;
              default:
                typesContact[index].setAttribute('value', 'Доп.телефон');
                typesContact[index].textContent = 'Доп. телефон';
                typesContact[index].setAttribute('selected', 'true');
                break;
            };
          };
          typeContact.classList.add('contact__type');
          valueContact.classList.add('contact__value');
          btnDelContact.classList.add('contact__btn-del', 'btn-reset');
          clientsContacts[i].append(valueContact);
          clientsContacts[i].append(btnDelContact);
          tippy(btnDelContact, {
            content: 'Удалить контакт',
            appendTo: document.querySelector('.clients__dialog_change'),
          });
          // Удалить контакт
          btnDelContact.onclick = () => {
            if (document.querySelectorAll('.wrap-change__contact').length === 10) {
              addContactButton.classList.remove('hidden');
            };
            clientsContacts[i].remove();
            if (document.querySelectorAll('.wrap-change__contact').length === 0) {
              document.querySelector('.wrap-change__contacts').classList.add('hidden');
            };
          };
          valueContact.value = `${client.contacts[i]['value']}`
        };
      };
      // select
      let customSelectArr = document.querySelectorAll('.contact__type');
      customSelectArr.forEach((elem) => {
        customizeSelect(elem);
      });
      // Добавить контакт
      let addContactButton = document.querySelector('.wrap-change__add-contact');
      if (addContactButton) {
        addContactButton.onclick = () => {
          if ((client.contacts.length === 0) || (document.querySelectorAll('.wrap-change__contact').length === 0) ) {
            document.querySelector('.wrap-change__contacts').classList.remove('hidden');
          };
          let clientsContactNew = document.createElement('div');
          let typeContact = document.createElement('select');
          let typesContact = [];
          for (let i = 0; i < 5; i++) {
            typesContact[i] = document.createElement('option');
          };
          let valueContact = document.createElement('input');
          let btnDelContact = document.createElement('button');
          clientsContactNew.classList.add('wrap-change__contact', 'contact', 'flex');
          typeContact.classList.add('contact__type');
          valueContact.classList.add('contact__value');
          btnDelContact.classList.add('contact__btn-del', 'btn-reset');
          document.querySelector('.wrap-change__contacts').append(clientsContactNew);
          clientsContactNew.append(typeContact);
          for (let i = 0; i < 5; i++) {
            typeContact.append(typesContact[i]);
            typesContact[i].classList.add('contact__type-option');
            switch (i) {
              case 0:
                typesContact[i].setAttribute('value', 'Телефон');
                typesContact[i].textContent = 'Телефон';
                break;
              case 1:
                typesContact[i].setAttribute('value', 'Доп.телефон');
                typesContact[i].textContent = 'Доп. телефон';
                break;
              case 2:
                typesContact[i].setAttribute('value', 'Email');
                typesContact[i].textContent = 'Email';
                break;
              case 3:
                typesContact[i].setAttribute('value', 'VK');
                typesContact[i].textContent = 'VK';
                break;
              case 4:
                typesContact[i].setAttribute('value', 'Facebook');
                typesContact[i].textContent = 'Facebook';
                break;
            };
          };
          clientsContactNew.append(valueContact);
          clientsContactNew.append(btnDelContact);
          // Удалить контакт
          btnDelContact.onclick = () => {
            if (document.querySelectorAll('.wrap-change__contact').length === 10) {
              addContactButton.classList.remove('hidden');
            };
            clientsContactNew.remove();
            if (document.querySelectorAll('.wrap-change__contact').length === 0) {
              document.querySelector('.wrap-change__contacts').classList.add('hidden');
            };
          };
          tippy(btnDelContact, {
            content: 'Удалить контакт',
            appendTo: document.querySelector('.clients__dialog_change'),
          });
          customizeSelect(typeContact);
          let contactsElements = document.querySelectorAll('.wrap-change__contact');
          if (contactsElements.length === 10) {
            addContactButton.classList.add('hidden');
          };
        };
      };
      // Сохранить
      let changeButton = document.querySelector('.dialog__button_change');
      if (changeButton) {
        changeButton.onclick = () => {
          let arrOfChangeContacts = [];
          let elementsOfNewContact = document.querySelectorAll('.wrap-change__contact');
          if (elementsOfNewContact.length) {
            for (let i = 0; i < elementsOfNewContact.length; i++) {
              arrOfChangeContacts[i] = {
                'type': String(elementsOfNewContact[i].querySelector('option').value),
                'value': String(elementsOfNewContact[i].querySelector('input').value),
              };
            };
          };
          let clientNewData = {
            'name': `${inputName.value}`,
            'surname': `${inputSurname.value}`,
            'lastName': `${inputLastName.value}`,
            'contacts': arrOfChangeContacts,
          };
          toChangeClient(client, clientNewData);
          let indexOfChengedClient = workArr.findIndex(i => i.id === `${client.id}`);
          if (Number(indexOfChengedClient) >= 0) {
            workArr[indexOfChengedClient].name = clientNewData.name;
            workArr[indexOfChengedClient].surname = clientNewData.surname;
            workArr[indexOfChengedClient].lastName = clientNewData.lastName;
            workArr[indexOfChengedClient].contacts = clientNewData.contacts;
            workArr[indexOfChengedClient].updatedAt = new Date();
            tableView(tbody, [], workArr, {toChangeClient, toDeleteClient})
          };
          smoothlyClossingDialog('clients__dialog_change');
        };
      };
      // Удалить
      let changeDeleteButton = document.querySelector('.dialog__button_change-del');
      if (changeDeleteButton) {
        changeDeleteButton.onclick = () => {
          deleteClient();
        };
      };
    });

    // Удаление
    toDeleteElemCol6.addEventListener('click', () => {
      deleteClient();
    });

    return {
      row,
    };
  };

  function tableView(tbody, arr = [], workArr = [], methods = {}) {
    tbody.querySelectorAll('tr').forEach((el) => {
      el.remove();
    });
    if (workArr.length) {
      for (let client of workArr) {
        tbody.append(getClient(client, methods, arr, workArr).row);
        // Тултипы
        document.querySelectorAll('.table__tbody tr:last-of-type .table__elemCol5').forEach((element, index) => {
          if (!element.classList.contains('table__elemCol5_collapse')) {
            tippy(element, {
              content: `${client.contacts[index]['type']}: ${client.contacts[index]['value']}`,
              hideOnClick: true,
              trigger: 'click',
            });
          };
        });
      };
      // Разворот скрытых контактов
      let listOfelementsWithCollapse = document.querySelectorAll('div.table__wrapCol5:has(button.table__elemCol5_collapse)');
      if (listOfelementsWithCollapse.length) {
        listOfelementsWithCollapse.forEach((elementWithCollapse) => {
          elementWithCollapse.querySelector('.table__elemCol5_collapse').addEventListener('click', () => {
            elementWithCollapse.querySelectorAll('.hidden').forEach((elemHidden) => {
              elemHidden.classList.toggle('hidden');
            });
            elementWithCollapse.querySelector('.table__elemCol5_collapse').classList.toggle('hidden');
          });
        });
      };
    };
  };

  async function skillbusApp(tbody, addBtn) {
    let response = await fetch(URL)
          .catch((error) => {
            tbody.querySelector('.table__loading-img').remove();
            if (error.message === 'Failed to fetch') {
              tbody.querySelector('.table__td_default').textContent = `Ошибка: сервер не отвечает`;
            } else {
                tbody.querySelector('.table__td_default').textContent = `Ошибка: ${error.message}`;
              };
            console.log(`Ошибка: ${error.message}`)
          });
    let clientsList = await response.json();
    let methods = {
      toChangeClient(clientItem, clientNewData) {
        fetch(`${URL}${clientItem.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: clientNewData.name,
            surname: clientNewData.surname,
            lastName: clientNewData.lastName,
            contacts: clientNewData.contacts,
          }),
        });
      },
      toDeleteClient(clientItem) {
        fetch(`${URL}${clientItem.id}`, {
          method: 'DELETE',
        });
      },
    };
    tableView(tbody, [], clientsList, methods);

    addBtn.addEventListener('click', async () => {
      openDialogAndLockScroll('clients__dialog_new');
      let dataNewClient = {};
      let arrNewContacts = [];
      let inputName = document.querySelector('.dialog__input-new_name');
      let inputSurname = document.querySelector('.dialog__input-new_surname');
      let inputLastName = document.querySelector('.dialog__input-new_lastName');
      let saveNewClientBtn = document.querySelector('.dialog__button_new');

// Добавление контактов НЕ РАБОТАЕТ
      let addContactButton = document.querySelector('.wrap-new__add-contact');
      if (addContactButton) {
        addContactButton.onclick = () => {
          if (document.querySelectorAll('.wrap-new__contact').length === 0) {
            document.querySelector('.wrap-change__contacts').classList.remove('hidden');
          };
          let clientsContactNew = document.createElement('div');
          let typeContact = document.createElement('select');
          let typesContact = [];
          for (let i = 0; i < 5; i++) {
            typesContact[i] = document.createElement('option');
          };
          let valueContact = document.createElement('input');
          let btnDelContact = document.createElement('button');
          clientsContactNew.classList.add('wrap-new__contact', 'contact', 'flex');
          typeContact.classList.add('contact__type');
          valueContact.classList.add('contact__value');
          btnDelContact.classList.add('contact__btn-del', 'btn-reset');
          document.querySelector('.wrap-new__contacts').append(clientsContactNew);
          clientsContactNew.append(typeContact);
          for (let i = 0; i < 5; i++) {
            typeContact.append(typesContact[i]);
            typesContact[i].classList.add('contact__type-option');
            switch (i) {
              case 0:
                typesContact[i].setAttribute('value', 'Телефон');
                typesContact[i].textContent = 'Телефон';
                break;
              case 1:
                typesContact[i].setAttribute('value', 'Доп.телефон');
                typesContact[i].textContent = 'Доп. телефон';
                break;
              case 2:
                typesContact[i].setAttribute('value', 'Email');
                typesContact[i].textContent = 'Email';
                break;
              case 3:
                typesContact[i].setAttribute('value', 'VK');
                typesContact[i].textContent = 'VK';
                break;
              case 4:
                typesContact[i].setAttribute('value', 'Facebook');
                typesContact[i].textContent = 'Facebook';
                break;
            };
          };
          clientsContactNew.append(valueContact);
          clientsContactNew.append(btnDelContact);
          // Удалить контакт
          btnDelContact.onclick = () => {
            if (document.querySelectorAll('.wrap-new__contact').length === 10) {
              addContactButton.classList.remove('hidden');
            };
            clientsContactNew.remove();
            if (document.querySelectorAll('.wrap-change__contact').length === 0) {
              document.querySelector('.wrap-change__contacts').classList.add('hidden');
            };
          };
          tippy(btnDelContact, {
            content: 'Удалить контакт',
            appendTo: document.querySelector('.clients__dialog_new'),
          });
          customizeSelect(typeContact);
          let contactsElements = document.querySelectorAll('.wrap-change__contact');
          if (contactsElements.length === 10) {
            addContactButton.classList.add('hidden');
          };
        };
      };


      if (saveNewClientBtn) {
        saveNewClientBtn.onclick = async () => {
          // if ВАЛИДАЦИЯ
          dataNewClient = {
            'name': `${inputName.value}`,
            'surname': `${inputSurname.value}`,
            'lastName': `${inputLastName.value}`,
            'contacts': arrNewContacts,
          };
          let response = await fetch(URL, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(dataNewClient),
          });
          let newClient = await response.json();
          clientsList.push(newClient);
          tableView(tbody, [], clientsList, methods);
          inputName.value = '';
          inputSurname.value = '';
          inputLastName.value = '';
          let contacts = document.querySelector('.wrap-new__contacts');
          if (contacts) {
            contacts.innerHTML = '';
          };
          let inputsNew = document.querySelectorAll('.label__descr_new');
          inputsNew.forEach((elem) => {
            elem.classList.remove('label__descr_new-filled');
          });
          smoothlyClossingDialog('clients__dialog_new');
        };
      };
    });
  };

  window.createSkillbusApp = skillbusApp;
})();

