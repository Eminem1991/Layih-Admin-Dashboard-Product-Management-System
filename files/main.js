import initialProducts from './products.js'

const STORAGE_KEY = 'admin_products'
const BASKET_KEY = 'admin_basket'
const PLACEHOLDER =
  'https://placehold.co/400x300/e2e8f0/64748b?text=M%C9%99hsul'
const BASE_CATEGORIES = [
  'Elektronika',
  'Aksessuar',
  'Mebellər',
  'Kosmetika və Baxım',
  'Geyim',
  'Kitablar',
  'İdman',
  'Digər',
]

let products = []
let selectedIds = []
let deleteIds = []
let basket = {}
let currentSort = { column: null, direction: 'asc' }

const $ = (id) => document.getElementById(id)

const productTableBody = $('productTableBody')
const adminEmptyState = $('adminEmptyState')
const selectAllCheckbox = $('selectAllCheckbox')
const bulkDeleteBtn = $('bulkDeleteBtn')
const selectedCountSpan = $('selectedCount')
const adminSearchInput = $('adminSearchInput')
const adminCategoryFilter = $('adminCategoryFilter')
const adminStatusFilter = $('adminStatusFilter')
const productModal = $('productModal')
const productForm = $('productForm')
const deleteModal = $('deleteModal')
const productList = $('productList')
const basketModal = $('basketModal')

const errorIds = {
  formTitle: 'errorTitle',
  formCategory: 'errorCategory',
  formPrice: 'errorPrice',
  formStock: 'errorStock',
}

const esc = (value) =>
  String(value ?? '').replace(
    /[&<>"']/g,
    (c) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[
        c
      ],
  )

const money = (n) =>
  `${Number(n).toLocaleString('az-AZ', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₼`

const isActive = (p) => p.status === 'active'

function normalize(p) {
  return {
    ...p,
    id: Number(p.id),
    price: Number(p.price) || 0,
    stock: Number(p.stock) || 0,
    status: p.status === 'inactive' ? 'inactive' : 'active',
  }
}

function loadProducts() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) return parsed.map(normalize)
    }
  } catch {
    localStorage.removeItem(STORAGE_KEY)
  }
  return initialProducts.map(normalize)
}

function saveToLocalStorage() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products))
}

function fillCategories() {
  const all = [
    ...new Set([
      ...BASE_CATEGORIES,
      ...products.map((p) => p.category).filter(Boolean),
    ]),
  ]
  const options = all
    .map((c) => `<option value="${esc(c)}">${esc(c)}</option>`)
    .join('')
  adminCategoryFilter.insertAdjacentHTML('beforeend', options)
  $('formCategory').insertAdjacentHTML('beforeend', options)
  $('all_categories').insertAdjacentHTML('beforeend', options)
}

function updateKPIStats() {
  const totalProducts = products.reduce((acc) => acc + 1, 0)
  const totalValue = products.reduce((acc, p) => acc + p.price * p.stock, 0)
  const outOfStock = products.reduce(
    (acc, p) => (p.stock === 0 ? acc + 1 : acc),
    0,
  )
  const categoryCount = products.reduce((acc, p) => {
    if (p.category && !acc.includes(p.category)) acc.push(p.category)
    return acc
  }, []).length

  $('statTotalProducts').textContent = totalProducts
  $('statTotalValue').textContent = money(totalValue)
  $('statOutOfStock').textContent = outOfStock
  $('statCategoryCount').textContent = categoryCount
}

function getAdminProducts() {
  let result = [...products]

  const term = adminSearchInput.value.trim().toLowerCase()
  if (term) {
    result = result.filter(
      (p) =>
        p.title.toLowerCase().includes(term) ||
        p.category.toLowerCase().includes(term) ||
        String(p.id).includes(term),
    )
  }

  if (adminCategoryFilter.value) {
    result = result.filter((p) => p.category === adminCategoryFilter.value)
  }

  if (adminStatusFilter.value) {
    result = result.filter((p) =>
      adminStatusFilter.value === 'active' ? isActive(p) : !isActive(p),
    )
  }

  if (currentSort.column) {
    const dir = currentSort.direction === 'asc' ? 1 : -1
    result.sort((a, b) => (a[currentSort.column] - b[currentSort.column]) * dir)
  }

  return result
}

