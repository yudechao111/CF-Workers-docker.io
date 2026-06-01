export default {
  async fetch(request, env) {
    // 自动加认证（只从变量读，不写死）
    const user = env.DOCKER_USER || "";
    const pat = env.DOCKER_PAT || "";

    const h = new Headers(request.headers);
    if (user && pat) {
      h.set("Authorization", "Basic " + btoa(user + ":" + pat));
    }

    const url = new URL(request.url);
    url.hostname = "registry-1.docker.io";

    return fetch(new Request(url, {
      method: request.method,
      headers: h,
      body: request.body
    }));
  }
};
