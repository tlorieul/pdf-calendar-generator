<?php
require __DIR__ . '/vendor/autoload.php';

/*
$log = new Monolog\Logger('name');
$log->pushHandler(new Monolog\Handler\StreamHandler('app.log', Monolog\Logger::WARNING));
$log->warning('Foo');
*/

use mikehaertl\wkhtmlto\Pdf;

// You can pass a filename, a HTML string, an URL or an options array to the constructor
$options = array(
    'enable-local-file-access',
    // 'zoom' => 1.33,
    'disable-smart-shrinking',
    'margin-top' => 0,
    'margin-right' => 0,
    'margin-bottom' => 0,
    'margin-left' => 0,
);
$pdf = new Pdf($options);
$pdf->addPage('affiche_test.html');

// On some systems you may have to set the path to the wkhtmltopdf executable
// $pdf->binary = 'C:\...';

if (!$pdf->saveAs('tests/test_wkhtmltopdf.pdf')) {
    $error = $pdf->getError();
    // ... handle error here
    print($error);
}
