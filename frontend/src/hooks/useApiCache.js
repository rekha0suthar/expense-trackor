import { useState, useCallback, useRef } from 'react';

export const useApiCache = (initialCache = {}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const cache = useRef(initialCache);
  const pendingRequests = useRef({});

  const fetchData = useCallback(async (url, options = {}) => {
    // Check if there's already a pending request for this URL
    if (pendingRequests.current[url]) {
      return pendingRequests.current[url];
    }

    // Check cache first
    const cacheKey = `${url}-${JSON.stringify(options)}`;
    const cachedData = cache.current[cacheKey];
    const now = Date.now();

    // Return cached data if it's less than 30 seconds old
    if (cachedData && now - cachedData.timestamp < 30000) {
      return cachedData.data;
    }

    try {
      setLoading(true);
      setError(null);

      // Create a promise for this request
      const promise = (async () => {
        try {
          const response = await fetch(url, options);
          if (!response.ok) {
            throw new Error('API request failed');
          }
          const data = await response.json();

          // Cache the result
          cache.current[cacheKey] = {
            data,
            timestamp: Date.now(),
          };

          return data;
        } finally {
          // Clean up pending request
          delete pendingRequests.current[url];
        }
      })();

      // Store the pending request
      pendingRequests.current[url] = promise;
      return await promise;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const invalidateCache = useCallback((url) => {
    Object.keys(cache.current).forEach((key) => {
      if (key.startsWith(url)) {
        delete cache.current[key];
      }
    });
  }, []);

  return { loading, error, fetchData, invalidateCache };
};
