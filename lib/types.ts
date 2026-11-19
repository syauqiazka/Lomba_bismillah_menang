/**
 * Standar format respon seragam untuk Server Actions dan Route Handlers.
 * Memenuhi spesifikasi Bagian 5.4 AGENTS.md.
 */

export type ActionSuccess<T> = {
  ok: true;
  data: T;
};

export type ActionFailure = {
  ok: false;
  code:
    | "VALIDATION_ERROR"
    | "UNAUTHORIZED"
    | "FORBIDDEN"
    | "NOT_FOUND"
    | "CONFLICT"
    | "RATE_LIMITED"
    | "SERVER_ERROR";
  message: string;
  fieldErrors?: Record<string, string[]>;
};

export type ActionResponse<T> = ActionSuccess<T> | ActionFailure;