function renderDashboard() {
  updateKPIStats()
  const visible = getAdminProducts()
  selectedIds = selectedIds.filter((id) => visible.some((p) => p.id === id))

  adminEmptyState.style.display = visible.length === 0 ? 'block' : 'none'

  productTableBody.innerHTML = visible
    .map(
      (p) => `
      <tr>
        <td style="text-align: center">
          <input type="checkbox" class="custom-checkbox row-checkbox" data-id="${p.id}" ${selectedIds.includes(p.id) ? 'checked' : ''} />
        </td>
        <td>
          <div class="product-cell">
            <img src="${esc(p.image || PLACEHOLDER)}" class="product-img-thumb" alt="${esc(p.title)}" />
            <div>
              <strong style="display: block">${esc(p.title)}</strong>
              <small style="color: var(--text-muted)">ID: #${p.id}</small>
            </div>
          </div>
        </td>
        <td><span class="badge badge-secondary">${esc(p.category)}</span></td>
        <td><strong>${money(p.price)}</strong></td>
        <td>
          ${
            p.stock === 0
              ? '<span class="badge badge-danger">Bitib (0)</span>'
              : `<span class="badge badge-success">${p.stock} ədəd</span>`
          }
        </td>
        <td>
          ${
            isActive(p)
              ? '<span class="badge badge-success">Aktiv</span>'
              : '<span class="badge badge-secondary">Deaktiv</span>'
          }
        </td>
        <td style="text-align: right">
          <div class="action-btns">
            <button type="button" class="btn btn-secondary btn-sm edit-btn" data-id="${p.id}">✏️ Düzəliş et</button>
            <button type="button" class="btn btn-danger btn-sm delete-btn" data-id="${p.id}">🗑️ Sil</button>
          </div>
        </td>
      </tr>`,
    )
    .join('')

  syncBasket()
  updateBulkDeleteUI()
}

function updateBulkDeleteUI() {
  const visible = getAdminProducts()
  selectAllCheckbox.checked =
    visible.length > 0 && visible.every((p) => selectedIds.includes(p.id))
  bulkDeleteBtn.style.display = selectedIds.length > 0 ? 'inline-flex' : 'none'
  selectedCountSpan.textContent = selectedIds.length
}

selectAllCheckbox.addEventListener('change', (e) => {
  selectedIds = e.target.checked ? getAdminProducts().map((p) => p.id) : []
  renderDashboard()
})

productTableBody.addEventListener('change', (e) => {
  if (!e.target.classList.contains('row-checkbox')) return
  const id = Number(e.target.dataset.id)
  selectedIds = e.target.checked
    ? [...new Set([...selectedIds, id])]
    : selectedIds.filter((item) => item !== id)
  updateBulkDeleteUI()
})

productTableBody.addEventListener('click', (e) => {
  const deleteBtn = e.target.closest('.delete-btn')
  if (deleteBtn) askDelete([Number(deleteBtn.dataset.id)])

  const editBtn = e.target.closest('.edit-btn')
  if (editBtn) openEditModal(Number(editBtn.dataset.id))
})

bulkDeleteBtn.addEventListener('click', () => askDelete([...selectedIds]))

function openModal(el) {
  el.classList.add('open')
}

function closeModal(el) {
  el.classList.remove('open')
}

function askDelete(ids) {
  deleteIds = ids
  const first = products.find((p) => p.id === ids[0])
  $('deleteText').textContent =
    ids.length === 1 && first
      ? `"${first.title}" məhsulunu silmək istədiyinizdən əminsiniz?`
      : `Seçilmiş ${ids.length} məhsulu silmək istədiyinizdən əminsiniz?`
  openModal(deleteModal)
}

