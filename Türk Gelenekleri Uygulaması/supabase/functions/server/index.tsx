import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "jsr:@supabase/supabase-js@2";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Create Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
);

// Storage bucket name
const BUCKET_NAME = 'make-7075da77-motif-images';

// Initialize storage bucket
async function initializeStorage() {
  try {
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some(bucket => bucket.name === BUCKET_NAME);
    
    if (!bucketExists) {
      await supabase.storage.createBucket(BUCKET_NAME, {
        public: false,
        fileSizeLimit: 5242880, // 5MB
      });
      console.log(`Created storage bucket: ${BUCKET_NAME}`);
    }
  } catch (error) {
    console.error('Error initializing storage:', error);
  }
}

// Initialize on startup
initializeStorage();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-7075da77/health", (c) => {
  return c.json({ status: "ok" });
});

// Upload image endpoint
app.post("/make-server-7075da77/upload-image", async (c) => {
  try {
    const formData = await c.req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return c.json({ error: 'No file provided' }, 400);
    }

    const fileName = `${Date.now()}-${file.name}`;
    const fileBuffer = await file.arrayBuffer();

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(fileName, fileBuffer, {
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      console.error('Error uploading file to storage:', error);
      return c.json({ error: 'Failed to upload file' }, 500);
    }

    // Get signed URL
    const { data: urlData } = await supabase.storage
      .from(BUCKET_NAME)
      .createSignedUrl(fileName, 31536000); // 1 year expiry

    if (!urlData) {
      return c.json({ error: 'Failed to generate URL' }, 500);
    }

    return c.json({
      fileName,
      url: urlData.signedUrl,
    });
  } catch (error) {
    console.error('Error in upload-image endpoint:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Get all motifs
app.get("/make-server-7075da77/motifs", async (c) => {
  try {
    const motifs = await kv.getByPrefix('motif:');
    return c.json({ motifs });
  } catch (error) {
    console.error('Error fetching motifs:', error);
    return c.json({ error: 'Failed to fetch motifs' }, 500);
  }
});

// Get motif by ID
app.get("/make-server-7075da77/motifs/:id", async (c) => {
  try {
    const id = c.req.param('id');
    const motif = await kv.get(`motif:${id}`);
    
    if (!motif) {
      return c.json({ error: 'Motif not found' }, 404);
    }

    return c.json({ motif });
  } catch (error) {
    console.error('Error fetching motif:', error);
    return c.json({ error: 'Failed to fetch motif' }, 500);
  }
});

// Create motif
app.post("/make-server-7075da77/motifs", async (c) => {
  try {
    const body = await c.req.json();
    const { id } = body;
    
    if (!id) {
      return c.json({ error: 'Motif ID is required' }, 400);
    }

    // Store the entire motif object including id
    await kv.set(`motif:${id}`, body);
    return c.json({ success: true, id });
  } catch (error) {
    console.error('Error creating motif:', error);
    return c.json({ error: 'Failed to create motif' }, 500);
  }
});

// Update motif
app.put("/make-server-7075da77/motifs/:id", async (c) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json();
    
    const existing = await kv.get(`motif:${id}`);
    if (!existing) {
      return c.json({ error: 'Motif not found' }, 404);
    }

    await kv.set(`motif:${id}`, body);
    return c.json({ success: true, id });
  } catch (error) {
    console.error('Error updating motif:', error);
    return c.json({ error: 'Failed to update motif' }, 500);
  }
});

// Delete motif
app.delete("/make-server-7075da77/motifs/:id", async (c) => {
  try {
    const id = c.req.param('id');
    
    const existing = await kv.get(`motif:${id}`);
    if (!existing) {
      return c.json({ error: 'Motif not found' }, 404);
    }

    // Delete image from storage if exists
    if (existing.fileName) {
      await supabase.storage
        .from(BUCKET_NAME)
        .remove([existing.fileName]);
    }

    await kv.del(`motif:${id}`);
    return c.json({ success: true });
  } catch (error) {
    console.error('Error deleting motif:', error);
    return c.json({ error: 'Failed to delete motif' }, 500);
  }
});

// Get footer data
app.get("/make-server-7075da77/footer", async (c) => {
  try {
    const footer = await kv.get('footer');
    return c.json({ footer: footer || {} });
  } catch (error) {
    console.error('Error fetching footer:', error);
    return c.json({ error: 'Failed to fetch footer' }, 500);
  }
});

// Update footer data
app.put("/make-server-7075da77/footer", async (c) => {
  try {
    const body = await c.req.json();
    await kv.set('footer', body);
    return c.json({ success: true });
  } catch (error) {
    console.error('Error updating footer:', error);
    return c.json({ error: 'Failed to update footer' }, 500);
  }
});

Deno.serve(app.fetch);