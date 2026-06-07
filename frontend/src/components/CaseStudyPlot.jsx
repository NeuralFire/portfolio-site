import { Suspense, lazy, useEffect, useRef, useState } from 'react'

const FALLBACK_TOKENS = {
  text: '#f1f5f9',
  mutedText: '#94a3b8',
  border: 'rgba(148, 163, 184, 0.22)',
  surface: 'rgba(15, 23, 42, 0.9)',
  tooltipBorder: 'rgba(6, 182, 212, 0.24)',
  dataPrimary: '#06b6d4',
  dataSecondary: '#3a86ff',
  dataTertiary: '#7b8ca5',
  grid: 'rgba(148, 163, 184, 0.18)',
}

const Plot = lazy(async () => {
  const [plotlyFactoryModule, { default: Plotly }] = await Promise.all([
    import('react-plotly.js/factory'),
    import('plotly.js-basic-dist-min'),
  ])

  const createPlotlyComponent = plotlyFactoryModule.default?.default || plotlyFactoryModule.default

  return { default: createPlotlyComponent(Plotly) }
})

function CaseStudyPlot({ visualization }) {
  const containerRef = useRef(null)
  const [tokens, setTokens] = useState(readThemeTokens)
  const [tooltip, setTooltip] = useState(null)

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined
    }

    const syncTokens = () => setTokens(readThemeTokens())
    const observer = new MutationObserver(syncTokens)

    syncTokens()
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme', 'style'],
    })

    return () => observer.disconnect()
  }, [])

  if (!visualization || !Array.isArray(visualization.series) || visualization.series.length === 0) {
    return null
  }

  const palette = [tokens.dataPrimary, tokens.dataSecondary, tokens.dataTertiary]

  const hideTooltip = () => setTooltip(null)

  const handleHover = (event) => {
    const point = event.points?.[0]
    const container = containerRef.current

    if (!point || !container) {
      return
    }

    const rect = container.getBoundingClientRect()
    const nextLeft = clamp((event.event?.clientX ?? rect.left) - rect.left + 18, 12, Math.max(12, rect.width - 220))
    const nextTop = clamp((event.event?.clientY ?? rect.top) - rect.top + 18, 12, Math.max(12, rect.height - 132))

    setTooltip({
      left: nextLeft,
      top: nextTop,
      series: point.data.name,
      label: String(point.x),
      value: String(point.y),
      color: point.data.line?.color ?? tokens.dataPrimary,
      axisLabel: visualization.y_axis_label,
    })
  }

  return (
    <div className="case-study-plot-root" ref={containerRef}>
      <Suspense fallback={<div className="case-study-plot-loading" aria-hidden="true" />}>
        <Plot
          data={visualization.series.map((series, index) => ({
            type: 'scatter',
            mode: 'lines+markers',
            name: series.name,
            x: visualization.x,
            y: series.values,
            line: {
              color: palette[index % palette.length],
              width: 3,
              shape: 'spline',
            },
            marker: {
              color: palette[index % palette.length],
              size: 7,
              line: {
                color: tokens.surface,
                width: 1.5,
              },
            },
            hoverinfo: 'skip',
          }))}
          layout={{
            autosize: true,
            paper_bgcolor: 'rgba(0, 0, 0, 0)',
            plot_bgcolor: 'rgba(0, 0, 0, 0)',
            hovermode: 'closest',
            font: {
              color: tokens.text,
              family: 'Inter, sans-serif',
            },
            margin: { l: 56, r: 20, t: 16, b: 52 },
            hoverlabel: {
              bgcolor: tokens.surface,
              bordercolor: tokens.tooltipBorder,
              font: {
                color: tokens.text,
              },
            },
            legend: {
              orientation: 'h',
              x: 0,
              y: -0.2,
              font: {
                color: tokens.mutedText,
                size: 12,
              },
            },
            xaxis: {
              color: tokens.mutedText,
              gridcolor: 'rgba(0, 0, 0, 0)',
              tickfont: {
                color: tokens.mutedText,
                size: 11,
              },
              zeroline: false,
            },
            yaxis: {
              title: {
                text: visualization.y_axis_label,
                font: {
                  color: tokens.mutedText,
                  size: 12,
                },
              },
              color: tokens.mutedText,
              gridcolor: tokens.grid,
              tickfont: {
                color: tokens.mutedText,
                size: 11,
              },
              zeroline: false,
            },
          }}
          config={{
            displayModeBar: false,
            responsive: true,
          }}
          onHover={handleHover}
          onUnhover={hideTooltip}
          style={{ width: '100%', height: '100%' }}
          useResizeHandler
        />
      </Suspense>
      <div
        className={tooltip ? 'chart-tooltip visible' : 'chart-tooltip'}
        style={tooltip ? { left: `${tooltip.left}px`, top: `${tooltip.top}px` } : undefined}
        aria-hidden="true"
      >
        {tooltip ? (
          <>
            <span className="chart-tooltip-label">{tooltip.series}</span>
            <strong className="chart-tooltip-title">{tooltip.label}</strong>
            <span className="chart-tooltip-value" style={{ color: tooltip.color }}>{tooltip.value}</span>
            <span className="chart-tooltip-meta">{tooltip.axisLabel}</span>
          </>
        ) : null}
      </div>
    </div>
  )
}

function readThemeTokens() {
  if (typeof window === 'undefined') {
    return FALLBACK_TOKENS
  }

  const styles = window.getComputedStyle(document.documentElement)

  return {
    text: styles.getPropertyValue('--neutral-dark-text').trim() || styles.getPropertyValue('--text').trim() || FALLBACK_TOKENS.text,
    mutedText: styles.getPropertyValue('--text-muted').trim() || FALLBACK_TOKENS.mutedText,
    border: styles.getPropertyValue('--border').trim() || FALLBACK_TOKENS.border,
    surface: styles.getPropertyValue('--surface-strong').trim() || FALLBACK_TOKENS.surface,
    tooltipBorder: styles.getPropertyValue('--tooltip-border').trim() || FALLBACK_TOKENS.tooltipBorder,
    dataPrimary: styles.getPropertyValue('--data-primary').trim() || FALLBACK_TOKENS.dataPrimary,
    dataSecondary: styles.getPropertyValue('--data-secondary').trim() || FALLBACK_TOKENS.dataSecondary,
    dataTertiary: styles.getPropertyValue('--data-tertiary').trim() || FALLBACK_TOKENS.dataTertiary,
    grid: styles.getPropertyValue('--grid-line').trim() || FALLBACK_TOKENS.grid,
  }
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}

export default CaseStudyPlot