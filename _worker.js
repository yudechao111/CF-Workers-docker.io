// _worker.js 已添加 Docker Hub 认证，解决 Rate limit
const DOCKER_USER = "yudechao222";
const DOCKER_PAT  = "dckr_pat_rO6ZUovfKTURN9DdbXunuHFyQ_Y";

let hub_host = 'registry-1.docker.io';
const auth_url = 'https://auth.docker.io';

let 屏蔽爬虫UA = ['netcraft'];

function routeByHosts(host) {
	const routes = {
		"quay": "quay.io",
		"gcr": "gcr.io",
		"k8s-gcr": "k8s.gcr.io",
		"k8s": "registry.k8s.io",
		"ghcr": "ghcr.io",
		"cloudsmith": "docker.cloudsmith.io",
		"nvcr": "nvcr.io",
		"test": "registry-1.docker.io",
	};
	return host in routes ? [routes[host], false] : [hub_host, true];
}

const PREFLIGHT_INIT = {
	headers: new Headers({
		'access-control-allow-origin': '*',
		'access-control-allow-methods': 'GET,POST,PUT,PATCH,TRACE,DELETE,HEAD,OPTIONS',
		'access-control-max-age': '1728000',
	}),
}

function makeRes(body, status = 200, headers = {}) {
	headers['access-control-allow-origin'] = '*'
	return new Response(body, { status, headers })
}

function newUrl(urlStr, base) {
	try { return new URL(urlStr, base); } catch { return null }
}

async function nginx() {
	return `<!DOCTYPE html>
<html>
<head><title>Welcome to nginx!</title><style>body{width:35em;margin:0 auto;font-family:Tahoma,Verdana,Arial,sans-serif;}</style></head>
<body><h1>Welcome to nginx!</h1><p>If you see this page, the nginx web server is successfully installed and working.</p></body></html>`;
}

async function searchInterface() {
	return `<!DOCTYPE html>
<html>
<head>
    <title>Docker Hub 镜像搜索</title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
    :root{--github-color:#f0f6fc;--githubbj-color:#010409;}
    *{box-sizing:border-box;margin:0;padding:0;}
    body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;display:flex;flex-direction:column;justify-content:center;align-items:center;min-height:100vh;background:linear-gradient(120deg,#1a90ff 0%,#003eb3 100%);padding:20px;}
    .container{text-align:center;width:100%;max-width:800px;padding:0 20px;margin:0 auto;display:flex;flex-direction:column;justify-content:center;min-height:70vh;}
    .github-corner{position:fixed;top:0;right:0;z-index:999;}
    .github-corner svg{fill:var(githubbj-color);color:var(--github-color);position:absolute;top:0;border:0;right:0;width:80px;height:80px;}
    .github-corner:hover .octo-arm{animation:octocat-wave 560ms ease-in-out;}
    @keyframes octocat-wave{0%,100%{transform:rotate(0);}20%,60%{transform:rotate(-25deg);}40%,80%{transform:rotate(10deg);}}
    .logo{margin-bottom:30px;transition:transform 0.3s ease;}
    .title{color:white;font-size:2em;margin-bottom:10px;}
    .subtitle{color:rgba(255,255,255,0.9);font-size:1.1em;margin-bottom:30px;}
    .search-container{display:flex;align-items:stretch;width:100%;max-width:600px;margin:0 auto;height:50px;}
    #search-input{flex:1;padding:0 20px;font-size:16px;border:none;border-radius:8px 0 0 8px;outline:none;height:100%;}
    #search-button{padding:0 25px;background-color:#0066ff;border:none;border-radius:0 8px 8px 0;cursor:pointer;height:100%;display:flex;align-items:center;justify-content:center;}
    #search-button:hover{background-color:#0052cc;transform:translateY(-1px);}
    #search-button svg{width:24px;height:24px;}
    .tips{color:rgba(255,255,255,0.8);margin-top:20px;font-size:0.9em;}
    </style>
</head>
<body>
    <a href="https://github.com/cmliu/CF-Workers-docker.io" target="_blank" class="github-corner">
        <svg viewBox="0 0 250 250"><path d="M0,0 L115,115 L130,115 L142,142 L250,250 L250,0 Z"></path><path d="M128.3,109.0 C113.8,99.7 119.0,89.6 119.0,89.6 C122.0,82.7 120.5,78.6 120.5,78.6 C119.2,72.0 123.4,76.3 123.4,76.3 C127.3,80.9 125.5,87.3 125.5,87.3 C122.9,97.6 130.6,101.9 134.4,103.2" class="octo-arm"></path><path d="M115.0,115.0 C114.9,115.1 118.7,116.5 119.8,115.4 L133.7,101.6 C136.9,99.2 139.9,98.4 142.2,98.6 C133.8,88.0 127.5,74.4 143.8,58.0 C148.5,53.4 154.0,51.2 159.7,51.0 C160.3,49.4 163.2,43.6 171.4,40.1 C171.4,40.1 176.1,42.5 178.8,56.2 C183.1,58.6 187.2,61.8 190.9,65.4 C194.5,69.0 197.7,73.2 200.1,77.6 C213.8,80.2 216.3,84.9 216.3,84.9 C212.7,93.1 206.9,96.0 205.4,96.6 C205.1,102.4 203.0,107.8 198.3,112.5 C181.9,128.9 168.3,122.5 157.7,114.1 C157.9,116.9 156.7,120.9 152.7,124.9 L141.0,136.5 C139.8,137.7 141.6,141.9 141.8,141.8 Z" class="octo-body"></path></svg>
    </a>
    <div class="container">
        <div class="logo">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 18" fill="#ffffff" width="120" height="90">
                <path d="M23.763 6.886c-.065-.053-.673-.512-1.954-.512-.32 0-.659.03-1.01.087-.248-1.703-1.651-2.533-1.716-2.57l-.345-.2-.227.328a4.596 4.596 0 0 0-.611 1.433c-.23.972-.09 1.884.403 2.666-.596.331-1.546.418-1.744.42H.752a.753.753 0 0 0-.75.749c-.007 1.456.233 2.864.692 4.07.545 1.43 1.355 2.483 2.409 3.13 1.181.725 3.104 1.14 5.276 1.14 1.016 0 2.03-.092 2.93-.266 1.417-.273 2.705-.742 3.826-1.391a10.497 10.497 0 0 0 2.61-2.14c1.252-1.42 1.998-3.005 2.553-4.408.075.003.148.005.221.005 1.371 0 2.215-.55 2.68-1.01.505-.5.685-.998.704-1.053L24 7.076l-.237-.19Z"></path>
            </svg>
        </div>
        <h1 class="title">Docker Hub 镜像搜索</h1>
        <p class="subtitle">快速查找、下载和部署 Docker 容器镜像</p>
        <div class="search-container">
            <input type="text" id="search-input" placeholder="输入关键词搜索镜像，如: nginx, mysql, redis...">
            <button id="search-button" title="搜索">
                <svg focusable="false" aria-hidden="true" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 21L16.65 16.65M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                </svg>
            </button>
        </div>
        <p class="tips">提示：按回车键快速搜索</p>
    </div>
    <script>
    function performSearch() {
        const query = document.getElementById('search-input').value;
        if (query) {
            window.location.href = '/search?q=' + encodeURIComponent(query);
        }
    }
    document.getElementById('search-button').addEventListener('click', performSearch);
    document.getElementById('search-input').addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            performSearch();
        }
    });
    </script>
</body>
</html>`;
	return html;
}

