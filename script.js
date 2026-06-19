/* ══ DATA ══ */
const pets = [
  {
    id:1, name:"Biscuit", type:"dog", breed:"Golden Retriever", age:"3 yrs", gender:"Male",
    status:"Available", badge:"new",
    tags:["Vaccinated","Kid-friendly","House-trained","Loves fetch"],
    img:"biscut.jpg",
    desc:"Biscuit is a sunshine-in-fur-form Golden who loves long walks, belly rubs, and stealing your socks. He's great with children and other dogs."
  },
  {
    id:2, name:"Luna", type:"cat", breed:"Domestic Shorthair", age:"2 yrs", gender:"Female",
    status:"Available", badge:"",
    tags:["Spayed","Quiet","Indoor","Lap cat"],
    img:"luna.jpg",
    desc:"Luna is a gentle, observant cat who warms up at her own pace. Once she trusts you, she'll park herself on your lap and purr for hours."
  },
  {
    id:3, name:"Peanut", type:"rabbit", breed:"Holland Lop", age:"1 yr", gender:"Male",
    status:"Available", badge:"new",
    tags:["Neutered","Litter-trained","Gentle","Apartment-friendly"],
    img:"peanut.jpg",
    desc:"Peanut is a floppy-eared charmer who loves to binky around his enclosure and munch on fresh herbs. Ideal for smaller living spaces."
  },
  {
    id:4, name:"Rio", type:"bird", breed:"Green Cheek Conure", age:"1 yr", gender:"Male",
    status:"Urgent", badge:"urgent",
    tags:["Hand-tamed","Playful","Vocal","Social"],
    img:"rio.jpg",
    desc:"Rio needs a home fast. He's a little shy but tends to get clingy after getting comfartable."
  },
  {
    id:5, name:"Mochi", type:"cat", breed:"Scottish Fold", age:"4 yrs", gender:"Female",
    status:"Available", badge:"",
    tags:["Spayed","Quiet","Senior-friendly","Cuddly"],
    img:"mochi.jpg",
    desc:"Mochi is the definition of a cozy companion. She spends her days curled up in sunbeams and her evenings nudging you for chin scratches."
  },
  {
    id:6, name:"Tank", type:"dog", breed:"American Bulldog", age:"5 yrs", gender:"Male",
    status:"Available", badge:"",
    tags:["Vaccinated","Calm","House-trained","Only pet"],
    img:"tank.jpg",
    desc:"Despite his tough name, Tank is a big softie who loves slow walks and napping beside you on the couch. Prefers to be an only pet."
  },
  {
    id:7, name:"Hazel", type:"rabbit", breed:"Lionhead", age:"8 mo", gender:"Female",
    status:"Urgent", badge:"urgent",
    tags:["Spayed","Litter-trained","Fluffy","Energetic"],
    img:"Hazel.jpg",
    desc:"Hazel is a fluffy ball of energy who zooms around at dusk and loves tunnels. She needs space to run and someone patient enough to earn her trust."
  },
  {
    id:8, name:"Pip", type:"small", breed:"Hamster", age:"6 mo", gender:"Female",
    status:"Available", badge:"new",
    tags:["Nocturnal","Easy care","Kid-friendly","Caged"],
    img:"pip.jpg",
    desc:"Pip is a curious dwarf hamster who loves her wheel and tunnels. A perfect first pet or a delightful companion for a quieter household."
  }
];

let activeFilter = "all";
let searchQuery  = "";
let liked        = new Set();

/* ══ RENDER ══ */
function renderPets() {
  const grid = document.getElementById("petGrid");
  const none = document.getElementById("no-results");
  const q    = searchQuery.toLowerCase();

  const filtered = pets.filter(p => {
    const matchType = activeFilter === "all" || p.type === activeFilter;
    const matchSearch = !q || p.name.toLowerCase().includes(q)
      || p.breed.toLowerCase().includes(q)
      || p.type.toLowerCase().includes(q)
      || p.tags.some(t => t.toLowerCase().includes(q));
    return matchType && matchSearch;
  });

  if (!filtered.length) {
    grid.innerHTML = "";
    none.style.display = "block";
    return;
  }
  none.style.display = "none";

  grid.innerHTML = filtered.map((p, i) => `
    <div class="col-sm-6 col-lg-4 col-xl-3 fade-up" style="animation-delay:${i * 0.06}s">
      <div class="pet-card" onclick="openModal(${p.id})">
        <div class="pet-img-wrap">
          <img src="${p.img}" alt="${p.name}" loading="lazy"/>
          ${p.badge ? `<span class="badge-status ${p.badge}">${p.badge === 'urgent' ? 'Urgent' : 'New'}</span>` : ''}
          <button class="heart-btn ${liked.has(p.id)?'liked':''}" onclick="toggleLike(event,${p.id})">
            <i class="bi bi-heart${liked.has(p.id)?'-fill':''}"></i>
          </button>
        </div>
        <div class="pet-body">
          <div class="pet-name">${p.name}</div>
          <div class="pet-meta">${p.breed} · ${p.age} · ${p.gender}</div>
          <div class="pet-tags">${p.tags.slice(0,3).map(t=>`<span class="pet-tag">${t}</span>`).join('')}</div>
          <button class="btn-adopt">Adopt ${p.name} →</button>
        </div>
      </div>
    </div>
  `).join('');
}

