// Shared DOM helpers and the city picker used by both pages.

function el(tag, className, text) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
}

function initCityUI() {
  const button = document.getElementById('city-button');
  const label = document.getElementById('city-label');
  const dialog = document.getElementById('city-dialog');
  const closeButton = document.getElementById('city-dialog-close');
  const optionList = document.getElementById('city-options');
  if (!button || !label || !dialog || !optionList) return;

  const optionElements = new Map();

  for (const city of CITIES) {
    const item = el('li');
    const option = el('label', 'city-option');
    const input = document.createElement('input');
    input.type = 'radio';
    input.name = 'city';
    input.value = city.id;
    const name = el('span', 'city-option-name', city.name);
    const check = el('i', 'fa fa-check city-option-check');
    check.setAttribute('aria-hidden', 'true');

    option.append(input, name, check);
    item.appendChild(option);
    optionList.appendChild(item);
    optionElements.set(city.id, { input, option });
  }

  function syncCity(city) {
    label.textContent = city.name;
    for (const [cityId, entry] of optionElements) {
      const isSelected = cityId === city.id;
      entry.input.checked = isSelected;
      entry.option.classList.toggle('is-selected', isSelected);
    }
  }

  optionList.addEventListener('change', (event) => {
    if (event.target instanceof HTMLInputElement) {
      setSelectedCity(event.target.value);
    }
  });

  optionList.addEventListener('click', (event) => {
    if (event.target instanceof HTMLInputElement) {
      dialog.close();
    }
  });

  button.addEventListener('click', () => dialog.showModal());
  if (closeButton) closeButton.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });

  syncCity(getSelectedCity());
  onCityChange(syncCity);
}
