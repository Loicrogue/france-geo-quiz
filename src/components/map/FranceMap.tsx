import { useEffect, useRef } from 'react'
import * as d3 from 'd3'
import type { FeatureCollection, Feature, Geometry } from 'geojson'

interface DepartmentProperties {
  code: string
  nom: string
}

interface FranceMapProps {
  highlightedCode?: string
  onDepartmentClick?: (code: string, name: string) => void
  wrongCodes?: string[]
  correctCode?: string
  revealCode?: string
  previousCorrectCodes?: string[]
  previousWrongCodes?: string[]
}

const WIDTH = 800
const HEIGHT = 800

export default function FranceMap({
  highlightedCode,
  onDepartmentClick,
  wrongCodes = [],
  correctCode,
  revealCode,
  previousCorrectCodes = [],
  previousWrongCodes = [],
}: FranceMapProps) {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const loadMap = async () => {
      const geojson: FeatureCollection = await fetch('/departments.geojson').then(r => r.json())

      const svg = d3.select(svgRef.current)
      svg.selectAll('*').remove()

      const projection = d3.geoConicConformal()
        .center([2.454071, 46.279229])
        .scale(4200)
        .translate([WIDTH / 2, HEIGHT / 2])

      const path = d3.geoPath().projection(projection)
      const g = svg.append('g')

      const getFill = (code: string) => {
        // Résultat courant en priorité
        if (code === correctCode) return '#22c55e'
        if (code === revealCode) return '#f97316'
        if (wrongCodes.includes(code)) return '#f87171'
        // Département actuel en bleu
        if (code === highlightedCode) return '#3b82f6'
        // Historique — version plus claire pour ne pas écraser le courant
        if (previousCorrectCodes.includes(code)) return '#22c55e'
        if (previousWrongCodes.includes(code)) return '#f87171'
        return '#e2e8f0'
      }

      g.selectAll('path')
        .data(geojson.features)
        .join('path')
        .attr('d', feature => path(feature as Feature<Geometry>)!)
        .attr('fill', feature => getFill((feature.properties as DepartmentProperties).code))
        .attr('stroke', '#fff')
        .attr('stroke-width', 0.8)
        .style('cursor', onDepartmentClick ? 'pointer' : 'default')
        .on('click', (_, feature) => {
          if (!onDepartmentClick) return
          const props = feature.properties as DepartmentProperties
          onDepartmentClick(props.code, props.nom)
        })
        .on('mouseover', function (_, feature) {
          const code = (feature.properties as DepartmentProperties).code
          if (
            code !== highlightedCode &&
            code !== correctCode &&
            code !== revealCode &&
            !wrongCodes.includes(code) &&
            !previousCorrectCodes.includes(code) &&
            !previousWrongCodes.includes(code)
          ) {
            d3.select(this).attr('fill', '#93c5fd')
          }
        })
        .on('mouseout', function (_, feature) {
          const code = (feature.properties as DepartmentProperties).code
          d3.select(this).attr('fill', getFill(code))
        })

      g.selectAll('text')
        .data(geojson.features)
        .join('text')
        .attr('transform', feature => {
          const centroid = path.centroid(feature as Feature<Geometry>)
          return `translate(${centroid})`
        })
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'central')
        .attr('font-size', '12px')
        .attr('font-weight', 600)
        .attr('fill', '#1e3a5f')
        .attr('pointer-events', 'none')
        .text(feature => (feature.properties as DepartmentProperties).code)
    }

    loadMap()
  }, [highlightedCode, wrongCodes, correctCode, revealCode, previousCorrectCodes, previousWrongCodes, onDepartmentClick])

  return (
    <svg
      ref={svgRef}
      className="w-full h-full"
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      preserveAspectRatio="xMidYMid meet"
    />
  )
}