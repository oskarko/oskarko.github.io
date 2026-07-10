(() => {
	"use strict";

	const STORAGE_KEY = "preferred-lang";
	const DEFAULT_LANG = (document.body.dataset.lang || "es").toLowerCase();

	const THEME_KEY = "preferred-theme";
	const DEFAULT_THEME = "light";

	const applyLanguage = (lang) => {
		if (lang !== "es" && lang !== "en") lang = "es";
		document.documentElement.setAttribute("lang", lang);
		document.body.dataset.lang = lang;

		document.querySelectorAll("[data-es]").forEach((el) => {
			const val = el.dataset[lang];
			if (typeof val === "string") el.textContent = val;
		});

		document.querySelectorAll(".lang-btn").forEach((btn) => {
			const active = btn.dataset.setLang === lang;
			btn.classList.toggle("is-active", active);
			btn.setAttribute("aria-pressed", active ? "true" : "false");
		});
	};

	const initLanguage = () => {
		let stored = null;
		try { stored = localStorage.getItem(STORAGE_KEY); } catch (_) {}
		applyLanguage(stored || DEFAULT_LANG);
	};

	document.addEventListener("click", (e) => {
		const btn = e.target.closest("[data-set-lang]");
		if (!btn) return;
		const lang = btn.dataset.setLang;
		applyLanguage(lang);
		try { localStorage.setItem(STORAGE_KEY, lang); } catch (_) {}
	});

	const applyTheme = (theme) => {
		if (theme !== "light" && theme !== "dark") theme = DEFAULT_THEME;
		document.documentElement.setAttribute("data-theme", theme);

		document.querySelectorAll(".theme-btn").forEach((btn) => {
			const active = btn.dataset.setTheme === theme;
			btn.classList.toggle("is-active", active);
			btn.setAttribute("aria-pressed", active ? "true" : "false");
		});
	};

	const initTheme = () => {
		let stored = null;
		try { stored = localStorage.getItem(THEME_KEY); } catch (_) {}
		applyTheme(stored || document.documentElement.getAttribute("data-theme") || DEFAULT_THEME);
	};

	document.addEventListener("click", (e) => {
		const btn = e.target.closest("[data-set-theme]");
		if (!btn) return;
		const theme = btn.dataset.setTheme;
		applyTheme(theme);
		try { localStorage.setItem(THEME_KEY, theme); } catch (_) {}
	});

	document.addEventListener("click", (e) => {
		const link = e.target.closest('a[href^="#"]');
		if (!link) return;
		const id = link.getAttribute("href");
		if (id.length < 2) return;
		const target = document.querySelector(id);
		if (!target) return;
		e.preventDefault();
		const top = target.getBoundingClientRect().top + window.scrollY - 80;
		window.scrollTo({ top, behavior: "smooth" });
	});

	const revealObserver = ("IntersectionObserver" in window)
		? new IntersectionObserver((entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						entry.target.classList.add("is-visible");
						revealObserver.unobserve(entry.target);
					}
				});
			}, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" })
		: null;

	const initReveal = () => {
		const els = document.querySelectorAll(".reveal");
		if (revealObserver) {
			els.forEach((el) => revealObserver.observe(el));
		} else {
			els.forEach((el) => el.classList.add("is-visible"));
		}
	};

	const initActiveNav = () => {
		const sections = document.querySelectorAll("section[id]");
		const links = document.querySelectorAll(".nav-links a[href^='#']");
		if (!("IntersectionObserver" in window) || sections.length === 0) return;

		const navObserver = new IntersectionObserver((entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					const id = entry.target.id;
					links.forEach((a) => {
						a.classList.toggle("is-active", a.getAttribute("href") === "#" + id);
					});
				}
			});
		}, { rootMargin: "-40% 0px -55% 0px" });

		sections.forEach((s) => navObserver.observe(s));
	};

	const initNavScroll = () => {
		const navInner = document.querySelector(".nav-inner");
		if (!navInner) return;
		let ticking = false;

		const onScroll = () => {
			const y = window.scrollY;
			if (y > 12) navInner.classList.add("is-scrolled");
			else navInner.classList.remove("is-scrolled");
			ticking = false;
		};

		window.addEventListener("scroll", () => {
			if (!ticking) { requestAnimationFrame(onScroll); ticking = true; }
		}, { passive: true });
	};

	const boot = () => {
		initLanguage();
		initTheme();
		initReveal();
		initActiveNav();
		initNavScroll();
	};

	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", boot);
	} else {
		boot();
	}
})();
