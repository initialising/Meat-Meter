let currentPage = 1;

let tierZaehler = {
  Rind: 0,
  Schwein: 0,
  Huhn: 0,
  Fisch: 0
};

const gerichte = {
  'halbes Hendl': { typ: 'Huhn', gramm: 500 },
  'Wurstbrot': { typ: 'Schwein', gramm: 100 },
  'Rindergulasch': { typ: 'Rind', gramm: 200 },
  'Thunfisch-Sandwich': { typ: 'Fisch', gramm: 150 }
};

const pages = [
  ``,
  `<h1 style="text-align:center; font-weight: normal; font-size: 2.5rem; margin-top: 180px;">Menü</h1>`,
  `<h2>Neuigkeiten</h2>
  <ul>
    <li><strong>NEU:</strong> CO₂-Zahlung </li>
    <li><strong>Event:</strong> Rind gibt 2x Punkte </li>
    <li><strong>Update:</strong> Abzeichen in Bearbeitung </li>
  </ul>`,
  `<h2>Bestellung</h2>
    <label for="menge-input">Menge in Gramm:</label><br />
  <input id="menge-input" type="number" placeholder="z. B. 250" /><br /><br />
  
  <label for="fleischart-auswahl">Fleischart:</label><br />
  <select id="fleischart-auswahl">
    <option value="">– bitte wählen –</option>
    <option value="Rind">Rind</option>
    <option value="Schwein">Schwein</option>
    <option value="Huhn">Huhn</option>
    <option value="Fisch">Fisch</option>
  </select><br /><br />
  
  <button onclick="manuelleBestellung()">Eintragen</button>

  <hr style="margin: 20px 0;" />

  <h3>Gericht wählen</h3>
  <select id="gericht-auswahl">
    <option value="">– bitte wählen –</option>
    ${Object.keys(gerichte).map(name => `<option value="${name}">${name}</option>`).join('')}
  </select>
  <button onclick="gerichtHinzufuegen()">+</button>

  <p id="order-msg" style="color: green; margin-top: 10px;"></p>`,
  ``, // Statistik kommt dynamisch
  `<h2>Abzeichen</h2>
  <p>Hier erscheinen später deine Erfolge!</p>`
];

function showPage(index) {
  currentPage = index;
  const menuCard = document.querySelector('.menu-card');

  if (index === 1) {
    menuCard.classList.add('leather-cover');
    document.getElementById("page-content").innerHTML = `
      <div class="menu-title-wrapper">
        <div class="menu-title">MENÜ</div>
      </div>
    `;
  } else {
    menuCard.classList.remove('leather-cover');
    if (index === 4) {
      zeigeStatistik();
    } else {
      document.getElementById("page-content").innerHTML = pages[index];
    }
  }

  updateTabs();
}

function manuelleBestellung() {
  const gramm = parseFloat(document.getElementById('menge-input').value);
  const typ = document.getElementById('fleischart-auswahl').value;
  const msg = document.getElementById('order-msg');

  if (!typ || isNaN(gramm) || gramm <= 0) {
    msg.style.color = 'red';
    msg.textContent = 'Bitte gib gültige Werte ein.';
    return;
  }

  const tiereProGramm = {
    Rind: 1 / 250000,
    Schwein: 1 / 60000,
    Huhn: 1 / 1500,
    Fisch: 1 / 1500
  };

  const tiere = gramm * (tiereProGramm[typ] || 0);
  if (!tierZaehler[typ]) tierZaehler[typ] = 0;
  tierZaehler[typ] += tiere;

  speichereDaten();
  msg.style.color = 'green';
  msg.textContent = `${gramm} g ${typ} gespeichert.`;
  document.getElementById('menge-input').value = '';
  document.getElementById('fleischart-auswahl').value = '';
}

function gerichtHinzufuegen() {
  const select = document.getElementById('gericht-auswahl');
  const msg = document.getElementById('order-msg');
  const gerichtName = select.value;

  if (!gerichtName || !gerichte[gerichtName]) {
    msg.style.color = 'red';
    msg.textContent = 'Bitte ein gültiges Gericht wählen.';
    return;
  }

  const { typ, gramm } = gerichte[gerichtName];
  const tiereProGramm = {
    Rind: 1 / 250000,
    Schwein: 1 / 60000,
    Huhn: 1 / 1500,
    Fisch: 1 / 1500
  };

  const tiere = gramm * (tiereProGramm[typ] || 0);
  if (!tierZaehler[typ]) tierZaehler[typ] = 0;
  tierZaehler[typ] += tiere;

  speichereDaten();
  msg.style.color = 'green';
  msg.textContent = `"${gerichtName}" wurde hinzugefügt. (${gramm} g ${typ})`;
  select.value = '';
}

function zeigeStatistik() {
  let html = `<h2>Statistik</h2>
  <p>Dein Fleischkonsum (in Tieren, gerundet):</p>
  <ul>
    <li>Rinder: ${tierZaehler.Rind.toFixed(2)}</li>
    <li>Schweine: ${tierZaehler.Schwein.toFixed(2)}</li>
    <li>Hühner: ${tierZaehler.Huhn.toFixed(2)}</li>
    <li>Fische: ${tierZaehler.Fisch.toFixed(2)}</li>
  </ul>
    
  document.getElementById("page-content").innerHTML = html;
}

function ladeDaten() {
  const data = localStorage.getItem('tierZaehler');
  if (data) {
    tierZaehler = JSON.parse(data);
  }
}

function speichereDaten() {
  localStorage.setItem('tierZaehler', JSON.stringify(tierZaehler));
}

function nextPage() {
  if (currentPage < pages.length - 1) {
    showPage(currentPage + 1);
  }
}

function prevPage() {
  if (currentPage > 1) {
    showPage(currentPage - 1);
  }
}

function updateTabs() {
  const tabContainer = document.querySelector('.tabs');
  const tabInfos = [
    { page: 2, emoji: '📣', title: 'Neuigkeiten' },
    { page: 3, emoji: '🧾', title: 'Bestellung' },
    { page: 4, emoji: '📊', title: 'Statistik' },
    { page: 5, emoji: '🏅', title: 'Abzeichen' }
  ];

  tabContainer.innerHTML = '';
  tabInfos.forEach(tab => {
    const btn = document.createElement('button');
    btn.textContent = tab.emoji;
    btn.title = tab.title;
    btn.onclick = () => showPage(tab.page);
    if (currentPage === tab.page) btn.classList.add('active-tab');
    tabContainer.appendChild(btn);
  });

  tabContainer.style.display = (currentPage === 1) ? 'none' : 'flex';
}

window.onload = () => {
  ladeDaten();
  showPage(currentPage);
};

