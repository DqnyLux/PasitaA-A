// --- CONFIGURACIÓN ---
const FECHA_INICIO = new Date("2023-08-23"); 
const MENSAJE_HTML = `
<h1>Para mi amor:</h1>
Como las hojas de este árbol,
mi amor por ti es infinito.

Aunque el tiempo pase y el
viento sople, mis raíces
siempre estarán contigo.

Gracias por hacerme feliz.
<br>
<strong>¡Te Amo!</strong>
`;

const heartColors = ['#d32f2f', '#c2185b', '#e91e63', '#ff4081', '#f48fb1', '#ffcdd2'];
const YOUTUBE_VIDEO_ID = "Y2Vnjmb2gFs"; // Tu canción

// --- REFERENCIAS ---
const heartTrigger = document.getElementById('heart-trigger');
const heartPath = document.getElementById('heart-path');
const instruction = document.querySelector('.click-instruction');
const canvas = document.getElementById('treeCanvas');
const ctx = canvas.getContext('2d');
const treeWrapper = document.getElementById('tree-wrapper');
const textPanel = document.getElementById('textPanel');
const typewriterContent = document.getElementById('typewriter-content');

canvas.width = 900;
canvas.height = 600;

let isAnimating = false;
let leavesArray = []; 
let player; 

// --- CARGA DE YOUTUBE ---
window.onYouTubeIframeAPIReady = function() {
    player = new YT.Player('player', {
        height: '100', // Tamaño pequeño pero suficiente para que cargue
        width: '100',
        videoId: YOUTUBE_VIDEO_ID,
        playerVars: {
            'autoplay': 0,
            'controls': 0,
            'loop': 1,
            'playlist': YOUTUBE_VIDEO_ID 
        },
        events: {
            'onReady': onPlayerReady
        }
    });
};

function onPlayerReady(event) {
    // Listo para reproducir cuando se le ordene
    event.target.setVolume(70);
}

// --- 1. CLIC INICIAL ---
heartTrigger.addEventListener('click', () => {
    if(isAnimating) return;
    isAnimating = true;
    instruction.style.opacity = 0;
    
    // --- REPRODUCIR SONIDO ---
    if (player && typeof player.playVideo === 'function') {
        player.playVideo();
    }

    // Transformar a Gota
    heartPath.setAttribute('d', 'M12,2c-5,0-9,4-9,9c0,5,9,13,9,13s9-8,9-13C21,6,17,2,12,2z');
    heartPath.style.fill = "#8d6e63";

    setTimeout(() => {
        heartTrigger.classList.add('falling');
        setTimeout(() => {
            drawTallTree();
        }, 700);
    }, 500);
});


// --- 2. ÁRBOL (RAMAS ALTAS) ---
function drawTallTree() {
    const startX = canvas.width / 2;
    const startY = canvas.height;
    
    const trunkHeight = 220; 
    const trunkTopY = startY - trunkHeight;
    const trunkWidth = 20; 

    // A. Tronco Principal
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.quadraticCurveTo(startX + 8, startY - trunkHeight / 2, startX, trunkTopY);
    ctx.strokeStyle = "#5d4037";
    ctx.lineWidth = trunkWidth;
    ctx.lineCap = "round";
    ctx.stroke();

    // B. Ramas (Más altas)
    setTimeout(() => {
        // Ramas bajas (Posición -150)
        growSubBranches(startX, startY - 150, 100, -Math.PI/2 - 0.7, trunkWidth*0.6, 3);
        growSubBranches(startX, startY - 150, 100, -Math.PI/2 + 0.7, trunkWidth*0.6, 3);
    }, 200);

    setTimeout(() => {
        // Ramas medias (Posición -195)
        growSubBranches(startX, startY - 195, 90, -Math.PI/2 - 0.4, trunkWidth*0.55, 3);
        growSubBranches(startX, startY - 195, 90, -Math.PI/2 + 0.4, trunkWidth*0.55, 3);
    }, 400);

    setTimeout(() => {
        // Ramas superiores
        growSubBranches(startX, trunkTopY + 10, 70, -Math.PI/2 - 0.2, trunkWidth*0.5, 3);
        growSubBranches(startX, trunkTopY + 10, 70, -Math.PI/2 + 0.2, trunkWidth*0.5, 3);
    }, 600);

    // C. Generar corazones
    setTimeout(() => {
        if(isAnimating) generateDenseHearts();
    }, 2000);
}

