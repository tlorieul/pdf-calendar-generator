<?php
//============================================================+
// File name   : example_001.php
// Begin       : 2008-03-04
// Last Update : 2013-05-14
//
// Description : Example 001 for TCPDF class
//               Default Header and Footer
//
// Author: Nicola Asuni
//
// (c) Copyright:
//               Nicola Asuni
//               Tecnick.com LTD
//               www.tecnick.com
//               info@tecnick.com
//============================================================+

/**
 * Creates an example PDF TEST document using TCPDF
 * @package com.tecnick.tcpdf
 * @abstract TCPDF - Example: Default Header and Footer
 * @author Nicola Asuni
 * @since 2008-03-04
 */

// Include the main TCPDF library (search for installation path).
//require_once('tcpdf_include.php');
require_once('vendor/tecnickcom/tcpdf/tcpdf.php');

// create new PDF document
$pdf = new TCPDF(PDF_PAGE_ORIENTATION, PDF_UNIT, PDF_PAGE_FORMAT, true, 'UTF-8', false);

// set document information
/*
$pdf->SetCreator(PDF_CREATOR);
$pdf->SetAuthor('Nicola Asuni');
$pdf->SetTitle('TCPDF Example 001');
$pdf->SetSubject('TCPDF Tutorial');
$pdf->SetKeywords('TCPDF, PDF, example, test, guide');
*/

// set default header data
$pdf->SetHeaderData(PDF_HEADER_LOGO, PDF_HEADER_LOGO_WIDTH, PDF_HEADER_TITLE.' 001', PDF_HEADER_STRING, array(0,64,255), array(0,64,128));
$pdf->setFooterData(array(0,64,0), array(0,64,128));

// set header and footer fonts
$pdf->setHeaderFont(Array(PDF_FONT_NAME_MAIN, '', PDF_FONT_SIZE_MAIN));
$pdf->setFooterFont(Array(PDF_FONT_NAME_DATA, '', PDF_FONT_SIZE_DATA));

// set default monospaced font
$pdf->SetDefaultMonospacedFont(PDF_FONT_MONOSPACED);

// set margins
$pdf->SetMargins(PDF_MARGIN_LEFT, PDF_MARGIN_TOP, PDF_MARGIN_RIGHT);
$pdf->SetHeaderMargin(PDF_MARGIN_HEADER);
$pdf->SetFooterMargin(PDF_MARGIN_FOOTER);

// set auto page breaks
$pdf->SetAutoPageBreak(TRUE, PDF_MARGIN_BOTTOM);

// set image scale factor
$pdf->setImageScale(PDF_IMAGE_SCALE_RATIO);

// set some language-dependent strings (optional)
if (@file_exists(dirname(__FILE__).'/lang/eng.php')) {
    require_once(dirname(__FILE__).'/lang/eng.php');
    $pdf->setLanguageArray($l);
}

// ---------------------------------------------------------

// set default font subsetting mode
$pdf->setFontSubsetting(true);

// Set font
// dejavusans is a UTF-8 Unicode font, if you only need to
// print standard ASCII chars, you can use core fonts like
// helvetica or times to reduce file size.
$pdf->SetFont('dejavusans', '', 14, '', true);

// Add a page
// This method has several options, check the source code documentation for more information.
$pdf->AddPage();

// set text shadow effect
$pdf->setTextShadow(array('enabled'=>true, 'depth_w'=>0.2, 'depth_h'=>0.2, 'color'=>array(196,196,196), 'opacity'=>1, 'blend_mode'=>'Normal'));

// Set some content to print
$html = <<<EOD
<html>
  <head>
<style>
html {
	background-color: grey;
}

body {
	background-image: linear-gradient(white, #11a288); 
	/*background-color: white;*/
	color: #36478f;
	height: 297mm;
	width: 210mm;

	/* TO CHANGE */
	/*font-family: verdana;*/
	font-size: 15pt;
	font-family: Raleway,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Oxygen,Ubuntu,Cantarell,Fira Sans,Droid Sans,Helvetica Neue,sans-serif;
}

header {
	display: block;
	height: 40mm;
	background-image: url("logo.png");
	background-repeat: no-repeat;
	background-position: 20mm 50%;
	background-size: 50mm 25mm;

	padding: 0mm 10mm 0mm;
	text-align: right;
}

h1 {
	margin: 0;
	font-size: 22pt;
}

div {
	margin: 0mm 0mm 3mm 22mm;
	padding: 1mm 3mm 2mm;

	width: 170mm;

	border: 3px solid #36478f;
	border-radius: 25px;
	background-color: #fff1e8;
}

date {
	margin: 2mm 2mm 3mm -20mm;
	padding: 2mm 1mm 2mm;
	height: 24mm;
	width: 30mm;
	display: block;

	border: 3px solid #eb7748;
	border-radius: 25px;
	background-color: white;
	color: #eb7748;
	font-weight: bold;
	text-transform: uppercase;
	text-align: center;
	float: left;
}

jour {
	margin: -3mm -1mm -2mm;
	display: block;
	color: #36478f;
	font-size: 50pt;
	font-weight: 900;
}

heure {
	color: #eb7748;
	font-weight: bold;
}
</style>
  </head>
  
  <body>

	<header>
	  <h1 style="font-size: 65pt; margin-bottom: -2.5mm;">Mars</h1>

	  quartiergenereux.fr <br>
	  QG.montpellier
	</header>
	
	<div>
	  <date>Mercredi <jour>06</jour></date>
	  <heure>19H30 - 21H30</heure>
	  <h1>🟣 Atelier sur le consentement</h1>
	  Atelier animé par le collectif NousToutes 34 qui propose
	  de définir, décrypter et outiller le public sur la notion de
	  "Consentement", à partir de présentations et d’échanges.
	  Ouvert à toutes et tous
	</div>

	<div>
	  <date>Jeudi <jour>07</jour></date>
	  <heure>19H - 21H</heure>
	  <h1>📽️ Projection mémoires d'ouvriers</h1>
	  Un Café Fakir autour du film réalisé par Gilles Perret, qui fait émerger la mémoire sur la condition ouvrière dans les montagnes de Savoie
	</div>

	<div>
	  <date>Vendredi <jour>08</jour></date>
	  <heure>18H30 - 23H</heure>
	  <h1>🎶 Soirée spéciale 8 MARS</h1>
	  Après la grève et la manif’, l’Ultraviolette et le QG t’invitent à faire du bruit différemment : vernissage Expo photo “Ma nuit” - chorales militantes - scène ouverte féministe - DJ Set Laser
	</div>

	<div>
	  <date>Samedi <jour>09</jour></date>
	  <heure>10H30 - 23H</heure>
	  <h1>🙋 Le QG fait son AG</h1>
	  Pour son Assemblée Générale et généreuse, le QG prend ses quartiers à Gambetta en journée. Puis, le soir, retour au QG pour faire la fiest’AG à partir de 20h
	  Bénévoles et adhérentes : venez fêter ça !
	</div>

	
	<!--
	<div>
	  <date>Vendredi <jour>15</jour></date>
	  <h1>🎲 Soirée jeux</h1>
	  Soirée jeux vidéo et jeux de réalité virtuelle avec l'association Le Récif
	</div>
 -->

  </body>
</html>
EOD;

// Print text using writeHTMLCell()
$pdf->writeHTMLCell(0, 0, '', '', $html, 0, 1, 0, true, '', true);

// ---------------------------------------------------------

// Close and output PDF document
// This method has several options, check the source code documentation for more information.
$pdf->Output('example_001.pdf', 'I');

//============================================================+
// END OF FILE
//============================================================+
