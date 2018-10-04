import { Component } from 'inferno';
import algoliasearch from 'algoliasearch';
import algoliasearchHelper from 'algoliasearch-helper';
import './registerServiceWorker';
import Logo from './logo';
import './App.css';

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
      categories: [],
      category: 'hello',
      query: ''
    };
  }

  componentDidMount() {
    helper.on('result', (content) => {
      console.log('apps', content.hits);
      console.log('facets', content.getFacetValues('category'));
      this.setState({
        apps: content.hits,
        categories: [...new Set(content.hits.map(h => h.category))],
        facets: content.getFacetValues('category')
      });
    });
  }

  handleChange(event) {
    this.setState({ query: event.target.value });
    helper.setQuery(this.state.query).search();
  }

  handleCheckFacet(event) {
    helper.toggleFacetRefinement('category', event.target.name).search();
  }

  handleClearFacet(e) {
    e.preventDefault();
    helper.clearRefinements('category').search();
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <Logo width="80" height="80" />
          <h1>Apps directory</h1>
        </header>
        <input type="text" value={this.state.query} onInput={(e) => this.handleChange(e)}/>
        <aside>
          {this.state.facets.map(facet => {
            return (
              <label>
                {facet.name} [{facet.count}]
                <input
                  name={facet.name}
                  type="checkbox"
                  checked={facet.isRefined}
                  onChange={(e) => this.handleCheckFacet(e)} />
              </label>
            );
          })}
          <button onClick={(e) => this.handleClearFacet(e)}>Clear</button>
        </aside>
        <main>
          <ul>
            {this.state.apps.map(app => {
              return (
                <li key={app.objectID}><span dangerouslySetInnerHTML={{__html: app._highlightResult.name.value}}/></li>
              );
            })}
          </ul>
        </main>
      </div>
    );
  }
}

export default App;
