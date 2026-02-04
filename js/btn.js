// window.onscroll = function showHeader(){
//     let cont = document.querySelector('.fixed-btn');

//     if(window.scrollY > 790){
//         cont.style.display = "block";
//     } else {
//         cont.style.display = "none";
//     }
// }

window.onscroll = function showHeader() {
    let fixedBtn = document.querySelector('.fixed-btn');
    let headerBtn = document.getElementById('header-btn');

    // Отримуємо позицію верхнього та нижнього краю елемента .btn відносно вьюпорта
    let btnBottom = headerBtn.getBoundingClientRect().bottom;

    // Перевіряємо, чи елемент .btn вийшов за верхній край вьюпорта
    if (btnBottom < 0) {
        fixedBtn.style.bottom = "0";
        fixedBtn.style.opacity = "1";
    } else {
        fixedBtn.style.bottom = "-20rem";
        fixedBtn.style.opacity = "0";
    }
}