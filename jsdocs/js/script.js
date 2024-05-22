const createRequestBtn = document.getElementById('createRequestBtn');
const modal = document.getElementById('modal');
const closeBtn = document.querySelector('.close');
const requestForm = document.getElementById('requestForm');
const tableContainer = document.querySelector("#requestsTable");
const submitRequestBtn = document.getElementById('submitRequestBtn');
const editRequestBtn = document.getElementById('editRequestBtn');
const selectStatus = document.querySelector("#select_status");
const selectContainer = document.querySelector("#select_container");

let options = {
  day: '2-digit',
  month: '2-digit',
  year: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
};

let formatter = new Intl.DateTimeFormat("ru-RU", options);

var data = [
  {
    model: "Iphone-10",
    faultType: "Не работает",
    info: "Не работает",
    client: "Иван Иванов",
    master: "Алексей Смирнов",
    status: "Готово",
    time_created: formatter.format(new Date())
  },
  {
    model: "Samsung A-5123",
    faultType: "Не работает дисплей",
    info: "Не работает дисплей, западает кнопка прибавления громкости",
    client: "Петр Петров",
    master: "Владимир Кузнецов",
    status: "Готово",
    time_created: formatter.format(new Date())
  },
];

// Обработчик клика по кнопке создания новой заявки
createRequestBtn.addEventListener('click', () => {
  selectContainer.classList.add("disabled");
  modal.style.display = 'block';
  submitRequestBtn.style.display = 'block';
  editRequestBtn.style.display = 'none';
  requestForm.reset();
});

// Обработчик клика по кнопке закрытия модального окна
closeBtn.addEventListener('click', () => {
  modal.style.display = 'none';
});

// Обработчик отправки формы заявки
requestForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const deviceModel = document.getElementById('deviceModel').value;
  const faultType = document.getElementById('faultType').value;
  const orderInfo = document.getElementById('orderInfo').value;
  const clientName = document.getElementById('clientName').value;
  const masterName = document.getElementById('masterName').value;

  data.push({
    model: deviceModel,
    faultType: faultType,
    info: orderInfo,
    client: clientName,
    master: masterName,
    status: "В работе",
    time_created: formatter.format(new Date())
  });

  renderTable();
  modal.style.display = 'none';
});

// Функция для отрисовки таблицы с заявками
const renderTable = () => {
  while (tableContainer.firstChild) {
    tableContainer.removeChild(tableContainer.firstChild);
  }

  let doneElements = [];
  let notDoneElements = [];

  // Обход данных и формирование HTML-элементов для каждой заявки
  data.forEach((element, index) => {
    let statusStyle = null;
    if (element.status === "Ожидает") {
      statusStyle = "waiting";
    } else if (element.status === "В работе") {
      statusStyle = "wip";
    } else if (element.status === "Готово") {
      statusStyle = "done";
    }

    const htmlElement = `
      <tr>
        <td>${index}</td>
        <td>${element.model}</td>
        <td>${element.faultType}</td>
        <td>${element.info}</td>
        <td>${element.client}</td>
        <td>${element.master}</td>
        <td class="${statusStyle}">
          ${element.status}
        </td>
        <td>${element.time_created}</td>
        <td>
          <button class="edit-btn" data-index="${index}">Редактировать</button>
        </td>
      </tr>
    `;

    if (element.status === 'Ожидает' || element.status === "В работе") {
      notDoneElements.push(htmlElement);
    } else if (element.status === 'Готово') {
      doneElements.push(htmlElement);
    }
  });

  let sortedElements = [...notDoneElements, ...doneElements];

  tableContainer.innerHTML = `
    <table id="requests">
      <thead>
        <tr>
          <th>ID</th>
          <th>Модель устройства</th>
          <th>Тип неисправности</th>
          <th>Информация об заказе</th>
          <th>Клиент</th>
          <th>Мастер</th>
          <th>Статус</th>
          <th>Время создания</th>
          <th>Действие</th>
        </tr>
      </thead>
      <tbody id="requestsBody">
        ${sortedElements.join('')}
      </tbody>
    </table>
  `;

  // Обработчики событий для кнопок редактирования
  const editButtons = document.querySelectorAll('.edit-btn');
  editButtons.forEach((button) => {
    button.addEventListener('click', (e) => {
      selectContainer.classList.remove("disabled");

      const selectedIndex = e.target.dataset.index;
      const selectedData = data[selectedIndex];
      document.getElementById('deviceModel').value = selectedData.model;
      document.getElementById('faultType').value = selectedData.faultType;
      document.getElementById('orderInfo').value = selectedData.info;
      document.getElementById('clientName').value = selectedData.client;
      document.getElementById('masterName').value = selectedData.master;

      editRequestBtn.style.display = 'block';
      editRequestBtn.dataset.index = selectedIndex;
      submitRequestBtn.style.display = 'none';
      modal.style.display = 'block';
    });
  });
};

renderTable();

// Обработчик клика по кнопке редактирования заявки
editRequestBtn.addEventListener('click', (e) => {
  const selectedIndex = e.target.dataset.index;
  const deviceModel = document.getElementById('deviceModel').value;
  const faultType = document.getElementById('faultType').value;
  const orderInfo = document.getElementById('orderInfo').value;
  const clientName = document.getElementById('clientName').value;
  const masterName = document.getElementById('masterName').value;

  data[selectedIndex].model = deviceModel;
  data[selectedIndex].faultType = faultType;
  data[selectedIndex].info = orderInfo;
  data[selectedIndex].client = clientName;
  data[selectedIndex].master = masterName;
  data[selectedIndex].status = selectStatus.value;

  renderTable();
  modal.style.display = 'none';
});