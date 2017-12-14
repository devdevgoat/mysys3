/****************** BEG DRAGDROP ******************/
function dragstart_handler(ev) {
    console.log("dragStart");
    // Add the target element's id to the data transfer object
    ev.dataTransfer.setData("text/plain", ev.target.id);
}

function dragover_handler(ev) {
    ev.preventDefault();
    // Set the dropEffect to move

    //is this where I can chagne the on hover style?
    //if so, I could get the immediate siblings on either side for multi targets
    ev.dataTransfer.dropEffect = "move";
}
function drop_handler(ev) {
    ev.preventDefault();
    // Get the id of the target and add the moved element to the target's DOM
    var fullId = ev.dataTransfer.getData("text").split('-');
    var taskId = fullId[0];
    var task = '';
    var item = fullId[1];
    var playerId = fullId[2];
    var inventoryId = fullId[3];
    switch (taskId) {
        case 'give':
        task = 'giveItem';
            data = {
                playerId: ev.target.id, //this is the target playerId
                itemId: item
            };
            break;
        case 'use':
            task = 'useItem';
            data = {
                gameId: gameId,
                playerId: playerId,
                itemId: item,
                inventoryId: inventoryId,
                targets: ev.target.id
            };
            break;
        default:
            break;
    }
    if (ev.target.id.length < 20) {
        console.log('aborting due to target id not a player');
        return;
    }

    io.socket.post('/' + task, data, function (resData, jwres) {
        
    });
    //alert(JSON.stringify(data));
}

/****************** END DRAGDROP ******************/

