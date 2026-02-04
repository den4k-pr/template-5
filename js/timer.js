function start24hGlobalTimer() {
    const TOTAL = 24 * 60 * 60; // 24h в секундах
    const KEY = 'global_24h_timer_end';

    let endTime = localStorage.getItem(KEY);

    if (!endTime || Date.now() > endTime) {
        endTime = Date.now() + TOTAL * 1000;
        localStorage.setItem(KEY, endTime);
    }

    function updateTimer() {
        let remaining = Math.floor((endTime - Date.now()) / 1000);

        if (remaining <= 0) {
            endTime = Date.now() + TOTAL * 1000;
            localStorage.setItem(KEY, endTime);
            remaining = TOTAL;
        }

        const hours = String(Math.floor(remaining / 3600)).padStart(2, '0');
        const minutes = String(Math.floor((remaining % 3600) / 60)).padStart(2, '0');
        const seconds = String(remaining % 60).padStart(2, '0');

        document.querySelectorAll('.hours').forEach(el => el.textContent = hours);
        document.querySelectorAll('.minutes').forEach(el => el.textContent = minutes);
        document.querySelectorAll('.seconds').forEach(el => el.textContent = seconds);
    }

    updateTimer();
    setInterval(updateTimer, 1000);
}

start24hGlobalTimer();
