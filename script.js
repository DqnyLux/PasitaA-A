// --- CONFIGURACIÓN ---
const FECHA_INICIO = new Date("2023-08-23"); 

// TU NUEVO MENSAJE (Formateado)
const MENSAJE_HTML = `
<h1>Hola Angélica, mi amor, mi vida, mi todo</h1>

<p>Sé que ya no somos pareja y que me volviste a terminar.</p>

<p>Pero bueno, ahora solo quiero decirte que lamento haberte enamorado y no vivir cerca para apoyarte y darte un abrazo todos los días.</p>

<p>Perdón por todo, gracias por todo.</p>

<p><strong>Perdón por darte tan poco.</strong></p>
`;

const heartColors = ['#d32f2f', '#c2185b', '#e91e63', '#ff4081', '#f48fb1', '#ffcdd2'];
const YOUTUBE_VIDEO_ID = "2Y4zvxK0wYM"; 

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
    const trunkWidth = Math.max(8, Math.min(18, canvas.width * 0.04)); 

    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.quadraticCurveTo(startX + (trunkWidth/3), startY - trunkHeight / 2, startX, trunkTopY);
    ctx.strokeStyle = "#5d4037"; ctx.lineWidth = trunkWidth; ctx.lineCap = "round"; ctx.stroke();

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
        for(let i=0; i<5; i++) { 
            let t = Math.random() * Math.PI * 2;
            let r = Math.sqrt(Math.random());
            let x = 16 * Math.pow(Math.sin(t), 3);
            let y = -(13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t));
            
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
    showPhotos();
    setTimeout(() => {
        textPanel.classList.add('show');
        typeWriterReal(MENSAJE_HTML, typewriterContent);
    }, 1500);

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

// --- LÓGICA DE FOTOS ---
function showPhotos() {
    const photos = document.querySelectorAll('.polaroid');
    photos.forEach((p, index) => {
        setTimeout(() => p.classList.add('show'), index * 600);
        
        p.addEventListener('click', function(e) {
            e.stopPropagation(); 
            const isZoomed = this.classList.contains('zoomed');
            
            photos.forEach(ph => ph.classList.remove('zoomed'));
            document.body.classList.remove('overlay-active');
            
            if (!isZoomed) {
                this.classList.add('zoomed');
                document.body.classList.add('overlay-active'); 
            }
        });
    });
    
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.polaroid')) {
            photos.forEach(ph => ph.classList.remove('zoomed'));
            document.body.classList.remove('overlay-active');
        }
    });
}

// --- MÁQUINA DE ESCRIBIR HTML ---
function typeWriterReal(html, el) {
    el.innerHTML = ""; let i = 0;
    
    function getNextTag(startIndex) {
        let tag = "";
        for (let j = startIndex; j < html.length; j++) {
            tag += html.charAt(j);
            if (html.charAt(j) === ">") break;
        }
        return tag;
    }

    function type() {
        if (i < html.length) {
            let char = html.charAt(i);
            if (char === "<") {
                let tag = getNextTag(i);
                el.innerHTML += tag;
                i += tag.length;
                type(); 
            } else {
                el.innerHTML += char;
                i++;
                setTimeout(type, Math.random() * 20 + 10); 
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