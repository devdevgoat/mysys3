module.exports.cron = {
    myFirstJob: {
      schedule: '1 * * * * *', //every fist second  ='1 * * * * *' ever second = '*/1 * * * * *'
      onTick: function () {
        console.log('Updating stats...');
        Player.find().populate('currentstats').exec(function(err, players){
        if (err) {return console.log(err);}
        for(let player of players) {
            let newLe = parseInt(player.currentstats[0].le);
            let newSe = parseInt(player.currentstats[0].se);
            let modifier = (parseInt(player.me) <= 0) ? 1 : parseInt(player.currentstats[0].me);
            
            if(player.currentstats[0].le < player.le){
              newLe = newLe + modifier;
            }
            // add an else here if you have to be full health to recharge super
            if (player.currentstats[0].se <player.maxse){
              newSe = newSe + modifier;
            }
            let updateTo = {
                id: player.currentstats[0].id,
                le: newLe,
                se: newSe
            };
            if(player.currentstats[0].le !=newLe ||  player.currentstats[0].se !=newSe ){
                Stats.update(player.currentstats[0].id,updateTo).exec(function(err, updates){
                    if (err) {return console.log(err);}
                    console.log('Updated '+player.name+' from:');
                    console.log(player.currentstats[0]);
                    console.log('to: ');
                    console.log(updates);
                });
            } else {
                console.log('No changes made to '+player.name);
            }
              
          }
        });
      }
    }
  };
  
