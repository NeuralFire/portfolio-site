import { useEffect, useId, useRef, useState } from 'react'
import * as d3 from 'd3'

const CHART_COLORS = ['#0d7a68', '#b96d27', '#2f5d8c', '#9b3d31', '#5d4f8b', '#3a7d58']
const MARGINS = { top: 20, right: 20, bottom: 48, left: 64 }

function DashboardMetricsChart({ series, generatedAt }) {
  const containerRef = useRef(null)
  const svgRef = useRef(null)
  const tooltipRef = useRef(null)
  const clipId = useId().replaceAll(':', '')
  const [bounds, setBounds] = useState({ width: 0, height: 360 })

  const chartSeries = series
    .map((entry, index) => ({
      id: `${entry.name}-${entry.category ?? 'uncategorized'}-${index}`,
      label: entry.category ? `${entry.name} / ${entry.category}` : entry.name,
      category: entry.category ?? 'uncategorized',
      points: entry.data
        .map((point) => ({
          date: new Date(point.timestamp),
          value: Number(point.value),
        }))
        .filter((point) => Number.isFinite(point.value) && !Number.isNaN(point.date.getTime()))
        .sort((left, right) => left.date - right.date),
    }))
    .filter((entry) => entry.points.length > 0)

  useEffect(() => {
    if (!containerRef.current) {
      return undefined
    }

    const node = containerRef.current
    const observer = new ResizeObserver(([entry]) => {
      const nextWidth = entry.contentRect.width
      const nextHeight = Math.max(320, Math.min(460, nextWidth * 0.56))
      setBounds({ width: nextWidth, height: nextHeight })
    })

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const svgNode = svgRef.current
    const tooltipNode = tooltipRef.current

    if (!svgNode) {
      return undefined
    }

    const svg = d3.select(svgNode)
    svg.selectAll('*').remove()

    if (bounds.width === 0 || chartSeries.length === 0) {
      return undefined
    }

    const flatPoints = chartSeries.flatMap((entry) => entry.points)
    const xExtent = d3.extent(flatPoints, (point) => point.date)
    const yMax = d3.max(flatPoints, (point) => point.value) ?? 0

    if (!xExtent[0] || !xExtent[1]) {
      return undefined
    }

    const domainStart = xExtent[0]
    const domainEnd = xExtent[1] > xExtent[0] ? xExtent[1] : d3.timeHour.offset(xExtent[1], 12)
    const width = bounds.width
    const height = bounds.height
    const innerWidth = width - MARGINS.left - MARGINS.right
    const innerHeight = height - MARGINS.top - MARGINS.bottom
    const color = d3.scaleOrdinal().domain(chartSeries.map((entry) => entry.id)).range(CHART_COLORS)
    const baseXScale = d3.scaleTime().domain([domainStart, domainEnd]).range([0, innerWidth])
    const yScale = d3.scaleLinear().domain([0, yMax || 1]).nice().range([innerHeight, 0])
    const line = d3
      .line()
      .x((point) => baseXScale(point.date))
      .y((point) => yScale(point.value))
      .curve(d3.curveMonotoneX)

    svg.attr('viewBox', `0 0 ${width} ${height}`).attr('role', 'img').attr('aria-label', 'Portfolio metrics chart')

    const defs = svg.append('defs')
    defs
      .append('clipPath')
      .attr('id', clipId)
      .append('rect')
      .attr('width', innerWidth)
      .attr('height', innerHeight)

    const root = svg.append('g').attr('transform', `translate(${MARGINS.left}, ${MARGINS.top})`)
    const gridLayer = root.append('g').attr('class', 'chart-grid')
    const plotLayer = root.append('g').attr('clip-path', `url(#${clipId})`)
    const axisXLayer = root.append('g').attr('class', 'chart-axis chart-axis-x').attr('transform', `translate(0, ${innerHeight})`)
    const axisYLayer = root.append('g').attr('class', 'chart-axis chart-axis-y')
    const focusLayer = plotLayer.append('g').attr('class', 'chart-focus-layer')
    const overlay = root
      .append('rect')
      .attr('class', 'chart-overlay')
      .attr('width', innerWidth)
      .attr('height', innerHeight)
      .attr('fill', 'transparent')
      .style('cursor', 'grab')

    const transition = d3.transition().duration(650).ease(d3.easeCubicOut)

    const draw = (xScale, animate) => {
      const gridAxis = d3.axisLeft(yScale).ticks(5).tickSize(-innerWidth).tickFormat('')
      const xAxis = d3.axisBottom(xScale).ticks(Math.max(4, Math.floor(innerWidth / 120))).tickSizeOuter(0)
      const yAxis = d3
        .axisLeft(yScale)
        .ticks(5)
        .tickSizeOuter(0)
        .tickFormat((value) => formatCompactNumber(value))

      if (animate) {
        gridLayer.transition(transition).call(gridAxis)
        axisXLayer.transition(transition).call(xAxis)
        axisYLayer.transition(transition).call(yAxis)
      } else {
        gridLayer.call(gridAxis)
        axisXLayer.call(xAxis)
        axisYLayer.call(yAxis)
      }

      const seriesGroups = plotLayer.selectAll('.chart-series').data(chartSeries, (entry) => entry.id)

      const enteredGroups = seriesGroups
        .join(
          (enter) => {
            const group = enter.append('g').attr('class', 'chart-series')
            group
              .append('path')
              .attr('class', 'chart-series-line')
              .attr('fill', 'none')
              .attr('stroke-width', 3)
              .attr('stroke-linecap', 'round')
              .attr('stroke-linejoin', 'round')
            group.append('g').attr('class', 'chart-series-points')
            return group
          },
          (update) => update,
          (exit) => exit.transition(transition).style('opacity', 0).remove(),
        )

      enteredGroups.each(function applySeries(entry) {
        const group = d3.select(this)
        const stroke = color(entry.id)
        const seriesLine = group
          .select('.chart-series-line')
          .datum(entry.points)
          .attr('stroke', stroke)

        const lineGenerator = line.x((point) => xScale(point.date))

        if (animate) {
          seriesLine.transition(transition).attr('d', lineGenerator)
        } else {
          seriesLine.attr('d', lineGenerator)
          const totalLength = seriesLine.node()?.getTotalLength() ?? 0
          seriesLine
            .attr('stroke-dasharray', totalLength)
            .attr('stroke-dashoffset', totalLength)
            .transition(transition)
            .attr('stroke-dashoffset', 0)
            .on('end', function clearDash() {
              d3.select(this).attr('stroke-dasharray', null).attr('stroke-dashoffset', null)
            })
        }

        group
          .select('.chart-series-points')
          .selectAll('circle')
          .data(entry.points.map((point) => ({ ...point, seriesLabel: entry.label, stroke })), (point) => point.date.toISOString())
          .join(
            (enter) =>
              enter
                .append('circle')
                .attr('r', 0)
                .attr('fill', stroke)
                .attr('stroke', 'rgba(255, 251, 245, 0.92)')
                .attr('stroke-width', 2)
                .attr('cx', (point) => xScale(point.date))
                .attr('cy', (point) => yScale(point.value))
                .call((selection) => selection.transition(transition).attr('r', 4.5)),
            (update) =>
              update.call((selection) =>
                selection
                  .transition(transition)
                  .attr('cx', (point) => xScale(point.date))
                  .attr('cy', (point) => yScale(point.value)),
              ),
            (exit) => exit.transition(transition).attr('r', 0).remove(),
          )
          .on('mouseenter', (event, point) => {
            if (!tooltipNode || !containerRef.current) {
              return
            }

            const [xPos, yPos] = d3.pointer(event, containerRef.current)
            d3.select(tooltipNode)
              .style('opacity', 1)
              .style('transform', `translate(${xPos + 16}px, ${Math.max(12, yPos - 24)}px)`)
              .html(`
                <strong>${point.seriesLabel}</strong>
                <span>${formatShortDate(point.date)}</span>
                <span>${formatMetricValue(point.value)}</span>
              `)
          })
          .on('mousemove', (event) => {
            if (!tooltipNode || !containerRef.current) {
              return
            }

            const [xPos, yPos] = d3.pointer(event, containerRef.current)
            d3.select(tooltipNode)
              .style('transform', `translate(${xPos + 16}px, ${Math.max(12, yPos - 24)}px)`)
          })
          .on('mouseleave', () => {
            if (!tooltipNode) {
              return
            }

            d3.select(tooltipNode).style('opacity', 0)
          })
      })

      focusLayer.raise()
    }

    draw(baseXScale, false)

    const zoom = d3
      .zoom()
      .scaleExtent([1, 8])
      .translateExtent([
        [0, 0],
        [innerWidth, innerHeight],
      ])
      .extent([
        [0, 0],
        [innerWidth, innerHeight],
      ])
      .on('start', () => {
        overlay.style('cursor', 'grabbing')
      })
      .on('zoom', (event) => {
        const scaledX = event.transform.rescaleX(baseXScale)
        draw(scaledX, true)
      })
      .on('end', () => {
        overlay.style('cursor', 'grab')
      })

    overlay.call(zoom)

    return () => {
      d3.select(tooltipNode).style('opacity', 0)
    }
  }, [bounds.height, bounds.width, chartSeries, clipId])

  if (chartSeries.length === 0) {
    return (
      <div className="chart-empty">
        <h4 className="card-title">No time-series data yet</h4>
        <p className="card-copy">Seed dashboard metrics to render D3 lines, tooltip state, and zoom interactions.</p>
      </div>
    )
  }

  return (
    <div className="chart-shell">
      <div className="chart-header">
        <div>
          <p className="section-kicker">Interactive metrics</p>
          <h3 className="section-title">D3 multi-line throughput view</h3>
        </div>
        <p className="chart-meta">Scroll or drag inside chart to zoom. Refreshed {formatGeneratedAt(generatedAt)}.</p>
      </div>

      <div className="chart-stage" ref={containerRef}>
        <svg className="chart-svg" ref={svgRef} />
        <div className="chart-tooltip" ref={tooltipRef} aria-hidden="true" />
      </div>

      <div className="legend-grid" aria-label="Chart legend">
        {chartSeries.map((entry, index) => (
          <div className="legend-item" key={entry.id}>
            <span className="legend-swatch" style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }} />
            <div>
              <strong>{entry.label}</strong>
              <span>{entry.points.length} points</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function formatCompactNumber(value) {
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(Number(value))
}

function formatMetricValue(value) {
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 2,
  }).format(value)
}

function formatShortDate(value) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZone: 'UTC',
  }).format(value)
}

function formatGeneratedAt(value) {
  if (!value) {
    return 'pending'
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZone: 'UTC',
  }).format(new Date(value))
}

export default DashboardMetricsChart