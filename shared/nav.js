/* ============================================================
   LLL Tools — shared global navbar
   Renders a top nav (logo -> home, links to each tool, language slot).
   Each page calls:
     var langHost = LLL_NAV.build(hostEl, { base: "../", active: "md" });
   base:   "" on the landing page, "../" inside a tool folder
   active: "" on landing, or one of html|md|pdf|csv
   Returns the language-switcher host element to pass to LLL_I18N.init.
   ============================================================ */
(function (global) {
  "use strict";

  var TOOLS = [
    { id: "html", label: "HTML", path: "html/" },
    { id: "md",   label: "MD",   path: "md/" },
    { id: "pdf",  label: "PDF",  path: "pdf/" },
    { id: "csv",  label: "CSV",  path: "csv/" }
  ];

  global.LLL_NAV = {
    build: function (host, opts) {
      opts = opts || {};
      var base = opts.base || "";
      var active = opts.active || "";

      var nav = document.createElement("nav");
      nav.className = "lll-nav";

      var home = document.createElement("a");
      home.className = "nav-logo";
      home.href = base || "./";
      home.setAttribute("aria-label", "Home");
      var img = document.createElement("img");
      img.src = base + "shared/logo.svg";
      img.alt = "LLL";
      home.appendChild(img);
      nav.appendChild(home);

      var links = document.createElement("div");
      links.className = "nav-links";
      TOOLS.forEach(function (t) {
        var a = document.createElement("a");
        a.href = base + t.path;
        a.textContent = t.label;
        if (t.id === active) a.className = "active";
        links.appendChild(a);
      });
      nav.appendChild(links);

      if (global.LLL_THEME && LLL_THEME.button) nav.appendChild(LLL_THEME.button());

      var langHost = document.createElement("div");
      langHost.className = "nav-lang";
      nav.appendChild(langHost);

      host.appendChild(nav);
      return langHost;
    }
  };
})(window);
