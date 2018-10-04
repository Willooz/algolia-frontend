import { Component } from 'inferno';
import algoliasearch from 'algoliasearch';
import algoliasearchHelper from 'algoliasearch-helper';
import Card from './Card';
import './registerServiceWorker';
import 'bulma/css/bulma.css';
import 'bulma-checkradio/dist/css/bulma-checkradio.min.css';
import './custom.css';

const client = algoliasearch(process.env.INFERNO_APP_ALGOLIA_APPLICATION_ID, process.env.INFERNO_APP_ALGOLIA_API_KEY);
const helper = algoliasearchHelper(client, 'apps', {
  facets: ['category']
});

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      apps: [],
      facets: [],
      // categories: [],
      // category: '',
      ascending: false,
      query: ''
    };
  }

  componentDidMount() {
    helper.on('result', (content) => {
      console.log('The parameters have changed: state', content.hits);
      this.setState({
        apps: this.state.ascending ? content.hits.reverse() : content.hits,
        facets: content.getFacetValues('category', { sortBy: ['name:asc'] })
        // categories: [...new Set(content.hits.map(h => h.category))]
      });
    });
  }

  componentWillUnmount() {
    helper.removeAllListeners('result');
  }

  handleChange(event) {
    this.setState({ query: event.target.value });
    helper.setQuery(this.state.query).search();
  }

  handleCheckFacet(event) {
    helper.toggleFacetRefinement('category', event.target.name).search();
  }

  handleRankChange(event) {
    this.setState({ ascending: event.target.checked });
    helper.search();
  }

  handleClearFacet(e) {
    e.preventDefault();
    helper.clearRefinements('category').search();
  }

  render() {
    return (
      <div>
        <section className="hero is-primary is-bold">
          <div className="hero-body">
            <div className="container">
              <h1 className="title">App directory</h1>
              <h2 className="subtitle">Powered by Algolia</h2>
              <input className="input is-medium is-primary" type="text" placeholder="Search apps here" value={this.state.query} onInput={(e) => this.handleChange(e)}/>
            </div>
          </div>
        </section>
        <section className="section">
          <div class="container">
            <div class="columns">
              <aside class="column is-one-quarter">
                <h3 className="title is-4">Categories</h3>
                {this.state.facets.map(facet => {
                  return (
                    <div className="media">
                      <div className="media-content">
                        <div class="field">
                          <input
                            className="is-checkradio is-circle"
                            id={facet.name}
                            type="checkbox"
                            name={facet.name}
                            checked={facet.isRefined}
                            onChange={(e) => this.handleCheckFacet(e)} />
                          <label for={facet.name}>{facet.name}</label>
                        </div>
                      </div>
                      <div className="media-right">
                        <span className="tag is-dark">{facet.count}</span>
                      </div>
                    </div>
                  );
                })}
                <div class="media">
                  <button className="button is-light" onClick={(e) => this.handleClearFacet(e)}>Reset</button>
                </div>
              </aside>
              <main class="column">
                <h3 className="title is-4">Apps</h3>
                <div className="media">
                  <input
                    className="is-checkradio is-circle"
                    id="ascending"
                    name="ascending"
                    type="checkbox"
                    checked={this.state.ascending}
                    onChange={(e) => this.handleRankChange(e)} />
                  <label
                    for="ascending">
                    Results ranked ascending ?
                  </label>
                </div>
                <ul>
                  {this.state.apps.map(app => {
                    return (
                      <li key={app.objectID} style={{ padding: '10px 0' }}>
                        <Card app={app} />
                      </li>
                    );
                  })}
                </ul>
              </main>
            </div>
          </div>
        </section>
      </div>
    );
  }
}

export default App;
