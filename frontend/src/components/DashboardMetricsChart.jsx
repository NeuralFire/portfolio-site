import { useEffect, useMemo, useRef, useState } from 'react'
import * as d3 from 'd3'

const DOMAIN_DETAILS = {
  'Computer Vision': 'Computer vision pipelines connect raw video to measurable behavioral features and reproducible QC.',
  'Behavioral Tracking': 'Behavioral tracking translates movement, posture, and event timing into structured evidence.',
  'Statistical Modeling': 'Statistical modeling turns assay variance into interpretable estimates, uncertainty, and decision support.',
  'Core Infrastructure': 'Core infrastructure keeps experiments, metadata, analytics, and interfaces aligned at scale.',
}

const FALLBACK_NODE_COLORS = {
  domain: '#06b6d4',
  caseStudy: '#3a86ff',
  stack: '#7b8ca5',
}

function DashboardMetricsChart({ caseStudies }) {
  const containerRef = useRef(null)
  const svgRef = useRef(null)
  const [bounds, setBounds] = useState({ width: 0, height: 420 })
  const [nodeColors, setNodeColors] = useState(FALLBACK_NODE_COLORS)
  const [tooltip, setTooltip] = useState(null)
  const topology = useMemo(() => buildTopology(caseStudies), [caseStudies])
  const defaultNodeId = topology.nodes.find((node) => node.type === 'domain' && node.label === 'Behavioral Tracking')?.id ?? topology.nodes[0]?.id ?? null
  const [activeNodeId, setActiveNodeId] = useState(defaultNodeId)

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined
    }

    const syncNodeColors = () => setNodeColors(readNodeColors())
    const observer = new MutationObserver(syncNodeColors)

    syncNodeColors()
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class', 'data-theme', 'style'],
    })

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!containerRef.current) {
      return undefined
    }

    const node = containerRef.current
    const observer = new ResizeObserver(([entry]) => {
      const nextWidth = entry.contentRect.width
      const nextHeight = Math.max(360, Math.min(520, nextWidth * 0.72))
      setBounds({ width: nextWidth, height: nextHeight })
    })

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const svgNode = svgRef.current

    if (!svgNode) {
      return undefined
    }

    const svg = d3.select(svgNode)
    svg.selectAll('*').remove()

    if (bounds.width === 0 || topology.nodes.length === 0) {
      return undefined
    }

    const width = bounds.width
    const height = bounds.height
    const graphNodes = topology.nodes.map((node) => ({ ...node }))
    const graphLinks = topology.links.map((link) => ({ ...link }))
    const relatedIds = activeNodeId ? getRelatedNodeIds(topology.links, activeNodeId) : new Set()

    const showTooltip = (event, node) => {
      const container = containerRef.current

      if (!container) {
        return
      }

      const rect = container.getBoundingClientRect()
      const nextLeft = clamp(event.clientX - rect.left + 18, 12, Math.max(12, rect.width - 276))
      const nextTop = clamp(event.clientY - rect.top + 18, 12, Math.max(12, rect.height - 140))

      setTooltip({
        left: nextLeft,
        top: nextTop,
        label: node.type === 'caseStudy' ? 'Case study' : node.type === 'domain' ? 'Domain' : 'Stack tag',
        title: node.label,
        copy: node.summary,
        meta: buildTooltipMeta(topology, node),
      })
    }

    const clearTooltip = () => setTooltip(null)

    svg
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('role', 'img')
      .attr('aria-label', 'Behavioral network topology showing domains, case studies, and stack tags')

    const root = svg.append('g')
    root
      .append('g')
      .selectAll('circle')
      .data(buildBackgroundNodes(width, height))
      .join('circle')
      .attr('class', 'network-orbit')
      .attr('cx', (node) => node.x)
      .attr('cy', (node) => node.y)
      .attr('r', (node) => node.radius)

    const simulation = d3
      .forceSimulation(graphNodes)
      .force('link', d3.forceLink(graphLinks).id((node) => node.id).distance(linkDistance).strength(linkStrength))
      .force('charge', d3.forceManyBody().strength((node) => (node.type === 'domain' ? -780 : -360)))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius((node) => getNodeRadius(node) + 20))
      .force('x', d3.forceX((node) => getTargetX(node, width)).strength((node) => (node.type === 'domain' ? 0.24 : 0.1)))
      .force('y', d3.forceY((node) => getTargetY(node, height)).strength((node) => (node.type === 'domain' ? 0.24 : 0.1)))
      .stop()

    for (let index = 0; index < 240; index += 1) {
      simulation.tick()
    }

    // Clamp node positions to keep them within bounds (with padding for radius + label)
    const padding = 56
    graphNodes.forEach((node) => {
      const r = getNodeRadius(node)
      node.x = Math.max(r + padding, Math.min(width - r - padding, node.x ?? width / 2))
      node.y = Math.max(r + padding, Math.min(height - r - padding, node.y ?? height / 2))
    })

    const linkLayer = root.append('g').attr('class', 'network-links')
    const nodeLayer = root.append('g').attr('class', 'network-nodes')

    linkLayer
      .selectAll('line')
      .data(graphLinks)
      .join('line')
      .attr('class', 'network-link')
      .attr('x1', (link) => link.source.x)
      .attr('y1', (link) => link.source.y)
      .attr('x2', (link) => link.target.x)
      .attr('y2', (link) => link.target.y)
      .attr('stroke-width', (link) => (link.kind === 'domain-caseStudy' ? 2.6 : 1.8))
      .attr('opacity', (link) => getLinkOpacity(link, activeNodeId))

    const nodes = nodeLayer
      .selectAll('g')
      .data(graphNodes)
      .join('g')
      .attr('class', 'network-node')
      .attr('transform', (node) => `translate(${node.x}, ${node.y})`)
      .attr('tabindex', 0)
      .attr('role', 'button')
      .attr('aria-label', (node) => `${node.label}, ${node.type}`)
      .attr('opacity', (node) => getNodeOpacity(node, activeNodeId, relatedIds))
      .on('mouseenter', (event, node) => {
        setActiveNodeId(node.id)
        showTooltip(event, node)
      })
      .on('mousemove', (event, node) => showTooltip(event, node))
      .on('mouseleave', () => {
        setActiveNodeId(defaultNodeId)
        clearTooltip()
      })
      .on('focus', (event, node) => {
        setActiveNodeId(node.id)
        showTooltip(resolveFocusPointer(event, node, width, height), node)
      })
      .on('blur', () => {
        setActiveNodeId(defaultNodeId)
        clearTooltip()
      })
      .on('keydown', (event, node) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          setActiveNodeId(node.id)
          showTooltip(resolveFocusPointer(event, node, width, height), node)
        }
      })
      .on('keyup', (event) => {
        if (event.key === 'Escape') {
          setActiveNodeId(defaultNodeId)
          clearTooltip()
        }
      })

    nodes
      .append('circle')
      .attr('class', 'network-node-core')
      .attr('r', (node) => getNodeRadius(node))
      .attr('fill', (node) => nodeColors[node.type])

    nodes
      .append('circle')
      .attr('class', 'network-node-halo')
      .attr('r', (node) => getNodeRadius(node) + 8)
      .attr('fill', (node) => nodeColors[node.type])

    nodes
      .append('text')
      .attr('class', 'network-label')
      .attr('text-anchor', 'middle')
      .each(function wrapLabels(node) {
        renderNodeLabel(d3.select(this), node)
      })

    return () => {
      simulation.stop()
    }
  }, [activeNodeId, bounds.height, bounds.width, defaultNodeId, nodeColors, topology])

  const activeNode = topology.nodes.find((node) => node.id === activeNodeId) ?? topology.nodes[0] ?? null
  const relatedContent = activeNode ? buildInspectorContent(topology, activeNode.id) : { caseStudies: [], stackTags: [] }

  if (topology.nodes.length === 0) {
    return (
      <div className="network-empty">
        <h4 className="card-title">No network nodes yet</h4>
        <p className="card-copy">Add research cases to render the topology view.</p>
      </div>
    )
  }

  return (
    <div className="network-shell">
      <div className="network-header">
        <div>
          <p className="section-kicker">Interactive topology</p>
          <h3 className="section-title network-title">Behavioral Network Topology</h3>
        </div>
        <p className="network-meta">Hover a domain, study, or stack tag to illuminate the surrounding knowledge graph.</p>
      </div>

      <div className="network-stage" ref={containerRef}>
        <svg className="network-svg" ref={svgRef} />
        <div
          className={tooltip ? 'network-tooltip visible' : 'network-tooltip'}
          style={tooltip ? { left: `${tooltip.left}px`, top: `${tooltip.top}px` } : undefined}
          aria-hidden="true"
        >
          {tooltip ? (
            <>
              <span className="network-tooltip-label">{tooltip.label}</span>
              <strong className="network-tooltip-title">{tooltip.title}</strong>
              <span className="network-tooltip-copy">{tooltip.copy}</span>
              <span className="network-tooltip-meta">{tooltip.meta}</span>
            </>
          ) : null}
        </div>
      </div>

      <div className="network-legend" aria-label="Network legend">
        <span className="network-legend-item">
          <span className="network-legend-swatch domain" />
          Core domains
        </span>
        <span className="network-legend-item">
          <span className="network-legend-swatch caseStudy" />
          Related case studies
        </span>
        <span className="network-legend-item">
          <span className="network-legend-swatch stack" />
          Tech stack tags
        </span>
      </div>

      {activeNode ? (
        <div className="network-inspector">
          <div className="network-inspector-copy">
            <p className="small-label">Focused node</p>
            <h4 className="card-title">{activeNode.label}</h4>
            <p className="card-copy">{activeNode.summary}</p>
          </div>

          <div className="network-related-grid">
            <div className="surface-subpanel compact-panel">
              <p className="small-label">Related case studies</p>
              <div className="chip-row">
                {relatedContent.caseStudies.map((item) => (
                  <span key={item.id} className="chip">
                    {item.label}
                  </span>
                ))}
              </div>
            </div>
            <div className="surface-subpanel compact-panel">
              <p className="small-label">Tech stack tags</p>
              <div className="chip-row">
                {relatedContent.stackTags.map((item) => (
                  <span key={item.id} className="chip">
                    {item.label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <div className="network-footnote">
        <p className="hero-meta">The graph clusters domain expertise, portfolio narratives, and implementation stack into one executive view.</p>
      </div>
    </div>
  )
}

function readNodeColors() {
  if (typeof window === 'undefined') {
    return FALLBACK_NODE_COLORS
  }

  const styles = window.getComputedStyle(document.documentElement)

  return {
    domain: styles.getPropertyValue('--data-domain').trim() || FALLBACK_NODE_COLORS.domain,
    caseStudy: styles.getPropertyValue('--data-case-study').trim() || FALLBACK_NODE_COLORS.caseStudy,
    stack: styles.getPropertyValue('--data-stack').trim() || FALLBACK_NODE_COLORS.stack,
  }
}

function buildTooltipMeta(topology, node) {
  const relatedIds = getRelatedNodeIds(topology.links, node.id)
  const relatedNodes = topology.nodes.filter((candidate) => relatedIds.has(candidate.id))
  const caseStudyCount = relatedNodes.filter((candidate) => candidate.type === 'caseStudy').length
  const stackCount = relatedNodes.filter((candidate) => candidate.type === 'stack').length
  const domainCount = relatedNodes.filter((candidate) => candidate.type === 'domain').length

  if (node.type === 'domain') {
    return `${caseStudyCount} linked case ${caseStudyCount === 1 ? 'study' : 'studies'} • ${stackCount} stack ${stackCount === 1 ? 'signal' : 'signals'}`
  }

  if (node.type === 'caseStudy') {
    return `${domainCount} linked domain ${domainCount === 1 ? 'cluster' : 'clusters'} • ${stackCount} stack ${stackCount === 1 ? 'signal' : 'signals'}`
  }

  return `${caseStudyCount} related case ${caseStudyCount === 1 ? 'study' : 'studies'} • ${domainCount} supporting domain ${domainCount === 1 ? 'cluster' : 'clusters'}`
}

function resolveFocusPointer(event, node, width, height) {
  const currentTarget = event.currentTarget
  const [translateX = width / 2, translateY = height / 2] = (currentTarget?.getAttribute('transform') ?? '')
    .match(/translate\(([^,]+),\s*([^)]+)\)/)
    ?.slice(1)
    .map((value) => Number.parseFloat(value)) ?? [node.x ?? width / 2, node.y ?? height / 2]

  return {
    clientX: translateX,
    clientY: translateY,
  }
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}

function buildTopology(caseStudies) {
  const domainNodes = Object.entries(DOMAIN_DETAILS).map(([label, summary], index) => ({
    id: `domain-${index}`,
    label,
    summary,
    type: 'domain',
  }))

  const stackCounts = new Map()
  caseStudies.forEach((study) => {
    study.techStack.forEach((tag) => {
      stackCounts.set(tag, (stackCounts.get(tag) ?? 0) + 1)
    })
  })

  const featuredTags = [...stackCounts.entries()]
    .sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]))
    .slice(0, 8)
    .map(([label, count], index) => ({
      id: `stack-${index}`,
      label,
      summary: `Appears across ${count} featured initiative${count === 1 ? '' : 's'} in the portfolio stack.`,
      type: 'stack',
    }))

  const stackIdByLabel = new Map(featuredTags.map((tag) => [tag.label, tag.id]))
  const caseStudyNodes = caseStudies.map((study, index) => ({
    id: `case-${index}`,
    label: study.title,
    summary: study.summary,
    type: 'caseStudy',
  }))
  const domainIdByLabel = new Map(domainNodes.map((node) => [node.label, node.id]))
  const caseStudyIdByTitle = new Map(caseStudyNodes.map((node) => [node.label, node.id]))
  const links = []

  caseStudies.forEach((study) => {
    const caseStudyId = caseStudyIdByTitle.get(study.title)
    study.domains.forEach((domainLabel) => {
      const domainId = domainIdByLabel.get(domainLabel)
      if (caseStudyId && domainId) {
        links.push({
          source: domainId,
          target: caseStudyId,
          kind: 'domain-caseStudy',
        })
      }
    })

    study.techStack
      .filter((tag) => stackIdByLabel.has(tag))
      .slice(0, 4)
      .forEach((tag) => {
        links.push({
          source: caseStudyId,
          target: stackIdByLabel.get(tag),
          kind: 'caseStudy-stack',
        })
      })
  })

  return {
    nodes: [...domainNodes, ...caseStudyNodes, ...featuredTags],
    links,
  }
}

function buildInspectorContent(topology, activeNodeId) {
  const relatedIds = getRelatedNodeIds(topology.links, activeNodeId)
  const nodesById = new Map(topology.nodes.map((node) => [node.id, node]))
  const relatedNodes = [...relatedIds]
    .map((id) => nodesById.get(id))
    .filter(Boolean)

  const caseStudies = relatedNodes.filter((node) => node.type === 'caseStudy')
  const stackTags = relatedNodes.filter((node) => node.type === 'stack')

  if (nodesById.get(activeNodeId)?.type === 'caseStudy') {
    const activeStudy = nodesById.get(activeNodeId)
    return {
      caseStudies: activeStudy ? [activeStudy] : [],
      stackTags,
    }
  }

  return {
    caseStudies,
    stackTags,
  }
}

function buildBackgroundNodes(width, height) {
  return [
    { x: width * 0.5, y: height * 0.5, radius: Math.min(width, height) * 0.34 },
    { x: width * 0.28, y: height * 0.3, radius: Math.min(width, height) * 0.14 },
    { x: width * 0.74, y: height * 0.68, radius: Math.min(width, height) * 0.18 },
  ]
}

function getNodeOpacity(node, activeNodeId, relatedIds) {
  if (!activeNodeId) {
    return 1
  }

  if (node.id === activeNodeId || relatedIds.has(node.id)) {
    return 1
  }

  return 0.22
}

function getLinkOpacity(link, activeNodeId) {
  if (!activeNodeId) {
    return link.kind === 'domain-caseStudy' ? 0.64 : 0.34
  }

  const sourceId = typeof link.source === 'object' ? link.source.id : link.source
  const targetId = typeof link.target === 'object' ? link.target.id : link.target
  return sourceId === activeNodeId || targetId === activeNodeId ? 0.95 : 0.12
}

function getRelatedNodeIds(links, nodeId) {
  const related = new Set()

  links.forEach((link) => {
    const sourceId = typeof link.source === 'object' ? link.source.id : link.source
    const targetId = typeof link.target === 'object' ? link.target.id : link.target

    if (sourceId === nodeId) {
      related.add(targetId)
    }

    if (targetId === nodeId) {
      related.add(sourceId)
    }
  })

  return related
}

function getNodeRadius(node) {
  if (node.type === 'domain') {
    return 26
  }

  if (node.type === 'caseStudy') {
    return 20
  }

  return 14
}

function getTargetX(node, width) {
  if (node.type === 'domain') {
    const map = {
      'Computer Vision': width * 0.32,
      'Behavioral Tracking': width * 0.5,
      'Statistical Modeling': width * 0.68,
      'Core Infrastructure': width * 0.5,
    }
    return map[node.label] ?? width * 0.5
  }

  return width * 0.5
}

function getTargetY(node, height) {
  if (node.type === 'domain') {
    const map = {
      'Computer Vision': height * 0.32,
      'Behavioral Tracking': height * 0.22,
      'Statistical Modeling': height * 0.32,
      'Core Infrastructure': height * 0.64,
    }
    return map[node.label] ?? height * 0.5
  }

  if (node.type === 'caseStudy') {
    return height * 0.5
  }

  return height * 0.8
}

function linkDistance(link) {
  return link.kind === 'domain-caseStudy' ? 118 : 88
}

function linkStrength(link) {
  return link.kind === 'domain-caseStudy' ? 0.54 : 0.42
}

function renderNodeLabel(selection, node) {
  const words = node.label.split(' ')
  const lines = []
  let currentLine = ''

  words.forEach((word) => {
    const nextLine = currentLine ? `${currentLine} ${word}` : word
    if (nextLine.length <= 16) {
      currentLine = nextLine
      return
    }

    if (currentLine) {
      lines.push(currentLine)
    }
    currentLine = word
  })

  if (currentLine) {
    lines.push(currentLine)
  }

  const yOffset = getNodeRadius(node) + 18
  lines.slice(0, 3).forEach((line, index) => {
    selection
      .append('tspan')
      .attr('x', 0)
      .attr('y', yOffset + index * 14)
      .text(line)
  })
}

export default DashboardMetricsChart