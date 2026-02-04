(function() {
  function setCookie(name, value, days) {
    let expires = "";
    if (days) {
      const d = new Date();
      d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
      expires = "; expires=" + d.toUTCString();
    }
    document.cookie = name + "=" + encodeURIComponent(value) + expires + "; path=/";
  }

  function getCookie(name) {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? decodeURIComponent(match[2]) : null;
  }

  const urlParams = new URLSearchParams(window.location.search);
  const utmFields = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content'];
  utmFields.forEach(f => {
    const val = urlParams.get(f);
    if (val) setCookie(f, val, 30);
  });

  const utm = {
    source: getCookie('utm_source') || "",
    medium: getCookie('utm_medium') || "",
    campaign: getCookie('utm_campaign') || "",
    content: getCookie('utm_content') || ""
  };

  let variant = sessionStorage.getItem('ab_variant');
  if (!variant) {
    const rand = Math.random();
    if (rand < 0.33) variant = 'A';
    else if (rand < 0.66) variant = 'B';
    else variant = 'C';
    sessionStorage.setItem('ab_variant', variant);
  }

  document.documentElement.classList.add(
    variant === 'A' ? 'a-test' :
    variant === 'B' ? 'b-test' : 'c-test'
  );

  let userId = localStorage.getItem('ab_user_id');
  if (!userId) {
    userId = 'user_' + Math.random().toString(36).slice(2, 10);
    localStorage.setItem('ab_user_id', userId);
  }

  function sendEvent(type) {
    console.log('%c [TRACKING] Відправляю подію: ' + type, 'color: #0f0; font-weight: bold; font-size: 14px;');
    fetch('https://a-b-flax.vercel.app/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
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

  const currentUrl = window.location.href.toLowerCase();
  if (currentUrl.includes('thankyoupage') && (utm.source || utm.medium || utm.campaign || utm.content)) {
    sendEvent('lead');
  } else {
    sendEvent('page_view');
  }

  document.addEventListener('DOMContentLoaded', function() {
    const showClass = variant === 'A' ? '.a-test' : variant === 'B' ? '.b-test' : '.c-test';
    const hideClasses = ['.a-test', '.b-test', '.c-test'].filter(cls => cls !== showClass);

    document.querySelectorAll(showClass).forEach(el => {
      el.style.display = 'flex';
      el.style.opacity = '1';
    });

    hideClasses.forEach(hide => {
      document.querySelectorAll(hide).forEach(el => {
        el.style.display = 'none';
        el.style.opacity = '0';
      });
    });

    document.addEventListener('click', e => {
      if (e.target.closest('.button-test-AB')) sendEvent('click');
    });
  });
})();
