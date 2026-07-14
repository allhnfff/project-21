    let products = [];
let enriched = [];

// =====================
// CRUD
// =====================
let editId = null;

const btnTambah = document.getElementById("btnTambah");

    // =====================
    // HELPERS
    // =====================
    const formatRp = (s) => String(s).trim();
    const normalize = (txt) => (txt || "").toLowerCase().trim();

    const guessCategory = (title, desc) => {
      const t = normalize(title + " " + desc);
      if (/(netflix|youtube|viu|wetv|iqiyi|prime|vidio|hbo|max|movie|drama|loklok|youku|wibuku|bstation|dramabox)/.test(t)) return "streaming";
      if (/(spotify|apple music)/.test(t)) return "music";
      if (/(canva|capcut|alight|picsart|lightroom|meitu|design|joki|ppt|logo|banner|poster)/.test(t)) return "editing";
      if (/(chatgpt|gemini|ai|veo)/.test(t)) return "ai";
      if (/(microsoft|365|zoom|getcontact)/.test(t)) return "tools";
      return "other";
    };

const minPriceValue = (prices) => {

    if (typeof prices === "string") {

        try {
            prices = JSON.parse(prices);
        } catch {
            return 0;
        }

    }

    if (!Array.isArray(prices))
        return 0;

    let min = Infinity;

    for (const item of prices) {

        if (!Array.isArray(item)) continue;

        const clean = String(item[1]).replace(/[^\d]/g, "");

        if (!clean) continue;

        min = Math.min(min, Number(clean));

    }

    return min === Infinity ? 0 : min;

};

async function loadProducts() {
    try {
        const response = await fetch("/api/products");
        products = await response.json();

        enriched = products.map((p) => ({
            ...p,
            id: p.id,
            cat: guessCategory(p.title, p.description),
            min: minPriceValue(p.prices),
            featured: /canva|netflix|chatgpt|youtube|capcut|dramabox/i.test(p.title)
        }));

        renderChips("all");
        apply();
    } catch (err) {
        console.error("Gagal mengambil produk:", err);
    }
}
    // =====================
    // UI REFERENCES
    // =====================
    const grid = document.getElementById("grid");
    const empty = document.getElementById("empty");
    const q = document.getElementById("q");
    const clearQ = document.getElementById("clearQ");
    const cat = document.getElementById("cat");
    const sort = document.getElementById("sort");
    const chips = document.getElementById("chips");

    // Modal
    const modal = document.getElementById("modal");
    const crudModal = document.getElementById("crudModal");

const saveProduct = document.getElementById("saveProduct");

const closeModalCrud = document.getElementById("closeModal");

const titleInput = document.getElementById("title");

const descriptionInput = document.getElementById("description");

const logoInput = document.getElementById("logo");

