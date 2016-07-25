<?php

// Routes
$app->get('/', function ($request, $response, $args) use ($app) {
	// Log 
	$this->logger->info("Asteroids '/' route");
	
	// Render view
	return $this->twig->render('index.html', [
		'website' => $app->website
	]);
});

$app->get('/src', function ($request, $response, $args) use ($app) {
	// Log
	$this->logger->info("Asteroids src '/src' route");

	// Render view
	return $this->twig->render('game.html', [
        'website' => $app->website,
        'resource' => $app->resource
	]);
});

