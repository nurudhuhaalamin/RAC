/// <reference types="astro/client" />

type KVNamespace = import('@cloudflare/workers-types').KVNamespace;
type D1Database = import('@cloudflare/workers-types').D1Database;
type R2Bucket = import('@cloudflare/workers-types').R2Bucket;

type ENV = {
  DB: D1Database;
  CACHE: KVNamespace;
  MEDIA: R2Bucket;
  TURNSTILE_SECRET_KEY: string;
  RESEND_API_KEY: string;
  IP_HASH_SALT: string;
  PUBLIC_SITE_NAME: string;
};

type Runtime = import('@astrojs/cloudflare').Runtime<ENV>;

declare namespace App {
  interface Locals extends Runtime {}
}