let where = {
    user:  user,
    type:  'npc'
};
io.socket.on('connect', function () {
    io.socket.get('/game/' + gameId, function (resData, jwres) {
        let players = resData.players;
        let notifications = resData.notifications;
        $.each(players, function (k, v) {
            addPlayer(v);
        });
        $.each(notifications, function (k, v) {
            addNotification(v.id, v.text);
        });
    });
    //?where={"createdBy":'+'"<%=session.user.id%>"'+'}'
    io.socket.get('/item', function (resData, jwres) {
        let items = resData;
        $.each(items, function (k, v) {
            addItem(v, 'stuff-list');
        });
    });

    io.socket.get('/player?where='+JSON.stringify(where), function(resData, jwres) {
        $.each(resData, function (k,v) {
            addToNPCList(v);
        });
    });

    io.socket.on('notification', function (event) {
        //don't forget to replace the blast for link removal with direct update by game room
        switch (event.verb) {
            case 'updated':
                $('#' + event.id).html(event.data.text);
                break;
            case 'destroyed':
                $('#' + event.id).parent().slideUp().remove();
                break;
            default:
        }
    });

    io.socket.on('inventory', function (event) {
        /*
        {  
       "id":"5a29944a7bc1d06c526b1179",
       "verb":"addedTo",
       "attribute":"item",
       "addedId":"5a0736399bfb40d521b8f555",
       "added":{  
          "name":"Potion of Life",
          "desc":"A life drink",
          "amount":10,
          "type":"item",
          "target":"LE",
          "action":"cure",
          "image":"#",
          "createdAt":"2017-11-11T17:41:13.729Z",
          "updatedAt":"2017-11-11T17:41:13.729Z",
          "id":"5a0736399bfb40d521b8f555",
          "player":{  
             "inventory":[  
                {  
                   "player":"5a29944a7bc1d06c526b1177",
                   "createdAt":"2017-12-07T19:19:38.547Z",
                   "updatedAt":"2017-12-09T18:31:44.000Z",
                   "id":"5a29944a7bc1d06c526b1179"
                }
             ],
             "currentstats":[  
                {  
                   "player":"5a29944a7bc1d06c526b1177",
                   "pe":"60",
                   "se":"33",
                   "me":"12",
                   "pm":"19",
                   "mm":"0",
                   "sm":"0",
                   "le":"100",
                   "createdAt":"2017-12-07T19:19:38.545Z",
                   "updatedAt":"2017-12-09T18:15:39.844Z",
                   "id":"5a29944a7bc1d06c526b1178"
                }
             ],
             "user":"5a14450fe20544ad4f444325",
             "game":"5a072a5fb349a6e220542e16",
             "name":"Altair",
             "type":"pc",
             "backstory":"Altair is a Vashela veteran turned Vashela vagabond due to a gambling and drinking addiction. Being a Besides being very gifted with a blade, he has the power of Berserking, in which he deals 30% more melee damage and receives 20% less melee damage. However, his feeble knowledge of the arcane makes him 35% weaker to all magic attacks. ",
             "maxpe":60,
             "maxme":12,
             "maxse":33,
             "image":"/images/playerimgs/f2a7ddc3-e9ba-40e2-bf97-49069468049b.jpg",
             "lvl":"1",
             "le":100,
             "state":"alive",
             "createdAt":"2017-12-07T19:19:38.542Z",
             "updatedAt":"2017-12-09T15:26:20.820Z",
             "id":"5a29944a7bc1d06c526b1177"
          }
       }
    }*/
        switch (event.verb) {
            case 'addedTo':
                addItem(event.added, 'npc-inventory');
                break;
            case 'removedFrom':
                removeItem(event.removedId);
                break;
            default:
                console.warn('Unrecognized socket event (`%s`) from server:', event.verb, event);
        }

    });
    /*
    {"verb":"updated","data":{"pe":"32"},"id":"59fe6720ce5ea5d02791ae43"}
    */
    io.socket.on('stats', function (event) {
        if (event.verb == 'updated') {
            updateStat(event.data);
        }
    });

    io.socket.on('game', function (event) { //need to decifer between player adds and notifications?
        // {"id":"59fdd1439aee4e031e61f91f",
        // "verb":"addedTo",
        //"attribute" :"notifications",
        // "addedId":"59fef31ba264a60e2a88e5c1",
        // "added":{"game":"59fdd1439aee4e031e61f91f",
        // "text":"Finn woke up2000",
        // "createdAt":"2017-11-05T11:16:43.488Z",
        // "updatedAt":"2017-11-05T11:16:43.488Z",
        // "id":"59fef31ba264a60e2a88e5c1"}}
        switch (event.verb) {
            case 'addedTo':
                switch (event.attribute) {
                    case 'notifications':
                        addNotification(event.addedId,event.added.text);
                    break;
                    case 'players':
                        addPlayer(event.added);
                    break;
                    default:
                    console.warn('Unrecognized socket event (`%s`) from server:',event.verb, event);
                }
              break;
            case 'removedFrom':
                switch (event.attribute) {
                    case 'notifications':
                        //addNotification(event.added.text);
                    break;
                    case 'players':
                        removePlayer(event.removedId);
                    break;
                    default:
                    console.warn('Unrecognized socket event (`%s`) from server:',event.verb, event);
                }
            break;
            default:
              console.warn('Unrecognized socket event (`%s`) from server:',event.verb, event);
          }
    });

});//end socket connect  connect
function addNotification(id, text) {
    let html = '<div class="notification"><h2 id=' + id + '>' + text + '</h2></div>';
    $(html).prependTo('#notifications').hide().slideDown();
}

function addItem(item, div) {
    let playerId = '';
    let inventoryId = '';
    let isNpc = true;
    if (typeof item.player === 'undefined') {
        playerId = 'null_player_id';
        inventoryId = 'null_inv_id';
    } else {
        playerId = item.player.id;
        inventoryId = item.player.inventory[0].id;
        div = div + '-' + playerId;
        if (item.player.type == 'pc') {
            isNpc = false; //only changes if a player is involved, so item list updates arnt effected
        }
    }

    if (isNpc) {
        let html = '<li draggable="true" ondragstart="dragstart_handler(event);" id="give-'
            + item.id + '-' + playerId + '-' + inventoryId + '">' + item.name +
            '<span>[' + item.action + '][' + item.amount + item.target + ']</span></li>';
        $(html).prependTo('#' + div).hide().slideDown();
    }
}

