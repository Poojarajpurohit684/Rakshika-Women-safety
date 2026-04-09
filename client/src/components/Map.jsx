import { useEffect, useRef, useCallback } from 'react'

const GOOGLE_MAPS_KEY = import.meta.env.VITE_GOOGLE_MAPS_KEY || ''

/** Rakshika day mode — lavender roads, soft land, readable labels */
const LIGHT_MAP_STYLES = [
  { featureType: 'poi.business', stylers: [{ visibility: 'off' }] },
  { featureType: 'poi.park', elementType: 'labels.text', stylers: [{ visibility: 'off' }] },
  { featureType: 'transit', elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#d4cbf0' }] },
  { featureType: 'landscape', elementType: 'geometry', stylers: [{ color: '#f0eaf8' }] },
  { featureType: 'landscape.man_made', elementType: 'geometry', stylers: [{ color: '#ebe4f5' }] },
  { featureType: 'road', elementType: 'geometry.fill', stylers: [{ color: '#fffdff' }] },
  { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#e3daf4' }] },
  { featureType: 'road.highway', elementType: 'geometry.fill', stylers: [{ color: '#faf6ff' }] },
  { featureType: 'road.highway', elementType: 'geometry.stroke', stylers: [{ color: '#cfc2e8' }] },
  { featureType: 'road.local', elementType: 'geometry.fill', stylers: [{ color: '#ffffff' }] },
  { featureType: 'administrative.locality', elementType: 'labels.text.fill', stylers: [{ color: '#5b3d7a' }] },
]

/** Night mode aligned with #0a0008 / glass cards */
const DARK_MAP_STYLES = [
  { elementType: 'geometry', stylers: [{ color: '#1a1224' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#1a1224' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#a896c4' }] },
  { featureType: 'administrative.locality', elementType: 'labels.text.fill', stylers: [{ color: '#e8ddff' }] },
  { featureType: 'poi', elementType: 'labels.text.fill', stylers: [{ color: '#8b7aa8' }] },
  { featureType: 'poi.business', stylers: [{ visibility: 'off' }] },
  { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#231930' }] },
  { featureType: 'poi.park', elementType: 'labels.text', stylers: [{ visibility: 'off' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#2d223c' }] },
  { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#3d2f52' }] },
  { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#4a3862' }] },
  { featureType: 'road.highway', elementType: 'geometry.stroke', stylers: [{ color: '#352848' }] },
  { featureType: 'transit', stylers: [{ visibility: 'off' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#120c1a' }] },
]

function getMapStyles(isDark) {
  return isDark ? DARK_MAP_STYLES : LIGHT_MAP_STYLES
}

/**
 * @param {{ center?: [number, number] | null; markers?: Array<{ lat: number; lng: number; color?: string }>; isDark?: boolean }} props
 */
export default function Map({ center, markers = [], isDark = true }) {
  const ref = useRef(null)
  const mapRef = useRef(null)
  const markerRefs = useRef([])
  const markersRef = useRef(markers)
  const isDarkRef = useRef(isDark)
  const centerRef = useRef(center)
  markersRef.current = markers
  isDarkRef.current = isDark
  centerRef.current = center

  const updateMarkers = useCallback(() => {
    if (!mapRef.current || !window.google?.maps) return

    markerRefs.current.forEach((m) => m.setMap(null))
    markerRefs.current = []

    const dark = isDarkRef.current
    const accent = dark ? '#ff5c8a' : '#e91e8c'
    const stroke = dark ? '#1a1224' : '#ffffff'

    markersRef.current.forEach((m, idx) => {
      try {
        const marker = new window.google.maps.Marker({
          position: { lat: m.lat, lng: m.lng },
          map: mapRef.current,
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            fillColor: m.color || accent,
            fillOpacity: 0.95,
            strokeWeight: 2,
            strokeColor: stroke,
            scale: 8,
          },
        })
        markerRefs.current.push(marker)
      } catch (err) {
        console.error(`[Map] marker ${idx}:`, err)
      }
    })
  }, [])

  const triggerResize = useCallback(() => {
    if (mapRef.current && window.google?.maps) {
      window.google.maps.event.trigger(mapRef.current, 'resize')
    }
  }, [])

  useEffect(() => {
    if (!GOOGLE_MAPS_KEY) return

    const mountEl = ref.current
    let cancelled = false

    const renderMap = () => {
      if (cancelled || !mountEl || mapRef.current || !window.google?.maps) return

      const c0 = centerRef.current
      const c = c0 ? { lat: c0[0], lng: c0[1] } : { lat: 28.6139, lng: 77.209 }

      try {
        const map = new window.google.maps.Map(mountEl, {
          center: c,
          zoom: c0 ? 16 : 12,
          disableDefaultUI: false,
          zoomControl: true,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
          gestureHandling: 'greedy',
          styles: getMapStyles(isDarkRef.current),
        })
        mapRef.current = map

        requestAnimationFrame(() => {
          triggerResize()
          map.setCenter(c)
        })

        updateMarkers()
      } catch (err) {
        console.error('[Map] init:', err)
      }
    }

    const scriptId = 'google-maps-script'
    const existingScript = document.getElementById(scriptId)
    /** @type {(() => void) | null} */
    let mapsLoadHandler = null

    if (window.google?.maps) {
      renderMap()
    } else if (!existingScript) {
      const script = document.createElement('script')
      script.id = scriptId
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_KEY}`
      script.async = true
      script.defer = true
      script.onload = () => {
        if (!cancelled) renderMap()
      }
      script.onerror = () => console.error('[Map] script failed')
      document.head.appendChild(script)
    } else {
      mapsLoadHandler = () => {
        if (!cancelled) renderMap()
      }
      existingScript.addEventListener('load', mapsLoadHandler)
      if (window.google?.maps) mapsLoadHandler()
    }

    const onWinResize = () => {
      triggerResize()
      const cur = centerRef.current
      if (mapRef.current && cur) {
        mapRef.current.setCenter({ lat: cur[0], lng: cur[1] })
      }
    }
    window.addEventListener('resize', onWinResize)

    return () => {
      cancelled = true
      window.removeEventListener('resize', onWinResize)
      markerRefs.current.forEach((m) => m.setMap(null))
      markerRefs.current = []
      mapRef.current = null
      if (mountEl) mountEl.innerHTML = ''
    }
  }, [triggerResize, updateMarkers])

  useEffect(() => {
    if (!mapRef.current || !window.google?.maps) return
    mapRef.current.setOptions({ styles: getMapStyles(isDark) })
    triggerResize()
    updateMarkers()
  }, [isDark, triggerResize, updateMarkers])

  useEffect(() => {
    if (!mapRef.current || !center) return
    const next = { lat: center[0], lng: center[1] }
    const cur = mapRef.current.getCenter()
    if (!cur) return
    if (
      Math.abs(cur.lat() - next.lat) > 0.00005 ||
      Math.abs(cur.lng() - next.lng) > 0.00005
    ) {
      mapRef.current.panTo(next)
      mapRef.current.setZoom(16)
    }
  }, [center])

  useEffect(() => {
    updateMarkers()
  }, [markers, updateMarkers])

  const placeholderBg = isDark ? '#1a1224' : '#f3eefc'
  const placeholderBorder = isDark ? 'rgba(255,255,255,0.12)' : 'rgba(233,30,140,0.16)'
  const placeholderColor = isDark ? '#ff4da6' : '#9d3d7a'

  if (!GOOGLE_MAPS_KEY) {
    return (
      <div
        className="flex h-full min-h-[220px] w-full items-center justify-center px-4 text-center text-xs font-bold leading-relaxed"
        style={{
          background: placeholderBg,
          color: placeholderColor,
          borderBottom: `1px solid ${placeholderBorder}`,
        }}
      >
        Add VITE_GOOGLE_MAPS_KEY in client/.env to show the live map.
      </div>
    )
  }

  return (
    <div
      ref={ref}
      className="h-full w-full min-h-[220px] overflow-hidden"
      style={{
        borderBottom: `1px solid ${placeholderBorder}`,
      }}
    />
  )
}