export default {
	async fetch(request, env, ctx) {
		// 自动添加 Docker Hub 认证，解决 Rate limit
		const authStr = btoa(`${DOCKER_USER}:${DOCKER_PAT}`);
		request.headers.set('Authorization', `Basic ${authStr}`);

		const getReqHeader = (key) => request.headers.get(key);
		let url = new URL(request.url);
		const userAgentHeader = request.headers.get('User-Agent');
		const userAgent = userAgentHeader ? userAgentHeader.toLowerCase() : "null";
		if (env.UA) 屏蔽爬虫UA = 屏蔽爬虫UA.concat(await ADD(env.UA));
		const workers_url = `https://${url.hostname}`;

		const ns = url.searchParams.get('ns');
		const hostname = url.searchParams.get('hubhost') || url.hostname;
		const hostTop = hostname.split('.')[0];

		let checkHost;
		if (ns) {
			hub_host = ns === 'docker.io' ? 'registry-1.docker.io' : ns;
		} else {
			checkHost = routeByHosts(hostTop);
			hub_host = checkHost[0];
		}

		const fakePage = checkHost ? checkHost[1] : false;
		url.hostname = hub_host;
		const hubParams = ['/v1/search', '/v1/repositories'];

		if (屏蔽爬虫UA.some(fxxk => userAgent.includes(fxxk)) && 屏蔽爬虫UA.length > 0) {
			return new Response(await nginx(), {
				headers: { 'Content-Type': 'text/html; charset=UTF-8' },
			});
		} else if ((userAgent && userAgent.includes('mozilla')) || hubParams.some(param => url.pathname.includes(param))) {
			if (url.pathname == '/') {
				if (env.URL302) {
					return Response.redirect(env.URL302, 302);
				} else if (env.URL) {
					if (env.URL.toLowerCase() == 'nginx') {
						return new Response(await nginx(), {
							headers: { 'Content-Type': 'text/html; charset=UTF-8' },
						});
					} else return fetch(new Request(env.URL, request));
				} else {
					if (fakePage) return new Response(await searchInterface(), {
						headers: { 'Content-Type': 'text/html; charset=UTF-8' },
					});
				}
			} else {
				if (fakePage) url.hostname = 'hub.docker.com';
				if (url.searchParams.get('q')?.includes('library/') && url.searchParams.get('q') != 'library/') {
					const search = url.searchParams.get('q');
					url.searchParams.set('q', search.replace('library/', ''));
				}
				const newRequest = new Request(url, request);
				return fetch(newRequest);
			}
		}

		if (!/%2F/.test(url.search) && /%3A/.test(url.toString())) {
			let modifiedUrl = url.toString().replace(/%3A(?=.*?&)/, '%3Alibrary%2F');
			url = new URL(modifiedUrl);
		}

		if (url.pathname.includes('/token')) {
			let token_parameter = {
				headers: {
					'Host': 'auth.docker.io',
					'User-Agent': getReqHeader("User-Agent"),
					'Accept': getReqHeader("Accept"),
					'Accept-Language': getReqHeader("Accept-Language"),
					'Accept-Encoding': getReqHeader("Accept-Encoding"),
					'Connection': 'keep-alive',
					'Cache-Control': 'max-age=0'
				}
			};
			let token_url = auth_url + url.pathname + url.search;
			return fetch(new Request(token_url, request), token_parameter);
		}

		if (hub_host == 'registry-1.docker.io' && /^\/v2\/[^/]+\/[^/]+\/[^/]+$/.test(url.pathname) && !/^\/v2\/library/.test(url.pathname)) {
			url.pathname = '/v2/library/' + url.pathname.split('/v2/')[1];
		}

		let parameter = {
			headers: {
				'Host': hub_host,
				'User-Agent': getReqHeader("User-Agent"),
				'Accept': getReqHeader("Accept"),
				'Accept-Language': getReqHeader("Accept-Language"),
				'Accept-Encoding': getReqHeader("Accept-Encoding"),
				'Connection': 'keep-alive',
				'Cache-Control': 'max-age=0'
			},
			cacheTtl: 3600
		};

		if (request.headers.has("Authorization")) {
			parameter.headers.Authorization = getReqHeader("Authorization");
		}

		if (request.headers.has("X-Amz-Content-Sha256")) {
			parameter.headers['X-Amz-Content-Sha256'] = getReqHeader("X-Amz-Content-Sha256");
		}

		let original_response = await fetch(new Request(url, request), parameter);
		let response_headers = original_response.headers;
		let new_response_headers = new Headers(response_headers);
		let status = original_response.status;

		if (new_response_headers.get("Www-Authenticate")) {
			let auth = new_response_headers.get("Www-Authenticate");
			let re = new RegExp(auth_url, 'g');
			new_response_headers.set("Www-Authenticate", response_headers.get("Www-Authenticate").replace(re, workers_url));
		}

		if (new_response_headers.get("Location")) {
			const location = new_response_headers.get("Location");
			return httpHandler(request, location, hub_host);
		}

		let response = new Response(original_response.body, {
			status,
			headers: new_response_headers
		});
		return response;
	}
};

