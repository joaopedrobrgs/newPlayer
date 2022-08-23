//FIREBASE

//PEGANDO REFERÊNCIA DO FIREBASE

const firebaseConfig = {
    apiKey: "AIzaSyDQ4RGWgyKLJ-xGZeEJQw-xHgOb7_VN9hI",
    authDomain: "projetoplayerdemusicas.firebaseapp.com",
    projectId: "projetoplayerdemusicas",
    storageBucket: "projetoplayerdemusicas.appspot.com",
    messagingSenderId: "894068788190",
    appId: "1:894068788190:web:fa4bb934ee11b55c476b4f",
    measurementId: "G-N18KDS31PS"
};

//INICIALIZANDO APP

firebase.initializeApp(firebaseConfig);

//FIREBASE_STORAGE

const storage = firebase.storage();

const audioFiles = storage.ref("/audioFiles");

const imageFiles = storage.ref("/imageFiles");

//FIREBASE_FIRESTORE

var dataBase = firebase.firestore().collection('data');

//COLOCANDO DATABASE COM TODAS AS INFORMAÇÕES DAS MUSICAS EM VARIÁVEL LOCAL

var dataLocal = [];

dataBase.onSnapshot(snapshot => {
    dataLocal = [];
    snapshot.forEach(doc => {
        dataLocal.push(doc.data());
    });
})

//CRIANDO FUNÇÃO DE CARREGAR MUSICA(NOME, ARTISTA E ARQUIVO DE 
//IMAGEM E DE AUDIO);

var index = 1;

var musicName = document.getElementById("musicName");
var artistName = document.getElementById("artistName")
var musicAlbum = document.getElementById("musicAlbum");
var musicTrack = document.getElementById("musicTrack");

loadMusic();

function loadMusic() {

    dataBase.doc('song' + index).get().then(doc => {
        musicTrack.src = doc.data().audioFile;
    })

    musicTrack.addEventListener("loadeddata", function () {
        timeBar.value = Math.floor(musicTrack.currentTime) / Math.floor(musicTrack.duration) * 100;
        totalTime.innerText = secondsInMinutes(Math.floor(musicTrack.duration));
        dataBase.doc('song' + index).get().then(doc => {
            musicName.innerText = doc.data().music;
            artistName.innerText = doc.data().artist;
            musicAlbum.src = doc.data().imageFile;
        })
    })
}

//CRIANDO FUNÇÃO DE PLAY E PAUSE NA MUSICA

var playBtn = document.getElementById("playBtn");
var pauseBtn = document.getElementById("pauseBtn");
var mainControls = document.getElementById("mainControls");

playBtn.addEventListener("click", playFunction);
pauseBtn.addEventListener("click", pauseFunction);

function playFunction() {
    musicTrack.play();
    playBtn.style.display = "none";
    pauseBtn.style.display = "inline-block";
}

function pauseFunction() {
    musicTrack.pause();
    playBtn.style.display = "inline-block";
    pauseBtn.style.display = "none";
}

//CRIANDO FUNÇÃO DE AVANÇAR PARA PROXIMA MUSICA E DE VOLTAR PARA
//MUSICA ANTERIOR

var nextMusicBtn = document.getElementById("nextMusicBtn");
var previousMusicBtn = document.getElementById("previousMusicBtn");

nextMusicBtn.addEventListener("click", nextMusicFunction);
previousMusicBtn.addEventListener("click", previousMusicFunction);

function nextMusicFunction() {
    index++;
    if (index > dataLocal.length) {
        index = 1;
    }
    loadMusic();
    playFunction();
}

function previousMusicFunction() {
    index--;
    if (index < 1) {
        index = dataLocal.length;
    }
    loadMusic();
    playFunction();
}

//CRIANDO FUNÇÃO DE PARAR MUSICA

var stopBtn = document.getElementById("stopBtn");

stopBtn.addEventListener("click", stopFunction);