$('confirmDeleteBtn').addEventListener('click', () => {
  products = products.filter((p) => !deleteIds.includes(p.id))
  selectedIds = selectedIds.filter((id) => !deleteIds.includes(id))
  deleteIds = []
  saveToLocalStorage()
  renderDashboard()
  closeModal(deleteModal)
})

$('cancelDeleteBtn').addEventListener('click', () => {
  deleteIds = []
  closeModal(deleteModal)
})

function setError(inputId, message = '') {
  $(errorIds[inputId]).textContent = message
  $(inputId).classList.toggle('invalid', Boolean(message))
}

function clearErrors() {
  Object.keys(errorIds).forEach((id) => setError(id))
}

Object.keys(errorIds).forEach((id) => {
  $(id).addEventListener('input', () => setError(id))
})

function resetForm() {
  productForm.reset()
  $('productId').value = ''
  clearErrors()
  $('formStatus').checked = true
  $('statusLabel').textContent = 'Status: Aktiv'
}

$('openAddModalBtn').addEventListener('click', () => {
  resetForm()
  $('modalTitle').textContent = 'Yeni Məhsul Əlavə Et'
  $('saveProductBtn').textContent = 'Əlavə Et'
  openModal(productModal)
  $('formTitle').focus()
})

function openEditModal(id) {
  const target = products.find((p) => p.id === id)
  if (!target) return

  resetForm()
  $('modalTitle').textContent = 'Məhsulu Redaktə Et'
  $('saveProductBtn').textContent = 'Yenilə'
  $('productId').value = target.id
  $('formTitle').value = target.title
  $('formCategory').value = target.category
  $('formPrice').value = target.price
  $('formStock').value = target.stock
  $('formImage').value = target.image || ''
  $('formStatus').checked = isActive(target)
  $('statusLabel').textContent =
    `Status: ${isActive(target) ? 'Aktiv' : 'Deaktiv'}`
  openModal(productModal)
  $('formTitle').focus()
}

$('formStatus').addEventListener('change', () => {
  $('statusLabel').textContent =
    `Status: ${$('formStatus').checked ? 'Aktiv' : 'Deaktiv'}`
})

$('closeModalBtn').addEventListener('click', () => closeModal(productModal))
$('cancelModalBtn').addEventListener('click', () => closeModal(productModal))
;[productModal, deleteModal, basketModal].forEach((modal) => {
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal(modal)
  })
})

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeModal(productModal)
    closeModal(deleteModal)
    closeModal(basketModal)
  }
})

function validateForm() {
  const title = $('formTitle').value.trim()
  const price = $('formPrice').value.trim()
  const stock = $('formStock').value.trim()
  const errors = {}

  if (!title) errors.formTitle = 'Məhsul adı boş ola bilməz.'
  if (!$('formCategory').value) errors.formCategory = 'Kateqoriya seçilməlidir.'

  if (price === '' || Number.isNaN(Number(price)))
    errors.formPrice = 'Qiymət daxil edilməlidir.'
  else if (Number(price) < 0) errors.formPrice = 'Qiymət mənfi ola bilməz.'

  if (stock === '' || Number.isNaN(Number(stock)))
    errors.formStock = 'Stok sayı daxil edilməlidir.'
  else if (Number(stock) < 0) errors.formStock = 'Stok mənfi ola bilməz.'
  else if (!Number.isInteger(Number(stock)))
    errors.formStock = 'Stok tam ədəd olmalıdır.'

  Object.keys(errorIds).forEach((id) => setError(id, errors[id]))
  return Object.keys(errors).length === 0
}

