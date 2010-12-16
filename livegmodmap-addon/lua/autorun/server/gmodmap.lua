-- Server only.
if CLIENT then return end

-- Requires
require("oosocks")
include("autorun/modules/json.lua")

-- Create map object.
GmodMap = {}

-- Editable settings:
GmodMap.debug 		= false
GmodMap.serverIp  	= "Enter your server which hosts the Node.js app"
GmodMap.serverPort 	= 8081 -- Enter the port of your node.js
GmodMap.send_players_interval 	= 1
GmodMap.send_props_interval 	= 3

include("autorun/server/gmodmapsend.lua")

---- -----------------------------------
--- Initiate UDP socket.
-- @param ip [string] ip all datagrams are sent to
-- @param port [number] port all datagrams are sent to
-- @return success
----- ----------------------------------
function GmodMap.udpInit( ip, port )
	GmodMap.connection = OOSock( IPPROTO_UDP )
	GmodMap.connection:SetCallback( GmodMap.udpCallback )
	GmodMap.connection:Bind( "", 37777 )
	success = true
	return success
end

---- -----------------------------------
--- [private] Callback function for UDP socket.
-- @param socket
-- @param callType
-- @param callId
-- @param err
-- @param data
-- @param peer
-- @param peerPort
----- ----------------------------------
function GmodMap.udpCallback( socket, callType, callId, err, data, peer, peerPort )
	-- On socket bind.
	if(callType == SCKCALL_BIND && err == SCKERR_OK) then
        dprint("Socket Bound.");
		GmodMap.connection:ReceiveDatagram();
    end
    
	-- On socket send message.
    if(callType == SCKCALL_SEND && err == SCKERR_OK) then
        print("Sent."); 
    end
     
	-- On socket receive message.
    if(callType == SCKCALL_REC_DATAGRAM && err == SCKERR_OK) then
        dprint(data .. "\n");
        GmodMap.connection:ReceiveDatagram();
    end
	
	-- On error.
    if(err != SCKERR_OK) then
		print( "Error "..err)
        socket:Close();
    end
end

---- -----------------------------------
--- Called when UDP socket receives a datagram
-- @param data [string] datagram
-- @param peer [string] ip of the peer
-- @param peerPort [number] port of the peer
----- ----------------------------------
function GmodMap.udpReceive( data, peer, peerPort )
	
end

---- -----------------------------------
--- Sends datagram over UDP
-- @param datagram
----- ----------------------------------
function GmodMap.udpSend( datagram )
	GmodMap.connection:Send( datagram, GmodMap.serverIp, GmodMap.serverPort )
end

---- -----------------------------------
--- Prints message to console if in debug mode.
-- @param message
----- ----------------------------------
function dprint( message )
	if GmodMap.debug then print( message ) end
end

-- Create looping think function that runs every second.
print('GMOD MAP')
GmodMap.udpInit()
GmodMap.start( GmodMap.send_players_interval, GmodMap.send_props_interval )