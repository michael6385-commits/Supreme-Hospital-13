<?php
ini_set('pcre.backtrack_limit', '100000000');
ini_set('pcre.recursion_limit', '100000000');
function rewrite_html_links($html) {
    return preg_replace_callback('/<a\b([^>]*)href=["\'](https:\/\/supremehospitals\.in\/([^\'"]*))["\']/i', function($matches) {
        $attrsBefore = $matches[1];
        $fullUrl     = $matches[2];

        $parsed  = parse_url($fullUrl);
        $urlPath = isset($parsed['path']) ? trim($parsed['path'], '/') : '';
        $query   = isset($parsed['query'])    ? '?' . $parsed['query']    : '';
        $fragment= isset($parsed['fragment']) ? '#' . $parsed['fragment'] : '';

        // Skip assets and wp directories
        $pathOnly = explode('?', explode('#', $urlPath)[0])[0];
        $ext = strtolower(pathinfo($pathOnly, PATHINFO_EXTENSION));
        $assetExts = ['css','js','png','jpg','jpeg','gif','svg','ico','webp','woff','woff2','ttf','otf','eot','pdf','mp4','mp3','wav','txt','xml','json','doc','docx','xls','xlsx','ppt','pptx','zip','rar'];
        if (in_array($ext, $assetExts)) return $matches[0];
        if (strpos($urlPath, 'wp-content') !== false || strpos($urlPath, 'wp-includes') !== false) return $matches[0];

        // Mappings of external paths to local pages
        $mappings = [
            ''                         => 'index.html',
            'about-us'                 => 'about-us.html',
            'blogs'                    => 'blog.html',
            'doctors'                  => 'doctors.html',
            'gallery'                  => 'gallery.html',
            'contact-us'               => 'contact-us.html',
            'book-an-appointment'      => 'book-an-appointment.html',
            'feedback-supreme'         => 'feedback.html',
            'cardiology'               => 'cardiology.html',
            'dental'                   => 'dental.html',
            'dermatology'              => 'dermatology.html',
            'diabetology'              => 'diabetology.html',
            'psychiatry'               => 'psychiatry.html',
            'ent'                      => 'ent.html',
            'general-surgery'          => 'general-surgery.html',
            'medical-gastroenterology' => 'medical-gastroenterology.html',
            'nephrology'               => 'nephrology.html',
            'obstetrics-gynaecology'   => 'obstetrics-gynaecology.html',
            'orthopedics'              => 'orthopedics.html',
            'pulmonology'              => 'pulmonology.html',
            'ophthalmology'            => 'ophthalmology.html',
            'paediatrics'              => 'pediatrics.html',
            'pain-palliative-care'     => 'pain-palliative-care.html',
            'general-medicine'         => 'general-medicine.html',
            'urology'                  => 'urology.html',
            'radiology'                => 'radiology.html',
        ];

        if (isset($mappings[$urlPath])) {
            $localUrl = $mappings[$urlPath] . $query . $fragment;
            return '<a' . $attrsBefore . 'href="javascript:window.parent.location.href=\'' . $localUrl . '\';"';
        }

        // Default: proxy blog posts through blog.html?url=
        $localUrl = 'blog.html?url=' . urlencode($fullUrl);
        return '<a' . $attrsBefore . 'href="javascript:window.parent.location.href=\'' . $localUrl . '\';"';
    }, $html);
}

function rewrite_links_recursive($data) {
    if (is_string($data)) {
        return rewrite_html_links($data);
    }
    if (is_array($data)) {
        foreach ($data as $key => $value) {
            $data[$key] = rewrite_links_recursive($value);
        }
    }
    return $data;
}

// Handle AJAX proxy request
if (isset($_GET['ajax_proxy'])) {
    $targetUrl = 'https://supremehospitals.in/wp-admin/admin-ajax.php';
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $targetUrl);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    
    if (isset($_SERVER['HTTP_USER_AGENT'])) {
        curl_setopt($ch, CURLOPT_USERAGENT, $_SERVER['HTTP_USER_AGENT']);
    } else {
        curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)');
    }
    
    // Forward POST method and fields
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        curl_setopt($ch, CURLOPT_POST, 1);
        $postData = file_get_contents('php://input');
        if (empty($postData) && !empty($_POST)) {
            $postData = http_build_query($_POST);
        }
        curl_setopt($ch, CURLOPT_POSTFIELDS, $postData);
    } else {
        $queryString = $_SERVER['QUERY_STRING'] ?? '';
        $queryParams = [];
        parse_str($queryString, $queryParams);
        unset($queryParams['ajax_proxy']);
        $newQueryString = http_build_query($queryParams);
        if (!empty($newQueryString)) {
            curl_setopt($ch, CURLOPT_URL, $targetUrl . '?' . $newQueryString);
        }
    }
    
    // Forward request headers
    $headers = [];
    if (isset($_SERVER['CONTENT_TYPE'])) {
        $headers[] = 'Content-Type: ' . $_SERVER['CONTENT_TYPE'];
    }
    if (isset($_SERVER['HTTP_X_REQUESTED_WITH'])) {
        $headers[] = 'X-Requested-With: ' . $_SERVER['HTTP_X_REQUESTED_WITH'];
    }
    if (!empty($headers)) {
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    }
    
    $response = curl_exec($ch);
    $contentType = curl_getinfo($ch, CURLINFO_CONTENT_TYPE);
    curl_close($ch);
    
    if ($contentType) {
        header('Content-Type: ' . $contentType);
    }
    
    if ($response !== false) {
        $decoded = json_decode($response, true);
        if (json_last_error() === JSON_ERROR_NONE) {
            $rewritten = rewrite_links_recursive($decoded);
            echo json_encode($rewritten, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        } else {
            echo rewrite_html_links($response);
        }
    }
    exit;
}

