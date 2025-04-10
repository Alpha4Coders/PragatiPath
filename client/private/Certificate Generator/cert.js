function generateCertificate(name, course, date) {
    document.getElementById('name').innerText = name;
    document.getElementById('course').innerText = course;
    document.getElementById('date').innerText = date;

    const element = document.getElementById('certificate');
    const opt = {
        margin: 0,
        filename: `${name}_certificate.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'landscape' }
    };

    html2pdf().set(opt).from(element).save();
}
