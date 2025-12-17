# Building Interactive Maps with Mapbox GL JS: A Comprehensive Guide

This guide provides a deep dive into Mapbox GL JS, covering everything you need to understand how to work with interactive maps, markers, popups, and advanced features. The code examples are based on a real-world implementation that you can explore in the [repository](https://github.com/Davisonpro/mapbox-globe-viewer).

---

## Part 1: Understanding the Map Component

### Introduction to Mapbox GL JS

Mapbox GL JS is a JavaScript library for rendering interactive, customizable maps in web browsers. It uses WebGL for hardware-accelerated rendering, making it performant even with thousands of markers and complex visualizations.

### Core Map Initialization

The foundation of any Mapbox GL JS application is the `Map` component (or `mapboxgl.Map` in vanilla JS). Here's what you need to know:

#### Basic Map Setup

```javascript
import Map from "react-map-gl";

<Map
  mapboxAccessToken="your-token-here"
  mapStyle="mapbox://styles/mapbox/outdoors-v12"
  longitude={0}
  latitude={20}
  zoom={2.5}
/>
```

**Key Properties:**
- `mapboxAccessToken`: Your Mapbox access token (required)
- `mapStyle`: The style URL defining the map's appearance
- `longitude`: Initial center longitude (-180 to 180)
- `latitude`: Initial center latitude (-90 to 90)
- `zoom`: Initial zoom level (0 = world view, higher = more zoomed in)

### Understanding ViewState

The `viewState` is a critical concept in Mapbox GL JS. It represents the current camera position and viewport of the map.

```javascript
const [viewState, setViewState] = useState({
  longitude: 0,
  latitude: 20,
  zoom: 2.5,
  pitch: 0,      // Tilt angle (0-60 degrees)
  bearing: 0,   // Rotation angle (0-360 degrees)
});
```

**ViewState Properties:**
- `longitude` / `latitude`: Map center coordinates
- `zoom`: Zoom level (typically 0-22)
- `pitch`: 3D tilt (0 = top-down, 60 = angled view)
- `bearing`: Rotation in degrees (0 = north up)

**Updating ViewState:**

```javascript
// Controlled component approach
<Map
  {...viewState}
  onMove={(e) => setViewState(e.viewState)}
/>

// The event object contains the new viewState
// e.viewState = { longitude, latitude, zoom, pitch, bearing }
```

### Map Projections

Mapbox GL JS supports different map projections, which determine how the Earth's surface is represented:

#### Globe Projection

```javascript
<Map
  projection="globe"
  // ... other props
/>
```

The globe projection renders the Earth as a 3D sphere. This is ideal for:
- Global visualizations
- Showing worldwide data
- Creating immersive experiences

**Key Characteristics:**
- Spherical representation
- Supports fog effects for atmosphere
- Better for global context
- More computationally intensive

#### Mercator Projection (Default)

```javascript
<Map
  projection="mercator"
  // or simply omit the projection prop
/>
```

The Mercator projection is a flat, cylindrical map projection. It's best for:
- Regional or local maps
- Navigation applications
- When you need precise measurements
- Better performance for detailed views

**Switching Between Projections:**

```javascript
const [viewMode, setViewMode] = useState("globe");

<Map
  projection={viewMode === "globe" ? "globe" : "mercator"}
  // ... other props
/>
```

### Fog Configuration

Fog is a visual effect that creates atmospheric perspective, making distant areas appear faded. It's only available with globe projection.

```javascript
<Map
  projection="globe"
  fog={{
    range: [0.8, 8],        // Distance range for fog effect
    "horizon-blend": 0.1,   // Blending at horizon (0-1)
    color: "#2d5016"        // Fog color (hex)
  }}
/>
```

**Fog Properties:**
- `range`: `[near, far]` - Distance in degrees where fog starts and ends
  - Lower values = fog starts closer
  - Higher values = fog extends further
- `horizon-blend`: How smoothly fog blends (0 = sharp, 1 = smooth)
- `color`: The color of the fog effect (should match your map style)

**Example Fog Configurations:**

```javascript
// Green terrain (outdoors style)
fog: {
  range: [0.8, 8],
  "horizon-blend": 0.1,
  color: "#2d5016"
}

// Satellite imagery
fog: {
  range: [0.8, 8],
  "horizon-blend": 0.1,
  color: "#87CEEB"  // Sky blue
}

// Dark theme
fog: {
  range: [0.8, 8],
  "horizon-blend": 0.1,
  color: "#242B4B"  // Dark blue
}
```

### Map Events

Mapbox GL JS provides numerous events for handling user interactions:

#### Movement Events

```javascript
<Map
  onMove={(e) => {
    // Fires continuously as user pans/zooms
    console.log(e.viewState);
  }}
  onMoveStart={(e) => {
    // Fires when movement begins
  }}
  onMoveEnd={(e) => {
    // Fires when movement stops
  }}
/>
```

#### Click Events

```javascript
<Map
  onClick={(e) => {
    // e.lngLat = { lng, lat } - clicked coordinates
    console.log("Clicked at:", e.lngLat);
  }}
/>
```

#### Load Event

```javascript
<Map
  onLoad={() => {
    // Fires when map finishes loading
    // Use this to ensure map is ready for operations
  }}
/>
```

#### Other Useful Events

```javascript
<Map
  onZoom={(e) => {
    // Fires on zoom changes
  }}
  onRotate={(e) => {
    // Fires on rotation
  }}
  onPitch={(e) => {
    // Fires on pitch changes
  }}
/>
```

### Programmatic Map Control

You can control the map programmatically using a ref:

```javascript
const mapRef = useRef(null);

<Map ref={mapRef} />

// Later, control the map:
mapRef.current.flyTo({
  center: [longitude, latitude],
  zoom: 10,
  duration: 1000,      // Animation duration in ms
  essential: true      // Animation can be interrupted
});
```

**flyTo Options:**
- `center`: `[longitude, latitude]` - Target center
- `zoom`: Target zoom level
- `bearing`: Target rotation
- `pitch`: Target pitch angle
- `duration`: Animation time in milliseconds
- `essential`: If true, animation respects prefers-reduced-motion

**Other Map Methods:**

```javascript
const map = mapRef.current.getMap();

// Get current bounds
const bounds = map.getBounds();
// Returns: { getNorthEast(), getSouthWest(), getNorthWest(), getSouthEast() }

// Get current zoom
const zoom = map.getZoom();

// Get current center
const center = map.getCenter();
// Returns: { lng, lat }

// Jump to position (no animation)
map.jumpTo({
  center: [lng, lat],
  zoom: 10
});

// Ease to position (smooth animation)
map.easeTo({
  center: [lng, lat],
  zoom: 10,
  duration: 1000
});
```

### Map Bounds

Getting the visible map bounds is essential for filtering data:

```javascript
const getMapBounds = (mapRef) => {
  if (!mapRef.current?.getMap) return null;
  
  try {
    const map = mapRef.current.getMap();
    const bounds = map.getBounds();
    
    const ne = bounds.getNorthEast();  // { lng, lat }
    const sw = bounds.getSouthWest();   // { lng, lat }
    
    // Return as [west, south, east, north]
    return [sw.lng, sw.lat, ne.lng, ne.lat];
  } catch (error) {
    return null;
  }
};
```

**Use Cases:**
- Filtering markers to only show visible ones
- Clustering calculations
- Performance optimization
- Data fetching based on viewport

---

## Part 2: Map Styles and Types

### Understanding Map Styles

Map styles define the visual appearance of your map. Mapbox provides several built-in styles, and you can also create custom styles using Mapbox Studio.

### Built-in Map Styles

Mapbox offers several pre-built styles, each optimized for different use cases:

#### Outdoors Style

```javascript
mapStyle="mapbox://styles/mapbox/outdoors-v12"
```

**Best for:**
- Hiking and outdoor activities
- Terrain visualization
- Natural landscapes
- Green/earth-tone aesthetics

**Fog Color:** `#2d5016` (dark green)

#### Satellite Style

```javascript
mapStyle="mapbox://styles/mapbox/satellite-streets-v12"
```

**Best for:**
- Real-world imagery
- Geographic context
- Aerial views
- Combining satellite with street labels

**Fog Color:** `#87CEEB` (sky blue)

#### Light Style

```javascript
mapStyle="mapbox://styles/mapbox/light-v11"
```

**Best for:**
- Data visualization overlays
- Minimal, clean interfaces
- Light-themed applications
- When you want data to stand out

**Fog Color:** `#5d689c` (medium blue)

#### Dark Style

```javascript
mapStyle="mapbox://styles/mapbox/dark-v11"
```

**Best for:**
- Dark mode applications
- Night-time visualizations
- Modern, sleek interfaces
- Reducing eye strain

**Fog Color:** `#242B4B` (dark blue)

### Switching Map Styles

Here's how to implement dynamic style switching:

```javascript
const MAP_STYLES = {
  OUTDOORS: "mapbox://styles/mapbox/outdoors-v12",
  SATELLITE: "mapbox://styles/mapbox/satellite-streets-v12",
  LIGHT: "mapbox://styles/mapbox/light-v11",
  DARK: "mapbox://styles/mapbox/dark-v11",
};

const [mapStyle, setMapStyle] = useState("outdoors");

const getMapStyleUrl = () => {
  const styleMap = {
    outdoors: MAP_STYLES.OUTDOORS,
    satellite: MAP_STYLES.SATELLITE,
    light: MAP_STYLES.LIGHT,
    dark: MAP_STYLES.DARK,
  };
  return styleMap[mapStyle] || MAP_STYLES.OUTDOORS;
};

<Map
  mapStyle={getMapStyleUrl()}
  // ... other props
/>
```

### Matching Fog Colors to Styles

When using globe projection, matching fog colors to your map style creates a cohesive visual experience:

```javascript
const FOG_COLORS = {
  outdoors: "#2d5016",  // Dark green for terrain
  satellite: "#87CEEB",  // Sky blue for aerial
  light: "#5d689c",     // Medium blue for light theme
  dark: "#242B4B",      // Dark blue for dark theme
};

const getFogColor = (mapStyle) => {
  return FOG_COLORS[mapStyle] || FOG_COLORS.outdoors;
};

<Map
  projection="globe"
  fog={{
    range: [0.8, 8],
    "horizon-blend": 0.1,
    color: getFogColor(mapStyle)
  }}
/>
```

### Custom Style Configuration Hook

A reusable hook for managing map configuration:

```javascript
import { useCallback } from "react";

export const useMapConfig = (mapStyle) => {
  const getMapStyleUrl = useCallback(() => {
    const styleMap = {
      outdoors: "mapbox://styles/mapbox/outdoors-v12",
      satellite: "mapbox://styles/mapbox/satellite-streets-v12",
      light: "mapbox://styles/mapbox/light-v11",
      dark: "mapbox://styles/mapbox/dark-v11",
    };
    return styleMap[mapStyle] || styleMap.outdoors;
  }, [mapStyle]);

  const getFogColor = useCallback(() => {
    const fogColors = {
      outdoors: "#2d5016",
      satellite: "#87CEEB",
      light: "#5d689c",
      dark: "#242B4B",
    };
    return fogColors[mapStyle] || fogColors.outdoors;
  }, [mapStyle]);

  return { getMapStyleUrl, getFogColor };
};

// Usage
const { getMapStyleUrl, getFogColor } = useMapConfig(mapStyle);
```

### View Modes: Globe vs Flat

Combining projection switching with style management:

```javascript
const [viewMode, setViewMode] = useState("globe");
const [mapStyle, setMapStyle] = useState("outdoors");

<Map
  projection={viewMode === "globe" ? "globe" : "mercator"}
  mapStyle={getMapStyleUrl()}
  fog={
    viewMode === "globe"
      ? {
          range: [0.8, 8],
          "horizon-blend": 0.1,
          color: getFogColor(),
        }
      : undefined
  }
/>
```

**When to Use Each:**
- **Globe**: Global data, worldwide visualizations, immersive experiences
- **Flat (Mercator)**: Regional views, navigation, detailed local maps

### Style Transitions

Mapbox automatically handles style transitions, but you can control them:

```javascript
// The map will smoothly transition between styles
setMapStyle("dark"); // Automatically animates style change
```

**Note:** Style changes are seamless - Mapbox handles the transition automatically.

---

## Part 3: Markers, Popups, and Data Filtering

### Understanding Markers

Markers are the primary way to display points of interest on your map. In react-map-gl, markers are React components positioned at specific coordinates.

### Basic Marker Implementation

```javascript
import { Marker } from "react-map-gl";

<Marker
  longitude={-74.006}
  latitude={40.7128}
  anchor="bottom"
>
  <div>Your marker content</div>
</Marker>
```

**Marker Properties:**
- `longitude` / `latitude`: Marker position (required)
- `anchor`: Positioning point relative to marker
  - `"center"`: Center of marker
  - `"top"`: Top center
  - `"bottom"`: Bottom center
  - `"left"`: Left center
  - `"right"`: Right center
  - Or custom: `{ x: 0.5, y: 1 }` (0-1 normalized coordinates)
- `offset`: Pixel offset `[x, y]` from anchor point
- `pitchAlignment`: How marker rotates with map pitch
  - `"map"`: Rotates with map
  - `"viewport"`: Stays upright
  - `"auto"`: Automatic
- `rotationAlignment`: How marker rotates with map bearing
  - `"map"`: Rotates with map
  - `"viewport"`: Stays upright
  - `"auto"`: Automatic

### Marker Click Events

```javascript
<Marker
  longitude={visitor.longitude}
  latitude={visitor.latitude}
  onClick={(e) => {
    e.originalEvent.stopPropagation(); // Prevent map click
    handleMarkerClick(visitor);
  }}
>
  <div>Marker Content</div>
</Marker>
```

**Event Handling:**
- `e.originalEvent`: Original DOM event
- `stopPropagation()`: Prevents event bubbling to map
- Use this to handle marker clicks separately from map clicks

### Custom Marker Component

```javascript
export const Marker = ({ visitor, isSelected, onClick }) => {
  const handleClick = (e) => {
    e.originalEvent.stopPropagation();
    onClick(visitor);
  };

  return (
    <MapboxMarker
      longitude={visitor.longitude}
      latitude={visitor.latitude}
      anchor="bottom"
      onClick={handleClick}
    >
      <div className={`marker ${isSelected ? "selected" : ""}`}>
        {/* Custom marker UI */}
      </div>
    </MapboxMarker>
  );
};
```

### Understanding Popups

Popups display information when a marker is clicked. They're positioned relative to a coordinate and can contain any React content.

### Basic Popup Implementation

```javascript
import { Popup } from "react-map-gl";

<Popup
  longitude={-74.006}
  latitude={40.7128}
  anchor="top-left"
  onClose={() => setSelectedMarker(null)}
>
  <div>Popup content</div>
</Popup>
```

**Popup Properties:**
- `longitude` / `latitude`: Popup position (required)
- `anchor`: Where popup attaches to point
  - `"center"`, `"top"`, `"bottom"`, `"left"`, `"right"`
  - `"top-left"`, `"top-right"`, `"bottom-left"`, `"bottom-right"`
- `offset`: Pixel offset `[x, y]` from anchor
- `maxWidth`: Maximum width (CSS value like `"300px"`)
- `closeOnClick`: Close when map is clicked (boolean)
- `closeButton`: Show default close button (boolean)
- `onClose`: Callback when popup closes

### Popup Positioning

```javascript
const POPUP_CONFIG = {
  anchor: "top-left",      // Where popup attaches
  offset: [-40, -68],      // Pixel offset [x, y]
  maxWidth: "500px",       // Maximum width
  closeOnClick: false,     // Don't close on map click
};

<Popup
  {...POPUP_CONFIG}
  longitude={visitor.longitude}
  latitude={visitor.latitude}
  onClose={handleClose}
>
  {/* Content */}
</Popup>
```

**Common Anchor Patterns:**
- `"top-left"` with `offset: [-40, -68]`: Above and to the left (common for markers)
- `"bottom"` with `offset: [0, -10]`: Below point
- `"right"` with `offset: [10, 0]`: To the right

### Conditional Popup Rendering

```javascript
<Map>
  {/* Only render popup if marker is selected */}
  {selectedMarker && (
    <Popup
      longitude={selectedMarker.longitude}
      latitude={selectedMarker.latitude}
      onClose={() => setSelectedMarker(null)}
    >
      <div>Marker details</div>
    </Popup>
  )}
</Map>
```

### Marker Clustering

When you have many markers, clustering groups nearby markers together for better performance and readability.

### Understanding Clustering

Clustering uses algorithms to group nearby points at lower zoom levels. As you zoom in, clusters break apart into individual markers.

### Implementing Clustering with use-supercluster

```javascript
import useSupercluster from "use-supercluster";

const useClustering = (visitors, bounds, zoom) => {
  // Convert visitors to GeoJSON format
  const points = useMemo(() => {
    return visitors.map((visitor) => ({
      type: "Feature",
      properties: {
        cluster: false,
        visitorId: visitor.visitorId,
        visitor: visitor,
      },
      geometry: {
        type: "Point",
        coordinates: [visitor.longitude, visitor.latitude],
      },
    }));
  }, [visitors]);

  // Use supercluster hook
  const { clusters, supercluster } = useSupercluster({
    points,
    bounds: bounds || undefined,
    zoom: zoom || 2,
    options: {
      radius: 60,        // Cluster radius in pixels
      maxZoom: 14,       // Max zoom to cluster
    },
  });

  return { clusters, supercluster };
};
```

**Clustering Options:**
- `radius`: Pixel radius for clustering (typically 40-80)
- `maxZoom`: Maximum zoom level to cluster (beyond this, show individual markers)
- `minZoom`: Minimum zoom to start clustering
- `minPoints`: Minimum points to form a cluster

### Rendering Clusters and Markers

```javascript
const { clusters, supercluster } = useClustering(visitors, bounds, zoom);

{clusters.map((cluster) => {
  const { cluster: isCluster, point_count } = cluster.properties;

  if (isCluster) {
    // Render cluster marker
    return (
      <ClusterMarker
        key={`cluster-${cluster.id}`}
        cluster={cluster}
        pointCount={point_count}
        onClick={handleClusterClick}
      />
    );
  }

  // Render individual marker
  const visitor = cluster.properties.visitor;
  return (
    <Marker
      key={visitor.visitorId}
      visitor={visitor}
      onClick={handleMarkerClick}
    />
  );
})}
```

### Cluster Expansion

When a user clicks a cluster, you can zoom in to expand it:

```javascript
const handleClusterClick = (cluster) => {
  if (!supercluster || !mapRef.current) return;

  // Get the zoom level needed to expand this cluster
  const expansionZoom = Math.min(
    supercluster.getClusterExpansionZoom(cluster.id) + 1,
    18 // Maximum zoom
  );

  // Fly to cluster location
  mapRef.current.flyTo({
    center: [
      cluster.geometry.coordinates[0],
      cluster.geometry.coordinates[1],
    ],
    zoom: expansionZoom,
    duration: 500,
  });
};
```

**Key Methods:**
- `supercluster.getClusterExpansionZoom(clusterId)`: Returns zoom needed to expand cluster
- Add 1 to ensure cluster breaks apart
- Cap at maximum zoom to prevent over-zooming

### Data Filtering

Filtering markers based on search queries and filters is essential for large datasets.

### Basic Filtering Logic

```javascript
const filterVisitors = (visitors, searchQuery, filters) => {
  return visitors.filter((visitor) => {
    // Search query matching
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        visitor.firstName?.toLowerCase().includes(query) ||
        visitor.lastName?.toLowerCase().includes(query) ||
        visitor.email?.toLowerCase().includes(query) ||
        visitor.city?.toLowerCase().includes(query) ||
        visitor.country?.toLowerCase().includes(query);

      if (!matchesSearch) return false;
    }

    // Country filter
    if (filters.country && visitor.country !== filters.country) {
      return false;
    }

    // Device filter
    if (filters.device && visitor.device?.type !== filters.device) {
      return false;
    }

    // Customer filter
    if (filters.customer === "customer" && !visitor.isCustomer) {
      return false;
    }
    if (filters.customer === "visitor" && visitor.isCustomer) {
      return false;
    }

    return true;
  });
};
```

### Memoized Filtering Hook

```javascript
const useVisitorFilters = (visitors, searchQuery, filters) => {
  const filteredVisitors = useMemo(() => {
    return filterVisitors(visitors, searchQuery, filters);
  }, [visitors, searchQuery, filters]);

  const uniqueCountries = useMemo(() => {
    return [...new Set(visitors.map(v => v.country))].sort();
  }, [visitors]);

  const hasActiveFilters = useMemo(() => {
    return !!(
      searchQuery ||
      filters.country ||
      filters.device ||
      filters.customer
    );
  }, [searchQuery, filters]);

  return {
    filteredVisitors,
    uniqueCountries,
    hasActiveFilters,
  };
};
```

### Combining Filtering with Clustering

```javascript
// 1. Filter visitors based on search/filters
const { filteredVisitors } = useVisitorFilters(
  allVisitors,
  searchQuery,
  filters
);

// 2. Get map bounds
const bounds = useMemo(() => {
  const map = mapRef.current?.getMap();
  if (!map) return null;
  const mapBounds = map.getBounds();
  const ne = mapBounds.getNorthEast();
  const sw = mapBounds.getSouthWest();
  return [sw.lng, sw.lat, ne.lng, ne.lat];
}, [viewState]);

// 3. Cluster filtered visitors
const { clusters } = useClustering(
  filteredVisitors,  // Only cluster filtered results
  bounds,
  Math.floor(viewState.zoom)
);
```

### Performance Optimization

**Key Optimizations:**

1. **Memoize filtered results** - Don't recalculate on every render
2. **Use bounds for clustering** - Only cluster visible markers
3. **Debounce search input** - Reduce filter calculations
4. **Limit marker rendering** - Only render visible markers

```javascript
// Debounce search for performance
const debouncedSearch = useMemo(
  () => debounce((query) => setSearchQuery(query), 300),
  []
);
```

### Advanced: Viewport-Based Filtering

Only show markers within the current viewport:

```javascript
const getVisibleMarkers = (markers, bounds) => {
  if (!bounds) return markers;

  const [west, south, east, north] = bounds;

  return markers.filter((marker) => {
    const { longitude, latitude } = marker;
    return (
      longitude >= west &&
      longitude <= east &&
      latitude >= south &&
      latitude <= north
    );
  });
};
```

### Complete Example: Filtered and Clustered Map

```javascript
function MapComponent() {
  const mapRef = useRef(null);
  const [viewState, setViewState] = useState({
    longitude: 0,
    latitude: 20,
    zoom: 2.5,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    country: "",
    device: "",
  });

  // Filter visitors
  const { filteredVisitors } = useVisitorFilters(
    allVisitors,
    searchQuery,
    filters
  );

  // Get bounds
  const bounds = useMemo(() => {
    const map = mapRef.current?.getMap();
    if (!map) return null;
    const bounds = map.getBounds();
    const ne = bounds.getNorthEast();
    const sw = bounds.getSouthWest();
    return [sw.lng, sw.lat, ne.lng, ne.lat];
  }, [viewState]);

  // Cluster
  const { clusters, supercluster } = useClustering(
    filteredVisitors,
    bounds,
    Math.floor(viewState.zoom)
  );

  return (
    <Map
      ref={mapRef}
      {...viewState}
      onMove={(e) => setViewState(e.viewState)}
      mapboxAccessToken={MAPBOX_TOKEN}
      mapStyle="mapbox://styles/mapbox/outdoors-v12"
    >
      {clusters.map((cluster) => {
        const { cluster: isCluster, point_count } = cluster.properties;

        if (isCluster) {
          return (
            <ClusterMarker
              key={`cluster-${cluster.id}`}
              cluster={cluster}
              pointCount={point_count}
            />
          );
        }

        const visitor = cluster.properties.visitor;
        return (
          <Marker
            key={visitor.visitorId}
            visitor={visitor}
          />
        );
      })}
    </Map>
  );
}
```

---

## Conclusion

This guide covers the essential concepts of Mapbox GL JS:

1. **Map Fundamentals**: ViewState, projections, fog, events, and programmatic control
2. **Map Styles**: Built-in styles, switching, fog colors, and view modes
3. **Markers & Popups**: Positioning, events, clustering, and data filtering

With this knowledge, you can build sophisticated, interactive maps that handle thousands of markers, provide smooth user experiences, and adapt to different use cases. The key is understanding how these pieces work together: viewState controls the viewport, clustering optimizes performance, and filtering provides user control over displayed data.