// ================================
// CONFIGURACIÓN RÁPIDA DEL NEGOCIO
// ================================
const BUSINESS_CONFIG = {
  name: 'Seguridad & Redes',
  phoneDisplay: '00 0000 0000',
  // WhatsApp en formato internacional SIN +, espacios o guiones. Ejemplo México: 5217221234567
  whatsapp: '5210000000000',
  serviceArea: 'Área de cobertura: personalizable'
};

const $ = (selector, parent = document) => parent.querySelector(selector);
const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];

// Loader
window.addEventListener('load', () => {
  setTimeout(() => $('#loader')?.classList.add('is-hidden'), 550);
});

// Año y datos del negocio
$('#year').textContent = new Date().getFullYear();
$('#phoneText').textContent = BUSINESS_CONFIG.phoneDisplay;
$('#footerPhone').textContent = BUSINESS_CONFIG.phoneDisplay;
$('#serviceArea').textContent = BUSINESS_CONFIG.serviceArea;

const whatsappBase = `https://wa.me/${BUSINESS_CONFIG.whatsapp}`;
const phoneHref = `tel:${BUSINESS_CONFIG.phoneDisplay.replace(/\D/g, '')}`;
$('#phoneLink').href = phoneHref;
$('#footerPhone').href = phoneHref;
['whatsappLink','footerWhatsapp','floatingWhatsapp'].forEach(id => {
  const el = document.getElementById(id);
  if (el) el.href = `${whatsappBase}?text=${encodeURIComponent('Hola, me gustaría solicitar una cotización.')}`;
});

// Header al hacer scroll
const header = $('.site-header');
const updateHeader = () => header?.classList.toggle('is-scrolled', scrollY > 25);
updateHeader();
addEventListener('scroll', updateHeader, { passive: true });

// Menú móvil
const navToggle = $('#navToggle');
const navLinks = $('#navLinks');
navToggle?.addEventListener('click', () => {
  const open = navLinks.classList.toggle('is-open');
  navToggle.setAttribute('aria-expanded', open);
  document.body.classList.toggle('menu-open', open);
});
$$('#navLinks > a').forEach(a => a.addEventListener('click', () => {
  navLinks.classList.remove('is-open');
  document.body.classList.remove('menu-open');
  navToggle?.setAttribute('aria-expanded', 'false');
}));
$('.nav__mega-trigger')?.addEventListener('click', () => {
  if (innerWidth <= 1040) $('.nav__mega-wrap').classList.toggle('is-open');
});
$$('.mega-card').forEach(a => a.addEventListener('click', () => {
  if (innerWidth <= 1040) {
    navLinks.classList.remove('is-open');
    document.body.classList.remove('menu-open');
  }
}));

// Animaciones de entrada
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.13, rootMargin: '0px 0px -35px' });
$$('.reveal').forEach(el => revealObserver.observe(el));

// Cursor personalizado + microinteracción de hover
if (matchMedia('(hover:hover) and (pointer:fine)').matches) {
  const dot = $('.cursor--dot');
  const ring = $('.cursor--ring');
  let mx = innerWidth / 2, my = innerHeight / 2, rx = mx, ry = my;
  addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; dot.style.left = `${mx}px`; dot.style.top = `${my}px`; });
  const animateCursor = () => {
    rx += (mx - rx) * .14; ry += (my - ry) * .14;
    ring.style.left = `${rx}px`; ring.style.top = `${ry}px`;
    requestAnimationFrame(animateCursor);
  };
  animateCursor();
  $$('a,button,.tilt-card,input,select,textarea').forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('is-hover'));
    el.addEventListener('mouseleave', () => ring.classList.remove('is-hover'));
  });
}