productForm.addEventListener('submit', (e) => {
  e.preventDefault()

  if (!validateForm()) {
    productForm.querySelector('.form-control.invalid')?.focus()
    return
  }

  const data = {
    title: $('formTitle').value.trim(),
    category: $('formCategory').value,
    price: parseFloat($('formPrice').value),
    stock: parseInt($('formStock').value, 10),
    image: $('formImage').value.trim(),
    status: $('formStatus').checked ? 'active' : 'inactive',
  }

  const editingId = Number($('productId').value)
  const index = products.findIndex((p) => p.id === editingId)

  if (editingId && index !== -1) {
    products[index] = { ...products[index], ...data }
  } else {
    products.unshift({ id: Date.now(), ...data })
  }

  saveToLocalStorage()
  renderDashboard()
  closeModal(productModal)
})

adminSearchInput.addEventListener('input', renderDashboard)
adminCategoryFilter.addEventListener('change', renderDashboard)
adminStatusFilter.addEventListener('change', renderDashboard)

function toggleSort(column) {
  if (currentSort.column === column) {
    currentSort.direction = currentSort.direction === 'asc' ? 'desc' : 'asc'
  } else {
    currentSort = { column, direction: 'asc' }
  }

  const icon = (col) =>
    currentSort.column === col
      ? currentSort.direction === 'asc'
        ? '↑'
        : '↓'
      : '↕'
  $('sortPriceIcon').textContent = icon('price')
  $('sortStockIcon').textContent = icon('stock')

  renderDashboard()
}

$('sortPriceTh').addEventListener('click', () => toggleSort('price'))
$('sortStockTh').addEventListener('click', () => toggleSort('stock'))

function getStoreProducts() {
  const term = $('input_search').value.trim().toLowerCase()
  const category = $('all_categories').value
  const sort = $('sort').value

  let result = products.filter(isActive)
  if (term) {
    result = result.filter(
      (p) =>
        p.title.toLowerCase().includes(term) ||
        p.category.toLowerCase().includes(term),
    )
  }
  if (category !== 'all') result = result.filter((p) => p.category === category)
  if (sort === 'low-high') result.sort((a, b) => a.price - b.price)
  if (sort === 'high-low') result.sort((a, b) => b.price - a.price)
  return result
}

const inBasket = (p) => basket[p.id] || 0
const unavailable = (p) => p.stock === 0 || inBasket(p) >= p.stock
const basketLabel = (p) =>
  p.stock === 0
    ? 'Tükənib'
    : inBasket(p) >= p.stock
      ? 'Maksimum səbətdədir'
      : '🛒 Səbətə at'

function renderStore() {
  const list = getStoreProducts()
  productList.innerHTML = list.length
    ? list
        .map(
          (item) => `
        <div class="product-card">
          <img src="${esc(item.image || PLACEHOLDER)}" alt="${esc(item.title)}" class="product-image" />
          <h3 class="product-name">${esc(item.title)}</h3>
          <p class="product-description">${esc(item.category)}</p>
          <p class="product-price">Qiymət: ${money(item.price)}</p>
          <button type="button" class="btn btn-primary btn-sm basket-btn" data-id="${item.id}" ${unavailable(item) ? 'disabled' : ''}>
            ${basketLabel(item)}
          </button>
        </div>`,
        )
        .join('')
    : '<div class="empty-state"><div class="empty-state-icon">🔍</div><h3>Heç bir məhsul tapılmadı</h3></div>'
}

$('input_search').addEventListener('input', renderStore)
$('all_categories').addEventListener('change', renderStore)
$('sort').addEventListener('change', renderStore)

function loadBasket() {
  try {
    const raw = JSON.parse(localStorage.getItem(BASKET_KEY))
    if (raw && typeof raw === 'object' && !Array.isArray(raw)) return raw
  } catch {
    localStorage.removeItem(BASKET_KEY)
  }
  return {}
}

function syncBasket() {
  Object.keys(basket).forEach((id) => {
    const p = products.find((item) => item.id === Number(id))
    const qty = p ? Math.min(Math.floor(Number(basket[id])) || 0, p.stock) : 0
    if (qty > 0) basket[id] = qty
    else delete basket[id]
  })
  localStorage.setItem(BASKET_KEY, JSON.stringify(basket))
  $('count').textContent = Object.values(basket).reduce((a, q) => a + q, 0)
}