const pricesInput = document.getElementById("prices");

    const mClose = document.getElementById("mClose");
    const mTitle = document.getElementById("mTitle");
    const mName = document.getElementById("mName");
    const mDesc = document.getElementById("mDesc");
    const mPrices = document.getElementById("mPrices");
    const mVisual = document.getElementById("mVisual");
    const mOrderAdmin = document.getElementById("mOrderAdmin");
    const mOrderBot = document.getElementById("mOrderBot");
    const mCopy = document.getElementById("mCopy");

    // Topbar copy WA
    const btnCopyWA = document.getElementById("btnCopyWA");

    // Mobile nav
    const burger = document.getElementById("burger");
    const mnav = document.getElementById("mnav");

    burger.addEventListener("click", () => {
      mnav.classList.toggle("active");
      burger.innerHTML = mnav.classList.contains("active")
        ? '<i class="fa-solid fa-xmark"></i>'
        : '<i class="fa-solid fa-bars"></i>';
    });

    // Set links (nav buttons)
    const botLink = `https://wa.me/${WA_BOT}?text=${encodeURIComponent("LIST")}`;
    const adminNavLink = `https://wa.me/${WA_ORDER_ADMIN}`;

    document.getElementById("btnAdminNav").href = adminNavLink;
    document.getElementById("btnBotNav").href = botLink;
    document.getElementById("btnAdminMnav").href = adminNavLink;
    document.getElementById("btnBotMnav").href = botLink;
    document.getElementById("btnBotHero").href = botLink;

    // Chips
    const chipDefs = [
      { key: "all", label: "Semua", icon: "fa-border-all" },
      { key: "streaming", label: "Streaming", icon: "fa-film" },
      { key: "music", label: "Music", icon: "fa-music" },
      { key: "editing", label: "Editing/Design", icon: "fa-pen-nib" },
      { key: "ai", label: "AI", icon: "fa-wand-magic-sparkles" },
      { key: "tools", label: "Tools", icon: "fa-screwdriver-wrench" },
      { key: "other", label: "Lainnya", icon: "fa-ellipsis" }
    ];

    function renderChips(active = "all"){
      chips.innerHTML = chipDefs.map(c => `
        <button class="chip ${c.key === active ? "active" : ""}" data-chip="${c.key}">
          <i class="fa-solid ${c.icon}"></i> ${c.label}
        </button>
      `).join("");
      chips.querySelectorAll(".chip").forEach(btn => {
        btn.addEventListener("click", () => {
          const k = btn.getAttribute("data-chip");
          cat.value = k;
          renderChips(k);
          apply();
        });
      });
    }

    function cardTemplate(p){
      const badge = p.featured ? `<span class="tag"><i class="fa-solid fa-fire"></i> Best Seller</span>` : "";

      const orderText = `Halo, saya mau order ${p.title}. Paket yang saya pilih: (tulis paket).`;
      const waAdmin = `https://wa.me/${WA_ORDER_ADMIN}?text=${encodeURIComponent(orderText)}`;

      // Bot: default "LIST" sesuai alur bot kamu
      const waBot = `https://wa.me/${WA_BOT}?text=${encodeURIComponent("LIST")}`;

let prices = p.prices;

if (typeof prices === "string") {
    try {
        prices = JSON.parse(prices);
    } catch {
        prices = [];
    }
}

if (!Array.isArray(prices)) {
    prices = [];
}

const rows = prices.slice(0, 4).map(pr => `
    <div class="price-row">
        <small>${pr[0]}</small>
        <b>Rp ${formatRp(pr[1])}</b>
    </div>
`).join("");

      const img = p.logo
        ? `<img class="logo" src="${p.logo}" alt="${p.title}" loading="lazy" onerror="this.replaceWith((() => { const d=document.createElement('div'); d.className='fallback'; d.innerHTML='<i class=\\'fa-solid fa-box\\'></i>'; return d; })())">`
        : `<div class="fallback"><i class="fa-solid fa-box"></i></div>`;

      return `
        <article class="card" data-id="${p.id}">
          <div class="card-top">
            ${badge}
            ${img}
          </div>
          <div class="card-body">
            <h3 class="title">${p.title}</h3>
            <p class="desc">${p.description}</p>

            <div class="pricebox">
              ${rows}
            </div>

            <div class="card-actions">
<button class="btn" data-detail="${p.id}">
    <i class="fa-solid fa-circle-info"></i> Detail
</button>

<button class="btn edit-btn" onclick="editProduct(${p.id})">
    <i class="fa-solid fa-pen"></i> Edit
</button>

<button class="btn delete-btn" onclick="deleteProduct(${p.id})">
    <i class="fa-solid fa-trash"></i> Hapus
</button>

<a class="btn whatsapp" href="${waAdmin}" target="_blank" rel="noopener">
    <i class="fa-brands fa-whatsapp"></i> Admin
</a>

<a class="btn bot" href="${waBot}" target="_blank" rel="noopener">
    <i class="fa-brands fa-whatsapp"></i> Bot
</a>
            </div>
          </div>
        </article>
      `;
    }

    function render(list){
      grid.innerHTML = list.map(cardTemplate).join("");
      empty.classList.toggle("active", list.length === 0);

      grid.querySelectorAll("[data-detail]").forEach(btn => {
        btn.addEventListener("click", () => {
          const id = Number(btn.getAttribute("data-detail"));
          openModal(id);
        });
      });
    }

    function openModal(id){
      const p = enriched.find(x => x.id === id);
      if(!p) return;

      const orderText = `Halo, saya mau order ${p.title}. Paket yang saya pilih: (tulis paket).`;
      const waAdmin = `https://wa.me/${WA_ORDER_ADMIN}?text=${encodeURIComponent(orderText)}`;
      const waBot = `https://wa.me/${WA_BOT}?text=${encodeURIComponent("LIST")}`;

      mTitle.textContent = "Detail Produk";
      mName.textContent = p.title;
      mDesc.textContent = p.description;

      if (p.logo) {
        mVisual.innerHTML = `<img src="${p.logo}" alt="${p.title}" onerror="this.remove();">`;
      } else {
        mVisual.innerHTML = `<div class="fallback"><i class="fa-solid fa-box"></i></div>`;
      }

let modalPrices = p.prices;

if (typeof modalPrices === "string") {
    try {
        modalPrices = JSON.parse(modalPrices);
    } catch {
        modalPrices = [];
    }
}

if (!Array.isArray(modalPrices)) {
    modalPrices = [];
}

mPrices.innerHTML = modalPrices.map(pr => `
    <div class="price-row">
        <small>${pr[0]}</small>
        <b>Rp ${formatRp(pr[1])}</b>
    </div>
`).join("");

      mOrderAdmin.setAttribute("href", waAdmin);
      mOrderBot.setAttribute("href", waBot);

mCopy.onclick = async () => {
    try {

        await navigator.clipboard.writeText(orderText);

        mCopy.innerHTML = '<i class="fa-solid fa-check"></i> Tersalin';

        setTimeout(() => {
            mCopy.innerHTML = '<i class="fa-solid fa-copy"></i> Salin Text Order';
        }, 1400);

    } catch (e) {

        Swal.fire({
            icon: "error",
            title: "Gagal menyalin",
            text: "Silakan salin teks order secara manual."
        });

    }
};

      modal.classList.add("active");
      modal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    }

    function closeModal(){
      modal.classList.remove("active");
      modal.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    }

    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeModal();
    });
    mClose.addEventListener("click", closeModal);
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modal.classList.contains("active")) closeModal();
    });

    function apply(){
      const term = normalize(q.value);
      const catVal = cat.value;

      let list = enriched.filter(p => {
 let searchPrices = p.prices;

if (typeof searchPrices === "string") {
    try {
        searchPrices = JSON.parse(searchPrices);
    } catch {
        searchPrices = [];
    }
}

if (!Array.isArray(searchPrices)) {
    searchPrices = [];
}

const hay = normalize(
    p.title +
    " " +
    p.description +
    " " +
    searchPrices.flat().join(" ")
);
        const matchesTerm = term ? hay.includes(term) : true;
        const matchesCat = (catVal === "all") ? true : p.cat === catVal;
        return matchesTerm && matchesCat;
      });

      switch(sort.value){
        case "az": list.sort((a,b) => a.title.localeCompare(b.title)); break;
        case "za": list.sort((a,b) => b.title.localeCompare(a.title)); break;
        case "low": list.sort((a,b) => a.min - b.min); break;
        case "high": list.sort((a,b) => b.min - a.min); break;
        default:
          list.sort((a,b) => (Number(b.featured)-Number(a.featured)) || (a.min - b.min));
      }

      render(list);
    }

    q.addEventListener("input", () => apply());
    cat.addEventListener("change", () => {
      renderChips(cat.value);
      apply();
    });
    sort.addEventListener("change", apply);

    clearQ.addEventListener("click", () => {
      q.value = "";
      q.focus();
      apply();
    });

