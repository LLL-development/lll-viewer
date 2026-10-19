/* A new tab must keep uploaded HTML behind the same opaque sandbox. */
(function () {
  "use strict";
  var source;
  try { source = decodeURIComponent(location.hash.slice(1)); }
  catch (_) { return; }
  // Only blob URLs issued by this app can be viewed here. Never navigate the
  // trusted wrapper itself to document bytes or an arbitrary caller URL.
  // Direct-file previews use a locally generated srcdoc wrapper instead.
  if (location.protocol !== "http:" && location.protocol !== "https:") return;
  if (source.indexOf("blob:" + location.origin + "/") !== 0) return;
  document.getElementById("frame").src = source;
})();
