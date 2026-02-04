(function() {
  // Отримуємо всі UTM параметри
  const urlParams = new URLSearchParams(window.location.search);
  const utms = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content'];

  utms.forEach(param => {
    const value = urlParams.get(param);
    if (value) {
      // Зберігаємо в кукі на 30 днів
      document.cookie = param + "=" + encodeURIComponent(value) + "; path=/; max-age=" + 60 * 60 * 24 * 30;
    }
  });
})();

    (function(){
  // --- AB-тест ---
  var variant = sessionStorage.getItem('ab_variant');
  if(!variant){
    variant = Math.random() < 0.5 ? 'A' : 'B';
    sessionStorage.setItem('ab_variant', variant);
  }
  document.documentElement.classList.add(variant === 'A' ? 'a-test' : 'b-test');

  // --- Унікальний користувач ---
  var userId = localStorage.getItem('ab_user_id');
  if(!userId){
    userId = 'user_'+Math.random().toString(36).slice(2,10);
    localStorage.setItem('ab_user_id', userId);
  }

  // --- Робота з Cookie ---
  function setCookie(name, value, days){
    var expires = "";
    if(days){
      var d = new Date();
      d.setTime(d.getTime() + (days*24*60*60*1000));
      expires = "; expires=" + d.toUTCString();
    }
    document.cookie = name + "=" + encodeURIComponent(value) + expires + "; path=/";
  }

  function getCookie(name){
    var match = document.cookie.match(new RegExp('(^| )'+name+'=([^;]+)'));
    return match ? decodeURIComponent(match[2]) : null;
  }

  // --- Зчитування UTM з URL і збереження в cookie ---
  var urlParams = new URLSearchParams(window.location.search);
  var utmFields = ['utm_source','utm_medium','utm_campaign','utm_content'];
  utmFields.forEach(function(f){
    var val = urlParams.get(f);
    if(val) setCookie(f, val, 30); // зберігаємо 30 днів
  });

  // --- Діставання UTM з cookie ---
  var utm = {
    source: getCookie('utm_source') || "",
    medium: getCookie('utm_medium') || "",
    campaign: getCookie('utm_campaign') || "",
    content: getCookie('utm_content') || ""
  };

  // --- Відправка подій ---
  function sendEvent(type){
    console.log('%c [TRACKING] Відправляю подію: ' + type, 'color: #0f0; font-weight: bold; font-size: 14px;');

    fetch('https://a-b-flax.vercel.app/api/events', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      keepalive: true,
      body: JSON.stringify({
        website: location.hostname,
        variant: variant,
        event: type,
        utm_source: utm.source,
        utm_medium: utm.medium,
        utm_campaign: utm.campaign,
        utm_content: utm.content,
        user_id: userId,
        timestamp: new Date().toISOString()
      })
    }).catch(e => console.error('Помилка відправки:', e));
  }

  // --- Визначення події ---
  var currentUrl = window.location.href.toLowerCase();
  if(currentUrl.includes('thankyoupage') && (utm.source || utm.medium || utm.campaign || utm.content)){
      sendEvent('lead'); // lead тільки якщо UTM є
  } else {
      sendEvent('page_view');
  }

  // --- DOM-контент ---
  document.addEventListener('DOMContentLoaded', function(){
    var show = variant==='A'?'.a-test':'.b-test';
    var hide = variant==='A'?'.b-test':'.a-test';

    document.querySelectorAll(show).forEach(el=>{ el.style.display='flex'; el.style.opacity='1'; });
    document.querySelectorAll(hide).forEach(el=>{ el.style.display='none'; el.style.opacity='0'; });

    document.addEventListener('click', e=>{
      if(e.target.closest('.button-test-AB')) sendEvent('click');
    });
  });

})();