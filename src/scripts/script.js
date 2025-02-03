const searchInput = document.getElementById('search-input');
const resultArtist = document.getElementById("result-artist");
const resultPlaylist = document.getElementById('result-playlist');
const buttonBack = document.querySelector('.arrow-left');
const buttonNext = document.querySelector('.arrow-right');

const lastArtists = [];
let currentIndex = -1;
let searchTimeout; // Variável para armazenar o timeout

async function requestApi(searchTerm) {
    const url = `http://localhost:3000/artists?name_like=${searchTerm}`;
    try {
        const response = await fetch(url);
        const result = await response.json();
        displayResults(result);
        console.log(result);
    } catch (error) {
        console.error('Erro ao buscar dados:', error);
    }
}

function displayResults(result) {
    resultPlaylist.classList.add("hidden");
    const artistName = document.getElementById('artist-name');
    const artistImage = document.getElementById('artist-img');

    result.forEach(element => {
        addToHistory(element); // Adiciona o artista ao histórico
        artistName.innerText = element.name;
        artistImage.src = element.urlImg;
    });

    resultArtist.classList.remove('hidden');
}

document.addEventListener('input', function () {
    const searchTerm = searchInput.value.toLowerCase();
    
    clearTimeout(searchTimeout); // Limpa o timeout anterior

    // Define um novo timeout de 500ms (meio segundo)
    searchTimeout = setTimeout(() => {
        if (searchTerm === '') {
            resultPlaylist.classList.add('hidden');
            resultArtist.classList.remove('hidden');
            return;
        }

        requestApi(searchTerm);
    }, 500);
});

buttonBack.addEventListener('click', voltar);
buttonNext.addEventListener('click', avancar);

function voltar() {
    if (currentIndex > 0) {
        currentIndex--;
        const lastArtist = lastArtists[currentIndex];

        const artistName = document.getElementById('artist-name');
        const artistImage = document.getElementById('artist-img');

        artistName.innerText = lastArtist.name;
        artistImage.src = lastArtist.urlImg;

        resultArtist.classList.remove('hidden');
        resultPlaylist.classList.add('hidden');
        searchInput.value = '';
    } else {
        console.log('Não há mais itens para voltar.');
        resultArtist.classList.add('hidden');
        resultPlaylist.classList.remove('hidden');
        searchInput.value = '';
    }
}

function avancar() {
    console.log(currentIndex);
    console.log('artistas', lastArtists.length);
    if (currentIndex < lastArtists.length - 1) {
        currentIndex++;
        const nextArtist = lastArtists[currentIndex];

        const artistName = document.getElementById('artist-name');
        const artistImage = document.getElementById('artist-img');

        artistName.innerText = nextArtist.name;
        artistImage.src = nextArtist.urlImg;

        resultArtist.classList.remove('hidden');
        resultPlaylist.classList.add('hidden');
        searchInput.value = '';
    } else {
        console.log('Não há mais itens para avançar.');
        searchInput.value = '';
    }
}

function addToHistory(artist) {
    console.log(artist);
    // Remove itens futuros do histórico se houver um novo item
    if (currentIndex < lastArtists.length - 1) {
        lastArtists.splice(currentIndex + 1);
    }

    // Adiciona novo artista e atualiza o índice atual
    lastArtists.push(artist);
    currentIndex = lastArtists.length - 1;

    console.log('Artista adicionado ao histórico:', artist);
}
