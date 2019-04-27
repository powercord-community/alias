const { React } = require("powercord/webpack")
const { TextInput } = require("powercord/components/settings")
const { Divider, Spinner } = require("powercord/components")

const Pair = require("./Pair.jsx")

module.exports = class Settings extends React.Component {
  constructor (props) {
    super(props);

    this.plugin = powercord.pluginManager.get("alias");
    this.state = {pairs: this.plugin.settings.get("pairs", [])};

    this.show = true;
  }

  displayItems() {
    let items = [];
    if (this.state.pairs.length > 0) {
      for (let i = 0; i < this.state.pairs.length; i++) {
        items.push(this.state.pairs[i]);
      }
    }
    return (this.state.pairs.length > 0
            ? items.map((p, i) => <Pair pos={i} p={p} parentProps={this.getPropsToPass()}/>)
            : <h2 className="powercord-alias-header">No aliases!<div class="powercord-alias-break"/></h2>);
  }

  getPropsToPass() {
    return {
      checkUnique: (v, k, i, plug) => {return this.checkUnique(v, k, i, this.plugin)},
      setPairs:    (v)             => {this.plugin.settings.set("pairs", v); this.setState({"pairs": v})},
      getPairs:    ()              => {return this.state.pairs},
      loadVars:    ()              => {this.plugin.loadVars()},
      reload:      ()              => {this.reload()}
    };
  }

  reload () {
    this.show = false;
    setTimeout(() => {this.show = true; this.forceUpdate();}, 200);
  }

  render () {
    if (!this.show) {
      return (
        <div style={{"text-align": "center"}}>
          <div class="powercord-alias-break"/>
          <Spinner/>
        </div>
      );
    } else
      return (
        <div>
          {
            this.displayItems()
          }
          <Divider/>
          <Pair pos={-1} parentProps={this.getPropsToPass()}/>
        </div>
      );
  }

  checkUnique(v, k, indexed, plug) {
    return plug.unique(v, k, this.state.pairs, indexed);
  }
};
