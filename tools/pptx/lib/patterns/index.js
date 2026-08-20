/**
 * 패턴 라이브러리 인덱스
 * 10종 슬라이드 패턴을 통합 export
 */

const heroStat = require("./heroStat");
const cardGrid = require("./cardGrid");
const comparison = require("./comparison");
const processFlow = require("./processFlow");
const timeline = require("./timeline");
const funnel = require("./funnel");
const pyramid = require("./pyramid");
const orgChart = require("./orgChart");
const tableInsight = require("./tableInsight");
const quoteHighlight = require("./quoteHighlight");

const patterns = {
  heroStat,
  cardGrid,
  comparison,
  processFlow,
  timeline,
  funnel,
  pyramid,
  orgChart,
  tableInsight,
  quoteHighlight,
};

module.exports = patterns;
