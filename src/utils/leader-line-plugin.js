import { getPct } from "./charts.js";

export const leaderLinePlugin = {
  id: "leaderLinePlugin",
  afterDatasetsDraw(chart, args, pluginOptions) {
    const { ctx } = chart;

    const datasetIndex = pluginOptions?.datasetIndex ?? 0;
    const dataset = chart.data.datasets[datasetIndex];
    const meta = chart.getDatasetMeta(datasetIndex);

    if (!meta?.data?.length || !dataset?.data?.length) return;

    const dataArr = dataset.data.map(v => Number(v) || 0);
    const offset = pluginOptions?.offset ?? 14; // match datalabels outside offset
    const color = pluginOptions?.color ?? "#666";

    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = pluginOptions?.lineWidth ?? 1;

    meta.data.forEach((arc, i) => {
      const value = dataArr[i];
      const pct = getPct(value, dataArr);

      // same rule as you described: show outside labels for <10%, hide <=5%
      if (pct >= 10 || pct <= 5) return;

      const angle = (arc.startAngle + arc.endAngle) / 2;

      // start: just outside the slice edge
      const x0 = arc.x + Math.cos(angle) * (arc.outerRadius + 2);
      const y0 = arc.y + Math.sin(angle) * (arc.outerRadius + 2);

      // end: where the outside label is placed (roughly)
      const x1 = arc.x + Math.cos(angle) * (arc.outerRadius + offset);
      const y1 = arc.y + Math.sin(angle) * (arc.outerRadius + offset);

      ctx.beginPath();
      ctx.moveTo(x0, y0);
      ctx.lineTo(x1, y1);
      ctx.stroke();
    });

    ctx.restore();
  }
};
