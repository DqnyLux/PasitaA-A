// --- CONFIGURACIÓN ---
const FECHA_INICIO = new Date("2023-08-23"); 
const MENSAJE_HTML = `
<h1>Para mi amor:</h1>
Como las hojas de este árbol,
mi amor por ti crece y se 
vuelve infinito.

Eres mi refugio y mi paz.
Gracias por ser tú.

<br>
<strong>¡Te Amo!</strong>
`;

const heartColors = ['#d32f2f', '#c2185b', '#e91e63', '#ff4081', '#f48fb1', '#ffcdd2'];
const YOUTUBE_VIDEO_ID = "Y2Vnjmb2gFs"; 

const heartTrigger = document.getElementById('heart-trigger');
const heartPath = document.getElementById('heart-path');
const instruction = document.querySelector('.click-instruction');
const canvas = document.getElementById('treeCanvas');
const ctx = canvas.getContext('2d');
const treeWrapper = document.getElementById('tree-wrapper');
const textPanel = document.getElementById('textPanel');
const typewriterContent = document.getElementById('typewriter-content');

// Ajustar Canvas
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas(); 

let isAnimating = false;
let leavesArray = []; 
let player; 

// --- YOUTUBE API ---
window.onYouTubeIframeAPIReady = function() {
    player = new YT.Player('player', {
        height: '1', width: '1', videoId: YOUTUBE_VIDEO_ID,
        playerVars: { 'autoplay': 0, 'controls': 0, 'loop': 1, 'playlist': YOUTUBE_VIDEO_ID, 'playsinline': 1 },
        events: { 'onReady': (e) => e.target.setVolume(70) }
    });
};

// --- CLIC INICIAL ---
heartTrigger.addEventListener('click', function(e) {
    if(isAnimating) return;
    isAnimating = true;
    instruction.style.opacity = 0;
    
    // Música Iframe Backup + API
    const musicIframe = document.createElement('iframe');
    musicIframe.setAttribute('src', `https://www.youtube.com/embed/${YOUTUBE_VIDEO_ID}?autoplay=1&loop=1&playlist=${YOUTUBE_VIDEO_ID}&controls=0&showinfo=0&autohide=1&mute=0&playsinline=1`);
    musicIframe.style.cssText = "width:1px;height:1px;opacity:0;position:absolute;";
    musicIframe.allow = "autoplay"; 
    document.body.appendChild(musicIframe);
    
    if (player && player.playVideo) player.playVideo();

    // Animación Gota
    heartPath.setAttribute('d', 'M12,2c-5,0-9,4-9,9c0,5,9,13,9,13s9-8,9-13C21,6,17,2,12,2z');
    heartPath.style.fill = "#8d6e63";

    setTimeout(() => {
        heartTrigger.classList.add('falling');
        setTimeout(() => {
            drawResponsiveTree();
        }, 700);
    }, 500);
});

// --- DIBUJAR ÁRBOL ---
function drawResponsiveTree() {
    const startX = canvas.width / 2;
    const startY = canvas.height;
    const trunkHeight = canvas.height * 0.4; 
    const trunkTopY = startY - trunkHeight;
    const trunkWidth = Math.max(8, Math.min(18, canvas.width * 0.04)); // Tronco fino

    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.quadraticCurveTo(startX + (trunkWidth/3), startY - trunkHeight / 2, startX, trunkTopY);
    ctx.strokeStyle = "#5d4037"; ctx.lineWidth = trunkWidth; ctx.lineCap = "round"; ctx.stroke();

    // Ramas rápidas
    const grow = (x, y, l, a, w, d) => {
        if(d<=0) return;
        const ex = x + l * Math.cos(a); const ey = y + l * Math.sin(a);
        ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(x, y - l*0.2, ex, ey);
        ctx.strokeStyle = "#5d4037"; ctx.lineWidth = w; ctx.stroke();
        setTimeout(() => { grow(ex, ey, l*0.6, a-0.5, w*0.7, d-1); grow(ex, ey, l*0.6, a+0.5, w*0.7, d-1); }, 100);
    };

    setTimeout(() => grow(startX, startY - trunkHeight*0.7, trunkHeight*0.25, -Math.PI/2 - 0.6, trunkWidth*0.7, 3), 200);
    setTimeout(() => grow(startX, startY - trunkHeight*0.7, trunkHeight*0.25, -Math.PI/2 + 0.6, trunkWidth*0.7, 3), 200);
    setTimeout(() => grow(startX, trunkTopY, trunkHeight*0.2, -Math.PI/2 - 0.3, trunkWidth*0.6, 3), 500);
    setTimeout(() => grow(startX, trunkTopY, trunkHeight*0.2, -Math.PI/2 + 0.3, trunkWidth*0.6, 3), 500);

    setTimeout(() => { if(isAnimating) generateHearts(trunkTopY); }, 1200);
}