btnCopyWA?.addEventListener("click", async () => {

    const text = "+" + WA_ORDER_ADMIN;

    try {

        await navigator.clipboard.writeText(text);

        btnCopyWA.innerHTML = '<i class="fa-solid fa-check"></i> Tersalin';

        setTimeout(() => {
            btnCopyWA.innerHTML = '<i class="fa-brands fa-whatsapp"></i> Salin Nomor Admin';
        }, 1400);

    } catch (e) {

        Swal.fire({
            icon: "error",
            title: "Gagal menyalin",
            text: "Nomor WhatsApp Admin tidak bisa disalin."
        });

    }

});

    // Init
    loadProducts();

    // =====================
// CRUD MODAL
// =====================

btnTambah.addEventListener("click", () => {

    editId = null;

    titleInput.value = "";
    descriptionInput.value = "";
    logoInput.value = "";
    pricesInput.value = "";

    crudModal.classList.add("active");

});

closeModalCrud.addEventListener("click", () => {

    crudModal.classList.remove("active");

});

// =====================
// SIMPAN PRODUK (CREATE & UPDATE)
// =====================

saveProduct.addEventListener("click", async () => {

  saveProduct.disabled = true;
saveProduct.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Menyimpan...';

    const data = {
        title: titleInput.value,
        description: descriptionInput.value,
        logo: logoInput.value,
        prices: JSON.parse(pricesInput.value)
    };

    let url = "/api/products";
    let method = "POST";

    if (editId !== null) {
        url = `/api/products/${editId}`;
        method = "PUT";
    }

    try {

        const response = await fetch(url, {
            method: method,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error("Gagal menyimpan data");
        }

        crudModal.classList.remove("active");

        editId = null;

        loadProducts();

        Swal.fire({
    icon: "success",
    title: "Berhasil!",
    text: "Produk berhasil disimpan.",
    timer: 1800,
    showConfirmButton: false
});

  saveProduct.disabled = false;
saveProduct.innerHTML = "Simpan";

} catch (err) {

    console.error(err);

    Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Terjadi kesalahan!"
    });

    saveProduct.disabled = false;
    saveProduct.innerHTML = "Simpan";

}

});