function growSubBranches(x, y, len, angle, width, depth) {
    if (depth <= 0) return;

    const endX = x + len * Math.cos(angle);
    const endY = y + len * Math.sin(angle);

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.quadraticCurveTo(x, y - len*0.2, endX, endY);
    ctx.strokeStyle = "#5d4037";
    ctx.lineWidth = width;
    ctx.lineCap = "round";
    ctx.stroke();

    setTimeout(() => {
        const subLen = len * 0.65;
        const subWidth = width * 0.7;
        growSubBranches(endX, endY, subLen, angle - 0.35, subWidth, depth - 1);
        growSubBranches(endX, endY, subLen, angle + 0.35, subWidth, depth - 1);
    }, 150);
}


// --- 3. GENERAR CORAZONES ---
function generateDenseHearts() {
    const centerX = canvas.width / 2;
    const centerY = canvas.height - 220 - 50; 
    const scale = 11.5; 
    const totalLeaves = 800; 

    let count = 0;
    const interval = setInterval(() => {
        if (count >= totalLeaves) {
            clearInterval(interval);
            setTimeout(startSequenceAndInfiniteFall, 1500);
            return;
        }
        const pos = getHeartPosition(centerX, centerY, scale);
        createFixedLeaf(pos.x, pos.y, centerY);
        count++;
    }, 2);
}

function getHeartPosition(centerX, centerY, scale) {
    let t = Math.random() * Math.PI * 2;
    let r = Math.sqrt(Math.random());
    let x = 16 * Math.pow(Math.sin(t), 3);
    let y = -(13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t));
    
    let finalX = centerX + (x * scale * r) + (Math.random() * 10 - 5);
    let finalY = centerY + (y * scale * r) + (Math.random() * 10 - 5);
    return { x: finalX, y: finalY };
}

function createFixedLeaf(x, y, centerY) {
    const el = document.createElement('div');
    el.classList.add('flower'); 
    el.innerHTML = '❤';
    el.style.left = x + 'px';
    el.style.top = y + 'px';
    el.style.color = heartColors[Math.floor(Math.random() * heartColors.length)];
    
    let size = 9 + Math.random() * 11;
    if (y > centerY + 50) {
        size = size * 0.6; 
    } else if (y > centerY + 20) {
        size = size * 0.8; 
    }

    el.style.setProperty('--size', `${size}px`);
    const rot = Math.random()*60 - 30;
    el.style.transform = `translate(-50%, -50%) rotate(${rot}deg)`;

    treeWrapper.appendChild(el);
    leavesArray.push({el, x, y});
    requestAnimationFrame(() => el.classList.add('bloom'));
}


// --- 4. SECUENCIA Y CAÍDA DIAGONAL ---
function startSequenceAndInfiniteFall() {
    setInterval(() => {
        createInfiniteFallingHeart();
    }, 200); 

    setTimeout(() => {
        treeWrapper.classList.add('move-wrapper-right');
        
        setTimeout(() => {
            textPanel.classList.add('show');
            typewriterContent.innerHTML = MENSAJE_HTML;
            
            setTimeout(() => {
                 document.getElementById('timer').classList.remove('hidden');
                 startTimer();
            }, 1000);
            
        }, 1200);
        
    }, 1000);
}

function createInfiniteFallingHeart() {
    const centerX = canvas.width / 2;
    const centerY = canvas.height - 220 - 50; 
    const scale = 11.5;

    const pos = getHeartPosition(centerX, centerY, scale);

    const el = document.createElement('div');
    el.classList.add('infinite-flower'); 
    el.innerHTML = '❤';
    el.style.setProperty('--start-x', pos.x + 'px');
    el.style.setProperty('--start-y', pos.y + 'px');
    
    el.style.left = pos.x + 'px';
    el.style.top = pos.y + 'px';

    el.style.color = heartColors[Math.floor(Math.random() * heartColors.length)];
    const size = 8 + Math.random() * 10;
    el.style.setProperty('--size', `${size}px`);

    treeWrapper.appendChild(el);

    setTimeout(() => { el.remove(); }, 6000);
}


// --- 5. TIMER ---
function startTimer() {
    const t = document.getElementById('timer');
    setInterval(() => {
        const diff = new Date() - FECHA_INICIO;
        const d = Math.floor(diff / (1000*60*60*24));
        const h = Math.floor((diff / (1000*60*60)) % 24);
        const m = Math.floor((diff / 1000/60) % 60);
        const s = Math.floor((diff / 1000)%60);
        t.innerText = `Juntos: ${d}d ${h}h ${m}m ${s}s`;
    }, 1000);
}