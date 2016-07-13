window.http = new HttpLite();

// Action Creator
const receivedData = (data) => {
  return {
    type: "RECEIVED_DATA",
    payload: data
  };
};

// Action Creator
const fetchData = () => {
  return (dispatch) => {
    const url = "http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_hour.geojson";
    window.http.get(url, (resp) => {
      const data = JSON.parse(resp);
      if ( data.features ) {
        dispatch(receivedData(data.features));
      }
    });
  };
};


// Reducer
const parseData = (state = {}, action) => {
  switch (action.type) {
    case "RECEIVED_DATA":
      let markers = action.payload.map((d,idx) => {
        let infoBox = {
          content: `<p><b>Magnitude:</b> ${d.properties.mag}</p>
                    <p><b>Location:</b> ${d.properties.place}</p>
                    <p><b>Time:</b> ${new Date(d.properties.time)}</p>`
        };
        return {
          lat: d.geometry.coordinates[1],
          lng: d.geometry.coordinates[0],
          infoWindow: infoBox
        };
      });

      return {...state, points: markers };
  }

  return state;
};



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
    this.requestData = this.requestData.bind(this);
  }

  componentDidMount() {
    this.props.fetch();
    this.interval = setInterval(this.requestData, this.refreshFeq);
  }

  requestData() {
    this.props.fetch();
  }

  render() {
    return <div>
            <h2>{this.props.name}</h2>
            <Map points={this.props.points} />
           </div>;
  }
}

const store = Redux.createStore(
  Redux.combineReducers({data: parseData}),
  Redux.applyMiddleware(ReduxThunk.default)
);

const render = () => {
  //console.log(store.getState());
  ReactDOM.render(
    <App name="Quake Map"
      points={store.getState().data.points}
      fetch={Redux.bindActionCreators(fetchData, store.dispatch)}/>,
    document.getElementById('app-container')
  );
};

render();
store.subscribe(render);
