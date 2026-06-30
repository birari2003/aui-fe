<?php
/**
 * index.php — Universal SPA Router with Dynamic OG Tag Injection
 * 
 * This file acts as the entry point for all requests on shared hosting.
 * Apache prefers index.php over index.html (DirectoryIndex priority),
 * so ALL requests pass through here.
 */

$requestUri = $_SERVER['REQUEST_URI'] ?? '/';
$path = parse_url($requestUri, PHP_URL_PATH);

// Initialize metadata defaults
$title = "AUI - Animation Industry Network";
$description = "Connecting animation talent, production houses, and educational institutes.";
$image = "https://auitalent.com/assets/logo_blck.png";
$url = "https://auitalent.com" . $path;
$type = "website";
$isMatched = false;

$ctx = stream_context_create([
    'http' => [
        'timeout' => 5,
        'ignore_errors' => true,
        'header' => "Accept: application/json\r\n"
    ]
]);

// 1. Showcase route: /showcase/{slug}
if (preg_match('#^/showcase/([a-zA-Z0-9_-]+)/?$#', $path, $matches)) {
    $isMatched = true;
    $showcaseId = $matches[1];
    $apiUrl = "https://api.auitalent.com/api/showreels/" . urlencode($showcaseId);
    $json = @file_get_contents($apiUrl, false, $ctx);
    if ($json) {
        $response = json_decode($json, true);
        if (isset($response['success']) && $response['success'] && isset($response['data'])) {
            $reel = $response['data'];
            $title = $reel['title'] ?? ($reel['artistName'] . "'s Showcase");
            $description = $reel['description'] ?? ("Watch " . $reel['artistName'] . "'s showcase on AUI.");
            $type = "video.other";
            
            // Prioritize custom thumbnail
            if (!empty($reel['thumbnail'])) {
                $thumb = $reel['thumbnail'];
                $image = (strpos($thumb, 'http') === 0 || strpos($thumb, 'data:') === 0) 
                    ? $thumb 
                    : "https://api.auitalent.com/" . ltrim(str_replace('\\', '/', $thumb), '/');
            } elseif (!empty($reel['videoUrl'])) {
                $videoUrl = $reel['videoUrl'];
                if (preg_match('/(?:youtu\.be\/|v\/|u\/\w\/|embed\/|shorts\/|watch\?v=|&v=)([^#&?]{11})/', $videoUrl, $ytMatches)) {
                    $image = "https://img.youtube.com/vi/" . $ytMatches[1] . "/hqdefault.jpg";
                } elseif (preg_match('/vimeo\.com\/(\d+)/', $videoUrl, $vimeoMatches)) {
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
}
// 2. Talent route: /talent/{code}
elseif (preg_match('#^/talent/([a-zA-Z0-9_-]+)/?$#', $path, $matches)) {
    $isMatched = true;
    $talentCode = $matches[1];

    if (strpos($talentCode, '-STU-') !== false) {
        // Studio public profile
        $apiUrl = "https://api.auitalent.com/api/studio-public-profile/talent/" . urlencode($talentCode);
        $json = @file_get_contents($apiUrl, false, $ctx);
        if ($json) {
            $response = json_decode($json, true);
            if (isset($response['ok']) && $response['ok'] && isset($response['data'])) {
                $studio = $response['data'];
                $title = ($studio['name'] ?? $talentCode) . " - Studio Portfolio";
                $description = !empty($studio['about']) ? $studio['about'] : "Explore the creative portfolio and specialty of " . ($studio['name'] ?? $talentCode) . " on AUI.";
                if (!empty($studio['logo'])) {
                    $logo = $studio['logo'];
                    $image = (strpos($logo, 'http') === 0) 
                        ? $logo 
                        : "https://api.auitalent.com/" . ltrim(str_replace('\\', '/', $logo), '/');
                }
            }
        }
    } elseif (strpos($talentCode, '-INST-') !== false) {
        // Institute public profile
        $apiUrl = "https://api.auitalent.com/api/institute-public-profile/talent/" . urlencode($talentCode);
        $json = @file_get_contents($apiUrl, false, $ctx);
        if ($json) {
            $response = json_decode($json, true);
            if (isset($response['ok']) && $response['ok'] && isset($response['data'])) {
                $inst = $response['data'];
                $title = ($inst['name'] ?? $talentCode) . " - Institute Profile";
                $description = !empty($inst['about']) ? $inst['about'] : "Explore courses, partnerships, and workshops conducted by " . ($inst['name'] ?? $talentCode) . " on AUI.";
                if (!empty($inst['logo'])) {
                    $logo = $inst['logo'];
                    $image = (strpos($logo, 'http') === 0) 
                        ? $logo 
                        : "https://api.auitalent.com/" . ltrim(str_replace('\\', '/', $logo), '/');
                }
            }
        }
    } else {
        // Professional public profile
        $apiUrl = "https://api.auitalent.com/api/public-profile/code/" . urlencode($talentCode);
        $json = @file_get_contents($apiUrl, false, $ctx);
        if ($json) {
            $response = json_decode($json, true);
            if (isset($response['ok']) && $response['ok'] && isset($response['data'])) {
                $userData = $response['data'];
                $prof = $userData['professional'] ?? null;
                $pubProfile = $userData['publicProfile'] ?? null;
                
                if ($prof) {
                    $fullName = $prof['fullName'] ?? '';
                    $position = $prof['position'] ?? '';
                    $primarySkill = $prof['primarySkill'] ?? '';
                    $title = $fullName . " - " . $position . " Portfolio";
                    
                    $descText = "";
                    if ($pubProfile && !empty($pubProfile['auiInsight'])) {
                        $descText = $pubProfile['auiInsight'];
                    } else {
                        $descText = "View " . $fullName . "'s professional portfolio on AUI. Specialized in " . $primarySkill . ".";
                    }
                    $description = $descText;

                    $avatar = !empty($prof['avatarUrl']) ? $prof['avatarUrl'] : ($pubProfile['profileImage'] ?? '');
                    if (!empty($avatar)) {
                        $image = (strpos($avatar, 'http') === 0) 
                            ? $avatar 
                            : "https://api.auitalent.com/" . ltrim(str_replace('\\', '/', $avatar), '/');
                    }
                }
            }
        }
    }
}
// 3. Mock Studio Route: /studio/{id}
elseif (preg_match('#^/studio/([a-zA-Z0-9_-]+)/?$#', $path, $matches)) {
    $isMatched = true;
    $studioId = $matches[1];
    
    if ($studioId === 'STU-001') {
        $title = "Mumbai Animation Studio - Studio Showcase";
        $description = "A leading animation studio specializing in high-end character animation and visual effects for global clients. Explore projects and careers.";
        $image = "https://picsum.photos/seed/studio1/400/600";
    } elseif ($studioId === 'STU-002') {
        $title = "VFX Global - Studio Showcase";
        $description = "Providing world-class visual effects services for international feature films and episodic content. Explore projects and careers.";
        $image = "https://picsum.photos/seed/vfx1/400/600";
    }
}

// Serve the static index.html template and inject metadata if matched
$htmlFile = __DIR__ . '/index.html';
if (!file_exists($htmlFile)) {
    http_response_code(500);
    echo "Application template not found.";
    exit;
}
$html = file_get_contents($htmlFile);

if ($isMatched) {
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
    $html = preg_replace('/<meta property="og:type" content=".*?" \/>/i', '<meta property="og:type" content="' . $type . '" />', $html);

    // Replace Twitter tags
    $html = preg_replace('/<meta name="twitter:title" content=".*?" \/>/i', '<meta name="twitter:title" content="' . $safeTitle . '" />', $html);
    $html = preg_replace('/<meta name="twitter:description" content=".*?" \/>/i', '<meta name="twitter:description" content="' . $safeDescription . '" />', $html);

    // Remove existing image tags if any to prevent duplicates, then inject new ones before </head>
    $html = preg_replace('/<meta property="og:image" content=".*?" \/>/i', '', $html);
    $html = preg_replace('/<meta name="twitter:image" content=".*?" \/>/i', '', $html);

    $imageTags = "\n    <meta property=\"og:image\" content=\"" . $safeImage . "\" />" .
                 "\n    <meta name=\"twitter:image\" content=\"" . $safeImage . "\" />";
    $html = str_replace('</head>', $imageTags . "\n  </head>", $html);
}

header('Content-Type: text/html; charset=UTF-8');
echo $html;
?>
