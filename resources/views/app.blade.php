<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
    <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700&display=swap" rel="stylesheet">
    <link href='https://unpkg.com/maplibre-gl@1.15.2/dist/maplibre-gl.css' rel='stylesheet' />
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

