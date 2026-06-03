/* ============================================
   SCRIPT - Form Absensi Workshop HIMASIKOM
   ============================================ */

// Ganti dengan Web App URL dari deploy Apps Script (Tahap C):
const scriptUrl = 'https://script.google.com/macros/s/AKfycbyN7XxYjoFqL13_7paHO8xE5s2u8QWrApltfInY809tYVh5sSSf9m60aq4nUXpesCBu/exec';
const SHEET_ID = '1G8r-yHSdK93-skPWnXF6Ba3rG_9vaHgBpZsmfnzbFNk';
const SHEET_NAME = 'Responses';

const form = document.getElementById('absensiForm');
const submitBtn = document.getElementById('submitBtn');
const successMessage = document.getElementById('successMessage');

function validateForm() {
    let isValid = true;
    const nama = document.getElementById('nama').value.trim();
    const email = document.getElementById('email').value.trim();
    const institusi = document.getElementById('institusi').value.trim();
    const kategori = document.getElementById('kategori').value;

    if (!nama) { showError('namaError', 'Nama tidak boleh kosong'); isValid = false; }
    else if (nama.length < 3) { showError('namaError', 'Nama minimal 3 karakter'); isValid = false; }
    else { clearError('namaError'); }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) { showError('emailError', 'Email tidak boleh kosong'); isValid = false; }
    else if (!emailRegex.test(email)) { showError('emailError', 'Format email tidak valid'); isValid = false; }
    else { clearError('emailError'); }

    if (!institusi) { showError('institusiError', 'Institusi tidak boleh kosong'); isValid = false; }
    else { clearError('institusiError'); }

    if (!kategori) { showError('kategoriError', 'Silakan pilih kategori'); isValid = false; }
    else { clearError('kategoriError'); }

    return isValid;
}

function showError(elementId, message) {
    const errorEl = document.getElementById(elementId);
    errorEl.textContent = message;
    errorEl.classList.add('show');
}
function clearError(elementId) {
    document.getElementById(elementId).classList.remove('show');
}

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    submitBtn.disabled = true;
    submitBtn.classList.add('loading');
    submitBtn.innerHTML = '<span class="spinner"></span>Memproses...';

    try {
        const data = {
            timestamp: new Date().toLocaleString('id-ID'),
            nama: document.getElementById('nama').value.trim(),
            email: document.getElementById('email').value.trim(),
            institusi: document.getElementById('institusi').value.trim(),
            kategori: document.getElementById('kategori').value,
            kesan: document.getElementById('kesan').value.trim(),
            status: 'pending'
        };

        await submitToSheet(data);

        showSuccessMessage(`✓ Berhasil didaftar, ${data.nama}! Sertifikat akan dikirim ke ${data.email} jam 13.00`);
        form.reset();

        submitBtn.disabled = false;
        submitBtn.classList.remove('loading');
        submitBtn.innerHTML = 'DAFTAR MASUK';

        setTimeout(() => { successMessage.classList.remove('show'); }, 5000);
    } catch (error) {
        console.error('Error:', error);
        alert('Terjadi kesalahan: ' + error.message);
        submitBtn.disabled = false;
        submitBtn.classList.remove('loading');
        submitBtn.innerHTML = 'DAFTAR MASUK';
    }
});

async function submitToSheet(data) {
    const response = await fetch(scriptUrl, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' }
    });
    if (!response.ok) throw new Error('Gagal mengirim data');
}

function showSuccessMessage(message) {
    document.getElementById('successText').textContent = message;
    successMessage.classList.add('show');
}