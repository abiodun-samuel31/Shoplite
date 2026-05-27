/* ===========================
   INTERSECTION OBSERVER
   Triggers fade-up on scroll
=========================== */
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.12,
  rootMargin: '0px 0px -40px 0px'
});

document.querySelectorAll('.fade-up').forEach(el => {
  observer.observe(el);
});

/* ===========================
   STAGGER CHILDREN
=========================== */
function staggerChildren(parentSelector, childSelector, baseDelay = 100) {
  const parents = document.querySelectorAll(parentSelector);
  parents.forEach(parent => {
    const children = parent.querySelectorAll(childSelector);
    children.forEach((child, index) => {
      child.style.transitionDelay = (index * baseDelay) + 'ms';
    });
  });
}

staggerChildren('.categories-grid', '.category-card', 80);
staggerChildren('.products-grid', '.product-card', 100);
staggerChildren('.why-grid', '.why-card', 80);
staggerChildren('.contact-info', '.contact-item', 80);

/* ===========================
   HERO ELEMENTS
   Fire on load immediately
=========================== */
window.addEventListener('load', () => {
  document.querySelectorAll('.hero .fade-up').forEach(el => {
    setTimeout(() => {
      el.classList.add('visible');
    }, 100);
  });
});

/* ===========================
   NUMBER COUNTER ANIMATION
=========================== */
function animateCounter(el, target, duration = 1200) {
  const isNumber = !isNaN(parseInt(target));
  if (!isNumber) {
    el.textContent = target;
    return;
  }
  
  const end = parseInt(target);
  const increment = end / (duration / 16);
  let current = 0;
  const suffix = target.replace(/[0-9]/g, '');
  
  const timer = setInterval(() => {
    current += increment;
    if (current >= end) {
      current = end;
      clearInterval(timer);
    }
    el.textContent = Math.floor(current) + suffix;
  }, 16);
}

const statObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const original = el.getAttribute('data-count');
      if (original) animateCounter(el, original);
      statObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-num').forEach(el => {
  el.setAttribute('data-count', el.textContent.trim());
  statObserver.observe(el);
});

/* ===========================
   SKILL TAGS STAGGER
=========================== */
const skillGroupObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const tags = entry.target.querySelectorAll('.skill-tags span');
      tags.forEach((tag, i) => {
        tag.style.opacity = '0';
        tag.style.transform = 'translateY(10px)';
        setTimeout(() => {
          tag.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
          tag.style.opacity = '1';
          tag.style.transform = 'translateY(0)';
        }, i * 60);
      });
      skillGroupObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.skill-group').forEach(group => {
  skillGroupObserver.observe(group);
});

/* ===========================
   SCROLL HINT HIDE
=========================== */
const scrollHint = document.querySelector('.scroll-hint');

if (scrollHint) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 80) {
      scrollHint.style.opacity = '0';
      scrollHint.style.pointerEvents = 'none';
    } else {
      scrollHint.style.opacity = '1';
      scrollHint.style.pointerEvents = 'auto';
    }
  }, { passive: true });
}

/* ===========================
   NAVBAR ACTIVE LINK STYLE
=========================== */
const style = document.createElement('style');
style.textContent = `
  .nav-links li a.active {
    color: var(--accent) !important;
    background: rgba(232,255,71,0.06) !important;
  }
`;
document.head.appendChild(style);