function filterPets(el) {
  document.querySelectorAll('#filterPills .pill').forEach(p => p.classList.remove('active'));
  el.classList.add('active');
  activeFilter = el.dataset.filter;
  renderPets();
}

function handleSearch() {
  searchQuery = document.getElementById('searchInput').value.trim();
  renderPets();
}
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('searchInput').addEventListener('keydown', e => {
    if (e.key === 'Enter') handleSearch();
  });
  const donateModalEl = document.getElementById('donateModal');
  if (donateModalEl) {
    donateModalEl.addEventListener('hidden.bs.modal', resetDonateModal);
  }
});

function submitFosterInterest() {
  bootstrap.Modal.getInstance(document.getElementById('fosterModal')).hide();
  showToast("Thank you for your interest in fostering! We'll be in touch soon. 🐾");
}

let selectedDonateAmount = null;

function selectDonateAmount(el) {
  document.querySelectorAll('#donateAmounts .pill').forEach(p => p.classList.remove('active'));
  el.classList.add('active');
  const customInput = document.getElementById('customDonateInput');
  const submitBtn   = document.getElementById('donateSubmitBtn');

  if (el.dataset.amount === 'custom') {
    customInput.classList.remove('d-none');
    customInput.value = '';
    customInput.focus();
    selectedDonateAmount = null;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Enter a custom amount';
  } else {
    customInput.classList.add('d-none');
    selectedDonateAmount = Number(el.dataset.amount);
    submitBtn.disabled = false;
    submitBtn.textContent = `Donate $${selectedDonateAmount}`;
  }
}

function handleCustomDonateInput() {
  const val = Number(document.getElementById('customDonateInput').value);
  const submitBtn = document.getElementById('donateSubmitBtn');
  if (val > 0) {
    selectedDonateAmount = val;
    submitBtn.disabled = false;
    submitBtn.textContent = `Donate $${val}`;
  } else {
    selectedDonateAmount = null;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Enter a custom amount';
  }
}

function submitDonation() {
  if (!selectedDonateAmount) return;
  const amount = selectedDonateAmount;
  bootstrap.Modal.getInstance(document.getElementById('donateModal')).hide();
  showToast(`🐾 Thank you for your $${amount} donation! It goes straight to pets in our care.`);
}

function resetDonateModal() {
  selectedDonateAmount = null;
  document.querySelectorAll('#donateAmounts .pill').forEach(p => p.classList.remove('active'));
  const customInput = document.getElementById('customDonateInput');
  customInput.classList.add('d-none');
  customInput.value = '';
  const submitBtn = document.getElementById('donateSubmitBtn');
  submitBtn.disabled = true;
  submitBtn.textContent = 'Select an amount to donate';
}

function toggleLike(e, id) {
  e.stopPropagation();
  if (liked.has(id)) liked.delete(id); else liked.add(id);
  showToast(liked.has(id) ? '❤️ Added to your favourites!' : '💔 Removed from favourites.');
  renderPets();
}

let currentPet = null;
function openModal(id) {
  currentPet = pets.find(p => p.id === id);
  if (!currentPet) return;
  document.getElementById('modalTitle').textContent = currentPet.name;
  document.getElementById('modalImg').src   = currentPet.img;
  document.getElementById('modalImg').alt   = currentPet.name;
  document.getElementById('modalName').textContent = currentPet.name;
  document.getElementById('modalMeta').textContent = `${currentPet.breed} · ${currentPet.age} · ${currentPet.gender}`;
  document.getElementById('modalDesc').textContent = currentPet.desc;
  const badge = document.getElementById('modalBadge');
  badge.textContent = currentPet.status;
  badge.className   = 'badge ' + (currentPet.badge === 'urgent' ? 'bg-danger' : currentPet.badge === 'new' ? 'bg-warning text-dark' : 'bg-success');
  document.getElementById('modalTags').innerHTML = currentPet.tags.map(t=>`<span class="modal-tag">${t}</span>`).join('');
  new bootstrap.Modal(document.getElementById('petModal')).show();
}

function applyNow() {
  bootstrap.Modal.getInstance(document.getElementById('petModal')).hide();
  showToast(`🐾 Application for ${currentPet.name} submitted! We'll contact you within 24 hours.`);
}

function showToast(msg) {
  document.getElementById('toastMsg').textContent = msg;
  const toast = new bootstrap.Toast(document.getElementById('liveToast'), { delay: 3500 });
  toast.show();
}

renderPets();
