const { React } = require('powercord/webpack')
const { TextInput } = require('powercord/components/settings')

const Pair = require('./Pair.jsx')

module.exports = class Settings extends React.Component {
  constructor (props) {
    super(props);

    const get = props.settings.get.bind(props.settings);
    this.plugin = powercord.pluginManager.get('pc-alias');
    this.state = {pairs: get('pairs', [])};

    this.show = true;
  }

  displayItems() {
    var items = [];
    if (this.state.pairs.length > 0) {
      for (var i = 0; i < this.state.pairs.length; i++) {
        items.push(this.state.pairs[i]);
      }
    }
    return (this.state.pairs.length > 0 ? items.map((p, i) => React.createElement(Pair, {p: p, pos: i, parent: this})) : <h2 class='powercord-alias-header'>No aliases!<br/></h2>);
  }

  reload () {
    this.show = false;
    setTimeout(() => {this.show = true; this.forceUpdate();}, 200);
  }

  render () {
    var thing = this.displayItems();
    if (!this.show)
      return (
        <div style={{"text-align": "center"}}>
          <br/><br/><br/><br/>
          <div class='powercord-alias-loading1'/>
          <div class='powercord-alias-loading2'/>
        </div>
      );
    else
      return (
        <div>
          {
            thing
          }
          <br/>
          <div class="divider-3573oO pc-divider"/>
          <br/><br/>
          <Pair pos={-1} parent={this} />
        </div>
      );
  }

  _set (key, value = !this.state[key], defaultValue) {
    if (!value && defaultValue) {
      value = defaultValue;
    }

    this.props.settings.set(key, value);
    this.setState({ [key]: value });
  }
};
