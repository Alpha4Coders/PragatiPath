const logoutBtn = document.querySelector(".logout-btn")
const logoutIcon = document.querySelector("#logout-icon")
logoutBtn.addEventListener('mouseenter', () => {
    logoutIcon.setAttribute('fill', 'red');
})
logoutBtn.addEventListener('mouseleave', () => {
    logoutIcon.setAttribute('fill', '#fefae0');
})