function generateHearts(trunkTopY) {
    const centerX = canvas.width / 2;
    const centerY = trunkTopY - (canvas.height * 0.05);
    const scale = Math.min(canvas.width, canvas.height) * 0.025;
    let count = 0;

    const int = setInterval(() => {
        if (count >= 800) {
            clearInterval(int);
            startFinalSequence();
            return;
        }
        for(let i=0; i<8; i++) { // Muy rápido
            let t = Math.random() * Math.PI * 2;
            let r = Math.sqrt(Math.random());
            let x = 16 * Math.pow(Math.sin(t), 3);
            let y = -(13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t));
            
            // Posición final
            let fx = centerX + (x * scale * r) + (Math.random()*10-5);
            let fy = centerY + (y * scale * r) + (Math.random()*10-5);
            
            const el = document.createElement('div');
            el.classList.add('flower'); el.innerHTML = '❤';
            el.style.left = fx+'px'; el.style.top = fy+'px';
            el.style.color = heartColors[Math.floor(Math.random()*heartColors.length)];
            
            let s = Math.random()*10+5;
            if(fy > centerY + (canvas.height*0.1)) s*=0.6;
            el.style.setProperty('--size', s+'px');
            el.style.transform = `translate(-50%, -50%) rotate(${Math.random()*60-30}deg)`;
            
            treeWrapper.appendChild(el);
            requestAnimationFrame(() => el.classList.add('bloom'));
            count++;
        }
    }, 1);
}

// --- SECUENCIA FINAL ---
function startFinalSequence() {
    // 1. Mostrar Fotos
    showPhotos();

    // 2. Mostrar Texto (Retraso pequeño)
    setTimeout(() => {
        textPanel.classList.add('show');
        typeWriterReal(MENSAJE_HTML, typewriterContent);
    }, 1500);

    // 3. Caída infinita suave
    setInterval(() => {
        const el = document.createElement('div');
        el.classList.add('infinite-flower'); el.innerHTML = '❤';
        el.style.left = (Math.random()*canvas.width)+'px'; 
        el.style.top = (canvas.height*0.2)+'px';
        el.style.color = heartColors[Math.floor(Math.random()*heartColors.length)];
        el.style.setProperty('--size', (Math.random()*8+4)+'px');
        treeWrapper.appendChild(el);
        setTimeout(()=>el.remove(), 5000);
    }, 300);
}

// --- LÓGICA DE FOTOS (ZOOM SOLIDO) ---
function showPhotos() {
    const photos = document.querySelectorAll('.polaroid');
    photos.forEach((p, i) => {
        setTimeout(() => p.classList.add('show'), i * 400);

        // EVENTO DE ZOOM
        p.addEventListener('click', function(e) {
            e.stopPropagation(); // Evitar que el click cierre inmediatamente
            
            // Si ya tiene zoom, quitárselo
            if(this.classList.contains('zoomed')) {
                this.classList.remove('zoomed');
            } else {
                // Quitar zoom a otras
                photos.forEach(x => x.classList.remove('zoomed'));
                // Poner zoom a esta
                this.classList.add('zoomed');
            }
        });
    });

    // Clic fuera para cerrar
    document.addEventListener('click', (e) => {
        if(!e.target.closest('.polaroid')) {
            photos.forEach(x => x.classList.remove('zoomed'));
        }
    });
}

function typeWriterReal(html, el) {
    el.innerHTML = ""; let i = 0;
    function type() {
        if(i < html.length) {
            let c = html.charAt(i);
            if(c === "<") {
                let tag = "";
                while(html.charAt(i) !== ">") { tag += html.charAt(i); i++; }
                tag += ">"; i++; el.innerHTML += tag; type();
            } else {
                el.innerHTML += c; i++; setTimeout(type, 50);
            }
        } else {
            document.getElementById('timer').classList.remove('hidden');
            startTimer();
        }
    }
    type();
}

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