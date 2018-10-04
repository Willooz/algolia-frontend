import { Component } from 'inferno';
import algoliasearch from 'algoliasearch';
import algoliasearchHelper from 'algoliasearch-helper';
import './registerServiceWorker';
import Logo from './logo';
import './App.css';

const client = algoliasearch(process.env.INFERNO_APP_ALGOLIA_APPLICATION_ID, process.env.INFERNO_APP_ALGOLIA_API_KEY);
const helper = algoliasearchHelper(client, 'apps');

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      query: '',
      apps: []
    };
  }

  componentDidMount() {
    helper.on('result', (content) => {
      this.setState({ apps: content.hits });
    });
  }

  handleChange(event) {
    this.setState({ query: event.target.value });
    helper.setQuery(this.state.query).search();
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <Logo width="80" height="80" />
          <h1>Apps directory</h1>
        </header>
        <input type="text" value={this.state.query} onInput={(e) => this.handleChange(e)}/>
        <main>
          <ul>
            {this.state.apps.map(app => {
              return (
                <li><span dangerouslySetInnerHTML={{__html: app._highlightResult.name.value}}/></li>
              );
            })}
          </ul>
        </main>
      </div>
    );
  }
}

export default App;