// Botones magnéticos
$$('.magnetic').forEach(el => {
  el.addEventListener('mousemove', e => {
    if (innerWidth <= 1040) return;
    const r = el.getBoundingClientRect();
    const x = e.clientX - r.left - r.width/2;
    const y = e.clientY - r.top - r.height/2;
    el.style.transform = `translate(${x*.12}px,${y*.16}px)`;
  });
  el.addEventListener('mouseleave', () => el.style.transform = '');
});

// 3D tilt + brillo que sigue al mouse
$$('[data-tilt]').forEach(card => {
  card.addEventListener('mousemove', e => {
    if (innerWidth <= 1040 || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const r = card.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    const max = Number(card.dataset.tilt || 6);
    const ry = (px - .5) * max;
    const rx = (.5 - py) * max;
    card.style.transform = `perspective(1100px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-2px)`;
    card.style.setProperty('--mx', `${px*100}%`);
    card.style.setProperty('--my', `${py*100}%`);
  });
  card.addEventListener('mouseleave', () => card.style.transform = '');
});

// Parallax suave del hero
addEventListener('mousemove', e => {
  if (innerWidth <= 1040 || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const visual = $('#heroVisual');
  if (!visual) return;
  const x = (e.clientX / innerWidth - .5) * 12;
  const y = (e.clientY / innerHeight - .5) * 8;
  visual.style.translate = `${x}px ${y}px`;
}, { passive:true });

// Sección interactiva: lugares donde instalar cámaras
const placementData = {
  hogar: {
    title:'HOGAR · PROPUESTA CCTV', count:'4 cámaras',
    rooms:['ACCESO','COCHERA','PATIO','INTERIOR'],
    points:[[12,13],[78,16],[24,72],[70,70]],
    details:[['Accesos principales','Identificación de personas y vehículos.'],['Perímetro','Prevención de intrusiones y puntos ciegos.'],['Áreas críticas','Supervisión donde realmente importa.']]
  },
  comercio: {
    title:'COMERCIO · PROPUESTA CCTV', count:'5 cámaras',
    rooms:['ENTRADA','CAJA','PISO DE VENTA','ALMACÉN'],
    points:[[11,14],[62,20],[20,67],[77,68]],
    details:[['Entrada y salida','Registro de clientes y accesos.'],['Caja / mostrador','Mayor control en operaciones sensibles.'],['Inventario','Supervisión de almacén y mercancía.']]
  },
  restaurante: {
    title:'RESTAURANTE · PROPUESTA CCTV', count:'6 cámaras',
    rooms:['ACCESO','CAJA','COCINA','TERRAZA'],
    points:[[9,16],[65,18],[17,72],[76,72]],
    details:[['Acceso y recepción','Control de entradas y afluencia.'],['Caja','Supervisión de cobros y operaciones.'],['Cocina y terraza','Seguimiento de áreas operativas.']]
  },
  escuela: {
    title:'ESCUELA · PROPUESTA CCTV', count:'8 cámaras',
    rooms:['ACCESO','PATIO','PASILLO','ESTACIONAMIENTO'],
    points:[[10,14],[72,17],[23,74],[78,72]],
    details:[['Accesos','Registro de entradas y salidas.'],['Patios y pasillos','Cobertura de circulación y áreas comunes.'],['Estacionamiento','Supervisión de vehículos y perímetro.']]
  },
  oficina: {
    title:'OFICINA · PROPUESTA CCTV', count:'5 cámaras',
    rooms:['RECEPCIÓN','ACCESO','ÁREA DE TRABAJO','ARCHIVO'],
    points:[[12,16],[76,15],[19,71],[74,72]],
    details:[['Recepción','Registro de visitantes y proveedores.'],['Accesos internos','Control de zonas restringidas.'],['Áreas sensibles','Protección de equipos y documentación.']]
  },
  bodega: {
    title:'BODEGA · PROPUESTA CCTV', count:'8+ cámaras',
    rooms:['ACCESO','ANDÉN','ALMACÉN','PERÍMETRO'],
    points:[[10,12],[79,17],[20,75],[78,75]],
    details:[['Andenes','Supervisión de carga y descarga.'],['Pasillos de almacén','Cobertura de mercancía y recorridos.'],['Perímetro','Detección temprana en exterior.']]
  }
};

function updatePlacement(key){
  const data = placementData[key];
  if(!data) return;
  $('#floorTitle').textContent = data.title;
  $('#cameraCount').textContent = data.count;
  $$('.room').forEach((room,i) => room.textContent = data.rooms[i]);
  $$('.camera-point').forEach((point,i) => {
    const [x,y] = data.points[i];
    point.style.left = `${x}%`; point.style.top = `${y}%`; point.style.right = 'auto'; point.style.bottom = 'auto';
  });
  $('#placementDetail').innerHTML = data.details.map((d,i)=>`<div><span>0${i+1}</span><p><strong>${d[0]}</strong><small>${d[1]}</small></p></div>`).join('');
  // feedback visual corto
  const floor = $('#floorGrid');
  floor.animate([{opacity:.55,transform:'scale(.99)'},{opacity:1,transform:'scale(1)'}],{duration:320,easing:'ease-out'});
}
$$('.location-tab').forEach(tab => tab.addEventListener('click', () => {
  $$('.location-tab').forEach(t => t.classList.remove('is-active'));
  tab.classList.add('is-active');
  updatePlacement(tab.dataset.place);
}));

// FAQ
$$('.accordion__item button').forEach(button => button.addEventListener('click', () => {
  const item = button.closest('.accordion__item');
  const open = item.classList.contains('is-open');
  $$('.accordion__item').forEach(el => el.classList.remove('is-open'));
  if(!open) item.classList.add('is-open');
}));

// Formulario -> WhatsApp
$('#quoteForm')?.addEventListener('submit', e => {
  e.preventDefault();
  const data = new FormData(e.currentTarget);
  const text = [
    `Hola, soy ${data.get('name')}.`,
    `Me interesa cotizar: ${data.get('service')}.`,
    `Tipo de inmueble: ${data.get('property')}.`,
    data.get('message') ? `Detalles: ${data.get('message')}` : ''
  ].filter(Boolean).join('\n');
  window.open(`${whatsappBase}?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
});

// Fondo animado con partículas / nodos de red
const canvas = $('#bgCanvas');
const ctx = canvas.getContext('2d');
let particles = [];
let dpr = Math.min(devicePixelRatio || 1, 2);
function resizeCanvas(){
  canvas.width = innerWidth*dpr; canvas.height = innerHeight*dpr;
  canvas.style.width = innerWidth+'px'; canvas.style.height = innerHeight+'px';
  ctx.setTransform(dpr,0,0,dpr,0,0);
  const count = innerWidth < 700 ? 26 : 48;
  particles = Array.from({length:count},()=>({x:Math.random()*innerWidth,y:Math.random()*innerHeight,vx:(Math.random()-.5)*.13,vy:(Math.random()-.5)*.13,r:Math.random()*1.4+.4}));
}
function drawCanvas(){
  ctx.clearRect(0,0,innerWidth,innerHeight);
  ctx.fillStyle='rgba(95,190,255,.45)';
  particles.forEach((p,i)=>{
    p.x+=p.vx;p.y+=p.vy;
    if(p.x<0||p.x>innerWidth)p.vx*=-1;if(p.y<0||p.y>innerHeight)p.vy*=-1;
    ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fill();
    for(let j=i+1;j<particles.length;j++){
      const q=particles[j],dx=p.x-q.x,dy=p.y-q.y,dist=Math.hypot(dx,dy);
      if(dist<125){ctx.strokeStyle=`rgba(75,166,220,${(1-dist/125)*.08})`;ctx.lineWidth=.5;ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(q.x,q.y);ctx.stroke();}
    }
  });
  requestAnimationFrame(drawCanvas);
}
resizeCanvas(); drawCanvas();
addEventListener('resize', resizeCanvas);