// =====================
// EDIT PRODUCT
// =====================

async function editProduct(id) {

    try {

        const response = await fetch("/api/products");
        const products = await response.json();

        const product = products.find(p => p.id == id);

if (!product) {
    Swal.fire({
        icon: "warning",
        title: "Produk tidak ditemukan",
        text: "Data produk tidak berhasil dimuat."
    });
    return;
}

        editId = id;

        titleInput.value = product.title;
        descriptionInput.value = product.description;
        logoInput.value = product.logo;
        pricesInput.value = JSON.stringify(product.prices);

        crudModal.classList.add("active");

    } catch (err) {

        console.error(err);

        Swal.fire({
    icon: "error",
    title: "Gagal",
    text: "Gagal mengambil data produk!"
});

    }

}

// =====================
// DELETE PRODUCT
// =====================

async function deleteProduct(id) {

const result = await Swal.fire({
    title: "Yakin ingin menghapus?",
    text: "Produk yang dihapus tidak dapat dikembalikan.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "🗑 Ya, Hapus",
    cancelButtonText: "Batal"
});

if (!result.isConfirmed) return;

    try {

const response = await fetch(`/api/products/${id}`, {
    method: "DELETE"
});

        if (!response.ok) {
            throw new Error("Gagal menghapus produk");
        }

        loadProducts();

        Swal.fire({
    icon: "success",
    title: "Berhasil!",
    text: "Produk berhasil dihapus.",
    timer: 1800,
    showConfirmButton: false
});

    } catch (err) {

        console.error(err);

        Swal.fire({
    icon: "error",
    title: "Gagal",
    text: "Gagal menghapus produk!"
});

    }

}