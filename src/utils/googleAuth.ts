// Google Identity Services (GIS) & Google OAuth 2.0 Client helper

export interface GoogleUserData {
  email: string;
  name: string;
  picture?: string;
  sub?: string;
}

export function decodeGoogleJwt(token: string): GoogleUserData | null {
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.warn('Google JWT parsing error:', e);
    return null;
  }
}

export const GOOGLE_CLIENT_ID = '362495029435-pmlrfrik7dtngr4haisonq1jthtums2r.apps.googleusercontent.com';

export function getGoogleClientId(): string {
  return (
    (import.meta as any).env?.VITE_GOOGLE_CLIENT_ID ||
    (typeof window !== 'undefined' && (window as any).__GOOGLE_CLIENT_ID__) ||
    GOOGLE_CLIENT_ID
  );
}

export function loadGoogleScript(callback?: () => void) {
  if (typeof window === 'undefined') return;
  if (document.getElementById('google-gsi-client')) {
    if (callback) callback();
    return;
  }

  const script = document.createElement('script');
  script.id = 'google-gsi-client';
  script.src = 'https://accounts.google.com/gsi/client';
  script.async = true;
  script.defer = true;
  script.onload = () => {
    if (callback) callback();
  };
  document.head.appendChild(script);
}

export function initGoogleOneTap(
  clientId: string,
  onSuccess: (userData: GoogleUserData) => void
) {
  if (!clientId) return;
  loadGoogleScript(() => {
    // @ts-ignore
    const google = window.google;
    if (google?.accounts?.id) {
      google.accounts.id.initialize({
        client_id: clientId,
        callback: (response: { credential: string }) => {
          if (response.credential) {
            const user = decodeGoogleJwt(response.credential);
            if (user) {
              onSuccess(user);
            }
          }
        },
        auto_select: false,
        cancel_on_tap_outside: true,
      });

      google.accounts.id.prompt();
    }
  });
}

export function triggerGooglePrompt(
  clientId: string,
  onSuccess: (userData: GoogleUserData) => void
) {
  if (!clientId) return;
  loadGoogleScript(() => {
    // @ts-ignore
    const google = window.google;
    if (google?.accounts?.id) {
      google.accounts.id.initialize({
        client_id: clientId,
        callback: (response: { credential: string }) => {
          if (response.credential) {
            const user = decodeGoogleJwt(response.credential);
            if (user) {
              onSuccess(user);
            }
          }
        },
        auto_select: false,
        cancel_on_tap_outside: true,
      });

      google.accounts.id.prompt();
    }
  });
}

export function renderGoogleButton(
  containerId: string,
  clientId: string,
  onSuccess: (userData: GoogleUserData) => void
) {
  loadGoogleScript(() => {
    // @ts-ignore
    const google = window.google;
    if (google?.accounts?.id) {
      google.accounts.id.initialize({
        client_id: clientId,
        callback: (response: { credential: string }) => {
          if (response.credential) {
            const user = decodeGoogleJwt(response.credential);
            if (user) {
              onSuccess(user);
            }
          }
        },
      });

      const container = document.getElementById(containerId);
      if (container) {
        container.innerHTML = '';
        google.accounts.id.renderButton(container, {
          theme: 'outline',
          size: 'large',
          width: 340,
          text: 'signin_with',
          locale: 'tr',
          shape: 'pill',
        });
      }
    }
  });
}
