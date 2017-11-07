var app = app || {};
var ws = ws || {};

(function () {
	'use strict';

	var ESCAPE_KEY = 27;
	var ENTER_KEY = 13;

	app.DescriptItem = React.createClass({


		handleChange: function (event) {
			if (true) {
				this.setState({editDescription: event.target.value});
			}
			ws.send(JSON.stringify({
				type:'edit',
				content:'description',
				value:event.target.value,
				uuid:this.props.uuid
			}));
			this.props.onSave(event.target.value)
		},



		hide: function(event){
			this.setState({
			editTitle: '',
			editDescription: '',
			editing: false
			});
			this.props.onHide();
		},

		getInitialState: function () {
			return {
							editTitle: this.props.title,
							editDescription: this.props.description,
              editing: false
      };
		},



		shouldComponentUpdate: function (nextProps, nextState) {
			return (
				nextState.editTitle !== this.state.editTitle ||
				nextState.editDescription !== this.state.editDescription ||
				nextProps.title !== this.props.title ||
				nextProps.description !== this.props.description
			);
		},

		componentDidUpdate: function (prevProps) {
			if (!prevProps.editing && this.state.editing) {
				var node = React.findDOMNode(this.refs.editField);
				node.focus();
				node.setSelectionRange(node.value.length, node.value.length);
			}
		},

		render: function () {

			return (

				<div className={classNames({
					editing: this.state.editing
				})}>
				<h1 >Description</h1>
				<h2>{this.props.title}</h2>

				<textarea
					name="kanso"
					cols="40"
					rows="20"
					maxlength="20"
					placeholder="Please input description"
					value = {this.props.description}
					onChange={this.handleChange}
					onKeyDown={this.handleKeyDown}>
				</textarea>


					<div className="backbtn"　onClick={this.hide}>back</div>

					<div className="view_item">
						<label onDoubleClick={this.handleEdit}>
								{this.state.editDescription}
						</label>
  				</div>

					<input
						ref="editField"
						className="item_edit"
						value={this.state.editDescription}
						onBlur={this.handleSubmit}
						onChange={this.handleChange}
						onKeyDown={this.handleKeyDown}
					/>
					<div className="deletebtn" onClick={this.props.onDestroy}>delete</div>
				</div>

			);
		}
	});
})();