$url = isset($_GET['url']) ? $_GET['url'] : 'https://supremehospitals.in/blogs/';

// If loading the default blogs page, forward any query parameters (like pagination or search) from the parent window
if (!isset($_GET['url'])) {
    $queryString = isset($_SERVER['QUERY_STRING']) ? $_SERVER['QUERY_STRING'] : '';
    if (!empty($queryString)) {
        $url .= (strpos($url, '?') === false ? '?' : '&') . $queryString;
    }
}

// Validate URL
if (strpos($url, 'supremehospitals.in') === false) {
    die("Invalid URL");
}

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)');
$html = curl_exec($ch);
if ($html === false) {
    die("Curl error: " . curl_error($ch));
}
curl_close($ch);

// Rewrite internal links
$html = rewrite_html_links($html);

// Disable AJAX pagination of Content Views to enforce standard URL queries
$html = str_replace('pt-cv-ajax', 'pt-cv-no-ajax', $html);

// Proxy AJAX requests to admin-ajax.php to avoid CORS errors
$html = str_replace('https://supremehospitals.in/wp-admin/admin-ajax.php', 'blog-proxy.php?ajax_proxy=1', $html);
$html = str_replace('https:\/\/supremehospitals.in\/wp-admin\/admin-ajax.php', 'blog-proxy.php?ajax_proxy=1', $html);

// Inject base tag + CSS to hide header, footer, chatbot widgets
$injectHead = '<base href="https://supremehospitals.in/">'
    . '<style>'
    . 'header, footer, [data-elementor-type="header"], [data-elementor-type="footer"], '
    . '.elementor-location-header, .elementor-location-footer, .elementor-header, .elementor-footer, '
    . '.elementor-11958, #mega-menu-wrap-primary, .mega-menu-wrap, '
    . '#masthead, .site-header, .site-footer, '
    . '#ast-desktop-header, #ast-mobile-header, .ast-mobile-header-wrap, '
    . '.site-primary-footer-wrap, .site-below-footer-wrap, .site-above-footer-wrap, '
    . '[role="banner"], [role="contentinfo"], '
    . '#openModalBtn, #myModal, .chaty-widget, .chaty-widget-is-active, #wpadminbar '
    . '{ display: none !important; height: 0 !important; min-height: 0 !important; '
    . 'padding: 0 !important; margin: 0 !important; visibility: hidden !important; '
    . 'opacity: 0 !important; pointer-events: none !important; } '
    . '.pt-cv-pagination-wrapper, .pt-cv-pagination, .pagination '
    . '{ display: flex !important; visibility: visible !important; opacity: 1 !important; '
    . 'height: auto !important; min-height: auto !important; } '
    . 'body, html { margin-top: 0 !important; padding-top: 0 !important; }'
    . '</style>';

if (stripos($html, '</head>') !== false) {
    $html = str_ireplace('</head>', $injectHead . "\n" . '</head>', $html);
} elseif (stripos($html, '</title>') !== false) {
    $html = str_ireplace('</title>', '</title>' . "\n" . $injectHead, $html);
} elseif (stripos($html, '<head>') !== false) {
    $html = str_ireplace('<head>', '<head>' . "\n" . $injectHead, $html);
} elseif (stripos($html, '<body>') !== false) {
    $html = str_ireplace('<body>', '<body>' . "\n" . $injectHead, $html);
}

// Iframe auto-resizer — only reports height when content actually changes
$resizeScript = "
<script>
// Remove header, footer, and widgets from the DOM immediately
function removeUnwantedElements() {
    var selectors = [
        'header', '[data-elementor-type=\"header\"]', '.elementor-location-header', 
        '.elementor-11958', '#mega-menu-wrap-primary', '.mega-menu-wrap', 
        '.elementor-element-4eea41d', '.elementor-element-7c6556f',
        'footer', '[data-elementor-type=\"footer\"]', '.elementor-location-footer',
        '.chaty-widget', '.chaty-widget-is-active', '#wpadminbar'
    ];
    selectors.forEach(function(sel) {
        var elms = document.querySelectorAll(sel);
        elms.forEach(function(el) {
            el.style.display = 'none'; // hide immediately
            el.remove(); // remove from DOM
        });
    });
}
// Run immediately and also on DOMContentLoaded / load
removeUnwantedElements();
document.addEventListener('DOMContentLoaded', removeUnwantedElements);
window.addEventListener('load', removeUnwantedElements);

var _lastH = 0;
function sendHeight() {
    var h = Math.max(
        document.body ? document.body.scrollHeight : 0,
        document.documentElement ? document.documentElement.scrollHeight : 0,
        document.body ? document.body.offsetHeight : 0,
        document.documentElement ? document.documentElement.offsetHeight : 0
    ) + 30;
    if (Math.abs(h - _lastH) > 30) {
        _lastH = h;
        window.parent.postMessage({ type: 'resize', height: h }, '*');
    }
}
window.addEventListener('load', sendHeight);
setTimeout(sendHeight, 800);
if (window.MutationObserver) {
    new MutationObserver(function() {
        removeUnwantedElements(); // run again if elements are dynamically injected or modified
        clearTimeout(window._rTimer);
        window._rTimer = setTimeout(sendHeight, 400);
    }).observe(document.body, { childList: true, subtree: true });
}

</script>
</body>";



$html = str_replace('</body>', $resizeScript, $html);

echo $html;
?>
