// google-design 동작. Material Web 컴포넌트는 스스로 동작하므로, 여기는 google.css 쪽 조각만 다룬다.
// 쓰는 법: <script src="assets/m3-behaviors.js" defer></script> (일반 스크립트, 모듈 아님)
// - 앱 바: .m3-top-app-bar 는 페이지가 스크롤되면 .is-scrolled 가 붙는다.
// - 시트·모달 서랍: data-open="#아이디" 를 누르면 <dialog>.showModal(). data-close 또는 바깥(스크림) 클릭, ESC로 닫힌다.
// - 메뉴: data-menu="#메뉴아이디" 를 누르면 <md-menu>.open 을 뒤집는다. 메뉴의 anchor 속성은 누른 요소의 id여야 한다.
// - 분할 버튼: .m3-segmented 안의 button 을 누르면 aria-pressed 가 바뀐다. 여러 개 선택은 data-multi.
// - (Expressive) 레일 펼치기: data-rail-toggle="#레일아이디" 를 누르면 .expanded 와 aria-expanded 가 바뀐다.
// - (Expressive) 토글 버튼: data-toggle 이 붙은 버튼은 aria-pressed 가 바뀐다. 부모에 data-single 이 있으면 하나만 선택된다.
// - 스낵바: M3.showSnackbar("저장했습니다", { action: "실행취소", onAction() {}, timeout: 4000 })
(function () {
  const M3 = (window.M3 = window.M3 || {});
  // Material Web 태그는 aria-* 를 data-aria-* 로 옮긴다. 상태를 읽을 때 둘 다 본다.
  const pressed = (el) => (el.getAttribute("aria-pressed") ?? el.getAttribute("data-aria-pressed")) === "true";

  function onScroll() {
    const y = window.scrollY > 0;
    document.querySelectorAll(".m3-top-app-bar").forEach((b) => b.classList.toggle("is-scrolled", y));
  }
  window.addEventListener("scroll", onScroll, { passive: true });

  document.addEventListener("click", (e) => {
    const opener = e.target.closest("[data-open]");
    if (opener) { const d = document.querySelector(opener.dataset.open); if (d && !d.open) { d.showModal(); d._opener = opener; } return; }
    const closer = e.target.closest("[data-close]");
    if (closer) { const d = closer.closest("dialog"); if (d) d.close(); return; }
    if (e.target.matches("dialog.m3-sheet, dialog.m3-navigation-drawer.modal")) { // 스크림(바깥) 클릭
      const r = e.target.getBoundingClientRect();
      if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) e.target.close();
      return;
    }
    const menuBtn = e.target.closest("[data-menu]");
    if (menuBtn) { const m = document.querySelector(menuBtn.dataset.menu); if (m) m.open = !m.open; return; }
    const railBtn = e.target.closest("[data-rail-toggle]");
    if (railBtn) { const r = document.querySelector(railBtn.dataset.railToggle); if (r) { const x = r.classList.toggle("expanded"); railBtn.setAttribute("aria-expanded", x); } return; }
    const tg = e.target.closest("[data-toggle]");
    if (tg) {
      const single = tg.parentElement.hasAttribute("data-single");
      if (single) tg.parentElement.querySelectorAll("[data-toggle]").forEach((b) => b.setAttribute("aria-pressed", b === tg));
      else tg.setAttribute("aria-pressed", !pressed(tg));
      return;
    }
    const seg = e.target.closest(".m3-segmented button");
    if (seg) {
      const group = seg.parentElement;
      if (group.hasAttribute("data-multi")) seg.setAttribute("aria-pressed", seg.getAttribute("aria-pressed") !== "true");
      else group.querySelectorAll("button").forEach((b) => b.setAttribute("aria-pressed", b === seg));
      group.dispatchEvent(new Event("change", { bubbles: true }));
    }
  });
  // 마우스로 연 메뉴는 포커스가 버튼에 남아 md-menu가 ESC를 받지 못한다. 문서에서 받아 닫는다.
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") document.querySelectorAll("md-menu[open]").forEach((m) => (m.open = false)); });
  // 닫힐 때 연 버튼으로 포커스를 돌려준다
  document.addEventListener("close", (e) => { if (e.target._opener) e.target._opener.focus(); }, true);

  let live;
  M3.showSnackbar = function (text, opt = {}) {
    document.querySelectorAll(".m3-snackbar").forEach((s) => s.remove());
    const s = document.createElement("div");
    s.className = "m3-snackbar";
    s.setAttribute("role", "status");
    s.innerHTML = '<md-elevation></md-elevation><span class="text"></span>';
    s.querySelector(".text").textContent = text;
    if (opt.action) {
      const b = document.createElement("md-text-button");
      b.textContent = opt.action;
      b.addEventListener("click", () => { opt.onAction && opt.onAction(); hide(); });
      s.append(b);
    }
    document.body.append(s);
    requestAnimationFrame(() => requestAnimationFrame(() => s.classList.add("open")));
    function hide() { s.classList.remove("open"); setTimeout(() => s.remove(), 300); }
    clearTimeout(live);
    live = setTimeout(hide, opt.timeout || (opt.action ? 6000 : 4000)); // 4~10초 [A-doc 스낵바], 행동이 있으면 더 길게 [D]
    return { hide };
  };
})();
