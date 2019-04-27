const { React } = require("powercord/webpack")
const { TextInput } = require("powercord/components/settings")
const { Divider, Spinner } = require("powercord/components")

const Pair = require("./Pair.jsx")

module.exports = class Settings extends React.Component {
  constructor (props) {
    super(props);

    this.show = true;
  }

  displayItems () {
    let items = [];
    if (this.props.getSetting("pairs", []).length > 0) {
      for (let i = 0; i < this.props.getSetting("pairs", []).length; i++) {
        items.push(this.props.getSetting("pairs", [])[i]);
      }
    }
    return (this.props.getSetting("pairs", []).length > 0
            ? items.map((p, i) => <Pair pos={i} p={p} parentProps={this.getPropsToPass()}/>)
            : <h2 className="powercord-alias-header">No aliases!<div class="powercord-alias-break"/></h2>);
  }

  getPropsToPass () {
    return {
      checkUnique: (v, k, i, plug) => this.checkUnique(v, k, i),
      setPairs:    (v)             => {this.props.updateSetting("pairs", v); this.setState({"pairs": v})},
      getPairs:    ()              => this.props.getSetting("pairs", []),
      reload:      ()              => this.reload()
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

  checkUnique (val, key, indexed) {
    return this.props.getSetting("pairs", []).filter(function(v, k, t) { return v[0] == val }).length <= (indexed ? 0 : 1);
  }
};
