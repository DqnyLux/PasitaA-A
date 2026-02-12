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
const YOUTUBE_VIDEO_ID = "Y2Vnjmb2gFs"; 

const heartTrigger = document.getElementById('heart-trigger');
const heartPath = document.getElementById('heart-path');
const instruction = document.querySelector('.click-instruction');
const canvas = document.getElementById('treeCanvas');
const ctx = canvas.getContext('2d');
const treeWrapper = document.getElementById('tree-wrapper');
const textPanel = document.getElementById('textPanel');
const typewriterContent = document.getElementById('typewriter-content');

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

// --- EFECTO DESTELLOS AL TOCAR (NUEVO) ---
document.addEventListener('mousemove', createSparkle);
document.addEventListener('touchstart', createSparkle);

function createSparkle(e) {
    if (!isAnimating) return; // Solo activa después del inicio
    
    // Obtener coordenadas (mouse o touch)
    let x = e.clientX;
    let y = e.clientY;
    if (e.touches && e.touches.length > 0) {
        x = e.touches[0].clientX;
        y = e.touches[0].clientY;
    }

    const sparkle = document.createElement('div');
    sparkle.classList.add('touch-particle');
    sparkle.style.left = x + 'px';
    sparkle.style.top = y + 'px';
    sparkle.style.backgroundColor = heartColors[Math.floor(Math.random() * heartColors.length)];
    document.body.appendChild(sparkle);

    setTimeout(() => { sparkle.remove(); }, 1000);
}


// --- CLIC INICIAL ---
heartTrigger.addEventListener('click', () => {
    if(isAnimating) return;
    isAnimating = true;
    instruction.style.opacity = 0;
    
    if (player && player.playVideo) player.playVideo();

    heartPath.setAttribute('d', 'M12,2c-5,0-9,4-9,9c0,5,9,13,9,13s9-8,9-13C21,6,17,2,12,2z');
    heartPath.style.fill = "#8d6e63";

    setTimeout(() => {
        heartTrigger.classList.add('falling');
        setTimeout(() => {
            drawResponsiveTree();
        }, 700);
    }, 500);
});

// --- ÁRBOL ---
function drawResponsiveTree() {
    const startX = canvas.width / 2;
    const startY = canvas.height;
    
    const trunkHeight = canvas.height * 0.35; 
    const trunkTopY = startY - trunkHeight;
    const trunkWidth = Math.max(10, Math.min(20, canvas.width * 0.04)); 

    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.quadraticCurveTo(startX + (trunkWidth/3), startY - trunkHeight / 2, startX, trunkTopY);
    ctx.strokeStyle = "#5d4037";
    ctx.lineWidth = trunkWidth;
    ctx.lineCap = "round";
    ctx.stroke();

    setTimeout(() => {
        let h = trunkHeight * 0.7;
        growSubBranches(startX, startY - h, h*0.4, -Math.PI/2 - 0.7, trunkWidth*0.7, 3);
        growSubBranches(startX, startY - h, h*0.4, -Math.PI/2 + 0.7, trunkWidth*0.7, 3);
    }, 200);

    setTimeout(() => {
        let h = trunkHeight * 0.9;
        growSubBranches(startX, startY - h, h*0.3, -Math.PI/2 - 0.4, trunkWidth*0.6, 3);
        growSubBranches(startX, startY - h, h*0.3, -Math.PI/2 + 0.4, trunkWidth*0.6, 3);
    }, 400);

    setTimeout(() => {
        growSubBranches(startX, trunkTopY, trunkHeight*0.25, -Math.PI/2 - 0.2, trunkWidth*0.5, 3);
        growSubBranches(startX, trunkTopY, trunkHeight*0.25, -Math.PI/2 + 0.2, trunkWidth*0.5, 3);
    }, 600);

    setTimeout(() => {
        if(isAnimating) generateDenseHearts(trunkTopY);
    }, 1500);
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
        growSubBranches(endX, endY, len*0.5, angle - 0.4, width*0.7, depth - 1);
        growSubBranches(endX, endY, len*0.5, angle + 0.4, width*0.7, depth - 1);
    }, 100);
}

function generateDenseHearts(trunkTopY) {
    const centerX = canvas.width / 2;
    const centerY = trunkTopY - (canvas.height * 0.1); 
    const scale = Math.min(canvas.width, canvas.height) * 0.025; 
    const totalLeaves = 900; 

    let count = 0;
    const interval = setInterval(() => {
        if (count >= totalLeaves) {
            clearInterval(interval);
            setTimeout(startSequenceAndInfiniteFall, 1000);
            return;
        }
        for(let i=0; i<5; i++) {
            const pos = getHeartPosition(centerX, centerY, scale);
            createFixedLeaf(pos.x, pos.y, centerY);
            count++;
        }
    }, 1);
}

