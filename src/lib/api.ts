import type {
  AuthResponse,
  CaloriePayload,
  CalorieResponse,
  LoginPayload,
  RegisterPayload,
} from "@/types";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://xpcc.devb.zeak.io";



let _getToken: (() => string | null) | null = null;

export function registerTokenAccessor(fn: () => string | null) {
  _getToken = fn;
}


// Core fetch wrapper

async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
  withAuth = false
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (withAuth && _getToken) {
    const token = _getToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  });

  // Attach rate-limit headers for callers that care
  const rateLimitHeaders = {
    limit: res.headers.get("RateLimit-Limit"),
    remaining: res.headers.get("RateLimit-Remaining"),
    reset: res.headers.get("RateLimit-Reset"),
  };

  if (!res.ok) {
    let errorBody: { error?: string; message?: string; status_code?: number; retryAfter?: number } = {};
    try {
      errorBody = await res.json();
    } catch {
      // non-JSON error
    }

    const err = new ApiError(
      errorBody.error ?? "Error",
      errorBody.message ?? "An unexpected error occurred.",
      res.status,
      errorBody.retryAfter,
      rateLimitHeaders
    );
    throw err;
  }

  const data = (await res.json()) as T;
  return data;
}


// Typed API error class
export class ApiError extends Error {
  status: number;
  retryAfter?: number;
  rateLimitHeaders: { limit: string | null; remaining: string | null; reset: string | null };

  constructor(
    public errorTitle: string,
    message: string,
    status: number,
    retryAfter?: number,
    rateLimitHeaders = { limit: null, remaining: null, reset: null } as {
      limit: string | null;
      remaining: string | null;
      reset: string | null;
    }
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.retryAfter = retryAfter;
    this.rateLimitHeaders = rateLimitHeaders;
  }
}


// Auth endpoints
export async function registerUser(payload: RegisterPayload): Promise<AuthResponse> {
  return apiFetch<AuthResponse>("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function loginUser(payload: LoginPayload): Promise<AuthResponse> {
  return apiFetch<AuthResponse>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}


// Calorie endpoint
export async function getCalories(payload: CaloriePayload): Promise<CalorieResponse> {
  return apiFetch<CalorieResponse>(
    "/api/get-calories",
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
    true
  );
}
