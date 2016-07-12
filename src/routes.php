<?php
// Routes

$app->get('/[{name}]', function ($request, $response, $args) {
    // Sample log message
    $this->logger->info("Slim-Skeleton '/' route");

    // Render index view
    return $this->renderer->render($response, 'index.phtml', $args);
});

$app->get('/hello/[{name}]', function ($request, $response, $args) {
	// Log
	$this->logger->info("Hello World! '/hello/' route");

	// Render view
	return $this->twig->render('index.html', [
        'name' => $args['name']
	]);
});

$app->get('/webgl/test', function ($request, $response, $args) use ($app) {
	// Log 
	$this->logger->info("WebGL test '/webgl/test' route");
	
	// Render view
	return $this->twig->render('webgl/test.html', [
		'website' => $app->website
	]);
});

$app->get('/webgl/test/fullscreen', function ($request, $response, $args) use ($app) {
	// Log
	$this->logger->info("WebGL test game '/webgl/test/fullscreen' route");

	// Render view
	return $this->twig->render('webgl/test/game.html', [
        'website' => $app->website,
        'resource' => $app->resource
	]);
});