function stopFunction() {
    pauseFunction();
    musicTrack.playbackRate = musicTrack.defaultPlaybackRate;
    musicTrack.currentTime = 0;
}

//CRIANDO FUNÇÃO DE AUMENTAR E DIMINUIR VELOCIDADE DA MUSICA

var increaseSpeedBtn = document.getElementById("increaseSpeedBtn");
var decreaseSpeedBtn = document.getElementById("decreaseSpeedBtn");

increaseSpeedBtn.addEventListener("click", increaseSpeedFunction);
decreaseSpeedBtn.addEventListener("click", decreaseSpeedFunction);

function increaseSpeedFunction() {
    musicTrack.playbackRate += 0.1;
}

function decreaseSpeedFunction() {
    musicTrack.playbackRate -= 0.1;
}

//CRIANDO FUNÇÃO DE AVANÇAR 10S E VOLTAR 10S NA MUSICA

var forwardBtn = document.getElementById("forwardBtn");
var backwardBtn = document.getElementById("backwardBtn");

forwardBtn.addEventListener("click", forwardFunction);
backwardBtn.addEventListener("click", backwardFunction);

function forwardFunction() {
    musicTrack.currentTime += 10;
}

function backwardFunction() {
    musicTrack.currentTime -= 10;
}

//CRIANDO FUNÇÃO DE MUDAR PARA MÚSICA ALEATÓRIA

var randomBtn = document.getElementById("randomBtn");

randomBtn.addEventListener("click", randomFunction);

function randomFunction() {
    index = Math.round(Math.random() * (dataLocal.length - 1));
    loadMusic();
    musicTrack.defaultPlaybackRate;
    playFunction();
}

//TEMPO DA MÚSICA

var actualTime = document.getElementById("actualTime");
var totalTime = document.getElementById("totalTime");
var timeBar = document.getElementById("timeBar");

musicTrack.addEventListener("timeupdate", refreshTime);

//A - FUNÇÃO DE ATUALIZAR TEMPO DA MUSICA E BARRA DE PROGRESSO

function refreshTime() {

    actualTime.innerText = secondsInMinutes(Math.floor(musicTrack.currentTime));

    //COLOQUEI DENTRO DA FUNÇÃO LOADMUSIC() PARA JÁ APARECER O TEMPO NO MOMENTO
    //EM QUE ATUALIZARMOS A PÁGINA:
    // totalTime.innerText = secondsInMinutes(Math.floor(musicTrack.duration));

    //COLOQUEI TAMBÉM DENTRO DA FUNÇÃO LOADMUSIC() PARA A BARRA JÁ FICAR POSICIONADA
    //NO INICIO ASSIM QUE CARREGARMOS A PÁGINA
    timeBar.value = Math.floor(musicTrack.currentTime) / Math.floor(musicTrack.duration) * 100;

    if (musicTrack.currentTime >= musicTrack.duration) {
        nextMusicFunction()
    }
}

//B - FUNÇÃO DE TRANSFORMAR SEGUNDOS EM MINUTOS / FORMATAR TEMPO

function secondsInMinutes(seconds) {

    var minutesField = Math.floor(seconds / 60);

    var secondsField = seconds % 60;

    if (secondsField < 10) {
        secondsField = "0" + secondsField;
    }

    return minutesField + ":" + secondsField;
}

//C - FUNÇÃO DE ALTERAR TEMPO DA MUSICA CLICANDO NA BARRA DE PROGRESSO

timeBar.addEventListener("change", changingTimeBar);

function changingTimeBar() {
    pauseFunction()
    musicTrack.currentTime = timeBar.value / timeBar.max * musicTrack.duration;
    playFunction()
}

//FUNÇÃO DE VOLUME
var volumeImgShow = document.getElementById("volumeImgShow");
var volumeImgHide = document.getElementById("volumeImgHide");
var volumeBar = document.getElementById("volumeBar");


