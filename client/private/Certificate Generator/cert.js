document.getElementById('name').innerText = "Archis";
document.getElementById('course').innerText = "Drip irrigation";
document.getElementById('date').innerText = "April 9, 2025";

function downloadCertificate() {
    const element = document.getElementById('certificate'); 
    const opt = {
        margin: 0,
        filename: 'certificate.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'landscape' }
    };
    html2pdf().set(opt).from(element).save();
}