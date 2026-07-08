(() => {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Smooth scroll for all data-target elements ---------- */
  const allNavTriggers = document.querySelectorAll('[data-target]');
  const tabbarHeight = document.querySelector('.tabbar')?.offsetHeight || 60;

  allNavTriggers.forEach((el) => {
    el.addEventListener('click', (e) => {
      const targetSel = el.getAttribute('data-target');
      const target = document.querySelector(targetSel);
      if (!target) return;
      e.preventDefault();
      const y = target.getBoundingClientRect().top + window.pageYOffset - tabbarHeight + 1;
      window.scrollTo({ top: y, behavior: reduceMotion ? 'auto' : 'smooth' });
      closeMobileNav();
    });
  });

  /* ---------- Mobile nav toggle ---------- */
  const menuToggle = document.querySelector('.menu-toggle');
  const mobileNav = document.getElementById('mobile-nav');

  function closeMobileNav() {
    if (!mobileNav) return;
    mobileNav.classList.remove('is-open');
    menuToggle?.setAttribute('aria-expanded', 'false');
  }

  menuToggle?.addEventListener('click', () => {
    const isOpen = mobileNav.classList.toggle('is-open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });

  /* ---------- Scroll-spy: highlight active tab ---------- */
  const sections = document.querySelectorAll('main section[id]');
  const tabs = document.querySelectorAll('.tab');

  const spyObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          tabs.forEach((tab) => {
            tab.classList.toggle('is-active', tab.getAttribute('data-target') === `#${id}`);
          });
        }
      });
    },
    { rootMargin: `-${tabbarHeight + 20}px 0px -60% 0px`, threshold: 0 }
  );
  sections.forEach((sec) => spyObserver.observe(sec));

  /* ---------- Terminal typing effect ---------- */
  const typedCommandEl = document.getElementById('typed-command');
  const typedOutputEl = document.getElementById('typed-output');
  const command = 'whoami --full';

  function typeCommand() {
    if (!typedCommandEl) return;
    if (reduceMotion) {
      typedCommandEl.textContent = command;
      typedOutputEl?.removeAttribute('hidden');
      return;
    }
    let i = 0;
    const interval = setInterval(() => {
      typedCommandEl.textContent = command.slice(0, i + 1);
      i += 1;
      if (i === command.length) {
        clearInterval(interval);
        setTimeout(() => typedOutputEl?.removeAttribute('hidden'), 300);
      }
    }, 65);
  }

  if ('IntersectionObserver' in window && typedCommandEl) {
    const heroObserver = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            typeCommand();
            obs.disconnect();
          }
        });
      },
      { threshold: 0.3 }
    );
    heroObserver.observe(document.getElementById('hero'));
  } else {
    typeCommand();
  }

  /* ---------- Contact form: submits to Formspree via fetch ---------- */
  const form = document.getElementById('contact-form');
  const statusEl = document.getElementById('contact-status');

  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();

    if (!name || !email || !message) {
      statusEl.style.color = 'var(--red)';
      statusEl.textContent = '> please fill in every field.';
      return;
    }

    statusEl.style.color = 'var(--text-dim)';
    statusEl.textContent = '> sending…';

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
      });

      if (response.ok) {
        statusEl.style.color = 'var(--green)';
        statusEl.textContent = '> message sent — thanks! I\'ll get back to you soon.';
        form.reset();
      } else {
        statusEl.style.color = 'var(--red)';
        statusEl.textContent = '> something went wrong — please email me directly instead.';
      }
    } catch (err) {
      statusEl.style.color = 'var(--red)';
      statusEl.textContent = '> network error — please email me directly instead.';
    }
  });
  
  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ---------- Back to top ---------- */
  document.getElementById('back-to-top')?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
  });
})();