//FUNÇÕES DE MOSTRAR E ESCONDER BARRA DE VOLUME
volumeImgShow.addEventListener("click", showVolumeBar);

function showVolumeBar() {
    volumeBar.style = "display: inline-block"
    volumeImgShow.style = "display: none";
    volumeImgHide.style = "display: inline-block";
}

volumeImgHide.addEventListener("click", hideVolumeBar);

function hideVolumeBar() {
    volumeBar.style = "display: none";
    volumeImgHide.style = "display: none";
    volumeImgShow.style = "display: inline-block";
}

//FUNÇÃO DE ALTERAR VOLUME

volumeBar.addEventListener("change", changingVolume);

function changingVolume() {
    musicTrack.volume = volumeBar.value / 100;

    if (musicTrack.volume <= 0) {
        volumeImgHide.src = "./assets/icons/mute.png";
        volumeImgShow.src = "./assets/icons/mute.png";
    }
    if (musicTrack.volume > 0) {
        volumeImgHide.src = "./assets/icons/volumeOn.png";
        volumeImgShow.src = "./assets/icons/volumeOn.png";
    }
}

//ADD NEW MUSIC
const addMusicIcon = document.getElementById('addMusicIcon');
var musicNameInput = document.getElementById('musicNameInput');
var artistNameInput = document.getElementById('artistNameInput');
var imageFileInput = document.getElementById('imageFileInput');
var audioFileInput = document.getElementById('audioFileInput');

addMusicIcon.addEventListener('click', function () {

    dataBase.doc('song' + (dataLocal.length + 1)).set({
        music: musicNameInput.value,
        artist: artistNameInput.value,
        imageFile: imageFileInput.value,
        audioFile: audioFileInput.value
    }).then(function (doc) {
        console.log('Documento inserido com sucesso:');
    }).catch(function (err) {
        console.log(err);
    })

    loadLibrary();

})

//LIVRARIA DE MUSICAS
var library = document.getElementById("libraryIn");

loadLibrary();

function loadLibrary() {

    library.innerHTML = '';

    var libraryTitle = document.createElement('h4');
    libraryTitle.id = 'libraryTitle';
    libraryTitle.innerHTML = 'LIBRARY';
    library.appendChild(libraryTitle);

    for (let i of dataLocal) {

        // library.innerHTML += "<div class='libraryContent'><h4 class='libraryMusicName'>" + i.music + "</h4>" + "<h4 style='font-weight: 400; font-style: italic;'>" + i.artist + "</h4></div>";

        //ou

        var libraryElement = document.createElement('div');
        libraryElement.classList.add('libraryContent');
        library.appendChild(libraryElement);

        var libraryMusicName = document.createElement('h4');
        libraryMusicName.classList.add('libraryMusicName');
        libraryMusicName.innerHTML = i.music;
        libraryElement.appendChild(libraryMusicName);

        var libraryArtistName = document.createElement('h4');
        libraryArtistName.classList.add('libraryArtistName');
        libraryArtistName.innerHTML = i.artist;
        libraryElement.appendChild(libraryArtistName);
    }

    var libraryContent = document.getElementsByClassName("libraryContent");

    for (let i = 0; i < libraryContent.length; i++) {
        libraryContent[i].addEventListener("click", function () {
            index = i;
            loadMusic();
            playFunction();
        })
    }

    var libraryIconOpen = document.getElementById('libraryIconOpen');
    var libraryIconClose = document.getElementById('libraryIconClose');
    const SHOWLIBRARY = 'showLibrary';
    const HIDELIBRARY = 'hideLibrary';

    libraryIconOpen.addEventListener('click', function () {
        library.classList.remove(HIDELIBRARY)
        library.classList.add(SHOWLIBRARY);
        libraryIconOpen.style.display = 'none';
        libraryIconClose.style.display = 'inline-block';
    })

    libraryIconClose.addEventListener('click', function () {
        library.classList.remove(SHOWLIBRARY);
        library.classList.add(HIDELIBRARY);
        libraryIconOpen.style.display = 'inline-block';
        libraryIconClose.style.display = 'none';
    })

}

