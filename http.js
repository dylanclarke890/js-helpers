class HttpClient {
  /** @type {string} */
  #baseUrl;
  /** @type {Array<string>} */
  #headers;

  constructor(opts = {}) {
    this.#baseUrl = opts.baseUrl || "";
    this.#headers = opts.headers || {};
  }

  async #fetchJSON(endpoint, opts = {}) {
    const res = await fetch(this.#baseUrl + endpoint, {
      ...opts,
      headers: this.#headers,
    });

    if (!res.ok) throw new Error(res.statusText);
    if (opts.parseResponse !== false && res.status !== 204) return res.json();
    return undefined;
  }

  setHeader(key, value) {
    this.#headers[key] = value;
    return this;
  }

  getHeader(key) {
    return this.#headers[key];
  }

  setBasicAuth(username, password) {
    this.#headers.Authorization = `Basic ${btoa(`${username}:${password}`)}`;
    return this;
  }

  setBearerAuth(token) {
    this.#headers.Authorization = `Bearer ${token}`;
    return this;
  }

  get(endpoint, opts = {}) {
    return this.#fetchJSON(endpoint, {
      ...opts,
      method: "GET",
    });
  }

  post(endpoint, body, opts = {}) {
    return this.#fetchJSON(endpoint, {
      ...opts,
      body: body ? JSON.stringify(body) : undefined,
      method: "POST",
    });
  }

  put(endpoint, body, opts = {}) {
    return this.#fetchJSON(endpoint, {
      ...opts,
      body: body ? JSON.stringify(body) : undefined,
      method: "PUT",
    });
  }

  patch(endpoint, operations, opts = {}) {
    return this.#fetchJSON(endpoint, {
      parseResponse: false,
      ...opts,
      body: JSON.stringify(operations),
      method: "PATCH",
    });
  }

  delete(endpoint, opts = {}) {
    return this.#fetchJSON(endpoint, {
      parseResponse: false,
      ...opts,
      method: "DELETE",
    });
  }
}
