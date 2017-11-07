var app = app || {};

(function () {
	'use strict';

	var ESCAPE_KEY = 27;
	var ENTER_KEY = 13;
	var timer;

	app.FileItem = React.createClass({
		handleSubmit: function (event) {
			var val = this.state.editText.trim();
			if (val) {
				this.props.onSave(val);
				this.setState({editText: val});
				this.setState({editData: ''})
			} else {
				{this.props.onDestroy}
			}
		},

		getInitialState: function () {
			return {editText: this.props.file.title,
							editData: ''};
		},

		handleEdit: function () {
			this.props.onEdit();
			this.setState({editText: this.props.file.title});
		},

		handleKeyDown: function (event) {
			if (event.which === ESCAPE_KEY) {
				this.setState({editText: this.props.file.title});
				this.props.onCancel(event);
			} else if (event.which === ENTER_KEY) {
				this.handleSubmit(event);
			}
		},

		createData: function(){

		},

		handleChange: function (event) {
			if (this.props.writing) {
				this.setState({editText: event.target.value});
			}
		},

				onMenuOpen: function(){

				  this.props.onDesc(this.props.file.id)
				},

				onClick: function() {

					if(this.state.editingnow ) {
					this.setState({editingnow: false} )
					}
					else this.setState({editingnow: true} )

					this.props.onTitleStateChange(true);

				},



		shouldComponentUpdate: function (nextProps, nextState) {
			return (
				nextProps.file !== this.props.file ||
				nextProps.writing !== this.props.writing ||
				nextProps.titleState !== this.props.titleState ||
				nextState.editText !== this.state.editText
			);
		},

		componentDidMount: function(){
			var obj = this.refs.file_item;
		},


		componentDidUpdate: function (prevProps) {

			if (!prevProps.writing && this.props.writing) {
				var node = React.findDOMNode(this.refs.editField);
				node.focus();
				node.setSelectionRange(node.value.length, node.value.length);
			}


		},

		render: function () {
			return (

					<div className="view">

					<button className={classNames(
					{"btn" : this.props.titleState === '0'},
					{"btn_active" : this.props.titleState === '1'}
					)}
					 ref="file_item"
					onMouseDown={this.onMouseDown}
					onMouseUp={this.onMouseUp}
					onClick={this.onClick}>
							<p><font size="3">{this.props.file.title}</font></p>
					</button>
					<img src="img/menu.png" width="50" height="30" onClick={this.onMenuOpen}></img>

				</div>
			);
		}
	});
})();
