// Utils
import { processFiles } from "../utils";
import { opensubtitles } from "../sources";

// Components
import Layout from "../components/layout";
import TitleBar from "../components/titleBar";
import Search from "../components/search";
import Content from "../components/content";
import Footer from "../components/footer";

export default class MainApp extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      searchQuery: "",
      placeholder: "Search for a show...",
      files: [],
      results: []
    };

    this.onKeyDown = this.onKeyDown.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onSearch = this.onSearch.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.onDrop = this.onDrop.bind(this);

    this.searchQuery = this.searchQuery.bind(this);
    this.searchFile = this.searchFile.bind(this);
  }

  // handling escape close
  componentDidMount() {
    document.addEventListener("keydown", this.onKeyDown);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.onKeyDown);
  }

  onKeyDown(event) {
    if (event.keyCode === 27) {
      this.onReset();
    }
  }

  onChange(event) {
    const searchQuery = event.target.value;
    const files = [];
    this.setState({ searchQuery, files });
  }

  onFocus() {
    const placeholder = "";
    this.setState({ placeholder });
  }

  onBlur() {
    const placeholder = "Search for a show...";
    this.setState({ placeholder });
  }

  async onDrop(rawFiles) {
    const files = await processFiles(rawFiles);
    this.setState({ files });
    this.onSearch();
  }

  onReset() {
    const placeholder = "Search for a show...";
    const searchQuery = "";
    const files = [];
    const results = [];
    this.setState({ placeholder, searchQuery, files, results });
  }

  onSearch(event) {
    if (event) {
      event.preventDefault();
    }

    const { searchQuery, files } = this.state;

    if (searchQuery !== "") {
      this.searchQuery();
    }

    if (files.length > 0) {
      this.searchFile();
    }
  }

  async searchQuery() {
    const { searchQuery } = this.state;
    const results = await opensubtitles.searchQuery(searchQuery, "eng", "all");
    this.setState({ results });
  }

  async searchFile() {
    const { files } = this.state;
    const results = await opensubtitles.searchFiles(files, "eng", "best");
  }

  render() {
    const { placeholder, searchQuery, files, results } = this.state;

    return (
      <Layout>
        <TitleBar />
        <Search
          placeholder={placeholder}
          value={searchQuery}
          onSubmit={this.onSearch}
          onChange={this.onChange}
          onFocus={this.onFocus}
          onBlur={this.onBlur}
        />
        <Content
          searchQuery={searchQuery}
          files={files}
          results={results}
          onDrop={this.onDrop}
        />
        <Footer />
      </Layout>
    );
  }
}
