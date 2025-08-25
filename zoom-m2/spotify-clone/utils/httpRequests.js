const API_URL = "https://spotify.f8team.dev/api";

const send = async (path, body, method, options) => {
  const url = `${API_URL}${path}`;
  const res = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    ...options,
  });

  const data = await res.json();
  return data;
};

const get = (path, body = null, method = "GET", options) => {
  return send(path, body, method, options);
};

const post = (path, body, method = "POST", options) => {
  return send(path, body, method, options);
};

const put = (path, body, method = "PUT", options) => {
  return send(path, body, method, options);
};

const patch = (path, body, method = "PATCH", options) => {
  return send(path, body, method, options);
};

const del = (path, body = null, method = "DELETE", options) => {
  return send(path, body, method, options);
};

export default {
  get,
  post,
  put,
  patch,
  del,
};
