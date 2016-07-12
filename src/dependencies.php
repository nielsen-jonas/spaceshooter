<?php
// DIC configuration

$container = $app->getContainer();

// view renderer
$container['renderer'] = function ($c) {
    $settings = $c->get('settings')['renderer'];
    return new Slim\Views\PhpRenderer($settings['template_path']);
};

// monolog
$container['logger'] = function ($c) {
    $settings = $c->get('settings')['logger'];
    $logger = new Monolog\Logger($settings['name']);
    $logger->pushProcessor(new Monolog\Processor\UidProcessor());
    $logger->pushHandler(new Monolog\Handler\StreamHandler($settings['path'], Monolog\Logger::DEBUG));
    return $logger;
};

// twig
$container['twig'] = function ($c) {
	$settings = $c->get('settings')['twig'];
	$loader = new Twig_Loader_Filesystem($settings['template_path']);
	/*$twig = new Twig_Environment($loader, [
		'cache' => $settings['cache_path']
	]);*/
    $twig = new Twig_Environment($loader);
	return $twig;
};