/* 受給歴の自動計算。
   開始日は下の START の一か所だけ。
   表示は「N年Mヶ月（D日目）」。D は開始日を1日目と数える通算日数。
   JS が無効なら、HTML 側の初期文字列「2010年3月から」がそのまま残る。 */
(function () {
  "use strict";

  var START = "2010-03-18";

  /* 桁区切り（6015 → "6,015"） */
  function withCommas(n) {
    return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  /* startText: "YYYY-MM-DD"　today: Date（閲覧環境のローカル日付で数える） */
  function span(startText, today) {
    var p = startText.split("-");
    var sy = +p[0], sm = +p[1] - 1, sd = +p[2];
    var ty = today.getFullYear(), tm = today.getMonth(), td = today.getDate();

    var years = ty - sy;
    var months = tm - sm;
    if (td < sd) { months -= 1; }
    if (months < 0) { years -= 1; months += 12; }

    /* 日数は UTC の真夜中同士の差で数え、夏時間の影響を受けないようにする */
    var days = Math.round((Date.UTC(ty, tm, td) - Date.UTC(sy, sm, sd)) / 86400000) + 1;

    return years + "年" + months + "ヶ月（" + withCommas(days) + "日目）";
  }

  if (typeof document !== "undefined") {
    var el = document.getElementById("pension-span");
    if (el) { el.textContent = span(START, new Date()); }
  }

  /* node での検算用 */
  if (typeof module === "object" && module && module.exports) {
    module.exports = { START: START, span: span };
  }
})();
