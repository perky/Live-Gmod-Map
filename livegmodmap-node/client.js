var cwidth = 900;
var cheight = 600;

var Client = new Class({
	
	i: 3,
	players: [],
	images: {},
	props: [],
	
	initialize: function(options){
		this.initCanvas();
		this.initImages();
		this.initSocket();
		this.think.bind(this).periodical( 35 );
		TWEEN.update.periodical( 1000 / 60 );
	},
	
	initSocket: function(options){
		this.socket = new io.Socket(null, {rememberTransport: false, port: 8080});
	    this.socket.addEvent('connect', this.socketConnect.bind(this) );
		this.socket.addEvent('message', this.socketMessage.bind(this) );
		this.socket.addEvent('disconnect', this.socketDisconnect.bind(this) );
	    this.socket.connect();
	},
	
	initCanvas: function(){
		this.canvas = new Canvas({ 
			id: 'map', 
			width: cwidth, 
			height: cheight
		});
		//this.rowWidth = Math.round(this.canvas.width / 60) - 2;
		this.canvas.set('class','canvas');
		$('map').adopt(this.canvas);
		this.ctx = this.canvas.getContext('2d');
	},
	
	initImages: function(attribute){
		this.images.player = new Image();
		this.images.player.src = "alien1.png";
	},
	
	socketConnect: function(){
		this.setStatus( 'Connected' );
	},
	
	socketMessage: function(data){
		jsonData = JSON.parse( data );
		
		if(jsonData.players){
			jsonData.players.each( function(pl){
				this.createOrUpdate( pl );
			}.bind(this));
		} else if(jsonData.props){
			//$('messages').set('html', JSON.stringify(jsonData.props));
			this.props = [];
			jsonData.props.each( function(p){
				var pos1 = { x: p.x1, y: p.y1 };
				var pos2 = { x: p.x2, y: p.y2 };
				pos1 = this.fitPosition( pos1 );
				pos2 = this.fitPosition( pos2 );
				this.props.push( {pos1: pos1, pos2: pos2} );
			}.bind(this));
		}
	},
	
	fitPosition: function( pos ){
		pos.x += 15440;
		pos.y += 15344;
		pos.x /= 31;
		pos.y /= 46;
		return pos;
	},
	
	createOrUpdate: function( pl ){
		// Try to find player
		var newPlayer;
		this.players.each( function(p){
			if( p.params.id == pl.id ){
				newPlayer = p;
			}
		});
		
		// Modify position.
		pl = this.fitPosition( pl );
		
		// Create new player
		if(!newPlayer){
			newPlayer = new Player( this, pl.x, pl.y );
			this.players.push( newPlayer );
		}
		
		// Update player
		newPlayer.updateParams( pl );
	},
	
	socketDisconnect: function(){
		this.setStatus( 'Disconnected' );
	},
	
	setStatus: function( status ){
		$('status').set( 'text', status );
	},
	
	think: function(){
		this.canvas.width = this.canvas.width;
		this.ctx.fillStyle = 'rgba(0,0,0,0.4)'; 
		this.drawProps();
		this.ctx.fillStyle = 'rgba(0,0,0,1)'; 
		this.players.each( this.updatePlayer, this );
	},
	
	drawProps: function(){
		this.props.each( function(p){
			this.ctx.fillRect( p.pos1.x, p.pos1.y, p.pos2.x-p.pos1.x, p.pos2.y-p.pos1.y );
		}, this);
	},
	
	updatePlayer: function( player, index ){
		player.update();
		player.draw();
	},
	
});

var Player = new Class({
	
	pos: {
		x: 0,
		y: 0,
		angle: 0
	},
	params: {
		name: 'bob',
		x: 0,
		y: 0,
		weapon: ""
	},
	
	initialize: function( manager, x, y ){
		this.manager = manager;
		this.ctx = manager.ctx;
		this.image = manager.images.player;
		this.pos.x = x || 0;
		this.pos.y = y || 0;
		this.draw();
	},
	
	draw: function(){
		//this.ctx.drawImage ( this.image, this.params.x, this.params.y );
		var rad = (this.pos.angle+90)*(Math.PI/180);
		this.ctx.arc( this.pos.x, this.pos.y, 5, 0+rad, Math.PI+rad, true);
		this.ctx.line
		this.ctx.fill();
		this.ctx.fillText ( this.params.name + " ("+this.params.health+")", this.pos.x, this.pos.y+13 );
		this.ctx.fillText ( this.params.weapon, this.pos.x, this.pos.y+23 );
	},
	
	updateParams: function( params ){
		this.params = params;
		new TWEEN.Tween( this.pos ).to( {x: params.x, y: params.y}, 1000 ).start();
	},
	
	update: function(){
		this.pos.angle = turn( this.params.angle, this.pos.angle, 5 );
	},
	
});

function turn(angle,current,turnspeed){
    var tempdir;
    if (Math.abs(angle-current) > 180) {
        if (angle > 180) {
            tempdir = angle - 360;
            if (Math.abs(tempdir-current) > turnspeed) {
                current -= turnspeed;
            } else {
                current = angle;
            }
        } else {
            tempdir = angle + 360;
            if (Math.abs(tempdir-current) > turnspeed) {
                current += turnspeed;
            } else {
                current = angle;
            }
        }
    } else {
        if (Math.abs(angle - current) > turnspeed) {
            if (angle > current) {
                current += turnspeed;
            } else {
                current -= turnspeed;
            }
        } else {
            current = angle;
        }
    }

	return current;
}