function httpHandler(req, pathname, baseHost) {
	const reqHdrRaw = req.headers;
	if (req.method === 'OPTIONS' && reqHdrRaw.has('access-control-request-headers')) {
		return new Response(null, PREFLIGHT_INIT);
	}

	const reqHdrNew = new Headers(reqHdrRaw);
	reqHdrNew.delete("Authorization");
	const urlObj = newUrl(pathname, 'https://' + baseHost);
	const reqInit = { method: req.method, headers: reqHdrNew, redirect: 'follow', body: req.body };
	return proxy(urlObj, reqInit, '');
}

async function proxy(urlObj, reqInit, rawLen) {
	const res = await fetch(urlObj.href, reqInit);
	const resHdrOld = res.headers;
	const resHdrNew = new Headers(resHdrOld);

	if (rawLen) {
		const newLen = resHdrOld.get('content-length') || '';
		const badLen = (rawLen !== newLen);
		if (badLen) return makeRes(res.body, 400, { '--error': `bad len: ${newLen}, except: ${rawLen}` });
	}

	const status = res.status;
	resHdrNew.set('access-control-expose-headers', '*');
	resHdrNew.set('access-control-allow-origin', '*');
	resHdrNew.set('Cache-Control', 'max-age=1500');
	resHdrNew.delete('content-security-policy');
	resHdrNew.delete('content-security-policy-report-only');
	resHdrNew.delete('clear-site-data');

	return new Response(res.body, { status, headers: resHdrNew });
}

async function ADD(envadd) {
	var addtext = envadd.replace(/[	 |"'\r\n]+/g, ',').replace(/,+/g, ',');
	if (addtext.charAt(0) == ',') addtext = addtext.slice(1);
	if (addtext.charAt(addtext.length - 1) == ',') addtext = addtext.slice(0, addtext.length - 1);
	return addtext.split(',');
}
