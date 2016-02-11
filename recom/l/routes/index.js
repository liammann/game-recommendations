
(function () {
  // private api

  var cache = {};

  function get (url, cb) {
    if (cache[url]) return cb(cache[url]);
    $.ajax({
      url: url,
      success: function(data) {
        cache[url] = data;
        cb(data);
      },
      error: function(jqXHR, textStatus, errorThrown) {
        console.log(jqXHR, textStatus, errorThrown);
      },
      dataType: 'text'
    });
  }

function setSelectedIndex(s, i)

{

s.options[i].selected = true;

return;

}

  // public api

  window.init = {
    ctx: function (ctx, next) {
      if(localStorage.getItem("userID") === null ){
        localStorage.setItem('userID',"none");
      }else if(localStorage.getItem("userID") > 0){
        ctx.userID = "&user_id="+localStorage.getItem("userID");
      } else {
        ctx.userID = "";
      }
      console.log(ctx.userID);

      ctx.data = {};
      ctx.recom = {};
      ctx.home = false;
      next();
    }


  };

  window.route = {
    home: function (ctx, next) {
      get('/l/public/games2.json', function (content) {
          ctx.data.games = JSON.parse(content).games;
             ctx.data.games.forEach(function (element, index) {
            ctx.data.games[index].averageRating = Math.floor(ctx.data.games[index].averageRating);
          }, ctx);
      });
      ctx.data.popular = {};
      get('http://localhost:4000/api/v1/games/recommendations?type=most_popular&time_lapse=prev_month'+ctx.userID, function (content) {
//      get('/l/public/games4.json', function (content) {
          ctx.data.popular.month = JSON.parse(content).games;
          ctx.data.popular.month.forEach(function (element, index) {
            ctx.data.popular.month[index].averageRating = Math.floor(ctx.data.popular.month[index].averageRating);
          }, ctx);
      });

      get('http://localhost:4000/api/v1/games/recommendations?type=most_popular&time_lapse=prev_year'+ctx.userID, function (content) {
//      get('/l/public/games3.json', function (content) {
          ctx.data.popular.year = JSON.parse(content).games;
          ctx.data.popular.year.forEach(function (element, index) {
            ctx.data.popular.year[index].averageRating = Math.floor(ctx.data.popular.year[index].averageRating);
          }, ctx);
      });

      get('http://localhost:4000/api/v1/games/recommendations?type=most_popular&time_lapse=prev_day'+ctx.userID, function (content) {
//      get('/l/public/games2.json', function (content) {
          ctx.data.popular.day = JSON.parse(content).games;
          ctx.data.popular.day.forEach(function (element, index) {
            ctx.data.popular.day[index].averageRating = Math.floor(ctx.data.popular.day[index].averageRating);
          }, ctx);
      });

      get('http://localhost:4000/api/v1/games/recommendations?type=top_rated'+ctx.userID, function (content) {
//      get('/l/public/games4.json', function (content) {
          ctx.data.top = JSON.parse(content).games;
                    ctx.data.top.forEach(function (element, index) {
            ctx.data.top[index].averageRating = Math.floor(ctx.data.top[index].averageRating);
          }, ctx);
      });
      get('/l/views/home.html', function (html) {
        ctx.data.index = 0;
        ctx.recom.content = html;
        $('.carousel').carousel({
          interval: 100
        });
        ctx.home = true;
        next();
      });
    },
    games: function (ctx, next) {
      get('/l/public/games.json', function (content) {
          ctx.data.games = JSON.parse(content).games;
          ctx.data.games.forEach(function (element, index) {
            ctx.data.games[index].averageRating = Math.floor(ctx.data.games[index].averageRating);
          }, ctx);

      });
      get('/l/views/games.html', function (html) {
        ctx.data.index = 1;
        
        console.log(ctx);
        ctx.recom.content = html;
        next();
      });
    },
    game: function (ctx, next) {

      get('http://localhost:4000/api/v1/games/'+ctx.params.name, function (content) {
//      get('/l/public/game1.json', function (content) {
        ctx.data.game = JSON.parse(content).game;
        ctx.data.game.averageRating = Math.floor(ctx.data.game.averageRating);
        ctx.data.game.releaseDate = new Date(ctx.data.game.releaseDate).toDateString();
        get('/l/views/game.html', function (html) {
          ctx.recom.content = html;
          next();
        });
      });
    }, 
    friends: function (ctx, next) {
      get('/l/public/friends.json', function (content) {
        ctx.data.friends = JSON.parse(content).user;
        get('/l/views/friends.html', function (html) {
          ctx.recom.content = html;
          next();
        });
      });
    }, 
    orders: function (ctx, next) {
      get('/l/public/orders.json', function (content) {
          ctx.data.orders = JSON.parse(content).orders;
     ctx.data.orders.forEach(function (element, index) {
            ctx.data.orders[index].orderDate = new Date(ctx.data.orders[index].orderDate).toDateString();
          }, ctx);


      });
      get('/l/views/orders.html', function (html) {        
        console.log(ctx.data);
        ctx.recom.content = html;
        next();
      });
    },
  };

  window.render = {
    content: function (ctx, next) {

      get('views/content.html', function (html) {
        var template = Hogan.compile(html),
        content = template.render(ctx.data, ctx.recom);

        $('#content').empty().append(content);
        changeActive(ctx.data.index);

     if(ctx.home){
       document.getElementById("day-btn").addEventListener("click", (function(){
          $(this).parent().find('a').removeClass("selected");
          $(this).addClass("selected")
          $("section.pop > div").removeClass("show");
          $("section.pop > div#day").addClass("show");
        }), false);
       document.getElementById("month-btn").addEventListener("click", (function(){
          $(this).parent().find('a').removeClass("selected");
          $(this).addClass("selected")
          $("section.pop > div").removeClass("show");
          $("section.pop > div#month").addClass("show");
        }), false);
       document.getElementById("year-btn").addEventListener("click", (function(){
          $(this).parent().find('a').removeClass("selected");
          $(this).addClass("selected")
          $("section.pop > div").removeClass("show");
          $("section.pop > div#year").addClass("show");
        }), false);



      }
        if (typeof done === 'function') done(ctx.data.index);
      });
      if(localStorage.getItem("userID") !== "none" ){
        setSelectedIndex(document.getElementById("logged-in-as"),localStorage.getItem("userID"));
      }

      document.getElementById("logged-in-as").addEventListener("change", (function(){
        localStorage.setItem('userID',this.value);
        location.reload();

      }), false);

       

    }
  };

  window.done = null;
}());