//MENSAGENS DE DIÁLOGO
var playDialog = document.getElementById("playDialog");
var pauseDialog = document.getElementById("pauseDialog");

playBtn.addEventListener("mouseover", function () {
    playDialog.style = "display: inline-block"
});

playBtn.addEventListener("mouseout", function () {
    playDialog.style = "display: none"
});

pauseBtn.addEventListener("mouseover", function () {
    pauseDialog.style = "display: inline-block"
});

pauseBtn.addEventListener("mouseout", function () {
    pauseDialog.style = "display: none"
});

var previousMusicDialog = document.getElementById("previousMusicDialog");
var nextMusicDialog = document.getElementById("nextMusicDialog");

previousMusicBtn.addEventListener("mouseover", function () {
    previousMusicDialog.style = "display: inline-block"
});

previousMusicBtn.addEventListener("mouseout", function () {
    previousMusicDialog.style = "display: none"
});

nextMusicBtn.addEventListener("mouseover", function () {
    nextMusicDialog.style = "display: inline-block"
});

nextMusicBtn.addEventListener("mouseout", function () {
    nextMusicDialog.style = "display: none"
});

var backwardDialog = document.getElementById("backwardDialog");
var decreaseSpeedDialog = document.getElementById("decreaseSpeedDialog");
var randomDialog = document.getElementById("randomDialog");
var stopDialog = document.getElementById("stopDialog");
var volumeDialog = document.getElementById("volumeDialog");
var increaseSpeedDialog = document.getElementById("increaseSpeedDialog");
var forwardDialog = document.getElementById("forwardDialog");

backwardBtn.addEventListener("mouseover", function () {
    backwardDialog.style = "display: inline-block"
});

backwardBtn.addEventListener("mouseout", function () {
    backwardDialog.style = "display: none"
});

decreaseSpeedBtn.addEventListener("mouseover", function () {
    decreaseSpeedDialog.style = "display: inline-block"
});

decreaseSpeedBtn.addEventListener("mouseout", function () {
    decreaseSpeedDialog.style = "display: none"
});

randomBtn.addEventListener("mouseover", function () {
    randomDialog.style = "display: inline-block"
});

randomBtn.addEventListener("mouseout", function () {
    randomDialog.style = "display: none"
});

stopBtn.addEventListener("mouseover", function () {
    stopDialog.style = "display: inline-block"
});

stopBtn.addEventListener("mouseout", function () {
    stopDialog.style = "display: none"
});

volumeImgShow.addEventListener("mouseover", function () {
    volumeDialog.style = "display: inline-block"
});

volumeImgShow.addEventListener("mouseout", function () {
    volumeDialog.style = "display: none"
});

increaseSpeedBtn.addEventListener("mouseover", function () {
    increaseSpeedDialog.style = "display: inline-block"
});

increaseSpeedBtn.addEventListener("mouseout", function () {
    increaseSpeedDialog.style = "display: none"
});

forwardBtn.addEventListener("mouseover", function () {
    forwardDialog.style = "display: inline-block"
});

forwardBtn.addEventListener("mouseout", function () {
    forwardDialog.style = "display: none"
});

var openLibraryDialog = document.getElementById("openLibraryDialog");
var closeLibraryDialog = document.getElementById("closeLibraryDialog");

libraryIconOpen.addEventListener("mouseover", function () {
    openLibraryDialog.style = "display: inline-block"
});

libraryIconOpen.addEventListener("mouseout", function () {
    openLibraryDialog.style = "display: none"
});

libraryIconClose.addEventListener("mouseover", function () {
    closeLibraryDialog.style = "display: inline-block"
});

libraryIconClose.addEventListener("mouseout", function () {
    closeLibraryDialog.style = "display: none"
});












