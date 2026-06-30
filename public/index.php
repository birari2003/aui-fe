<?php
/**
 * index.php — Universal SPA Router with Dynamic OG Tag Injection
 * 
 * This file acts as the entry point for all requests on shared hosting.
 * Apache prefers index.php over index.html (DirectoryIndex priority),
 * so ALL requests pass through here.
 *
 * For /showcase/{slug} routes: fetches showcase data from the API,
 * injects dynamic Open Graph meta tags, then serves the modified HTML.
 * For all other routes: serves index.html as-is for normal SPA behavior.
 */

$requestUri = $_SERVER['REQUEST_URI'] ?? '/';
$path = parse_url($requestUri, PHP_URL_PATH);

// Check if this is a showcase route: /showcase/{slug}
$isShowcase = false;
$showcaseId = '';
if (preg_match('#^/showcase/([a-zA-Z0-9_-]+)/?$#', $path, $matches)) {
    $isShowcase = true;
    $showcaseId = $matches[1];
}

// Load the static index.html template
$htmlFile = __DIR__ . '/index.html';
if (!file_exists($htmlFile)) {
    http_response_code(500);
    echo "Application template not found.";
    exit;
}
$html = file_get_contents($htmlFile);

// If this is a showcase route, inject dynamic OG meta tags
if ($isShowcase && !empty($showcaseId)) {
    $title = "AUI - Animation Industry Network";
    $description = "Watch this featured showcase on AUI.";
    $image = "https://auitalent.com/assets/logo_blck.png";
    $url = "https://auitalent.com/showcase/" . $showcaseId;

    // Fetch showreel data from Express API backend
    $apiUrl = "https://api.auitalent.com/api/showreels/" . urlencode($showcaseId);

    $ctx = stream_context_create([
        'http' => [
            'timeout' => 5,
            'ignore_errors' => true,
            'header' => "Accept: application/json\r\n"
        ]
    ]);

    $json = @file_get_contents($apiUrl, false, $ctx);
    if ($json) {
        $response = json_decode($json, true);
        if (isset($response['success']) && $response['success'] && isset($response['data'])) {
            $reel = $response['data'];

            $title = $reel['title'] ?? ($reel['artistName'] . "'s Showcase");
            $description = $reel['description'] ?? ("Watch " . $reel['artistName'] . "'s showcase on AUI.");
            if (!empty($reel['slug'])) {
                $url = "https://auitalent.com/showcase/" . $reel['slug'];
            }

            // Resolve thumbnail image
            if (!empty($reel['videoUrl'])) {
                $videoUrl = $reel['videoUrl'];
                // Detect YouTube
                if (preg_match('/(?:youtu\.be\/|v\/|u\/\w\/|embed\/|shorts\/|watch\?v=|&v=)([^#&?]{11})/', $videoUrl, $ytMatches)) {
                    $image = "https://img.youtube.com/vi/" . $ytMatches[1] . "/hqdefault.jpg";
                }
                // Detect Vimeo
                elseif (preg_match('/vimeo\.com\/(\d+)/', $videoUrl, $vimeoMatches)) {
                    $vimeoId = $vimeoMatches[1];
                    $vimeoJson = @file_get_contents("https://vimeo.com/api/v2/video/" . $vimeoId . ".json", false, $ctx);
                    if ($vimeoJson) {
                        $vimeoData = json_decode($vimeoJson, true);
                        if (!empty($vimeoData[0]['thumbnail_large'])) {
                            $image = $vimeoData[0]['thumbnail_large'];
                        }
                    }
                }
            }
        }
    }

    // Escape values for safe HTML embedding
    $safeTitle = htmlspecialchars($title, ENT_QUOTES, 'UTF-8');
    $safeDescription = htmlspecialchars($description, ENT_QUOTES, 'UTF-8');
    $safeUrl = htmlspecialchars($url, ENT_QUOTES, 'UTF-8');
    $safeImage = htmlspecialchars($image, ENT_QUOTES, 'UTF-8');

    // Replace <title>
    $html = preg_replace('/<title>.*?<\/title>/i', '<title>' . $safeTitle . ' | AUI</title>', $html);

    // Replace meta description
    $html = preg_replace('/<meta name="description" content=".*?" \/>/i', '<meta name="description" content="' . $safeDescription . '" />', $html);

    // Replace Open Graph tags
    $html = preg_replace('/<meta property="og:title" content=".*?" \/>/i', '<meta property="og:title" content="' . $safeTitle . '" />', $html);
    $html = preg_replace('/<meta property="og:description" content=".*?" \/>/i', '<meta property="og:description" content="' . $safeDescription . '" />', $html);
    $html = preg_replace('/<meta property="og:url" content=".*?" \/>/i', '<meta property="og:url" content="' . $safeUrl . '" />', $html);
    $html = preg_replace('/<meta property="og:type" content=".*?" \/>/i', '<meta property="og:type" content="video.other" />', $html);

    // Replace Twitter tags
    $html = preg_replace('/<meta name="twitter:title" content=".*?" \/>/i', '<meta name="twitter:title" content="' . $safeTitle . '" />', $html);
    $html = preg_replace('/<meta name="twitter:description" content=".*?" \/>/i', '<meta name="twitter:description" content="' . $safeDescription . '" />', $html);

    // Inject og:image and twitter:image before </head>
    $imageTags = "\n    <meta property=\"og:image\" content=\"" . $safeImage . "\" />" .
                 "\n    <meta name=\"twitter:image\" content=\"" . $safeImage . "\" />";
    $html = str_replace('</head>', $imageTags . "\n  </head>", $html);
}

// Serve the HTML (modified or original)
header('Content-Type: text/html; charset=UTF-8');
echo $html;
?>
