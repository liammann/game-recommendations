
page('*', init.ctx);
page('/recom/home', route.home);
page('/recom/game', route.games);
page('/recom/game/:name', route.game);
page('*', render.content);
page({ dispatch: false });
