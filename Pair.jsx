'use strict'

const { React } = require('powercord/webpack');
const { Button } = require('powercord/components');
const { TextInput } = require('powercord/components/settings');

module.exports = class pair extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
        pos: this.props.pos,
        key: this.props.pos > -1 ? this.props.p[0] : '',
        val: this.props.pos > -1 ? this.props.p[1] : ''
    };
  }

  IsValid (checkNew) {
    var check1 = checkNew ? this.state.key : this.state.key;
    var check2 = checkNew ? this.state.val : this.state.val;
    return check1 != '' && check2 != '' && check1.indexOf(" ") == -1 && this.state.pos > -1 && this.props.parent.plugin.unique(check1, this.state.pos, this.props.parent.state.pairs, false);
  }

  IsValidNew () {
    return this.state.key != '' && this.state.val != '' && this.state.key.indexOf(" ") == -1 && this.props.parent.plugin.unique(this.state.key, this.state.pos, this.props.parent.state.pairs, true);
  }

  render () {
    return (
      <div class='powercord-alias-pair card-3Qj_Yx'>
        {
          this.state.pos > -1 ? <h1 class='powercord-alias-header'>Alias #{this.state.pos + 1}</h1> : <h1 class='powercord-alias-header'>New Alias</h1>
        }

        <br/>
        <br/>

        <TextInput
          onChange={(e) => {
            this.setState({"key": e});
            if (this.state.pos > -1 && this.IsValid(true)) {
              if (e != '' && this.state.val != '') {
                var pairs = this.props.parent.state.pairs;
                pairs[this.state.pos][0] = e;
                this.props.parent._set('pairs', pairs);
                this.props.parent.plugin.loadVars();
              }
            }
          }}
          defaultValue={this.state.pos > -1 ? this.state.key : ''}
          note={this.state.pos == -1 ? 'The name of your alias (shortcut)' : ''}
          style={(this.state.pos > -1 ? this.IsValid(false) : this.props.parent.plugin.unique(this.state.key, this.state.pos, this.props.parent.state.pairs, false)) ? {} : {borderColor: '#e53935'}}
        ></TextInput>

        <textarea
          id={"powercord-alias-val-" + this.props.pos}
          onInput={() => {
            var e = document.getElementById("powercord-alias-val-" + this.props.pos).value;
            this.setState({"val": e});
            if (this.state.pos > -1 && this.IsValid(true)) {
              if (this.state.key != '' && e != '') {
                var pairs = this.props.parent.state.pairs;
                pairs[this.state.pos][1] = e;
                this.props.parent._set('pairs', pairs);
                this.props.parent.plugin.loadVars();
              }
            }
          }}
          defaultValue={this.state.pos > -1 ? this.state.val : ''}
          class="inputDefault-_djjkz input-cIJ7To size16-14cGz5 pc-inputDefault pc-input pc-size16"
          style={{height:"auto",resize:"none",overflowY:"hidden"}}
        ></textarea>
        {
          this.props.pos == -1
          ? <div class="default-3nhoK- formText-3fs7AJ pc-default pc-formText description-3_Ncsb formText-3fs7AJ pc-description pc-formText modeDefault-3a2Ph1 pc-modeDefault primary-jw0I4K">
              What your alias will send (can NOT trigger other commands!)
            </div>
          : <br/>
        }
        <div class="divider-3573oO pc-divider marginTop20-3TxNs6 pc-marginTop20"/>
        <br/>

        {
          this.state.pos > -1
          ?   <button
              onClick={() => {
                var pairs = this.props.parent.state.pairs;
                pairs.splice(this.state.pos, 1);
                this.props.parent._set('pairs', pairs);
                if (this.state.pos >= pairs.length)
                    this.setState({"pos": 0, "key": '', "val": ''});
                else
                    this.setState({"pos": this.state.pos + 1, "key": pairs[this.state.pos][0], "val": pairs[this.state.pos][1]});
                this.props.parent.reload();
              }}
              size={Button.Sizes.SMALL}
              class='powercord-alias-button'
            >
              <div class='contents-18-Yxp' style={{margin: 'auto'}}>
                Delete
              </div>
            </button>
          :   <button
              onClick={() => {
                if (this.IsValidNew()) {
                  var pairs = this.props.parent.state.pairs;
                  pairs.push([this.state.key, this.state.val]);
                  this.props.parent._set('pairs', pairs);
                  this.props.parent.plugin.loadVars();
                  this.props.parent.reload();
                }
              }}
              size={Button.Sizes.SMALL}
              class='powercord-alias-button'
              style={this.IsValidNew() ? {background: "#43B581", borderColor: "#43B581"} : {background: "rgba(0, 0, 0, 0)", borderColor: "#F04747"}}
            >
              <div class='contents-18-Yxp' style={{margin: 'auto'}}>
                Add
              </div>
            </button>
        }

        {
          this.IsValid()
            ? <div><h3 class='powercord-alias-header'>Usage: </h3><h3 class='powercord-alias-example'><font style={{color:"#888"}}>{powercord.api.commands.prefix}a</font> {this.state.key}</h3></div>
            : this.state.pos > -1 ? <h3 class='powercord-alias-header'>Invalid</h3> : <h3 class='powercord-alias-header'>Type a name and value, then click the button to add your new alias!</h3>
        }

        <h3 class='powercord-alias-header'>
          {}
        </h3>
      </div>
    );
  }
};
