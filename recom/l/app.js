
page('*', init.ctx);
page('/l/', route.home);
page('/l/home', route.home);
page('/l/friends', route.friends);
page('/l/games', route.games);
page('/l/game/:name', route.game);
page('/l/orders', route.orders);
page({ dispatch: true });
page('*', render.content);