function getHeartPosition(centerX, centerY, scale) {
    let t = Math.random() * Math.PI * 2;
    let r = Math.sqrt(Math.random());
    let x = 16 * Math.pow(Math.sin(t), 3);
    let y = -(13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t));
    return { 
        x: centerX + (x * scale * r) + (Math.random() * 10 - 5), 
        y: centerY + (y * scale * r) + (Math.random() * 10 - 5) 
    };
}

function createFixedLeaf(x, y, centerY) {
    const el = document.createElement('div');
    el.classList.add('flower'); el.innerHTML = '❤';
    el.style.left = x + 'px'; el.style.top = y + 'px';
    el.style.color = heartColors[Math.floor(Math.random() * heartColors.length)];
    let size = Math.random() * 10 + 5; 
    if (y > centerY + (canvas.height*0.15)) size *= 0.6; 
    el.style.setProperty('--size', `${size}px`);
    const rot = Math.random()*60 - 30;
    el.style.transform = `translate(-50%, -50%) rotate(${rot}deg)`;
    treeWrapper.appendChild(el);
    leavesArray.push({el, x, y});
    requestAnimationFrame(() => el.classList.add('bloom'));
}

function startSequenceAndInfiniteFall() {
    setInterval(createInfiniteFallingHeart, 200);

    setTimeout(() => {
        if (window.innerWidth > 768) {
             treeWrapper.classList.add('move-wrapper-right');
        } else {
             treeWrapper.classList.add('blur-tree');
        }
        
        showPhotos();

        setTimeout(() => {
            textPanel.classList.add('show');
            setTimeout(() => {
                 typeWriterReal(MENSAJE_HTML, typewriterContent);
            }, 500);
        }, 1500);
        
    }, 1000);
}

// --- FOTOS CON ZOOM MEJORADO ---
function showPhotos() {
    const photos = document.querySelectorAll('.polaroid');
    photos.forEach((p, index) => {
        setTimeout(() => p.classList.add('show'), index * 600);
        
        // Evento Click/Touch
        p.addEventListener('click', function(e) {
            e.stopPropagation();
            
            const isZoomed = this.classList.contains('zoomed');
            
            // Resetear todas
            photos.forEach(ph => ph.classList.remove('zoomed'));
            
            // Si no estaba zoomeada, hacer zoom
            if (!isZoomed) {
                this.classList.add('zoomed');
                
                // Auto-cerrar a los 4 segundos
                setTimeout(() => {
                    this.classList.remove('zoomed');
                }, 4000);
            }
        });
    });
    
    // Cerrar si tocas fuera
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.polaroid')) {
            photos.forEach(ph => ph.classList.remove('zoomed'));
        }
    });
}

function typeWriterReal(html, element) {
    element.innerHTML = "";
    let i = 0;
    function type() {
        if (i < html.length) {
            let char = html.charAt(i);
            if (char === "<") {
                let tag = "";
                while (html.charAt(i) !== ">" && i < html.length) { tag += html.charAt(i); i++; }
                tag += ">"; i++; element.innerHTML += tag; type();
            } else {
                element.innerHTML += char; i++; setTimeout(type, 50);
            }
        } else {
            document.getElementById('timer').classList.remove('hidden');
            startTimer();
        }
    }
    type();
}

function createInfiniteFallingHeart() {
    const centerX = canvas.width / 2;
    const trunkHeight = canvas.height * 0.35;
    const trunkTopY = canvas.height - trunkHeight;
    const centerY = trunkTopY - (canvas.height * 0.1);
    const scale = Math.min(canvas.width, canvas.height) * 0.025;

    const pos = getHeartPosition(centerX, centerY, scale);
    const el = document.createElement('div');
    el.classList.add('infinite-flower'); el.innerHTML = '❤';
    el.style.setProperty('--start-x', pos.x + 'px');
    el.style.setProperty('--start-y', pos.y + 'px');
    el.style.left = pos.x + 'px'; el.style.top = pos.y + 'px';
    el.style.color = heartColors[Math.floor(Math.random() * heartColors.length)];
    const size = Math.random() * 8 + 4;
    el.style.setProperty('--size', `${size}px`);
    treeWrapper.appendChild(el);
    setTimeout(() => { el.remove(); }, 6000);
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