function addToNPCList(npc) {
    let statData = {
        pe: parseInt(npc.currentstats[0].pe) + parseInt(npc.currentstats[0].pm),
        me: parseInt(npc.currentstats[0].me) + parseInt(npc.currentstats[0].mm),
        se: parseInt(npc.currentstats[0].se) + parseInt(npc.currentstats[0].sm),
        le: parseInt(npc.currentstats[0].le)
    }
    let html = '<li><div class=add onclick="addNpc(\''
            + npc.id + 
            '\');">+ </div>' + npc.name +
            '<div id="npc-stats"><div>' +
            '<img id=' + npc.id + ' src="/images/like.png" alt="LE">'
            + statData.le +
            '</div><div><img src="/images/body-building.png" alt="PE">'
            + statData.pe +
            '</div><div><img src="/images/management.png" alt="ME">'
            + statData.me +
            '</div><div><img src="/images/hold.png" alt="SE">'
            + statData.se +
            '</div></div></li>';
        $(html).prependTo('#npc-list');
}

function addNpc(npcId){
    data = {
        gameId:gameId,
        playerId: npcId
    };
    io.socket.post('/addNpc', data, function (resData, jwres) {
      });

}

function editStats(data){
    io.socket.post('/editstats', data, function (resData, jwres) {
      
    });
} 
function createItem(data){
    io.socket.post('/createitem', data, function (resData, jwres) {
        //{"name":"Wooden Sword","desc":"Pine","amount":4,"type":"item","target":"pe","action":"inflict","image":"","createdAt":"2017-12-13T02:17:44.431Z","updatedAt":"2017-12-13T02:17:44.431Z","id":"5a308dc8a8a996ab340d86b5"}
        addItem(resData,'stuff-list');
    });
}

