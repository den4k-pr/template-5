$(".receipts-slider").slick({
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1
});
document.querySelectorAll('.slider-wrapper').forEach(wrapper => {
    const slides = wrapper.querySelector('.slides');
    const slide = wrapper.querySelectorAll('.slide');
    const indicatorsContainer = wrapper.querySelector('.indicators');
    const nextBtn = wrapper.querySelector('.next');
    const prevBtn = wrapper.querySelector('.prev');
    let index = 0;

  
    const slideCount = slide.length;
    slides.style.width = `${slideCount * 100}%`;
    slide.forEach(sl => {
        sl.style.width = `${100 / slideCount}%`;
    });

 
    slide.forEach((_, i) => {
        const indicator = document.createElement('div');
        indicator.classList.add('indicator');
        if (i === 0) indicator.classList.add('active');
        indicator.addEventListener('click', () => {
            index = i;
            updateSlide();
        });
        indicatorsContainer.appendChild(indicator);
    });

   
    nextBtn.addEventListener('click', () => {
        index = (index + 1) % slide.length;
        updateSlide();
    });

    prevBtn.addEventListener('click', () => {
        index = (index - 1 + slide.length) % slide.length;
        updateSlide();
    });

   
    function updateSlide() {
        slides.style.transform = `translateX(${-index * (100 / slideCount)}%)`;
        wrapper.querySelectorAll('.indicator').forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
    }

  
    let startX = 0;
    let endX = 0;

    slides.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
    });

    slides.addEventListener('touchmove', (e) => {
        endX = e.touches[0].clientX;
    });

    slides.addEventListener('touchend', () => {
        const diffX = endX - startX;

        if (Math.abs(diffX) > 50) {
            if (diffX < 0) {
                index = (index + 1) % slide.length;
            } else {
                index = (index - 1 + slide.length) % slide.length;
            }
            updateSlide();
        }

        startX = 0;
        endX = 0;
    });
});


document.querySelectorAll('.slider-wrapper2').forEach(wrapper => {
  const slider = wrapper.querySelector('.slider2');
  const slides = wrapper.querySelectorAll('.slide2');
  const prevBtn = wrapper.querySelector('.prev');
  const nextBtn = wrapper.querySelector('.next');
  const indicatorsContainer = wrapper.querySelector('.indicators');

  let index = 0;
  let startX = 0;
  let isSwiping = false;

  // Создание индикаторов
  slides.forEach((_, i) => {
    const dot = document.createElement('span');
    dot.classList.add('indicator-dot');
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => {
      index = i;
      updateSlider();
    });
    indicatorsContainer.appendChild(dot);
  });

function updateSlider() {
  const remInPx = parseFloat(getComputedStyle(document.documentElement).fontSize);
  const slideWidth = slides[0].offsetWidth + remInPx; // ширина + 1rem
  slider.style.transform = `translateX(-${index * slideWidth}px)`;
  updateIndicators();
}

  function updateIndicators() {
    const dots = wrapper.querySelectorAll('.indicator-dot');
    dots.forEach(dot => dot.classList.remove('active'));
    if (dots[index]) dots[index].classList.add('active');
  }

  nextBtn.addEventListener('click', () => {
    if (index < slides.length - 1) {
      index++;
      updateSlider();
    }
  });

  prevBtn.addEventListener('click', () => {
    if (index > 0) {
      index--;
      updateSlider();
    }
  });

  // Свайп (тач-события)
  slider.addEventListener('touchstart', e => {
    startX = e.touches[0].clientX;
    isSwiping = true;
  });

  slider.addEventListener('touchmove', e => {
    if (!isSwiping) return;
    const moveX = e.touches[0].clientX;
    const diff = startX - moveX;

    if (Math.abs(diff) > 50) {
      if (diff > 0 && index < slides.length - 1) {
        index++;
      } else if (diff < 0 && index > 0) {
        index--;
      }
      updateSlider();
      isSwiping = false;
    }
  });

  slider.addEventListener('touchend', () => {
    isSwiping = false;
  });

  window.addEventListener('resize', updateSlider);
  updateSlider();
});