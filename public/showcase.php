<?php
// showcase.php
$id = $_GET['id'] ?? '';

$title = "AUI - Animation Industry Network";
$description = "Watch this featured showcase on AUI.";
$image = "https://auitalent.com/assets/logo_blck.png";
$url = "https://auitalent.com/showcase/" . $id;

if (!empty($id)) {
    // Fetch showreel data from Express API backend
    $apiUrl = "https://api.auitalent.com/api/showreels/" . urlencode($id);
    
    // Set a short timeout for the request
    $ctx = stream_context_create([
        'http' => [
            'timeout' => 5,
            'ignore_errors' => true
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
                if (preg_match('/(?:youtu\.be\/|v\/|u\/\w\/|embed\/|shorts\/|watch\?v=|&v=)([^#&?]{11})/', $videoUrl, $matches)) {
                    $image = "https://img.youtube.com/vi/" . $matches[1] . "/hqdefault.jpg";
                } 
                // Detect Vimeo
                elseif (preg_match('/vimeo\.com\/(\d+)/', $videoUrl, $matches)) {
                    $vimeoId = $matches[1];
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
}

// Load static index.html template
$htmlFile = __DIR__ . '/index.html';
if (file_exists($htmlFile)) {
    $html = file_get_contents($htmlFile);
    
    // Replace titles and descriptions
    $html = preg_replace('/<title>.*?<\/title>/i', '<title>' . htmlspecialchars($title) . ' | AUI</title>', $html);
    $html = preg_replace('/<meta name="description" content=".*?" \/>/i', '<meta name="description" content="' . htmlspecialchars($description) . '" />', $html);
    
    // Replace Open Graph tags
    $html = preg_replace('/<meta property="og:title" content=".*?" \/>/i', '<meta property="og:title" content="' . htmlspecialchars($title) . '" />', $html);
    $html = preg_replace('/<meta property="og:description" content=".*?" \/>/i', '<meta property="og:description" content="' . htmlspecialchars($description) . '" />', $html);
    $html = preg_replace('/<meta property="og:url" content=".*?" \/>/i', '<meta property="og:url" content="' . htmlspecialchars($url) . '" />', $html);
    $html = preg_replace('/<meta property="og:type" content=".*?" \/>/i', '<meta property="og:type" content="video.other" />', $html);
    
    // Replace Twitter tags
    $html = preg_replace('/<meta name="twitter:title" content=".*?" \/>/i', '<meta name="twitter:title" content="' . htmlspecialchars($title) . '" />', $html);
    $html = preg_replace('/<meta name="twitter:description" content=".*?" \/>/i', '<meta name="twitter:description" content="' . htmlspecialchars($description) . '" />', $html);
    
    // Inject image meta tags before </head>
    $imageTags = "\n    <meta property=\"og:image\" content=\"" . htmlspecialchars($image) . "\" />" . 
                 "\n    <meta name=\"twitter:image\" content=\"" . htmlspecialchars($image) . "\" />";
    $html = str_replace('</head>', $imageTags . "\n  </head>", $html);
    
    echo $html;
} else {
    echo "Template not found.";
}
?>