function addPlayer(player) {
    //subscribe to the player
    io.socket.get('/player/' + player.id, function (resData, jwres) {
        /*{"inventory":
            [{"player":"59fe6720ce5ea5d02791ae42","createdAt":"2017-11-05T01:19:28.114Z","updatedAt":"2017-11-05T01:21:06.651Z","id":"59fe6720ce5ea5d02791ae44"}],
        "currentstats":
            [{"player":"59fe6720ce5ea5d02791ae42","pe":"32","se":"11","me":"12","pm":"0","mm":"0","sm":"0","le":"100", "createdAt":"2017-11-05T01:19:28.112Z","updatedAt":"2017-11-07T01:35:48.999Z","id":"59fe6720ce5ea5d02791ae43"}],
        "user":
            {"firstname":"Russell","lastname":"Lamb","email":"russell.w.lamb@gmail.com","createdAt":"2017-11-04T14:39:37.799Z","updatedAt":"2017-11-04T14:39:37.813Z","id":"59fdd1299aee4e031e61f91e"},
        "game":
            {"title":"hive mind","about":"get to work","image":"#","gm":"59feea65ce5ea5d02791ae46","minlvl":"1","createdAt":"2017-11-05T10:40:19.762Z","updatedAt":"2017-11-07T01:36:24.931Z","id":"59feea93ce5ea5d02791ae4a"},
        "name":"yuyu","backstory":"888","maxpe":8,"maxme":8,"maxse":8,"image":"//images/playerimgs/16660b27-e9c4-4215-9544-89c2e74fb2ce.JPG","lvl":"1","le":100,"createdAt":"2017-11-05T01:19:28.108Z","updatedAt":"2017-11-07T01:36:24.935Z","id":"59fe6720ce5ea5d02791ae42"}*/
        let stats = resData.currentstats[0];
        let inventoryId = resData.inventory[0].id;
        let statData = {
            pe: parseInt(stats.pe) + parseInt(stats.pm),
            me: parseInt(stats.me) + parseInt(stats.mm),
            se: parseInt(stats.se) + parseInt(stats.sm),
            le: parseInt(stats.le)
        }
        //updateStat(statData);

        let editStatHtml = '<option value="'+stats.id+'">'+player.name+'</option>';

        //alert(JSON.stringify(player));
        if (player.type == 'npc') {
            //subscribe to npc's inventoreis
            io.socket.get('/inventory/' + inventoryId, function (invData, inJwres) {
                let items = invData.item;
                let itemHTML = '';
                $.each(items, function (k, item) {
                    //addItem(v);
                    itemHTML += '<li draggable="true" ondragstart="dragstart_handler(event);" id="use-'
                        + item.id + '-' + player.id + '-' + inventoryId + '">' + item.name +
                        '<span>' +
                        // '['+item.action+']'+
                        '[' + item.amount + item.target + ']</span></li>';
                });
                let html =
                    '<div class="strip" id='
                    + player.id +
                    ' ondrop="drop_handler(event);" ondragover="dragover_handler(event);"><div  class=remove onclick="removeNPC(\''
                    + player.id +
                    '\');">x</div><div id=' + player.id + ' class="img-circle" src="'
                    + player.image +
                    '"></div> <div id=' + player.id + ' class="details"><h3>'
                    + player.name +
                    '</h3><div id="npc-stats" class="'+stats.id+'"><div>' +
                    '<img id=' + player.id + ' src="/images/like.png" alt="LE">'
                    + statData.le +
                    '</div><div><img src="/images/body-building.png" alt="PE">'
                    + statData.pe +
                    '</div><div><img src="/images/management.png" alt="ME">'
                    + statData.me +
                    '</div><div><img src="/images/hold.png" alt="SE">'
                    + statData.se +
                    '</div></div><div id="npc-inventory" ><ul id=npc-inventory-'
                    + player.id + '>'
                    + itemHTML +
                    '</ul></div></div></div>';
                $(html).appendTo('#right-sidebar #players-section');
            });
        } else {
            let html = '<div id=' + player.id + ' class="strip" ondrop="drop_handler(event);" ondragover="dragover_handler(event);">\
        <img id='+ player.id + ' src=' + player.image + ' class="img-circle">\
        <div  id='+ player.id + ' class="details">\
        <h3  id='+ player.id + ' >' + player.name + '</h3><div id="pc-stats">\
            <div>\
                <img src="/images/like.png" alt="LE">\
                <progress id="le-'+stats.id+'" value="'+ statData.le + '" max="100"></progress>\
            </div>\
            <div>\
                <img src="/images/body-building.png" alt="PE">\
                <progress id="pe-'+stats.id+'" value="'+ statData.pe + '" max="100"></progress>\
            </div>\
            <div>\
                <img src="/images/management.png" alt="ME">\
                <progress id="me-'+stats.id+'" value="'+ statData.me + '" max="100"></progress>\
            </div>\
            <div>\
                <img src="/images/hold.png" alt="SE">\
                <progress id="se-'+stats.id+'" value="'+ statData.se + '" max="100"></progress>\
            </div></div>';

            // '<div id='+player.id+' class="strip" ondrop="drop_handler(event);" ondragover="dragover_handler(event);">\
            // <img id='+player.id+' src='+ player.image +' class="img-circle">\
            // <div  id='+player.id+' class="details">\
            // 	<h3  id='+player.id+' >'+player.name+'</h3>\
            // 	<progress id="health" value="'+player.le+'" max="100"></progress>\
            // </div>\
            // </div> \
            // </div>';
            $(html).prependTo('#players-section').hide().slideDown();
            $(editStatHtml).prependTo('#statsid').hide().slideDown();
        }


    });//end socket get
}

function removePlayer(playerId) {
    $("div").remove('#'+playerId);
}

function updateStat(data) {
    $.each(data, function (k, v) {
        // if (k == "le") {
        //     $('#le-'+data.id).val(v);
        // } else
         if (k!='id'){
            $('#'+k+'-'+data.id).val(v);
        }
    })
}

function removeNPC(npcId) {
    let data = {
        gameId: gameId,
        npcId: npcId
    };
    io.socket.post('/removeNpc', data, function (resData, jwres) {
        
            });
}



$(document).ready(function () {
    // instanciate new modal

});