function renderBasket() {
  syncBasket()
  const rows = Object.keys(basket).map((id) => {
    const p = products.find((item) => item.id === Number(id))
    return { p, qty: basket[id] }
  })

  $('basketItems').innerHTML = rows.length
    ? rows
        .map(
          ({ p, qty }) => `
        <div class="basket-item">
          <img src="${esc(p.image || PLACEHOLDER)}" class="product-img-thumb" alt="${esc(p.title)}" />
          <div class="basket-info">
            <strong>${esc(p.title)}</strong>
            <small>${money(p.price)}</small>
          </div>
          <div class="qty">
            <button type="button" class="qty-btn" data-action="dec" data-id="${p.id}" aria-label="Azalt">−</button>
            <span>${qty}</span>
            <button type="button" class="qty-btn" data-action="inc" data-id="${p.id}" aria-label="Artır" ${qty >= p.stock ? 'disabled' : ''}>+</button>
          </div>
          <button type="button" class="qty-btn" data-action="remove" data-id="${p.id}" aria-label="Sil">🗑️</button>
        </div>`,
        )
        .join('')
    : '<div class="empty-state"><div class="empty-state-icon">🛒</div><h3>Səbət boşdur</h3></div>'

  $('basketTotal').textContent = money(
    rows.reduce((sum, { p, qty }) => sum + p.price * qty, 0),
  )
  $('clearBasketBtn').disabled = rows.length === 0
}

function openBasket() {
  renderBasket()
  openModal(basketModal)
}

$('basket').addEventListener('click', openBasket)
$('basket').addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault()
    openBasket()
  }
})
$('closeBasketBtn').addEventListener('click', () => closeModal(basketModal))

$('clearBasketBtn').addEventListener('click', () => {
  basket = {}
  renderBasket()
  renderStore()
})

$('basketItems').addEventListener('click', (e) => {
  const btn = e.target.closest('[data-action]')
  if (!btn) return
  const id = Number(btn.dataset.id)
  if (btn.dataset.action === 'inc') basket[id] = (basket[id] || 0) + 1
  if (btn.dataset.action === 'dec') basket[id] = (basket[id] || 0) - 1
  if (btn.dataset.action === 'remove') delete basket[id]
  renderBasket()
  renderStore()
})

productList.addEventListener('click', (e) => {
  const btn = e.target.closest('.basket-btn')
  if (!btn) return
  const id = Number(btn.dataset.id)
  const p = products.find((item) => item.id === id)
  if (!p || (basket[id] || 0) >= p.stock) return
  basket[id] = (basket[id] || 0) + 1
  syncBasket()
  renderStore()
})

function showView(name) {
  const admin = name === 'admin'
  $('adminView').classList.toggle('active', admin)
  $('storeView').classList.toggle('active', !admin)
  $('admin_panel').classList.toggle('active', admin)
  $('kataloq').classList.toggle('active', !admin)
  if (!admin) renderStore()
}

$('admin_panel').addEventListener('click', () => showView('admin'))
$('kataloq').addEventListener('click', () => showView('store'))

$('moon').addEventListener('click', () => {
  const isDark = document.body.classList.toggle('dark-mode')
  const [icon, text] = $('moon').querySelectorAll('span')
  icon.textContent = isDark ? '☀️' : '🌙'
  text.textContent = isDark ? 'Gündüz' : 'Qaranlıq'
})

document.addEventListener(
  'error',
  (e) => {
    const img = e.target
    if (img.tagName === 'IMG' && !img.dataset.fallback) {
      img.dataset.fallback = '1'
      img.src = PLACEHOLDER
    }
  },
  true,
)

function initApp() {
  products = loadProducts()
  basket = loadBasket()
  fillCategories()
  saveToLocalStorage()
  renderDashboard()
}

initApp()
