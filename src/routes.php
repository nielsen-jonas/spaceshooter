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
	$this->logger->info("Hello World! '/' route");

	// Render view
	return $this->twig->render('index.html', [
        'name' => $args['name']
	]);
});


