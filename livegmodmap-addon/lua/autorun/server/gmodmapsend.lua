---- -----------------------------------
--- Sends a list of players.
----- ----------------------------------
function GmodMap.sendPlayers( )
	local data = {
		['players'] = {}
	}
	for k,pl in pairs( player.GetAll() ) do
		local player_data = {
			['id']		= pl:UniqueID(),
			['name'] 	= pl:GetName(),
			['health'] 	= pl:Health(),
			['frags'] 	= pl:Frags(),
			['x'] 		= math.floor(pl:GetPos().x),
			['y'] 		= math.floor(pl:GetPos().y),
			['angle']	= math.floor(pl:GetAimVector():Angle().y),
			['weapon'] 	= pl:GetActiveWeapon( ):GetClass()
		}
		table.insert( data.players, player_data )
	end
	local json_string = json.encode( data )
	GmodMap.udpSend(  json_string  )
end

---- -----------------------------------
--- Sends a list of props. Automatically breaks into chunks of 50 props.
----- ----------------------------------
function GmodMap.sendProps(  )
	local data = {
		['props'] = {}
	}
	
	local props = ents.FindByClass('prop_physics')
	
	if #props <= GmodMap.prop_chunk then
		for k,ent in pairs( props ) do
			local aa, bb = ent:WorldSpaceAABB()
			local ent_data = {
				['x1'] = aa.x,
				['y1'] = aa.y,
				['x2'] = bb.x,
				['y2'] = bb.y
			}
			table.insert( data.props, ent_data )
		end
		GmodMap.prop_i = 1
	else
		local c = GmodMap.prop_i*GmodMap.prop_chunk
		for i = (c - GmodMap.prop_chunk)+1, GmodMap.prop_chunk do
			local ent = props[i]
			if ent then
				local aa, bb = ent:WorldSpaceAABB()
				local ent_data = {
					['x1'] = aa.x,
					['y1'] = aa.y,
					['x2'] = bb.x,
					['y2'] = bb.y
				}
				table.insert( data.props, ent_data )
			else
				break
			end
		end
		
		if c >= #props then
			GmodMap.prop_i = 1
		else
			GmodMap.prop_i = GmodMap.prop_i + 1
		end
	end
	local json_string = json.encode( data )
	GmodMap.udpSend(  json_string  )
end

---- -----------------------------------
--- Description
-- @param player_delay [seconds]
-- @param prop_delay [seconds]
----- ----------------------------------
function GmodMap.start( delay, delay2 )
	GmodMap.prop_chunk  = 50
	GmodMap.prop_i		= 1
	timer.Create( "gmodmap_sendplayers_timer", delay or 1, 0, GmodMap.sendPlayers )
	timer.Create( "gmodmap_sendprops_timer", delay2 or 1, 0, GmodMap.sendProps )
end