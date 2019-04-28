const { React } = require("powercord/webpack")
const { TextInput } = require("powercord/components/settings")
const { Divider, Spinner } = require("powercord/components")

const Pair = require("./Pair.jsx")

module.exports = class Settings extends React.Component {
  displayItems () {
    let items = [];
    if (this.props.getSetting("pairs", []).length > 0) {
      for (let i = 0; i < this.props.getSetting("pairs", []).length; i++)
        items.push(this.props.getSetting("pairs", [])[i]);
    }
    return (this.props.getSetting("pairs", []).length > 0
            ? items.map((p, i) => <Pair key={p[0] + i.toString()} pos={i} p={p} parentProps={this.getPropsToPass()}/>)
            : <h2 className="powercord-alias-header">No aliases!<div class="powercord-alias-break"/></h2>);
  }

  getPropsToPass () {
    return {
      checkUnique: (v, k, i, plug) => this.checkUnique(v, k, i),
      setPairs:    (v)             => {this.props.updateSetting("pairs", v); this.setState({"pairs": v})},
      getPairs:    ()              => this.props.getSetting("pairs", []),
      reload:      ()              => this.forceUpdate()
    };
  }

  render () {
    return (
      <div>
        {
          this.displayItems()
        }
        <Divider/>
        <Pair key={" " + this.props.getSetting("pairs", []).length} pos={-1} parentProps={this.getPropsToPass()}/>
      </div>
    );
  }

  checkUnique (val, key, indexed) {
    return this.props.getSetting("pairs", []).filter(function(v, k, t) { return v[0] == val }).length <= (indexed ? 0 : 1);
  }
};
