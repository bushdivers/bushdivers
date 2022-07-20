<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
    <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700&display=swap" rel="stylesheet">
    <link href='https://unpkg.com/maplibre-gl@1.15.2/dist/maplibre-gl.css' rel='stylesheet' />
    <script>
      (function (w,d,s,o,f,js,fjs) { w['ReleaseNotesWidget']=o;w[o] = w[o] || function () { (w[o].q = w[o].q || []).push(arguments) }; js = d.createElement(s), fjs = d.getElementsByTagName(s)[0]; js.id = o; js.src = f; js.async = 1; fjs.parentNode.insertBefore(js, fjs); }
      (window, document, 'script', 'rnw', 'https://s3.amazonaws.com/cdn.releasenotes.io/v1/bootstrap.js'));

      rnw('init', {
        account: 'bush-divers.releasenotes.io',
        selector: '.rn-badge', // change the CSS selector to apply the badge and link to
      });
    </script>
    @routes
    @viteReactRefresh
    @vite('resources/js/app.jsx')
    <script>
        window.global = window
    </script>
</head>
<body class="bg-gray-50">
    @inertia
</body>
</html>

