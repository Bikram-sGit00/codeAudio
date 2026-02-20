let currentSong = new Audio();
let songs;
let vlClick = null;
let currFolder;

function MTS(seconds) {

    const minutes = Math.floor(seconds / 60);
    const remainingTime = Math.floor(seconds % 60);

    const formatedMinutes = String(minutes).padStart(2, '0');
    const formatedTime = String(remainingTime).padStart(2, '0');

    return `${formatedMinutes}:${formatedTime}`;
}

async function getSongs(folder) {
    currFolder = folder;
    let a = await fetch(`http://127.0.0.1:5500/${folder}/`);
    let res = await a.text();
    let div = document.createElement("div");
    div.innerHTML = res;
    let a_s = div.getElementsByTagName("a");
    songs = [];
    for (let index = 0; index < a_s.length; index++) {
        const element = a_s[index];
        if (element.href.endsWith(".opus") || element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1]);
        }
    }
    let songUl = document.querySelector('.songList').getElementsByTagName('ul')[0];
    songUl.innerHTML = '';
    for (const song of songs) {

        songUl.innerHTML = songUl.innerHTML + `
    <li>
     <img id="test" class="border thumb" src="IMG_20240512_100107.jpg" alt="" width="38px">
        <div class="info">
            <div>${song.replaceAll("%20", " ")}</div>
            <div>CodeAudio.com💫</div>
        </div>
        <div class="playnow">
            <img src="play-button.png" alt="" width="20px">
        </div>
    </li>`;

    }

    Array.from(document.querySelector('.songList').getElementsByTagName('li')).forEach(e => {
        e.addEventListener('click', element => {
            playMusic(e.querySelector('.info').firstElementChild.innerHTML.trim());
        })
    });

    return songs;
}

const playMusic = (track, pause = false) => {
    currentSong.src = `/${currFolder}/` + track;
    if (!pause) {
        currentSong.play();
    }
    document.querySelector('.songInfo').innerHTML = decodeURI(track);
    document.querySelector('.songTime').innerHTML = '00:00/00:00';
}


async function displayAlbums() {
    console.log('_orking');
    let a = await fetch(`http://127.0.0.1:5500/songs/`);
    let res = await a.text();
    let div = document.createElement('div');
    div.innerHTML = res;
    let cardContainer = document.querySelector('.cardContainer')
    let anchors = div.getElementsByTagName("a");
    let array = Array.from(anchors);
    console.log(anchors);
    for (let index = 0; index < array.length; index++) {
        const e = array[index];
        if (e.href.includes("/songs/")) {
            console.log(e.href);
            console.log(e.href.split("/").slice(-2)[1]);
            let folder = e.href.split("/").slice(-2)[1];
            let a = await fetch(`http://127.0.0.1:5500/songs/${folder}/info.json`);
            let res = await a.json();
            console.log(res);

            cardContainer.innerHTML = cardContainer.innerHTML +
                `<div data-folder="${folder}" class="card">
            <div class="play">
                <img src="play-button.png" alt="">
            </div>
            <img src="/songs/${folder}/cover.jpg" alt="">
            <h3>${res.title}</h3>
            <p>${res.description}</p>
        </div>`
        }

    }

    Array.from(document.getElementsByClassName('card')).forEach(e => {
        e.addEventListener('click', async item => {
            console.log('hey!');
            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`);
            playMusic(songs[0]);

        });

    });


}

async function main() {
    await getSongs("songs/LoveBites");
    playMusic(songs[0], true);

    displayAlbums();



    play.addEventListener('click', () => {
        if (currentSong.paused) {
            currentSong.play();
            play.src = 'play-button.png';
        }
        else {
            currentSong.pause();
            play.src = 'pause.png';
        }
    });

    prev.addEventListener('click', () => {
        let index = songs.indexOf(currentSong.src.split('/songs/')[1]);
        if (index - 1 > -1) {
            playMusic(songs[index - 1]);
        }
    });

    next.addEventListener('click', () => {
        let index = songs.indexOf(currentSong.src.split('/songs/')[1]);
        if (index + 1 > length) {
            playMusic(songs[index + 1]);                                               //PROBLEM!

        }
    });


    currentSong.addEventListener('timeupdate', () => {
        document.querySelector('.songTime').innerHTML = `${MTS(currentSong.currentTime)}/${MTS(currentSong.duration)}`
        document.querySelector('.circle').style.left = ((currentSong.currentTime) / (currentSong.duration)) * 100 + '%';
    });

    document.querySelector('.seekbar'), addEventListener('click', (e) => {
        let persent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector('.circle').style.left = (persent + '%');
        currentSong.currentTime = ((currentSong.duration) * persent) / 100;

    });

    document.querySelector('#ham').addEventListener('click', () => {
        document.querySelector('.left').style.left = '0%';

    });

    document.querySelector('#close').addEventListener('click', () => {
        document.querySelector('.left').style.left = '-100%';
    });

    document.querySelector('.volume>img').addEventListener('click', (e) => {
        if (e.target.src.includes('graph-bar.png')) {
            e.target.src = e.target.src.replace('graph-bar.png', 'sound-chem.png');
            currentSong.volume = 0;
        }
        else{
            e.target.src = e.target.src.replace('sound-chem.png', 'graph-bar.png');
            currentSong.volume = 1;

        }



    })




}

main();

