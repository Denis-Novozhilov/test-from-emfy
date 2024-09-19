/*



	Table

*/
let leads = [];
let leadsNew = [];
const leadsTable = document.querySelector('.leads');
const leadsTableTitle = document.querySelector('.leads_title');
const leadsTableHeader = document.querySelector('.leads_header');

if (leads.length === 0) {
	leadsTableHeader.classList.add('hidden');
}

const getDataFromServer = async (page = 1, limit = 3) => {
	const data = await fetch(`http://localhost:3000/api/leads?page=${page}&limit=${limit}`)
		.then((response) => response.json())
		.then((json) => {
			leadsNew = [];
			const leadsTableChildren = leadsTable.children;
			while (leadsTableChildren.length > 1) {
				leadsTable.removeChild(leadsTableChildren[1]);
			}

			leadsNew = json._embedded.leads;
			leads = [...leads, ...leadsNew];

			if (leads.length > 0) {
				leadsTableTitle.classList.add('hidden');
				leadsTableHeader.classList.remove('hidden');
				leads.forEach((lead) => {
					const row = document.createElement('div');
					row.classList.add('leads_row');
					const nameCell = document.createElement('div');
					const priceCell = document.createElement('div');
					const idCell = document.createElement('div');
					nameCell.textContent = lead.name;
					priceCell.textContent = lead.price;
					idCell.textContent = lead.id;
					row.appendChild(nameCell);
					row.appendChild(priceCell);
					row.appendChild(idCell);
					row.addEventListener('click', () => {
						openPopup(lead.id);
					});
					leadsTable.appendChild(row);
				});
			}
			return json;
		})
		.catch((error) => {
			console.error('Ошибка при запросе:', error);
		});
};

let page = 1;
let limit = 3;

const delay = (ms) => {
	return new Promise((resolve) => setTimeout(resolve, ms));
};

const getDataWithDelay = async () => {
	let page = 1;
	do {
		await getDataFromServer(page, limit);
		page++;
		await delay(1000);
	} while (leadsNew.length !== 0 && leads.length % limit === 0);
};

getDataWithDelay();

/*



	PopUp

*/
const popup = document.querySelector('.popup');
const closePopupBtn = document.querySelector('.popup_cross');
const popupContent = document.querySelector('.popup_content');
const statusContainer = document.querySelector('.svgContainer');

const formatDate = (unixTimestamp) => {
	const date = new Date(unixTimestamp * 1000);
	return date.toLocaleString();
};
const formatStatus = (unixTimestamp) => {
	const taskDate = new Date(unixTimestamp * 1000);
	const taskDateOnly = new Date(taskDate);
	taskDateOnly.setHours(0, 0, 0, 0);

	const today = new Date();
	today.setHours(0, 0, 0, 0);

	const tomorrow = new Date();
	tomorrow.setDate(today.getDate() + 1);
	tomorrow.setHours(0, 0, 0, 0);

	if (taskDateOnly < today) {
		return 'Задача просрочена';
	} else if (taskDateOnly.getTime() === today.getTime()) {
		return 'Задача сегодня';
	} else if (taskDateOnly >= tomorrow) {
		return 'Задача завтра или позже';
	}
};

const closePopup = () => {
	popup.classList.add('hidden');
};
const openPopup = (id) => {
	const [lead] = leads.filter((el) => el.id === id);
	popupContent.innerHTML = '';
	statusContainer.innerHTML = '';

	if (lead) {
		const LeadName = document.createElement('pre');
		const LeadID = document.createElement('pre');
		const LeadPrice = document.createElement('pre');
		const LeadResponsible = document.createElement('pre');
		const LeadCreatedAt = document.createElement('pre');
		const LeadClosestTaskAt = document.createElement('pre');
		const LeadClosestTaskStatus = document.createElement('pre');
		LeadName.textContent = `Название сделки:\n${lead.name}\n `;
		LeadID.textContent = `id сделки:\n${lead.id}\n `;
		LeadPrice.textContent = `Цена:\n${lead.price}\n `;
		LeadResponsible.textContent = `ID ответственного:\n${lead.responsible_user_id}\n `;
		LeadCreatedAt.textContent = `Сделка создана:\n${formatDate(lead.created_at)}\n `;
		LeadClosestTaskAt.textContent = `Ближайшая задача:\n${formatDate(lead.closest_task_at)}\n `;
		LeadClosestTaskStatus.textContent = `Статус задачи:\n${formatStatus(lead.closest_task_at)}\n `;
		popupContent.appendChild(LeadName);
		popupContent.appendChild(LeadID);
		popupContent.appendChild(LeadPrice);
		popupContent.appendChild(LeadResponsible);
		popupContent.appendChild(LeadCreatedAt);
		popupContent.appendChild(LeadClosestTaskAt);
		popupContent.appendChild(LeadClosestTaskStatus);

		const svgNamespace = 'http://www.w3.org/2000/svg';
		const svgElement = document.createElementNS(svgNamespace, 'svg');
		svgElement.setAttribute('width', '20');
		svgElement.setAttribute('height', '20');
		const circle = document.createElementNS(svgNamespace, 'circle');
		circle.setAttribute('cx', '10');
		circle.setAttribute('cy', '10');
		circle.setAttribute('r', '10');
		switch (formatStatus(lead.closest_task_at)) {
			case 'Задача сегодня':
				circle.setAttribute('class', 'green');
				break;
			case 'Задача просрочена':
				circle.setAttribute('class', 'red');
				break;
			case 'Задача завтра или позже':
				circle.setAttribute('class', 'yellow');
				break;

			default:
				circle.setAttribute('class', 'red');
				break;
		}
		svgElement.appendChild(circle);
		statusContainer.appendChild(svgElement);
	}
	popup.classList.remove('hidden');
};
closePopupBtn.addEventListener('click', closePopup);

document.addEventListener('keydown', function (event) {
	if (event.key === 'Escape' || event.key === 'Esc') {
		closePopup();
	}
});
