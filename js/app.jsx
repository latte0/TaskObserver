var app = app || {};
var ws = ws || {};
(function () {
	'use strict';

	app.ONLY_TITLE = 'title';
	app.DESCRIPTION = 'description'
	var FileItem = app.FileItem;
	var DescriptItem = app.DescriptItem;

	var ENTER_KEY = 13;

	var ObsApp = React.createClass({
		getInitialState: function () {
			return {
				nowShowing: app.ONLY_TITLE,
				writing: null,
				newFile: '',
				Desc: false,
				DescFileid: ''
			};
		},

		componentDidMount: function () {
			var setState = this.setState;
			var router = Router({
				'/': setState.bind(this, {nowShowing: app.ONLY_TITLE}),
				'/description': setState.bind(this, {nowShowing: app.DESCRIPTION}),
			});
			router.init('/');
		},

		handleChange: function (event) {
			this.setState({newFile: event.target.value});
		},

		addNewTask: function (val){

					if (val) {
					  var uuid = app.Utils.uuid();
						this.props.model.addnewfile(val,uuid);
						this.setState({newFile: ''});
						ws.send(JSON.stringify({
							type:'add',
							uuid:uuid,
							title:val,
							description:'input description',
							author:'',
							lastDate:'',
							state:0
						}));
					}
		},

		handleNewFileKeyDown: function (event) {
			if (event.keyCode !== ENTER_KEY) {

				return;
			}

			event.preventDefault();

			this.addNewTask(this.state.newFile.trim());

		},

		toggleAll: function (event) {
			var checked = event.target.checked;
			this.props.model.toggleAll(checked);
		},

		toggle: function (fileToToggle) {
			this.props.model.toggle(fileToToggle);
		},

		destroy: function (file) {
			this.props.model.destroy(this.state.DescFileid);
			this.hideDesc();
			this.forceUpdate();
			ws.send(JSON.stringify({
				type:'delete',
				uuid:this.state.DescFileid
			}));
		},

		write: function (file) {
			this.setState({writing: file.id});
		},

		showDesc: function(fileid){
			this.setState({DescFileid:fileid,Desc: true});

		},

		hideDesc: function(file){
			this.setState({Desc: false});
			this.setState({DescFileid: ''});
		},

		save: function (fileToSave, text) {
			this.props.model.save({type:'description',uuid:this.state.DescFileid, value:text});
			this.setState({writing: null});
		},

		cancel: function () {
			this.setState({writing: null});
		},

		clearCompleted: function () {
			this.props.model.clearCompleted();
		},

		titlechange: function (file,first){
			if(file.state === '1') file.state = '0';
			else file.state = '1';


				ws.send(JSON.stringify({
					type:'edit',
					content:'state',
					value:file.state,
					uuid:file.id
				}));

			this.forceUpdate();
		},
		render: function () {
			var footer;
			var main;
			var files = this.props.model.files;

			var descfile = {
				id: '',
				title: '',
				description: '',
				author: '',
				lastDate:'',
				state:'0',
				editing: false ,
				achive: 0,
				writing_title: false,
				writing_desc: false,
			};

			files.map(function (file) {
			　　
				if(file.id === this.state.DescFileid){
					descfile = file;
					console.log(descfile.description)
				}
			},this)

			var fileItems = files.map(function (file) {
				return (
					<FileItem
						key={file.id}
						file={file}
						titleState={file.state}
						onToggle={this.toggle.bind(this, file)}
						onDestroy={this.destroy.bind(this, file)}
						onTitleStateChange={this.titlechange.bind(this,file)}
						onWrite={this.write.bind(this, file)}
						writing={this.state.writing === file.id}
						onSave={this.save.bind(this, file)}
						onCancel={this.cancel}
						onDesc={this.showDesc}
					/>
				);
			}, this);

			var activeFileCount = files.reduce(function (accum, file) {
				return file.editing ? accum : accum + 1;
			}, 0);

			var completedCount = files.length - activeFileCount;

			main = (
								<section className="main">
										{fileItems}
								</section>
							);


			return (
			  <center>

				<div>
					<header className="header">
					<div className={classNames({
						showingDesc: this.state.Desc
					})}>
								<div className="view_items">
									<h1>task observer</h1>
									{main}
									<div>
									  <input
									    className="new-file"
									    placeholder="Add observed file"
									    value={this.state.newFile}
									    onKeyDown={this.handleNewFileKeyDown}
									    onChange={this.handleChange}
									    autoFocus={true}
									  />
									</div>
								</div>
					</div>
					<div className={classNames({
						showingDesc: !this.state.Desc
					})}>
						<div className="view_desc">

							<DescriptItem
								title={descfile.title}
								description={descfile.description}
								uuid={descfile.id}
								onSave={this.save.bind(this, this.descfile)}
								onHide={this.hideDesc}
								onDestroy={this.destroy.bind(this, this.descfile)}
								/>

						</div>
					</div>
					</header>
				</div>
				</center>
			);
		}
	});

	var model = new app.FileModel('datobs');
	var hostname = window.location.hostname ;
	var hosturl = 'wss://' + hostname;
//	var hosturl = 'ws://localhost:5000'

	ws = null;

	function open() {
	 console.log ("opehn")
				 if (ws == null) {
						 // WebSocket の初期化
						 ws = new WebSocket(hosturl);

						 ws.onopen = onOpen;
						 ws.onmessage = onMessage;
						 ws.onclose = onClose;
						 ws.onerror = onError;
				 }
		 }
		 function onOpen(event) {
				 console.log('come ont new task')
			 ws.send(JSON.stringify({
				 type:'init'
			 }));
		 }

     //message received event
		 function onMessage(event) {

		 		var data = JSON.parse(event.data);
		 		    console.log(data)
		 		if (data.type == 'add') {
					model.addnewfile(data.title,data.uuid);

		 		} else if (data.type == 'edit') {
		 			//titlechange(data,false);
		 			console.log(model)
		 			var files = model.files;
		 			files = files.map(function (file) {
		 						if(data.content === 'state'){

		 							if(file.id === data.uuid){
		 							console.log("aaaa");
		 								file.state = data.value
		 								render();
		 							}
		 						}
		 						return file;
		 					});

		 		} else if (data.type == 'delete') {
							model.destroy(data.uuid);
		 		} else if (data.type === 'init'){
		 			console.log('init')
		 			var tasks = JSON.parse(data.datalist);

		 			tasks.map(function(task){
		 				model.addfile(task);
		 			})
		 		}

		 }

		 function onError(event) {

		 }

		 function onClose(event) {
		 	    console.log("onclose")
				 ws = null;
				 setTimeout(open(), 2000);
		 }

		 open();


	window.onbeforeunload = function () {

	};
	var socket = app.Web;

	socket.start();


	function render() {
		React.render(
			<ObsApp model={model}/>,
			document.getElementsByClassName('datobs')[0]
		);
	}

	model.subscribe(render);
	render();
})();
