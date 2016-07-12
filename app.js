class Map extends React.Component {
  constructor(props) {
    super(props);
    this.map = null;
  }

  componentDidMount() {
    this.map = new GMaps({div: '#qm-map', lat: 37.187022, lng: -123.7641461, zoom: 3 });
  }

  componentDidUpdate() {
    this.map.removeMarkers();
    this.map.addMarkers(this.props.points);
  }

  render() {
    return <div id="qm-map" style={{height: "600px", width: "900px"}}></div>;
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.refreshFeq = 15000 
    this.url = "http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_hour.geojson";
    this.http = new HttpLite();
    this.state = {geoPoints: []};
    this.refreshData = this.refreshData.bind(this);
  }

  componentDidMount() {
    this.interval = setInterval(this.refreshData, this.refreshFeq);
  }

  refreshData() {
    this.http.get(this.url, function(resp) {
      let data = JSON.parse(resp);
      if ( data.features ) {
        let markers = data.features.map((df,idx) => {
          let infoBox = {
            content: `<p><b>Magnitude:</b> ${df.properties.mag}</p>
                      <p><b>Location:</b> ${df.properties.place}</p>
                      <p><b>Time:</b> ${new Date(df.properties.time)}</p>`
          };
          return {
            lat: df.geometry.coordinates[1],
            lng: df.geometry.coordinates[0],
            infoWindow: infoBox
          };
        });
        this.setState({geoPoints: markers});
      }
    }.bind(this));
  }

  render() {
    return <div>
            <h2>{this.props.name}</h2>
            <Map points={this.state.geoPoints} />
          </div>;
  }
}

ReactDOM.render(
  <App name="Quake Map"/>,
  document.getElementById('app-container')
);
