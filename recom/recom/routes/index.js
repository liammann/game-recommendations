
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

  // public api

  window.init = {
    ctx: function (ctx, next) {
      ctx.data = {};
      ctx.recom = {};
      next();
    }
  };

  window.route = {
    home: function (ctx, next) {
      get('views/home.html', function (html) {
        get('/recom/public/games.json', function (content) {
          ctx.data.games = JSON.parse(content).games;
        });
        ctx.data.index = 0;
        ctx.recom.content = html;
        $('.carousel').carousel({
          interval: 100
        });
        next();
      });
    },
    games: function (ctx, next) {
      get('/recom/views/games.html', function (html) {
        ctx.data.index = 1;
        get('public/games.json', function (content) {
          ctx.data.games = JSON.parse(content).games;
        });
        console.log(ctx);
        ctx.recom.content = html;
        next();
      });
    },
    game: function (ctx, next) {
      get('/recom/views/game.html', function (html) {
        console.log(ctx.params.name);
        ctx.data.index = ctx.params.name;

        ctx.recom.content = html;
        next();
      });
    },
    about: function (ctx, next) {
      get('views/about.html', function (html) {
        ctx.data.index = 2;
        ctx.recom.content = html;
        next();
      });
    }, 
    examples: function (ctx, next) {
      window.location.href = 'http://localhost:4000/';
    }
  };

  window.render = {
    content: function (ctx, next) {
      get('views/content.html', function (html) {
        var template = Hogan.compile(html),
          content = template.render(ctx.data, ctx.recom);
        //
        $('#content').empty().append(content);
        changeActive(ctx.data.index);
        if (typeof done === 'function') done(ctx.data.index);
      });
    }
  };

  window.done = null;
}());

