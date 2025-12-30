import { projectId, publicAnonKey } from '../../../utils/supabase/info';
import type { Motif } from '../types/motif';

const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-7075da77`;

async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Authorization': `Bearer ${publicAnonKey}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

// Upload image to Supabase Storage
export async function uploadImage(file: File): Promise<{ fileName: string; url: string }> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE_URL}/upload-image`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${publicAnonKey}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || 'Failed to upload image');
  }

  return response.json();
}

// Get all motifs
export async function getMotifs(): Promise<Motif[]> {
  const data = await fetchAPI('/motifs');
  return data.motifs || [];
}

// Get motif by ID
export async function getMotifById(id: string): Promise<Motif> {
  const data = await fetchAPI(`/motifs/${id}`);
  return data.motif;
}

// Create new motif
export async function createMotif(motif: Omit<Motif, 'createdAt'> & { createdAt?: string }): Promise<{ success: boolean; id: string }> {
  return fetchAPI('/motifs', {
    method: 'POST',
    body: JSON.stringify({
      ...motif,
      createdAt: motif.createdAt || new Date().toISOString(),
    }),
  });
}

// Update motif
export async function updateMotif(id: string, motif: Partial<Motif>): Promise<{ success: boolean; id: string }> {
  return fetchAPI(`/motifs/${id}`, {
    method: 'PUT',
    body: JSON.stringify(motif),
  });
}

// Delete motif
export async function deleteMotif(id: string): Promise<{ success: boolean }> {
  return fetchAPI(`/motifs/${id}`, {
    method: 'DELETE',
  });
}

// Get footer data
export async function getFooter(): Promise<any> {
  const data = await fetchAPI('/footer');
  return data.footer;
}

// Update footer
export async function updateFooter(footer: any): Promise<{ success: boolean }> {
  return fetchAPI('/footer', {
    method: 'PUT',
    body: JSON.stringify(footer),
  });
}