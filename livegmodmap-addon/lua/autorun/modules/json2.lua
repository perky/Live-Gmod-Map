-- JSON String builder module.
Json = {}
Json.mt = { __index = Json }
setmetatable( Json, Json )

---- -----------------------------------
--- Description
-- @param ...
-- @return vals
----- ----------------------------------
function Json.__call()
	local json = setmetatable( {}, Json.mt )
	json.str = "{}"
	return json
end

---- -----------------------------------
--- Description
-- @param str
----- ----------------------------------
function Json:addString( str )
	
end
---- -----------------------------------
--- Description
-- @param array [Array]
----- ----------------------------------
function Json:addArray( array )
	for k, v in ipairs( array ) do
		
	end
end