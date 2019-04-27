const { React } = require("powercord/webpack");
const { Divider, Button } = require("powercord/components");
const { TextInput } = require("powercord/components/settings");

module.exports = class Pair extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
        pos: this.props.pos,
        key: this.props.pos > -1 ? this.props.p[0] : "",
        val: this.props.pos > -1 ? this.props.p[1] : ""
    };
  }

  isValid (checkNew) {
    let check1 = checkNew ? this.state.key : this.state.key;
    let check2 = checkNew ? this.state.val : this.state.val;
    return check1 != "" && check2 != "" && check1.indexOf(" ") == -1 && this.state.pos > -1 && this.props.parentProps.checkUnique(check1, this.state.pos, false);
  }

  isValidNew () {
    return this.state.key != "" && this.state.val != "" && this.state.key.indexOf(" ") == -1 && this.props.parentProps.checkUnique(this.state.key, this.state.pos, true);
  }

  render () {
    return (
      <div className="powercord-alias-pair pc-card" id={this.props.pos == -1 ? "new" : ""}>
        {
          this.state.pos > -1 ? <h1 className="powercord-alias-header">Alias #{this.state.pos + 1}</h1> : <h1 className="powercord-alias-header">New Alias</h1>
        }

        <div class="powercord-alias-break"/>

        <TextInput
          onChange={(e) => {
            this.setState({"key": e});
            if (this.state.pos > -1 && this.isValid(true)) {
              if (e != "" && this.state.val != "") {
                let pairs = this.props.parentProps.getPairs();
                pairs[this.state.pos][0] = e;
                this.props.parentProps.setPairs(pairs);
                this.props.parentProps.loadVars();
              }
            }
          }}
          defaultValue={this.state.pos > -1 ? this.state.key : ""}
          note={this.state.pos == -1 ? "The name of your alias (shortcut)" : ""}
          style={(this.state.pos > -1 ? this.isValid(false) : this.props.parentProps.checkUnique(this.state.key, this.state.pos, false)) ? {} : {borderColor: "#e53935"}}
        />

        <textarea
          id={"powercord-alias-val-" + this.props.pos}
          onInput={() => {
            let e = document.getElementById("powercord-alias-val-" + this.props.pos).value;
            this.setState({"val": e});
            if (this.state.pos > -1 && this.isValid(true)) {
              if (this.state.key != "" && e != "") {
                let pairs = this.props.parentProps.getPairs();
                pairs[this.state.pos][1] = e;
                this.props.parentProps.setPairs(pairs);
                this.props.parentProps.loadVars();
              }
            }
          }}
          defaultValue={this.state.pos > -1 ? this.state.val : ""}
          className="powercord-alias-textarea pc-inputDefault pc-input pc-size16"
        />
        {
          this.props.pos == -1
          ? <div className="powercord-alias-description pc-description">
              What your alias will send (can NOT trigger other commands!)
            </div>
          : ''
        }
        <div class="powercord-alias-break"/>
        <Divider/>
        <div class="powercord-alias-break"/>

        {
          this.state.pos > -1
          ?   <Button
              onClick={() => {
                let pairs = this.props.parentProps.getPairs();
                pairs.splice(this.state.pos, 1);
                this.props.parentProps.setPairs(pairs);
                if (this.state.pos >= pairs.length)
                    this.setState({"pos": 0, "key": "", "val": ""});
                else
                    this.setState({"pos": this.state.pos + 1, "key": pairs[this.state.pos][0], "val": pairs[this.state.pos][1]});
                this.props.parentProps.reload();
              }}
              size={Button.Sizes.SMALL}
              className="powercord-alias-button"
            >
              Delete
            </Button>
          :   <Button
              onClick={() => {
                if (this.isValidNew()) {
                  let pairs = this.props.parentProps.getPairs();
                  pairs.push([this.state.key, this.state.val]);
                  this.props.parentProps.setPairs(pairs);
                  this.props.parentProps.loadVars();
                  this.props.parentProps.reload();
                }
              }}
              size={Button.Sizes.SMALL}
              className="powercord-alias-button"
              color={this.isValidNew() ? Button.Colors.GREEN : Button.Colors.RED}
              look={this.isValidNew() ? Button.Looks.FILLED : Button.Looks.OUTLINED}
            >
              Add
            </Button>
        }

        {
          this.isValid()
            ? <div><h3 className="powercord-alias-header">Usage: </h3><h3 className="powercord-alias-example"><font style={{opacity:0.6}}>{powercord.api.commands.prefix}alias</font> {this.state.key}</h3></div>
            : this.state.pos > -1 ? <h3 className="powercord-alias-header">Invalid</h3> : <h3 className="powercord-alias-header">Type a name and value, then click the button to add your new alias!</h3>
        }
      </div>
    );
  }
};
