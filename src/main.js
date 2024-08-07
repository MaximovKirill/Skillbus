(() => {
  const URL = 'http://localhost:3000/api/clients/';
  const ERR = 'Что-то пошло не так...';
  const EMAIL_REGEXP = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
  const TEL_REGEXP = /^[\+0-9][0-9][0-9][0-9][0-9]+$/;

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
    if (num) {
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

  // Функция сброса диалоговых окон
  function resetDialog(dialogClass) {
    switch (dialogClass) {
      case 'clients__dialog_new':
        document.querySelectorAll('.dialog__input-new').forEach((el) => {
          el.value = '';
        });
        document.querySelector(`.${dialogClass} .wrap-new__contacts`).innerHTML = '';
        document.querySelectorAll('.label__descr').forEach((elem) => {
          elem.classList.remove('label__descr_filled');
        });
        document.querySelector('.wrap-new__contacts').classList.add('hidden');
        document.querySelector('.wrap-new__add-contact').classList.remove('hidden');
        document.querySelector('.dialog__errors_new').textContent = '';
        document.querySelector('.button-new').disabled = false;
      break;
      case 'clients__dialog_change':
        document.querySelector(`.${dialogClass} .wrap-change__contacts`).innerHTML = '';
        document.querySelectorAll('.label__descr').forEach((elem) => {
          elem.classList.remove('label__descr_filled');
        });
        document.querySelector('.wrap-change__contacts').classList.remove('hidden');
        document.querySelector('.wrap-change__add-contact').classList.remove('hidden');
        document.querySelector('.dialog__errors_change').textContent = '';
        document.querySelector('.button-save').disabled = false;
        document.querySelector('.dialog__button_change-del').disabled = false;
      break;
      case 'clients__dialog_delete':
        document.querySelector('.dialog__errors_del').textContent = '';
        document.querySelector('.button-del').disabled = false;
        document.querySelector('.button-save').disabled = false;
      break;
    };
    document.querySelectorAll('.dialog__input').forEach((el) => {
      el.classList.remove('dialog__input_invalid');
    });
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
        // Сброс диалоговых окон в зависимости от содержимого
        resetDialog(dialogClass);
      }, 200);
    };
  };

  // Закрытие диалогового окна по нажатию ESC (из-за дефолтного срабатывания элемента dialog по нажатию esc)
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      let flag = '';
      document.body.classList.remove('scroll-lock');
      if (document.querySelector('.clients__dialog_delete[open]')) {
        flag = 'clients__dialog_delete';
      } else if (document.querySelector('.clients__dialog_change[open]')) {
          flag = 'clients__dialog_change';
        } else if (document.querySelector('.clients__dialog_new[open]')) {
            flag = 'clients__dialog_new';
          };
      resetDialog(flag);
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

  // Валидация на клиенте
  function validation(dialog) {
    let errorElement = document.querySelector(`.dialog__errors_${dialog}`);
    let inputName = document.querySelector(`.dialog__input-${dialog}_name`);
    let inputSurname = document.querySelector(`.dialog__input-${dialog}_surname`);
    let flagInvalidSurname = true;
    let flagInvalidName = true;
    let flagInvalidContact = true;
    let flagInvalidEmail = true;
    let flagInvalidTel = true;
    // Функция проверки валидности содержимого поля Email
    function isEmailValid(value) {
      return EMAIL_REGEXP.test(value);
    };
    // Функция проверки валидности содержимого поля Телефон
    function isTelValid(value) {
      return TEL_REGEXP.test(value);
    };
    if (!inputSurname.value) {
      flagInvalidSurname = false;
      inputSurname.classList.add('dialog__input_invalid');
    };
    if (!inputName.value) {
      flagInvalidName = false;
      inputName.classList.add('dialog__input_invalid');
    };
    let arrElementsOfContacts = document.querySelectorAll(`.wrap-${dialog}__contact`);
    if (arrElementsOfContacts.length) {
      for (let i = 0; i < arrElementsOfContacts.length; i++) {
        if (!arrElementsOfContacts[i].querySelector('input').value) {
          arrElementsOfContacts[i].querySelector('input').classList.add('dialog__input_invalid');
          flagInvalidContact = false;
        };
        if (arrElementsOfContacts[i].querySelector('option[value=Email]')) {
          if (!isEmailValid(arrElementsOfContacts[i].querySelector('.contact__value').value)) {
            arrElementsOfContacts[i].querySelector('input').classList.add('dialog__input_invalid');
            flagInvalidEmail = false;
          };
        };
        if (arrElementsOfContacts[i].querySelector('option[value=Телефон]')) {
          if (!isTelValid(arrElementsOfContacts[i].querySelector('.contact__value').value)) {
            arrElementsOfContacts[i].querySelector('input').classList.add('dialog__input_invalid');
            flagInvalidTel = false;
          };
        };
      };
    };
    if (!flagInvalidSurname || !flagInvalidName || !flagInvalidContact || !flagInvalidEmail || !flagInvalidTel) {
      errorElement.textContent = 'Ошибка: \n';
    };
    if (!flagInvalidSurname) {
      errorElement.textContent = errorElement.textContent + 'введите фамилию; \n';
    };
    if (!flagInvalidName) {
      errorElement.textContent = errorElement.textContent + 'введите имя; \n';
    };
    if (!flagInvalidContact) {
      errorElement.textContent = errorElement.textContent + 'введите все контакты; \n';
    };
    if (!flagInvalidEmail) {
      errorElement.textContent = errorElement.textContent + 'введите корректный Email; \n';
    };
    if (!flagInvalidTel) {
      errorElement.textContent = errorElement.textContent + 'введите корректный телефон; \n';
    };
    return flagInvalidSurname && flagInvalidName && flagInvalidContact && flagInvalidEmail && flagInvalidTel;
  };

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
      await toRequestClient(client)
        .finally(() => {
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
        })
        .then((prom) => {
          if (prom) {
            if (prom.status === 404) {
              row.remove();
              let indexOfDeletedClient = workArr.findIndex(i => i.id === `${client.id}`);
              if (Number(indexOfDeletedClient) >= 0) {
                workArr.splice(indexOfDeletedClient, 1);
                renderArr.splice(indexOfDeletedClient, 1);
              };
              throw new Error('Клиент не найден!');
            } else if (prom.status === 500) {
                throw new Error('Сервер не отвечает!');
              } else if (prom.status === 200) {
                  openDialogAndLockScroll('clients__dialog_delete');
                  let deleteButton = document.querySelector('.dialog__button_del');
                  if (deleteButton) {
                    deleteButton.onclick = async () => {
                      deleteButton.disabled = true;
                      let loadingIcon = document.querySelector('.button-del__loading');
                      loadingIcon.classList.remove('hidden');
                      await toDeleteClient(client)
                        .finally(() => {
                          loadingIcon.classList.add('hidden');
                          deleteButton.disabled = false;
                        })
                        .then(async (resp) => {
                          let errorElement = document.querySelector('.dialog__errors_del');
                          if (resp.status === 404) {
                            errorElement.textContent = 'Ошибка: клиент не найден';
                            row.remove();
                            let indexOfDeletedClient = workArr.findIndex(i => i.id === `${client.id}`);
                            if (Number(indexOfDeletedClient) >= 0) {
                              workArr.splice(indexOfDeletedClient, 1);
                              renderArr.splice(indexOfDeletedClient, 1);
                            };
                            throw new Error('Клиент не найден!');
                          } else if (resp.status === 500) {
                              errorElement.textContent = 'Ошибка: сервер не отвечает';
                              throw new Error('Сервер не отвечает!');
                            } else if (resp.status === 200) {
                                row.remove();
                                let indexOfDeletedClient = workArr.findIndex(i => i.id === `${client.id}`);
                                if (Number(indexOfDeletedClient) >= 0) {
                                  workArr.splice(indexOfDeletedClient, 1);
                                  renderArr.splice(indexOfDeletedClient, 1);
                                };
                                if (document.querySelector('.clients__dialog_change').hasAttribute('open')) {
                                  smoothlyClossingDialog('clients__dialog_delete');
                                  smoothlyClossingDialog('clients__dialog_change');
                                } else {
                                    smoothlyClossingDialog('clients__dialog_delete');
                                  };
                              } else {
                                  errorElement.textContent = `Ошибка: ${ERR}`;
                                  throw new Error(ERR);
                                };
                        })
                        .catch((error) => {
                          if (error.message === 'Failed to fetch') {
                            console.log('Ошибка: проблемы с сетью!');
                            let errorElement = document.querySelector('.dialog__errors_del');
                            errorElement.textContent = 'Ошибка: проблемы с сетью!';
                          } else {
                              console.log(`Ошибка: ${error.message}`);
                            };
                        });
                    };
                  };
                } else {
                    throw new Error(ERR);
                  };
          } else {
              throw new Error(ERR);
            };
        })
        .catch((error) => {
          if (error.message === 'Failed to fetch') {
            console.log('Ошибка: проблемы с сетью!');
          } else {
              console.log(`Ошибка: ${error.message}`);
            };
        });
    };

    // Изменение
    async function changeClient(workArr = [], renderArr = []) {
      await toRequestClient(client)
        .finally(() => {
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
        })
        .then(async (prom) => {
          if (prom) {
            if (prom.status === 404) {
              console.log('Клиент не найден!');
              row.remove();
              let indexOfDeletedClient = workArr.findIndex(i => i.id === `${client.id}`);
              if (Number(indexOfDeletedClient) >= 0) {
                workArr.splice(indexOfDeletedClient, 1);
                renderArr.splice(indexOfDeletedClient, 1);
              };
            } else if (prom.status === 500) {
                console.log('Сервер не отвечает!');
              } else if (prom.status === 200) {
                  let requestClient = await prom.json();
                  openDialogAndLockScroll('clients__dialog_change');
                  document.querySelectorAll('.dialog__input-change').forEach((el) => {
                    el.oninput = () => {
                      el.classList.remove('dialog__input_invalid');
                    };
                  });
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
                  let addContactBtn = document.querySelector('.wrap-change__add-contact');
                  let loadingIcon = document.querySelector('.button-save__loading');
                  let changeDeleteButton = document.querySelector('.dialog__button_change-del');
                  if (changeButton) {
                    changeButton.onclick = async () => {
                      let errorElement = document.querySelector('.dialog__errors_change');
                      errorElement.textContent = '';
                      changeButton.disabled = true;
                      changeDeleteButton.disabled = true;
                      loadingIcon.classList.remove('hidden');
                      addContactBtn.disabled = true;
                      inputName.disabled = true;
                      inputSurname.disabled = true; 
                      inputLastName.disabled = true;
                      document.querySelectorAll('.contact__value').forEach((el) => {
                        el.disabled = true;
                      });
                      document.querySelectorAll('.contact__value').forEach((el) => {
                        el.oninput = () => {
                          el.classList.remove('dialog__input_invalid');
                        };
                      });
                      document.querySelectorAll('.wrap-change__contact').forEach((el) => {
                        el.querySelector('input').classList.remove('dialog__input_invalid');
                      });
                      if (validation('change')) {
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
                        await toChangeClient(client, clientNewData)
                          .finally(() => {
                            loadingIcon.classList.add('hidden');
                            changeButton.disabled = false;
                            changeDeleteButton.disabled = false;
                            addContactBtn.disabled = false;
                            inputName.disabled = false;
                            inputSurname.disabled = false; 
                            inputLastName.disabled = false;
                            document.querySelectorAll('.contact__value').forEach((el) => {
                              el.disabled = false;
                            });
                          })
                          .then(async (resp) => {
                            let errorElement = document.querySelector('.dialog__errors_change');
                            errorElement.textContent = '';
                            if (resp.status === 404) {
                              errorElement.textContent = 'Ошибка: клиент не найден';
                              row.remove();
                              let indexOfDeletedClient = workArr.findIndex(i => i.id === `${client.id}`);
                              if (Number(indexOfDeletedClient) >= 0) {
                                workArr.splice(indexOfDeletedClient, 1);
                                renderArr.splice(indexOfDeletedClient, 1);
                              };
                              throw new Error('Клиент не найден!');
                            } else if (resp.status === 500) {
                                errorElement.textContent = 'Ошибка: сервер не отвечает';
                                throw new Error('Сервер не отвечает!');
                              } else if (resp.status === 422) {
                                  errorElement.textContent = 'Ошибка: \n';
                                  let respOfErrors = await resp.json();
                                  let arrOfErrors = respOfErrors.errors;
                                  arrOfErrors.forEach((elem) => {
                                    switch (elem.field) {
                                      case 'name':
                                        inputName.classList.add('dialog__input_invalid');
                                        errorElement.textContent = errorElement.textContent + elem.message + '; ';
                                        console.log(elem.message);
                                        break;
                                      case 'surname':
                                        inputSurname.classList.add('dialog__input_invalid');
                                        errorElement.textContent = errorElement.textContent + elem.message + '; ';
                                        console.log(elem.message);
                                        break;
                                      case 'contacts':
                                        let arrElementsOfContacts = document.querySelectorAll('.wrap-new__contact');
                                        if (arrElementsOfContacts.length) {
                                          for (let i = 0; i < arrElementsOfContacts.length; i++) {
                                            if (!arrElementsOfContacts[i].querySelector('input').value) {
                                              arrElementsOfContacts[i].querySelector('input').classList.add('dialog__input_invalid');
                                            };
                                          };
                                        };
                                        errorElement.textContent = errorElement.textContent + elem.message + '; ';
                                        console.log(elem.message);
                                        break;
                                    };
                                  });
                                  throw new Error('Ошибка валидации!');
                                } else if (resp.status === 200) {
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
                                    smoothlyClossingDialog('clients__dialog_change');
                                  } else {
                                      errorElement.textContent = `Ошибка: ${ERR}`;
                                      throw new Error(ERR);
                                    };
                          })  
                          .catch((error) => {
                            if (error.message === 'Failed to fetch') {
                              console.log('Ошибка: проблемы с сетью!');
                              let errorElement = document.querySelector('.dialog__errors_change');
                              errorElement.textContent = 'Ошибка: проблемы с сетью!';
                            } else {
                                console.log(`Ошибка: ${error.message}`);
                              };
                          });
                      } else {
                          loadingIcon.classList.add('hidden');
                          changeButton.disabled = false;
                          changeDeleteButton.disabled = false;
                          addContactBtn.disabled = false;
                          inputName.disabled = false;
                          inputSurname.disabled = false; 
                          inputLastName.disabled = false;
                          document.querySelectorAll('.contact__value').forEach((el) => {
                            el.disabled = false;
                          });
                        };
                    };
                  };
                  // Удалить
                  if (changeDeleteButton) {
                    changeDeleteButton.onclick = async () => {
                      changeDeleteButton.disabled = true;
                      changeButton.disabled = true;
                      loadingIcon.classList.remove('hidden');
                      addContactBtn.disabled = true;
                      inputName.disabled = true;
                      inputSurname.disabled = true; 
                      inputLastName.disabled = true;
                      document.querySelectorAll('.contact__value').forEach((el) => {
                        el.disabled = true;
                      });
                      await toRequestClient(client)
                        .finally(() => {
                          changeDeleteButton.disabled = false;
                          changeButton.disabled = false;
                          loadingIcon.classList.add('hidden');
                          addContactBtn.disabled = false;
                          inputName.disabled = false;
                          inputSurname.disabled = false; 
                          inputLastName.disabled = false;
                          document.querySelectorAll('.contact__value').forEach((el) => {
                            el.disabled = false;
                          });
                        })
                        .then((prom) => {
                          let errorElementChange = document.querySelector('.dialog__errors_change');
                          errorElementChange.textContent = '';
                          if (prom) {
                            if (prom.status === 404) {
                              row.remove();
                              let indexOfDeletedClient = workArr.findIndex(i => i.id === `${client.id}`);
                              if (Number(indexOfDeletedClient) >= 0) {
                                workArr.splice(indexOfDeletedClient, 1);
                                renderArr.splice(indexOfDeletedClient, 1);
                              };
                              errorElementChange.textContent = 'Ошибка: клиент не найден!';
                              throw new Error('Клиент не найден!');
                            } else if (prom.status === 500) {
                                errorElementChange.textContent = 'Ошибка: сервер не отвечает!';
                                throw new Error('Сервер не отвечает!');
                              } else if (prom.status === 200) {
                                  openDialogAndLockScroll('clients__dialog_delete');
                                  let deleteButton = document.querySelector('.dialog__button_del');
                                  if (deleteButton) {
                                    deleteButton.onclick = async () => {
                                      deleteButton.disabled = true;
                                      let loadingIcon = document.querySelector('.button-del__loading');
                                      loadingIcon.classList.remove('hidden');
                                      await toDeleteClient(client)
                                        .finally(() => {
                                          loadingIcon.classList.add('hidden');
                                          deleteButton.disabled = false;
                                        })
                                        .then(async (resp) => {
                                          let errorElement = document.querySelector('.dialog__errors_del');
                                          if (resp.status === 404) {
                                            errorElement.textContent = 'Ошибка: клиент не найден';
                                            row.remove();
                                            let indexOfDeletedClient = workArr.findIndex(i => i.id === `${client.id}`);
                                            if (Number(indexOfDeletedClient) >= 0) {
                                              workArr.splice(indexOfDeletedClient, 1);
                                              renderArr.splice(indexOfDeletedClient, 1);
                                            };
                                            throw new Error('Клиент не найден!');
                                          } else if (resp.status === 500) {
                                              errorElement.textContent = 'Ошибка: сервер не отвечает';
                                              throw new Error('Сервер не отвечает!');
                                            } else if (resp.status === 200) {
                                                row.remove();
                                                let indexOfDeletedClient = workArr.findIndex(i => i.id === `${client.id}`);
                                                if (Number(indexOfDeletedClient) >= 0) {
                                                  workArr.splice(indexOfDeletedClient, 1);
                                                  renderArr.splice(indexOfDeletedClient, 1);
                                                };
                                                if (document.querySelector('.clients__dialog_change').hasAttribute('open')) {
                                                  smoothlyClossingDialog('clients__dialog_delete');
                                                  smoothlyClossingDialog('clients__dialog_change');
                                                } else {
                                                    smoothlyClossingDialog('clients__dialog_delete');
                                                  };
                                              } else {
                                                  errorElement.textContent = `Ошибка: ${ERR}`;
                                                  throw new Error(ERR);
                                                };
                                        })
                                        .catch((error) => {
                                          if (error.message === 'Failed to fetch') {
                                            console.log('Ошибка: проблемы с сетью!');
                                            let errorElement = document.querySelector('.dialog__errors_del');
                                            errorElement.textContent = 'Ошибка: проблемы с сетью!';
                                          } else {
                                              console.log(`Ошибка: ${error.message}`);
                                            };
                                        });
                                    };
                                  };
                                } else {
                                    throw new Error(ERR);
                                  };
                          } else {
                              throw new Error(ERR);
                            };
                        })
                        .catch((error) => {
                          if (error.message === 'Failed to fetch') {
                            console.log('Ошибка: проблемы с сетью!');
                            let errorElementChange = document.querySelector('.dialog__errors_change');
                            errorElementChange.textContent = 'Ошибка: проблемы с сетью!';
                          } else {
                              console.log(`Ошибка: ${error.message}`);
                            };
                        });
                    };
                  };
                } else {
                    throw new Error(ERR);
                  };
          } else {
              throw new Error(ERR);
            };
        })
        .catch((error) => {
          if (error.message === 'Failed to fetch') {
            console.log('Ошибка: проблемы с сетью!');
          } else {
              console.log(`Ошибка: ${error.message}`);
            };
        });
    };

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
    let workArr = [];
    let sortArr = [];
    let methods = {
      async toRequestClient(clientItem) {
        return await fetch(`${URL}${clientItem.id}`)
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
      async toDeleteClient(clientItem) {
        return await fetch(`${URL}${clientItem.id}`, {
          method: 'DELETE',
        });
      },
    };

    // Загрузка таблицы
    await fetch(URL)
      .then(async (resp) => {
        if (resp) {
          if (resp.status === 404) {
            throw new Error(ERR);
          } else if (resp.status === 500) {
              throw new Error('Сервер не отвечает!');
            } else if (resp.status === 200) {
                let clientsList = await resp.json();
                workArr = [...clientsList];
                sortArr = [...clientsList];
                tableView(tbody, workArr, sort(sortArr, 'id', false), methods);
              } else {
                  throw new Error(ERR);
                };
        } else {
            throw new Error(ERR);
          };
      })
      .catch((error) => {
        document.querySelector('.clients__add-btn').disabled = true;
        document.querySelector('.header__search').setAttribute('disabled', 'disabled');
        document.querySelectorAll('.table__th-btn').forEach((el) => {
          el.setAttribute('disabled', 'disabled');
        });
        if (tbody.querySelector('.table__loading-img')) {
          tbody.querySelector('.table__loading-img').remove();
          if (error.message === 'Failed to fetch') {
            tbody.querySelector('.table__td_default').textContent = 'Ошибка: проблемы с сетью!';
            console.log('Ошибка: проблемы с сетью!');
          } else {
              tbody.querySelector('.table__td_default').textContent = `Ошибка: ${error.message}`;
              console.log(`Ошибка: ${error.message}`);
            };
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
            if (error.message === 'Failed to fetch') {
              col.textContent = 'Ошибка: проблемы с сетью!';
              console.log('Ошибка: проблемы с сетью!');
            } else {
                col.textContent = `Ошибка: ${error.message}`;
                console.log(`Ошибка: ${error.message}`);
              };
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
        document.querySelectorAll('.contact__value').forEach((el) => {
          el.oninput = () => {
            el.classList.remove('dialog__input_invalid');
          };
        });
        document.querySelectorAll('.wrap-new__contact').forEach((el) => {
          el.querySelector('input').classList.remove('dialog__input_invalid');
        });
        addClientBtn.disabled = true;
        let loadingIcon = document.querySelector('.button-new__loading');
        loadingIcon.classList.remove('hidden');
        document.querySelector('.dialog__errors_new').textContent = '';
        inputName.disabled = true;
        inputSurname.disabled = true; 
        inputLastName.disabled = true;
        let addContactBtn = document.querySelector('.wrap-new__add-contact');
        addContactBtn.disabled = true;
        document.querySelectorAll('.contact__value').forEach((el) => {
          el.disabled = true;
        });
        if (validation('new')) {
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
          await fetch(URL, {
            method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(dataNewClient),
            })
            .finally(() => {
              addClientBtn.disabled = false;
              loadingIcon.classList.add('hidden');
              inputName.disabled = false;
              inputSurname.disabled = false; 
              inputLastName.disabled = false;
              addContactBtn.disabled = false;
              document.querySelectorAll('.contact__value').forEach((el) => {
                el.disabled = false;
              });
            })
            .then(async (resp) => {
              if (resp) {
                let errorElement = document.querySelector('.dialog__errors_new');
                if (resp.status === 500) {
                  errorElement.textContent = 'Ошибка: сервер не отвечает';
                  throw new Error('Сервер не отвечает!');
                } else if (resp.status === 422) {
                    errorElement.textContent = 'Ошибка: \n';
                    let respOfErrors = await resp.json();
                    let arrOfErrors = respOfErrors.errors;
                    arrOfErrors.forEach((elem) => {
                      switch (elem.field) {
                        case 'name':
                          inputName.classList.add('dialog__input_invalid');
                          errorElement.textContent = errorElement.textContent + elem.message + '; ';
                          console.log(elem.message);
                          break;
                        case 'surname':
                          inputSurname.classList.add('dialog__input_invalid');
                          errorElement.textContent = errorElement.textContent + elem.message + '; ';
                          console.log(elem.message);
                          break;
                        case 'contacts':
                          let arrElementsOfContacts = document.querySelectorAll('.wrap-new__contact');
                          if (arrElementsOfContacts.length) {
                            for (let i = 0; i < arrElementsOfContacts.length; i++) {
                              if (!arrElementsOfContacts[i].querySelector('input').value) {
                                arrElementsOfContacts[i].querySelector('input').classList.add('dialog__input_invalid');
                              };
                            };
                          };
                          errorElement.textContent = errorElement.textContent + elem.message + '; ';
                          console.log(elem.message);
                          break;
                      };
                    });
                    throw new Error('Ошибка валидации!');
                  } else if (resp.status === 200 || resp.status === 201) {
                      let newClient = await resp.json();
                      workArr.push(newClient);
                      sortArr.splice(0);
                      sortArr = [...workArr];
                      tableView(tbody, workArr, sort(sortArr, 'id', false), methods);
                      addClientWindowClose();
                    } else {
                        throw new Error(ERR);
                      };
              } else {
                  throw new Error(ERR);
                };      
            })
            .catch((error) => {
              let errorElement = document.querySelector('.dialog__errors_new');
              if (error.message === 'Failed to fetch') {
                errorElement.textContent = 'Ошибка: проблемы с сетью!';
                console.log('Ошибка: проблемы с сетью!');
              } else {
                  errorElement.textContent = `Ошибка: ${error.message}`;
                  console.log(`Ошибка: ${error.message}`);
                };
            });
        } else {
            addClientBtn.disabled = false;
            loadingIcon.classList.add('hidden');
            inputName.disabled = false;
            inputSurname.disabled = false; 
            inputLastName.disabled = false;
            addContactBtn.disabled = false;
            document.querySelectorAll('.contact__value').forEach((el) => {
              el.disabled = false;
            });
          };
      };
    };

    // Сортировка
    let sortFields = document.querySelectorAll('.table__th-btn');
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