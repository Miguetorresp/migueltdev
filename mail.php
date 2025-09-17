<?php
$destino = "miguetorres30@gmail.com";
$asunto_default = "Formulario de contacto - miguelt.dev";
$recaptcha_secret = "6LcH3ssrAAAAAHqc6-deOLG9MYNlow8rGdErnerZ"; // pega aquí tu clave secreta de Google

function clean_input($value) {
    return htmlspecialchars(trim($value), ENT_QUOTES, 'UTF-8');
}

$name    = isset($_POST['name'])    ? clean_input($_POST['name'])    : '';
$email   = isset($_POST['email'])   ? filter_var($_POST['email'], FILTER_SANITIZE_EMAIL) : '';
$subject = isset($_POST['subject']) ? clean_input($_POST['subject']) : '';
$message = isset($_POST['message']) ? clean_input($_POST['message']) : '';
$captcha = isset($_POST['g-recaptcha-response']) ? $_POST['g-recaptcha-response'] : '';

$errors = [];
if ($name === '') $errors[] = "El nombre es obligatorio.";
if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) $errors[] = "Email inválido.";
if ($message === '') $errors[] = "El mensaje no puede estar vacío.";
if ($captcha === '') $errors[] = "Por favor confirma que no eres un robot.";

// Validar con Google reCAPTCHA
if ($captcha !== '') {
    $verifyUrl = "https://www.google.com/recaptcha/api/siteverify";
    $data = [
        'secret' => $recaptcha_secret,
        'response' => $captcha,
        'remoteip' => $_SERVER['REMOTE_ADDR'] ?? ''
    ];

    $options = [
        'http' => [
            'header'  => "Content-type: application/x-www-form-urlencoded\r\n",
            'method'  => 'POST',
            'content' => http_build_query($data),
        ],
    ];
    $context  = stream_context_create($options);
    $result = @file_get_contents($verifyUrl, false, $context);

    if ($result === false) {
        $errors[] = "Error al verificar reCAPTCHA.";
    } else {
        $resp = json_decode($result, true);
        if (!$resp['success']) {
            $errors[] = "Validación reCAPTCHA fallida.";
        }
    }
}

// Si hay errores
if (!empty($errors)) {
    echo "<ul style='color:red;'>";
    foreach ($errors as $e) echo "<li>$e</li>";
    echo "</ul>";
    exit;
}

// Construir email
$subject_mail = $subject !== '' ? $subject : $asunto_default;
$body = "Nuevo mensaje desde el formulario\n\n";
$body .= "Nombre: $name\nEmail: $email\nAsunto: $subject_mail\n\nMensaje:\n$message\n";

$headers = "From: no-reply@" . ($_SERVER['SERVER_NAME'] ?? "tu-dominio.com") . "\r\n";
$headers .= "Reply-To: $email\r\n";

if (@mail($destino, $subject_mail, $body, $headers)) {
      echo '<div class="alert alert-success alert-dismissible fade show" role="alert">
                <p style="text-align: center;"><strong>Mensaje enviado correctamente.</strong><br>Pronto me contactaré contigo '.$name.'.</p>
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>';
} else {
        echo '<div class="alert alert-danger alert-dismissible fade show" role="alert">
                <p style="text-align: center;"><strong>Error al enviar el mensaje.</strong><br>Intenta más tarde.</p>
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>';
}
?>
















$destino = "prueba@gmail.com";
$asunto_default = "Formulario de contacto - sitio web";

function clean_input($value) {
    return htmlspecialchars(trim($value), ENT_QUOTES, 'UTF-8');
}

$name    = isset($_POST['name'])    ? clean_input($_POST['name'])    : '';
$email   = isset($_POST['email'])   ? filter_var($_POST['email'], FILTER_SANITIZE_EMAIL) : '';
$subject = isset($_POST['subject']) ? clean_input($_POST['subject']) : '';
$message = isset($_POST['message']) ? clean_input($_POST['message']) : '';

$errors = [];
if ($name === '') $errors[] = "El nombre es obligatorio.";
if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) $errors[] = "Email inválido.";
if ($message === '') $errors[] = "El mensaje no puede estar vacío.";

if (!empty($errors)) {
    echo "<ul style='color:red;'>";
    foreach ($errors as $e) echo "<li>$e</li>";
    echo "</ul>";
    exit;
}

$subject_mail = $subject !== '' ? $subject : $asunto_default;
$body = "Nuevo mensaje desde el formulario\n\n";
$body .= "Nombre: $name\nEmail: $email\nAsunto: $subject_mail\n\nMensaje:\n$message\n";

$headers = "From: no-reply@" . ($_SERVER['SERVER_NAME'] ?? "tu-dominio.com") . "\r\n";
$headers .= "Reply-To: $email\r\n";

if (@mail($destino, $subject_mail, $body, $headers)) {
  
} else {

}
?>
