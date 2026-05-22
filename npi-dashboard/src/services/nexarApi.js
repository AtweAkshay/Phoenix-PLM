// src/services/nexarApi.js

const NEXAR_API_URL = 'https://api.nexar.com/graphql';
const NEXAR_AUTH_URL = 'https://identity.nexar.com/connect/token';

const clientId = import.meta.env.VITE_NEXAR_CLIENT_ID;
const clientSecret = import.meta.env.VITE_NEXAR_CLIENT_SECRET;

let accessToken = null;
let tokenExpiration = null;

export async function getAccessToken() {
  if (!clientId || !clientSecret) {
    throw new Error("Nexar API credentials are missing from .env");
  }

  if (accessToken && tokenExpiration && new Date() < tokenExpiration) {
    return accessToken;
  }

  try {
    const params = new URLSearchParams();
    params.append('grant_type', 'client_credentials');
    params.append('client_id', clientId);
    params.append('client_secret', clientSecret);

    const response = await fetch(NEXAR_AUTH_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString()
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch Nexar token: ${response.status}`);
    }

    const data = await response.json();
    accessToken = data.access_token;
    
    const expiresIn = data.expires_in || 86400; 
    tokenExpiration = new Date(new Date().getTime() + (expiresIn - 300) * 1000);
    
    return accessToken;
  } catch (error) {
    console.error("Authentication Error:", error);
    throw error;
  }
}

async function queryNexar(query, variables = {}) {
  const token = await getAccessToken();

  const response = await fetch(NEXAR_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query,
      variables
    })
  });

  if (!response.ok) {
     throw new Error(`Nexar GraphQL Error: ${response.status}`);
  }

  const result = await response.json();
  if (result.errors) {
     console.error("GraphQL Errors:", result.errors);
     return null;
  }
  return result.data;
}

/**
 * Find alternate parts by searching for the component description/keyword.
 */
export async function getAlternateRecommendations(searchQuery) {
  // Strip overly specific terms for better general search. 
  // Doing a generic supply search matching the description to find alternatives.
  const query = `
    query FindAlternates($q: String!) {
      supSearch(q: $q, limit: 3) {
        results {
          part {
            mpn
            manufacturer {
              name
            }
            shortDescription
            medianPrice1000 {
              price
              currency
            }
          }
        }
      }
    }
  `;

  try {
    const data = await queryNexar(query, { q: searchQuery });
    if (data?.supSearch?.results) {
        return data.supSearch.results
            .filter(r => r.part && r.part.medianPrice1000?.price) // Filter parts that actually have a price
            .map(r => ({
                mpn: r.part.mpn,
                manufacturer: r.part.manufacturer?.name || 'Unknown',
                description: r.part.shortDescription || 'No description',
                price: r.part.medianPrice1000.price
            }));
    }
    return [];
  } catch (err) {
    console.error("Failed to fetch recommendations for " + searchQuery, err);
    return [];
  }
}
