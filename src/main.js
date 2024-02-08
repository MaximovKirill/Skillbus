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
        document.querySelector(`.label:has(.${elem.classList[2]}) .label__descr`).classList.add('label__descr_filled');
      } else {
          document.querySelector(`.label:has(.${elem.classList[2]}) .label__descr`).classList.remove('label__descr_filled');
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
        // Очистка полей в окне Новый клиент
        document.querySelectorAll('.dialog__input-new').forEach((el) => {
          el.value = '';
        });
        // Удаление контактов в окне Изменение
        let contactsChange = document.querySelector(`.${dialogClass} .wrap-change__contacts`);
        if (contactsChange) {
          contactsChange.innerHTML = '';
        };
        let contactsNew = document.querySelector(`.${dialogClass} .wrap-new__contacts`);
        if (contactsNew) {
          contactsNew.innerHTML = '';
        };
        if (!(dialogClass === 'clients__dialog_delete')) {
          document.querySelectorAll('.label__descr').forEach((elem) => {
            elem.classList.remove('label__descr_filled');
          });
        };
        document.querySelector('.wrap-change__contacts').classList.remove('hidden');
        document.querySelector('.wrap-change__add-contact').classList.remove('hidden');
        document.querySelector('.wrap-new__contacts').classList.add('hidden');
        document.querySelector('.wrap-new__add-contact').classList.remove('hidden');
        // Удаление сообщений ошибок валидации
        document.querySelector('.dialog__errors_new').textContent = '';
        document.querySelector('.dialog__errors_change').textContent = '';
        document.querySelectorAll('.dialog__input').forEach((el) => {
          el.classList.remove('dialog__input_invalid');
        });
      }, 200);
    };
  };

  // Закрытие диалогового окна по нажатию ESC (из-за дефолтного срабатывания элемента dialog по нажатию esc)
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      // smoothlyClossingDialog(); не срабатывает
      if ((document.querySelector('.clients__dialog_new[open]') || document.querySelector('.clients__dialog_change[open]')) && !document.querySelector('.clients__dialog_delete[open]')) {
        document.body.classList.remove('scroll-lock');
        document.querySelectorAll('.label__descr').forEach((elem) => {
          elem.classList.remove('label__descr_filled');
        });
        // Очистка полей в окне Новый клиент
        document.querySelectorAll('.dialog__input-new').forEach((el) => {
          el.value = '';
        });
        // Удаление контактов в окне Изменение
        let contactsChange = document.querySelector('.clients__dialog_change .wrap-change__contacts');
        if (contactsChange) {
          contactsChange.innerHTML = '';
        };
        let contactsNew = document.querySelector('.clients__dialog_new .wrap-new__contacts');
        if (contactsNew) {
          contactsNew.innerHTML = '';
        };
        document.querySelector('.wrap-change__contacts').classList.remove('hidden');
        document.querySelector('.wrap-change__add-contact').classList.remove('hidden');
        document.querySelector('.wrap-new__contacts').classList.add('hidden');
        document.querySelector('.wrap-new__add-contact').classList.remove('hidden');
        // Удаление сообщений ошибок валидации
        document.querySelector('.dialog__errors_new').textContent = '';
        document.querySelector('.dialog__errors_change').textContent = '';
        document.querySelectorAll('.dialog__input').forEach((el) => {
          el.classList.remove('dialog__input_invalid');
        });
      } else if (!document.querySelector('.clients__dialog_change[open]') && document.querySelector('.clients__dialog_delete[open]')) {
          document.body.classList.remove('scroll-lock');
        };
    };
  });

  // Открыть окно добавления клиента
  function addClientWindowOpen() {
    openDialogAndLockScroll('clients__dialog_new');
    let addContactButton = document.querySelector('.wrap-new__add-contact');
    // Добавление контактов
    if (addContactButton) {
      addContactButton.onclick = () => {
        if (document.querySelectorAll('.wrap-new__contact').length === 0) {
          document.querySelector('.wrap-new__contacts').classList.remove('hidden');
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
              typesContact[i].setAttribute('value', 'Email');
              typesContact[i].textContent = 'Email';
              break;
            case 2:
              typesContact[i].setAttribute('value', 'Facebook');
              typesContact[i].textContent = 'Facebook';
              break;
            case 3:
              typesContact[i].setAttribute('value', 'VK');
              typesContact[i].textContent = 'VK';
              break;
            case 4:
              typesContact[i].setAttribute('value', 'Другое');
              typesContact[i].textContent = 'Другое';
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
          if (document.querySelectorAll('.wrap-new__contact').length === 0) {
            document.querySelector('.wrap-new__contacts').classList.add('hidden');
          };
        };
        tippy(btnDelContact, {
          content: 'Удалить контакт',
          appendTo: document.querySelector('.clients__dialog_new'),
        });
        customizeSelect(typeContact);
        let contactsElements = document.querySelectorAll('.wrap-new__contact');
        if (contactsElements.length === 10) {
          addContactButton.classList.add('hidden');
        };
      };
    };
  };

  // Закрыть окно добавления клиента
  function addClientWindowClose() {
    let inputName = document.querySelector('.dialog__input-new_name');
    let inputSurname = document.querySelector('.dialog__input-new_surname');
    let inputLastName = document.querySelector('.dialog__input-new_lastName');
    let contacts = document.querySelector('.wrap-new__contacts');
    let inputsNew = document.querySelectorAll('.label__descr_new');
    inputName.value = '';
    inputSurname.value = '';
    inputLastName.value = '';
    if (contacts) {
      contacts.innerHTML = '';
      contacts.classList.add('hidden');
    };
    inputsNew.forEach((elem) => {
      elem.classList.remove('label__descr_new-filled');
    });
    smoothlyClossingDialog('clients__dialog_new');
  };

  // Сортировка
  let sortData = [
    'id',
    NaN,
    'createdAt',
    'updatedAt',
  ];
  let sort = (arr, prop, dir = false) => arr.sort((a, b) => (!dir ? a[prop] < b[prop] : a[prop] > b[prop]) ? -1 : 1);
  let sortByFIO = (arr, propSname, propFname, propLname, dir = false) => arr.sort((a, b) => {
    if (!dir) {
      return (b[propSname] < a[propSname]) - (a[propSname] < b[propSname]) || (b[propFname] < a[propFname]) - (a[propFname] < b[propFname]) || (b[propLname] < a[propLname]) - (a[propLname] < b[propLname]);
    } else {
        return (b[propSname] > a[propSname]) - (a[propSname] > b[propSname]) || (b[propFname] > a[propFname]) - (a[propFname] > b[propFname]) || (b[propLname] > a[propLname]) - (a[propLname] > b[propLname]);
      };
  });

  //Рендер клиента
  function getClient(client = {}, {toRequestClient, toChangeClient, toDeleteClient} = {}, workArr = [], renderArr = []) {
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
    let toChangeElemCol6Icon = document.createElement('span');
    let toChangeElemCol6Span = document.createElement('span');
    let toDeleteElemCol6 = document.createElement('button')
    let toDeleteElemCol6Icon = document.createElement('span');
    let toDeleteElemCol6Span = document.createElement('span');

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
    toChangeElemCol6.append(toChangeElemCol6Icon);
    toChangeElemCol6.append(toChangeElemCol6Span);
    wrapCol6.append(toDeleteElemCol6);
    toDeleteElemCol6.append(toDeleteElemCol6Icon);
    toDeleteElemCol6.append(toDeleteElemCol6Span);

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
    toChangeElemCol6.classList.add('table__toChangeElemCol6', 'flex', 'btn-reset');
    toChangeElemCol6Icon.classList.add('table__toChangeElemCol6Icon');
    toChangeElemCol6Span.classList.add('table__toChangeElemCol6Span');
    toDeleteElemCol6.classList.add('table__toDeleteElemCol6', 'flex', 'btn-reset');
    toDeleteElemCol6Icon.classList.add('table__toDeleteElemCol6Icon')
    toDeleteElemCol6Span.classList.add('table__toDeleteElemCol6Span')

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
    toChangeElemCol6Span.textContent = 'Изменить';
    toDeleteElemCol6Span.textContent = 'Удалить';

    // Методы
    // Удаление
    async function deleteClient(workArr = [], renderArr = []) {
      let requestClient = await toRequestClient(client)
                            .then((prom) => {
                              toDeleteElemCol6Icon.classList.remove('loading-icon', 'loading-icon_delete');
                              toDeleteElemCol6Span.classList.remove('loading-text-delete');
                              document.querySelectorAll('.table__toChangeElemCol6').forEach((elem) => {
                                if (elem) {
                                  elem.disabled = false;
                                };
                              });
                              document.querySelectorAll('.table__toDeleteElemCol6').forEach((elem) => {
                                if (elem) {
                                  elem.disabled = false;
                                };
                              });
                              document.querySelector('.clients__add-btn').disabled = false;
                              return prom;
                            })
                            .catch((error) => {
                              console.log(`Ошибка: ${error.message}`)
                            });
      if (requestClient) {
        openDialogAndLockScroll('clients__dialog_delete');
        let deleteButton = document.querySelector('.dialog__button_del');
        if (deleteButton) {
          deleteButton.onclick = () => {
            toDeleteClient(client);
            row.remove();
            let indexOfDeletedClient = workArr.findIndex(i => i.id === `${client.id}`);
            if (Number(indexOfDeletedClient) >= 0) {
              workArr.splice(indexOfDeletedClient, 1);
              renderArr.splice(indexOfDeletedClient, 1);
            };
            smoothlyClossingDialog('clients__dialog_delete');
            smoothlyClossingDialog('clients__dialog_change');
          };
        };
      };
    };

    // Изменение
    async function changeClient(workArr = [], renderArr = []) {
      let requestClient = await toRequestClient(client)
                            .then((prom) => {
                              toChangeElemCol6Icon.classList.remove('loading-icon', 'loading-icon_change');
                              toChangeElemCol6Span.classList.remove('loading-text-change');
                              document.querySelectorAll('.table__toChangeElemCol6').forEach((elem) => {
                                if (elem) {
                                  elem.disabled = false;
                                };
                              });
                              document.querySelectorAll('.table__toDeleteElemCol6').forEach((elem) => {
                                if (elem) {
                                  elem.disabled = false;
                                };
                              });
                              document.querySelector('.clients__add-btn').disabled = false;
                              return prom;
                            })
                            .catch((error) => {
                              console.log(`Ошибка: ${error.message}`)
                            });
      if (requestClient) {
        openDialogAndLockScroll('clients__dialog_change');
        // Рендер
        if (requestClient.contacts.length === 0) {
          document.querySelector('.wrap-change__contacts').classList.add('hidden');
        };
        if (requestClient.contacts.length === 10) {
          document.querySelector('.wrap-change__add-contact').classList.add('hidden');
        };
        let idInTitleDialog = document.querySelector('.dialog__id');
        let inputName = document.querySelector('.dialog__input-change_name');
        let inputSurname = document.querySelector('.dialog__input-change_surname');
        let inputLastName = document.querySelector('.dialog__input-change_lastName');
        idInTitleDialog.textContent = `ID: ${requestClient.id}`;
        inputName.value = `${requestClient.name}`;
        inputSurname.value = `${requestClient.surname}`;
        inputLastName.value = `${requestClient.lastName}`;
        if (requestClient.contacts.length) {
          let clientsContacts = [];
          for (let i = 0; i < 10; i++) {
            clientsContacts[i] = document.createElement('div');
          };
          for (let i = 0; i < requestClient.contacts.length; i++) {
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
                  if (requestClient.contacts[i]['type'] === 'Телефон') {
                    typesContact[index].setAttribute('selected', 'true');
                  };
                  break;
                case 1:
                  typesContact[index].setAttribute('value', 'Email');
                  typesContact[index].textContent = 'Email';
                  if (requestClient.contacts[i]['type'] === 'Email') {
                    typesContact[index].setAttribute('selected', 'true');
                  };
                  break;
                case 2:
                  typesContact[index].setAttribute('value', 'Facebook');
                  typesContact[index].textContent = 'Facebook';
                  if (requestClient.contacts[i]['type'] === 'Facebook') {
                    typesContact[index].setAttribute('selected', 'true');
                  };
                  break;
                case 3:
                  typesContact[index].setAttribute('value', 'VK');
                  typesContact[index].textContent = 'VK';
                  if (requestClient.contacts[i]['type'] === 'VK') {
                    typesContact[index].setAttribute('selected', 'true');
                  };
                  break;
                case 4:
                  typesContact[index].setAttribute('value', 'Другое');
                  typesContact[index].textContent = 'Другое';
                  if (requestClient.contacts[i]['type'] === 'Другое') {
                    typesContact[index].setAttribute('selected', 'true');
                  };
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
            valueContact.value = `${requestClient.contacts[i]['value']}`
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
            if ((requestClient.contacts.length === 0) || (document.querySelectorAll('.wrap-change__contact').length === 0) ) {
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
                  typesContact[i].setAttribute('value', 'Email');
                  typesContact[i].textContent = 'Email';
                  break;
                case 2:
                  typesContact[i].setAttribute('value', 'Facebook');
                  typesContact[i].textContent = 'Facebook';
                  break;
                case 3:
                  typesContact[i].setAttribute('value', 'VK');
                  typesContact[i].textContent = 'VK';
                  break;
                case 4:
                  typesContact[i].setAttribute('value', 'Другое');
                  typesContact[i].textContent = 'Другое';
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
            changeButton.disabled = true;
            let errorElement = document.querySelector('.dialog__errors_change');
            let loadingIcon = document.querySelector('.button-save__loading');
            loadingIcon.classList.remove('hidden');
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
            toChangeClient(client, clientNewData)
              .then(async (resp) => {
                if (resp.status !== 422) {
                  let changedClient = await resp.json();
                  let indexOfChengedClient = workArr.findIndex(i => i.id === `${requestClient.id}`);
                  if (Number(indexOfChengedClient) >= 0) {
                    workArr[indexOfChengedClient].name = changedClient.name;
                    workArr[indexOfChengedClient].surname = changedClient.surname;
                    workArr[indexOfChengedClient].lastName = changedClient.lastName;
                    workArr[indexOfChengedClient].contacts = changedClient.contacts;
                    workArr[indexOfChengedClient].updatedAt = new Date();
                    renderArr.forEach((elem) => {
                      if (elem.id === requestClient.id) {
                        elem.name = changedClient.name;
                        elem.surname = changedClient.surname;
                        elem.lastName = changedClient.lastName;
                        elem.contacts = changedClient.contacts;
                        elem.updatedAt = new Date();
                      };
                    });
                    tableView(tbody, workArr, renderArr, {toRequestClient, toChangeClient, toDeleteClient})
                  };
                  errorElement.textContent = '';
                  changeButton.disabled = false;
                  loadingIcon.classList.add('hidden');
                  smoothlyClossingDialog('clients__dialog_change');
                } else {        //ЗДЕСЬ СДЕЛАТЬ ВСЁ ОФОРМЛЕНИЕ ОШИБОК ВАЛИДАЦИИ! СДЕЛАТЬ ВАЛИДАЦИЮ НА КЛИЕНТЕ!, адаптивность и всё 
                    errorElement.textContent = '';
                    let respOfErrors = await resp.json();
                    let arrOfErrors = respOfErrors.errors;
                    let flag = true;
                    arrOfErrors.forEach((elem) => {
                      switch (elem.field) {
                        case 'name':
                          errorElement.textContent = errorElement.textContent + elem.message;
                          console.log(elem.message);
                          break;
                        case 'surname':
                          errorElement.textContent = errorElement.textContent + elem.message;
                          console.log(elem.message);
                          break;
                        case 'contacts':
                          errorElement.textContent = errorElement.textContent + elem.message;
                          console.log(elem.message);
                          break;
                        default:
                          errorElement.textContent = 'Что-то пошло не так...';
                          flag = false;
                          break;
                      };
                    });
                    changeButton.disabled = false;
                    loadingIcon.classList.add('hidden');
                    if (flag) {
                      throw new Error('Ошибка валидации!');
                    } else {
                      throw new Error('Что-то пошло не так...');
                      };
                  };
              })
              .catch((error) => {
                console.log(error.message);
              });
          };
        };
        // Удалить
        let changeDeleteButton = document.querySelector('.dialog__button_change-del');
        if (changeDeleteButton) {
          changeDeleteButton.onclick = () => {
            deleteClient(workArr, renderArr);
          };
        };
      };
    };

    // Изменение
    toChangeElemCol6.addEventListener('click', () => {
      toChangeElemCol6Icon.classList.add('loading-icon', 'loading-icon_change');
      toChangeElemCol6Span.classList.add('loading-text-change');
      document.querySelectorAll('.table__toChangeElemCol6').forEach((elem) => {
        if (elem) {
          elem.disabled = true;
        };
      });
      document.querySelectorAll('.table__toDeleteElemCol6').forEach((elem) => {
        if (elem) {
          elem.disabled = true;
        };
      });
      document.querySelector('.clients__add-btn').disabled = true;
      changeClient(workArr, renderArr);
    });

    // Удаление
    toDeleteElemCol6.addEventListener('click', () => {
      toDeleteElemCol6Icon.classList.add('loading-icon', 'loading-icon_delete');
      toDeleteElemCol6Span.classList.add('loading-text-delete');
      document.querySelectorAll('.table__toChangeElemCol6').forEach((elem) => {
        if (elem) {
          elem.disabled = true;
        };
      });
      document.querySelectorAll('.table__toDeleteElemCol6').forEach((elem) => {
        if (elem) {
          elem.disabled = true;
        };
      });
      document.querySelector('.clients__add-btn').disabled = true;
      deleteClient(workArr, renderArr);
    });

    return {
      row,
    };
  };

  // Рендер таблицы
  function tableView(tbody, workArr = [], renderArr = [], methods = {}) {
    tbody.querySelectorAll('tr').forEach((el) => {
      el.remove();
    });
    if (renderArr.length) {
      for (let client of renderArr) {
        tbody.append(getClient(client, methods, workArr, renderArr).row);
        // Тултипы
        document.querySelectorAll('.table__tbody tr:last-of-type .table__elemCol5').forEach((element, index) => {
          if (!element.classList.contains('table__elemCol5_collapse')) {
            tippy(element, {
              content: `${client.contacts[index]['type']}: ${client.contacts[index]['value']}`,
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

  // Приложение
  async function skillbusApp(tbody, addBtn) {
    // Загрузка таблицы
    const ERR = 'Что-то пошло не так...';
    let workArr = [];
    let sortArr = [];
    let methods = {
      async toRequestClient(clientItem) {
        return await fetch(`${URL}${clientItem.id}`)
                        .then((resp) => {
                          return resp.json();
                        })
                        .catch((error) => {
                          console.log(`Ошибка: ${error.message}`);
                        });
      },
      async toChangeClient(clientItem, clientNewData) {
        return await fetch(`${URL}${clientItem.id}`, {
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

    await fetch(URL)
      .then(async (resp) => {
        if (resp.status === 200) {
          let clientsList = await resp.json();
          workArr = [...clientsList];
          sortArr = [...clientsList];
          tableView(tbody, workArr, sort(sortArr, 'id', false), methods);
        } else {
            throw new Error(ERR);
          };
      })
      .catch((error) => {
        document.querySelector('.clients__add-btn').style.display = 'none';
        document.querySelector('.header__search').setAttribute('disabled', 'disabled');
        document.querySelectorAll('.table__th').forEach((el) => {
          el.setAttribute('disabled', 'disabled');
        });
        if (tbody.querySelector('.table__loading-img')) {
          tbody.querySelector('.table__loading-img').remove();
          tbody.querySelector('.table__td_default').textContent = ERR;
        } else {
            tbody.querySelectorAll('tr').forEach((el) => {
              el.remove();
            });
            let row =  document.createElement('tr');
            let col=  document.createElement('td');
            tbody.append(row);
            row.append(col);
            row.classList.add('table__tr', 'table__tr_default');
            col.classList.add('table__td', 'table__td_default');
            col.setAttribute('colspan', '6');
            col.textContent = ERR;
            console.log(`Ошибка: ${error.message}`)
          };
      });

    // Добавление клиента
    addBtn.onclick = () => {
      addClientWindowOpen();
      let dataNewClient = {};
      let arrNewContacts = [];
      let addClientBtn = document.querySelector('.dialog__button_new');
      let inputName = document.querySelector('.dialog__input-new_name');
      let inputSurname = document.querySelector('.dialog__input-new_surname');
      let inputLastName = document.querySelector('.dialog__input-new_lastName');
      document.querySelectorAll('.dialog__input-new').forEach((el) => {
        el.oninput = () => {
          el.classList.remove('dialog__input_invalid');
        };
      });
      addClientBtn.onclick = async () => {
        document.querySelector('.dialog__errors_new').textContent = '';
        document.querySelectorAll('.wrap-new__contact').forEach((el) => {
          el.querySelector('input').classList.remove('dialog__input_invalid');
        });
        // Валидация
        let errorElement = document.querySelector('.dialog__errors_new');
        let flagInvalidSurname = true;
        let flagInvalidName = true;
        let flagInvalidCintact = true;
        if (!inputSurname.value) {
          flagInvalidSurname = false;
          errorElement.innerHTML = errorElement.textContent + 'Ошибка: введите фамилию; \n';
          inputSurname.classList.add('dialog__input_invalid');
        };
        if (!inputName.value) {
          flagInvalidName = false;
          errorElement.textContent = errorElement.textContent + 'Ошибка: введите имя; \n'
          inputName.classList.add('dialog__input_invalid');
        };
        let arrElementsOfContacts = document.querySelectorAll('.wrap-new__contact');
        if (arrElementsOfContacts.length) {
          for (let i = 0; i < arrElementsOfContacts.length; i++) {
            if (!arrElementsOfContacts[i].querySelector('input').value) {
              arrElementsOfContacts[i].querySelector('input').classList.add('dialog__input_invalid');
              flagInvalidCintact = false;
            };
          };
          if (!flagInvalidCintact) {
            errorElement.innerHTML = errorElement.textContent + 'Ошибка: введите все контакты';
          }
        };
        // Сохранение
        if (flagInvalidName && flagInvalidSurname && flagInvalidCintact) {
          let arrElementsOfContacts = document.querySelectorAll('.wrap-new__contact');
          if (arrElementsOfContacts.length) {
            for (let i = 0; i < arrElementsOfContacts.length; i++) {
              arrNewContacts[i] = {
                'type': String(arrElementsOfContacts[i].querySelector('option').value),
                'value': String(arrElementsOfContacts[i].querySelector('input').value),
              };
            };
          };
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
          workArr.push(newClient);
          sortArr.splice(0);
          sortArr = [...workArr];
          tableView(tbody, workArr, sort(sortArr, 'id', false), methods);
          addClientWindowClose();
        };
      };
    };

    // Сортировка
    let sortFields = document.querySelectorAll('.table__th_sort');
    let reversId = true;
    let reversFio = false;
    let reversCreated = false;
    let reversChanged = false;
    sortFields.forEach((th_cell) => {
      if (th_cell.getAttribute('data-path') === '0') {
        th_cell.firstElementChild.style.setProperty('--angle-sort', '0deg');
      } else {
          th_cell.firstElementChild.style.setProperty('--angle-sort', '180deg');
        };
      if (th_cell.getAttribute('data-path') === '1') {
        th_cell.lastElementChild.style.setProperty('--word-sort', 'А-Я');
      };
    });
    sortFields.forEach((th_cell) => {
      th_cell.addEventListener('click', () => {
        let angleSortValue = String(th_cell.firstElementChild.style.getPropertyValue('--angle-sort'));
        (angleSortValue !== '180deg') ? th_cell.firstElementChild.style.setProperty('--angle-sort', '180deg') : th_cell.firstElementChild.style.setProperty('--angle-sort', '0deg');
        if (th_cell.getAttribute('data-path') === '1') {
          let wordSortValue = String(th_cell.lastElementChild.style.getPropertyValue('--word-sort'));
          (wordSortValue !== 'Я-А') ? th_cell.lastElementChild.style.setProperty('--word-sort', 'Я-А') : th_cell.lastElementChild.style.setProperty('--word-sort', 'А-Я');
          th_cell.lastElementChild.textContent = th_cell.lastElementChild.style.getPropertyValue('--word-sort');
        };
        switch (th_cell.getAttribute('data-path')) {
          case '0':
            sort(sortArr, `${sortData[th_cell.getAttribute('data-path')]}`, reversId);
            reversId = !reversId;
            break;
          case '1':
            sortByFIO(sortArr, 'surname', 'name', 'lastName', reversFio);
            reversFio = !reversFio;
            break;
          case '2':
            sort(sortArr, `${sortData[th_cell.getAttribute('data-path')]}`, reversCreated);
            reversCreated = !reversCreated;
            break;
          case '3':
            sort(sortArr, `${sortData[th_cell.getAttribute('data-path')]}`, reversChanged);
            reversChanged = !reversChanged;
            break;
          default:
            sort(sortArr, 'id', false);
            reversId = !reversId;
            break;
        };
        tableView(tbody, workArr, sortArr, methods);
      });
    });

    // Поиск
    let searchInput = document.querySelector('.header__search');
    searchInput.addEventListener('input', () => {
      setTimeout(async () => {
        let response = await fetch(`${URL}?search=${String(searchInput.value)}`);
        let searchArr = await response.json();
        sortArr.splice(0);
        sortArr = [...searchArr];
        tableView(tbody, workArr, sortArr, methods);
      }, 300);
    });

  };
  window.createSkillbusApp = skillbusApp;
})();

