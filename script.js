let currentPage = 1; // Start auf Menü-Front

let tierZaehler = {
  Rind: 0,
  Schwein: 0,
  Huhn: 0
};

const pages = [
  ``, // Seite 0 leer
  `<h1 style="text-align:center; font-weight: normal; font-size: 2.5rem; margin-top: 180px;">Menü</h1>`,
  `<h2>Neuigkeiten</h2>
  <ul>
    <li><strong>NEU:</strong> CO₂-Zahlung </li>
    <li><strong>Event:</strong> Rind gibt 2x Punkte </li>
    <li><strong>Update:</strong> Abzeichen in Bearbeitung </li>
  </ul>`,
  `<h2>Bestellung</h2>
  <label for="dish-input">Fleischart:</label><br />
  <input id="dish-input" type="text" placeholder="in Gramm" autocomplete="off" /><br /><br />
  <button onclick="bestellungSpeichern()">Eintragen</button>
  <p id="order-msg" style="color: green; margin-top: 10px;"></p>`,
  ``, // Statistik dynamisch
  `<h2>Abzeichen</h2>
  <p>Hier erscheinen später deine Erfolge!</p>`
];

function showPage(index) {
  currentPage = index;

  const menuCard = document.querySelector('.menu-card');

  if (index === 1) {
    // Leder-Cover aktivieren
    menuCard.classList.add('leather-cover');
    document.getElementById("page-content").innerHTML = `<div style="width: 100%;">MENÜ</div>`;
  } else {
    // Leder-Cover entfernen
    menuCard.classList.remove('leather-cover');

    if (index === 4) {
      zeigeStatistik();
    } else {
      document.getElementById("page-content").innerHTML = pages[index];
    }
  }

  updateTabs();
}

function bestellungSpeichern() {
  const input = document.getElementById('dish-input');
  const msg = document.getElementById('order-msg');
  const fleisch = input.value.trim().toLowerCase();

  if (!fleisch) {
    msg.style.color = 'red';
    msg.textContent = 'Bitte gib eine Fleischart ein.';
    return;
  }

  if (fleisch === 'rind') {
    tierZaehler.Rind++;
  } else if (fleisch === 'schwein') {
    tierZaehler.Schwein++;
  } else if (fleisch === 'huhn') {
    tierZaehler.Huhn++;
  } else {
    msg.style.color = 'red';
    msg.textContent = 'Nur Rind, Schwein oder Huhn sind erlaubt.';
    return;
  }

  speichereDaten();

  msg.style.color = 'green';
  msg.textContent = `Bestellung für "${input.value.trim()}" wurde gespeichert!`;
  input.value = '';
}

function zeigeStatistik() {
  let html = `<h2>Statistik</h2>
  <p>Anzahl von dir gegessener Tiere</p>
  <ul>
    <li>Rinder: ${tierZaehler.Rind}</li>
    <li>Schweine: ${tierZaehler.Schwein}</li>
    <li>Hühner: ${tierZaehler.Huhn}</li>
  </ul>
  <button onclick="resetStatistik()" style="background-color:#c44; color:#fff; border:none; padding:8px 12px; border-radius:8px; cursor:pointer;">Statistik zurücksetzen</button>`;
  
  document.getElementById("page-content").innerHTML = html;
}

function resetStatistik() {
  if (confirm('Möchtest du die Statistik wirklich zurücksetzen?')) {
    tierZaehler = { Rind: 0, Schwein: 0, Huhn: 0 };
    speichereDaten();
    zeigeStatistik();
  }
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

  // Tabs ganz ausblenden auf Seite 1
  tabContainer.style.display = (currentPage === 1) ? 'none' : 'flex';
}

window.onload = () => {
  ladeDaten();
  showPage(currentPage);
};
